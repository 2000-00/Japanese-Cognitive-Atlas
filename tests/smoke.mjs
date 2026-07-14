/* 浏览器冒烟测试：真实打开 trainer.html 并操作页面
 * 用法：npm install playwright（及 Chromium）后 node tests/smoke.mjs
 * 可用 CHROMIUM_PATH 环境变量指定浏览器可执行文件路径。 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const URL = 'file://' + join(dirname(fileURLToPath(import.meta.url)), '..', 'trainer.html');
let pass = 0, fail = 0;
const failures = [];
function ok(cond, label) { if (cond) { pass++; console.log('  ✓ ' + label); } else { fail++; failures.push(label); console.log('  ✗ ' + label); } }

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const jsErrors = [];
page.on('pageerror', e => jsErrors.push(String(e)));
page.on('dialog', d => d.accept());

/* 1. 页面可以打开 */
await page.goto(URL);
await page.waitForSelector('#mjt-nav .nav-item');
ok((await page.$$('#mjt-nav .nav-item')).length === 15, '页面打开，导航渲染15个页面入口（含场景/变形/词汇覆盖）');
ok((await page.textContent('#mjt-scope-badge')).includes('第1～') && (await page.textContent('#mjt-scope-badge')).includes('初级Ⅰ'), '顶栏显示初级Ⅰ当前课程范围');

/* 2. 首页内容 */
ok((await page.textContent('#mjt-main')).includes('今日完成'), '首页显示今日统计');
ok((await page.textContent('#mjt-main')).includes('待审核'), '首页显示数据可信度概览');

/* 3. 数字专项：时间训练，作答一题（答对） */
await page.goto(URL + '#numbers');
await page.waitForSelector('[data-cat="time"]');
await page.click('[data-cat="time"]');
await page.click('#num-start');
await page.waitForSelector('.option-btn');
ok((await page.textContent('#mjt-main')).includes('基于已验证知识生成的练习示例'), '题目显示来源标记');
ok((await page.$$('.option-btn')).length === 4, '出现4个选项');
ok((await page.$('.audio-player')) !== null, '音频控制条渲染（播放/慢速/正常/稍快/暂停/循环）');
// 从页面内部读取正确答案并点击 → 验证判定与计时
const correct = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('.option-btn')];
  return btns.length ? btns.map(b => b.getAttribute('data-option')) : [];
});
// 答对一题
await page.waitForTimeout(300);
const answer1 = await page.evaluate(() => {
  // 会话状态不可直接读取；通过点击每个选项前判断：点正确的那个 —— 用解析面板反推
  return null;
});
// 直接点第一个选项（可能对可能错，两种路径都要覆盖）
await page.click('.option-btn');
await page.waitForSelector('.result-panel');
const resultText = await page.textContent('.result-panel');
ok(/正确|错误/.test(resultText), '作答后显示判定结果');
ok(/反应时间/.test(resultText) && /\d+\.\d s?/.test(resultText.replace('s', ' s')), '反应时间以实际秒数显示');
ok(/解析/.test(resultText), '解析在作答后显示');
ok(/原文/.test(resultText), '听力原文在作答后才显示');

/* 4. 反应时间已记录到 localStorage */
const rtCount = await page.evaluate(() => JSON.parse(localStorage.getItem('mjt:response-times') || '[]').length);
ok(rtCount === 1, '反应时间记录已保存（' + rtCount + '条）');

/* 5. 故意答错一题 → 错题本 */
await page.click('[data-action="next"]');
await page.waitForSelector('.option-btn');
const wrongClicked = await page.evaluate(() => {
  // 找到一个错误选项点击：正确答案高亮逻辑在作答后，作答前需从题面推断。
  // 退而求其次：点击全部选项中的两个不同项必有一错——先记录选项，点击第1个，如果结果为“正确”，下一题点第2个。
  return null;
});
// 简单方案：连续作答直到出现一次错误（最多5题）
let gotWrong = false;
for (let i = 0; i < 5 && !gotWrong; i++) {
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('mjt:wrong-answers') || '[]').length);
  const options = await page.$$('.option-btn');
  await options[i % options.length].click();
  await page.waitForSelector('.result-panel');
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('mjt:wrong-answers') || '[]').length);
  if (after > before) gotWrong = true;
  else {
    const next = await page.$('[data-action="next"]');
    if (next) { await next.click(); await page.waitForSelector('.option-btn'); }
  }
}
ok(gotWrong, '答错的题进入错题本');
const ebEntry = await page.evaluate(() => JSON.parse(localStorage.getItem('mjt:wrong-answers') || '[]')[0]);
ok(ebEntry && ebEntry.errorType && ebEntry.responseTime > 0 && ebEntry.masteryStatus === 'weak', '错题记录包含错误类型/反应时间/掌握状态');

