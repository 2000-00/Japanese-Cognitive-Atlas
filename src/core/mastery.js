/* 跨场景掌握模型
 *
 * 规则（与需求一一对应）：
 *  - 同一知识点只在一个场景答对，不判定为掌握。
 *  - 同一知识点至少在 4 个不同场景/语境中表现稳定（各语境最近一次
 *    作答为正确），才标记为 mastered。
 *  - 任一语境最近一次答错 → 该知识点回到 weak。
 * 数据保存在 localStorage 的 mastery-map 键。 */
window.MJT = window.MJT || {};

MJT.mastery = (function () {
  var CONTEXTS_REQUIRED = 4; // 稳定语境数阈值，可调

  function load() { return MJT.storage.load(MJT.storage.KEYS.masteryMap, {}); }
  function save(m) { MJT.storage.save(MJT.storage.KEYS.masteryMap, m); }

  /* 记录一次作答：point=知识点（语法点/数字类别），contextId=场景/框架ID */
  function record(point, contextId, correct) {
    if (!point || !contextId) return;
    var m = load();
    var p = m[point] = m[point] || { contexts: {} };
    var c = p.contexts[contextId] = p.contexts[contextId] || { correct: 0, wrong: 0 };
    if (correct) c.correct++; else c.wrong++;
    c.lastCorrect = !!correct;
    c.at = new Date().toISOString();
    p.status = computeStatus(p);
    save(m);
  }

  function computeStatus(p) {
    var stable = 0, anyWrongRecent = false, total = 0;
    Object.keys(p.contexts).forEach(function (k) {
      var c = p.contexts[k];
      total++;
      if (c.lastCorrect && c.correct >= 1) stable++;
      if (!c.lastCorrect) anyWrongRecent = true;
    });
    if (anyWrongRecent) return 'weak';
    if (stable >= CONTEXTS_REQUIRED) return 'mastered';
    if (stable >= 1) return 'learning'; // 已有正确表现但语境数不足
    return 'weak';
  }

  /* 供统计页使用 */
  function summary() {
    var m = load();
    var mastered = [], learning = [], weak = [];
    Object.keys(m).forEach(function (point) {
      var p = m[point];
      var ctxCount = Object.keys(p.contexts).length;
      var entry = { point: point, contexts: ctxCount, status: p.status };
      if (p.status === 'mastered') mastered.push(entry);
      else if (p.status === 'learning') learning.push(entry);
      else weak.push(entry);
    });
    return { mastered: mastered, learning: learning, weak: weak };
  }

  /* 会话钩子：从题目对象提取知识点与语境并记录 */
  function recordFromQuestion(q, correct) {
    var ctx = q.scenarioId || q.frameId || q.sceneName || (q.module + ':generic');
    (q.grammarPoints || []).forEach(function (gp) { record(gp, ctx, correct); });
    if (q.numberCategory) record('数字:' + q.numberCategory, ctx, correct);
  }

  return {
    CONTEXTS_REQUIRED: CONTEXTS_REQUIRED,
    record: record,
    recordFromQuestion: recordFromQuestion,
    summary: summary
  };
})();
