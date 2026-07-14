/* Minna Japanese Trainer — 单元测试（Node 运行，不需要浏览器）
 * 用法：node tests/run-tests.mjs
 * 覆盖：读法转换器、数据验证器、课程范围控制、自适应规则、错误分类、随机生成题。 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/* ---- 浏览器环境模拟 ---- */
const store = {};
const sandbox = {
  console,
  localStorage: {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
  },
  performance: { now: () => Date.now() },
  Date, Math, JSON, Object, Array, String, Number, parseInt, parseFloat, isNaN
};
sandbox.window = sandbox;
vm.createContext(sandbox);

const files = [
  'data/meta.js', 'data/readings.js', 'data/counters.js', 'data/knowledge-map.js',
  'data/lesson-scope-review.js',
  'data/textbooks/minna/beginner1.js', 'data/textbooks/minna/lesson-page-index.js',
  'data/conjugation/lexicon.js',
  'data/numbers/scenario-frames.js',
  'data/pending/grammar-pending.js',
  'data/pending/grammar/lesson-01-05.js', 'data/pending/grammar/lesson-06-10.js',
  'data/pending/grammar/lesson-11-15.js', 'data/pending/grammar/lesson-16-21.js',
  'data/pending/listening-pending.js', 'data/pending/listening/short-dialogues.js',
  'data/pending/reading-pending.js',
  'data/pending/reading/messages.js', 'data/pending/reading/notices.js', 'data/pending/reading/schedules.js',
  'data/pending/scenarios/shopping.js', 'data/pending/scenarios/dining.js',
  'data/pending/scenarios/medical.js', 'data/pending/scenarios/transport.js',
  'data/pending/scenarios/school.js', 'data/pending/scenarios/housing.js',
  'src/utils/storage.js', 'src/utils/random.js',
  'src/core/scope.js', 'src/core/validator.js', 'src/core/errorbook.js',
  'src/core/stats.js', 'src/core/adaptive.js', 'src/core/mastery.js', 'src/core/coverage.js',
  'src/modules/numbers.js', 'src/modules/scenario-numbers.js', 'src/modules/listening.js',
  'src/modules/conjugation.js', 'src/modules/conjugation-drills.js'
];
for (const f of files) {
  vm.runInContext(readFileSync(join(root, f), 'utf8'), sandbox, { filename: f });
}
const { MJT, MJT_DATA } = sandbox;
// UI 层（app.js）不在 Node 中加载；提供 listening/validator 所需的最小桩
MJT.app = {
  getSettings: () => ({ maxLesson: 21, questionCount: 10, counterMode: 'universal', extendedVocab: 'light', ttsRate: 1, volume: 1 }),
  importedItems: () => []
};

/* ---- 断言工具 ---- */
let pass = 0, fail = 0;
const failures = [];
function eq(actual, expected, label) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a === e) { pass++; }
  else { fail++; failures.push(`${label}\n    期望: ${e}\n    实际: ${a}`); }
}
function ok(cond, label) {
  if (cond) pass++; else { fail++; failures.push(label); }
}

