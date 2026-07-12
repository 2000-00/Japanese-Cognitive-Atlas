/* 课程范围控制器
 *
 * 规则（真实性原则的执行层）：
 *  1. 系统硬上限为第21课（MJT_DATA.meta.lessonMax），任何声明课程编号
 *     超过21的条目一律拦截，永不进入练习页面。
 *  2. 用户可在 1..21 内选择当前最高课程 maxLesson；条目声明课程编号
 *     必须 ≤ maxLesson 才可用。
 *  3. sourceStatus 必须为 'verified' 才能进入正式训练；
 *     'pending'（含所有待核实演示数据）只出现在数据审核页；
 *     'rejected' 对学习者完全不可见。
 *  4. 课程归属声明（lessonAttribution）未核实（pending）的条目，
 *     在"教材范围模式"下不可用；仅在明确标注"通用读法模式
 *     （不声明教材出处）"下可用。
 *  5. 数据审核页做出的核实决定（reviewDecisions）可将 pending 条目
 *     提升为 verified / 降为 rejected，决定保存在 localStorage。
 */
window.MJT = window.MJT || {};

MJT.scope = (function () {
  var HARD_MAX = 21; // 与 MJT_DATA.meta.lessonMax 一致；validator 会校验两者相等

  /* 读取审核决定后条目的有效来源状态 */
  function effectiveSourceStatus(item, reviewDecisions) {
    var d = reviewDecisions && reviewDecisions[item.id];
    if (d && (d.status === 'verified' || d.status === 'rejected')) return d.status;
    return item.sourceStatus;
  }

  /* 条目声明的最大课程编号（lesson 可为数字、数组或 null） */
  function maxLessonOf(item) {
    if (item.lessonEnd !== undefined && item.lessonEnd !== null) return item.lessonEnd;
    var l = item.lesson;
    if (l === null || l === undefined) return null; // 未声明课程归属
    if (Object.prototype.toString.call(l) === '[object Array]') {
      return l.length ? Math.max.apply(null, l) : null;
    }
    return l;
  }

  /* 核心检查。opts: { maxLesson, mode: 'textbook'|'universal', reviewDecisions }
   * 返回 { allowed: bool, reason: string } */
  function check(item, opts) {
    opts = opts || {};
    var maxLesson = opts.maxLesson || HARD_MAX;
    var status = effectiveSourceStatus(item, opts.reviewDecisions);

    if (status === 'rejected') return { allowed: false, reason: '来源状态为 rejected，不显示给学习者' };
    if (status !== 'verified') return { allowed: false, reason: '来源状态为 ' + status + '（待核实内容不进入正式训练）' };

    var lm = maxLessonOf(item);
    if (lm !== null && lm > HARD_MAX) return { allowed: false, reason: '课程编号 ' + lm + ' 超过第' + HARD_MAX + '课硬上限' };
    if (lm !== null && lm > maxLesson) return { allowed: false, reason: '课程编号 ' + lm + ' 超出当前选择范围（1～' + maxLesson + '课）' };

    // 课程归属未核实的条目：教材范围模式下拦截，通用读法模式下放行
    var attr = item.lessonAttribution;
    var attrPending = (attr && attr.status !== 'verified') || (lm === null && !attr);
    if (attrPending && lm === null) {
      if (opts.mode === 'universal') {
        return { allowed: true, reason: '通用读法模式：内容已核实为标准日语，不声明教材课程出处' };
      }
      return { allowed: false, reason: '课程归属待核实，教材范围模式下不可用（可在数据审核页核实，或切换到通用读法模式）' };
    }
    return { allowed: true, reason: '在范围内（≤第' + maxLesson + '课）且来源已核实' };
  }

  /* 过滤一组条目，返回 { allowed: [], blocked: [{item, reason}] } */
  function filter(items, opts) {
    var allowed = [], blocked = [];
    (items || []).forEach(function (it) {
      var r = check(it, opts);
      if (r.allowed) allowed.push(it);
      else blocked.push({ item: it, reason: r.reason });
    });
    return { allowed: allowed, blocked: blocked };
  }

  return {
    HARD_MAX: HARD_MAX,
    check: check,
    filter: filter,
    maxLessonOf: maxLessonOf,
    effectiveSourceStatus: effectiveSourceStatus
  };
})();
