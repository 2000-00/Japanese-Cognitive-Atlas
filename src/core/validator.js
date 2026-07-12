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
    return report;
  }

  return { validateItem: validateItem, validateAll: validateAll };
})();