/* ================= 读法转换器 ================= */
const N = MJT.numbers;
eq(N.numberToKana(0), 'ゼロ', 'numberToKana(0)');
eq(N.numberToKana(11), 'じゅういち', 'numberToKana(11)');
eq(N.numberToKana(300), 'さんびゃく', '音变 300');
eq(N.numberToKana(600), 'ろっぴゃく', '音变 600');
eq(N.numberToKana(800), 'はっぴゃく', '音变 800');
eq(N.numberToKana(3000), 'さんぜん', '音变 3000');
eq(N.numberToKana(8000), 'はっせん', '音变 8000');
eq(N.numberToKana(10000), 'いちまん', '1万=いちまん');
eq(N.numberToKana(2870), 'にせんはっぴゃくななじゅう', 'numberToKana(2870)');
eq(N.yenToKana(4), 'よえん', '4円=よえん');
eq(N.yenToKana(104), 'ひゃくよえん', '104円=ひゃくよえん');
eq(N.yenToKana(2800), 'にせんはっぴゃくえん', '2800円');
eq(N.timeToKana(4, 30, { useHan: true }), 'よじはん', '4時半=よじはん');
eq(N.timeToKana(9, 0, {}), 'くじ', '9時=くじ');
eq(N.timeToKana(7, 10, {}), 'しちじじゅっぷん', '7時10分');
eq(N.timeToKana(6, 1, {}), 'ろくじいっぷん', '6時1分');
eq(N.timeToKana(3, 15, { gozen: true }), 'ごぜんさんじじゅうごふん', '午前3時15分');
eq(N.dateToKana(null, 1), 'ついたち', '1日=ついたち');
eq(N.dateToKana(null, 20), 'はつか', '20日=はつか');
eq(N.dateToKana(4, 14), 'しがつじゅうよっか', '4月14日');
eq(N.dateToKana(9, 24), 'くがつにじゅうよっか', '9月24日');
const hon = MJT_DATA.counters.find(c => c.id === 'counter-hon');
eq(N.counterToKana(hon, 1), 'いっぽん', '1本=いっぽん');
eq(N.counterToKana(hon, 3), 'さんぼん', '3本=さんぼん');
eq(N.counterToKana(hon, 10), 'じゅっぽん', '10本=じゅっぽん');
const floor = MJT_DATA.counters.find(c => c.id === 'counter-kai-floor');
eq(N.counterToKana(floor, 3), 'さんがい', '3階=さんがい');
const nin = MJT_DATA.counters.find(c => c.id === 'counter-nin');
eq(N.counterToKana(nin, 1), 'ひとり', '1人=ひとり');
eq(N.counterToKana(nin, 4), 'よにん', '4人=よにん');
eq(N.phoneToKana(['03', '1234']), 'ゼロさんのいちにさんよん', '电话号码读法');

/* ================= 数据验证器 ================= */
const report = MJT.validator.validateAll();
eq(report.counts.invalid, 0, '全部数据无校验失败条目：' + JSON.stringify(report.failures).slice(0, 800));
const expectedPending = MJT_DATA.pendingGrammar.length + MJT_DATA.pendingListening.length +
  MJT_DATA.pendingReading.length + MJT_DATA.pendingScenarios.length;
eq(report.counts.verified, 10 + MJT_DATA.scenarioFrames.length, '数量词10 + 场景句框架' + MJT_DATA.scenarioFrames.length + ' 为 verified');
eq(report.counts.pending, expectedPending, '语法' + MJT_DATA.pendingGrammar.length + '+听力' + MJT_DATA.pendingListening.length + '+阅读' + MJT_DATA.pendingReading.length + '+场景' + MJT_DATA.pendingScenarios.length + ' = ' + expectedPending + '条 pending');
eq(report.counts.rejected, 0, '无 rejected');
ok(report.ranAt, '验证报告有时间戳');
eq(MJT_DATA.pendingScenarios.length, 14, '14个完整场景已加载');
eq(MJT_DATA.pendingGrammar.length, 72, '语法题共72道（原12+新增60）');
eq(MJT_DATA.pendingListening.length, 16, '听力题库16条（原6+L5对话10）');
eq(MJT_DATA.pendingReading.length, 15, '阅读15篇（原3+新增12）');
eq(MJT_DATA.lessonScopeReview.length, 25, '课程审核表25条（初级Ⅰ）');
ok(MJT_DATA.lessonScopeReview.every(l => l.sourceStatus === 'pending' && l.reviewed === false), '课程审核表全部默认 pending/未核实');

// Stage 系统与硬上限=25
eq(MJT.scope.HARD_MAX, 25, '硬上限=25（初级Ⅰ）');
eq(MJT.scope.resolveMaxLesson({ stage: 'stage1' }), 20, 'Stage1 → 第1~20课');
eq(MJT.scope.resolveMaxLesson({ stage: 'stage2' }), 25, 'Stage2 → 第1~25课');
eq(MJT.scope.resolveMaxLesson({ lessonRangeMode: 'manual', maxLesson: 18 }), 18, '手动模式 → 自定义上限');
eq(MJT.scope.resolveMaxLesson({ lessonRangeMode: 'manual', maxLesson: 99 }), 25, '手动模式超上限被clamp到25');
ok(MJT.scope.stageById('stage2') && MJT.scope.stageById('stage2').maxLesson === 25, 'stageById 可解析 Stage2');