/* 6. 刷新后数据保留 */
await page.reload();
await page.waitForSelector('#mjt-nav .nav-item');
const persisted = await page.evaluate(() => ({
  rt: JSON.parse(localStorage.getItem('mjt:response-times') || '[]').length,
  eb: JSON.parse(localStorage.getItem('mjt:wrong-answers') || '[]').length
}));
ok(persisted.rt >= 2 && persisted.eb >= 1, '刷新后进度与错题保留（rt=' + persisted.rt + ', eb=' + persisted.eb + '）');

/* 7. 错题本页显示 */
await page.goto(URL + '#errorbook');
await page.waitForSelector('.data-table');
ok((await page.textContent('#mjt-main')).includes('识别错误') || (await page.textContent('#mjt-main')).includes('错误'), '错题本页面显示错误类型');

/* 8. 学习统计更新 */
await page.goto(URL + '#stats');
const statsText = await page.textContent('#mjt-main');
ok(/总题数/.test(statsText) && !/>\s*0\s*</.test(await page.$eval('.stat-value', e => e.outerHTML)), '学习统计页正确更新');

/* 9. 语法训练：全部题待核实 → 显示"当前已验证题目数量不足" */
await page.goto(URL + '#grammar');
const grammarText = await page.textContent('#mjt-main');
ok(grammarText.includes('当前已验证可用题目') && grammarText.includes('0'), '语法页显示已验证题目数为0');
ok(grammarText.includes('当前已验证题目数量不足'), '待核实内容被拦截，显示数量不足提示');

/* 10. 数据审核页：核实一道语法题 → 进入正式训练 */
await page.goto(URL + '#review');
await page.waitForSelector('.review-item');
const reviewPageText = await page.textContent('#mjt-main');
ok(/已核实/.test(reviewPageText) && /待审核/.test(reviewPageText) && /最近一次验证/.test(reviewPageText), '审核页显示验证计数与最近验证时间');
await page.click('[data-decide="verified"][data-id="g-pending-001"]');
await page.waitForTimeout(300);
const promoted = await page.evaluate(() => JSON.parse(localStorage.getItem('mjt:review-decisions') || '{}'));
ok(promoted['g-pending-001'] && promoted['g-pending-001'].status === 'verified', '审核决定已保存');
await page.goto(URL + '#grammar');
const grammarText2 = await page.textContent('#mjt-main');
ok(grammarText2.includes('1') && grammarText2.includes('当前已验证可用题目'), '核实通过的题目进入正式训练池（1条）');

/* 11. 课程范围过滤：手动模式调到第9课 → 第10课的题被拦截 */
await page.evaluate(() => { MJT.app.saveSettings({ lessonRangeMode: 'manual', maxLesson: 9 }); });
await page.evaluate(() => {
  const map = JSON.parse(localStorage.getItem('mjt:review-decisions') || '{}');
  map['g-pending-002'] = { status: 'verified', at: new Date().toISOString() }; // 第10课的题
  localStorage.setItem('mjt:review-decisions', JSON.stringify(map));
});
await page.goto(URL + '#grammar');
await page.waitForTimeout(200);
const poolAt9 = await page.evaluate(() => MJT.grammar.pool(MJT.app.getSettings()).map(q => q.id));
ok(!poolAt9.includes('g-pending-002'), '手动第1~9课时，声明第10课的题被课程范围过滤拦截');
ok(!poolAt9.includes('g-pending-003'), '第14课的题同样被拦截');
// 切回 Stage2（1~25），maxLesson 应解析为 25
const stage2Max = await page.evaluate(() => { MJT.app.saveSettings({ lessonRangeMode: 'stage', stage: 'stage2' }); return MJT.app.getSettings().maxLesson; });
ok(stage2Max === 25, 'Stage2 累计范围解析为第1~25课（当前=' + stage2Max + '）');

