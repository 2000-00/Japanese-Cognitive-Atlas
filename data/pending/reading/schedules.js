/* 阅读扩充 —— 时间表/菜单/计划（待审核区）。AI 编写，非教材原文。 */
window.MJT_DATA = window.MJT_DATA || {};
window.MJT_DATA.pendingReading = window.MJT_DATA.pendingReading || [];

(function () {
  function R(p) {
    p.lessonStatus = 'pending';
    p.contentType = 'ai_generated_practice'; p.displaySource = '基于已验证知识生成';
    p.isTextbookOriginal = false; p.origin = '待核实演示数据';
    p.sourceStatus = 'pending'; p.sourceType = 'manual_review'; p.reviewed = false;
    p.sourceReference = 'AI编写的情景资料；课程归属待对照教材核实。';
    if (!p.knowledgeMap) { p.knowledgeMap = []; p.knowledgeMapStatus = 'pending'; }
    return p;
  }

  window.MJT_DATA.pendingReading.push(
    R({
      id: 'r2-sch-001', type: 'timetable', level: '基础', title: '电车时刻表', scenarioId: 'scenario-train-platform-001',
      textJa: 'さくら駅 → うみの駅\n普通　9:05　9:25　9:45\n急行　9:15　9:40\n※急行は15分かかります。普通は25分かかります。\n※料金は同じです。',
      textKana: 'さくらえき → うみのえき\nふつう　9:05　9:25　9:45\nきゅうこう　9:15　9:40\n※きゅうこうはじゅうごふんかかります。ふつうはにじゅうごふんかかります。\n※りょうきんはおなじです。',
      translation: '樱花站→海之站\n普通车 9:05 9:25 9:45\n快车 9:15 9:40\n※快车需要15分钟。普通车需要25分钟。\n※票价相同。',
      questions: [
        { q: '现在是9:10，想最快到达海之站，应该坐哪班车？', options: ['9:15的快车', '9:25的普通车', '9:45的普通车', '9:40的快车'], answer: '9:15的快车', locate: '信息定位：急行行9:15＋「急行は15分かかります」。', reasoning: '推理：9:15快车9:30到；9:25普通车9:50到。需要组合发车时间和所需时长计算。' },
        { q: '快车和普通车的票价？', options: ['一样', '快车贵', '普通车贵', '文中没说'], answer: '一样', locate: '信息定位：最后一行「料金は同じです」。', reasoning: '同じ=相同。注释行的信息容易被忽略。' }
      ],
      sentenceAnalysis: [
        '「15分かかります」— かかる表示花费（时间/金钱）。',
        '「料金は同じです」— 同じ是特殊的な形容词，直接接です。'
      ],
      keyVocab: [{ ja: '普通', kana: 'ふつう', zh: '普通车（每站停）' }, { ja: '急行', kana: 'きゅうこう', zh: '快车' }, { ja: '同じ', kana: 'おなじ', zh: '相同' }],
      keyGrammar: ['かかります', '时刻表达'],
      lesson: [5, 11], difficulty: 2,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    R({
      id: 'r2-sch-002', type: 'menu', level: '基础', title: '咖啡店菜单', scenarioId: 'scenario-cafe-order-001',
      textJa: 'メニュー\nコーヒー　380円\n紅茶　400円\nジュース　350円\nケーキセット（ケーキ＋飲み物）　680円\n※セットの飲み物はコーヒーか紅茶です。',
      textKana: 'メニュー\nコーヒー　さんびゃくはちじゅうえん\nこうちゃ　よんひゃくえん\nジュース　さんびゃくごじゅうえん\nケーキセット（ケーキ＋のみもの）　ろっぴゃくはちじゅうえん\n※セットののみものはコーヒーかこうちゃです。',
      translation: '菜单\n咖啡 380日元\n红茶 400日元\n果汁 350日元\n蛋糕套餐（蛋糕+饮品）680日元\n※套餐饮品限咖啡或红茶。',
      questions: [
        { q: '点蛋糕套餐，饮品可以选什么？', options: ['咖啡或红茶', '任何饮品', '只有咖啡', '果汁或红茶'], answer: '咖啡或红茶', locate: '信息定位：最后一行「コーヒーか紅茶です」。', reasoning: 'か=或者，限定了两个选项；果汁不在套餐范围内。' },
        { q: '单点一杯咖啡和一杯果汁，一共多少钱？', options: ['730円', '780円', '680円', '750円'], answer: '730円', locate: '信息定位：コーヒー380円＋ジュース350円。', reasoning: '380+350=730。基础加法，重点是找对两个价格。' }
      ],
      sentenceAnalysis: [
        '「コーヒーか紅茶」— か连接名词表示二选一。'
      ],
      keyVocab: [{ ja: '紅茶', kana: 'こうちゃ', zh: '红茶' }, { ja: 'セット', kana: 'セット', zh: '套餐' }],
      keyGrammar: ['か（或者）', '金额'],
      lesson: [3, 11], difficulty: 1,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    R({
      id: 'r2-sch-003', type: 'plan', level: '综合', title: '周末旅行计划', scenarioId: 'scene-weather-plan',
      textJa: '土曜日の予定\n8:00　駅に集合\n8:15　電車で出発\n10:30　山に着く\n12:00　昼ごはん（お弁当を持ってきてください）\n15:00　山を下りる\n17:30　駅に戻る\n※雨のときは、日曜日に行きます。',
      textKana: 'どようびのよてい\n8:00　えきにしゅうごう\n8:15　でんしゃでしゅっぱつ\n10:30　やまにつく\n12:00　ひるごはん（おべんとうをもってきてください）\n15:00　やまをおりる\n17:30　えきにもどる\n※あめのときは、にちようびにいきます。',
      translation: '周六的安排\n8:00 车站集合\n8:15 坐电车出发\n10:30 到山上\n12:00 午饭（请自带便当）\n15:00 下山\n17:30 回到车站\n※下雨的话改为周日。',
      questions: [
        { q: '几点在哪里集合？', options: ['8:00在车站', '8:15在车站', '8:00在山下', '10:30在山上'], answer: '8:00在车站', locate: '信息定位：第2行「8:00 駅に集合」。', reasoning: '集合时间（8:00）与出发时间（8:15）相邻且相近，容易混。' },
        { q: '午饭怎么解决？', options: ['自己带便当', '在山上的餐厅吃', '回车站吃', '不吃午饭'], answer: '自己带便当', locate: '信息定位：12:00行「お弁当を持ってきてください」。', reasoning: '持ってくる=带来；括号里的附加指示是关键信息。' },
        { q: '如果周六下雨怎么办？', options: ['改到周日去', '取消活动', '照常去', '改坐巴士'], answer: '改到周日去', locate: '信息定位：最后一行「雨のときは、日曜日に行きます」。', reasoning: 'とき=…的时候（条件）。备注里的条件信息决定整个计划。' },
        { q: '在山上一共待多长时间？', options: ['4个半小时', '2个半小时', '7个小时', '5个小时'], answer: '4个半小时', locate: '信息定位：10:30到山＋15:00下山。', reasoning: '推理：15:00−10:30=4小时30分。需要用两个时刻计算时长。' }
      ],
      sentenceAnalysis: [
        '「駅に集合」— に标记集合地点（到达点）。',
        '「電車で出発」— で标记交通手段。',
        '「持ってきてください」— 持って＋くる＋ください。',
        '「雨のときは」— 名词＋の＋とき：…的时候。'
      ],
      keyVocab: [{ ja: '集合', kana: 'しゅうごう', zh: '集合' }, { ja: '戻る', kana: 'もどる', zh: '返回' }, { ja: 'お弁当', kana: 'おべんとう', zh: '便当' }],
      keyGrammar: ['に（地点/时点）', 'で（手段）', 'とき'],
      lesson: [5, 16], difficulty: 3,
      knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-ni' }], knowledgeMapStatus: 'verified'
    }),
    R({
      id: 'r2-sch-004', type: 'diary', level: '综合', title: '日记：去医院的一天', scenarioId: 'scenario-hospital-reception-001',
      textJa: '4月14日（月）\n朝から頭が痛かったから、学校を休んで病院へ行った。\n病院は人が多くて、2時間待った。\n先生は「風邪ですね。薬を出しますから、今日はゆっくり休んでください」と言った。\n薬局で薬をもらった。760円だった。\n薬を飲んで、午後はずっと寝ていた。夜は少し元気になった。\nあしたは学校へ行くことができると思う。',
      textKana: 'しがつじゅうよっか（げつ）\nあさからあたまがいたかったから、がっこうをやすんでびょういんへいった。\nびょういんはひとがおおくて、にじかんまった。\nせんせいは「かぜですね。くすりをだしますから、きょうはゆっくりやすんでください」といった。\nやっきょくでくすりをもらった。ななひゃくろくじゅうえんだった。\nくすりをのんで、ごごはずっとねていた。よるはすこしげんきになった。\nあしたはがっこうへいくことができるとおもう。',
      translation: '4月14日（周一）\n从早上开始头疼，所以向学校请假去了医院。\n医院人很多，等了2个小时。\n医生说"是感冒。我给你开药，今天好好休息"。\n在药局拿了药。760日元。\n吃了药，下午一直在睡。晚上稍微好点了。\n我想明天能去学校。',
      questions: [
        { q: '写日记的人为什么去医院？', options: ['头疼', '牙疼', '肚子疼', '发烧'], answer: '头疼', locate: '信息定位：第2行「頭が痛かったから」。', reasoning: '部位が痛い＋から（理由）。' },
        { q: '在医院等了多久？', options: ['2小时', '2点钟', '1小时', '半小时'], answer: '2小时', locate: '信息定位：第3行「2時間待った」。', reasoning: 'にじかん=2小时（时长），不是2点（时刻）。' },
        { q: '医生说了什么？', options: ['是感冒，今天好好休息', '是感冒，马上住院', '不是感冒，可以上学', '要做检查'], answer: '是感冒，今天好好休息', locate: '信息定位：第4行「風邪ですね。…休んでください」と言った。', reasoning: '「」＋と言った是直接引用医生的话。' },
        { q: '关于明天，写日记的人怎么想？', options: ['应该能去学校', '继续请假', '再去一次医院', '不确定'], answer: '应该能去学校', locate: '信息定位：最后一行「行くことができると思う」。', reasoning: 'ことができる（能够）＋と思う（我想）——简体日记的推测表达。' }
      ],
      sentenceAnalysis: [
        '「痛かったから」— い形容词过去（痛かった）＋から理由。',
        '「休んで病院へ行った」— て形动作链（简体过去收尾）。',
        '「～と言った」— 引用医生的话。',
        '「元気になった」— な形容词＋に＋なる：状态变化。',
        '「行くことができると思う」— 双重嵌套：能力句＋想法引用。'
      ],
      keyVocab: [{ ja: 'ずっと', kana: 'ずっと', zh: '一直' }, { ja: 'もらう', kana: 'もらう', zh: '领取、得到' }],
      keyGrammar: ['から（理由）', 'と言う', 'なります', 'ことができます', '简体'],
      lesson: [17, 18, 19, 21], difficulty: 3,
      knowledgeMap: [
        { module: 'core-grammar', section: '接续', node: 'cg-c-reason' },
        { module: 'core-grammar', section: 'た形', node: 'cg-ta-form' }
      ], knowledgeMapStatus: 'verified'
    })
  );
})();
