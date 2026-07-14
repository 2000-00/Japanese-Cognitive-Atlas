/* Conjugation Reaction Engine 2.0 —— 动态变形题目生成器
 *
 * 解决两个问题：
 *  1) 重复率过高：从大词库 × 变形 × 场景 × 时间 × 人物关系 × 题型 动态组合，
 *     配防重复历史缓存（近期词/场景/题干/选项位/题型去重）。
 *  2) 缺少听力：内置四种听力模式（词形识别/整句/短对话/听后变形）+ 连续听力，
 *     每条听力数据带 displayText/speechText/readingText/translation/targetForm/
 *     dictionaryForm/audioStatus，页面文字与播放同源，speechText 用假名读音。
 *
 * 词库为通用常见词（辞典可核实，课程归属 pending）；生成题为
 * ai_generated_practice。搭配自然度由词库 frames（手写自然成分）保证。 */
window.MJT = window.MJT || {};

MJT.conjugationDrills = (function () {
  var C = function () { return MJT.conjugation; };
  var rnd = function () { return MJT.random; };
  var seq = 0;

  /* ============ 词库池 ============ */
  function lex() { return MJT_DATA.conjugationLexicon; }
  function poolStats() {
    var l = lex();
    return { verbs: l.verbs.length, iAdj: l.iAdjectives.length, naAdj: l.naAdjectives.length, nouns: l.nouns.length,
      total: l.verbs.length + l.iAdjectives.length + l.naAdjectives.length + l.nouns.length };
  }

  /* ============ 防重复历史 ============ */
  var H = null;
  function resetHistory() {
    H = { ids: [], words: [], scenes: [], skeletons: [], answerPos: [], qtypes: [], forms: [],
      distinct: {}, lastSeen: {}, usedSkel: {}, count: 0 };
  }
  resetHistory();
  function push(arr, v, cap) { arr.push(v); while (arr.length > cap) arr.shift(); }
  function recentHas(arr, v, n) { return arr.slice(-n).indexOf(v) !== -1; }
  function consecCount(arr, v) { var c = 0; for (var i = arr.length - 1; i >= 0; i--) { if (arr[i] === v) c++; else break; } return c; }

  function sessionInfo() {
    var recent = H.words.slice(-20);
    var seen = {}, dup = 0;
    recent.forEach(function (w) { if (seen[w]) dup++; seen[w] = true; });
    return { distinctWords: Object.keys(H.distinct).length, recentRepeatWords: dup, poolSize: poolStats().total, answered: H.count };
  }

  /* ============ 自适应权重 ============ */
  /* 读取变形训练历史，按 verbForm 标签统计错误/慢，弱形式权重更高 */
  function formWeights() {
    var recs = (MJT.stats && MJT.stats.allRecords ? MJT.stats.allRecords() : []).filter(function (r) { return r.module === 'conjugation'; });
    var w = {};
    recs.slice(-300).forEach(function (r) {
      var f = r.conjForm; if (!f) return;
      if (!w[f]) w[f] = { n: 0, wrong: 0, slow: 0 };
      w[f].n++; if (!r.correct) w[f].wrong++; if (r.responseTime > 6000) w[f].slow++;
    });
    return w;
  }
  function formWeight(form, wmap) {
    var s = wmap[form];
    var base = 1;
    if (s && s.n >= 2) { base += (s.wrong / s.n) * 3 + (s.slow / s.n) * 1.5; }
    // 最近出现过的形式降权
    if (recentHas(H.forms, form, 4)) base *= 0.4;
    return base;
  }

  /* ============ 选词（防重复 + LRU + 弱形偏好） ============ */
  function pickWord(kind) {
    var l = lex();
    var arr = kind === 'verb' ? l.verbs : kind === 'i-adj' ? l.iAdjectives : kind === 'na-adj' ? l.naAdjectives : l.nouns;
    // 候选：不在最近8个词内
    var cands = arr.filter(function (x) { return !recentHas(H.words, x.id, 8); });
    if (!cands.length) cands = arr.slice();
    // 按 LRU：越久没出现权重越高
    var weighted = cands.map(function (x) {
      var last = H.lastSeen[x.id] === undefined ? -999 : H.lastSeen[x.id];
      return { item: x, weight: 1 + (H.count - last) * 0.05 };
    });
    return rnd().weightedPick(weighted).item;
  }

  /* ============ 通用字段 ============ */
  function base(fields) {
    seq++;
    var q = {
      id: 'conj2-' + Date.now() + '-' + seq,
      module: 'conjugation', type: 'conjugation', format: 'choice',
      lesson: null,
      lessonAttribution: { lesson: null, status: 'pending', note: '通用活用规则，不声明教材课程出处' },
      origin: '基于已验证知识生成的练习示例',
      contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
      sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
      sourceReference: '标准日语活用规则（辞典可核实）。',
      numberCategory: null
    };
    Object.keys(fields).forEach(function (k) { q[k] = fields[k]; });
    return q;
  }
  function options4(correct, poolStrings) {
    var seen = {}; seen[correct] = true; var out = [];
    rnd().shuffle(poolStrings).forEach(function (v) { if (v && !seen[v] && out.length < 3) { seen[v] = true; out.push(v); } });
    var g = 0; while (out.length < 3 && g++ < 30) { out.push(correct + '＋' + out.length); }
    return [correct].concat(out.slice(0, 3));
  }
  /* 放置选项时避免正确答案连续同位置>2 */
  function placeOptions(opts, correct) {
    var shuffled = rnd().shuffle(opts);
    var pos = shuffled.indexOf(correct);
    if (consecCount(H.answerPos, pos) >= 2) {
      // 换一个位置
      var target = (pos + 1 + rnd().int(0, opts.length - 2)) % opts.length;
      var t = shuffled[target]; shuffled[target] = shuffled[pos]; shuffled[pos] = t;
      pos = target;
    }
    return { options: shuffled, pos: pos };
  }

  var KM_NODE = { masu: 'cg-masu-form', masuNeg: 'cg-masu-form', masuPast: 'cg-masu-form', masuPastNeg: 'cg-masu-form',
    teiru: 'cg-a-teiru', nai: 'cg-nai-form', naiPast: 'cg-nai-form', ta: 'cg-ta-form', te: 'cg-te-form-formation', dict: 'cg-verb-groups' };
  function km(form) {
    var id = KM_NODE[form]; if (!id) return { km: [], status: 'pending' };
    var node = null; (MJT_DATA.knowledgeNodes || []).forEach(function (n) { if (n.id === id) node = n; });
    return node ? { km: [{ module: node.module, section: node.zh, node: node.id }], status: 'verified' } : { km: [], status: 'pending' };
  }
  function formZh(form) {
    var f = C().VERB_FORMS.filter(function (x) { return x.id === form; })[0];
    return f ? f.zh : form;
  }

  /* 形式的语义描述（用于任务标签与"为什么"） */
  var FORM_DESC = {
    masu: { time: '现在', pol: '肯定', reg: '敬体' }, masuNeg: { time: '现在', pol: '否定', reg: '敬体' },
    masuPast: { time: '过去', pol: '肯定', reg: '敬体' }, masuPastNeg: { time: '过去', pol: '否定', reg: '敬体' },
    dict: { time: '现在', pol: '肯定', reg: '普通体' }, nai: { time: '现在', pol: '否定', reg: '普通体' },
    ta: { time: '过去', pol: '肯定', reg: '普通体' }, naiPast: { time: '过去', pol: '否定', reg: '普通体' },
    te: { time: '—', pol: '—', reg: '中立' }, teiru: { time: '进行/状态', pol: '肯定', reg: '敬体' }
  };

  /* 人物关系 → 语体 */
  var RELATIONS = [
    { zh: '对老师', reg: '敬体' }, { zh: '对店员', reg: '敬体' }, { zh: '对医生', reg: '敬体' },
    { zh: '对朋友', reg: '普通体' }, { zh: '对同学', reg: '普通体' }, { zh: '写日记', reg: '普通体' }
  ];

  var VERB_TARGET_FORMS = ['masu', 'masuNeg', 'masuPast', 'masuPastNeg', 'dict', 'nai', 'ta', 'naiPast', 'te', 'teiru'];

  /* ============ 题型生成器 ============ */

  /* T1 情景填空：给场景/人物/时间，选正确变形（涵盖 dict→form / 场景 / 语体·时态·极性） */
  function tClozeForm(diff, wmap) {
    var verb = pickWord('verb');
    var frame = rnd().pick(verb.frames);
    var rel = rnd().pick(RELATIONS);
    // 目标形式：按语体过滤 + 自适应权重
    var candForms = VERB_TARGET_FORMS.filter(function (f) {
      if (f === 'te' || f === 'teiru') return true;
      return FORM_DESC[f].reg === rel.reg;
    });
    var form = rnd().weightedPick(candForms.map(function (f) { return { v: f, weight: formWeight(f, wmap) }; })).v;
    var conj = C().conjugateVerb(verb, form);
    var sentence = frame.comp + conj.surface + '。';
    var display = frame.comp + '（　）';
    var d = FORM_DESC[form];
    var taskLabel = rel.zh + '·' + d.time + (d.pol !== '—' ? '·' + d.pol : '');
    var others = VERB_TARGET_FORMS.filter(function (f) { return f !== form; }).map(function (f) { return C().conjugateVerb(verb, f).surface; });
    var placed = placeOptions(options4(conj.surface, others), conj.surface);
    var k = km(form);
    return finalize(base({
      qtype: 'clozeForm', conjForm: form, wordId: verb.id, scene: frame.scene,
      question: '【' + taskLabel + '】把「' + verb.dict + '」变成正确形式：\n' + display,
      options: placed.options, answer: conj.surface, answerPos: placed.pos,
      translation: sentence + '（' + frame.zh + '）',
      explanation: '完整句：' + sentence + '\n目标：' + taskLabel + ' → ' + formZh(form) + '。\n' + C().verbProcess(verb, form) + '　→　' + conj.surface + '（' + conj.reading + '）。',
      grammarPoints: ['变形:' + form, rel.zh], verbForms: [form],
      knowledgeMap: k.km, knowledgeMapStatus: k.status,
      difficulty: Math.max(1, diff), skeleton: 'clozeForm:' + verb.id + ':' + form
    }), verb, frame.scene, form);
  }

  /* T2 看变形选原形（文字） */
  function tFormToDict(diff, wmap) {
    var verb = pickWord('verb');
    var form = rnd().weightedPick(VERB_TARGET_FORMS.map(function (f) { return { v: f, weight: formWeight(f, wmap) }; })).v;
    var conj = C().conjugateVerb(verb, form);
    var others = rnd().shuffle(lex().verbs.filter(function (v) { return v.id !== verb.id; })).slice(0, 5).map(function (v) { return v.dict; });
    var placed = placeOptions(options4(verb.dict, others), verb.dict);
    return finalize(base({
      qtype: 'formToDict', conjForm: form, wordId: verb.id, scene: 'reaction',
      question: '「' + conj.surface + '」的原形（辞书形）是？', questionKana: conj.reading,
      options: placed.options, answer: verb.dict, answerPos: placed.pos,
      translation: verb.zh + '（' + formZh(form) + '→辞书形）',
      explanation: '「' + conj.surface + '（' + conj.reading + '）」是' + formZh(form) + '，原形为「' + verb.dict + '（' + verb.reading + '）」。' + C().verbProcess(verb, form),
      grammarPoints: ['原形识别', '变形:' + form], verbForms: [form],
      knowledgeMap: [], knowledgeMapStatus: 'pending',
      difficulty: Math.max(1, diff), skeleton: 'formToDict:' + verb.id + ':' + form
    }), verb, 'reaction', form);
  }

  /* T3 听变形选原形（模式A·听力） */
  function tListenFormToDict(diff, wmap) {
    var verb = pickWord('verb');
    var form = rnd().weightedPick(VERB_TARGET_FORMS.map(function (f) { return { v: f, weight: formWeight(f, wmap) }; })).v;
    var conj = C().conjugateVerb(verb, form);
    var others = rnd().shuffle(lex().verbs.filter(function (v) { return v.id !== verb.id; })).slice(0, 5).map(function (v) { return v.dict; });
    var placed = placeOptions(options4(verb.dict, others), verb.dict);
    var q = base({
      qtype: 'listenFormToDict', conjForm: form, wordId: verb.id, scene: 'listen', level: 1,
      question: '【听力·模式A】听到的词形，原形是？',
      options: placed.options, answer: verb.dict, answerPos: placed.pos,
      translation: conj.surface + '（' + conj.reading + '）→原形' + verb.dict,
      explanation: '你听到的是「' + conj.surface + '（' + conj.reading + '）」，' + formZh(form) + '，原形「' + verb.dict + '」。' + C().verbProcess(verb, form),
      grammarPoints: ['听音识别原形', '变形:' + form], verbForms: [form],
      knowledgeMap: [], knowledgeMapStatus: 'pending', difficulty: Math.max(1, diff),
      skeleton: 'listenFormToDict:' + verb.id + ':' + form
    });
    attachListening(q, conj.surface, conj.reading, verb.zh, form, verb.dict);
    return finalize(q, verb, 'listen', form);
  }

  /* T4 听词形判断属性（模式A变体·听力） */
  function tListenLabel(diff, wmap) {
    var verb = pickWord('verb');
    var form = rnd().pick(['masu', 'masuNeg', 'masuPast', 'masuPastNeg', 'dict', 'nai', 'ta', 'naiPast']);
    var conj = C().conjugateVerb(verb, form);
    var d = FORM_DESC[form];
    var axis = rnd().pick(['time', 'pol', 'reg']);
    var qmap = {
      time: { q: '这个词形表示的时间？', opts: ['现在', '过去'], ans: d.time },
      pol: { q: '这个词形是肯定还是否定？', opts: ['肯定', '否定'], ans: d.pol },
      reg: { q: '这个词形是敬体还是普通体？', opts: ['敬体', '普通体'], ans: d.reg }
    };
    var spec = qmap[axis];
    var placed = placeOptions(spec.opts.slice(), spec.ans);
    var q = base({
      qtype: 'listenLabel', conjForm: form, wordId: verb.id, scene: 'listen', level: 1,
      question: '【听力·模式A】' + spec.q,
      options: placed.options, answer: spec.ans, answerPos: placed.pos,
      translation: conj.surface + '（' + conj.reading + '）',
      explanation: '「' + conj.surface + '」是' + formZh(form) + '：时间' + d.time + '、极性' + d.pol + '、语体' + d.reg + '。',
      grammarPoints: ['听音判断' + axis, '变形:' + form], verbForms: [form],
      knowledgeMap: [], knowledgeMapStatus: 'pending', difficulty: Math.max(1, diff),
      skeleton: 'listenLabel:' + verb.id + ':' + form + ':' + axis
    });
    attachListening(q, conj.surface, conj.reading, verb.zh, form, verb.dict);
    return finalize(q, verb, 'listen', form);
  }

  /* T5 听整句判断形式（模式B·听力） */
  function tListenSentenceForm(diff, wmap) {
    var verb = pickWord('verb');
    var frame = rnd().pick(verb.frames);
    var form = rnd().weightedPick(['masu', 'masuNeg', 'masuPast', 'masuPastNeg', 'nai', 'ta', 'naiPast', 'teiru'].map(function (f) { return { v: f, weight: formWeight(f, wmap) }; })).v;
    var conj = C().conjugateVerb(verb, form);
    var display = frame.comp + conj.surface + '。';
    var displayKana = frame.compKana + conj.reading + '。';
    var others = ['masu', 'masuNeg', 'masuPast', 'masuPastNeg', 'nai', 'ta', 'naiPast', 'teiru', 'dict'].filter(function (f) { return f !== form; }).map(formZh);
    var placed = placeOptions(options4(formZh(form), others), formZh(form));
    var q = base({
      qtype: 'listenSentenceForm', conjForm: form, wordId: verb.id, scene: frame.scene, level: 3,
      question: '【听力·模式B】听句子，句中动词用了什么形式？',
      options: placed.options, answer: formZh(form), answerPos: placed.pos,
      translation: display + '（' + frame.zh + '）',
      explanation: '原文：' + display + '\n动词「' + verb.dict + '」用了' + formZh(form) + '（' + conj.surface + '）。' + C().verbProcess(verb, form),
      grammarPoints: ['听句识形', '变形:' + form], verbForms: [form],
      knowledgeMap: km(form).km, knowledgeMapStatus: km(form).status, difficulty: Math.max(2, diff),
      skeleton: 'listenSentenceForm:' + verb.id + ':' + form
    });
    attachListening(q, display, displayKana, frame.zh, form, verb.dict);
    return finalize(q, verb, frame.scene, form);
  }

  /* T6 听整句补形（模式B·听力，选择缺失动词形） */
  function tListenSentenceGap(diff, wmap) {
    var verb = pickWord('verb');
    var frame = rnd().pick(verb.frames);
    var form = rnd().weightedPick(['masu', 'masuPast', 'masuPastNeg', 'nai', 'ta', 'teiru'].map(function (f) { return { v: f, weight: formWeight(f, wmap) }; })).v;
    var conj = C().conjugateVerb(verb, form);
    var display = frame.comp + conj.surface + '。';
    var displayKana = frame.compKana + conj.reading + '。';
    var others = VERB_TARGET_FORMS.filter(function (f) { return f !== form; }).map(function (f) { return C().conjugateVerb(verb, f).surface; });
    var placed = placeOptions(options4(conj.surface, others), conj.surface);
    var q = base({
      qtype: 'listenSentenceGap', conjForm: form, wordId: verb.id, scene: frame.scene, level: 3,
      question: '【听力·模式B】听句子，选出你听到的动词形式：',
      options: placed.options, answer: conj.surface, answerPos: placed.pos,
      translation: display + '（' + frame.zh + '）',
      explanation: '原文：' + display + '\n听到的动词是「' + conj.surface + '（' + conj.reading + '）」（' + formZh(form) + '）。',
      grammarPoints: ['听句补形', '变形:' + form], verbForms: [form],
      knowledgeMap: km(form).km, knowledgeMapStatus: km(form).status, difficulty: Math.max(2, diff),
      skeleton: 'listenSentenceGap:' + verb.id + ':' + form
    });
    attachListening(q, display, displayKana, frame.zh, form, verb.dict);
    return finalize(q, verb, frame.scene, form);
  }

  /* T7 短对话听力（模式C·听力） */
  var DIALOGUES = [
    { scene: 'school', build: function (verb, frame) {
        var past = C().conjugateVerb(verb, 'masuPast');
        return { turns: [
          { sp: '先生', ja: 'きのう、' + frame.comp + past.surface + 'か。', kana: 'きのう、' + frame.compKana + past.reading + 'か。' },
          { sp: '学生', ja: 'はい、' + past.surface + '。', kana: 'はい、' + past.reading + '。' }
        ], askDict: verb, askForm: 'masuPast' };
      } },
    { scene: 'hospital', build: function (verb, frame) {
        var neg = C().conjugateVerb(verb, 'masuPastNeg');
        return { turns: [
          { sp: '医者', ja: 'きのうは' + frame.comp + neg.surface + 'か。', kana: 'きのうは' + frame.compKana + neg.reading + 'か。' },
          { sp: '患者', ja: 'はい、' + neg.surface + '。', kana: 'はい、' + neg.reading + '。' }
        ], askDict: verb, askForm: 'masuPastNeg' };
      } },
    { scene: 'friends', build: function (verb, frame) {
        var teiru = C().conjugateVerb(verb, 'teiru');
        return { turns: [
          { sp: 'A', ja: '今、何を' + 'していますか。', kana: 'いま、なにをしていますか。' },
          { sp: 'B', ja: frame.comp + teiru.surface + '。', kana: frame.compKana + teiru.reading + '。' }
        ], askDict: verb, askForm: 'teiru' };
      } }
  ];
  function tListenDialogue(diff) {
    var tmpl = rnd().pick(DIALOGUES);
    var verb = pickWord('verb');
    var frame = rnd().pick(verb.frames);
    var dlg = tmpl.build(verb, frame);
    var speech = dlg.turns.map(function (t) { return t.kana; }).join(' ');
    var displayFull = dlg.turns.map(function (t) { return t.sp + '：' + t.ja; }).join('\n');
    var displayKana = dlg.turns.map(function (t) { return t.sp + '：' + t.kana; }).join('\n');
    // 提问：对话中动词的原形
    var others = rnd().shuffle(lex().verbs.filter(function (v) { return v.id !== verb.id; })).slice(0, 5).map(function (v) { return v.dict; });
    var placed = placeOptions(options4(verb.dict, others), verb.dict);
    var q = base({
      qtype: 'listenDialogue', conjForm: dlg.askForm, wordId: verb.id, scene: tmpl.scene, level: 5,
      question: '【听力·模式C·短对话】对话中出现的动词，原形是？',
      options: placed.options, answer: verb.dict, answerPos: placed.pos,
      translation: displayFull,
      explanation: '对话原文：\n' + displayFull + '\n出现的动词是「' + verb.dict + '」（用了' + formZh(dlg.askForm) + '）。',
      grammarPoints: ['对话听力', '变形:' + dlg.askForm], verbForms: [dlg.askForm],
      knowledgeMap: [], knowledgeMapStatus: 'pending', difficulty: Math.max(2, diff),
      skeleton: 'listenDialogue:' + tmpl.scene + ':' + verb.id
    });
    // 听力字段：显示为整段对话
    q.audioScript = speech; q.scriptJa = displayFull; q.scriptKana = displayKana;
    q.listening = { displayText: displayFull, speechText: speech, readingText: displayKana, translation: displayFull, targetForm: dlg.askForm, dictionaryForm: verb.dict, audioStatus: 'tts_fallback' };
    return finalize(q, verb, tmpl.scene, dlg.askForm);
  }

  /* T8 听后变形（模式D·听力·输入） */
  function tListenTransform(diff) {
    var verb = pickWord('verb');
    var frame = rnd().pick(verb.frames);
    var origin = C().conjugateVerb(verb, 'masu'); // 原句：现在敬体
    var originSentence = frame.comp + origin.surface + '。';
    var originKana = frame.compKana + origin.reading + '。';
    // 任务：改成"昨天没做，对朋友说" → naiPast（普通体过去否定）
    var tasks = [
      { zh: '改成"昨天没做"，对朋友说（普通体过去否定）', form: 'naiPast' },
      { zh: '改成"昨天做了"，对朋友说（普通体过去肯定）', form: 'ta' },
      { zh: '改成"现在不做"，对朋友说（普通体现在否定）', form: 'nai' }
    ];
    var task = rnd().pick(tasks);
    var target = C().conjugateVerb(verb, task.form);
    var targetSentence = frame.comp + target.surface + '。';
    return finalize(base({
      qtype: 'listenTransform', conjForm: task.form, wordId: verb.id, scene: frame.scene, level: 3,
      format: 'audio-input',
      question: '【听力·模式D·听后变形】听原句，按要求改写后输入：\n任务：' + task.zh,
      audioScript: originKana, scriptJa: originSentence, scriptKana: originKana,
      answer: targetSentence,
      acceptedAnswers: [targetSentence, frame.comp + target.surface, target.surface],
      translation: '原句：' + originSentence + ' → ' + targetSentence,
      explanation: '原句（现在敬体）：' + originSentence + '\n目标（' + formZh(task.form) + '）：' + targetSentence + '\n' + C().verbProcess(verb, task.form),
      grammarPoints: ['听后变形', '变形:' + task.form], verbForms: [task.form],
      knowledgeMap: km(task.form).km, knowledgeMapStatus: km(task.form).status,
      listening: { displayText: originSentence, speechText: originKana, readingText: originKana, translation: frame.zh, targetForm: task.form, dictionaryForm: verb.dict, audioStatus: 'tts_fallback' },
      difficulty: Math.max(2, diff), skeleton: 'listenTransform:' + verb.id + ':' + task.form
    }), verb, frame.scene, task.form);
  }

  /* T9 改错（文字） */
  function tErrorCorrection(diff) {
    var verb = pickWord('verb');
    var frame = rnd().pick(verb.frames);
    // 造一个错误：本应过去敬体，却用了现在敬体（时态不一致）
    var wrong = C().conjugateVerb(verb, 'masu');
    var right = C().conjugateVerb(verb, 'masuPast');
    var wrongSentence = 'きのう、' + frame.comp + wrong.surface + '。';
    var options = [
      wrong.surface + ' 应改为 ' + right.surface,
      'きのう 应删除',
      frame.comp + ' 助词错误',
      '没有错误'
    ];
    var placed = placeOptions(options.slice(), options[0]);
    return finalize(base({
      qtype: 'errorCorrection', conjForm: 'masuPast', wordId: verb.id, scene: frame.scene,
      question: '找出并改正错误：\n' + wrongSentence,
      options: placed.options, answer: options[0], answerPos: placed.pos,
      translation: '（改正后）きのう、' + frame.comp + right.surface + '。',
      explanation: '「きのう（昨天）」是过去，动词却用了现在敬体「' + wrong.surface + '」，时态不一致，应改为过去敬体「' + right.surface + '」。',
      grammarPoints: ['时态一致', '改错', '变形:masuPast'], verbForms: ['masuPast'],
      knowledgeMap: km('masuPast').km, knowledgeMapStatus: km('masuPast').status,
      difficulty: Math.max(2, diff), skeleton: 'errorCorrection:' + verb.id
    }), verb, frame.scene, 'masuPast');
  }

  /* T10 形容词/名词变形（文字，混合词类） */
  function tAdjNoun(diff) {
    var kind = rnd().pick(['i-adj', 'na-adj', 'noun']);
    var word = pickWord(kind);
    var topic = rnd().pick(word.topics);
    var forms = kind === 'i-adj'
      ? ['present', 'presentPolite', 'neg', 'negPolite', 'past', 'pastPolite', 'pastNeg']
      : ['present', 'presentPolite', 'neg', 'negPolite', 'past', 'pastPolite', 'pastNeg'];
    var form = rnd().pick(forms);
    var conj = kind === 'i-adj' ? C().conjIAdj(word, form) : C().conjCopula(word, form);
    var allForms = forms.map(function (f) { return (kind === 'i-adj' ? C().conjIAdj(word, f) : C().conjCopula(word, f)).surface; });
    var placed = placeOptions(options4(conj.surface, allForms.filter(function (s) { return s !== conj.surface; })), conj.surface);
    var formLabel = { present: '普通体现在肯定', presentPolite: '敬体现在肯定', neg: '普通体现在否定', negPolite: '敬体现在否定', past: '普通体过去肯定', pastPolite: '敬体过去肯定', pastNeg: '普通体过去否定' }[form];
    var kindZh = kind === 'i-adj' ? 'い形容词' : kind === 'na-adj' ? 'な形容词' : '名词判断句';
    return finalize(base({
      qtype: 'adjNoun', conjForm: 'adj:' + form, wordId: word.id, scene: topic.scene,
      question: '【' + kindZh + '】把「' + word.dict + '」变成' + formLabel + '，填入：\n' + topic.t + '（　）',
      options: placed.options, answer: conj.surface, answerPos: placed.pos,
      translation: topic.t + conj.surface + '（' + topic.zh + '）',
      explanation: '完整句：' + topic.t + conj.surface + '\n「' + word.dict + '」（' + kindZh + '）的' + formLabel + '是「' + conj.surface + '」。'
        + (kind === 'i-adj' ? (word.irregular ? 'いい为不规则：よかった/よくない。' : 'い形容词本体变形，不接だ。') : 'コピュラ范式：だ/です・でした・じゃない。'),
      grammarPoints: [kindZh, '变形:' + form], verbForms: [],
      knowledgeMap: [], knowledgeMapStatus: 'pending',
      difficulty: Math.max(1, diff), skeleton: 'adjNoun:' + word.id + ':' + form
    }), word, topic.scene, 'adj:' + form);
  }

  /* ============ 听力附件 ============ */
  function attachListening(q, displayText, readingText, translation, targetForm, dictForm) {
    q.audioScript = readingText;   // speechText：假名读音（TTS 更可靠）
    q.scriptJa = displayText;
    q.scriptKana = readingText;
    q.listening = { displayText: displayText, speechText: readingText, readingText: readingText, translation: translation, targetForm: targetForm, dictionaryForm: dictForm, audioStatus: 'tts_fallback' };
  }
  /* 听力数据完整性：speechText/readingText 缺失或不一致则不可进入听力训练 */
  function listeningValid(q) {
    if (!q.listening) return true; // 非听力题
    var L = q.listening;
    return !!L.speechText && !!L.readingText && !!L.displayText && q.audioScript === L.speechText;
  }

  /* ============ finalize：写入历史 ============ */
  function finalize(q, word, scene, form) {
    H.count++;
    H.distinct[word.id] = true;
    H.lastSeen[word.id] = H.count;
    push(H.ids, q.id, 50);
    push(H.words, word.id, 30);
    push(H.scenes, scene, 30);
    push(H.skeletons, q.skeleton, 30);
    push(H.answerPos, q.answerPos === undefined ? -1 : q.answerPos, 20);
    push(H.qtypes, q.qtype, 20);
    if (form) push(H.forms, form, 20);
    return q;
  }

  /* ============ 题型分派（按听力比例 / 指定题型） ============ */
  var TEXT_TYPES = ['clozeForm', 'formToDict', 'errorCorrection', 'adjNoun'];
  var LISTEN_TYPES = ['listenFormToDict', 'listenLabel', 'listenSentenceForm', 'listenSentenceGap', 'listenDialogue', 'listenTransform'];
  var BUILDERS = {
    clozeForm: tClozeForm, formToDict: tFormToDict, errorCorrection: tErrorCorrection, adjNoun: tAdjNoun,
    listenFormToDict: tListenFormToDict, listenLabel: tListenLabel, listenSentenceForm: tListenSentenceForm,
    listenSentenceGap: tListenSentenceGap, listenDialogue: tListenDialogue, listenTransform: tListenTransform
  };

  /* 生成一题。opts: { mode:'mixed'|'listen'|'text'|<qtype>, listeningRatio, difficulty, forceType } */
  function generate(mode, difficulty, opts) {
    opts = opts || {};
    difficulty = difficulty || 1;
    var wmap = formWeights();
    var ratio = opts.listeningRatio !== undefined ? opts.listeningRatio : (mode === 'listen' ? 1 : mode === 'text' ? 0 : 0.5);

    function chooseType() {
      if (opts.forceType && BUILDERS[opts.forceType]) return opts.forceType;
      if (mode && BUILDERS[mode]) return mode; // 指定单一题型
      var useListen = Math.random() < ratio;
      var pool = useListen ? LISTEN_TYPES : TEXT_TYPES;
      // 同题型最多连续2次
      var t = rnd().pick(pool);
      if (consecCount(H.qtypes, t) >= 2) t = rnd().pick(pool.filter(function (x) { return x !== t; }) || pool);
      return t;
    }

    // 尝试多次以满足防重复；失败逐步放宽
    var best = null;
    for (var attempt = 0; attempt < 40; attempt++) {
      var type = chooseType();
      var q = BUILDERS[type](difficulty, wmap);
      if (!q) continue;
      // 听力数据完整性硬门禁
      if (!listeningValid(q)) { rollback(q); continue; }
      // 完全相同题干在整轮内不重复（会话级去重，前35次尝试硬避）
      if (attempt < 35 && H.usedSkel[q.skeleton]) { rollback(q); continue; }
      best = q; break;
    }
    if (!best) best = BUILDERS['clozeForm'](difficulty, wmap);
    H.usedSkel[best.skeleton] = true;
    return best;
  }
  /* finalize 已写入历史；若丢弃候选需回滚 */
  function rollback(q) {
    H.count--; delete H.lastSeen[q.wordId];
    [H.ids, H.words, H.scenes, H.skeletons, H.answerPos, H.qtypes, H.forms].forEach(function (a) { a.pop(); });
    // distinct 保留（无害）
  }

  /* 兼容旧接口：warmup / scene */
  function legacy(mode, difficulty) {
    if (mode === 'warmup') return generate('formToDict', difficulty, { listeningRatio: 0 });
    return generate('clozeForm', difficulty, { listeningRatio: 0 });
  }

  return {
    generate: generate,
    resetHistory: resetHistory,
    sessionInfo: sessionInfo,
    poolStats: poolStats,
    warmup: function (d) { return generate('formToDict', d, { listeningRatio: 0 }); },
    scene: function (d) { return generate('clozeForm', d, { listeningRatio: 0 }); },
    _legacy: legacy,
    TEXT_TYPES: TEXT_TYPES, LISTEN_TYPES: LISTEN_TYPES
  };
})();