// 故意构造坏数据：超纲课程、缺答案、缺解析、伪造"教材原句"、unknown升级verified
const badLesson = { id: 'bad-1', question: 'x?', options: ['a', 'b'], answer: 'a', explanation: 'e', grammarPoints: ['g'], lesson: [26], sourceStatus: 'verified', sourceType: 'manual_review' };
ok(MJT.validator.validateItem(badLesson, { kind: 'question' }).some(e => e.includes('超过第25课')), '拦截第26课以后内容（硬上限25）');
const okLesson25 = { id: 'ok-25', question: 'x?', options: ['a', 'b'], answer: 'a', explanation: 'e', grammarPoints: ['g'], lesson: [25], sourceStatus: 'verified', sourceType: 'manual_review' };
ok(!MJT.validator.validateItem(okLesson25, { kind: 'question' }).some(e => e.includes('超过')), '第25课内容不再被拦截');
const noAnswer = { id: 'bad-2', question: 'x?', options: ['a', 'b'], explanation: 'e', grammarPoints: ['g'], lesson: [1], sourceStatus: 'verified', sourceType: 'manual_review' };
ok(MJT.validator.validateItem(noAnswer, { kind: 'question' }).some(e => e.includes('缺少答案')), '拦截缺少答案');
const noExplain = { id: 'bad-3', question: 'x?', options: ['a', 'b'], answer: 'a', grammarPoints: ['g'], lesson: [1], sourceStatus: 'verified', sourceType: 'manual_review' };
ok(MJT.validator.validateItem(noExplain, { kind: 'question' }).some(e => e.includes('缺少解析')), '拦截缺少解析');
const fakeOrigin = { id: 'bad-4', question: 'x?', options: ['a', 'b'], answer: 'a', explanation: 'e', grammarPoints: ['g'], lesson: [1], origin: '教材原句', sourceStatus: 'verified', sourceType: 'manual_review' };
ok(MJT.validator.validateItem(fakeOrigin, { kind: 'question' }).some(e => e.includes('教材原句')), '拦截伪造"教材原句"标签');
const unknownVerified = { id: 'bad-5', question: 'x?', options: ['a', 'b'], answer: 'a', explanation: 'e', grammarPoints: ['g'], lesson: [1], sourceStatus: 'verified', sourceType: 'unknown' };
ok(MJT.validator.validateItem(unknownVerified, { kind: 'question' }).some(e => e.includes('unknown')), '拦截 unknown 来源标记为 verified');
const badNode = { id: 'bad-6', question: 'x?', options: ['a', 'b'], answer: 'a', explanation: 'e', grammarPoints: ['g'], lesson: [1], sourceStatus: 'verified', sourceType: 'manual_review', knowledgeMap: [{ module: 'x', node: 'not-a-real-node' }], knowledgeMapStatus: 'verified' };
ok(MJT.validator.validateItem(badNode, { kind: 'question' }).some(e => e.includes('不存在的节点')), '拦截引用不存在的知识图谱节点');

/* ================= 课程范围控制 ================= */
const S = MJT.scope;
const vItem = { id: 's1', lesson: [10], sourceStatus: 'verified' };
ok(S.check(vItem, { maxLesson: 21 }).allowed, '范围内 verified 条目放行');
ok(!S.check(vItem, { maxLesson: 9 }).allowed, '用户选1~9课时拦截第10课内容');
ok(!S.check({ id: 's2', lesson: [26], sourceStatus: 'verified' }, { maxLesson: 25 }).allowed, '拦截第26课（硬上限25）');
ok(S.check({ id: 's2b', lesson: [24], sourceStatus: 'verified' }, { maxLesson: 25 }).allowed, '第24课在 Stage2 范围内放行');
ok(!S.check({ id: 's3', lesson: [5], sourceStatus: 'pending' }, { maxLesson: 21 }).allowed, '拦截待核实（pending）内容');
ok(!S.check({ id: 's4', lesson: [5], sourceStatus: 'rejected' }, { maxLesson: 21 }).allowed, '拦截 rejected 内容');
const uItem = { id: 's5', lesson: null, sourceStatus: 'verified', lessonAttribution: { status: 'pending' } };
ok(!S.check(uItem, { maxLesson: 21, mode: 'textbook' }).allowed, '教材范围模式拦截课程归属未核实条目');
ok(S.check(uItem, { maxLesson: 21, mode: 'universal' }).allowed, '通用读法模式放行（明确不声明教材出处）');
// 审核决定提升 pending → verified
const pItem = MJT_DATA.pendingGrammar[0];
ok(!S.check(pItem, { maxLesson: 21 }).allowed, '未审核语法题被拦截');
ok(S.check(pItem, { maxLesson: 21, reviewDecisions: { [pItem.id]: { status: 'verified' } } }).allowed, '审核通过后语法题放行');
ok(!S.check(pItem, { maxLesson: 21, reviewDecisions: { [pItem.id]: { status: 'rejected' } } }).allowed, '审核拒绝后语法题拦截');

