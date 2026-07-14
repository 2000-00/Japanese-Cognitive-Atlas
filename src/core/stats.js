/* 学习统计：反应时间与正确率记录 */
window.MJT = window.MJT || {};

MJT.stats = (function () {

  function allRecords() {
    return MJT.storage.load(MJT.storage.KEYS.responseTimes, []);
  }

  /* 记录一次作答：{questionId, module, category, correct, responseTime, startTime, answerTime} */
  function record(entry) {
    var list = allRecords();
    list.push({
      questionId: entry.questionId,
      module: entry.module || 'unknown',       // numbers / grammar / listening / reading / mixed / scenario
      category: entry.category || null,        // time / date / counter / price / basic / phone / duration
      scenarioId: entry.scenarioId || null,    // 场景/框架ID（跨场景统计用）
      level: entry.level || null,              // 听力等级
      warmup: !!entry.warmup,                  // 是否基础热身（孤立数字题）
      interaction: entry.interaction || null,  // choose / respond / input
      conjForm: entry.conjForm || null,        // 变形训练：目标变形（自适应权重用）
      qtype: entry.qtype || null,              // 题型
      questionText: entry.questionText || '',
      correct: !!entry.correct,
      startTime: entry.startTime,
      answerTime: entry.answerTime,
      responseTime: entry.responseTime,
      at: new Date().toISOString()
    });
    // 上限1万条，防止 localStorage 溢出
    if (list.length > 10000) list = list.slice(list.length - 10000);
    MJT.storage.save(MJT.storage.KEYS.responseTimes, list);
  }

  function isToday(iso) {
    var d = new Date(iso), n = new Date();
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
  }

  function summarize(records) {
    var total = records.length, correct = 0, sumRt = 0;
    var fastest = null, slowest = null;
    records.forEach(function (r) {
      if (r.correct) correct++;
      sumRt += r.responseTime;
      if (!fastest || r.responseTime < fastest.responseTime) fastest = r;
      if (!slowest || r.responseTime > slowest.responseTime) slowest = r;
    });
    return {
      total: total,
      correct: correct,
      accuracy: total ? correct / total : null,
      avgResponseMs: total ? Math.round(sumRt / total) : null,
      fastest: fastest,
      slowest: slowest
    };
  }

  function groupBy(records, keyFn) {
    var groups = {};
    records.forEach(function (r) {
      var k = keyFn(r);
      if (k === null || k === undefined) return;
      (groups[k] = groups[k] || []).push(r);
    });
    var out = {};
    Object.keys(groups).forEach(function (k) { out[k] = summarize(groups[k]); });
    return out;
  }

  /* 连续正确/错误（按时间序） */
  function streaks(records) {
    var curCorrect = 0, curWrong = 0, maxCorrect = 0, maxWrong = 0;
    records.forEach(function (r) {
      if (r.correct) {
        curCorrect++; curWrong = 0;
        if (curCorrect > maxCorrect) maxCorrect = curCorrect;
      } else {
        curWrong++; curCorrect = 0;
        if (curWrong > maxWrong) maxWrong = curWrong;
      }
    });
    return { currentCorrect: curCorrect, currentWrong: curWrong, maxCorrect: maxCorrect, maxWrong: maxWrong };
  }

  function overview() {
    var records = allRecords();
    var today = records.filter(function (r) { return isToday(r.at); });
    return {
      all: summarize(records),
      today: summarize(today),
      byModule: groupBy(records, function (r) { return r.module; }),
      byCategory: groupBy(records, function (r) { return r.category; }),
      streaks: streaks(records),
      recordCount: records.length
    };
  }

  /* 最需要加强的项目：按（错误率×次数权重 + 慢速惩罚）排序取前 n */
  function weakestAreas(n) {
    var byCat = groupBy(allRecords(), function (r) { return r.category || r.module; });
    var scored = Object.keys(byCat).map(function (k) {
      var s = byCat[k];
      if (s.total < 3) return null; // 样本太少不评
      var errorScore = (1 - s.accuracy);
      var slowScore = s.avgResponseMs > 8000 ? 0.3 : (s.avgResponseMs > 5000 ? 0.15 : 0);
      return { key: k, score: errorScore + slowScore, stats: s };
    }).filter(Boolean);
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, n || 3);
  }

  function clear() { MJT.storage.save(MJT.storage.KEYS.responseTimes, []); }

  return {
    record: record,
    allRecords: allRecords,
    summarize: summarize,
    overview: overview,
    weakestAreas: weakestAreas,
    streaks: streaks,
    clear: clear
  };
})();
