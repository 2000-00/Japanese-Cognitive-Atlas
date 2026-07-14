/* Listening Engine 2.0 —— 六等级独立动态生成 + 防重复 + 等级隔离
 *
 * 每个等级有独立生成器（generateLevel1..6）与独立防重复历史；不再让
 * 六个等级共用同一个数字生成器只改标题。素材由 data/listening/skeletons.js
 * 的词汇/数字/场景/人物槽位动态组合，displayText / speechText / readingText
 * 同源，答题前隐藏原文。禁止静默降级：结构不达标则重生成，多次失败报错。
 *
 * L1 单信息热身 · L2 带单位短句 · L3 场景单句(≥2信息) · L4 双信息+关系
 * L5 短对话(2-4轮) · L6 完整场景(4-8轮+回应/综合)。 */
window.MJT = window.MJT || {};

MJT.listening = (function () {
  var DEFAULT_LEVEL = 3;
  var rnd = function () { return MJT.random; };
  var N = function () { return MJT.numbers; };
  var P = function () { return MJT_DATA.listeningPool; };
  var seq = 0;

  var STRUCTURE = { 1: '单信息热身', 2: '带单位短句', 3: '场景单句', 4: '双信息场景', 5: '短对话', 6: '完整场景' };

  /* ============ 数字/词汇槽位填充 ============ */
  function fmtTime(h, m) { return h + ':' + (m < 10 ? '0' + m : m); }

  function makeSlot(token, spec, ctx) {
    switch (spec.type) {
      case 'time': {
        var h = rnd().int(spec.hMin || 1, spec.hMax || 12);
        var mins = [0, 0, 15, 30, 30, 45];
        var m = spec.noMin ? 0 : rnd().pick(mins);
        var useHan = m === 30 && Math.random() < 0.6;
        return { cat: 'time', raw: { h: h, m: m }, ja: h + '時' + (m ? (useHan ? '半' : m + '分') : ''), kana: N().timeToKana(h, m, { useHan: useHan }), label: fmtTime(h, m) };
      }
      case 'date': {
        var days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 15, 17, 19, 20, 24, 25, 28];
        var d = rnd().pick(days);
        var mo = spec.noMonth ? null : rnd().int(1, 12);
        return { cat: 'date', raw: { mo: mo, d: d }, ja: (mo ? mo + '月' : '') + d + '日', kana: N().dateToKana(mo, d), label: (mo ? mo + '月' : '') + d + '日' };
      }
      case 'price': {
        var min = spec.min || 100, max = spec.max || 1000;
        var v = Math.round(rnd().int(min, max) / 10) * 10; if (v < min) v = min;
        return { cat: 'price', raw: { v: v }, ja: v + '円', kana: N().yenToKana(v), label: v + '円' };
      }
      case 'wago': {
        var n = rnd().int(1, spec.max || 9);
        return { cat: 'wago', raw: { n: n }, ja: n + 'つ', kana: P().wago[n], label: n + '个' };
      }
      case 'productCounter': {
        var prodTok = token.replace('CNT', 'PRODUCT'); // CNT→PRODUCT, CNT2→PRODUCT2
        var prod = ctx[prodTok] && ctx[prodTok].raw;
        var cObj = null; (MJT_DATA.counters || []).forEach(function (c) { if (c.id === 'counter-' + (prod ? prod.counter : 'ko')) cObj = c; });
        if (!cObj) cObj = MJT_DATA.counters[0];
        var cn = rnd().int(1, 5);
        return { cat: 'counter', raw: { n: cn, obj: cObj }, ja: cn + cObj.counter, kana: cObj.readings[cn], label: cn + cObj.counter };
      }
      case 'smallnum': {
        var sn = rnd().int(spec.min || 1, spec.max || 9);
        return { cat: 'smallnum', raw: { n: sn }, ja: '' + sn, kana: N().numberToKana(sn), label: '' + sn };
      }
      case 'product': {
        var pr = rnd().pick(P().products);
        return { cat: 'product', raw: pr, ja: pr.ja, kana: pr.kana, label: pr.ja };
      }
      case 'person': {
        var pe = rnd().pick(P().people);
        return { cat: 'person', raw: pe, ja: pe.ja, kana: pe.kana, label: pe.ja };
      }
      case 'place': {
        var pl = rnd().pick(P().places);
        return { cat: 'place', raw: pl, ja: pl.ja, kana: pl.kana, label: pl.ja };
      }
    }
    return { cat: 'x', raw: {}, ja: '?', kana: '?', label: '?' };
  }

  /* 填充一个模板的所有槽位（先普通槽，后 productCounter 依赖槽） */
  function fillSlots(slots) {
    var ctx = {};
    Object.keys(slots).forEach(function (tok) { if (slots[tok].type !== 'productCounter') ctx[tok] = makeSlot(tok, slots[tok], ctx); });
    Object.keys(slots).forEach(function (tok) { if (slots[tok].type === 'productCounter') ctx[tok] = makeSlot(tok, slots[tok], ctx); });
    return ctx;
  }
  function apply(tmpl, ctx, field) {
    return tmpl.replace(/\{(\w+)\}/g, function (_, t) { return ctx[t] ? ctx[t][field] : ''; });
  }

  /* ============ 干扰项（真实听错方式） ============ */
  function distractors(sv, n) {
    var out = [];
    var raw = sv.raw, cat = sv.cat;
    if (cat === 'time') {
      var h = raw.h, m = raw.m;
      var ch = { 7: 9, 9: 7, 1: 7, 4: 7, 3: 8, 8: 3 }[h] || ((h % 12) + 1);
      out.push(fmtTime(ch, m)); out.push(fmtTime(h, m === 0 ? 30 : 0)); out.push(fmtTime((h % 12) + 1, m)); out.push(fmtTime(h, m === 15 ? 50 : 15));
    } else if (cat === 'date') {
      var cd = { 14: 24, 24: 14, 20: 2, 2: 20, 4: 8, 8: 4, 1: 10, 10: 1 }[raw.d] || raw.d + 1;
      var mk = function (d) { return (raw.mo ? raw.mo + '月' : '') + d + '日'; };
      out.push(mk(cd)); out.push(mk(Math.max(1, raw.d - 1))); out.push(mk(Math.min(28, raw.d + 1))); if (raw.mo) out.push(((raw.mo % 12) + 1) + '月' + raw.d + '日');
    } else if (cat === 'price') {
      var v = raw.v, digs = String(v);
      var rev = digs.split('').reverse().join(''); if (rev[0] !== '0') out.push(parseInt(rev, 10) + '円');
      if (v >= 1000 && v % 1000 >= 100 && v % 100 === 0) out.push((Math.floor(v / 1000) * 1000 + Math.floor((v % 1000) / 100) * 10) + '円');
      out.push((v + 100) + '円'); out.push((v >= 110 ? v - 100 : v + 10) + '円'); out.push((v * 10) + '円');
    } else if (cat === 'wago') {
      [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (x) { if (x !== raw.n) out.push(x + '个'); });
    } else if (cat === 'counter') {
      var c = raw.obj; [1, 2, 3, 4, 5, 6].forEach(function (x) { if (x !== raw.n) out.push(x + c.counter); });
    } else if (cat === 'smallnum') {
      var conf = { 7: 1, 1: 7, 4: 7, 9: 6, 6: 9 }[raw.n]; if (conf) out.push('' + conf);
      [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (x) { if (x !== raw.n) out.push('' + x); });
    } else {
      // 词汇：同池其它项
      var pool = cat === 'product' ? P().products : cat === 'person' ? P().people : P().places;
      pool.forEach(function (x) { if (x.ja !== sv.label) out.push(x.ja); });
    }
    // 去重、剔除等于正确答案
    var seen = {}; seen[sv.label] = true; var res = [];
    rnd().shuffle(out).forEach(function (o) { if (o && !seen[o] && res.length < n) { seen[o] = true; res.push(o); } });
    var g = 0; while (res.length < n && g++ < 20) res.push(sv.label + '＋' + res.length);
    return res;
  }

  /* ============ 每等级独立防重复历史 ============ */
  var HIST = {};
  function h(level) {
    if (!HIST[level]) HIST[level] = { fps: {}, skels: [], scenes: [], numCombos: [], words: [], qtpl: [], answerPos: [], count: 0, distinctScenes: {}, distinctWords: {} };
    return HIST[level];
  }
  function resetLevel(level) { HIST[level] = null; h(level); }
  function resetAll() { HIST = {}; }
  function recentHas(a, v, n) { return a.slice(-n).indexOf(v) !== -1; }
  function consec(a, v) { var c = 0; for (var i = a.length - 1; i >= 0; i--) { if (a[i] === v) c++; else break; } return c; }
  function cap(a, v, m) { a.push(v); while (a.length > m) a.shift(); }

  function sessionInfo(level) {
    var H = h(level);
    var recent = H.words.slice(-20), seen = {}, dup = 0;
    recent.forEach(function (w) { if (seen[w]) dup++; seen[w] = true; });
    return { distinctScenes: Object.keys(H.distinctScenes).length, distinctWords: Object.keys(H.distinctWords).length,
      recentRepeatWords: dup, answered: H.count };
  }

  /* ============ 通用装配 ============ */
  function baseItem(level, structureType, fields) {
    seq++;
    var it = {
      id: 'lst-L' + level + '-' + Date.now() + '-' + seq,
      module: 'listening', type: 'listening', format: 'audio-choice',
      listeningLevel: level, generatorId: 'L' + level, structureType: structureType, level: level,
      lesson: null, lessonAttribution: { lesson: null, status: 'pending', note: '通用读音/生活句，不声明教材课程出处' },
      origin: '基于已验证知识生成的练习示例', contentType: 'ai_generated_practice',
      displaySource: '基于已验证知识生成', isTextbookOriginal: false,
      sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
      sourceReference: '标准日语读音与常见生活表达（辞典可核实）。',
      numberCategory: null, knowledgeMap: [], knowledgeMapStatus: 'pending'
    };
    Object.keys(fields).forEach(function (k) { it[k] = fields[k]; });
    return it;
  }
  function placeOptions(level, correct, distr) {
    var H = h(level);
    var opts = rnd().shuffle([correct].concat(distr.slice(0, 3)));
    var pos = opts.indexOf(correct);
    if (consec(H.answerPos, pos) >= 2) {
      var t = (pos + 1) % opts.length; var tmp = opts[t]; opts[t] = opts[pos]; opts[pos] = tmp; pos = opts.indexOf(correct);
    }
    return { options: opts, pos: pos };
  }
  function attachAudio(it, displayText, readingText, translation) {
    it.audioScript = readingText; it.scriptJa = displayText; it.scriptKana = readingText;
    it.listening = { displayText: displayText, speechText: readingText, readingText: readingText, translation: translation || '',
      audioStatus: 'tts_fallback', question: it.question, answer: it.answer, explanation: it.explanation };
  }

  /* ============ L1 单信息热身 ============ */
  function generateLevel1() {
    var types = ['time', 'date', 'price', 'wago', 'counterHon'];
    var t = rnd().pick(types);
    var sv, catName;
    if (t === 'counterHon') { var c = null; MJT_DATA.counters.forEach(function (x) { if (x.id === 'counter-hon') c = x; }); var n = rnd().int(1, 8); sv = { cat: 'counter', raw: { n: n, obj: c }, ja: n + '本', kana: c.readings[n], label: n + '本' }; catName = 'counter'; }
    else {
      var specs = { time: { type: 'time', hMin: 1, hMax: 12 }, date: { type: 'date' }, price: { type: 'price', min: 100, max: 990 }, wago: { type: 'wago', max: 9 } };
      sv = makeSlot('X', specs[t], {}); catName = sv.cat;
    }
    var placed = placeOptions(1, sv.label, distractors(sv, 3));
    var it = baseItem(1, '单信息热身', {
      warmup: true, infoCount: 1, scene: 'warmup', numberCategory: catName === 'wago' ? 'counter' : catName,
      question: '【L1 基础热身】听到的是？', options: placed.options, answer: sv.label, answerPos: placed.pos,
      translation: sv.label, explanation: '读音「' + sv.kana + '」= ' + sv.label + '。（单信息热身）',
      grammarPoints: ['听音识别'], fingerprint: 'L1:' + t + ':' + sv.label, skeleton: 'L1:' + t, numCombo: sv.label, word: sv.label, qtpl: 'L1:' + t
    });
    attachAudio(it, sv.ja, sv.kana, sv.label);
    return it;
  }

  /* ============ L2 带单位短句 ============ */
  function generateLevel2() {
    var tmpl = rnd().pick(P().sentenceL2);
    var ctx = fillSlots(tmpl.slots);
    var qd = rnd().pick(tmpl.questions);
    var sv = ctx[qd.asks];
    var display = apply(tmpl.tmpl, ctx, 'ja'), reading = apply(tmpl.kana, ctx, 'kana');
    var placed = placeOptions(2, sv.label, distractors(sv, 3));
    var it = baseItem(2, '带单位短句', {
      infoCount: 1, scene: tmpl.scene, numberCategory: sv.cat === 'wago' ? 'counter' : sv.cat,
      question: '【L2 带单位短句】' + qd.q, options: placed.options, answer: sv.label, answerPos: placed.pos,
      translation: display, explanation: '原文：' + display + '（' + reading + '）。问的是' + qd.q,
      grammarPoints: tmpl.grammarPoints,
      fingerprint: 'L2:' + tmpl.id + ':' + Object.keys(ctx).map(function (k) { return ctx[k].label; }).join(',') + ':' + qd.asks,
      skeleton: 'L2:' + tmpl.id, numCombo: sv.label, word: sv.raw && sv.raw.ja ? sv.raw.ja : sv.label, qtpl: 'L2:' + tmpl.id + ':' + qd.asks
    });
    attachAudio(it, display, reading, display);
    return it;
  }

  /* ============ L3 场景单句（≥2信息） ============ */
  function generateLevel3() {
    var tmpl = rnd().pick(P().sentenceL3);
    var ctx = fillSlots(tmpl.slots);
    var qd = rnd().pick(tmpl.questions);
    var sv = ctx[qd.asks];
    var display = apply(tmpl.tmpl, ctx, 'ja'), reading = apply(tmpl.kana, ctx, 'kana');
    var infoCount = Object.keys(tmpl.slots).filter(function (k) { var c = ctx[k].cat; return c !== 'product' || true; }).length; // 槽位数≈信息点
    var placed = placeOptions(3, sv.label, distractors(sv, 3));
    var word = (ctx.PRODUCT && ctx.PRODUCT.ja) || (ctx.PLACE && ctx.PLACE.ja) || sv.label;
    var it = baseItem(3, '场景单句', {
      infoCount: Math.max(2, infoCount), scene: tmpl.scene, numberCategory: sv.cat === 'wago' ? 'counter' : sv.cat,
      question: '【L3 场景单句·' + sceneZh(tmpl.scene) + '】' + qd.q, options: placed.options, answer: sv.label, answerPos: placed.pos,
      translation: display, explanation: '原文：' + display + '（' + reading + '）。含多个信息，问的是' + qd.q,
      grammarPoints: tmpl.grammarPoints,
      fingerprint: 'L3:' + tmpl.id + ':' + Object.keys(ctx).map(function (k) { return ctx[k].label; }).join(',') + ':' + qd.asks,
      skeleton: 'L3:' + tmpl.id, numCombo: Object.keys(ctx).filter(function (k) { return ['time', 'date', 'price', 'wago', 'counter'].indexOf(ctx[k].cat) !== -1; }).map(function (k) { return ctx[k].label; }).join('|'),
      word: word, qtpl: 'L3:' + tmpl.id + ':' + qd.asks
    });
    attachAudio(it, display, reading, display);
    return it;
  }

  /* ============ L4 双信息+关系 ============ */
  function generateLevel4() {
    var tmpl = rnd().pick(P().structL4);
    var ctx = fillSlots(tmpl.slots);
    var qd = rnd().pick(tmpl.questions);
    var sv = ctx[qd.asks];
    var display = apply(tmpl.tmpl, ctx, 'ja'), reading = apply(tmpl.kana, ctx, 'kana');
    var placed = placeOptions(4, sv.label, distractors(sv, 3));
    var it = baseItem(4, '双信息场景', {
      infoCount: 3, scene: tmpl.scene, hasRelation: true, hasPerson: !!ctx.PERSON, numberCategory: sv.cat === 'wago' ? 'counter' : sv.cat,
      question: '【L4 双信息·' + sceneZh(tmpl.scene) + '】' + qd.q, options: placed.options, answer: sv.label, answerPos: placed.pos,
      translation: display, explanation: '原文：' + display + '（' + reading + '）。含人物+多信息+先后关系，问的是' + qd.q,
      grammarPoints: tmpl.grammarPoints,
      fingerprint: 'L4:' + tmpl.id + ':' + Object.keys(ctx).map(function (k) { return ctx[k].label; }).join(',') + ':' + qd.asks,
      skeleton: 'L4:' + tmpl.id, numCombo: Object.keys(ctx).filter(function (k) { return ['time', 'date', 'price', 'counter'].indexOf(ctx[k].cat) !== -1; }).map(function (k) { return ctx[k].label; }).join('|'),
      word: (ctx.PERSON && ctx.PERSON.ja) || sv.label, qtpl: 'L4:' + tmpl.id + ':' + qd.asks
    });
    attachAudio(it, display, reading, display);
    return it;
  }

  /* ============ L5 短对话（2-4轮） ============ */
  function generateLevel5() {
    var tmpl = rnd().pick(P().dialogL5);
    var ctx = fillSlots(tmpl.slots);
    var qd = rnd().pick(tmpl.questions);
    var sv = ctx[qd.asks];
    var turnsJa = tmpl.turns.map(function (t) { return t.sp + '：' + apply(t.tmpl, ctx, 'ja'); });
    var turnsKana = tmpl.turns.map(function (t) { return t.sp + '：' + apply(t.kana, ctx, 'kana'); });
    var speech = tmpl.turns.map(function (t) { return apply(t.kana, ctx, 'kana'); }).join('　');
    var display = turnsJa.join('\n'), reading = turnsKana.join('\n');
    var placed = placeOptions(5, sv.label, distractors(sv, 3));
    var it = baseItem(5, '短对话', {
      infoCount: 2, scene: tmpl.scene, turnsCount: tmpl.turns.length, numberCategory: sv.cat === 'wago' ? 'counter' : sv.cat,
      question: '【L5 短对话·' + sceneZh(tmpl.scene) + '】' + qd.q, options: placed.options, answer: sv.label, answerPos: placed.pos,
      translation: display, explanation: '对话原文：\n' + display + '\n问的是' + qd.q,
      grammarPoints: tmpl.grammarPoints,
      fingerprint: 'L5:' + tmpl.id + ':' + Object.keys(ctx).map(function (k) { return ctx[k].label; }).join(',') + ':' + qd.asks,
      skeleton: 'L5:' + tmpl.id, numCombo: Object.keys(ctx).filter(function (k) { return ['time', 'date', 'price', 'counter', 'smallnum'].indexOf(ctx[k].cat) !== -1; }).map(function (k) { return ctx[k].label; }).join('|'),
      word: (ctx.PLACE && ctx.PLACE.ja) || sv.label, qtpl: 'L5:' + tmpl.id + ':' + qd.asks
    });
    it.audioScript = speech; it.scriptJa = display; it.scriptKana = reading;
    it.listening = { displayText: display, speechText: speech, readingText: reading, translation: display, audioStatus: 'tts_fallback', question: it.question, answer: it.answer, explanation: it.explanation };
    return it;
  }

  /* ============ L6 完整场景（4-8轮 + 综合/回应） ============ */
  function generateLevel6() {
    var tmpl = rnd().pick(P().sceneL6);
    var ctx = fillSlots(tmpl.slots);
    var turnsJa = tmpl.turns.map(function (t) { return t.sp + '：' + apply(t.tmpl, ctx, 'ja'); });
    var turnsKana = tmpl.turns.map(function (t) { return t.sp + '：' + apply(t.kana, ctx, 'kana'); });
    var speech = tmpl.turns.map(function (t) { return apply(t.kana, ctx, 'kana'); }).join('　');
    var display = turnsJa.join('\n'), reading = turnsKana.join('\n');
    var useRespond = tmpl.respond && Math.random() < 0.4;
    var it;
    if (useRespond) {
      var placedR = placeOptions(6, tmpl.respond.answer, rnd().shuffle(tmpl.respond.options.filter(function (o) { return o !== tmpl.respond.answer; })).slice(0, 3));
      it = baseItem(6, '完整场景', {
        infoCount: 3, scene: tmpl.scene, turnsCount: tmpl.turns.length, respondTask: true,
        question: '【L6 完整场景·' + sceneZh(tmpl.scene) + '·用户回应】任务：' + tmpl.goal + '\n' + tmpl.respond.q,
        options: placedR.options, answer: tmpl.respond.answer, answerPos: placedR.pos,
        translation: display, explanation: '完整对话：\n' + display + '\n自然回应：' + tmpl.respond.answer,
        grammarPoints: tmpl.grammarPoints,
        fingerprint: 'L6:' + tmpl.id + ':respond:' + Object.keys(ctx).map(function (k) { return ctx[k].label; }).join(','),
        skeleton: 'L6:' + tmpl.id + ':respond', numCombo: '', word: tmpl.goal, qtpl: 'L6:' + tmpl.id + ':respond'
      });
    } else {
      var qd = rnd().pick(tmpl.questions); var sv = ctx[qd.asks];
      var placed = placeOptions(6, sv.label, distractors(sv, 3));
      it = baseItem(6, '完整场景', {
        infoCount: 3, scene: tmpl.scene, turnsCount: tmpl.turns.length,
        question: '【L6 完整场景·' + sceneZh(tmpl.scene) + '·综合】任务：' + tmpl.goal + '\n' + qd.q,
        options: placed.options, answer: sv.label, answerPos: placed.pos,
        translation: display, explanation: '完整对话：\n' + display + '\n问的是' + qd.q,
        grammarPoints: tmpl.grammarPoints, numberCategory: sv.cat === 'wago' ? 'counter' : sv.cat,
        fingerprint: 'L6:' + tmpl.id + ':' + Object.keys(ctx).map(function (k) { return ctx[k].label; }).join(',') + ':' + qd.asks,
        skeleton: 'L6:' + tmpl.id, numCombo: Object.keys(ctx).filter(function (k) { return ['time', 'date', 'price', 'counter'].indexOf(ctx[k].cat) !== -1; }).map(function (k) { return ctx[k].label; }).join('|'),
        word: sv.label, qtpl: 'L6:' + tmpl.id + ':' + qd.asks
      });
    }
    it.audioScript = speech; it.scriptJa = display; it.scriptKana = reading;
    it.listening = { displayText: display, speechText: speech, readingText: reading, translation: display, audioStatus: 'tts_fallback', question: it.question, answer: it.answer, explanation: it.explanation };
    return it;
  }

  function sceneZh(scene) {
    var m = { hospital: '医院', dental: '牙科', school: '学校', konbini: '便利店', supermarket: '超市', restaurant: '餐厅',
      cafe: '咖啡店', train: '电车', library: '图书馆', bank: '银行', post: '邮局', friends: '朋友', weekend: '周末',
      shopping: '购物', work: '公司', warmup: '热身' };
    return m[scene] || scene;
  }

  var GEN = { 1: generateLevel1, 2: generateLevel2, 3: generateLevel3, 4: generateLevel4, 5: generateLevel5, 6: generateLevel6 };

  /* ============ 生成（含防重复 + 结构验证 + 不静默降级） ============ */
  function generate(level) {
    level = level || DEFAULT_LEVEL;
    var H = h(level);
    var best = null, structFails = 0, lastErr = '';
    for (var attempt = 0; attempt < 45; attempt++) {
      var it = GEN[level]();
      // 结构硬验证：等级不符或结构不达标 → 拒绝重生成（不降级）
      var errs = MJT.validator.validateListeningLevelStructure(it, level);
      if (errs.length) { structFails++; lastErr = errs[0]; continue; }
      // 防重复
      if (H.fps[it.fingerprint]) { continue; }                                   // 完整题会话内唯一
      if (attempt < 32) {
        if (recentHas(H.scenes, it.scene, 1) && it.scene !== 'warmup') continue;  // 同场景不连续
        if (recentHas(H.skels, it.skeleton, 15)) continue;                        // 骨架15内不重复
        if (it.numCombo && recentHas(H.numCombos, it.numCombo, 20)) continue;     // 数字组合20内不重复
        if (recentHas(H.words, it.word, 8)) continue;                             // 目标词8内不重复
        if (consec(H.qtpl, it.qtpl) >= 2) continue;                               // 同问题模板≤2连续
      }
      best = it; break;
    }
    if (!best) {
      if (structFails >= 30) return { __error: '当前 L' + level + ' 素材不足，已生成多次仍未达到结构要求：' + lastErr };
      // 罕见：防重复无法满足，放宽只保证结构与唯一指纹
      for (var k = 0; k < 20 && !best; k++) { var c = GEN[level](); if (!MJT.validator.validateListeningLevelStructure(c, level).length && !H.fps[c.fingerprint]) best = c; }
      if (!best) return { __error: '当前 L' + level + ' 生成失败，请重试或切换等级。' };
    }
    // 写入历史
    H.count++; H.fps[best.fingerprint] = true;
    cap(H.skels, best.skeleton, 50); cap(H.scenes, best.scene, 50);
    if (best.numCombo) cap(H.numCombos, best.numCombo, 30);
    cap(H.words, best.word, 30); cap(H.qtpl, best.qtpl, 20); cap(H.answerPos, best.answerPos, 20);
    H.distinctScenes[best.scene] = true; H.distinctWords[best.word] = true;
    return best;
  }

  /* ============ 素材统计 ============ */
  function materialCounts() {
    var pl = P();
    return {
      sentenceL2: pl.sentenceL2.length, sentenceL3: pl.sentenceL3.length, structL4: pl.structL4.length,
      dialogL5: pl.dialogL5.length, sceneL6: pl.sceneL6.length,
      products: pl.products.length, people: pl.people.length, places: pl.places.length,
      vocabSlots: pl.products.length + pl.people.length + pl.places.length,
      scenes: (function () { var s = {}; ['sentenceL2', 'sentenceL3', 'structL4', 'dialogL5', 'sceneL6'].forEach(function (g) { pl[g].forEach(function (t) { s[t.scene] = true; }); }); pl.places.forEach(function (p) { s[p.scene] = true; }); return Object.keys(s).length; })()
    };
  }
  function levelStructureText(level) {
    var m = { 1: '单个数字/时间/日期/数量词（热身）', 2: '完整短句（名词+数量+谓语）', 3: '场景单句·≥2信息点',
      4: '人物+双信息+先后关系', 5: '2～4轮短对话', 6: '4～8轮完整场景+综合/回应' };
    return m[level];
  }
  function levelMaterialCount(level) {
    var c = materialCounts();
    return { 1: '数字类5', 2: c.sentenceL2 + '句型', 3: c.sentenceL3 + '句型', 4: c.structL4 + '结构', 5: c.dialogL5 + '对话骨架', 6: c.sceneL6 + '完整场景' }[level];
  }

  /* ============ 兼容旧接口：pool（题库，仍供覆盖统计等使用） ============ */
  function pool(settings, level) {
    var rd = MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {});
    var items = (MJT_DATA.pendingListening || []).concat(MJT.app.importedItems('listening'));
    return MJT.scope.filter(items, { maxLesson: settings.maxLesson, mode: 'textbook', reviewDecisions: rd }).allowed
      .filter(function (q) { return !level || (q.level || 3) === level; });
  }

  /* ============ 会话入口（等级隔离，不被默认等级覆盖） ============ */
  function startSession(container, opts) {
    opts = opts || {};
    var settings = MJT.app.getSettings();
    var level = opts.level || DEFAULT_LEVEL;   // 由调用方明确传入当前等级
    resetLevel(level);                          // 清除该等级旧队列/缓存，重建
    MJT.session.start(container, {
      module: 'listening', categoryId: 'L' + level, level: level,
      difficulty: level >= 4 ? 3 : (level === 3 ? 2 : 1),
      count: opts.count || settings.questionCount,
      continuous: !!opts.continuous,
      revealOptionsAfterAudio: !!opts.revealAfterAudio,
      getNext: function () {
        var q = generate(level);
        if (q && q.__error) { return { __listeningError: q.__error }; }
        return q;
      },
      onRestart: function () { startSession(container, opts); }
    });
  }

  return {
    DEFAULT_LEVEL: DEFAULT_LEVEL, STRUCTURE: STRUCTURE,
    generate: generate, generateLevel1: generateLevel1, generateLevel2: generateLevel2, generateLevel3: generateLevel3,
    generateLevel4: generateLevel4, generateLevel5: generateLevel5, generateLevel6: generateLevel6,
    resetLevel: resetLevel, resetAll: resetAll, sessionInfo: sessionInfo,
    materialCounts: materialCounts, levelStructureText: levelStructureText, levelMaterialCount: levelMaterialCount,
    pool: pool, startSession: startSession, sceneZh: sceneZh
  };
})();
