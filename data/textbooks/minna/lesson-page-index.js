/* 《大家的日本语 初级Ⅰ》课程页码索引（PDF 页码，非书本印刷页码）
 *
 * 来源：scripts/parse-minna.py 对 326 页扫描件的 OCR 边界探测 +
 * 逐页页首人工抽查（2026-07）。OCR 有误读，全部条目
 * pageRangeStatus: 'pending'——须对照原书核实后才可标 verified。
 * confidence: high=页首明确出现「第N課」或该课文型首句
 *             low =由前后课页码插值/内容特征推断
 */
window.MJT_DATA = window.MJT_DATA || {};

window.MJT_DATA.minnaLessonPageIndex = [
  { lesson: 1, startPage: 26, confidence: 'low', evidence: 'p22-25为发音/假名表；p30出现L1练习B（あの方はどなたですか）' },
  { lesson: 2, startPage: 34, confidence: 'high', evidence: 'p34文型「これは辞書です」' },
  { lesson: 3, startPage: 42, confidence: 'high', evidence: 'p42页首「第 3」' },
  { lesson: 4, startPage: 52, confidence: 'high', evidence: 'p52文型「起きます/勉強しました」' },
  { lesson: 5, startPage: 60, confidence: 'high', evidence: 'p60文型「わたしは京都へ…」' },
  { lesson: 6, startPage: 68, confidence: 'high', evidence: 'p68页首「第 6 課」' },
  { lesson: 7, startPage: 76, confidence: 'high', evidence: 'p76文型「パソコンで…／花をあげます」' },
  { lesson: 8, startPage: 86, confidence: 'high', evidence: 'p86文型「桜はきれいです」' },
  { lesson: 9, startPage: 94, confidence: 'high', evidence: 'p94页首「第 9」' },
  { lesson: 10, startPage: 102, confidence: 'high', evidence: 'p103会話「ナンプラー、ありますか」' },
  { lesson: 11, startPage: 110, confidence: 'high', evidence: 'p110页首「第11」' },
  { lesson: 12, startPage: 118, confidence: 'high', evidence: 'OCR页首命中「第12課」' },
  { lesson: 13, startPage: 130, confidence: 'high', evidence: 'OCR页首命中「第13課」' },
  { lesson: 14, startPage: 138, confidence: 'high', evidence: 'OCR页首命中「第14課」' },
  { lesson: 15, startPage: 146, confidence: 'high', evidence: 'OCR页首命中「第15課」' },
  { lesson: 16, startPage: 154, confidence: 'high', evidence: 'p154文型「朝ジョギングをして、シャワーを浴びて…」' },
  { lesson: 17, startPage: 164, confidence: 'high', evidence: 'OCR页首命中「第17課」' },
  { lesson: 18, startPage: 172, confidence: 'high', evidence: 'OCR页首命中「第18課」' },
  { lesson: 19, startPage: 180, confidence: 'high', evidence: 'OCR页首命中「第19課」' },
  { lesson: 20, startPage: 190, confidence: 'high', evidence: 'OCR页首命中「第20課」' },
  { lesson: 21, startPage: 198, confidence: 'high', evidence: 'p198页首「第21」' },
  { lesson: 22, startPage: 206, confidence: 'high', evidence: 'p206页首「第22」' },
  { lesson: 23, startPage: 216, confidence: 'high', evidence: 'OCR页首命中「第23課」' },
  { lesson: 24, startPage: 224, confidence: 'high', evidence: 'OCR页首命中「第24課」' },
  { lesson: 25, startPage: 232, confidence: 'high', evidence: 'OCR页首命中「第25課」；约p240起为卷末附录/索引' }
];

/* 把建议页码写入教材数据库骨架（保持 pending 状态） */
(function () {
  var tb = window.MJT_DATA.textbooks && window.MJT_DATA.textbooks['minna-beginner1'];
  if (!tb) return;
  var idx = window.MJT_DATA.minnaLessonPageIndex;
  tb.lessons.forEach(function (ls) {
    var hit = null;
    idx.forEach(function (e, i) {
      if (e.lesson === ls.lesson) hit = { start: e.startPage, end: (idx[i + 1] ? idx[i + 1].startPage - 1 : 239), confidence: e.confidence };
    });
    if (hit) { ls.pageRange = hit; ls.pageRangeStatus = 'pending'; }
  });
})();
