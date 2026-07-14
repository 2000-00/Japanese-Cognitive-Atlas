/* 《大家的日本语 初级Ⅰ 第二版 本册》教材数据库
 *
 * 来源文件：resources/textbooks/minna/beginner1/minna1.pdf（用户提供的扫描版，326页，无文本层）
 * 已核实的客观元数据（读取自 PDF 本身）：
 *   title: "Minna no Nihongo 2nd Edition Shokyu I" / author: "3A Network"
 *
 * 真实性原则：
 * - 本文件当前只包含【结构骨架】：初级Ⅰ共 25 课的空数据库位。
 * - 扫描版必须经 OCR（scripts/parse-minna.py）→ 人工对照原书审核，
 *   词汇/语法/句型才能逐课填入并升级为 verified。
 * - AI 不根据模型记忆填写任何课次内容——所有条目生而 pending。
 * - 每课的 pageRange 由 OCR 边界探测提供【建议值】，同样需人工核实。
 *
 * 递增开发：第一阶段填充 Lesson 01～20，第二阶段 21～25。
 * 内容填充后建议拆分为 data/textbooks/minna/lesson-NN.js 独立文件。 */
window.MJT_DATA = window.MJT_DATA || {};

window.MJT_DATA.textbooks = window.MJT_DATA.textbooks || {};
window.MJT_DATA.textbooks['minna-beginner1'] = {
  textbookId: 'minna-beginner1',
  book: '大家的日本语 初级Ⅰ',
  edition: '第二版 本册',
  publisher: '3A Network（PDF元数据）',
  sourceFile: 'resources/textbooks/minna/beginner1/minna1.pdf',
  sourcePages: 326,
  lessonCount: 25,
  role: 'Lesson Range 主轴 / 词汇·语法·句型·活用范围',
  parsePipeline: 'scripts/parse-minna.py（OCR → 边界探测 → 人工审核）',
  sourceStatus: 'pending',
  reviewed: false,
  lessons: []
};

(function () {
  var tb = window.MJT_DATA.textbooks['minna-beginner1'];
  for (var l = 1; l <= 25; l++) {
    tb.lessons.push({
      textbookId: 'minna-beginner1',
      lesson: l,
      pageRange: null,             // 由 scripts/parse-minna.py detect 提供建议，人工核实后填入
      pageRangeStatus: 'pending',
      vocabulary: [],              // {id, word, reading, meaningZh, partOfSpeech, ...} 全部经审核后填入
      grammar: [],
      sentencePatterns: [],
      verbForms: [],
      particles: [],
      dialogues: [],
      readings: [],
      communicationFunctions: [],
      numbers: [],
      timeExpressions: [],
      dateExpressions: [],
      counterWords: [],
      sourceReferences: [],
      sourceStatus: 'pending',
      reviewed: false,
      notes: '待 OCR 底稿生成后，对照原书逐项核实填入。AI 不得凭记忆填写。'
    });
  }
})();