/* ================= 自适应规则 ================= */
const A = MJT.adaptive;
let r = A.nextDifficulty(2, { total: 10, accuracy: 0.5, avgResponseMs: 3000 }, { currentWrong: 0, currentCorrect: 0 });
eq([r.difficulty, r.mode], [1, 'basic'], '正确率<60% → 降难度出基础题');
r = A.nextDifficulty(2, { total: 10, accuracy: 0.7, avgResponseMs: 3000 }, { currentWrong: 0, currentCorrect: 0 });
eq([r.difficulty, r.mode], [2, 'variation'], '正确率60~80% → 同类变式');
r = A.nextDifficulty(2, { total: 10, accuracy: 0.9, avgResponseMs: 3000 }, { currentWrong: 0, currentCorrect: 0 });
eq([r.difficulty, r.mode], [3, 'advanced'], '正确率>80% → 升难度综合题');
r = A.nextDifficulty(2, { total: 10, accuracy: 0.9, avgResponseMs: 9000 }, { currentWrong: 0, currentCorrect: 0 });
eq([r.difficulty, r.mode], [2, 'speed'], '正确率高但反应慢 → 速度强化');
r = A.nextDifficulty(2, { total: 10, accuracy: 0.9, avgResponseMs: 3000 }, { currentWrong: 3, currentCorrect: 0 });
eq([r.difficulty, r.mode], [1, 'remedial'], '连续答错3次 → 降一档并显示详细解析');
const w = A.categoryWeights(MJT_DATA.meta.numberCategories, { time: 4 }, { time: { total: 10, accuracy: 0.5, avgResponseMs: 3000 } });
const tw = w.find(x => x.id === 'time'), bw = w.find(x => x.id === 'basic');
ok(tw.weight > bw.weight, '错误率高的类别权重更高（time ' + tw.weight + ' > basic ' + bw.weight + '）');

/* ================= 错误分类 ================= */
const E = MJT.errorbook;
eq(E.classifyError({ numberCategory: 'price' }, 'x', 3000, false), '金额识别错误', '金额错误分类');
eq(E.classifyError({ numberCategory: 'time' }, 'x', 3000, false), '时间识别错误', '时间错误分类');
eq(E.classifyError({ numberCategory: 'date' }, 'x', 3000, false), '日期识别错误', '日期错误分类');
eq(E.classifyError({ numberCategory: 'counter' }, 'x', 3000, false), '数量词错误', '数量词错误分类');
eq(E.classifyError({ type: 'verb-conjugation' }, 'x', 3000, false), '动词变形错误', '动词变形错误分类');
eq(E.classifyError({ type: 'particle-choice' }, 'x', 3000, false), '助词错误', '助词错误分类');
eq(E.classifyError({ type: 'choice' }, 'x', 12000, true), '反应时间过长', '超慢正确作答 → 反应时间过长');

/* ================= 随机生成题批量体检 ================= */
const cats = ['basic', 'time', 'date', 'counter', 'price', 'phone', 'duration', 'mixed'];
let genChecked = 0;
for (let i = 0; i < 400; i++) {
  const cat = cats[i % cats.length];
  const d = (i % 3) + 1;
  const q = N.generate(cat, d, { counterPool: MJT_DATA.counters });
  ok(q !== null, `生成器返回题目 (${cat}, 难度${d})`);
  if (!q) continue;
  const errs = MJT.validator.validateItem(q, { kind: 'question' });
  if (errs.length) { fail++; failures.push(`生成题未通过验证器 (${cat}): ${errs.join('；')}`); } else pass++;
  ok(q.options.length >= 3 && q.options.includes(String(q.answer)), `选项含正确答案且≥3个 (${cat})`);
  ok(new Set(q.options).size === q.options.length, `选项无重复 (${cat})`);
  ok(q.origin === '基于已验证知识生成的练习示例', `生成题标注来源 (${cat})`);
  ok(q.sourceStatus === 'verified' && q.audioScript && q.explanation, `生成题字段完整 (${cat})`);
  ok(S.check(q, { maxLesson: 21, mode: 'universal' }).allowed, `生成题通过范围检查 (${cat})`);
  genChecked++;
}
ok(genChecked === 400, '批量生成 400 题');