/* 12. 数字题随机生成 + 超纲拦截（第26课模拟，硬上限25） */
const scopeCheck = await page.evaluate(() => {
  const q26 = { id: 'fake', lesson: [26], sourceStatus: 'verified' };
  return {
    blocked26: !MJT.scope.check(q26, { maxLesson: 25 }).allowed,
    gen: !!MJT.numbers.generate('mixed', 2)
  };
});
ok(scopeCheck.blocked26, '第26课以后内容被硬上限（25）拦截');
ok(scopeCheck.gen, '数字题可随机生成');

/* 13. 手机视口 */
const mobile = await ctx.browser().newContext({ viewport: { width: 390, height: 844 } });
const mpage = await mobile.newPage();
mpage.on('pageerror', e => jsErrors.push('mobile: ' + e));
await mpage.goto(URL);
await mpage.waitForSelector('#mjt-nav .nav-item');
const navBox = await mpage.$eval('#mjt-nav', el => getComputedStyle(el).position);
ok(navBox === 'fixed', '手机视口下导航切换为底部固定栏');
const noHScroll = await mpage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
ok(noHScroll, '手机页面无横向溢出');
await mpage.goto(URL + '#numbers');
await mpage.click('#num-start');
await mpage.waitForSelector('.option-btn');
await mpage.click('.option-btn');
await mpage.waitForSelector('.result-panel');
ok(true, '手机端可完成完整作答流程');
await mobile.close();

/* 13.5 场景训练：预览门禁 + 六阶段完整流程 */
await page.goto(URL + '#scenario');
await page.waitForSelector('.scenario-card');
const scText = await page.textContent('#mjt-main');
ok(scText.includes('正式训练场景数量不足'), '未核实时场景页显示数量不足与预览说明');
ok((await page.$$('.scenario-card')).length >= 14, '场景列表渲染14个以上场景卡片');
ok(scText.includes('待核实 · 预览模式'), '待核实场景明确标注预览模式');
// 进入便利店结账场景（预览）
await page.click('[data-sc="scenario-convenience-store-checkout-001"]');
await page.waitForSelector('#sc-start');
const introText = await page.textContent('#mjt-main');
ok(introText.includes('任务：') && introText.includes('店員'), '阶段1：显示任务与人物');
ok(introText.includes('扩展生活词汇') && introText.includes('温める'), '扩展词汇卡片显示（含假名/中文/原因）');
ok(!introText.includes('680円になります'), '阶段1不提前泄露对话原文');
await page.click('#sc-start');
await page.waitForSelector('[data-a]');
ok((await page.textContent('#mjt-main')).includes('原文将在全部作答后才显示'), '阶段2：连续听力不显示原文');
// 分段播放（难度1）：一直点"听下一段"直到进入信息提取
for (let i = 0; i < 10; i++) {
  const nextBtn = await page.$('[data-a="next"]');
  if (nextBtn) { await nextBtn.click(); await page.waitForTimeout(150); }
  else break;
}
await page.click('[data-a="questions"]');
await page.waitForSelector('.option-btn');
ok((await page.textContent('#mjt-main')).includes('信息提取'), '阶段3：信息提取问题渲染');
// 依次作答全部问题（点第一个选项）
for (let i = 0; i < 6; i++) {
  const opts = await page.$$('.option-btn:not([disabled])');
  if (!opts.length) break;
  await opts[0].click();
  await page.waitForSelector('.result-panel');
  const cont = await page.$('#sc-result [data-a="next"]');
  if (cont) { await cont.click(); await page.waitForTimeout(150); }
}
await page.waitForSelector('#sc-shadow');
const scReviewText = await page.textContent('#mjt-main');
ok(scReviewText.includes('完整原文与逐句解析') && scReviewText.includes('680円'), '阶段5：完整解析显示原文');
ok(scReviewText.includes('更自然的回应方式'), '阶段5：显示更自然回应');
await page.click('#sc-shadow');
await page.waitForSelector('#sc-to-reinforce');
ok((await page.textContent('#mjt-main')).includes('意群停顿'), '阶段6a：影子跟读（意群停顿）就绪');
await page.click('#sc-to-reinforce');
await page.waitForSelector('#sc-transfer .option-btn');
ok((await page.textContent('#mjt-main')).includes('迁移强化'), '阶段6b：迁移强化生成新场景题');
const previewNotInStats = await page.evaluate(() =>
  JSON.parse(localStorage.getItem('mjt:response-times') || '[]').filter(r => r.module === 'scenario').length === 0);
