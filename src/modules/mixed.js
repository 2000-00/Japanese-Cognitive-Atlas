/* 综合训练：围绕场景混合多任务
 * 每组混合：场景数字听力（L3-L4）＋ verified 语法/听力/阅读题。
 * 错题类别按自适应权重提升出现概率（生成新情景，不重复原题）。 */
window.MJT = window.MJT || {};

MJT.mixed = (function () {

  function startSession(container, opts) {
    opts = opts || {};
    var settings = MJT.app.getSettings();
    var difficulty = opts.difficulty || settings.difficulty || 1;
    var bank = [];
    bank = bank.concat(MJT.grammar.pool(settings));
    bank = bank.concat(MJT.listening.pool(settings));
    MJT.reading.pool(settings).forEach(function (p) { bank = bank.concat(MJT.reading.flatten(p)); });
    bank = MJT.random.shuffle(bank);
    var bankIdx = 0;
    var level = difficulty >= 3 ? 4 : 3;
    MJT.session.start(container, {
      module: 'mixed',
      difficulty: difficulty,
      count: settings.questionCount,
      getNext: function () {
        // 40% 题库题（语法/听力/阅读，已核实的），60% 场景数字（按弱点权重）
        if (bankIdx < bank.length && Math.random() < 0.4) return bank[bankIdx++];
        return MJT.scenarioNumbers.generate('mixed', level, { minLevel: 2 });
      },
      onRestart: function (plan) { startSession(container, { difficulty: plan.difficulty }); }
    });
  }

  return { startSession: startSession };
})();
