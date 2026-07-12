/* 综合训练：混合 verified 语法/听力/阅读题与数字反应题。
 * 错题优先：围绕错题相关类别按自适应权重生成新情景（不是重复原题）。 */
window.MJT = window.MJT || {};

MJT.mixed = (function () {

  function startSession(container, opts) {
    opts = opts || {};
    var settings = MJT.app.getSettings();
    var difficulty = opts.difficulty || 1;
    var bank = [];
    bank = bank.concat(MJT.grammar.pool(settings));
    bank = bank.concat(MJT.listening.pool(settings));
    MJT.reading.pool(settings).forEach(function (p) { bank = bank.concat(MJT.reading.flatten(p)); });
    bank = MJT.random.shuffle(bank);
    var bankIdx = 0;
    MJT.session.start(container, {
      module: 'mixed',
      difficulty: difficulty,
      count: settings.questionCount,
      getNext: function () {
        // 60% 数字反应（按自适应权重），40% 题库题；题库耗尽则全部数字
        if (bankIdx < bank.length && Math.random() < 0.4) return bank[bankIdx++];
        return MJT.numbers.generate('mixed', difficulty);
      }
    });
  }

  return { startSession: startSession };
})();
