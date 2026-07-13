/* 场景化数字引擎（听力 Level 2–4 / 场景数字训练的共同地基）
 *
 * 输入：data/numbers/scenario-frames.js 中的句子框架（含 {A}{B} 槽位），
 * 输出：与 session.js 兼容的题目对象——数字进入完整的生活场景句，
 * 干扰项按"真实听错方式"生成（数位颠倒、6800/6080、3:40/4:30、
 * 特殊读法混淆等），且与正确答案同类别、数量级接近、不重复。
 *
 * 生成内容的真实性标注与 numbers.js 相同：
 * 读法为已验证的标准日语（sourceStatus: verified），
 * 不声明教材课程出处（lessonAttribution: pending，通用读法模式）。 */
window.MJT = window.MJT || {};

MJT.scenarioNumbers = (function () {
  var rnd = function () { return MJT.random; };
  var N = function () { return MJT.numbers; };

  /* ============ 槽位取值 ============ */

  function counterById(id) {
    var cs = MJT_DATA.counters;
    for (var i = 0; i < cs.length; i++) if (cs[i].id === 'counter-' + id) return cs[i];
    return null;
  }

  /* 每种槽位返回 { ja, kana, label, cat, raw } */
  var SLOT_MAKERS = {
    time: function (spec) {
      var h = rnd().int(spec.hourMin || 1, spec.hourMax || 11);
      var mins = spec.minutes || [0, 10, 15, 20, 30, 40, 45, 50];
      var m = rnd().pick(mins);
      var useHan = m === 30 && Math.random() < 0.6;
      return {
        cat: 'time', raw: { h: h, m: m },
        ja: h + '時' + (m ? (useHan ? '半' : m + '分') : ''),
        kana: MJT_DATA.readings.hours[h] + (m ? (useHan ? 'はん' : MJT_DATA.readings.minutes[m][0]) : ''),
        label: h + ':' + (m < 10 ? '0' + m : m)
      };
    },
    date: function (spec) {
      var days = spec.days || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 15, 17, 19, 20, 24, 25, 28];
      var d = rnd().pick(days);
      var mo = spec.noMonth ? null : rnd().int(1, 12);
      return {
        cat: 'date', raw: { mo: mo, d: d },
        ja: (mo ? mo + '月' : '') + d + '日',
        kana: N().dateToKana(mo, d),
        label: (mo ? mo + '月' : '') + d + '日'
      };
    },
    counter: function (spec) {
      var c = counterById(spec.counter);
      var n = rnd().int(spec.nMin || 1, spec.nMax || 8);
      return {
        cat: 'counter', raw: { counter: spec.counter, n: n, obj: c },
        ja: n + c.counter, kana: c.readings[n], label: n + c.counter
      };
    },
    price: function (spec) {
      var min = spec.min || 100, max = spec.max || 2000, step = spec.step || 10;
      var v = Math.round(rnd().int(min, max) / step) * step;
      if (v < min) v = min;
      return { cat: 'price', raw: { v: v }, ja: v + '円', kana: N().yenToKana(v), label: v + '円' };
    },
    duration: function (spec) {
      var h = rnd().int(spec.hMin || 1, spec.hMax || 5);
      return {
        cat: 'duration', raw: { h: h },
        ja: h + '時間', kana: MJT_DATA.readings.durationHours[h], label: h + '小时'
      };
    },
    weekday: function () {
      var w = rnd().pick(MJT_DATA.readings.weekdays);
      return { cat: 'weekday', raw: { w: w }, ja: w.ja, kana: w.kana, label: w.zh };
    }
  };

  /* ============ 干扰项：真实听错方式 ============ */

  function timeDistractors(raw, spec) {
    var out = [], h = raw.h, m = raw.m;
    var fmt = function (h2, m2) {
      if (h2 < 1) h2 += 12; if (h2 > 12) h2 -= 12;
      if (m2 < 0) m2 += 60; if (m2 >= 60) m2 -= 60;
      return h2 + ':' + (m2 < 10 ? '0' + m2 : m2);
    };
    // 3時40分 ↔ 4時30分 型（时分互换）
    if (m >= 1 && m <= 12 && m !== h) out.push(fmt(m, h * (m < 10 ? 1 : 1)));
    if (m === 40) out.push(fmt(h + 1, 30));
    if (m === 30) out.push(fmt(h - 1, 40));
    // 相邻小时（しち/いち、く/ろく 听混）
    var confuseHour = { 7: 1, 1: 7, 9: 6, 6: 9, 4: 7 };
    out.push(fmt(confuseHour[h] || h + 1, m));
    out.push(fmt(h - 1, m));
    // 分钟档位错（半↔なし、15↔50 混）
    out.push(fmt(h, m === 0 ? 30 : 0));
    if (m === 15) out.push(fmt(h, 50));
    if (m === 50) out.push(fmt(h, 15));
    return out;
  }

  function dateDistractors(raw) {
    var out = [];
    var confuse = { 14: 24, 24: 14, 20: 2, 2: 20, 1: 10, 10: 1, 4: 8, 8: 4, 6: 3, 17: 7, 19: 9 };
    var mk = function (mo, d) { if (d < 1 || d > 28) return null; return (mo ? mo + '月' : '') + d + '日'; };
    if (confuse[raw.d]) out.push(mk(raw.mo, confuse[raw.d]));
    out.push(mk(raw.mo, raw.d + 1));
    out.push(mk(raw.mo, raw.d - 1));
    if (raw.mo) {
      var mc = { 4: 7, 7: 4, 1: 7, 9: 6 }[raw.mo] || (raw.mo % 12) + 1;
      out.push(mk(mc, raw.d));
    }
    return out.filter(Boolean);
  }

  function counterDistractors(raw) {
    // 规则：数量题只出现相同量词类别 → 同量词不同数
    var out = [], n = raw.n;
    var confuse = { 1: 7, 7: 1, 4: 7, 2: 5, 6: 8, 8: 6, 3: 4 };
    if (confuse[n] && confuse[n] <= 10) out.push(confuse[n] + raw.obj.counter);
    if (n + 1 <= 10) out.push((n + 1) + raw.obj.counter);
    if (n - 1 >= 1) out.push((n - 1) + raw.obj.counter);
    if (n + 2 <= 10) out.push((n + 2) + raw.obj.counter);
    if (n * 2 <= 10) out.push((n * 2) + raw.obj.counter);
    return out;
  }

  function priceDistractors(raw) {
    var v = raw.v, out = [];
    var digits = String(v);
    // 数位颠倒（680→860）——仅在不发生首位塌零时使用（避免 210→12 之类数量级崩坏）
    var rev = digits.split('').reverse().join('');
    if (rev[0] !== '0' && rev !== digits) out.push(parseInt(rev, 10) + '円');
    // 6800 ↔ 6080（十位/百位滑落）
    if (v >= 1000 && v % 1000 >= 100 && v % 100 === 0) {
      var slid = Math.floor(v / 1000) * 1000 + Math.floor((v % 1000) / 100) * 10;
      out.push(slid + '円');
    }
    if (v >= 100 && v < 1000 && v % 100 >= 10) {
      out.push((Math.floor(v / 100) * 1000 + (v % 100)) + '円');
    }
    // 百位 6↔8（ろっぴゃく/はっぴゃく）
    var h = Math.floor((v % 1000) / 100);
    if (h === 6) out.push((v + 200) + '円');
    if (h === 8) out.push((v - 200) + '円');
    // 千位 3↔8（さんぜん/はっせん 不混，但 1000↔7000 いち/しち混）
    var s = Math.floor((v % 10000) / 1000);
    if (s === 1) out.push((v + 6000) + '円');
    if (s === 7) out.push((v - 6000) + '円');
    // 十位错档
    out.push((v + (v >= 1000 ? 100 : 10)) + '円');
    out.push((v - (v >= 1000 ? 100 : 10)) + '円');
    return out.filter(function (x) { return parseInt(x, 10) > 0; });
  }

  function durationDistractors(raw) {
    var out = [], h = raw.h;
    var confuse = { 1: 7, 7: 1, 4: 7, 9: 6, 6: 9 };
    if (confuse[h] && confuse[h] <= 10) out.push(confuse[h] + '小时');
    if (h + 1 <= 10) out.push((h + 1) + '小时');
    if (h - 1 >= 1) out.push((h - 1) + '小时');
    out.push((h + 2 <= 10 ? h + 2 : h - 2) + '小时');
    return out;
  }

  function weekdayDistractors(raw) {
    return MJT_DATA.readings.weekdays
      .filter(function (w) { return w.zh !== raw.w.zh; })
      .map(function (w) { return w.zh; });
  }

  var DISTRACTORS = {
    time: timeDistractors, date: dateDistractors, counter: counterDistractors,
    price: priceDistractors, duration: durationDistractors, weekday: weekdayDistractors
  };

  /* 组装四个同类选项：正确答案 + 同类槽位陷阱 + 真实听错干扰 */
  function buildOptions(correct, slotValues, askKey, spec) {
    var pool = [];
    // 同一音频里另一个同类别信息 = 最强陷阱（规则：至少两个干扰项来自真实听错方式）
    Object.keys(slotValues).forEach(function (k) {
      if (k !== askKey && slotValues[k].cat === correct.cat && slotValues[k].label !== correct.label) {
        pool.push(slotValues[k].label);
      }
    });
    DISTRACTORS[correct.cat](correct.raw, spec).forEach(function (d) { pool.push(d); });
    // 去重、剔除等于正确答案的项
    var seen = {}; seen[correct.label] = true;
    var dis = [];
    pool.forEach(function (d) {
      if (d && !seen[d] && dis.length < 3) { seen[d] = true; dis.push(d); }
    });
    var guard = 0;
    while (dis.length < 3 && guard++ < 30) {
      // 兜底：再生成同类值
      var extra = SLOT_MAKERS[correct.cat === 'weekday' ? 'weekday' : correct.cat](spec || {});
      if (!seen[extra.label]) { seen[extra.label] = true; dis.push(extra.label); }
    }
    return rnd().shuffle([correct.label].concat(dis));
  }

  /* ============ 由框架生成一题 ============ */

  function fill(template, slotValues, field) {
    return template.replace(/\{(\w+)\}/g, function (_, k) {
      return slotValues[k] ? slotValues[k][field] : '';
    });
  }

  var seq = 0;
  function generateFromFrame(frame) {
    var slotValues = {};
    Object.keys(frame.slots).forEach(function (k) {
      var spec = frame.slots[k];
      var guard = 0, v;
      do { v = SLOT_MAKERS[spec.type](spec); guard++; } while (guard < 10 &&
        Object.keys(slotValues).some(function (o) { return slotValues[o].label === v.label; }));
      slotValues[k] = v;
    });
    var qdef = rnd().pick(frame.questions);
    var correct = slotValues[qdef.asks];
    var spec = frame.slots[qdef.asks];
    var options = buildOptions(correct, slotValues, qdef.asks, spec);

    var script = fill(frame.script, slotValues, 'ja');
    var kana = fill(frame.kana, slotValues, 'kana');
    var infoCount = Object.keys(slotValues).length;
    seq++;

    var expl = '原文「' + script + '」（' + kana + '）。'
      + '本题信息点：' + Object.keys(slotValues).map(function (k) {
        return slotValues[k].ja + '（' + slotValues[k].kana + '）';
      }).join('、') + '。'
      + (frame.traps && frame.traps.length ? '易听错位置：' + frame.traps.join('；') + '。' : '')
      + (infoCount > 1 ? '连续信息需要分别记住——问题问的是其中一个，另一个会作为干扰项出现。' : '');

    return {
      id: 'sn-' + frame.id + '-' + Date.now() + '-' + seq,
      module: 'listening',
      frameId: frame.id,
      scenarioId: frame.id,
      sceneName: frame.scene,
      level: frame.level,
      numberCategory: correct.cat === 'weekday' ? 'date' : correct.cat,
      type: 'scenario-number',
      format: 'audio-choice',
      audioScript: kana,
      scriptJa: script,
      scriptKana: kana,
      kana: kana,
      question: '【' + frame.scene + '】' + qdef.q,
      options: options,
      answer: correct.label,
      translation: fill(frame.translation, slotValues, 'label'),
      explanation: expl,
      infoCount: infoCount,
      grammarPoints: frame.grammarPoints || [],
      lesson: null,
      lessonAttribution: { lesson: null, status: 'pending', note: '通用读法场景句，不声明教材课程出处' },
      origin: '基于已验证知识生成的练习示例',
      contentType: 'ai_generated_practice',
      displaySource: '基于已验证知识生成',
      isTextbookOriginal: false,
      sourceStatus: 'verified',
      sourceType: 'manual_review',
      reviewed: true,
      sourceReference: '标准日语通用读法（辞典可核实）嵌入AI编写的场景句；数值随机生成。',
      knowledgeMap: (frame.km || []).map(function (nodeId) {
        var node = null;
        MJT_DATA.knowledgeNodes.forEach(function (n) { if (n.id === nodeId) node = n; });
        return node ? { module: node.module, section: node.zh, node: node.id } : null;
      }).filter(Boolean),
      knowledgeMapStatus: (frame.km && frame.km.length) ? 'verified' : 'pending',
      difficulty: frame.level >= 4 ? 3 : (frame.level === 3 ? 2 : 1)
    };
  }

  /* 挑框架生成：按类别 + 等级过滤，类别可 'mixed'（按弱点权重） */
  function generate(category, level, opts) {
    opts = opts || {};
    var frames = (MJT_DATA.scenarioFrames || []).filter(function (f) {
      if (level && f.level > level) return false;
      if (opts.minLevel && f.level < opts.minLevel) return false;
      if (category && category !== 'mixed' && f.category !== category) return false;
      return true;
    });
    if (!frames.length) return null;
    if (category === 'mixed') {
      var weights = MJT.adaptive.categoryWeights(
        MJT_DATA.meta.numberCategories,
        MJT.errorbook.weaknessByCategory(),
        MJT.stats.overview().byCategory
      );
      var wmap = {};
      weights.forEach(function (w) { wmap[w.id] = w.weight; });
      frames = frames.map(function (f) { return { frame: f, weight: wmap[f.category] || 1 }; });
      return generateFromFrame(rnd().weightedPick(frames).frame);
    }
    return generateFromFrame(rnd().pick(frames));
  }

  return {
    generate: generate,
    generateFromFrame: generateFromFrame,
    buildOptions: buildOptions,
    SLOT_MAKERS: SLOT_MAKERS
  };
})();
