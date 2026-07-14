# Minna Japanese Trainer — 开发与维护指南

> 2026-07 场景化升级：系统重定位为"场景驱动的沉浸式日语训练系统"。
> 训练主线：场景 → 连续听力 → 信息提取 → 用户回应 → 完整解析 →
> 影子跟读 → 迁移强化。孤立数字题降级为"基础热身"，在正式听力
> 训练中的占比被组卷器强制 ≤5%（validator.checkWarmupRatio 抽样校验）。

## 场景系统（新增）

- 场景数据在 `data/pending/scenarios/*.js`（shopping/dining/medical/
  transport/school/housing），每个场景含：生活任务、3~8轮对话、≥2个
  信息提取问题、≥1次用户回应（acceptedAnswers）、完整解析
  （review.lineNotes/naturalResponses/grammarNotes）、迁移强化
  （reinforcement）、扩展词汇（extendedVocab，≤5个，标 extended_basic）。
- **场景模板 = 程序逻辑 / 基于已验证知识生成的练习**（2026-07 调整）：
  `sourceStatus: 'verified'`、`contentType: 'ai_generated_practice'`、
  `isTextbookOriginal: false`，**直接进入正式训练**、计入统计，不再有
  "审核预览"门禁。仅两种情况排除场景：① 用户在数据审核页显式"拒绝"；
  ② 扩展词汇设置为 off（含扩展词的场景）。`lessonStatus` 仍 pending
  （不声明"教材第N课"）。只有教材原文/词汇/语法/例句才走 pending→verified。
- **永不空白**：场景页提供"随机场景"与"自动生成综合反应组"（数字+变形，
  全部基于 verified 通用知识动态生成），任何时候进入都有内容。
- 播放器：`src/modules/scenario.js`；六阶段流程 + 意群停顿影子跟读。

### 如何添加新场景

1. 复制 `data/pending/scenarios/` 中任一场景对象，改 id（格式
   `scenario-<场景>-NNN`）、对话、问题；确保：对话3~8轮、信息问题≥2、
   respond 步骤带 acceptedAnswers、extendedVocab≤5。
2. 若新增文件，在 `trainer.html` 加对应 `<script src>`，并在
   `tests/run-tests.mjs` 的 files 列表中登记。
3. `node tests/run-tests.mjs` —— validateScenario 会拦截结构缺陷。
4. 打开"数据审核"→ 筛选"场景"→ 对照教材核实。

## 听力等级 —— Listening Engine 2.0（2026-07 重写）

六个等级**各自独立动态生成**，点哪级练哪级，绝不退化成数字题：

| 等级 | 结构 | 生成器 |
|------|------|--------|
| L1 | 单信息热身（数字/时间/日期/数量词，听音识别） | `generateLevel1()` |
| L2 | 带单位短句（名词＋数量＋谓语的完整句，禁止只播"110円"） | `generateLevel2()` |
| L3（默认） | 场景单句，含 ≥2 信息点 | `generateLevel3()` |
| L4 | 人物＋双信息＋先后/并列关系 | `generateLevel4()` |
| L5 | 2～4 轮短对话 | `generateLevel5()` |
| L6 | 4～8 轮完整场景＋综合/用户回应（禁止退化成单句/两轮） | `generateLevel6()` |

- 引擎：`src/modules/listening.js`；素材池：`data/listening/skeletons.js`
  （句型骨架 × 词汇槽 × 数字槽 × 人物 × 场景动态组合，数值/时间/金额每题
  随机，组合近乎无限）。`displayText`/`speechText`/`readingText` 同源，作答后
  才显示原文；干扰项按真实听错方式生成，四选项同类别。
- **等级隔离 + 结构硬验证 + 不静默降级**：`generate(level)` 每题调用
  `validator.validateListeningLevelStructure(item, level)`——生成题的
  `listeningLevel` 与当前所选不一致、或结构不达标，**该题被拒绝并重新生成**，
  连续失败达上限则显示真实错误（`__listeningError`），绝不用更简单的题替代。
  每个等级有独立的防重复历史（指纹会话内唯一、骨架/场景/数字组合/目标词/
  答案位置分级去重）；`startSession` 进入时 `resetLevel(level)` 清空该级队列。
  每条题带 `{listeningLevel, generatorId, structureType}`。
- 测试：`run-tests.mjs` 对每级各生成 60 题过结构验证、每级 200 题 0 重复、
  等级不符必被拒；`smoke.mjs` 逐个点击 L1–L6 校验真实结构。

## 跨场景掌握（新增）

`src/core/mastery.js`：同一知识点需在 ≥4 个不同场景/语境最近一次
作答均正确才标记 mastered；任一语境答错回到 weak。数据存 mastery-map。

## 审核工作台（升级）

筛选（数据集/状态/课程/关键词）、播放听力文本、显示完整题目与解析、
修改课程编号（存为 reviewDecisions 覆盖值）、批量核实/拒绝、导出审核
结果、导入数据（JSON/CSV/TXT → 一律强制 pending，验证后进待审核区）。

《大家的日语》1～21课综合训练系统（`trainer.html`）的开发文档。
与知识图谱应用（`index.html`，Japanese Cognitive Atlas）共存于同一仓库，
两者互不修改对方代码；训练题通过 `knowledgeMap` 字段引用 Atlas 的真实节点 id。