ok(previewNotInStats, '预览模式作答不计入正式场景统计');

/* 13.6 审核工作台：筛选 + 批量核实 → 场景进入正式训练 */
await page.goto(URL + '#review');
await page.waitForSelector('[data-f-dataset]');
const rwText = await page.textContent('#mjt-main');
ok(rwText.includes('审核进度') && rwText.includes('批量核实'), '审核工作台渲染（进度/批量按钮）');
await page.click('[data-f-dataset="scenario"]');
await page.waitForSelector('#batch-verify');
await page.click('#batch-verify'); // dialog 自动接受
await page.waitForTimeout(300);
await page.goto(URL + '#scenario');
await page.waitForSelector('.scenario-card');
const scText2 = await page.textContent('#mjt-main');
ok(scText2.includes('已核实') && scText2.includes('开始训练'), '批量核实后场景进入正式训练');
// 正式训练一个场景的第一问并确认计入统计
await page.click('[data-sc="scenario-cafe-order-001"]');
await page.waitForSelector('#sc-start');
await page.click('#sc-start');
for (let i = 0; i < 10; i++) {
  const nextBtn = await page.$('[data-a="next"]');
  if (nextBtn) { await nextBtn.click(); await page.waitForTimeout(120); } else break;
}
await page.click('[data-a="questions"]');
await page.waitForSelector('.option-btn');
await page.click('.option-btn');
await page.waitForSelector('.result-panel');
const formalCounted = await page.evaluate(() =>
  JSON.parse(localStorage.getItem('mjt:response-times') || '[]').filter(r => r.module === 'scenario').length >= 1);
ok(formalCounted, '正式模式场景作答计入统计');

/* 13.7 听力等级页：默认 L3 */
await page.goto(URL + '#listening');
await page.waitForSelector('[data-lv]');
const activeLv = await page.$eval('.chip.active[data-lv]', el => el.getAttribute('data-lv'));
ok(activeLv === '3', '听力默认等级为 Level 3');
await page.click('#listen-start');
await page.waitForSelector('.option-btn');
const lsText = await page.textContent('#mjt-main');
ok(/【.+】/.test(lsText), '听力L3出题为场景句信息提取');

/* 13.8 数字专项双入口 */
await page.goto(URL + '#numbers');
await page.waitForSelector('[data-mode]');
const activeMode = await page.$eval('.chip.active[data-mode]', el => el.getAttribute('data-mode'));
ok(activeMode === 'scene', '数字专项默认入口为场景数字');
ok((await page.textContent('#mjt-main')).includes('基础反应'), '保留基础反应热身入口');

/* 13.9 数据导入门禁（JSON → 待审核，不自动 verified） */
const importResult = await page.evaluate(() => {
  const items = [{ id: 'import-test-1', question: '（　）を食べます。', options: ['ごはん', 'みず'], answer: 'ごはん', explanation: '测试', lesson: [6], grammarPoints: ['を'], sourceStatus: 'verified' }];
  MJT.app.handleImport('test.json', JSON.stringify(items));
  const stored = JSON.parse(localStorage.getItem('mjt:imported-pending') || '[]');
  return stored.length === 1 && stored[0].sourceStatus === 'pending' && stored[0].displaySource === '用户提供';
});
ok(importResult, '导入数据强制进入待审核区（sourceStatus 被覆盖为 pending）');

/* 13.10 统计页升级 */
await page.goto(URL + '#stats');
const statsText2 = await page.textContent('#mjt-main');
ok(statsText2.includes('场景训练') && statsText2.includes('用户回应正确率'), '统计页显示场景统计与回应正确率');
ok(statsText2.includes('知识点掌握') && statsText2.includes('4 个不同场景'), '统计页显示跨场景掌握模型');

