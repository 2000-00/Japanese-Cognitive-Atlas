/* 听力训练模块 —— 六级等级系统
 *
 * Level 1 基础热身：孤立数字/时间/金额/数量词（沿用 numbers.js 生成器）。
 *          在正式训练中占比不得超过 5%（由组卷器强制，validator/测试校验）。
 * Level 2 带单位短句：数字进入完整表达（框架引擎，单信息）。
 * Level 3 单场景单句信息提取（框架引擎）。——默认等级
 * Level 4 双信息场景（框架引擎，≥2 信息点）。
 * Level 5 短对话（2～4轮，题库，需审核通过）。
 * Level 6 完整情景（4～8轮连续对话 = 场景训练，见场景页）。
 *
 * 原文在作答后才显示（session 引擎保证）。 */
window.MJT = window.MJT || {};

MJT.listening = (function () {

  var DEFAULT_LEVEL = 3;
  var WARMUP_RATIO = 0.05; // Level 1 在正式训练中的最大占比

  /* 题库类听力（含 L5 对话），只取已核实（verified）的 */
  function pool(settings, level) {
    var reviewDecisions = MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {});
    var items = (MJT_DATA.pendingListening || []).concat(MJT.app.importedItems('listening'));
    return MJT.scope.filter(items, {
      maxLesson: settings.maxLesson,
      mode: 'textbook',
      reviewDecisions: reviewDecisions
    }).allowed.filter(function (q) {
      if (!level) return true;
      return (q.level || 3) === level;
    });
  }

  /* 组卷器：给定目标等级返回 getNext。
   * L1 明确标记为基础热身；正式模式下 L1 比例 ≤ 5%。 */
  function buildGetNext(level, settings, opts) {
    opts = opts || {};
    var bank = MJT.random.shuffle(pool(settings, level >= 5 ? level : null));
    var bankIdx = 0;
    var warmupBudget = opts.warmupOnly ? Infinity : Math.floor((opts.count || settings.questionCount) * WARMUP_RATIO);
    var warmupUsed = 0;

    return function (i) {
      if (opts.warmupOnly) {
        // 基础热身入口：允许全部 L1 孤立题，明确标注
        var q0 = MJT.numbers.generate('mixed', Math.min(3, Math.max(1, level)));
        if (q0) { q0.level = 1; q0.warmup = true; q0.question = '【基础热身】' + q0.question; }
        return q0;
      }
      if (level >= 5) {
        return bank[i] || null; // L5：对话题库（不足时如实返回 null → 显示数量不足）
      }
      // L2-L4：框架引擎为主；偶尔（不超过5%配额）插入一道 L1 热身
      if (warmupUsed < warmupBudget && Math.random() < WARMUP_RATIO) {
        warmupUsed++;
        var w = MJT.numbers.generate('mixed', 1);
        if (w) { w.level = 1; w.warmup = true; w.question = '【基础热身】' + w.question; return w; }
      }
      var q = MJT.scenarioNumbers.generate(opts.category || 'mixed', level, { minLevel: Math.max(2, level - 1) });
      return q;
    };
  }

  function startSession(container, opts) {
    opts = opts || {};
    var settings = MJT.app.getSettings();
    var level = opts.level || DEFAULT_LEVEL;
    MJT.session.start(container, {
      module: 'listening',
      categoryId: opts.category || 'mixed',
      level: level,
      difficulty: level >= 4 ? 3 : (level === 3 ? 2 : 1),
      count: opts.count || settings.questionCount,
      getNext: buildGetNext(level, settings, opts),
      onRestart: function () { startSession(container, opts); }
    });
  }

  return {
    DEFAULT_LEVEL: DEFAULT_LEVEL,
    WARMUP_RATIO: WARMUP_RATIO,
    pool: pool,
    buildGetNext: buildGetNext,
    startSession: startSession
  };
})();
