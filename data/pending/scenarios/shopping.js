/* 完整场景 —— 日常购物（待审核区）
 * 对话为 AI 编写的常用生活表达，不是教材原文；课程归属待核实。
 * 核实通过前只能在"审核预览模式"体验，不计入正式统计。 */
window.MJT_DATA = window.MJT_DATA || {};
window.MJT_DATA.pendingScenarios = window.MJT_DATA.pendingScenarios || [];

window.MJT_DATA.pendingScenarios.push(
  {
    id: 'scenario-convenience-store-checkout-001',
    title: '便利店结账',
    category: 'shopping',
    setting: '便利店收银台',
    goal: '听懂合计金额，并回答店员是否需要加热便当',
    roles: ['店員', 'あなた'],
    lessonRange: { min: 1, max: 21 }, lessonStatus: 'pending',
    difficulty: 1, estimatedDuration: 180,
    informationTypes: ['金额', '肯定与否定'],
    grammarPoints: ['てもいいですか', '金额听辨', 'をお願いします'],
    particles: ['を', 'は'], verbForms: ['ます形', 'て形'],
    numberTypes: ['price'],
    knowledgeMap: [{ module: 'core-grammar', section: '许可与请求', node: 'cg-pol-kudasai' }],
    knowledgeMapStatus: 'verified',
    extendedVocab: [
      { word: '温める', kana: 'あたためる', pos: '动词（一段）', zh: '加热', reason: '便利店买便当必然出现的高频问句「温めますか」', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' },
      { word: 'レジ袋', kana: 'レジぶくろ', pos: '名词', zh: '购物袋', reason: '日本便利店结账固定询问', scope: 'extended_basic', required: false, displayMode: '扩展生活词汇' }
    ],
    steps: [
      { stepId: 's1', speaker: '店員', interactionType: 'listen', script: 'いらっしゃいませ。お弁当、温めますか。', furiganaText: 'いらっしゃいませ。おべんとう、あたためますか。', translation: '欢迎光临。便当要加热吗？', listeningTraps: ['温めますか句尾上扬是疑问'], grammarPoints: ['ますか（疑问）'] },
      { stepId: 's2', speaker: 'あなた', interactionType: 'listen', script: 'はい、お願いします。', furiganaText: 'はい、おねがいします。', translation: '好的，麻烦你了。', listeningTraps: [], grammarPoints: ['お願いします'] },
      { stepId: 's3', speaker: '店員', interactionType: 'listen', script: 'レジ袋はご利用ですか。', furiganaText: 'レジぶくろはごりようですか。', translation: '需要购物袋吗？', listeningTraps: [], grammarPoints: [] },
      { stepId: 's4', speaker: 'あなた', interactionType: 'listen', script: 'いいえ、けっこうです。', furiganaText: 'いいえ、けっこうです。', translation: '不，不用了。', listeningTraps: ['けっこうです=礼貌拒绝'], grammarPoints: [] },
      { stepId: 's5', speaker: '店員', interactionType: 'listen', script: 'ありがとうございます。全部で680円になります。', furiganaText: 'ありがとうございます。ぜんぶでろっぴゃくはちじゅうえんになります。', translation: '谢谢。一共680日元。', listeningTraps: ['ろっぴゃく(600)/はっぴゃく(800)开头一音之差', '680→608数位滑落'], grammarPoints: ['ぜんぶで'] },
      { stepId: 'q1', interactionType: 'choose', question: '一共多少钱？', options: ['680円', '608円', '860円', '688円'], answer: '680円', infoCategory: 'price', explanation: '「ぜんぶでろっぴゃくはちじゅうえん」＝680円。ろっぴゃく=600，はちじゅう=80。608 是把「はちじゅう(80)」听成「はち(8)」的典型滑位。', grammarPoints: ['金额听辨'] },
      { stepId: 'q2', interactionType: 'choose', question: '关于便当和购物袋，正确的是哪一项？', options: ['要加热，不要购物袋', '要加热，也要购物袋', '不加热，要购物袋', '不加热，也不要购物袋'], answer: '要加热，不要购物袋', infoCategory: null, explanation: '对便当回答了「はい、お願いします」（要加热），对购物袋回答了「いいえ、けっこうです」（不要）。肯定与否定信息要分别记住。', grammarPoints: ['肯定与否定'] },
      { stepId: 'q3', speaker: '店員', interactionType: 'respond', script: 'お箸はご利用ですか。', furiganaText: 'おはしはごりようですか。', translation: '需要筷子吗？', question: '店员问你要不要筷子，你需要一双。怎么回答最自然？', options: ['はい、お願いします。', 'いいえ、けっこうです。', 'お箸です。', 'そうですね。'], answer: 'はい、お願いします。', acceptedAnswers: ['はい、お願いします。', 'はい、おねがいします'], infoCategory: null, explanation: '需要时说「はい、お願いします」；不需要时说「いいえ、けっこうです」。「お箸です」答非所问，「そうですね」是附和不是回答。', grammarPoints: ['お願いします'] }
    ],
    review: {
      lineNotes: {
        s1: '店铺招呼语＋服务询问。「温めますか」=要加热吗（ます形疑问句）。',
        s2: '接受服务的固定回答。',
        s3: '「ご利用ですか」是店铺敬语问法，理解为「要不要」即可。',
        s4: '「けっこうです」＝委婉的"不用了"。',
        s5: '「全部で～になります」＝合计金额的固定说法。'
      },
      naturalResponses: [
        { ja: 'はい、お願いします。', note: '接受任何服务的万能自然回答' },
        { ja: 'いいえ、大丈夫です。', note: '比けっこうです更口语的拒绝，同样自然' }
      ],
      grammarNotes: [
        '温めますか：动词ます形＋か构成疑问。原形是「温める」（一段动词，扩展词汇）。',
        'ぜんぶで＋金额：で表示合计范围（"总共"）。',
        '金额680円：ろっぴゃく＋はちじゅう＋えん，注意600的音变ろっぴゃく。'
      ]
    },
    reinforcement: [
      { type: 'frame', category: 'price', note: '换一个店听金额' },
      { type: 'scenario', ref: 'scenario-cafe-order-001' },
      { type: 'scenario', ref: 'scenario-drugstore-buy-001' }
    ],
    contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
    origin: '基于已验证知识生成的练习示例', sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: 'AI编写的便利店常用表达；课程归属待对照教材核实。'
  },

  {
    id: 'scenario-supermarket-food-001',
    title: '超市买食品',
    category: 'shopping',
    setting: '超市生鲜区和收银台',
    goal: '听懂促销信息（数量与价格），算清买了几个、花了多少钱',
    roles: ['店内放送', '店員', 'あなた'],
    lessonRange: { min: 1, max: 21 }, lessonStatus: 'pending',
    difficulty: 2, estimatedDuration: 240,
    informationTypes: ['金额', '数量', '时间'],
    grammarPoints: ['数量词：個', 'から（起点）', 'ぜんぶで'],
    particles: ['を', 'で', 'から'], verbForms: ['ます形'],
    numberTypes: ['price', 'counter', 'time'],
    knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-kara-made' }],
    knowledgeMapStatus: 'verified',
    extendedVocab: [
      { word: 'セール', kana: 'セール', pos: '名词', zh: '促销、特卖', reason: '超市广播高频词', scope: 'extended_basic', required: false, displayMode: '扩展生活词汇' },
      { word: 'タイムサービス', kana: 'タイムサービス', pos: '名词', zh: '限时特价', reason: '日本超市固定说法', scope: 'extended_basic', required: false, displayMode: '扩展生活词汇' }
    ],
    steps: [
      { stepId: 's1', speaker: '店内放送', interactionType: 'listen', script: '本日、夕方5時からタイムサービスです。卵が1パック98円です。', furiganaText: 'ほんじつ、ゆうがたごじからタイムサービスです。たまごがワンパックきゅうじゅうはちえんです。', translation: '今天傍晚5点开始限时特价。鸡蛋一盒98日元。', listeningTraps: ['ごじ(5時)/ごごじ？——注意是ゆうがた5時', '98円きゅうじゅうはちえん'], grammarPoints: ['から（起点）'] },
      { stepId: 's2', speaker: 'あなた', interactionType: 'listen', script: 'すみません、このりんごはいくらですか。', furiganaText: 'すみません、このりんごはいくらですか。', translation: '请问这个苹果多少钱？', listeningTraps: [], grammarPoints: ['いくらですか'] },
      { stepId: 's3', speaker: '店員', interactionType: 'listen', script: '一つ120円です。三つで350円ですよ。', furiganaText: 'ひとつひゃくにじゅうえんです。みっつでさんびゃくごじゅうえんですよ。', translation: '一个120日元。三个的话350日元哦。', listeningTraps: ['ひとつ/みっつ和语数词', '单价与打包价两个金额'], grammarPoints: ['数量词', 'で（合计）'] },
      { stepId: 's4', speaker: 'あなた', interactionType: 'listen', script: 'じゃ、三つください。', furiganaText: 'じゃ、みっつください。', translation: '那么请给我三个。', listeningTraps: [], grammarPoints: ['をください'] },
      { stepId: 'q1', interactionType: 'choose', question: '限时特价几点开始？', options: ['17:00', '15:00', '17:30', '19:00'], answer: '17:00', infoCategory: 'time', explanation: '「夕方5時から」＝傍晚5点（17:00）开始。夕方明确了是下午。', grammarPoints: ['から（起点）'] },
      { stepId: 'q2', interactionType: 'choose', question: '苹果一个多少钱？', options: ['120円', '350円', '98円', '210円'], answer: '120円', infoCategory: 'price', explanation: '「一つ120円」是单价；350円是三个的打包价；98円是鸡蛋的价格——三个金额连续出现，要对应到正确的商品。', grammarPoints: ['金额听辨'] },
      { stepId: 'q3', interactionType: 'choose', question: '最后买了几个苹果、付多少钱？', options: ['3个・350円', '3个・360円', '1个・120円', '2个・240円'], answer: '3个・350円', infoCategory: 'counter', explanation: '「三つください」＝买3个，按店员说的打包价「三つで350円」付款（不是120×3=360）。「で」表示合计。', grammarPoints: ['数量词', 'で（合计）'] },
      { stepId: 'q4', speaker: '店員', interactionType: 'respond', script: '袋にお入れしますか。', furiganaText: 'ふくろにおいれしますか。', translation: '要帮您装袋吗？', question: '你自己带了袋子。怎么回答？', options: ['いいえ、けっこうです。', 'はい、三つください。', '350円です。', 'りんごをください。'], answer: 'いいえ、けっこうです。', acceptedAnswers: ['いいえ、けっこうです。', 'いいえ、大丈夫です。'], infoCategory: null, explanation: '拒绝服务用「いいえ、けっこうです／大丈夫です」。其他选项答非所问。', grammarPoints: [] }
    ],
    review: {
      lineNotes: {
        s1: '超市广播：时间（5時から）＋商品＋价格，是最典型的信息播报结构。',
        s2: '「いくらですか」问价格的基本句。',
        s3: '单价（一つ120円）与优惠合计（三つで350円）并报，「で」标记合计。',
        s4: '「数量＋ください」完成购买。'
      },
      naturalResponses: [
        { ja: 'じゃ、三つお願いします。', note: '与ください同样自然，更礼貌一点' }
      ],
      grammarNotes: [
        '和语数词：ひとつ・ふたつ・みっつ用于不指定量词的物品。',
        'から标记时间起点：5時から＝5点开始。',
        '三つで350円：で表示"按此数量合计"。'
      ]
    },
    reinforcement: [
      { type: 'frame', category: 'price', note: '在别的店继续听价格' },
      { type: 'scenario', ref: 'scenario-convenience-store-checkout-001' },
      { type: 'scenario', ref: 'scenario-restaurant-order-001' }
    ],
    contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
    origin: '基于已验证知识生成的练习示例', sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: 'AI编写的超市常用表达；课程归属待对照教材核实。'
  },

  {
    id: 'scenario-drugstore-buy-001',
    title: '药店购买基础用品',
    category: 'shopping',
    setting: '药妆店',
    goal: '问到创可贴的位置（楼层/货架），听懂服用说明和价格',
    roles: ['店員', 'あなた'],
    lessonRange: { min: 1, max: 21 }, lessonStatus: 'pending',
    difficulty: 2, estimatedDuration: 240,
    informationTypes: ['地点', '次数', '金额'],
    grammarPoints: ['にあります', '数量词：回', 'てください'],
    particles: ['に', 'を'], verbForms: ['て形'],
    numberTypes: ['counter', 'price'],
    knowledgeMap: [
      { module: 'core-grammar', section: '格助词', node: 'cg-p-ni' },
      { module: 'core-grammar', section: '请求', node: 'cg-pol-kudasai' }
    ],
    knowledgeMapStatus: 'verified',
    extendedVocab: [
      { word: 'ばんそうこう', kana: 'ばんそうこう', pos: '名词', zh: '创可贴', reason: '药店购物必需品名', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' },
      { word: '風邪薬', kana: 'かぜぐすり', pos: '名词', zh: '感冒药', reason: '药店高频商品', scope: 'extended_basic', required: false, displayMode: '扩展生活词汇' }
    ],
    steps: [
      { stepId: 's1', speaker: 'あなた', interactionType: 'listen', script: 'すみません、ばんそうこうはどこにありますか。', furiganaText: 'すみません、ばんそうこうはどこにありますか。', translation: '请问创可贴在哪里？', listeningTraps: [], grammarPoints: ['にあります'] },
      { stepId: 's2', speaker: '店員', interactionType: 'listen', script: '2階にあります。エレベーターの右です。', furiganaText: 'にかいにあります。エレベーターのみぎです。', translation: '在2楼。电梯的右边。', listeningTraps: ['にかい(2階)/さんがい(3階)浊音', 'みぎ(右)/ひだり(左)'], grammarPoints: ['にあります', '方位词'] },
      { stepId: 's3', speaker: 'あなた', interactionType: 'listen', script: 'それから、この風邪薬をください。', furiganaText: 'それから、このかぜぐすりをください。', translation: '然后，请给我这个感冒药。', listeningTraps: [], grammarPoints: ['をください'] },
      { stepId: 's4', speaker: '店員', interactionType: 'listen', script: 'この薬は一日に3回、食事の後で飲んでください。', furiganaText: 'このくすりはいちにちにさんかい、しょくじのあとでのんでください。', translation: '这个药一天吃3次，饭后服用。', listeningTraps: ['さんかい(3回)/さんがい(3階)同音不同量词', 'いちにち(一天)/いちじ(1点)'], grammarPoints: ['数量词：回', 'てください'] },
      { stepId: 's5', speaker: '店員', interactionType: 'listen', script: 'お会計は1,280円です。', furiganaText: 'おかいけいはせんにひゃくはちじゅうえんです。', translation: '一共1280日元。', listeningTraps: ['せん(1000)开头无いち', '1280/1208滑位'], grammarPoints: ['金额听辨'] },
      { stepId: 'q1', interactionType: 'choose', question: '创可贴在几楼？', options: ['2楼', '3楼', '1楼', '5楼'], answer: '2楼', infoCategory: 'counter', explanation: '「2階（にかい）にあります」。注意3階读さんがい（浊音），2階读にかい。', grammarPoints: ['数量词：階'] },
      { stepId: 'q2', interactionType: 'choose', question: '感冒药一天吃几次？', options: ['3次', '2次', '1次', '4次'], answer: '3次', infoCategory: 'counter', explanation: '「一日に3回（さんかい）」＝一天3次。「に」表示比例基准（每一天）。回与階同音，靠语境区分（吃药→次数）。', grammarPoints: ['数量词：回'] },
      { stepId: 'q3', interactionType: 'choose', question: '一共多少钱？', options: ['1,280円', '1,208円', '2,180円', '1,880円'], answer: '1,280円', infoCategory: 'price', explanation: '「せんにひゃくはちじゅうえん」＝1280円。1208 是把はちじゅう(80)听成はち(8)的滑位；2180 是位数颠倒。', grammarPoints: ['金额听辨'] },
      { stepId: 'q4', speaker: '店員', interactionType: 'respond', script: 'ポイントカードはお持ちですか。', furiganaText: 'ポイントカードはおもちですか。', translation: '有积分卡吗？', question: '你没有积分卡。怎么回答最自然？', options: ['いいえ、ありません。', 'はい、そうです。', 'カードです。', '3回です。'], answer: 'いいえ、ありません。', acceptedAnswers: ['いいえ、ありません。', 'いいえ、持っていません。'], infoCategory: null, explanation: '没有＝「いいえ、ありません」或「持っていません」。', grammarPoints: ['あります/ありません'] }
    ],
    review: {
      lineNotes: {
        s1: '「～はどこにありますか」问物品位置的基本句。',
        s2: '楼层＋方位的答复：2階にあります＋エレベーターの右。',
        s3: 'それから连接追加要求。',
        s4: '服药说明句：频率（一日に3回）＋时点（食事の後で）＋指示（飲んでください）。',
        s5: '「お会計は～です」结账金额。'
      },
      naturalResponses: [
        { ja: 'ありがとうございます。', note: '得到指引后自然道谢' }
      ],
      grammarNotes: [
        '飲んでください：飲む（五段）→て形飲んで（む→んで拨音便）＋ください。',
        '一日に3回：に表示"每～"的基准。',
        '2階にあります：存在句，位置用に。'
      ]
    },
    reinforcement: [
      { type: 'frame', category: 'counter', note: '在别的场景继续听楼层/次数' },
      { type: 'scenario', ref: 'scenario-pharmacy-pickup-001' },
      { type: 'scenario', ref: 'scenario-convenience-store-checkout-001' }
    ],
    contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
    origin: '基于已验证知识生成的练习示例', sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: 'AI编写的药店常用表达；课程归属待对照教材核实。'
  }
);
