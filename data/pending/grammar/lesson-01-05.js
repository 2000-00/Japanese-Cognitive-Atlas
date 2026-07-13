/* 语法题扩充 —— 声明课程段：第1～5课（待审核区）
 * 全部为 AI 基于常见初级语法编写的练习（非教材原文），课程归属待核实。 */
window.MJT_DATA = window.MJT_DATA || {};
window.MJT_DATA.pendingGrammar = window.MJT_DATA.pendingGrammar || [];

(function () {
  function G(q) {
    q.type = 'grammar';
    q.lessonStatus = 'pending';
    q.contentType = 'ai_generated_practice';
    q.displaySource = '基于已验证知识生成';
    q.isTextbookOriginal = false;
    q.origin = '待核实演示数据';
    q.sourceStatus = 'pending';
    q.sourceType = 'manual_review';
    q.reviewed = false;
    q.sourceReference = 'AI基于常见初级语法编写；课程归属待对照教材核实。';
    if (!q.knowledgeMap) { q.knowledgeMap = []; q.knowledgeMapStatus = 'pending'; }
    return q;
  }
  var KM = function (node, section) { return [{ module: 'core-grammar', section: section || '', node: node }]; };

  window.MJT_DATA.pendingGrammar.push(
    G({
      id: 'g2-0101', questionType: '单项选择', scenarioContext: '自我介绍：第一次见到宿舍同学',
      question: 'はじめまして。わたし（　）リンです。', questionKana: 'はじめまして。わたし（　）リンです。',
      options: ['は', 'が', 'を', 'に'], answer: 'は',
      translation: '初次见面。我是林。',
      explanation: '自我介绍时「わたし」是谈话双方都明确的话题，用は标记：わたしはリンです（判断句：名词＋は＋名词＋です）。',
      wrongAnswerReasons: { 'が': 'が引入新信息或回答疑问词，自报姓名的常规形式用は。', 'を': 'を标记动作对象，判断句没有动作。', 'に': 'に标记落点/时点，此处无关。' },
      grammarPoints: ['判断句', 'は话题'], particles: ['は'], verbForms: [], lesson: [1], difficulty: 1,
      knowledgeMap: KM('cg-copula-da-desu', '判断句'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0102', questionType: '单项选择', scenarioContext: '便利店：确认收银台前的东西是不是自己的伞',
      question: 'すみません、これ（　）わたしの傘です。', questionKana: 'すみません、これ（　）わたしのかさです。',
      options: ['は', 'を', 'で', 'へ'], answer: 'は',
      translation: '不好意思，这是我的伞。',
      explanation: '「これ」作为话题用は。名词修饰名词用の：わたしの傘（我的伞）。',
      wrongAnswerReasons: { 'を': '判断句无动作对象。', 'で': 'で表示场所/手段。', 'へ': 'へ表示方向。' },
      grammarPoints: ['指示词これ', 'の（所属）'], particles: ['は', 'の'], verbForms: [], lesson: [2], difficulty: 1,
      knowledgeMap: KM('cg-copula-da-desu', '判断句'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0103', questionType: '情景选句', scenarioContext: '商店：店员在你旁边，商品在店员手里',
      question: '想说"那个（店员手里的东西）多少钱"，最自然的是？',
      options: ['それはいくらですか。', 'これはいくらですか。', 'あれはいくらですか。', 'どれはいくらですか。'], answer: 'それはいくらですか。',
      translation: '那个多少钱？',
      explanation: 'これ/それ/あれ以说话人为基准：对方手里・离对方近＝それ；自己手里＝これ；离两人都远＝あれ。どれ是疑问词"哪个"，不能配は提问价格。',
      wrongAnswerReasons: { 'これはいくらですか。': 'これ指自己身边的东西。', 'あれはいくらですか。': 'あれ指离双方都远的东西。', 'どれはいくらですか。': 'どれ是"哪个"，句义不通，且疑问词不接は。' },
      grammarPoints: ['指示词これ/それ/あれ'], particles: ['は'], verbForms: [], lesson: [2, 3], difficulty: 1,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    G({
      id: 'g2-0104', questionType: '单项选择', scenarioContext: '问路：找洗手间',
      question: 'すみません、トイレは（　）ですか。',
      options: ['どこ', 'どれ', 'なん', 'だれ'], answer: 'どこ',
      translation: '请问洗手间在哪里？',
      explanation: '问场所用どこ（哪里）。ここ/そこ/あそこ/どこ是场所指示词系列。',
      wrongAnswerReasons: { 'どれ': 'どれ问"哪一个（物品）"。', 'なん': 'なん问"什么"。', 'だれ': 'だれ问"谁"。' },
      grammarPoints: ['ここ/そこ/あそこ/どこ'], particles: ['は'], verbForms: [], lesson: [3], difficulty: 1,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    G({
      id: 'g2-0105', questionType: '单项选择', scenarioContext: '车站服务台：问银行位置',
      question: '銀行はあそこです。エレベーターの（　）です。', questionKana: 'ぎんこうはあそこです。エレベーターの（　）です。',
      options: ['となり', 'いくら', 'どこ', 'なんじ'], answer: 'となり',
      translation: '银行在那边。电梯的旁边。',
      explanation: '方位词：となり（旁边）。名词＋の＋方位词＝"～的旁边"。',
      wrongAnswerReasons: { 'いくら': '问价格。', 'どこ': '疑问词放在回答句中不通。', 'なんじ': '问时刻。' },
      grammarPoints: ['方位词', 'の'], particles: ['の'], verbForms: [], lesson: [3], difficulty: 1,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    G({
      id: 'g2-0106', questionType: '单项选择', scenarioContext: '和同学确认下课时间',
      question: '授業は何時（　）終わりますか。', questionKana: 'じゅぎょうはなんじ（　）おわりますか。',
      options: ['に', 'を', 'で', 'が'], answer: 'に',
      translation: '课几点结束？',
      explanation: '具体时刻后接に表示动作发生的时点：何時に終わりますか。',
      wrongAnswerReasons: { 'を': 'を标记动作对象。', 'で': 'で标记场所/手段，不标记时刻。', 'が': 'が标记主语，时刻不是主语。' },
      grammarPoints: ['时间表达', 'に（时点）'], particles: ['に'], verbForms: ['ます形'], lesson: [4], difficulty: 1,
      knowledgeMap: KM('cg-p-ni', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0107', questionType: '单项选择', scenarioContext: '介绍作息：每天几点睡',
      question: '毎晩11時（　）寝ます。', questionKana: 'まいばんじゅういちじ（　）ねます。',
      options: ['に', 'は', 'まで', 'から'], answer: 'に',
      translation: '每晚11点睡觉。',
      explanation: '具体时刻＋に＋动词。注意「毎晩・毎日」这类词本身不加に。',
      wrongAnswerReasons: { 'は': '把11時变成对比话题，语感不自然。', 'まで': 'まで是"直到11点（一直做）"，与寝ます瞬间动作不符。', 'から': 'から是"从11点开始"，句义变了。' },
      grammarPoints: ['に（时点）'], particles: ['に'], verbForms: ['ます形'], lesson: [4], difficulty: 1,
      knowledgeMap: KM('cg-p-ni', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0108', questionType: '单项选择', scenarioContext: '便利店打工：店从几点开到几点',
      question: '店は9時（　）9時までです。', questionKana: 'みせはくじ（　）くじまでです。',
      options: ['から', 'に', 'で', 'へ'], answer: 'から',
      translation: '店从（早上）9点开到（晚上）9点。',
      explanation: 'から标记起点、まで标记终点，成对使用：9時から9時まで。',
      wrongAnswerReasons: { 'に': 'に是时点，不与まで构成区间。', 'で': 'で不标记时间起点。', 'へ': 'へ是方向。' },
      grammarPoints: ['から～まで'], particles: ['から', 'まで'], verbForms: [], lesson: [4], difficulty: 1,
      knowledgeMap: KM('cg-p-kara-made', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0109', questionType: '正误判断', scenarioContext: '写日记：昨天的事',
      question: '「きのう、映画を見ます。」这句话对吗？', questionKana: '「きのう、えいがをみます。」',
      options: ['错，应改为見ました', '对，完全正确', '错，应改为見ません', '错，应删掉を'], answer: '错，应改为見ました',
      translation: '（改正后）昨天看了电影。',
      explanation: '时间词きのう（昨天）是过去，谓语必须用过去形見ました。日语时制由谓语词尾强制表达。',
      wrongAnswerReasons: { '对，完全正确': '时间词与时制矛盾。', '错，应改为見ません': '見ません是现在否定，与昨天矛盾。', '错，应删掉を': '見る是他动词，对象必须用を。' },
      grammarPoints: ['ました（过去）', '时制一致'], particles: ['を'], verbForms: ['ます形'], lesson: [4], difficulty: 1,
      knowledgeMap: KM('cg-masu-form', '敬体'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0110', questionType: '单项选择', scenarioContext: '和朋友说周末去京都',
      question: '日曜日、友達と京都（　）行きます。', questionKana: 'にちようび、ともだちときょうと（　）いきます。',
      options: ['へ', 'を', 'で', 'の'], answer: 'へ',
      translation: '星期天和朋友去京都。',
      explanation: '移动动词（行く/来る/帰る）的方向用へ（或に）。「友達と」的と=共同动作者。',
      wrongAnswerReasons: { 'を': 'を接移动动词表示经过域（公園を散歩），目的地不用を。', 'で': 'で是动作场所，行きます的目的地不用で。', 'の': 'の连接名词，不能连接名词和动词。' },
      grammarPoints: ['へ（方向）', 'と（同伴）'], particles: ['へ', 'と'], verbForms: ['ます形'], lesson: [5], difficulty: 1,
      knowledgeMap: KM('cg-p-he', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0111', questionType: '单项选择', scenarioContext: '车站：说明用什么方式去机场',
      question: '空港まで電車（　）行きます。', questionKana: 'くうこうまででんしゃ（　）いきます。',
      options: ['で', 'に', 'を', 'が'], answer: 'で',
      translation: '坐电车去机场。',
      explanation: '交通手段用で：電車で行きます（坐电车去）。まで标记终点。',
      wrongAnswerReasons: { 'に': '電車に乗ります（上车）才用に；表示手段用で。', 'を': 'を是动作对象。', 'が': 'が是主语标记。' },
      grammarPoints: ['で（手段）'], particles: ['で', 'まで'], verbForms: ['ます形'], lesson: [5], difficulty: 1,
      knowledgeMap: KM('cg-p-de', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0112', questionType: '单项选择', scenarioContext: '问朋友什么时候回国',
      question: 'いつ国へ帰りますか。——来月の15日（　）帰ります。', questionKana: 'いつくにへかえりますか。——らいげつのじゅうごにち（　）かえります。',
      options: ['に', 'で', 'へ', 'まで'], answer: 'に',
      translation: '什么时候回国？——下个月15号回去。',
      explanation: '具体日期（15日）后用に。注意疑问词いつ本身不加に。',
      wrongAnswerReasons: { 'で': 'で不标记时点。', 'へ': 'へ是方向，前面已有国へ。', 'まで': 'まで是"直到15号一直……"，与一次性动作帰ります不符。' },
      grammarPoints: ['に（时点）', 'いつ'], particles: ['に'], verbForms: ['ます形'], lesson: [5], difficulty: 2,
      knowledgeMap: KM('cg-p-ni', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0113', questionType: '简体与敬体转换', scenarioContext: '把对朋友说的话改成对老师说',
      question: '对朋友说「あした行く」。对老师应该说？',
      options: ['あした行きます。', 'あした行くです。', 'あした行きareます。', 'あした行くだ。'], answer: 'あした行きます。',
      translation: '明天去。（敬体）',
      explanation: '动词简体（辞书形）→敬体：行く→行きます（五段动词词尾く变き段＋ます）。「行くです」是简体敬体混接的典型错误。',
      wrongAnswerReasons: { 'あした行くです。': '动词辞书形不能直接+です。', 'あした行きareます。': '不存在的形式。', 'あした行くだ。': '行く是动词，不接だ。' },
      grammarPoints: ['敬体与简体', 'ます形'], particles: [], verbForms: ['ます形', '辞书形'], lesson: [5, 20], difficulty: 2,
      knowledgeMap: KM('cg-masu-form', '敬体'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0114', questionType: '句子排序', scenarioContext: '车站售票口：组一句"从东京到大阪多少钱"',
      question: '排序：①いくらですか ②大阪まで ③東京から',
      options: ['③②①', '②③①', '①③②', '③①②'], answer: '③②①',
      translation: '从东京到大阪多少钱？',
      explanation: '正确语序：東京から大阪までいくらですか。から（起点）在前，まで（终点）在后，疑问句收尾。',
      wrongAnswerReasons: { '②③①': '起点终点顺序颠倒后语义变成"从大阪到东京"。', '①③②': '疑问词组不能开头割裂句子。', '③①②': '把いくらですか插在中间不成句。' },
      grammarPoints: ['から～まで', 'いくら'], particles: ['から', 'まで'], verbForms: [], lesson: [5], difficulty: 2,
      knowledgeMap: KM('cg-p-kara-made', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0115', questionType: '改错', scenarioContext: '介绍学校：这里是教室',
      question: '找出错误：「ここは教室ではありません、図書館です。」的敬体否定部分应该是？',
      options: ['正确，ではありません没有错', '应改为じゃないです才对，ではありません是错的', '应改为ありません', '应改为ではないだ'], answer: '正确，ではありません没有错',
      translation: '这里不是教室，是图书馆。',
      explanation: '名词句敬体否定＝ではありません（口语=じゃありません，两者都对）。本题考查确认正确形式的能力——ではありません本身无误。',
      wrongAnswerReasons: { '应改为じゃないです才对，ではありません是错的': 'じゃないです也对，但不能说ではありません错。', '应改为ありません': 'ありません缺少系词部分では。', '应改为ではないだ': 'ない后不能再加だ。' },
      grammarPoints: ['判断句否定'], particles: ['は'], verbForms: [], lesson: [1, 3], difficulty: 2,
      knowledgeMap: KM('cg-copula-da-desu', '判断句'), knowledgeMapStatus: 'verified'
    })
  );
})();
