/* 语法训练模块：从题库中取"已核实（verified）"题目组卷。
 * 初始发布时全部语法题位于待审核区（课程归属未核实），
 * 因此正式训练可能显示"当前已验证题目数量不足"——这是有意的诚实行为。 */
window.MJT = window.MJT || {};

MJT.grammar = (function () {

  function pool(settings) {
    var reviewDecisions = MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {});
    var items = (MJT_DATA.pendingGrammar || []).concat(MJT.app.importedItems('grammar'));
    var res = MJT.scope.filter(items, {
      maxLesson: settings.maxLesson,
      mode: 'textbook',
      reviewDecisions: reviewDecisions
    });
    return res.allowed;
  }

  /* 全部语法题（含待审核），供审核工作台使用 */
  function allItems() {
    return (MJT_DATA.pendingGrammar || []).concat(MJT.app.importedItems('grammar'));
  }

  function startSession(container, opts) {
    var settings = MJT.app.getSettings();
    var questions = MJT.random.shuffle(pool(settings));
    var difficulty = (opts && opts.difficulty) || 1;
    MJT.session.start(container, {
      module: 'grammar',
      difficulty: difficulty,
      count: Math.min(settings.questionCount, questions.length) || settings.questionCount,
      getNext: function (i) { return questions[i] || null; }
    });
  }

  return { pool: pool, allItems: allItems, startSession: startSession };
})();
