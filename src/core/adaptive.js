/* 自适应训练引擎
 *
 * 全部权重规则集中在本文件，写成独立、可单测、可修改的纯函数。
 * 规则（与需求一一对应）：
 *  - 正确率 < 60%           → 增加基础题（难度降）
 *  - 正确率 60%~80%         → 增加同类变式题（难度持平）
 *  - 正确率 > 80%           → 增加综合题（难度升）
 *  - 正确率高但平均反应时间长 → 速度强化模式
 *  - 连续答错 3 次           → 显示详细解析并降低一个难度等级
 *  - 连续答对 5 次           → 逐渐增加信息量
 *  - 某数字类别错误率偏高     → 提高该类别出题权重
 *  - 某课程错误较多          → 建议回到对应课程复习
 */
window.MJT = window.MJT || {};

MJT.adaptive = (function () {

  var RULES = {
    lowAccuracy: 0.60,
    midAccuracy: 0.80,
    slowAvgMs: 6000,        // 高正确率但平均超过6秒 → 速度强化
    wrongStreakDemote: 3,   // 连续错3题降难度
    correctStreakPromote: 5 // 连续对5题增加信息量
  };

  /* 难度调整：输入当前难度(1-3)与本组会话摘要，输出下一组难度与理由 */
  function nextDifficulty(currentDifficulty, summary, streaks) {
    var d = currentDifficulty || 1;
    var reasons = [];
    if (streaks && streaks.currentWrong >= RULES.wrongStreakDemote) {
      d = Math.max(1, d - 1);
      reasons.push('连续答错' + streaks.currentWrong + '题，降低一个难度等级并显示详细解析');
      return { difficulty: d, mode: 'remedial', reasons: reasons };
    }
    if (summary && summary.total >= 5 && summary.accuracy !== null) {
      if (summary.accuracy < RULES.lowAccuracy) {
        d = Math.max(1, d - 1);
        reasons.push('正确率 ' + Math.round(summary.accuracy * 100) + '% 低于60%，增加基础题');
        return { difficulty: d, mode: 'basic', reasons: reasons };
      }
      if (summary.accuracy <= RULES.midAccuracy) {
        reasons.push('正确率 ' + Math.round(summary.accuracy * 100) + '% 在60%~80%，继续同类变式题');
        return { difficulty: d, mode: 'variation', reasons: reasons };
      }
      // > 80%
      if (summary.avgResponseMs > RULES.slowAvgMs) {
        reasons.push('正确率高但平均反应 ' + (summary.avgResponseMs / 1000).toFixed(1) + 's 偏慢，进入速度强化');
        return { difficulty: d, mode: 'speed', reasons: reasons };
      }
      d = Math.min(3, d + 1);
      reasons.push('正确率 ' + Math.round(summary.accuracy * 100) + '% 高于80%，增加综合题');
      if (streaks && streaks.currentCorrect >= RULES.correctStreakPromote) {
        reasons.push('连续答对' + streaks.currentCorrect + '题，逐渐增加信息量');
      }
      return { difficulty: d, mode: 'advanced', reasons: reasons };
    }
    reasons.push('样本不足，保持当前难度');
    return { difficulty: d, mode: 'variation', reasons: reasons };
  }

  /* 数字类别权重：基础权重1，按错误记录加权。
   * weaknessMap 来自 errorbook.weaknessByCategory()，
   * accuracyByCat 来自 stats.overview().byCategory */
  function categoryWeights(categories, weaknessMap, accuracyByCat) {
    return categories.map(function (cat) {
      var w = 1;
      var wrongs = (weaknessMap && weaknessMap[cat.id]) || 0;
      w += Math.min(3, wrongs * 0.5); // 每个未掌握错误 +0.5，封顶 +3
      var acc = accuracyByCat && accuracyByCat[cat.id];
      if (acc && acc.total >= 3 && acc.accuracy !== null && acc.accuracy < 0.7) {
        w += 2; // 类别正确率低于70% 额外加权
      }
      return { id: cat.id, name: cat.name, weight: w };
    });
  }

  /* 按错误集中的课程给出复习建议 */
  function lessonReviewSuggestions() {
    var byLesson = {};
    MJT.errorbook.all().forEach(function (e) {
      if (e.masteryStatus === 'mastered') return;
      (e.lesson || []).forEach(function (l) {
        byLesson[l] = (byLesson[l] || 0) + e.errorCount;
      });
    });
    var out = Object.keys(byLesson).map(function (l) {
      return { lesson: parseInt(l, 10), errors: byLesson[l] };
    }).filter(function (x) { return x.errors >= 2; });
    out.sort(function (a, b) { return b.errors - a.errors; });
    return out;
  }

  /* 组卷：从错题相关知识点生成新变式的比例。
   * 需求："不要只重复完全相同的题目，应当围绕同一个知识点生成新的情景"
   * → 数字类错题不复用原题，而是按其类别提权重新生成（新数值/新情景）。 */
  function buildSessionPlan(opts) {
    var meta = MJT_DATA.meta;
    var weakness = MJT.errorbook.weaknessByCategory();
    var accuracyByCat = MJT.stats.overview().byCategory;
    var weights = categoryWeights(meta.numberCategories, weakness, accuracyByCat);
    var summary = MJT.stats.overview().all;
    var streaks = MJT.stats.streaks(MJT.stats.allRecords().slice(-20));
    var diff = nextDifficulty(opts && opts.difficulty || 1, summary, streaks);
    return {
      difficulty: diff.difficulty,
      mode: diff.mode,
      reasons: diff.reasons,
      categoryWeights: weights,
      lessonReview: lessonReviewSuggestions()
    };
  }

  return {
    RULES: RULES,
    nextDifficulty: nextDifficulty,
    categoryWeights: categoryWeights,
    lessonReviewSuggestions: lessonReviewSuggestions,
    buildSessionPlan: buildSessionPlan
  };
})();