/* ================= 场景系统 ================= */
MJT_DATA.pendingScenarios.forEach(sc => {
  const errs = MJT.validator.validateScenario(sc, { seenIds: {} });
  if (errs.length) { fail++; failures.push(`场景 ${sc.id} 校验失败: ${errs.join('；')}`); } else pass++;
  const listen = sc.steps.filter(s => s.script);
  const infoQ = sc.steps.filter(s => s.interactionType === 'choose' || s.interactionType === 'input');
  const respond = sc.steps.filter(s => s.interactionType === 'respond');
  ok(listen.length >= 3 && listen.length <= 8, `${sc.id} 对话3~8轮 (${listen.length})`);
  ok(infoQ.length >= 2, `${sc.id} 信息提取问题≥2 (${infoQ.length})`);
  ok(respond.length >= 1 && respond.every(r => r.acceptedAnswers && r.acceptedAnswers.length), `${sc.id} 用户回应有可接受答案`);
  ok(sc.review && sc.review.lineNotes && Object.keys(sc.review.lineNotes).length >= 3, `${sc.id} 有逐句解析`);
  ok(sc.reinforcement && sc.reinforcement.length >= 1, `${sc.id} 有迁移强化`);
  ok((sc.extendedVocab || []).length <= 5, `${sc.id} 扩展词汇≤5个`);
  ok(sc.contentType === 'ai_generated_practice' && sc.isTextbookOriginal === false, `${sc.id} 真实性标记完整`);
  ok(sc.sourceStatus === 'pending', `${sc.id} 默认待审核（不自称已教材核实）`);
  // 迁移引用的场景必须真实存在
  sc.reinforcement.filter(r => r.type === 'scenario').forEach(r => {
    ok(MJT_DATA.pendingScenarios.some(x => x.id === r.ref), `${sc.id} 迁移引用的场景存在 (${r.ref})`);
  });
  // 场景门禁：pending 不进入正式训练，核实后进入
  ok(!MJT.scope.check(sc, { maxLesson: 21 }).allowed, `${sc.id} 待核实时被正式训练拦截`);
  ok(MJT.scope.check(sc, { maxLesson: 21, reviewDecisions: { [sc.id]: { status: 'verified' } } }).allowed, `${sc.id} 核实后放行`);
});

/* ================= 场景句框架 + 生成题选项规则 ================= */
MJT_DATA.scenarioFrames.forEach(f => {
  const errs = MJT.validator.validateFrame(f);
  if (errs.length) { fail++; failures.push(`框架 ${f.id}: ${errs.join('；')}`); } else pass++;
  if (f.level >= 4) ok(Object.keys(f.slots).length >= 2, `${f.id} L4+含两个以上信息点`);
  // 每个框架实际生成一题：槽位填充完整、选项规则通过
  const q = MJT.scenarioNumbers.generateFromFrame(f);
  ok(q.audioScript.indexOf('{') === -1 && q.scriptJa.indexOf('{') === -1, `${f.id} 槽位填充无残留`);
  const optErrs = MJT.validator.optionErrors(q.options, q.answer);
  if (optErrs.length) { fail++; failures.push(`${f.id} 选项规则: ${optErrs.join('；')} → ${JSON.stringify(q.options)}`); } else pass++;
  ok(q.options.length === 4, `${f.id} 四个选项`);
  ok(q.explanation && q.audioScript, `${f.id} 有解析和TTS文本`);
  ok(q.origin === '基于已验证知识生成的练习示例' && q.isTextbookOriginal === false, `${f.id} 生成题真实性标记`);
});