/* 13.11 变形训练 2.0：综合模式作答，含变形过程解析 + 词汇池/防重复展示 */
await page.goto(URL + '#conjugation');
await page.waitForSelector('#cj-start');
const cjPage = await page.textContent('#mjt-main');
ok(cjPage.includes('2.0') && cjPage.includes('词汇池') && cjPage.includes('变形听力'), '变形训练页显示2.0/词汇池/听力模式');
ok(/动词 \d+/.test(cjPage), '页面显示真实词汇池数量');
await page.click('#cj-start');
await page.waitForSelector('.option-btn, .answer-input');
const liveText = await page.textContent('#cj-live');
ok(liveText.includes('已用不同词') && liveText.includes('最近20题重复词'), '实时显示防重复统计（不同词/重复词）');
// 作答若干题（文字或输入），确认无重复卡死且计入统计
let answered = 0;
for (let i = 0; i < 6; i++) {
  const opt = await page.$('.option-btn');
  if (opt) { await opt.click(); }
  else { const inp = await page.$('.answer-input'); if (inp) { await inp.fill('テスト'); await page.click('[data-action="submit-input"]'); } }
  await page.waitForTimeout(200);
  const nextBtn = await page.$('[data-action="next"]');
  if (nextBtn) { await nextBtn.click(); await page.waitForTimeout(150); answered++; }
  await page.waitForSelector('.option-btn, .answer-input, .summary-panel').catch(() => {});
  if (await page.$('.summary-panel')) break;
}
ok(answered >= 3, '变形训练可连续作答多题（不卡重复）');
const cjRecorded = await page.evaluate(() =>
  JSON.parse(localStorage.getItem('mjt:response-times') || '[]').some(r => r.module === 'conjugation'));
ok(cjRecorded, '变形训练计入统计');

/* 13.12 变形听力模式：出现音频控制条，答题前隐藏原文 */
await page.goto(URL + '#conjugation');
await page.waitForSelector('[data-m="listen"]');
await page.click('[data-m="listen"]');
await page.click('#cj-start');
await page.waitForSelector('.audio-player');
ok((await page.$('.audio-player')) !== null, '变形听力模式出现音频播放控制条');
const preAnswer = await page.textContent('.question-card');
ok(!/。/.test(preAnswer) || preAnswer.includes('（　）') || preAnswer.includes('原形'), '听力题作答前不直接显示完整原文句');
await page.click('.option-btn');
await page.waitForSelector('.result-panel');
ok((await page.textContent('.result-panel')).includes('原文'), '变形听力作答后显示原文');

/* 13.13 词汇覆盖页 */
await page.goto(URL + '#coverage');
await page.waitForSelector('#mjt-main .stat-grid');
const covText = await page.textContent('#mjt-main');
ok(covText.includes('词汇覆盖率') && covText.includes('教材词表尚未录入'), '词汇覆盖页显示覆盖率与词表未录入提示');
ok(covText.includes('AI 内容生产任务') && covText.includes('录入教材词表'), '覆盖页显示AI生产任务（含人工录入任务）');

/* 13.14 Stage 切换（累计范围） */
await page.goto(URL + '#settings');
await page.waitForSelector('[data-set="stage"]');
await page.click('[data-set="stage"][data-val="stage2"]');
await page.waitForTimeout(150);
const stageBadge = await page.evaluate(() => document.getElementById('mjt-scope-badge').textContent);
ok(stageBadge.includes('第1～25课'), 'Stage2 切换后范围变为第1~25课（累计）');
await page.evaluate(() => MJT.app.saveSettings({ stage: 'stage1', lessonRangeMode: 'stage' }));

/* 14. 深色模式 */
await page.evaluate(() => MJT.app.saveSettings({ theme: 'dark' }));
const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
ok(theme === 'dark', '深色模式切换生效');

/* 15. 无 JS 错误 */
ok(jsErrors.length === 0, '全程无 JavaScript 错误' + (jsErrors.length ? '：' + jsErrors.join(' | ') : ''));

await browser.close();
console.log(`\n冒烟测试：通过 ${pass} 项，失败 ${fail} 项`);
if (failures.length) { console.log(failures.map(f => '  ✗ ' + f).join('\n')); process.exit(1); }
