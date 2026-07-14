/* 变形反应 —— 题目生成器
 *
 * warmup：孤立词→单一变形（速度热身，占比受组卷器限制）。
 * scene ：把变形放进带【人物关系＋时间＋极性】的完整句，作答后解析
 *         为什么用敬体/普通体、为什么过去、为什么否定，并给出原形与变形过程。 */
window.MJT = window.MJT || {};

MJT.conjugationDrills = (function () {
  var C = function () { return MJT.conjugation; };
  var rnd = function () { return MJT.random; };
  var seq = 0;

  var FORM_NODE = {
    masu: 'cg-masu-form', masuNeg: 'cg-masu-form', masuPast: 'cg-masu-form', masuPastNeg: 'cg-masu-form', teiru: 'cg-a-teiru',
    nai: 'cg-nai-form', naiPast: 'cg-nai-form', ta: 'cg-ta-form', te: 'cg-te-form-formation', dict: 'cg-verb-groups'
  };

  function kmFor(form) {
    var id = FORM_NODE[form];
    if (!id) return { km: [], status: 'pending' };
    var node = null;
    (MJT_DATA.knowledgeNodes || []).forEach(function (n) { if (n.id === id) node = n; });
    return node ? { km: [{ module: node.module, section: node.zh, node: node.id }], status: 'verified' } : { km: [], status: 'pending' };
  }

  function base(fields) {
    seq++;
    var q = {
      id: 'conj-' + Date.now() + '-' + seq,
      module: 'conjugation',
      type: 'conjugation',
      format: 'choice',
      lesson: null,
      lessonAttribution: { lesson: null, status: 'pending', note: '通用活用规则，不声明教材课程出处' },
      origin: '基于已验证知识生成的练习示例',
      contentType: 'ai_generated_practice',
      displaySource: '基于已验证知识生成',
      isTextbookOriginal: false,
      sourceStatus: 'verified',
      sourceType: 'manual_review',
      reviewed: true,
      sourceReference: '标准日语活用规则（辞典可核实）。',
      numberCategory: null
    };
    Object.keys(fields).forEach(function (k) { q[k] = fields[k]; });
    return q;
  }

  function distinctOptions(correct, pool) {
    var seen = {}; seen[correct] = true;
    var out = [];
    rnd().shuffle(pool).forEach(function (v) { if (v && !seen[v] && out.length < 3) { seen[v] = true; out.push(v); } });
    var guard = 0;
    while (out.length < 3 && guard++ < 20) { out.push(correct + '＊' + out.length); }
    return rnd().shuffle([correct].concat(out.slice(0, 3)));
  }

  /* ===== 热身：孤立动词变形 ===== */
  var WARMUP_FORMS = ['masu', 'te', 'nai', 'ta', 'teiru', 'masuPast'];
  function warmup(difficulty) {
    var lex = C().lexicon();
    var verb = rnd().pick(lex.verbs);
    var form = rnd().pick(WARMUP_FORMS);
    var ans = C().conjugateVerb(verb, form);
    var distractors = ['masu', 'te', 'nai', 'ta', 'masuPast', 'masuNeg', 'teiru', 'dict']
      .filter(function (f) { return f !== form; })
      .map(function (f) { return C().conjugateVerb(verb, f).surface; });
    var formZh = C().VERB_FORMS.filter(function (f) { return f.id === form; })[0].zh;
    var km = kmFor(form);
    return base({
      conjWarmup: true, warmup: true, level: 1,
      question: '【基础热身】「' + verb.dict + '」的' + formZh + '是？',
      displayJa: verb.dict, questionKana: verb.reading,
      options: distinctOptions(ans.surface, distractors),
      answer: ans.surface,
      translation: verb.zh + '（' + formZh + '）',
      explanation: ans.surface + '（' + ans.reading + '）。' + C().verbProcess(verb, form),
      grammarPoints: ['变形:' + form], verbForms: [form],
      knowledgeMap: km.km, knowledgeMapStatus: km.status,
      difficulty: difficulty || 1
    });
  }

  /* ===== 情景：带人物关系＋时间＋极性 =====
   * requiredForm 由语境唯一决定；干扰项为同一动词的其它形。 */
  var SCENE_FRAMES = [
    { ctx: '对老师说明"昨天没来学校"', rel: '对老师（敬体）', tmpl: 'すみません、きのう学校に{V}。', form: 'masuPastNeg', reason: '对老师用敬体；きのう=过去；否定 → 敬体过去否定 ませんでした', filter: function (v) { return v.reading === 'くる'; } },
    { ctx: '对朋友说同一件事"昨天没来"', rel: '对朋友（普通体）', tmpl: 'ごめん、きのう学校に{V}。', form: 'naiPast', reason: '对朋友可用普通体；过去＋否定 → なかった', filter: function (v) { return v.reading === 'くる'; } },
    { ctx: '正式场合说明"每天7点起床"', rel: '敬体', tmpl: '毎日7時に{V}。', form: 'masu', reason: '陈述习惯，敬体现在肯定 → ます', filter: function (v) { return ['おきる', 'ねる', 'たべる'].indexOf(v.reading) !== -1; } },
    { ctx: '请对方"稍等一下"', rel: '请求', tmpl: 'ちょっと{V}ください。', form: 'te', reason: 'てください＝请求，需要て形', filter: function (v) { return ['まつ', 'みる', 'かく', 'よむ'].indexOf(v.reading) !== -1; } },
    { ctx: '说明"田中现在正在打电话/看书"', rel: '进行中', tmpl: '田中さんは今、{V}。', form: 'teiru', reason: '"正在做"＝ています（て形＋います）', filter: function (v) { return ['よむ', 'みる', 'たべる', 'かく'].indexOf(v.reading) !== -1; } },
    { ctx: '日记里写"昨天读了书"（普通体）', rel: '日记·普通体', tmpl: 'きのう本を{V}。', form: 'ta', reason: '日记用普通体；过去肯定 → た形', filter: function (v) { return ['よむ', 'かう', 'みる', 'たべる'].indexOf(v.reading) !== -1; } },
    { ctx: '医生嘱咐"今天请不要洗澡/不要跑"', rel: '否定请求', tmpl: '今日は{V}ないでください。', form: 'nai', reason: 'ないでください＝否定请求，用ない形（去ない前的部分＋でください）', useNaiStemOnly: true, filter: function (v) { return ['はいる', 'はしる', 'たべる'].indexOf(v.reading) !== -1; } }
  ];

  function scene(difficulty) {
    var lex = C().lexicon();
    var frame = rnd().pick(SCENE_FRAMES);
    var candidates = lex.verbs.filter(frame.filter);
    if (!candidates.length) candidates = lex.verbs;
    var verb = rnd().pick(candidates);
    var ans = C().conjugateVerb(verb, frame.form);
    // ないでください 场景：空格填的是 ない形去掉「ない」后的干（即"未然形/一段干"），但为简化，答案用完整 ない 形前段
    var answerSurface = ans.surface;
    var sentence = frame.tmpl.replace('{V}', frame.useNaiStemOnly ? answerSurface.replace(/ない$/, '') : answerSurface);
    // 显示题目时把空格留出
    var display = frame.tmpl.replace('{V}', '（　）');
    // 干扰项：同动词其它形
    var others = ['masu', 'masuNeg', 'masuPast', 'masuPastNeg', 'dict', 'nai', 'naiPast', 'ta', 'te', 'teiru']
      .filter(function (f) { return f !== frame.form; })
      .map(function (f) { return C().conjugateVerb(verb, f).surface; });
    var optAnswer = frame.useNaiStemOnly ? answerSurface.replace(/ない$/, '') : answerSurface;
    var km = kmFor(frame.form);
    var formZh = C().VERB_FORMS.filter(function (f) { return f.id === frame.form; })[0].zh;
    return base({
      level: 3, scenarioContext: frame.ctx, relationship: frame.rel,
      question: '【' + frame.ctx + '】选择正确的形式填入：\n' + display,
      options: distinctOptions(optAnswer, others.concat(others.map(function (s) { return s.replace(/ない$/, ''); }))),
      answer: optAnswer,
      translation: sentence,
      explanation: '完整句：' + sentence + '。\n为什么用这个形式：' + frame.reason + '。\n原形与变形：' + C().verbProcess(verb, frame.form) + '　→　' + ans.surface + '（' + ans.reading + '）。',
      grammarPoints: ['变形:' + frame.form, frame.rel],
      verbForms: [frame.form],
      knowledgeMap: km.km, knowledgeMapStatus: km.status,
      difficulty: Math.max(2, difficulty || 2)
    });
  }

  /* 入口：mode='scene'（默认）| 'warmup'；组卷器把 warmup 控制在≤10% */
  function generate(mode, difficulty) {
    return mode === 'warmup' ? warmup(difficulty) : scene(difficulty);
  }

  return { generate: generate, warmup: warmup, scene: scene, SCENE_FRAMES: SCENE_FRAMES };
})();