/* 批量抽样：正确答案位置分布（不固定在某一位） */
{
  const positions = [0, 0, 0, 0];
  for (let i = 0; i < 200; i++) {
    const q = MJT.scenarioNumbers.generate('mixed', 4, { minLevel: 2 });
    positions[q.options.indexOf(q.answer)]++;
  }
  ok(positions.every(p => p > 10), '正确答案位置随机分布 ' + JSON.stringify(positions));
}

/* ================= 听力等级系统 ================= */
eq(MJT.listening.DEFAULT_LEVEL, 3, '默认听力等级为 Level 3');
// Level 5 对话规则
MJT_DATA.pendingListening.filter(q => (q.level || 0) >= 5).forEach(q => {
  const errs = MJT.validator.validateDialogue(q);
  if (errs.length) { fail++; failures.push(`L5 ${q.id}: ${errs.join('；')}`); } else pass++;
  ok(q.infoCount >= 2, `${q.id} L5 信息点≥2`);
});
// 单数字题（基础热身）占比 ≤5%
{
  const r = MJT.validator.checkWarmupRatio(400);
  ok(r.ok, `正式听力训练中孤立数字题占比 ${(r.ratio * 100).toFixed(1)}% ≤ ${r.limit * 100}%（${r.warmup}/${r.total}）`);
}
// L2-L4 生成题必须是完整表达（句子含语境文字，非裸数字）
for (let i = 0; i < 50; i++) {
  const q = MJT.scenarioNumbers.generate('mixed', 4, { minLevel: 2 });
  ok(q.scriptJa.replace(/[0-9０-９:：円時分月日人本枚冊台回階杯個匹]/g, '').length >= 4, `L${q.level} 数字进入完整表达`);
}

/* ================= 阅读问题与答案匹配 ================= */
MJT_DATA.pendingReading.forEach(p => {
  (p.questions || []).forEach((sub, i) => {
    ok(sub.options.indexOf(sub.answer) !== -1, `${p.id} 问${i + 1} 选项含正确答案`);
    ok(new Set(sub.options).size === sub.options.length, `${p.id} 问${i + 1} 选项无重复`);
    ok(!!sub.locate && !!sub.reasoning, `${p.id} 问${i + 1} 有定位与推理说明`);
  });
});

/* ================= 语法题规则 ================= */
{
  let withScenario = 0;
  MJT_DATA.pendingGrammar.forEach(q => {
    ok(new Set(q.options).size === q.options.length, `${q.id} 语法选项无重复`);
    if (q.scenarioContext) withScenario++;
  });
  const newOnes = MJT_DATA.pendingGrammar.filter(q => q.id.indexOf('g2-') === 0);
  const ratio = newOnes.filter(q => q.scenarioContext).length / newOnes.length;
  ok(ratio >= 0.7, `新增语法题带生活场景说明比例 ${(ratio * 100).toFixed(0)}% ≥ 70%`);
}

/* ================= 跨场景掌握模型 ================= */
{
  MJT.mastery.record('测试知识点', 'ctx-1', true);
  let s1 = MJT.mastery.summary();
  ok(s1.learning.some(m => m.point === '测试知识点'), '单场景答对 → 学习中（不判定掌握）');
  MJT.mastery.record('测试知识点', 'ctx-2', true);
  MJT.mastery.record('测试知识点', 'ctx-3', true);
  MJT.mastery.record('测试知识点', 'ctx-4', true);
  let s2 = MJT.mastery.summary();
  ok(s2.mastered.some(m => m.point === '测试知识点'), '4个不同场景稳定 → 掌握');
  MJT.mastery.record('测试知识点', 'ctx-2', false);
  let s3 = MJT.mastery.summary();
  ok(s3.weak.some(m => m.point === '测试知识点'), '任一场景最近答错 → 回到薄弱');
}

/* ================= 扩展词汇约束 ================= */
MJT_DATA.pendingScenarios.forEach(sc => {
  (sc.extendedVocab || []).forEach(w => {
    ok(w.scope === 'extended_basic' && !!w.kana && !!w.zh && !!w.reason && !!w.pos, `${sc.id} 扩展词 ${w.word} 标注完整（假名/中文/词性/原因）`);
  });
});

