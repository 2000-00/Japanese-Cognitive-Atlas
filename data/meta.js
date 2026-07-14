/* =========================================================================
 * Minna Japanese Trainer — 元数据
 * 《大家的日语》1～21课综合训练系统
 *
 * 真实性原则（最高优先级）：
 *  - sourceStatus 描述"语言内容本身"的可信度（verified / pending / rejected）。
 *  - lessonAttribution 描述"该内容属于教材第几课"这一声明的可信度，
 *    未经用户对照教材核实的课程归属一律 status: 'pending'。
 *  - 本项目不保存任何《大家的日语》教材原文，所有题目均为
 *    "基于已验证知识生成的练习示例"，禁止标注"教材原句"。
 * ========================================================================= */
window.MJT_DATA = window.MJT_DATA || {};

window.MJT_DATA.meta = {
  appName: 'Minna Japanese Trainer',
  appNameZh: '《大家的日本语 初级Ⅰ》综合学习系统',
  textbook: '大家的日本语 初级Ⅰ 第二版 本册',
  textbookId: 'minna-beginner1',
  schemaVersion: 2,
  // 系统课程范围（初级Ⅰ 共25课；硬上限=25）
  lessonMin: 1,
  lessonMax: 25,
  // Stage 累计阶段系统：切换 Stage 只改变 maxLesson 上限，
  // 低课次内容始终参与训练（累计模式，非替换）。
  stages: [
    { id: 'stage1', name: 'Stage 1', range: '第1～20课', maxLesson: 20 },
    { id: 'stage2', name: 'Stage 2', range: '第1～25课', maxLesson: 25 }
  ],
  defaultStage: 'stage1',
  // 允许的来源状态 / 来源类型（验证器据此校验）
  sourceStatusValues: ['verified', 'pending', 'rejected'],
  sourceTypeValues: ['user_material', 'official_material', 'manual_review', 'unknown'],
  // 题目来源展示标签（禁止出现"教材原句"）
  originLabels: {
    knowledge: '教材知识点',
    generated: '基于教材范围生成',
    generatedVerified: '基于已验证知识生成的练习示例',
    user: '用户提供',
    unverified: '待核实',
    unverifiedDemo: '待核实演示数据'
  },
  forbiddenOriginLabels: ['教材原句'],
  // 数字专项类别
  numberCategories: [
    { id: 'basic',   name: '基础数字',  errorType: '数字识别错误' },
    { id: 'time',    name: '时间',      errorType: '时间识别错误' },
    { id: 'date',    name: '日期',      errorType: '日期识别错误' },
    { id: 'counter', name: '数量词',    errorType: '数量词错误' },
    { id: 'price',   name: '日元金额',  errorType: '金额识别错误' },
    { id: 'phone',   name: '电话号码',  errorType: '数字识别错误' },
    { id: 'duration',name: '持续时间',  errorType: '时间识别错误' }
  ],
  errorTypes: [
    '未掌握知识点', '动词变形错误', '助词错误', '听音错误',
    '数字识别错误', '时间识别错误', '日期识别错误', '数量词错误',
    '金额识别错误', '阅读定位错误', '反应时间过长', '粗心'
  ]
};

/* 课程 1～25 注册表。
 * grammarSummary 仅为开发用占位说明——每一课具体教什么语法属于
 * "教材归属声明"，未经用户对照实体教材核实前不得写入 verified 数据。 */
window.MJT_DATA.lessons = [];
for (var _l = 1; _l <= 25; _l++) {
  window.MJT_DATA.lessons.push({
    id: 'lesson-' + _l,
    lesson: _l,
    name: '第' + _l + '课',
    contentStatus: 'pending', // 课程内容清单未核实
    note: '课程知识点清单待用户提供教材资料后在"数据审核"页核实。'
  });
}
