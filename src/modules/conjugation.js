/* 变形反应引擎（Conjugation Reaction）
 *
 * 覆盖：动词（五段/一段/不规则，含伪一段）、い形容词、な形容词、名词判断句。
 * 活用规则为客观语言事实（辞典可核实）；由本引擎生成的练习是
 * ai_generated_practice（lessonAttribution pending，通用规则模式）。
 *
 * 两个层级（与需求一致）：
 *  - warmup：孤立词→单一变形（食べる→食べて）。占正式训练比例应≤10%
 *    （由组卷器控制），用于速度热身，题目标 warmup=true / conjWarmup。
 *  - scene：把变形放进带人物关系/时间/语体的完整句，作答后解析
 *    "为什么这里用敬体/过去/否定"及原形与变形过程。 */
window.MJT = window.MJT || {};

MJT.conjugation = (function () {

  // 五段词尾映射
  var MASU_STEM = { 'う': 'い', 'く': 'き', 'ぐ': 'ぎ', 'す': 'し', 'つ': 'ち', 'ぬ': 'に', 'ぶ': 'び', 'む': 'み', 'る': 'り' };
  var NAI_STEM = { 'う': 'わ', 'く': 'か', 'ぐ': 'が', 'す': 'さ', 'つ': 'た', 'ぬ': 'な', 'ぶ': 'ば', 'む': 'ま', 'る': 'ら' };
  var TE_SUF = { 'う': 'って', 'つ': 'って', 'る': 'って', 'ぬ': 'んで', 'ぶ': 'んで', 'む': 'んで', 'く': 'いて', 'ぐ': 'いで', 'す': 'して' };
  var TA_SUF = { 'う': 'った', 'つ': 'った', 'る': 'った', 'ぬ': 'んだ', 'ぶ': 'んだ', 'む': 'んだ', 'く': 'いた', 'ぐ': 'いだ', 'す': 'した' };

  function lastChar(s) { return s.charAt(s.length - 1); }
  function stem(s) { return s.slice(0, -1); }

  /* 对一个"以假名结尾的字符串"按五段规则求 masu词干/nai词干/て/た */
  function godanForms(s, teException) {
    var c = lastChar(s), st = stem(s);
    var te = (teException && (s === '行く' || s === 'いく')) ? st + 'って' : st + TE_SUF[c];
    var ta = (teException && (s === '行く' || s === 'いく')) ? st + 'った' : st + TA_SUF[c];
    return { masuStem: st + MASU_STEM[c], naiStem: st + NAI_STEM[c], te: te, ta: ta };
  }

  /* 来る 的读音不规则表（surface 来る按一段处理，reading くる特殊） */
  var KURU = { masu: 'きます', masuNeg: 'きません', masuPast: 'きました', masuPastNeg: 'きませんでした', dict: 'くる', nai: 'こない', naiPast: 'こなかった', ta: 'きた', te: 'きて', teiru: 'きています' };

  /* 对单个字符串（surface 或 reading）求某动词形 */
  function conjVerbStr(s, verb, form) {
    var g = verb.group;
    // 来る 的 reading
    if (g === 'irregular' && (s === 'くる')) return KURU[form];
    // する 与 X+する
    if (g === 'irregular' && (s === 'する' || s.slice(-2) === 'する')) {
      var pre = s.slice(0, -2);
      var suru = { masu: 'します', masuNeg: 'しません', masuPast: 'しました', masuPastNeg: 'しませんでした', dict: 'する', nai: 'しない', naiPast: 'しなかった', ta: 'した', te: 'して', teiru: 'しています' };
      return pre + suru[form];
    }
    // 来る 的 surface（来る，按一段处理但保留汉字）→ 与一段同规则
    if (g === 'ichidan' || (g === 'irregular' && lastChar(s) === 'る' && s !== 'する')) {
      var st = stem(s);
      switch (form) {
        case 'masu': return st + 'ます';
        case 'masuNeg': return st + 'ません';
        case 'masuPast': return st + 'ました';
        case 'masuPastNeg': return st + 'ませんでした';
        case 'dict': return s;
        case 'nai': return st + 'ない';
        case 'naiPast': return st + 'なかった';
        case 'ta': return st + 'た';
        case 'te': return st + 'て';
        case 'teiru': return st + 'ています';
      }
    }
    // godan
    var f = godanForms(s, verb.teException);
    switch (form) {
      case 'masu': return f.masuStem + 'ます';
      case 'masuNeg': return f.masuStem + 'ません';
      case 'masuPast': return f.masuStem + 'ました';
      case 'masuPastNeg': return f.masuStem + 'ませんでした';
      case 'dict': return s;
      case 'nai': return f.naiStem + 'ない';
      case 'naiPast': return f.naiStem + 'なかった';
      case 'ta': return f.ta;
      case 'te': return f.te;
      case 'teiru': return f.te + 'います'; // ています
    }
    return s;
  }

  function conjugateVerb(verb, form) {
    return { surface: conjVerbStr(verb.dict, verb, form), reading: conjVerbStr(verb.reading, verb, form) };
  }

  /* い形容词 */
  function conjIAdj(adj, form) {
    var irregular = adj.irregular; // いい
    function one(s) {
      var base = irregular ? (s.slice(0, -2) + 'よ') : s.slice(0, -1); // よ/字干
      switch (form) {
        case 'present': return s;
        case 'presentPolite': return s + 'です';
        case 'neg': return base + 'くない';
        case 'negPolite': return base + 'くないです';
        case 'past': return base + 'かった';
        case 'pastPolite': return base + 'かったです';
        case 'pastNeg': return base + 'くなかった';
        case 'te': return base + 'くて';
      }
      return s;
    }
    return { surface: one(adj.dict), reading: one(adj.reading) };
  }

  /* な形容词 / 名词：共用コピュラ范式 */
  function conjCopula(word, form) {
    function one(s) {
      switch (form) {
        case 'present': return s + 'だ';
        case 'presentPolite': return s + 'です';
        case 'neg': return s + 'じゃない';
        case 'negPolite': return s + 'じゃないです';
        case 'past': return s + 'だった';
        case 'pastPolite': return s + 'でした';
        case 'pastNeg': return s + 'じゃなかった';
        case 'pastNegPolite': return s + 'じゃありませんでした';
        case 'te': return s + 'で';
      }
      return s;
    }
    return { surface: one(word.dict), reading: one(word.reading) };
  }

  /* 表单元数据（供 UI 与解析） */
  var VERB_FORMS = [
    { id: 'masu', zh: 'ます形（敬体现在肯定）', politeness: 'polite' },
    { id: 'masuNeg', zh: '敬体现在否定（ません）', politeness: 'polite' },
    { id: 'masuPast', zh: '敬体过去肯定（ました）', politeness: 'polite' },
    { id: 'masuPastNeg', zh: '敬体过去否定（ませんでした）', politeness: 'polite' },
    { id: 'dict', zh: '辞书形（普通体现在肯定）', politeness: 'plain' },
    { id: 'nai', zh: 'ない形（普通体现在否定）', politeness: 'plain' },
    { id: 'ta', zh: 'た形（普通体过去肯定）', politeness: 'plain' },
    { id: 'naiPast', zh: 'なかった（普通体过去否定）', politeness: 'plain' },
    { id: 'te', zh: 'て形', politeness: 'neutral' },
    { id: 'teiru', zh: 'ています（进行/状态）', politeness: 'polite' }
  ];

  function lexicon() { return MJT_DATA.conjugationLexicon; }

  /* ===== 变形过程解析（why） ===== */
  function verbProcess(verb, form) {
    var g = verb.group === 'godan' ? '五段' : verb.group === 'ichidan' ? '一段' : '不规则';
    var note = '「' + verb.dict + '（' + verb.reading + '，' + g + '动词' + (verb.fakeIchidan ? '·伪一段' : '') + '）」';
    if (verb.group === 'godan') {
      if (form === 'te' || form === 'ta') note += ' 音便：词尾' + lastChar(verb.dict) + '→' + (form === 'te' ? TE_SUF[lastChar(verb.reading)] : TA_SUF[lastChar(verb.reading)]);
      else if (form.indexOf('masu') === 0) note += ' 连用形：词尾变i段+' + form.replace('masu', 'ます…');
      else if (form.indexOf('nai') === 0) note += ' 未然形：词尾变a段' + (lastChar(verb.reading) === 'う' ? '（う→わ）' : '') + '+ない';
    } else if (verb.group === 'ichidan') {
      note += ' 去る＋对应词尾';
    } else {
      note += ' 不规则活用，需整体记忆';
    }
    if (verb.fakeIchidan) note += '。注意：词形像一段但按五段活用。';
    return note;
  }

  return {
    VERB_FORMS: VERB_FORMS,
    conjugateVerb: conjugateVerb,
    conjIAdj: conjIAdj,
    conjCopula: conjCopula,
    verbProcess: verbProcess,
    lexicon: lexicon,
    _internal: { godanForms: godanForms }
  };
})();
