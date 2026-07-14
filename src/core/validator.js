/* 数据验证器
 *
 * 在应用启动时对全部题库数据运行；验证失败的条目不进入正式训练。
 * 验证结果（各状态数量、失败原因、最近验证时间）显示在"数据审核"页。 */
window.MJT = window.MJT || {};

MJT.validator = (function () {
  var FORBIDDEN_LABELS = ['教材原句'];

  function isArray(x) { return Object.prototype.toString.call(x) === '[object Array]'; }
  function isNonEmptyString(x) { return typeof x === 'string' && x.trim().length > 0; }

  /* 校验单个题目条目，返回错误信息数组（空数组=通过） */
  function validateItem(item, ctx) {
    var errors = [];
    var meta = (window.MJT_DATA && MJT_DATA.meta) || {};
    var statusValues = meta.sourceStatusValues || ['verified', 'pending', 'rejected'];
    var typeValues = meta.sourceTypeValues || ['user_material', 'official_material', 'manual_review', 'unknown'];
    var hardMax = meta.lessonMax || 21;

    if (!isNonEmptyString(item.id)) errors.push('缺少 id');
    if (ctx && ctx.seenIds) {
      if (ctx.seenIds[item.id]) errors.push('重复 id: ' + item.id);
      ctx.seenIds[item.id] = true;
    }

    // 来源状态
    if (!item.sourceStatus) errors.push('缺少来源状态 sourceStatus');
    else if (statusValues.indexOf(item.sourceStatus) === -1) errors.push('非法 sourceStatus: ' + item.sourceStatus);
    if (item.sourceType && typeValues.indexOf(item.sourceType) === -1) errors.push('非法 sourceType: ' + item.sourceType);
    // unknown 来源不得为 verified
    if (item.sourceType === 'unknown' && item.sourceStatus === 'verified') {
      errors.push('unknown 来源不得标记为 verified');
    }

    // 课程编号
    var lm = MJT.scope.maxLessonOf(item);
    if (lm === null) {
      // 允许 lesson 为 null，但必须带 lessonAttribution 说明待核实
      if (!item.lessonAttribution) errors.push('缺少课程编号且无 lessonAttribution 说明');
    } else {
      if (typeof lm !== 'number' || isNaN(lm)) errors.push('课程编号类型错误');
      else if (lm > hardMax) errors.push('课程编号 ' + lm + ' 超过第' + hardMax + '课');
      else if (lm < 1) errors.push('课程编号 ' + lm + ' 小于1');
    }

    // 题目内容完整性（对题目类条目）
    if (ctx && ctx.kind === 'question') {
      if (!isNonEmptyString(item.question) && !isNonEmptyString(item.textJa)) errors.push('缺少题干');
      if (item.options !== undefined && (!isArray(item.options) || item.options.length < 2) && !isArray(item.questions)) {
        errors.push('选项缺失或少于2个');
      }
      if (item.answer === undefined && !isArray(item.questions)) errors.push('缺少答案');
      if (!isNonEmptyString(item.explanation) && !isArray(item.questions)) errors.push('缺少解析');
      if (!isArray(item.grammarPoints) && !isArray(item.knowledgePoints) && !isArray(item.questions)) {
        errors.push('缺少知识点标签');
      }
      // 选项中必须包含正确答案
      if (isArray(item.options) && item.answer !== undefined && item.options.indexOf(item.answer) === -1) {
        errors.push('选项中不包含正确答案');
      }
    }

    // 禁止声称教材原文
    var textFields = [item.origin, item.sourceReference, item.explanation, item.question];
    textFields.forEach(function (f) {
      if (typeof f !== 'string') return;
      FORBIDDEN_LABELS.forEach(function (bad) {
        if (f.indexOf(bad) !== -1) errors.push('禁止使用"' + bad + '"标签（本项目不保存可核实的教材原文）');
      });
    });

    // 知识图谱映射校验：引用的节点必须真实存在于 Atlas 索引中
    if (isArray(item.knowledgeMap) && item.knowledgeMap.length > 0) {
      var nodes = (window.MJT_DATA && MJT_DATA.knowledgeNodes) || [];
      var ids = {};
      nodes.forEach(function (n) { ids[n.id] = true; });
      item.knowledgeMap.forEach(function (km) {
        if (!ids[km.node]) errors.push('knowledgeMap 引用了图谱中不存在的节点: ' + km.node);
      });
      if (item.knowledgeMapStatus !== 'verified' && item.knowledgeMapStatus !== 'pending') {
        errors.push('缺少 knowledgeMapStatus');
      }
    }

    // 空字段检查
    Object.keys(item).forEach(function (k) {
      if (item[k] === '' && k !== 'sourceReference' && k !== 'audioUrl' && k !== 'questionKana') {
        errors.push('空字段: ' + k);
      }
    });

    return errors;
  }

  /* ============ 场景验证 ============ */
  function validateScenario(sc, ctx) {
    var errors = validateItem(sc, { kind: 'knowledge', seenIds: ctx && ctx.seenIds });
    if (!isArray(sc.steps) || sc.steps.length === 0) errors.push('场景步骤为空');
    else {
      var listenCount = 0, infoQ = 0, respondQ = 0, stepIds = {};
      sc.steps.forEach(function (st) {
        if (!st.stepId) errors.push('步骤缺少 stepId');
        else if (stepIds[st.stepId]) errors.push('重复 stepId: ' + st.stepId);
        else stepIds[st.stepId] = true;
        if (st.script) {
          listenCount++;
          if (!st.furiganaText) errors.push(st.stepId + ' 缺少假名');
          if (!st.translation) errors.push(st.stepId + ' 缺少翻译');
        }
        if (st.interactionType === 'choose' || st.interactionType === 'input') {
          infoQ++;
          if (!st.question) errors.push(st.stepId + ' 缺少问题');
          if (st.answer === undefined) errors.push(st.stepId + ' 缺少答案');
          if (!st.explanation) errors.push(st.stepId + ' 缺少解析');
          if (st.options && optionErrors(st.options, st.answer).length) {
            errors = errors.concat(optionErrors(st.options, st.answer).map(function (e) { return st.stepId + ' ' + e; }));
          }
        }
        if (st.interactionType === 'respond') {
          respondQ++;
          if (!st.acceptedAnswers || !st.acceptedAnswers.length) errors.push(st.stepId + ' 用户回应缺少可接受答案 acceptedAnswers');
        }
      });
      if (listenCount < 3) errors.push('对话轮数不足3轮（' + listenCount + '）');
      if (listenCount > 8) errors.push('对话超过8轮');
      if (infoQ < 2) errors.push('理解问题少于2个');
      if (infoQ + respondQ > 5 + 1) errors.push('理解问题超过上限');
      if (respondQ < 1) errors.push('缺少用户回应步骤');
      if (!sc.review || !sc.review.lineNotes) errors.push('缺少场景完整解析（review.lineNotes）');
      if (!isArray(sc.reinforcement) || !sc.reinforcement.length) errors.push('缺少迁移强化（reinforcement）');
      if (!sc.goal) errors.push('缺少生活任务（goal）');
      if ((sc.extendedVocab || []).length > 5) errors.push('扩展词汇超过5个（' + sc.extendedVocab.length + '）');
      (sc.extendedVocab || []).forEach(function (w) {
        if (!w.kana || !w.zh || !w.reason) errors.push('扩展词汇 ' + (w.word || '?') + ' 缺少假名/中文/出现原因');
        if (w.scope !== 'extended_basic') errors.push('扩展词汇 ' + (w.word || '?') + ' 缺少 extended_basic 标记');
      });
      if (sc.contentType !== 'ai_generated_practice') errors.push('缺少 contentType: ai_generated_practice 标记');
      if (sc.isTextbookOriginal !== false) errors.push('AI生成场景必须 isTextbookOriginal: false');
      if (sc.lessonRange && sc.lessonRange.max > (MJT_DATA.meta.lessonMax || 21)) errors.push('lessonRange 超过第21课');
    }
    return errors;
  }

  /* 选项规则（第八节）：同类别、不重复、含正确答案、数量级接近 */
  function optionErrors(options, answer) {
    var errors = [];
    if (!isArray(options) || options.length < 3) { errors.push('选项少于3个'); return errors; }
    if (new Set(options).size !== options.length) errors.push('选项重复');
    if (options.indexOf(answer) === -1) errors.push('选项不含正确答案');
    // 同类别：按可解析出的类型归类（金额/时间/日期/纯数字量词）
    var typeOf = function (s) {
      s = String(s);
      if (/円/.test(s)) return 'price';
      if (/^\d{1,2}:\d{2}/.test(s) || /時|点/.test(s)) return 'time';
      if (/月|日|星期|周/.test(s)) return 'date';
      return 'other';
    };
    var t0 = typeOf(options[0]);
    var mixed = options.some(function (o) { return typeOf(o) !== t0; });
    if (mixed && t0 !== 'other') errors.push('选项类别不一致');
    // 金额数量级：最大/最小差异不超过 100 倍
    if (t0 === 'price') {
      var nums = options.map(function (o) { return parseInt(String(o).replace(/[^0-9]/g, ''), 10); }).filter(function (n) { return n > 0; });
      if (nums.length && Math.max.apply(null, nums) / Math.min.apply(null, nums) > 100) errors.push('金额选项数量级差异过大');
    }
    return errors;
  }

  /* 框架验证：Level 规则（L2+完整句、L4+双信息） */
  function validateFrame(f) {
    var errors = [];
    if (!f.id) errors.push('框架缺少 id');
    if (!f.script || f.script.indexOf('{') === -1) errors.push(f.id + ' 缺少含槽位的句子');
    if (!f.kana) errors.push(f.id + ' 缺少假名模板');
    if (!f.questions || !f.questions.length) errors.push(f.id + ' 缺少提问');
    var slotCount = Object.keys(f.slots || {}).length;
    if (f.level >= 3 && (f.script || '').replace(/\{\w+\}/g, '').length < 5) errors.push(f.id + ' Level3+ 必须是完整场景句');
    if (f.level >= 4 && slotCount < 2) errors.push(f.id + ' Level4+ 必须包含两个以上信息点');
    (f.questions || []).forEach(function (q) {
      if (!f.slots[q.asks]) errors.push(f.id + ' 提问指向不存在的槽位 ' + q.asks);
    });
    (f.km || []).forEach(function (nodeId) {
      var found = (MJT_DATA.knowledgeNodes || []).some(function (n) { return n.id === nodeId; });
      if (!found) errors.push(f.id + ' 引用不存在的图谱节点 ' + nodeId);
    });
    return errors;
  }

  /* ============ Listening Engine 2.0 等级结构硬验证 ============
   * 校验单条动态生成的听力题是否达到其"声明等级"的结构标准。
   * 供 MJT.listening.generate() 在出题前调用：任一错误 → 该题拒绝、
   * 重新生成，绝不静默降级为更简单的题。expectedLevel 为当前所选等级，
   * 生成题的 listeningLevel 与之不符时直接拒绝。 */
  function validateListeningLevelStructure(item, expectedLevel) {
    var errors = [];
    if (!item) return ['空题目'];
    var lvl = item.listeningLevel;
    if (typeof lvl !== 'number') { errors.push('缺少 listeningLevel'); return errors; }
    if (expectedLevel !== undefined && expectedLevel !== null && lvl !== expectedLevel) {
      // 等级不符是致命错误：直接拒绝，不再检查其它结构（不得降级）
      return ['等级不符：生成为 L' + lvl + '，当前要求 L' + expectedLevel];
    }
    if (item.generatorId !== 'L' + lvl) errors.push('generatorId 与等级不一致（' + item.generatorId + ' vs L' + lvl + '）');
    if (!isNonEmptyString(item.structureType)) errors.push('缺少 structureType');

    var display = (item.listening && item.listening.displayText) || item.scriptJa || '';
    var info = item.infoCount || 0;
    var hasPredicate = /(です|ます|でした|ました|ください|ましょう|ですか|ますか|ません|ください)/.test(display);
    var nonDigitLen = display.replace(/[\s\n。、！？!?.：:0-9０-９円時分月日]/g, '').length;
    var turns = item.turnsCount || 0;
    var isDialogue = display.indexOf('\n') !== -1;

    switch (lvl) {
      case 1:
        if (info !== 1) errors.push('L1 必须恰好单信息（infoCount=1，当前 ' + info + '）');
        break;
      case 2:
        if (!hasPredicate) errors.push('L2 必须是完整短句（含谓语 です/ます 等）');
        if (nonDigitLen < 3) errors.push('L2 不得只播放孤立数字/单位，需完整句子');
        break;
      case 3:
        if (!item.scene || item.scene === 'warmup') errors.push('L3 必须带场景');
        if (info < 2) errors.push('L3 必须含 ≥2 个信息点（当前 ' + info + '）');
        if (!hasPredicate) errors.push('L3 必须是完整场景句');
        break;
      case 4:
        if (info < 2) errors.push('L4 必须含 ≥2 个信息点（当前 ' + info + '）');
        if (!item.hasRelation) errors.push('L4 必须含先后/并列关系（hasRelation）');
        if (!item.hasPerson) errors.push('L4 必须含人物（hasPerson）');
        break;
      case 5:
        if (turns < 2) errors.push('L5 必须是 2 轮以上对话（当前 ' + turns + '）');
        if (turns > 4) errors.push('L5 对话不得超过 4 轮（当前 ' + turns + '）');
        if (!isDialogue) errors.push('L5 必须是多轮对话（换行分隔发言）');
        break;
      case 6:
        if (turns < 4) errors.push('L6 必须是 4 轮以上完整场景（当前 ' + turns + '），不得退化为单句/两轮对话');
        if (turns > 8) errors.push('L6 对话不得超过 8 轮（当前 ' + turns + '）');
        if (!isDialogue) errors.push('L6 必须是多轮连续对话');
        break;
      default:
        errors.push('未知听力等级 L' + lvl);
    }

    // 选项通用规则：≥3 项、含正确答案、不重复
    if (!isArray(item.options) || item.options.length < 3) errors.push('选项少于 3 个');
    else {
      if (item.options.indexOf(item.answer) === -1) errors.push('选项不含正确答案');
      var set = {}; var dup = false;
      item.options.forEach(function (o) { if (set[String(o)]) dup = true; set[String(o)] = true; });
      if (dup) errors.push('选项重复');
    }
    if (!isNonEmptyString(item.question)) errors.push('缺少题干');
    return errors;
  }

  /* Level 5 校验：必须是对话且 ≥2 信息点 */
  function validateDialogue(q) {
    var errors = [];
    if ((q.level || 0) >= 5) {
      if (!/「.+」.*「.+」/.test((q.scriptJa || '').replace(/\n/g, ''))) errors.push(q.id + ' Level5 必须包含对话（多个发言）');
      if (!q.infoCount || q.infoCount < 2) errors.push(q.id + ' Level5 必须包含两个以上信息点（infoCount）');
    }
    return errors;
  }

  /* 校验全部数据集，返回汇总报告 */
  function validateAll() {
    var report = {
      ranAt: new Date().toISOString(),
      counts: { verified: 0, pending: 0, rejected: 0, invalid: 0 },
      failures: [], // {id, dataset, errors}
      datasets: {}
    };
    var reviewDecisions = MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {});
    var seenIds = {};

    function run(name, items, kind) {
      var ds = { total: 0, verified: 0, pending: 0, rejected: 0, invalid: 0 };
      (items || []).forEach(function (item) {
        ds.total++;
        var errors = validateItem(item, { kind: kind, seenIds: seenIds });
        if (errors.length) {
          ds.invalid++; report.counts.invalid++;
          report.failures.push({ id: item.id || '(无id)', dataset: name, errors: errors });
          return;
        }
        var status = MJT.scope.effectiveSourceStatus(item, reviewDecisions);
        ds[status] = (ds[status] || 0) + 1;
        report.counts[status] = (report.counts[status] || 0) + 1;
      });
      report.datasets[name] = ds;
    }

    var D = window.MJT_DATA || {};
    // meta 一致性
    if (D.meta && D.meta.lessonMax !== MJT.scope.HARD_MAX) {
      report.failures.push({ id: 'meta', dataset: 'meta', errors: ['meta.lessonMax 与 scope.HARD_MAX 不一致'] });
    }
    run('数量词', D.counters, 'knowledge');
    run('语法题（待审核区）', D.pendingGrammar, 'question');
    run('听力题（待审核区）', D.pendingListening, 'question');
    run('阅读题（待审核区）', D.pendingReading, 'question');

    // 场景（专用校验器）
    var scDs = { total: 0, verified: 0, pending: 0, rejected: 0, invalid: 0 };
    (D.pendingScenarios || []).forEach(function (sc) {
      scDs.total++;
      var errs = validateScenario(sc, { seenIds: seenIds });
      if (errs.length) {
        scDs.invalid++; report.counts.invalid++;
        report.failures.push({ id: sc.id || '(无id)', dataset: '场景', errors: errs });
        return;
      }
      var st = MJT.scope.effectiveSourceStatus(sc, reviewDecisions);
      scDs[st] = (scDs[st] || 0) + 1;
      report.counts[st] = (report.counts[st] || 0) + 1;
    });
    report.datasets['场景（待审核区）'] = scDs;

    // 场景句框架（生成器数据；verified 通用读法）
    var frDs = { total: 0, verified: 0, pending: 0, rejected: 0, invalid: 0 };
    (D.scenarioFrames || []).forEach(function (f) {
      frDs.total++;
      var errs = validateFrame(f);
      if (seenIds[f.id]) errs.push('重复 id: ' + f.id);
      seenIds[f.id] = true;
      if (errs.length) {
        frDs.invalid++; report.counts.invalid++;
        report.failures.push({ id: f.id || '(无id)', dataset: '场景句框架', errors: errs });
      } else { frDs.verified++; report.counts.verified++; }
    });
    report.datasets['场景句框架'] = frDs;

    // Level 5 对话专项检查（在题库通用检查之外）
    (D.pendingListening || []).forEach(function (q) {
      var errs = validateDialogue(q);
      if (errs.length) {
        report.counts.invalid++;
        report.failures.push({ id: q.id, dataset: '听力L5', errors: errs });
      }
    });

    // 用户导入的待审核数据
    if (window.MJT && MJT.app && MJT.app.importedItems) {
      run('导入数据（待审核区）', MJT.app.importedItems(null), 'question');
    }
    return report;
  }

  /* 正式训练组卷抽样：默认等级(L3)绝不产出孤立数字热身题。
   * Listening 2.0 下等级隔离，热身仅存在于 L1；此处抽样默认等级确认
   * warmup 占比为 0（若为非 0 说明等级隔离被破坏）。 */
  function checkWarmupRatio(sampleSize) {
    var n = sampleSize || 200;
    var lvl = MJT.listening.DEFAULT_LEVEL;
    MJT.listening.resetLevel(lvl);
    var warmup = 0, total = 0;
    for (var i = 0; i < n; i++) {
      var q = MJT.listening.generate(lvl);
      if (!q || q.__error) continue;
      total++;
      if (q.warmup || q.listeningLevel === 1) warmup++;
    }
    var ratio = total ? warmup / total : 0;
    return { total: total, warmup: warmup, ratio: ratio, limit: 0.05, ok: ratio <= 0.05 };
  }

  return {
    validateItem: validateItem,
    validateAll: validateAll,
    validateScenario: validateScenario,
    validateFrame: validateFrame,
    validateDialogue: validateDialogue,
    validateListeningLevelStructure: validateListeningLevelStructure,
    optionErrors: optionErrors,
    checkWarmupRatio: checkWarmupRatio
  };
})();
