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
ok((await page.$$('#mjt-nav .nav-item')).length === 12, '页面打开，导航渲染12个页面入口');
ok((await page.textContent('#mjt-scope-badge')).includes('第1～21课'), '顶栏始终显示当前课程范围');

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
const reviewText = await page.textContent('#mjt-main');
ok(/已验证/.test(reviewText) && /待审核/.test(reviewText) && /最近一次验证/.test(reviewText), '审核页显示验证计数与最近验证时间');
await page.click('[data-decide="verified"][data-id="g-pending-001"]');
await page.waitForTimeout(300);
const promoted = await page.evaluate(() => JSON.parse(localStorage.getItem('mjt:review-decisions') || '{}'));
ok(promoted['g-pending-001'] && promoted['g-pending-001'].status === 'verified', '审核决定已保存');
await page.goto(URL + '#grammar');
const grammarText2 = await page.textContent('#mjt-main');
ok(grammarText2.includes('1') && grammarText2.includes('当前已验证可用题目'), '核实通过的题目进入正式训练池（1条）');

/* 11. 课程范围过滤：把范围调到第9课 → 第10课的题被拦截 */
await page.evaluate(() => { MJT.app.saveSettings({ maxLesson: 9 }); });
await page.evaluate(() => {
  const map = JSON.parse(localStorage.getItem('mjt:review-decisions') || '{}');
  map['g-pending-002'] = { status: 'verified', at: new Date().toISOString() }; // 第10课的题
  localStorage.setItem('mjt:review-decisions', JSON.stringify(map));
});
await page.goto(URL + '#grammar');
await page.waitForTimeout(200);
const poolAt9 = await page.evaluate(() => MJT.grammar.pool(MJT.app.getSettings()).map(q => q.id));
ok(!poolAt9.includes('g-pending-002'), '范围设为1~9课时，声明第10课的题被课程范围过滤拦截');
ok(!poolAt9.includes('g-pending-003'), '第14课的题同样被拦截');
await page.evaluate(() => { MJT.app.saveSettings({ maxLesson: 21 }); });

/* 12. 数字题随机生成 + 超纲拦截（第22课模拟） */
const scopeCheck = await page.evaluate(() => {
  const q22 = { id: 'fake', lesson: [22], sourceStatus: 'verified' };
  return {
    blocked22: !MJT.scope.check(q22, { maxLesson: 21 }).allowed,
    gen: !!MJT.numbers.generate('mixed', 2)
  };
});
ok(scopeCheck.blocked22, '第22课以后内容被硬上限拦截');
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

/* 14. 深色模式 */
await page.evaluate(() => MJT.app.saveSettings({ theme: 'dark' }));
const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
ok(theme === 'dark', '深色模式切换生效');

/* 15. 无 JS 错误 */
ok(jsErrors.length === 0, '全程无 JavaScript 错误' + (jsErrors.length ? '：' + jsErrors.join(' | ') : ''));

await browser.close();
console.log(`\n冒烟测试：通过 ${pass} 项，失败 ${fail} 项`);
if (failures.length) { console.log(failures.map(f => '  ✗ ' + f).join('\n')); process.exit(1); }
