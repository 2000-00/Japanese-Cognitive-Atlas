/* 完整场景 —— 餐饮（待审核区）。AI 编写的常用表达，非教材原文。 */
window.MJT_DATA = window.MJT_DATA || {};
window.MJT_DATA.pendingScenarios = window.MJT_DATA.pendingScenarios || [];

window.MJT_DATA.pendingScenarios.push(
  {
    id: 'scenario-restaurant-order-001',
    title: '餐厅入店与点餐',
    category: 'dining',
    setting: '家庭餐厅',
    goal: '报人数入座，点餐并确认金额',
    roles: ['店員', 'あなた'],
    lessonRange: { min: 1, max: 21 }, lessonStatus: 'pending',
    difficulty: 2, estimatedDuration: 300,
    informationTypes: ['人数', '数量', '金额'],
    grammarPoints: ['数量词：人/杯', 'をお願いします', 'ぜんぶで'],
    particles: ['を', 'と', 'で'], verbForms: ['ます形'],
    numberTypes: ['counter', 'price'],
    knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-to' }],
    knowledgeMapStatus: 'verified',
    extendedVocab: [
      { word: '禁煙席', kana: 'きんえんせき', pos: '名词', zh: '禁烟席', reason: '日本餐厅入店固定询问', scope: 'extended_basic', required: false, displayMode: '扩展生活词汇' },
      { word: 'ご注文', kana: 'ごちゅうもん', pos: '名词', zh: '点单', reason: '点餐场景核心词', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' }
    ],
    steps: [
      { stepId: 's1', speaker: '店員', interactionType: 'listen', script: 'いらっしゃいませ。何名様ですか。', furiganaText: 'いらっしゃいませ。なんめいさまですか。', translation: '欢迎光临。请问几位？', listeningTraps: ['何名様=何人的敬语说法'], grammarPoints: ['人数询问'] },
      { stepId: 's2', speaker: 'あなた', interactionType: 'listen', script: '二人です。', furiganaText: 'ふたりです。', translation: '两个人。', listeningTraps: ['ふたり(2人)特殊读法'], grammarPoints: ['数量词：人'] },
      { stepId: 's3', speaker: '店員', interactionType: 'listen', script: 'ご注文はお決まりですか。', furiganaText: 'ごちゅうもんはおきまりですか。', translation: '决定点什么了吗？', listeningTraps: [], grammarPoints: [] },
      { stepId: 's4', speaker: 'あなた', interactionType: 'listen', script: 'カレーを一つと、ラーメンを一つお願いします。それから、コーヒーを二杯ください。', furiganaText: 'カレーをひとつと、ラーメンをひとつおねがいします。それから、コーヒーをにはいください。', translation: '要一份咖喱和一份拉面。然后请给我两杯咖啡。', listeningTraps: ['ひとつ(一份)/にはい(两杯)混在一句', 'にはい(2杯)不音变'], grammarPoints: ['と（并列）', '数量词：杯'] },
      { stepId: 's5', speaker: '店員', interactionType: 'listen', script: 'かしこまりました。お会計は全部で1,850円です。', furiganaText: 'かしこまりました。おかいけいはぜんぶでせんはっぴゃくごじゅうえんです。', translation: '好的。合计1850日元。', listeningTraps: ['はっぴゃく(800)促音', '1850/1580顺序'], grammarPoints: ['ぜんぶで'] },
      { stepId: 'q1', interactionType: 'choose', question: '几个人用餐？', options: ['2人', '1人', '3人', '4人'], answer: '2人', infoCategory: 'counter', explanation: '「ふたりです」。ひとり(1人)/ふたり(2人)是特殊读法，3人起才是规则的さんにん。', grammarPoints: ['数量词：人'] },
      { stepId: 'q2', interactionType: 'choose', question: '点了几杯咖啡？', options: ['2杯', '1杯', '3杯', '4杯'], answer: '2杯', infoCategory: 'counter', explanation: '「コーヒーをにはい」＝2杯。注意1杯读いっぱい（促音+半浊音），2杯读にはい（无音变）。', grammarPoints: ['数量词：杯'] },
      { stepId: 'q3', interactionType: 'choose', question: '一共多少钱？', options: ['1,850円', '1,580円', '1,800円', '2,850円'], answer: '1,850円', infoCategory: 'price', explanation: '「せんはっぴゃくごじゅうえん」＝1850円。1580 是位数顺序颠倒的典型听错。', grammarPoints: ['金额听辨'] },
      { stepId: 'q4', speaker: '店員', interactionType: 'respond', script: 'お飲み物は食後でよろしいですか。', furiganaText: 'おのみものはしょくごでよろしいですか。', translation: '饮料饭后上可以吗？', question: '你希望咖啡饭后再上。怎么回答？', options: ['はい、お願いします。', 'いいえ、コーヒーです。', '二杯です。', '食後です、ください。'], answer: 'はい、お願いします。', acceptedAnswers: ['はい、お願いします。', 'はい、食後でお願いします。'], infoCategory: null, explanation: '同意对方提议＝「はい、お願いします」。「食後です、ください」是不自然的拼凑说法。', grammarPoints: ['お願いします'] }
    ],
    review: {
      lineNotes: {
        s1: '入店三连问的第一问：人数。何名様＝何人的敬语。',
        s2: '报人数：ふたりです。',
        s3: '店员确认是否可以点单。',
        s4: '点单句型：料理＋を＋数量＋と＋…＋お願いします／ください。',
        s5: '合计金额：ぜんぶで＋金额。'
      },
      naturalResponses: [
        { ja: 'すみません、まだです。', note: '还没决定点什么时的自然回答' },
        { ja: '以上でお願いします。', note: '点完单表示"就这些"' }
      ],
      grammarNotes: [
        'と并列名词：カレーとラーメン。',
        '杯的音变：いっぱい・にはい・さんばい，何杯→なんばい。',
        'ぜんぶで＝合计。'
      ]
    },
    reinforcement: [
      { type: 'frame', category: 'counter', note: '换场景听数量词' },
      { type: 'scenario', ref: 'scenario-cafe-order-001' },
      { type: 'scenario', ref: 'scenario-supermarket-food-001' }
    ],
    contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
    origin: '基于已验证知识生成的练习示例', sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: 'AI编写的餐厅常用表达；课程归属待对照教材核实。'
  },

  {
    id: 'scenario-cafe-order-001',
    title: '咖啡店点饮料',
    category: 'dining',
    setting: '咖啡店柜台',
    goal: '点到想要的尺寸和温度的咖啡，听懂金额和取餐位置',
    roles: ['店員', 'あなた'],
    lessonRange: { min: 1, max: 21 }, lessonStatus: 'pending',
    difficulty: 1, estimatedDuration: 180,
    informationTypes: ['金额', '地点'],
    grammarPoints: ['をください', 'で（场所）'],
    particles: ['を', 'で'], verbForms: ['ます形', 'て形'],
    numberTypes: ['price'],
    knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-de' }],
    knowledgeMapStatus: 'verified',
    extendedVocab: [
      { word: 'ホット', kana: 'ホット', pos: '名词', zh: '热饮', reason: '咖啡店点单固定说法', scope: 'extended_basic', required: false, displayMode: '扩展生活词汇' },
      { word: 'お持ち帰り', kana: 'おもちかえり', pos: '名词', zh: '外带', reason: '店内/外带固定询问', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' }
    ],
    steps: [
      { stepId: 's1', speaker: '店員', interactionType: 'listen', script: 'いらっしゃいませ。店内でお召し上がりですか。', furiganaText: 'いらっしゃいませ。てんないでおめしあがりですか。', translation: '欢迎光临。在店内用吗？', listeningTraps: [], grammarPoints: ['で（场所）'] },
      { stepId: 's2', speaker: 'あなた', interactionType: 'listen', script: 'お持ち帰りでお願いします。ホットコーヒーを一つください。', furiganaText: 'おもちかえりでおねがいします。ホットコーヒーをひとつください。', translation: '外带。请给我一杯热咖啡。', listeningTraps: [], grammarPoints: ['をください'] },
      { stepId: 's3', speaker: '店員', interactionType: 'listen', script: 'サイズはいかがなさいますか。', furiganaText: 'サイズはいかがなさいますか。', translation: '要什么尺寸？', listeningTraps: [], grammarPoints: [] },
      { stepId: 's4', speaker: 'あなた', interactionType: 'listen', script: 'Mサイズでお願いします。', furiganaText: 'エムサイズでおねがいします。', translation: 'M号的。', listeningTraps: [], grammarPoints: ['で（方式）'] },
      { stepId: 's5', speaker: '店員', interactionType: 'listen', script: '380円です。あちらのカウンターでお待ちください。', furiganaText: 'さんびゃくはちじゅうえんです。あちらのカウンターでおまちください。', translation: '380日元。请在那边的柜台等。', listeningTraps: ['さんびゃく(300)浊音', '380/830顺序颠倒'], grammarPoints: ['で（场所）', 'お待ちください'] },
      { stepId: 'q1', interactionType: 'choose', question: '咖啡多少钱？', options: ['380円', '830円', '308円', '480円'], answer: '380円', infoCategory: 'price', explanation: '「さんびゃくはちじゅうえん」＝380円。830 是位数颠倒；308 是把はちじゅう(80)听成はち(8)。', grammarPoints: ['金额听辨'] },
      { stepId: 'q2', interactionType: 'choose', question: '在哪里等咖啡？', options: ['那边的柜台', '店内座位', '门口', '二楼'], answer: '那边的柜台', infoCategory: null, explanation: '「あちらのカウンターでお待ちください」。あちら=那边（远处），で标记等待动作发生的场所。', grammarPoints: ['で（动作场所）'] },
      { stepId: 'q3', speaker: '店員', interactionType: 'respond', script: 'ポイントカードはよろしいですか。', furiganaText: 'ポイントカードはよろしいですか。', translation: '积分卡可以（不用）吗？', question: '你不需要积分卡。最自然的回答是？', options: ['はい、大丈夫です。', 'いいえ、ください。', 'カードがあります。', 'Mサイズです。'], answer: 'はい、大丈夫です。', acceptedAnswers: ['はい、大丈夫です。', 'はい、けっこうです。'], infoCategory: null, explanation: '「よろしいですか」是"不用也可以吧"的确认，同意（不需要）回答「はい、大丈夫です」。', grammarPoints: [] }
    ],
    review: {
      lineNotes: {
        s1: '店内/外带的固定第一问，で标记用餐场所。',
        s2: '外带＋点单。',
        s3: '尺寸询问（敬语形式，理解即可）。',
        s4: '「Mサイズで」＝按M号来，で表示方式。',
        s5: '金额＋取餐位置：カウンターで待つ。'
      },
      naturalResponses: [
        { ja: '店内で。', note: '在店内用时最简洁的回答' }
      ],
      grammarNotes: [
        'で的两种用法在本场景都出现：场所（店内で/カウンターで）与方式（Mサイズで/お持ち帰りで）。',
        '380円＝さんびゃくはちじゅうえん，300浊音变さんびゃく。'
      ]
    },
    reinforcement: [
      { type: 'frame', category: 'price', note: '在别的店听金额' },
      { type: 'scenario', ref: 'scenario-convenience-store-checkout-001' },
      { type: 'scenario', ref: 'scenario-restaurant-order-001' }
    ],
    contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
    origin: '基于已验证知识生成的练习示例', sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: 'AI编写的咖啡店常用表达；课程归属待对照教材核实。'
  }
);
