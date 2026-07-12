/* 听力训练模块：verified 听力题 + 数字听写（通用读法，始终可用）。
 * 听力原文在作答后才显示（session 引擎保证）。 */
window.MJT = window.MJT || {};

MJT.listening = (function () {

  function pool(settings) {
    var reviewDecisions = MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {});
    return MJT.scope.filter(MJT_DATA.pendingListening || [], {
      maxLesson: settings.maxLesson,
      mode: 'textbook',
      reviewDecisions: reviewDecisions
    }).allowed;
  }

  function startSession(container, opts) {
    opts = opts || {};
    var settings = MJT.app.getSettings();
    var bank = MJT.random.shuffle(pool(settings));
    var difficulty = opts.difficulty || 1;
    var includeNumberDictation = opts.includeNumberDictation !== false;
    MJT.session.start(container, {
      module: 'listening',
      difficulty: difficulty,
      count: settings.questionCount,
      getNext: function (i) {
        if (i < bank.length) return bank[i];
        // 题库不足时用数字听写（通用读法、verified）补足，明确属于听力训练的"数字听写"题型
        if (includeNumberDictation) return MJT.numbers.generate('mixed', difficulty);
        return null;
      }
    });
  }

  return { pool: pool, startSession: startSession };
})();
