/* 语法题扩充 —— 声明课程段：第6～10课（待审核区）
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
      id: 'g2-0601', questionType: '助词填空', scenarioContext: '便利店：买饭团和茶',
      question: 'おにぎり（　）二つとお茶を買います。', questionKana: 'おにぎり（　）ふたつとおちゃをかいます。',
      options: ['を', 'が', 'に', 'は'], answer: 'を',
      translation: '买两个饭团和茶。',
      explanation: '買う的直接对象用を标记；数量词（二つ）放在を和动词之间：おにぎりを二つ買います。',
      wrongAnswerReasons: { 'が': '買います是他动词句，对象用を。', 'に': 'に是落点/时点。', 'は': '把对象话题化后一般用于对比，购物句常规用を。' },
      grammarPoints: ['を（对象）', '数量词位置'], particles: ['を'], verbForms: ['ます形'], lesson: [6], difficulty: 1,
      knowledgeMap: KM('cg-p-wo', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0602', questionType: '助词填空', scenarioContext: '约朋友：在哪里吃午饭',
      question: '駅前の食堂（　）昼ごはんを食べませんか。', questionKana: 'えきまえのしょくどう（　）ひるごはんをたべませんか。',
      options: ['で', 'に', 'を', 'へ'], answer: 'で',
      translation: '要不要在站前食堂吃午饭？',
      explanation: '吃饭是动作，动作展开的场所用で。「ませんか」是留出拒绝空间的礼貌邀请。',
      wrongAnswerReasons: { 'に': 'に用于存在句（食堂にいます）或到达点。', 'を': '对象是昼ごはん，已被标记。', 'へ': 'へ配移动动词。' },
      grammarPoints: ['で（动作场所）', 'ませんか（邀请）'], particles: ['で'], verbForms: ['ます形'], lesson: [6], difficulty: 1,
      knowledgeMap: KM('cg-p-de', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0603', questionType: '情景选句', scenarioContext: '同学邀你一起吃饭，你想答应',
      question: '「一緒に昼ごはんを食べませんか。」最自然的接受回答是？',
      options: ['ええ、食べましょう。', 'いいえ、食べます。', 'はい、食べません。', '食べませんでした。'], answer: 'ええ、食べましょう。',
      translation: '好啊，一起吃吧。',
      explanation: '接受ませんか的邀请用ましょう回应（那就一起做吧）。',
      wrongAnswerReasons: { 'いいえ、食べます。': '先说不再说吃，自相矛盾。', 'はい、食べません。': '肯定应答却接否定动词，矛盾。', '食べませんでした。': '这是过去否定"没吃"。' },
      grammarPoints: ['ましょう', 'ませんか'], particles: [], verbForms: ['ます形'], lesson: [6], difficulty: 1,
      knowledgeMap: KM('cg-pol-mashou', '劝诱'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0604', questionType: '助词填空', scenarioContext: '在家：说明用什么切西瓜',
      question: 'ナイフ（　）すいかを切ります。', questionKana: 'ナイフ（　）すいかをきります。',
      options: ['で', 'に', 'と', 'が'], answer: 'で',
      translation: '用刀切西瓜。',
      explanation: '工具/手段用で：ナイフで切ります（用刀切）。',
      wrongAnswerReasons: { 'に': 'に不表示工具。', 'と': 'と是共同动作者（和某人一起）。', 'が': 'が是主语。' },
      grammarPoints: ['で（工具）'], particles: ['で'], verbForms: ['ます形'], lesson: [7], difficulty: 1,
      knowledgeMap: KM('cg-p-de', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0605', questionType: '助词填空', scenarioContext: '给家人寄东西',
      question: '母（　）荷物を送ります。', questionKana: 'はは（　）にもつをおくります。',
      options: ['に', 'を', 'で', 'は'], answer: 'に',
      translation: '给妈妈寄包裹。',
      explanation: '接受者用に标记：母に送ります（寄给妈妈）。あげます/貸します/教えます等授受方向动词同理。',
      wrongAnswerReasons: { 'を': '对象是荷物，已被を标记；一个谓语原则上只有一个を。', 'で': 'で是手段（郵便で）。', 'は': '话题化后失去"给谁"的明确标记。' },
      grammarPoints: ['に（接受者）'], particles: ['に'], verbForms: ['ます形'], lesson: [7], difficulty: 1,
      knowledgeMap: KM('cg-p-ni', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0606', questionType: '单项选择', scenarioContext: '评价昨天去的餐厅',
      question: 'あのレストランはとても（　）です。', questionKana: '',
      options: ['にぎやか', 'にぎやかな', 'にぎやかで', 'にぎやかく'], answer: 'にぎやか',
      translation: '那家餐厅非常热闹。',
      explanation: 'にぎやか是な形容词：作谓语时直接＋です（にぎやかです），只有修饰名词才加な（にぎやかな店）。',
      wrongAnswerReasons: { 'にぎやかな': 'な只用于修饰名词。', 'にぎやかで': 'で是中顿形，句子在这里结束应用です。', 'にぎやかく': '这是い形容词的变法，にぎやか不是い形容词。' },
      grammarPoints: ['な形容词'], particles: [], verbForms: [], lesson: [8], difficulty: 1,
      knowledgeMap: KM('cg-na-adj-pred', '形容词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0607', questionType: '形容词变形', scenarioContext: '换季了：说明今天不热',
      question: '今日は（　）です。', questionKana: 'きょうは（　）です。',
      options: ['暑くない', '暑いじゃない', '暑くありませんです', '暑いくない'], answer: '暑くない',
      translation: '今天不热。',
      explanation: 'い形容词否定：暑い→暑くない（い→く＋ない），敬体可用暑くないです或暑くありません。',
      wrongAnswerReasons: { '暑いじゃない': 'じゃない是名词/な形的否定式。', '暑くありませんです': 'ありません后不再加です。', '暑いくない': '词尾い必须去掉再接く。' },
      grammarPoints: ['い形容词否定'], particles: [], verbForms: [], lesson: [8], difficulty: 1,
      knowledgeMap: KM('cg-i-adj-pred', '形容词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0608', questionType: '单项选择', scenarioContext: '和朋友聊爱好',
      question: 'わたしは音楽（　）好きです。', questionKana: 'わたしはおんがく（　）すきです。',
      options: ['が', 'を', 'に', 'で'], answer: 'が',
      translation: '我喜欢音乐。',
      explanation: '好き/嫌い/上手/下手的对象用が标记：音楽が好きです。这是与中文"喜欢+宾语"最不同的地方。',
      wrongAnswerReasons: { 'を': '好きです不是动词，对象不用を。', 'に': 'に不标记好恶对象。', 'で': 'で是场所/手段。' },
      grammarPoints: ['が（好恶对象）', '喜欢与擅长'], particles: ['が'], verbForms: [], lesson: [9], difficulty: 1,
      knowledgeMap: KM('lc-ga-newinfo', '助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0609', questionType: '单项选择', scenarioContext: '解释为什么不去看电影',
      question: '時間がありません（　）、映画を見ません。', questionKana: 'じかんがありません（　）、えいがをみません。',
      options: ['から', 'が', 'と', 'まで'], answer: 'から',
      translation: '因为没有时间，所以不看电影。',
      explanation: '理由句＋から＋结论句："因为……所以……"。から直接接在敬体句后。',
      wrongAnswerReasons: { 'が': 'が是转折"但是"，因果关系不通。', 'と': 'と是并列/引用。', 'まで': 'まで是终点。' },
      grammarPoints: ['から（理由）'], particles: [], verbForms: ['ます形'], lesson: [9], difficulty: 1,
      knowledgeMap: KM('cg-c-reason', '接续'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0610', questionType: '单项选择', scenarioContext: '介绍房间：桌上有猫',
      question: '机の上に猫（　）います。', questionKana: 'つくえのうえにねこ（　）います。',
      options: ['が', 'は', 'を', 'で'], answer: 'が',
      translation: '桌子上有（一只）猫。',
      explanation: '存在句引入新信息（第一次提到的猫）用が：猫がいます。有生命用います、无生命用あります。',
      wrongAnswerReasons: { 'は': '猫は…会把猫当已知话题，"发现/介绍"语境用が。', 'を': '存在句无动作对象。', 'で': '存在场所用に不用で。' },
      grammarPoints: ['あります/います', 'が新信息'], particles: ['が', 'に'], verbForms: [], lesson: [10], difficulty: 1,
      knowledgeMap: KM('lc-ga-newinfo', '助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0611', questionType: '正误判断', scenarioContext: '描述教室里的东西',
      question: '「教室に先生があります。」对吗？', questionKana: '「きょうしつにせんせいがあります。」',
      options: ['错，先生是人，应用います', '对', '错，应用へ', '错，应删掉が'], answer: '错，先生是人，应用います',
      translation: '（改正后）教室里有老师。',
      explanation: '存在动词按有无生命分工：人/动物→います；物→あります。老师是人，必须用います。',
      wrongAnswerReasons: { '对': '把老师"物化"了。', '错，应用へ': '存在场所用に。', '错，应删掉が': '存在主体需要が。' },
      grammarPoints: ['あります/います'], particles: ['に', 'が'], verbForms: [], lesson: [10], difficulty: 1,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    G({
      id: 'g2-0612', questionType: '单项选择', scenarioContext: '牙科候诊室：说明疼的部位',
      question: '（在牙科）奥の歯（　）痛いです。', questionKana: 'おくのは（　）いたいです。',
      options: ['が', 'を', 'で', 'へ'], answer: 'が',
      translation: '里面的牙疼。',
      explanation: '身体感觉（痛い/かゆい）的部位用が标记：歯が痛いです。',
      wrongAnswerReasons: { 'を': '痛い是形容词不是他动词。', 'で': 'で是场所/手段。', 'へ': 'へ是方向。' },
      grammarPoints: ['が（感觉部位）', 'い形容词'], particles: ['が'], verbForms: [], lesson: [8, 17], difficulty: 1,
      knowledgeMap: KM('cg-i-adj-pred', '形容词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0613', questionType: '单项选择', scenarioContext: '问超市里有几个人排队',
      question: 'レジの前に人が三（　）います。', questionKana: 'レジのまえにひとがさん（　）います。',
      options: ['人', '本', '枚', '台'], answer: '人',
      translation: '收银台前有三个人。',
      explanation: '数人用量词「人（にん）」：三人（さんにん）。注意1人ひとり、2人ふたり是特殊读法。',
      wrongAnswerReasons: { '本': '本数细长物。', '枚': '枚数薄平物。', '台': '台数机器车辆。' },
      grammarPoints: ['数量词：人'], particles: ['が', 'に'], verbForms: [], lesson: [11], difficulty: 1,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    G({
      id: 'g2-0614', questionType: '句子排序', scenarioContext: '咖啡店：组一句"请给我两杯咖啡"',
      question: '排序：①ください ②コーヒーを ③二杯',
      options: ['②③①', '③②①', '②①③', '①②③'], answer: '②③①',
      translation: '请给我两杯咖啡。',
      explanation: '语序：对象（コーヒーを）＋数量词（二杯）＋ください。数量词紧贴动词前。',
      wrongAnswerReasons: { '③②①': '数量词放在を前不自然（二杯コーヒーを）。', '②①③': 'ください后不能再接数量词。', '①②③': 'ください不能开头。' },
      grammarPoints: ['数量词位置', 'をください'], particles: ['を'], verbForms: [], lesson: [11], difficulty: 2,
      knowledgeMap: KM('cg-p-wo', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-0615', questionType: '单项选择', scenarioContext: '和朋友比较两家店',
      question: 'この店はあの店（　）安いです。', questionKana: 'このみせはあのみせ（　）やすいです。',
      options: ['より', 'ほど', 'から', 'だけ'], answer: 'より',
      translation: '这家店比那家店便宜。',
      explanation: '比较基准用より：AはBより安い（A比B便宜）。日语形容词没有比较级词形，比较关系全靠より。',
      wrongAnswerReasons: { 'ほど': 'ほど用于否定比较（Bほど安くない）。', 'から': 'から是起点/理由。', 'だけ': 'だけ是限定"只"。' },
      grammarPoints: ['比较：より'], particles: ['より'], verbForms: [], lesson: [12], difficulty: 1,
      knowledgeMap: KM('cg-p-yori', '格助词'), knowledgeMapStatus: 'verified'
    })
  );
})();
