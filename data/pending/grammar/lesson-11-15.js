/* 语法题扩充 —— 声明课程段：第11～15课（待审核区）
 * AI 基于常见初级语法编写（非教材原文），课程归属待核实。 */
window.MJT_DATA = window.MJT_DATA || {};
window.MJT_DATA.pendingGrammar = window.MJT_DATA.pendingGrammar || [];

(function () {
  function G(q) {
    q.type = 'grammar'; q.lessonStatus = 'pending';
    q.contentType = 'ai_generated_practice'; q.displaySource = '基于已验证知识生成';
    q.isTextbookOriginal = false; q.origin = '待核实演示数据';
    q.sourceStatus = 'pending'; q.sourceType = 'manual_review'; q.reviewed = false;
    q.sourceReference = 'AI基于常见初级语法编写；课程归属待对照教材核实。';
    if (!q.knowledgeMap) { q.knowledgeMap = []; q.knowledgeMapStatus = 'pending'; }
    return q;
  }
  var KM = function (node, section) { return [{ module: 'core-grammar', section: section || '', node: node }]; };

  window.MJT_DATA.pendingGrammar.push(
    G({
      id: 'g2-1101', questionType: '单项选择', scenarioContext: '纪念品店：想要一台新相机',
      question: '新しいカメラ（　）ほしいです。', questionKana: 'あたらしいカメラ（　）ほしいです。',
      options: ['が', 'を', 'に', 'は'], answer: 'が',
      translation: '想要新相机。',
      explanation: 'ほしい（想要东西）的对象用が：カメラがほしいです。ほしい是い形容词。',
      wrongAnswerReasons: { 'を': 'ほしい不是动词，对象不用を。', 'に': 'に不标记愿望对象。', 'は': '一般愿望句用が，は用于对比。' },
      grammarPoints: ['ほしい（愿望）'], particles: ['が'], verbForms: [], lesson: [13], difficulty: 1,
      knowledgeMap: KM('cg-m-tai-hoshii', '愿望'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1102', questionType: '单项选择', scenarioContext: '午休：说想吃拉面',
      question: 'ラーメンが食べ（　）です。', questionKana: 'ラーメンがたべ（　）です。',
      options: ['たい', 'ほしい', 'たがる', 'たく'], answer: 'たい',
      translation: '想吃拉面。',
      explanation: '想做某动作＝动词ます形词干＋たい：食べます→食べたい。想要东西才用ほしい（名词がほしい）。',
      wrongAnswerReasons: { 'ほしい': 'ほしい接名词（ラーメンがほしい），不接动词词干。', 'たがる': 'たがる用于第三者的愿望。', 'たく': 'たく是たい的连用形，不能结句。' },
      grammarPoints: ['たい（愿望）'], particles: ['が'], verbForms: ['ます形词干'], lesson: [13], difficulty: 1,
      knowledgeMap: KM('cg-m-tai-hoshii', '愿望'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1103', questionType: '单项选择', scenarioContext: '周末计划：去神户吃中华料理',
      question: '神戸へ中華料理を食べ（　）行きます。', questionKana: 'こうべへちゅうかりょうりをたべ（　）いきます。',
      options: ['に', 'を', 'で', 'が'], answer: 'に',
      translation: '去神户吃中华料理。',
      explanation: '移动的目的用ます形词干＋に＋移动动词：食べに行きます（去吃）。',
      wrongAnswerReasons: { 'を': '目的不用を。', 'で': 'で是场所/手段。', 'が': 'が是主语。' },
      grammarPoints: ['目的：ます形词干+に行く'], particles: ['に', 'へ'], verbForms: ['ます形词干'], lesson: [13], difficulty: 2,
      knowledgeMap: KM('cg-p-ni', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1104', questionType: '动词变形', scenarioContext: '请店员稍等',
      question: '「待つ」的て形＋ください是？', questionKana: '「まつ」',
      options: ['待ってください', '待いてください', '待ちてください', '待んでください'], answer: '待ってください',
      translation: '请等一下。',
      explanation: '待つ是五段动词，词尾つ→促音便って：待って＋ください。う/つ/る组都变って。',
      wrongAnswerReasons: { '待いてください': 'いて用于く结尾（書く→書いて）。', '待ちてください': '未经音便的错误形。', '待んでください': 'んで用于ぬ/ぶ/む结尾。' },
      grammarPoints: ['て形音便：つ→って', 'てください'], particles: [], verbForms: ['て形'], lesson: [14], difficulty: 1,
      knowledgeMap: KM('cg-te-form-formation', '动词变形'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1105', questionType: '动词变形', scenarioContext: '朋友在打电话：说明他正在做什么',
      question: '田中さんは今、電話を（　）います。', questionKana: 'たなかさんはいま、でんわを（　）います。',
      options: ['かけて', 'かかって', 'かけって', 'かけで'], answer: 'かけて',
      translation: '田中现在正在打电话。',
      explanation: 'かける（一段动词）→て形かけて（去る+て）。ています表示动作进行中。',
      wrongAnswerReasons: { 'かかって': 'かかる是自动词"（电话）打来"，主语不符。', 'かけって': '一段动词不发生促音便。', 'かけで': 'て形不写作で（かける无浊音便）。' },
      grammarPoints: ['ています（进行）', '一段动词て形'], particles: ['を'], verbForms: ['て形'], lesson: [14], difficulty: 2,
      knowledgeMap: KM('cg-a-teiru', '体'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1106', questionType: '单项选择', scenarioContext: '美术馆：询问能否拍照被拒绝',
      question: 'すみません、ここで写真を撮っては（　）。', questionKana: 'すみません、ここでしゃしんをとっては（　）。',
      options: ['いけません', 'いいです', 'あります', 'ください'], answer: 'いけません',
      translation: '（在这里）不可以拍照。',
      explanation: '禁止句型：て形＋はいけません（做…是不行的）。与许可てもいいです构成对偶。',
      wrongAnswerReasons: { 'いいです': 'てはいいです不是正确句型，许可是てもいいです。', 'あります': '不构成句型。', 'ください': 'てください是请求，与ては不接。' },
      grammarPoints: ['てはいけません（禁止）'], particles: [], verbForms: ['て形'], lesson: [15], difficulty: 1,
      knowledgeMap: KM('cg-pol-temoii', '许可禁止'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1107', questionType: '情景选句', scenarioContext: '教室太热，想开窗，先征求同意',
      question: '要征求"可以开窗吗"，最自然的说法是？',
      options: ['窓を開けてもいいですか。', '窓を開けてはいけませんか。', '窓を開けますか。', '窓が開きたいです。'], answer: '窓を開けてもいいですか。',
      translation: '可以开窗吗？',
      explanation: '请求许可＝て形＋もいいですか。開ける→開けて。',
      wrongAnswerReasons: { '窓を開けてはいけませんか。': '这是问"不可以开吗"，语气奇怪。', '窓を開けますか。': '问对方"你开窗吗"，不是征求自己开的许可。', '窓が開きたいです。': 'たい不能用于窗户（无生命）。' },
      grammarPoints: ['てもいいですか（许可）'], particles: ['を'], verbForms: ['て形'], lesson: [15], difficulty: 1,
      knowledgeMap: KM('cg-pol-temoii', '许可禁止'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1108', questionType: '单项选择', scenarioContext: '介绍住处：住在哪里（状态）',
      question: '兄は大阪に（　）います。', questionKana: 'あにはおおさかに（　）います。',
      options: ['住んで', '住みて', '住むで', '住して'], answer: '住んで',
      translation: '哥哥住在大阪。',
      explanation: '住む（五段，む结尾）→て形拨音便住んで。住んでいます表示居住的持续状态；场所用に。',
      wrongAnswerReasons: { '住みて': '未经音便。', '住むで': '辞书形不能直接+で。', '住して': '不存在的形式。' },
      grammarPoints: ['ています（状态）', 'て形音便：む→んで'], particles: ['に'], verbForms: ['て形'], lesson: [15], difficulty: 2,
      knowledgeMap: KM('cg-a-teiru', '体'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1109', questionType: '单项选择', scenarioContext: '介绍家人：姐姐的工作',
      question: '姉は銀行（　）働いています。', questionKana: 'あねはぎんこう（　）はたらいています。',
      options: ['で', 'に', 'を', 'へ'], answer: 'で',
      translation: '姐姐在银行工作。',
      explanation: '働く是动作，场所用で：銀行で働いています。注意勤めています才用に（銀行に勤めています）。',
      wrongAnswerReasons: { 'に': '働く配で；勤める才配に。', 'を': '働く此处无对象。', 'へ': 'へ是方向。' },
      grammarPoints: ['で（动作场所）', 'ています'], particles: ['で'], verbForms: ['て形'], lesson: [15], difficulty: 2,
      knowledgeMap: KM('cg-p-de', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1110', questionType: '句子排序', scenarioContext: '早晨的动作链：起床→洗脸→吃饭',
      question: '排序：①顔を洗って ②朝ごはんを食べます ③起きて',
      options: ['③①②', '①③②', '②③①', '③②①'], answer: '③①②',
      translation: '起床，洗脸，然后吃早饭。',
      explanation: 'て形按时间顺序连接动作链：起きて→顔を洗って→朝ごはんを食べます。最后一个动词承担时体。',
      wrongAnswerReasons: { '①③②': '先洗脸再起床顺序不合理。', '②③①': '吃完饭再起床矛盾。', '③②①': '句子必须以ます形结尾，洗って不能收尾。' },
      grammarPoints: ['て形动作链'], particles: ['を'], verbForms: ['て形'], lesson: [16], difficulty: 2,
      knowledgeMap: KM('lc-te-interface', '连接'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1111', questionType: '形容词变形', scenarioContext: '描述朋友：既年轻又精神',
      question: '田中さんは若（　）、元気です。', questionKana: 'たなかさんはわか（　）、げんきです。',
      options: ['くて', 'いで', 'で', 'くって'], answer: 'くて',
      translation: '田中又年轻又有精神。',
      explanation: 'い形容词的连接形：い→くて（若い→若くて）。な形容词/名词才用で连接（元気で）。',
      wrongAnswerReasons: { 'いで': 'い形容词不用いで连接。', 'で': 'で用于な形容词和名词。', 'くって': '书面規範形是くて。' },
      grammarPoints: ['い形容词て形'], particles: [], verbForms: [], lesson: [16], difficulty: 2,
      knowledgeMap: KM('cg-i-adj-pred', '形容词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1112', questionType: '动词变形', scenarioContext: '医生嘱咐：不要洗澡',
      question: '今日はおふろに（　）でください。', questionKana: 'きょうはおふろに（　）でください。',
      options: ['入らない', '入りない', '入れない', '入らなくて'], answer: '入らない',
      translation: '今天请不要洗澡。',
      explanation: '否定请求＝ない形＋でください。入る（はいる）是五段动词（伪一段）：入る→入らない。',
      wrongAnswerReasons: { '入りない': '未然形应是入ら不是入り。', '入れない': '入れる是"放入"或可能形，动词不同。', '入らなくて': 'なくて是连接形，不能接でください。' },
      grammarPoints: ['ないでください', 'ない形'], particles: ['に'], verbForms: ['ない形'], lesson: [17], difficulty: 2,
      knowledgeMap: KM('cg-nai-form', '动词变形'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1113', questionType: '单项选择', scenarioContext: '办入学手续：明天必须交材料',
      question: 'あしたまでに書類を出さ（　）なりません。', questionKana: 'あしたまでにしょるいをださ（　）なりません。',
      options: ['なければ', 'ないでは', 'なくても', 'ないと、'], answer: 'なければ',
      translation: '明天之前必须提交材料。',
      explanation: '义务句型：ない形词尾ない→なければ＋なりません（不做不行=必须做）。出す→出さない→出さなければなりません。',
      wrongAnswerReasons: { 'ないでは': '不构成句型。', 'なくても': 'なくてもいいです是"不做也行"，意思相反。', 'ないと、': 'ないと后接いけません而非なりません的这种拼接不完整。' },
      grammarPoints: ['なければなりません'], particles: ['までに'], verbForms: ['ない形'], lesson: [17], difficulty: 2,
      knowledgeMap: KM('cg-pol-nakereba', '义务'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1114', questionType: '单项选择', scenarioContext: '学校规定：周六不用来学校',
      question: '土曜日は学校へ来（　）もいいです。', questionKana: 'どようびはがっこうへこ（　）もいいです。',
      options: ['なくて', 'ないで', 'なくても、', 'ない'], answer: 'なくて',
      translation: '星期六可以不来学校。',
      explanation: '"不做也行"＝ない形词尾ない→なくて＋もいいです。来る（不规则）→来ない（こない）→来なくてもいいです。',
      wrongAnswerReasons: { 'ないで': 'ないで接ください（否定请求）。', 'なくても、': '语法对但多了顿号不能直接嵌入。', 'ない': 'ない不能直接接もいいです。' },
      grammarPoints: ['なくてもいいです'], particles: ['へ'], verbForms: ['ない形'], lesson: [17], difficulty: 2,
      knowledgeMap: KM('cg-pol-nakereba', '义务'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1115', questionType: '改错', scenarioContext: '朋友写的句子：不要忘记',
      question: '「宿題を忘れりないでください。」错在哪里？', questionKana: '「しゅくだいをわすれりないでください。」',
      options: ['忘れりない应改为忘れない', 'を应改为が', 'でください应改为てください', '句子没有错'], answer: '忘れりない应改为忘れない',
      translation: '（改正后）请不要忘记作业。',
      explanation: '忘れる是一段动词：去る＋ない＝忘れない。「忘れりない」是不存在的形式（误按五段活用）。',
      wrongAnswerReasons: { 'を应改为が': '忘れる是他动词，对象用を正确。', 'でください应改为てください': '否定请求就是ないでください。', '句子没有错': '动词变形有明显错误。' },
      grammarPoints: ['ない形', '一段动词'], particles: ['を'], verbForms: ['ない形'], lesson: [17], difficulty: 2,
      knowledgeMap: KM('cg-nai-form', '动词变形'), knowledgeMapStatus: 'verified'
    })
  );
})();
