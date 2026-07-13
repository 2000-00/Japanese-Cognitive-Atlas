/* 课程审核表：第1～21课的知识点清单登记处
 *
 * 真实性原则：AI 不猜测某个知识点首次出现在哪一课。
 * 因此全部 21 条记录的清单字段默认为空、sourceStatus 为 pending、
 * reviewed 为 false——等待用户拿实体教材填写并在"数据审核"页核实。
 * 本文件不包含任何"已经教材核实"的声明。 */
window.MJT_DATA = window.MJT_DATA || {};

window.MJT_DATA.lessonScopeReview = [];
(function () {
  for (var l = 1; l <= 21; l++) {
    window.MJT_DATA.lessonScopeReview.push({
      lesson: l,
      grammar: [],             // 该课语法点（待用户填写）
      sentencePatterns: [],    // 句型
      verbForms: [],           // 动词变形
      particles: [],           // 助词
      vocabularyGroups: [],    // 词汇组
      numberExpressions: [],   // 数字类表达
      scenarioFunctions: [],   // 场景功能（如"购物""问路"）
      sourceStatus: 'pending',
      reviewed: false,
      notes: '尚无用户教材资料支持；请对照《大家的日语》第' + l + '课实体教材填写并核实。'
    });
  }
})();
