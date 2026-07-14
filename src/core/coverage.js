/* 教材词汇覆盖 & 缺口扫描（corpus-first 原则的度量层）
 *
 * 职责：
 *  1. 统计教材词表录入/核实情况（教材词表由用户对照原书核实录入，
 *     未录入前覆盖率为 null，不虚报）。
 *  2. 统计各训练形式在当前 Stage 范围内的已核实/待审核内容量。
 *  3. 缺口扫描：发现"哪些词/语法/场景/题型缺内容"，产出 AI 生产任务
 *     （只生成 pending 待审核任务，AI 不能自动 verified）。
 *
 * 教材词表数据来源：MJT_DATA.textbooks['minna-beginner1'].lessons[].vocabulary
 * （目前为空骨架；录入并核实后本模块自动生效）。 */
window.MJT = window.MJT || {};

MJT.coverage = (function () {

  function reviewDecisions() { return MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {}); }

  /* 收集当前 Stage 范围内、每种训练形式的 verified / pending 数量 */
  function byForm(settings) {
    var rd = reviewDecisions();
    function count(items) {
      var v = 0, p = 0;
      (items || []).forEach(function (it) {
        var st = MJT.scope.effectiveSourceStatus(it, rd);
        var lm = MJT.scope.maxLessonOf(it);
        if (lm !== null && lm > settings.maxLesson) return; // 超范围不计
        if (st === 'verified' && MJT.scope.check(it, { maxLesson: settings.maxLesson, reviewDecisions: rd }).allowed) v++;
        else if (st === 'pending') p++;
      });
      return { verified: v, pending: p };
    }
    var grammar = count((MJT_DATA.pendingGrammar || []).concat(MJT.app.importedItems('grammar')));
    var listening = count(MJT_DATA.pendingListening);
    var reading = count(MJT_DATA.pendingReading);
    var scenario = count(MJT_DATA.pendingScenarios);
    return [
      { id: 'grammar', name: '语法', verified: grammar.verified, pending: grammar.pending },
      { id: 'listening', name: '听力', verified: listening.verified, pending: listening.pending },
      { id: 'reading', name: '阅读', verified: reading.verified, pending: reading.pending },
      { id: 'scenario', name: '场景', verified: scenario.verified, pending: scenario.pending }
    ];
  }

  /* 教材词表统计（跨全部已录入课） */
  function textbookVocab() {
    var tb = MJT_DATA.textbooks && MJT_DATA.textbooks['minna-beginner1'];
    var total = 0, verified = 0, byLesson = {};
    if (tb) {
      tb.lessons.forEach(function (ls) {
        var v = ls.vocabulary || [];
        total += v.length;
        var ver = v.filter(function (w) { return w.sourceStatus === 'verified'; }).length;
        verified += ver;
        byLesson[ls.lesson] = { total: v.length, verified: ver };
      });
    }
    return { total: total, verified: verified, byLesson: byLesson };
  }

  /* 语料中被引用的词次（vocabularyIds 或 grammarPoints 粗略计） */
  function corpusVocabRefs() {
    var n = 0;
    (MJT_DATA.pendingScenarios || []).forEach(function (sc) { n += (sc.vocabularyIds || []).length; });
    (MJT_DATA.pendingReading || []).forEach(function (p) { n += (p.keyVocab || []).length; });
    return n;
  }

  function analyze(settings) {
    settings = settings || MJT.app.getSettings();
    var tv = textbookVocab();
    var forms = byForm(settings);
    var refs = corpusVocabRefs();
    var coverageRate = tv.verified > 0 ? Math.min(1, refs / tv.verified) : null;

    var gaps = [];
    if (tv.total === 0) gaps.push('教材词表未录入：无法计算词汇覆盖率，请先在数据审核页逐课核实录入词汇。');
    forms.forEach(function (f) {
      if (f.verified === 0 && f.pending > 0) gaps.push(f.name + '：有 ' + f.pending + ' 条待审核但 0 条已核实，需人工审核后才能进入正式训练。');
      if (f.verified === 0 && f.pending === 0) gaps.push(f.name + '：当前 Stage 范围内暂无内容。');
    });
    var scForm = forms.filter(function (f) { return f.id === 'scenario'; })[0];
    if (scForm && scForm.verified + scForm.pending < 30) gaps.push('场景总量 ' + (scForm.verified + scForm.pending) + ' < 30，建议继续补充生活场景。');

    return {
      textbookVocabTotal: tv.total,
      textbookVocabVerified: tv.verified,
      textbookByLesson: tv.byLesson,
      corpusVocabRefs: refs,
      coverageRate: coverageRate,
      byForm: forms,
      gaps: gaps,
      stageMax: settings.maxLesson
    };
  }

  /* 缺口 → AI 生产任务（pending） */
  function generationTasks(report) {
    var tasks = [];
    report.byForm.forEach(function (f) {
      if (f.verified === 0 && f.pending === 0) {
        tasks.push({ type: '生成' + f.name + '语料', description: '当前范围内缺少' + f.name + '内容，生成待审核' + f.name + '语料。', status: 'suggested' });
      }
    });
    if (report.textbookVocabTotal === 0) {
      tasks.push({ type: '录入教材词表', description: '按 OCR 底稿逐课核实录入初级Ⅰ词汇（人工任务，非AI自动）。', status: 'manual' });
    } else if (report.coverageRate !== null && report.coverageRate < 0.8) {
      tasks.push({ type: '补充低覆盖词场景', description: '为尚未进入训练的教材词生成新的场景/听力/阅读语料（pending）。', status: 'suggested' });
    }
    return tasks;
  }

  return { analyze: analyze, generationTasks: generationTasks, byForm: byForm, textbookVocab: textbookVocab };
})();
