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
  'data/pending/grammar-pending.js', 'data/pending/listening-pending.js', 'data/pending/reading-pending.js',
  'src/utils/storage.js', 'src/utils/random.js',
  'src/core/scope.js', 'src/core/validator.js', 'src/core/errorbook.js',
  'src/core/stats.js', 'src/core/adaptive.js',
  'src/modules/numbers.js'
];
for (const f of files) {
  vm.runInContext(readFileSync(join(root, f), 'utf8'), sandbox, { filename: f });
}
const { MJT, MJT_DATA } = sandbox;

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
eq(report.counts.invalid, 0, '正式数据无校验失败条目：' + JSON.stringify(report.failures));
eq(report.counts.verified, 10, '10个数量词读法为 verified');
eq(report.counts.pending, 12 + 6 + 3, '语法12+听力6+阅读3 = 21条 pending');
eq(report.counts.rejected, 0, '无 rejected');
ok(report.ranAt, '验证报告有时间戳');

// 故意构造坏数据：超纲课程、缺答案、缺解析、伪造"教材原句"、unknown升级verified
const badLesson = { id: 'bad-1', question: 'x?', options: ['a', 'b'], answer: 'a', explanation: 'e', grammarPoints: ['g'], lesson: [25], sourceStatus: 'verified', sourceType: 'manual_review' };
ok(MJT.validator.validateItem(badLesson, { kind: 'question' }).some(e => e.includes('超过第21课')), '拦截第22课以后内容（第25课）');
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
ok(!S.check({ id: 's2', lesson: [22], sourceStatus: 'verified' }, { maxLesson: 21 }).allowed, '拦截第22课（硬上限）');
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

/* ================= 汇总 ================= */
console.log(`\n通过 ${pass} 项，失败 ${fail} 项`);
if (failures.length) {
  console.log('\n失败明细：');
  failures.slice(0, 30).forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('全部测试通过 ✓');