/* ================= 变形反应引擎 ================= */
{
  const CJ = MJT.conjugation;
  const lex = CJ.lexicon();
  const V = (r) => lex.verbs.find(v => v.reading === r);
  const cv = (r, form) => CJ.conjugateVerb(V(r), form).surface;
  const cvr = (r, form) => CJ.conjugateVerb(V(r), form).reading;
  // 五段 て/た 音便全覆盖
  eq(cv('かう', 'te'), '買って', '五段 う→って');
  eq(cv('かく', 'te'), '書いて', '五段 く→いて');
  eq(cv('いく', 'te'), '行って', '行く 例外→行って');
  eq(cv('およぐ', 'te'), '泳いで', '五段 ぐ→いで');
  eq(cv('はなす', 'te'), '話して', '五段 す→して');
  eq(cv('まつ', 'te'), '待って', '五段 つ→って');
  eq(cv('しぬ', 'te'), '死んで', '五段 ぬ→んで');
  eq(cv('あそぶ', 'te'), '遊んで', '五段 ぶ→んで');
  eq(cv('のむ', 'te'), '飲んで', '五段 む→んで');
  eq(cv('のむ', 'ta'), '飲んだ', '五段 た形 む→んだ');
  eq(cv('かく', 'ta'), '書いた', '五段 た形 く→いた');
  eq(cv('いく', 'ta'), '行った', '行く た形例外');
  // 五段 masu/nai
  eq(cv('かう', 'masu'), '買います', '五段 masu');
  eq(cv('まつ', 'masu'), '待ちます', '五段 masu つ→ち');
  eq(cv('かう', 'nai'), '買わない', '五段 nai う→わ');
  eq(cv('のむ', 'nai'), '飲まない', '五段 nai む→ま');
  // 伪一段：帰る/入る/走る 按五段
  eq(cv('かえる', 'te'), '帰って', '伪一段 帰る→帰って（五段）');
  eq(cv('かえる', 'masu'), '帰ります', '伪一段 帰る→帰ります');
  eq(cv('はしる', 'nai'), '走らない', '伪一段 走る→走らない');
  // 一段
  eq(cv('たべる', 'masu'), '食べます', '一段 masu');
  eq(cv('たべる', 'te'), '食べて', '一段 te');
  eq(cv('たべる', 'nai'), '食べない', '一段 nai');
  eq(cv('たべる', 'ta'), '食べた', '一段 ta');
  eq(cv('みる', 'te'), '見て', '一段 見る→見て');
  // 不规则
  eq(cv('する', 'masu'), 'します', 'する→します');
  eq(cv('する', 'te'), 'して', 'する→して');
  eq(cv('べんきょうする', 'masu'), '勉強します', 'X+する→Xします');
  eq(cv('べんきょうする', 'te'), '勉強して', 'X+する→Xして');
  eq(cv('くる', 'masu'), '来ます', '来る surface→来ます');
  eq(cvr('くる', 'masu'), 'きます', '来る reading→きます');
  eq(cvr('くる', 'nai'), 'こない', '来る reading nai→こない');
  eq(cvr('くる', 'te'), 'きて', '来る reading te→きて');
  eq(cvr('くる', 'ta'), 'きた', '来る reading ta→きた');
  eq(cv('くる', 'masuPastNeg'), '来ませんでした', '来る 敬体过去否定');
  eq(cv('くる', 'naiPast'), '来なかった', '来る 普通体过去否定');
  // ています
  eq(cv('のむ', 'teiru'), '飲んでいます', 'ています（て形＋います）');
  eq(cv('たべる', 'teiru'), '食べています', '一段 ています');
  // い形容词
  const IA = (r) => lex.iAdjectives.find(a => a.reading === r);
  eq(CJ.conjIAdj(IA('たかい'), 'neg').surface, '高くない', 'い形 否定 くない');
  eq(CJ.conjIAdj(IA('たかい'), 'past').surface, '高かった', 'い形 过去 かった');
  eq(CJ.conjIAdj(IA('たかい'), 'te').surface, '高くて', 'い形 て形 くて');
  eq(CJ.conjIAdj(IA('たかい'), 'pastNeg').surface, '高くなかった', 'い形 过去否定');
  eq(CJ.conjIAdj(IA('いい'), 'past').surface, 'よかった', 'いい 不规则 よかった');
  eq(CJ.conjIAdj(IA('いい'), 'neg').surface, 'よくない', 'いい 不规则 よくない');
  eq(CJ.conjIAdj(IA('いい'), 'present').surface, 'いい', 'いい 现在保持いい');
  // な形容词 / 名词 コピュラ
  const NA = (r) => lex.naAdjectives.find(a => a.reading === r);
  eq(CJ.conjCopula(NA('しずか'), 'present').surface, '静かだ', 'な形 现在 だ');
  eq(CJ.conjCopula(NA('しずか'), 'pastPolite').surface, '静かでした', 'な形 敬体过去 でした');
  eq(CJ.conjCopula(NA('しずか'), 'neg').surface, '静かじゃない', 'な形 否定 じゃない');
  const NO = (r) => lex.nouns.find(n => n.reading === r);
  eq(CJ.conjCopula(NO('がくせい'), 'presentPolite').surface, '学生です', '名词判断句 です');
  eq(CJ.conjCopula(NO('がくせい'), 'past').surface, '学生だった', '名词判断句 过去 だった');
  // 词库真实性标记
  ok(lex.ref.sourceStatus === 'verified' && lex.ref.lessonAttribution.status === 'pending', '词库：读法verified但课程归属pending');

  // 变形题生成：结构完整 + 通过验证器 + 选项去重
  let cjChecked = 0;
  for (let i = 0; i < 300; i++) {
    const mode = i % 5 === 0 ? 'warmup' : 'scene';
    const q = MJT.conjugationDrills.generate(mode, (i % 3) + 1);
    ok(q.options.includes(q.answer) && new Set(q.options).size === q.options.length, `变形题选项含答案且不重复(${mode})`);
    ok(q.contentType === 'ai_generated_practice' && q.isTextbookOriginal === false, `变形题真实性标记(${mode})`);
    ok(!!q.explanation && q.explanation.length > 5, `变形题有解析(${mode})`);
    if (mode === 'warmup') ok(q.warmup === true, '热身题标 warmup');
    else ok(q.relationship && q.scenarioContext, '情景变形题带人物关系与场景');
    cjChecked++;
  }
  eq(cjChecked, 300, '批量生成300道变形题');
}

