/* 错题本 */
window.MJT = window.MJT || {};

MJT.errorbook = (function () {
  var SLOW_THRESHOLD_MS = 10000; // 超过10秒视为"反应时间过长"

  function all() {
    return MJT.storage.load(MJT.storage.KEYS.wrongAnswers, []);
  }

  function saveAll(list) {
    MJT.storage.save(MJT.storage.KEYS.wrongAnswers, list);
  }

  /* 根据题目与作答情况自动分类错误类型 */
  function classifyError(question, userAnswer, responseTime, correct) {
    if (correct && responseTime > SLOW_THRESHOLD_MS) return '反应时间过长';
    var cat = question.numberCategory;
    if (cat === 'time' || cat === 'duration') return '时间识别错误';
    if (cat === 'date') return '日期识别错误';
    if (cat === 'counter') return '数量词错误';
    if (cat === 'price') return '金额识别错误';
    if (cat === 'basic' || cat === 'phone') return '数字识别错误';
    var t = question.type || '';
    if (t.indexOf('verb') !== -1) return '动词变形错误';
    if (t.indexOf('particle') !== -1) return '助词错误';
    if (t.indexOf('listen') !== -1 || question.audioScript) return '听音错误';
    if (t.indexOf('reading') !== -1 || question.textJa) return '阅读定位错误';
    return '未掌握知识点';
  }

  /* 记录一次错误（或超慢的正确作答） */
  function record(question, userAnswer, responseTime, correct) {
    if (correct && responseTime <= SLOW_THRESHOLD_MS) return null;
    var list = all();
    var errorType = classifyError(question, userAnswer, responseTime, correct);
    var existing = null;
    for (var i = 0; i < list.length; i++) {
      if (list[i].questionId === question.id) { existing = list[i]; break; }
    }
    var now = new Date().toISOString();
    if (existing) {
      existing.errorCount++;
      existing.userAnswer = String(userAnswer);
      existing.errorType = errorType;
      existing.responseTime = responseTime;
      existing.lastPracticedAt = now;
      existing.masteryStatus = 'weak';
    } else {
      list.push({
        questionId: question.id,
        questionType: question.type || question.numberCategory || 'unknown',
        questionText: question.question || question.scriptJa || '',
        numberCategory: question.numberCategory || null,
        userAnswer: String(userAnswer),
        correctAnswer: String(question.answer),
        lesson: question.lesson || [],
        knowledgePoints: question.grammarPoints || question.knowledgePoints || [],
        knowledgeMap: question.knowledgeMap || [],
        errorType: errorType,
        responseTime: responseTime,
        errorCount: 1,
        firstAt: now,
        lastPracticedAt: now,
        masteryStatus: 'weak'
      });
    }
    saveAll(list);
    return errorType;
  }

  /* 复习答对一次后更新掌握状态：weak → improving → mastered */
  function markPracticed(questionId, correct) {
    var list = all();
    for (var i = 0; i < list.length; i++) {
      if (list[i].questionId !== questionId) continue;
      list[i].lastPracticedAt = new Date().toISOString();
      if (correct) {
        if (list[i].masteryStatus === 'weak') list[i].masteryStatus = 'improving';
        else if (list[i].masteryStatus === 'improving') list[i].masteryStatus = 'mastered';
      } else {
        list[i].masteryStatus = 'weak';
        list[i].errorCount++;
      }
      break;
    }
    saveAll(list);
  }

  function removeEntry(questionId) {
    saveAll(all().filter(function (e) { return e.questionId !== questionId; }));
  }

  function clear() { saveAll([]); }

  /* 各数字类别 / 错误类型的薄弱统计，供自适应引擎使用 */
  function weaknessByCategory() {
    var map = {};
    all().forEach(function (e) {
      if (e.masteryStatus === 'mastered') return;
      var key = e.numberCategory || e.errorType;
      map[key] = (map[key] || 0) + e.errorCount;
    });
    return map;
  }

  return {
    SLOW_THRESHOLD_MS: SLOW_THRESHOLD_MS,
    all: all,
    record: record,
    classifyError: classifyError,
    markPracticed: markPracticed,
    removeEntry: removeEntry,
    clear: clear,
    weaknessByCategory: weaknessByCategory
  };
})();
