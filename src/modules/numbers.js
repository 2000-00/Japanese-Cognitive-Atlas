/* 数字专项训练：读法转换器 + 题目生成器
 *
 * 读法数据来自 data/readings.js / data/counters.js（标准日语通用读法，
 * sourceStatus: verified）。生成的每道题都标注：
 *   origin: '基于已验证知识生成的练习示例'
 * 题目不声明教材课程出处（lessonAttribution.status = 'pending'），
 * 属于"通用读法模式"训练内容。 */
window.MJT = window.MJT || {};

MJT.numbers = (function () {
  var R = function () { return MJT_DATA.readings; };
  var rnd = function () { return MJT.random; };

  /* ============ 读法转换器 ============ */

  /* 0–99999 → 假名读法（一般数字：4よん 7なな 9きゅう） */
  function numberToKana(n) {
    if (n === 0) return 'ゼロ';
    var r = R();
    var parts = [];
    var man = Math.floor(n / 10000);
    var sen = Math.floor((n % 10000) / 1000);
    var hyaku = Math.floor((n % 1000) / 100);
    var juu = Math.floor((n % 100) / 10);
    var ichi = n % 10;
    if (man) parts.push(r.tenThousands[man]);
    if (sen) parts.push(r.thousands[sen]);
    if (hyaku) parts.push(r.hundreds[hyaku]);
    if (juu) parts.push((juu === 1 ? '' : r.digits[juu][0]) + 'じゅう');
    if (ichi) parts.push(r.digits[ichi][0]);
    return parts.join('');
  }

  /* 金额 → 假名（个位4读よ：4円よえん、104円ひゃくよえん） */
  function yenToKana(n) {
    var r = R();
    if (n % 10 === 4) {
      var head = n - 4;
      return (head ? numberToKana(head) : '') + 'よ' + r.yen.suffix;
    }
    return numberToKana(n) + r.yen.suffix;
  }

  /* 时间 → 假名。minute 必须是 readings.minutes 的键或 0/30 */
  function timeToKana(hour, minute, opts) {
    opts = opts || {};
    var r = R();
    var s = '';
    if (opts.gozen === true) s += 'ごぜん';
    if (opts.gozen === false) s += 'ごご';
    s += r.hours[hour];
    if (minute === 30 && opts.useHan) s += 'はん';
    else if (minute > 0) s += r.minutes[minute][0];
    if (opts.goro) s += 'ごろ';
    return s;
  }

  function timeLabel(hour, minute, opts) {
    opts = opts || {};
    var mm = minute < 10 ? '0' + minute : String(minute);
    var prefix = opts.gozen === true ? '上午' : (opts.gozen === false ? '下午' : '');
    return prefix + hour + ':' + mm;
  }

  function dateToKana(month, day) {
    var r = R();
    var s = '';
    if (month) s += r.months[month];
    if (day) s += r.days[day];
    return s;
  }

  function counterToKana(counterObj, n) {
    return counterObj.readings[n];
  }

  /* 电话号码 → 假名（の分隔），0ゼロ 4よん 7なな 9きゅう */
  function phoneToKana(groups) {
    var r = R();
    return groups.map(function (g) {
      return String(g).split('').map(function (d) { return r.digits[parseInt(d, 10)][0]; }).join('');
    }).join('の');
  }

  /* ============ 题目公共字段 ============ */
  var seq = 0;
  function baseQuestion(cat, fields) {
    seq++;
    var q = {
      id: 'num-' + cat + '-' + Date.now() + '-' + seq,
      module: 'numbers',
      numberCategory: cat,
      type: 'number-' + cat,
      lesson: null,
      lessonAttribution: { lesson: null, status: 'pending', note: '通用读法训练，不声明教材课程出处' },
      origin: '基于已验证知识生成的练习示例',
      sourceStatus: 'verified',
      sourceType: 'manual_review',
      reviewed: true,
      sourceReference: '标准日语通用读法（辞典可核实）；数值随机生成。',
      knowledgeMap: [],
      knowledgeMapStatus: 'pending',
      grammarPoints: []
    };
    Object.keys(fields).forEach(function (k) { q[k] = fields[k]; });
    return q;
  }

  function finishChoices(correct, distractorList) {
    return rnd().shuffle([correct].concat(distractorList));
  }

  /* ============ 各类别生成器 ============ */

  /* 基础数字 */
  function genBasic(difficulty) {
    var n;
    if (difficulty <= 1) n = rnd().int(1, 100);
    else if (difficulty === 2) n = rnd().int(100, 9999);
    else n = rnd().int(10000, 99999);
    var kana = numberToKana(n);
    var dis = rnd().distractors(n, 3, function () {
      var kind = rnd().int(1, 4);
      if (kind === 1) return n + rnd().pick([-1, 1, -2, 2]) * Math.pow(10, rnd().int(0, Math.max(0, String(n).length - 1)));
      if (kind === 2) return Math.round(n * rnd().pick([10, 0.1]));
      if (kind === 3 && n >= 100) { // 8↔6 百位易混（はっぴゃく/ろっぴゃく）
        var h = Math.floor((n % 1000) / 100);
        if (h === 8) return n - 200; if (h === 6) return n + 200;
        return n + 100;
      }
      return n + rnd().int(-30, 30);
    }, String).filter(function (x) { return x > 0; });
    var fb = 1;
    while (dis.length < 3) {
      if (dis.indexOf(n + fb) === -1 && n + fb !== n) dis.push(n + fb);
      fb++;
    }
    return baseQuestion('basic', {
      format: 'audio-choice',
      audioScript: kana,
      displayJa: String(n),
      kana: kana,
      question: '听读音，选择正确的数字',
      options: finishChoices(String(n), dis.slice(0, 3).map(String)),
      answer: String(n),
      translation: '数字 ' + n,
      explanation: '读音「' + kana + '」= ' + n + '。'
        + (n >= 100 ? '注意音变：300さんびゃく・600ろっぴゃく・800はっぴゃく；3000さんぜん・8000はっせん；1万读いちまん。' : '')
        + '数字听辨的关键是抓住位数词（じゅう/ひゃく/せん/まん）。',
      grammarPoints: ['数字读法'],
      difficulty: difficulty
    });
  }

  /* 时间 */
  function genTime(difficulty) {
    var minuteKeys = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    var hour = rnd().int(1, 12);
    var minute, opts = {};
    if (difficulty <= 1) {
      minute = rnd().pick([0, 30]);
      opts.useHan = minute === 30;
    } else {
      minute = rnd().pick(minuteKeys);
      opts.useHan = minute === 30 && Math.random() < 0.5;
      if (difficulty >= 2) opts.gozen = Math.random() < 0.5;
      if (difficulty >= 3 && Math.random() < 0.3) opts.goro = true;
    }
    var kana = timeToKana(hour, minute, opts);
    var label = timeLabel(hour, minute, opts);
    var dis = rnd().distractors(label, 3, function () {
      var kind = rnd().int(1, 3);
      var h2 = hour, m2 = minute, o2 = { gozen: opts.gozen };
      if (kind === 1) h2 = ((hour + rnd().pick([1, -1, 2]) + 11) % 12) + 1;        // 邻近小时
      else if (kind === 2) m2 = rnd().pick(minuteKeys);                             // 分钟混淆
      else if (opts.gozen !== undefined) o2.gozen = !opts.gozen;                    // 午前/午後
      else h2 = ((hour + 6 + 11) % 12) + 1;
      return timeLabel(h2, m2, o2);
    });
    var notes = [];
    if (hour === 4) notes.push('4時固定读よじ（不读よんじ）');
    if (hour === 7) notes.push('7時固定读しちじ');
    if (hour === 9) notes.push('9時固定读くじ（不读きゅうじ）');
    if (minute === 30 && opts.useHan) notes.push('半（はん）=30分');
    if ([1, 3, 6, 8].indexOf(minute % 10) !== -1 || minute % 10 === 0 && minute > 0) notes.push('分的音变：1/3/6/8/10分→ぷん（いっぷん・さんぷん・ろっぷん・はっぷん・じゅっぷん）');
    if (opts.gozen !== undefined) notes.push('午前（ごぜん）=上午，午後（ごご）=下午');
    if (opts.goro) notes.push('ごろ=大约（时点）');
    return baseQuestion('time', {
      format: 'audio-choice',
      audioScript: kana,
      displayJa: (opts.gozen === true ? '午前' : opts.gozen === false ? '午後' : '') + hour + '時' + (minute ? (opts.useHan ? '半' : minute + '分') : ''),
      kana: kana,
      question: '听读音，选择正确的时间',
      options: finishChoices(label, dis),
      answer: label,
      translation: label,
      explanation: '读音「' + kana + '」= ' + label + '。' + (notes.length ? '要点：' + notes.join('；') + '。' : ''),
      grammarPoints: ['时间读法', '～時～分'],
      difficulty: difficulty
    });
  }

  /* 持续时间 */
  function genDuration(difficulty) {
    var r = R();
    var h = rnd().int(1, difficulty <= 1 ? 5 : 10);
    var half = difficulty >= 2 && Math.random() < 0.4;
    var kana = r.durationHours[h] + (half ? 'はん' : '');
    var label = h + (half ? '.5' : '') + '小时';
    var dis = rnd().distractors(label, 3, function () {
      var h2 = rnd().int(1, 10), half2 = Math.random() < 0.3;
      return h2 + (half2 ? '.5' : '') + '小时';
    });
    return baseQuestion('duration', {
      format: 'audio-choice',
      audioScript: kana,
      displayJa: h + '時間' + (half ? '半' : ''),
      kana: kana,
      question: '听读音，选择正确的持续时间',
      options: finishChoices(label, dis),
      answer: label,
      translation: label,
      explanation: '「～時間（じかん）」表示持续时间，与表示时刻的「～時」不同。'
        + '4時間读よじかん、9時間读くじかん。' + (half ? '「半」加在時間之后=多半小时。' : '')
        + '读音「' + kana + '」= ' + label + '。',
      grammarPoints: ['～時間（持续时间）'],
      difficulty: difficulty
    });
  }

  /* 日期 */
  function genDate(difficulty) {
    var r = R();
    var specialDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 20, 24];
    var day, month = null, weekday = null;
    if (difficulty <= 1) {
      day = rnd().pick(specialDays);
    } else {
      day = Math.random() < 0.6 ? rnd().pick(specialDays) : rnd().int(11, 31);
      month = rnd().int(1, 12);
    }
    if (difficulty >= 3 && Math.random() < 0.5) weekday = rnd().pick(r.weekdays);
    var kana = dateToKana(month, day) + (weekday ? ' ' + weekday.kana : '');
    var label = (month ? month + '月' : '') + day + '日' + (weekday ? '（' + weekday.zh + '）' : '');
    var dis = rnd().distractors(label, 3, function () {
      var kind = rnd().int(1, 3);
      var d2 = day, m2 = month, w2 = weekday;
      if (kind === 1) { // 特殊读法易混对：14↔24、20↔2、1↔10
        var confuse = { 14: 24, 24: 14, 20: 2, 2: 20, 1: 10, 10: 1, 4: 8, 8: 4 };
        d2 = confuse[day] || Math.min(31, Math.max(1, day + rnd().pick([-1, 1])));
      } else if (kind === 2 && month) {
        m2 = ((month + rnd().pick([1, -1, 3]) + 11) % 12) + 1;
      } else {
        d2 = Math.min(31, Math.max(1, day + rnd().pick([-2, 2, 10, -10])));
        if (weekday) w2 = rnd().pick(r.weekdays);
      }
      return (m2 ? m2 + '月' : '') + d2 + '日' + (w2 ? '（' + w2.zh + '）' : '');
    });
    var notes = [];
    if (day <= 10 || day === 14 || day === 20 || day === 24) {
      notes.push(day + '日是特殊读法「' + r.days[day] + '」');
    }
    if (day === 14 || day === 24) notes.push('易混：じゅうよっか（14日）↔にじゅうよっか（24日）');
    if (day === 20 || day === 2) notes.push('易混：はつか（20日）↔ふつか（2日）');
    if (month === 4) notes.push('4月读しがつ'); if (month === 7) notes.push('7月读しちがつ'); if (month === 9) notes.push('9月读くがつ');
    return baseQuestion('date', {
      format: 'audio-choice',
      audioScript: kana,
      displayJa: (month ? month + '月' : '') + day + '日' + (weekday ? ' ' + weekday.ja : ''),
      kana: kana,
      question: '听读音，选择正确的日期',
      options: finishChoices(label, dis),
      answer: label,
      translation: label,
      explanation: '读音「' + kana + '」= ' + label + '。' + (notes.length ? '要点：' + notes.join('；') + '。' : '11日以后除14/20/24外为规则读法（数字+にち）。'),
      grammarPoints: ['日期读法', '～月～日'],
      difficulty: difficulty
    });
  }

  /* 数量词（依据 scope 过滤后的数量词表） */
  function genCounter(difficulty, counterPool) {
    var pool = counterPool && counterPool.length ? counterPool : MJT_DATA.counters;
    var c = rnd().pick(pool);
    var n = rnd().int(1, difficulty <= 1 ? 5 : 10);
    var kana = counterToKana(c, n);
    var label = n + c.counter;
    var dis = rnd().distractors(label, 3, function () {
      var kind = rnd().int(1, 2);
      if (kind === 1) { // 同数量词不同数字
        var n2 = rnd().int(1, 10);
        return n2 + c.counter;
      }
      var c2 = rnd().pick(pool); // 同数字不同数量词
      return n + c2.counter;
    });
    return baseQuestion('counter', {
      format: 'audio-choice',
      audioScript: kana,
      displayJa: label,
      kana: kana,
      question: '听读音，选择正确的数量（' + c.zh + '）',
      options: finishChoices(label, dis),
      answer: label,
      translation: n + ' ' + c.zh,
      explanation: '读音「' + kana + '」= ' + label + '。数量词「' + c.counter + '（' + c.kana + '）」用于' + c.zh + '。'
        + (c.irregularNote ? '读法要点：' + c.irregularNote : '')
        + ' 疑问形：' + c.question.ja + '（' + c.question.kana + '）。'
        + '【课程出处：' + (c.lessonAttribution.status === 'verified' ? '第' + c.lessonAttribution.lesson + '课' : '待核实') + '】',
      grammarPoints: ['数量词：' + c.counter],
      difficulty: difficulty
    });
  }

  /* 日元金额 */
  function genPrice(difficulty) {
    var n;
    if (difficulty <= 1) n = rnd().pick([rnd().int(1, 9) * 10 + rnd().pick([0, 5]), rnd().int(100, 999)]);
    else if (difficulty === 2) n = rnd().int(1, 9) * 1000 + rnd().int(0, 9) * 100 + rnd().pick([0, 10, 50, 80]);
    else n = rnd().int(1, 9) * 10000 + rnd().int(0, 9) * 1000 + rnd().int(0, 9) * 100;
    var kana = yenToKana(n);
    var label = n + '円';
    var dis = rnd().distractors(label, 3, function () {
      var kind = rnd().int(1, 4);
      var m = n;
      if (kind === 1) m = Math.round(n * rnd().pick([10, 0.1]));           // 位数错误
      else if (kind === 2) {                                                // 800↔600 音变易混
        var h = Math.floor((n % 1000) / 100);
        if (h === 8) m = n - 200; else if (h === 6) m = n + 200; else m = n + 100;
      } else if (kind === 3) {                                              // 千位混淆 3000↔8000
        var s = Math.floor((n % 10000) / 1000);
        if (s === 3) m = n + 5000; else if (s === 8) m = n - 5000; else m = n + 1000;
      } else m = n + rnd().pick([-50, 50, -10, 10, 500, -500]);
      return m > 0 ? m + '円' : null;
    });
    var pfb = 1;
    while (dis.length < 3) {
      var cand = (n + pfb * 111) + '円';
      if (dis.indexOf(cand) === -1 && cand !== label) dis.push(cand);
      pfb++;
    }
    return baseQuestion('price', {
      format: 'audio-choice',
      audioScript: kana,
      displayJa: label,
      kana: kana,
      question: '听读音，选择正确的金额',
      options: finishChoices(label, dis.slice(0, 3)),
      answer: label,
      translation: n + ' 日元',
      explanation: '读音「' + kana + '」= ' + label + '。金额听辨要点：先抓位数词まん/せん/ひゃく，再抓音变——'
        + '300さんびゃく・600ろっぴゃく・800はっぴゃく；3000さんぜん・8000はっせん；个位4円读よえん。',
      grammarPoints: ['金额读法', '～円'],
      difficulty: difficulty
    });
  }

  /* 金额进阶：两件商品合计 */
  function genPriceSum(difficulty) {
    var a = rnd().int(1, 8) * 100 + rnd().pick([0, 50]);
    var b = rnd().int(1, 8) * 100 + rnd().pick([0, 50]);
    var total = a + b;
    var kana = 'パンは' + yenToKana(a) + 'です。ぎゅうにゅうは' + yenToKana(b) + 'です。ぜんぶでいくらですか。';
    var label = total + '円';
    var dis = rnd().distractors(label, 3, function () {
      return rnd().pick([a + '円', b + '円', (total + rnd().pick([-100, 100, -50, 50])) + '円', (a + b + 100) + '円']);
    });
    return baseQuestion('price', {
      format: 'audio-choice',
      audioScript: kana,
      displayJa: 'パン' + a + '円＋牛乳' + b + '円',
      kana: kana,
      question: '听对话，一共多少钱？（総金额）',
      options: finishChoices(label, dis),
      answer: label,
      translation: '面包' + a + '日元，牛奶' + b + '日元。一共多少钱？→ ' + total + '日元',
      explanation: '「ぜんぶで」=总共。' + a + '円＋' + b + '円 = ' + total + '円。'
        + '连续金额信息要分别记住再相加，训练目标是听到金额直接形成数量概念。',
      grammarPoints: ['金额读法', 'ぜんぶで（合计）'],
      difficulty: Math.max(2, difficulty)
    });
  }

  /* 电话号码 */
  function genPhone(difficulty) {
    var g1 = '0' + rnd().int(1, 9);
    var g2 = String(rnd().int(1000, 9999));
    var g3 = String(rnd().int(1000, 9999));
    var groups = [g1, g2, g3];
    var kana = phoneToKana(groups);
    var label = groups.join('-');
    var dis = rnd().distractors(label, 3, function () {
      var g2b = g2.split(''), i = rnd().int(0, 3), j = rnd().int(0, 3);
      var tmp = g2b[i]; g2b[i] = g2b[j]; g2b[j] = tmp;
      var alt = [g1, g2b.join(''), g3];
      if (Math.random() < 0.4) {
        var g3b = String((parseInt(g3, 10) + rnd().int(1, 20)) % 10000);
        while (g3b.length < 4) g3b = '0' + g3b;
        alt[2] = g3b;
      }
      return alt.join('-');
    });
    return baseQuestion('phone', {
      format: 'audio-choice',
      audioScript: kana,
      displayJa: label,
      kana: kana,
      question: '听读音，选择正确的电话号码',
      options: finishChoices(label, dis),
      answer: label,
      translation: '电话号码 ' + label,
      explanation: '电话号码逐位读：0ゼロ・4よん・7なな・9きゅう，分隔符读「の」。读音「' + kana + '」。',
      grammarPoints: ['电话号码读法'],
      difficulty: difficulty
    });
  }

  /* ============ 入口 ============ */
  var GENERATORS = {
    basic: genBasic,
    time: genTime,
    date: genDate,
    counter: genCounter,
    price: function (d) { return (d >= 2 && Math.random() < 0.3) ? genPriceSum(d) : genPrice(d); },
    phone: genPhone,
    duration: genDuration
  };

  /* 生成一题。category='mixed' 时按自适应权重挑类别 */
  function generate(category, difficulty, opts) {
    opts = opts || {};
    if (category === 'mixed') {
      var weights = MJT.adaptive.categoryWeights(
        MJT_DATA.meta.numberCategories,
        MJT.errorbook.weaknessByCategory(),
        MJT.stats.overview().byCategory
      );
      category = MJT.random.weightedPick(weights).id;
    }
    var gen = GENERATORS[category];
    if (!gen) return null;
    return gen(difficulty || 1, opts.counterPool);
  }

  return {
    numberToKana: numberToKana,
    yenToKana: yenToKana,
    timeToKana: timeToKana,
    dateToKana: dateToKana,
    counterToKana: counterToKana,
    phoneToKana: phoneToKana,
    generate: generate,
    GENERATORS: GENERATORS
  };
})();