## 启动

直接双击 `trainer.html` 在浏览器打开（`file://` 即可，无需构建、无需服务器）。
注意：数据/逻辑通过普通 `<script src>` 加载（非 ES Module），因此 `file://` 下可用。

## 目录结构

```
trainer.html              入口页面（只有壳，不含题目数据）
src/
  app.js                  路由 + 全部页面（首页/今日/专项/错题本/统计/审核/设置…）
  styles/main.css         主样式（浅色/深色主题、字号档位）
  styles/responsive.css   手机适配（底部导航）
  core/
    scope.js              课程范围控制器（硬上限21课 + 用户范围 + 来源状态门禁）
    validator.js          数据验证器（启动时运行，失败条目不进入训练）
    session.js            训练会话引擎（出题/计时/判定/解析/快捷键）
    errorbook.js          错题本（自动错误分类、掌握状态）
    stats.js              统计（正确率/反应时间/连对连错/最弱项）
    adaptive.js           自适应规则（全部权重函数集中在此，便于修改）
  modules/
    numbers.js            数字专项（读法转换器 + 各类别题目生成器）
    grammar.js listening.js reading.js mixed.js   题库类训练模块
  utils/
    storage.js random.js speech.js
data/
  meta.js                 元数据（课程范围、类别、错误类型、来源标签）
  readings.js             数字/时间/日期/金额读法表（verified 通用读法）
  counters.js             数量词（读法 verified；课程归属 pending）
  knowledge-map.js        Atlas 节点索引（validator 据此校验 knowledgeMap）
  pending/                待审核数据（与正式数据物理分离）
    grammar-pending.js listening-pending.js reading-pending.js
tests/
  run-tests.mjs           单元测试（node tests/run-tests.mjs）
  smoke.mjs               浏览器冒烟测试（需 playwright）
```

## 数据保存在哪里

全部用户数据保存在浏览器 `localStorage`（键前缀 `mjt:`）：
`settings` / `user-progress` / `wrong-answers` / `response-times` /
`training-history` / `mastery-map` / `review-decisions` / `last-session`。
设置页支持导出/导入 JSON 备份。清浏览器数据会清空进度，请定期导出。

## 真实性模型（必须遵守）

两条独立的可信度轴：

1. **sourceStatus**（语言内容本身）：`verified` / `pending` / `rejected`。
   只有 verified 进入正式训练；pending 只出现在「数据审核」页。
2. **lessonAttribution**（“属于教材第几课”的声明）：未经用户对照实体
   教材核实一律 `pending`。数量词/数字读法是辞典可查证的通用语言事实，
   内容 verified，但课程归属 pending —— 因此数字专项默认运行在
   「通用读法模式」（明确不声明教材出处）。

禁止事项（validator 会拦截其中可机检的部分）：
- 使用 `教材原句` 标签（本仓库不保存可核实的教材原文）。
- 课程编号 > 21 的内容。
- `sourceType: unknown` 直接标为 `verified`。
- 引用 Atlas 中不存在的知识图谱节点。

## 如何添加新题目

1. 在 `data/pending/` 对应文件的数组中追加一条，字段参照现有条目
   （必填：id、question、options、answer、explanation、grammarPoints、
   lesson、sourceStatus: 'pending'、sourceType、sourceReference、origin）。
2. `node tests/run-tests.mjs` 确认验证器通过（invalid 必须为 0）。
3. 打开应用 →「数据审核」→ 对照教材核实课程归属 → 点「核实通过」。
   核实决定存放在本机 `mjt:review-decisions`；若要让核实结果对所有用户
   生效，把该条目的 `sourceStatus` 改为 `'verified'`、`reviewed: true`，
   并在 `sourceReference` 写明核实依据（谁、对照什么资料、何时）。

## 如何审核待核实内容

「数据审核」页列出全部 pending 条目（数量词课程归属、语法/听力/阅读题），
显示已验证/待审核/已拒绝/校验失败四个计数与最近验证时间。
「核实通过」= 你已拿实体教材确认课程归属（等同 user_material 人工核实）；
「拒绝」= 内容或归属有误，条目对学习者完全隐藏。决定可撤销。

## 如何扩展到第22课以后

1. `data/meta.js` 的 `lessonMax` 与 `src/core/scope.js` 的 `HARD_MAX`
   同步改为新上限（validator 会校验两者一致）。
2. 在数据文件中添加第22课以后的知识点/题目（仍走 pending → 审核流程）。
3. 设置页的课程范围选项会随 `lessonMax` 生效；跑一遍两套测试。

## 音频

当前使用浏览器 `speechSynthesis`（**不是母语者真人录音**，界面上有明示）。
每条听力数据都有 `audioUrl` 字段：填入真实音频文件路径后播放器会优先
播放该文件、失败才退回 TTS —— 这是接入真人录音的预留接口。

## 测试

```
node tests/run-tests.mjs        # 单元测试：转换器/验证器/范围/自适应/生成器体检
node tests/smoke.mjs            # 浏览器端到端（需 npm install playwright 及 Chromium）
```

改动数据或核心逻辑后两者都要跑；生成器相关改动建议连跑多次（题目随机）。