/* ================= 词汇覆盖 / 缺口扫描 ================= */
{
  const rep = MJT.coverage.analyze({ maxLesson: 25 });
  eq(rep.textbookVocabTotal, 0, '教材词表未录入时统计为0（不虚报）');
  eq(rep.coverageRate, null, '未录入词表时覆盖率为null，不编造百分比');
  ok(rep.gaps.some(g => g.includes('教材词表未录入')), '缺口扫描发现词表未录入');
  ok(rep.byForm.length === 4 && rep.byForm.every(f => typeof f.verified === 'number'), '各训练形式内容量可统计');
  const tasks = MJT.coverage.generationTasks(rep);
  ok(tasks.some(t => t.status === 'manual'), '词表录入为人工任务（AI不自动填教材词）');
  ok(tasks.every(t => t.status !== 'verified'), 'AI生产任务不会产出verified（需人工审核）');
}

/* ================= 教材数据库骨架（初级Ⅰ） ================= */
{
  const tb = MJT_DATA.textbooks['minna-beginner1'];
  ok(!!tb && tb.lessons.length === 25, '初级Ⅰ教材数据库有25课骨架');
  ok(tb.sourceStatus === 'pending' && tb.reviewed === false, '教材数据库整体为 pending（不自称已核实）');
  ok(tb.lessons.every(l => l.sourceStatus === 'pending' && l.reviewed === false), '25课全部 pending');
  ok(tb.lessons.every(l => l.vocabulary.length === 0 && l.grammar.length === 0), '骨架不含AI凭记忆填写的教材内容');
  const idx = MJT_DATA.minnaLessonPageIndex;
  ok(idx.length === 25, '页码索引覆盖25课');
  ok(idx.every((e, i) => i === 0 || e.startPage > idx[i - 1].startPage), '页码索引单调递增');
  ok(tb.lessons.every(l => l.pageRange && l.pageRangeStatus === 'pending'), '页码建议已并入骨架且保持 pending');
}

/* ================= 汇总 ================= */
console.log(`\n通过 ${pass} 项，失败 ${fail} 项`);
if (failures.length) {
  console.log('\n失败明细：');
  failures.slice(0, 30).forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('全部测试通过 ✓');
