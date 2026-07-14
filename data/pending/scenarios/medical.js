/* 完整场景 —— 医疗（待审核区）。AI 编写的常用表达，非教材原文。 */
window.MJT_DATA = window.MJT_DATA || {};
window.MJT_DATA.pendingScenarios = window.MJT_DATA.pendingScenarios || [];

window.MJT_DATA.pendingScenarios.push(
  {
    id: 'scenario-hospital-reception-001',
    title: '医院挂号',
    category: 'medical',
    setting: '医院挂号窗口',
    goal: '第一次挂号：说明来意，听懂楼层与等待时间',
    roles: ['受付', 'あなた'],
    lessonRange: { min: 1, max: 21 }, lessonStatus: 'pending',
    difficulty: 2, estimatedDuration: 240,
    informationTypes: ['地点', '时间', '肯定与否定'],
    grammarPoints: ['にあります', 'てください', '时间表达'],
    particles: ['に', 'で', 'を'], verbForms: ['て形'],
    numberTypes: ['counter', 'duration'],
    knowledgeMap: [
      { module: 'core-grammar', section: '格助词', node: 'cg-p-ni' },
      { module: 'core-grammar', section: '请求', node: 'cg-pol-kudasai' }
    ],
    knowledgeMapStatus: 'verified',
    extendedVocab: [
      { word: '保険証', kana: 'ほけんしょう', pos: '名词', zh: '医保卡', reason: '日本医院挂号必需证件', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' },
      { word: '内科', kana: 'ないか', pos: '名词', zh: '内科', reason: '挂号分科必需', scope: 'extended_basic', required: false, displayMode: '扩展生活词汇' },
      { word: '受付', kana: 'うけつけ', pos: '名词', zh: '挂号处/前台', reason: '医院场景核心词', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' }
    ],
    steps: [
      { stepId: 's1', speaker: 'あなた', interactionType: 'listen', script: 'すみません、初めてですが、お願いします。', furiganaText: 'すみません、はじめてですが、おねがいします。', translation: '不好意思，我是第一次来，麻烦你了。', listeningTraps: [], grammarPoints: ['が（铺垫）'] },
      { stepId: 's2', speaker: '受付', interactionType: 'listen', script: '保険証をお願いします。今日はどうしましたか。', furiganaText: 'ほけんしょうをおねがいします。きょうはどうしましたか。', translation: '请出示医保卡。今天怎么了？', listeningTraps: ['どうしましたか=问症状的固定句'], grammarPoints: [] },
      { stepId: 's3', speaker: 'あなた', interactionType: 'listen', script: 'おなかが痛いです。きのうから何も食べていません。', furiganaText: 'おなかがいたいです。きのうからなにもたべていません。', translation: '肚子疼。从昨天开始什么都没吃。', listeningTraps: ['何も＋否定=什么都不'], grammarPoints: ['が（症状主语）', 'ています（否定）'] },
      { stepId: 's4', speaker: '受付', interactionType: 'listen', script: 'では、内科ですね。内科は3階にあります。エレベーターで上がってください。', furiganaText: 'では、ないかですね。ないかはさんがいにあります。エレベーターであがってください。', translation: '那么是内科。内科在3楼。请坐电梯上去。', listeningTraps: ['さんがい(3階)浊音，不是さんかい'], grammarPoints: ['にあります', 'で（手段）', 'てください'] },
      { stepId: 's5', speaker: '受付', interactionType: 'listen', script: '今、混んでいますから、1時間ぐらい待ってください。', furiganaText: 'いま、こんでいますから、いちじかんぐらいまってください。', translation: '现在人多，请等1个小时左右。', listeningTraps: ['いちじかん(1小时)≠いちじ(1点)'], grammarPoints: ['から（理由）', 'ています'] },
      { stepId: 'q1', interactionType: 'choose', question: '内科在几楼？', options: ['3楼', '2楼', '4楼', '1楼'], answer: '3楼', infoCategory: 'counter', explanation: '「さんがい（3階）にあります」。3階浊音读さんがい，容易与さんかい（3回）混。', grammarPoints: ['数量词：階'] },
      { stepId: 'q2', interactionType: 'choose', question: '大约要等多久？', options: ['1小时', '1点钟', '2小时', '30分钟'], answer: '1小时', infoCategory: 'duration', explanation: '「1時間ぐらい」＝1小时左右。～時間是时长，～時是时刻——いちじかん≠いちじ。', grammarPoints: ['～時間'] },
      { stepId: 'q3', interactionType: 'choose', question: '关于说话人的症状，正确的是？', options: ['肚子疼，从昨天起没吃东西', '头疼，从昨天起没睡觉', '肚子疼，早上吃过饭', '牙疼，什么都吃不了'], answer: '肚子疼，从昨天起没吃东西', infoCategory: null, explanation: '「おなかが痛い」＋「きのうから何も食べていません」。何も＋否定＝什么都没…。', grammarPoints: ['ています（否定）'] },
      { stepId: 'q4', speaker: '受付', interactionType: 'respond', script: 'お薬手帳はお持ちですか。', furiganaText: 'おくすりてちょうはおもちですか。', translation: '带用药手册了吗？', question: '你没有用药手册。怎么回答？', options: ['いいえ、持っていません。', 'はい、痛いです。', '3階です。', '1時間ぐらいです。'], answer: 'いいえ、持っていません。', acceptedAnswers: ['いいえ、持っていません。', 'いいえ、ありません。'], infoCategory: null, explanation: '「お持ちですか」问的是"有没有带"，没带回答「持っていません」。', grammarPoints: ['ています'] }
    ],
    review: {
      lineNotes: {
        s1: '「初めてですが」的が是铺垫用法（先给背景），不是转折。',
        s2: '医院两件套：保险证＋どうしましたか（怎么了）。',
        s3: '症状表达：部位が痛い；何も食べていません＝持续到现在的否定状态。',
        s4: '科室＋楼层＋移动方式（エレベーターで）。',
        s5: '理由（混んでいますから）＋请求（待ってください）。'
      },
      naturalResponses: [
        { ja: 'はい、わかりました。', note: '听懂指示后的自然回应' }
      ],
      grammarNotes: [
        '食べていません：ている的否定形，表示"（至今）没吃"的状态。',
        '待ってください：待つ→待って（つ→って促音便）＋ください。',
        'から（理由）：混んでいますから＝因为人多。'
      ]
    },
    reinforcement: [
      { type: 'frame', category: 'counter', note: '在别的建筑听楼层' },
      { type: 'scenario', ref: 'scenario-dentist-appointment-001' },
      { type: 'scenario', ref: 'scenario-pharmacy-pickup-001' }
    ],
    contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
    origin: '基于已验证知识生成的练习示例', sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: 'AI编写的医院挂号常用表达；课程归属待对照教材核实。'
  },

  {
    id: 'scenario-dentist-appointment-001',
    title: '牙科电话预约',
    category: 'medical',
    setting: '打电话给牙科诊所',
    goal: '约到看牙的日期和时间，并确认要带的东西',
    roles: ['受付', 'あなた'],
    lessonRange: { min: 1, max: 21 }, lessonStatus: 'pending',
    difficulty: 3, estimatedDuration: 300,
    informationTypes: ['日期', '时间', '持有物'],
    grammarPoints: ['日期读法', '时间表达', 'てください'],
    particles: ['に', 'は', 'を'], verbForms: ['て形', 'ます形'],
    numberTypes: ['date', 'time'],
    knowledgeMap: [
      { module: 'core-grammar', section: '格助词', node: 'cg-p-ni' },
      { module: 'core-grammar', section: '请求', node: 'cg-pol-kudasai' }
    ],
    knowledgeMapStatus: 'verified',
    extendedVocab: [
      { word: '歯医者', kana: 'はいしゃ', pos: '名词', zh: '牙医/牙科诊所', reason: '牙科场景核心词', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' },
      { word: '予約', kana: 'よやく', pos: '名词', zh: '预约', reason: '预约场景核心词', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' }
    ],
    steps: [
      { stepId: 's1', speaker: '受付', interactionType: 'listen', script: 'はい、さくら歯科です。', furiganaText: 'はい、さくらしかです。', translation: '您好，樱花牙科。', listeningTraps: [], grammarPoints: [] },
      { stepId: 's2', speaker: 'あなた', interactionType: 'listen', script: 'すみません、歯が痛いんですが、予約をお願いします。', furiganaText: 'すみません、はがいたいんですが、よやくをおねがいします。', translation: '不好意思，我牙疼，想预约。', listeningTraps: [], grammarPoints: ['が（铺垫）'] },
      { stepId: 's3', speaker: '受付', interactionType: 'listen', script: 'では、14日の木曜日、午前10時半はいかがですか。', furiganaText: 'では、じゅうよっかのもくようび、ごぜんじゅうじはんはいかがですか。', translation: '那么14号星期四，上午10点半怎么样？', listeningTraps: ['じゅうよっか(14日)/にじゅうよっか(24日)', 'じゅうじはん=10点半'], grammarPoints: ['日期读法', 'いかがですか'] },
      { stepId: 's4', speaker: 'あなた', interactionType: 'listen', script: 'すみません、木曜日はちょっと……。金曜日は空いていますか。', furiganaText: 'すみません、もくようびはちょっと……。きんようびはあいていますか。', translation: '不好意思，星期四有点……。星期五有空位吗？', listeningTraps: ['ちょっと……=委婉拒绝'], grammarPoints: ['ています'] },
      { stepId: 's5', speaker: '受付', interactionType: 'listen', script: '金曜日ですね。15日の午後4時はいかがですか。', furiganaText: 'きんようびですね。じゅうごにちのごごよじはいかがですか。', translation: '星期五是吧。15号下午4点怎么样？', listeningTraps: ['よじ(4時)不读よんじ', '15日じゅうごにち规则读法'], grammarPoints: ['时间表达'] },
      { stepId: 's6', speaker: 'あなた', interactionType: 'listen', script: 'はい、大丈夫です。それでお願いします。', furiganaText: 'はい、だいじょうぶです。それでおねがいします。', translation: '好，没问题。就那个时间吧。', listeningTraps: [], grammarPoints: [] },
      { stepId: 's7', speaker: '受付', interactionType: 'listen', script: 'では15日の4時に、保険証を持ってきてください。', furiganaText: 'ではじゅうごにちのよじに、ほけんしょうをもってきてください。', translation: '那么15号4点，请带医保卡过来。', listeningTraps: ['持ってきて=带来'], grammarPoints: ['てください', 'てくる'] },
      { stepId: 'q1', interactionType: 'choose', question: '最终预约在哪一天？', options: ['15日（星期五）', '14日（星期四）', '24日（星期五）', '5日（星期五）'], answer: '15日（星期五）', infoCategory: 'date', explanation: '先提议14日木曜日被婉拒（木曜日はちょっと……），改约15日金曜日。对话中日期变更是最常见的听力陷阱。', grammarPoints: ['日期读法'] },
      { stepId: 'q2', interactionType: 'choose', question: '预约时间是几点？', options: ['16:00', '10:30', '16:30', '14:00'], answer: '16:00', infoCategory: 'time', explanation: '最终定的是「午後4時（よじ）」＝16:00。上午10点半是被拒绝的第一个提议。4時固定读よじ。', grammarPoints: ['时间表达'] },
      { stepId: 'q3', interactionType: 'choose', question: '去牙科时要带什么？', options: ['医保卡', '用药手册', '预约券', '现金'], answer: '医保卡', infoCategory: null, explanation: '「保険証を持ってきてください」＝请带医保卡来。持ってくる=带来（て形+くる）。', grammarPoints: ['てくる'] },
      { stepId: 'q4', speaker: '受付', interactionType: 'respond', script: 'お名前をお願いします。', furiganaText: 'おなまえをおねがいします。', translation: '请告诉我您的姓名。', question: '对方问你的名字（假设你叫リン）。怎么回答最自然？', options: ['リンです。よろしくお願いします。', 'はい、そうです。', '15日の4時です。', '名前です。'], answer: 'リンです。よろしくお願いします。', acceptedAnswers: ['リンです。よろしくお願いします。', 'リンです。'], infoCategory: null, explanation: '报名字：名字＋です。加一句よろしくお願いします更自然。', grammarPoints: ['判断句'] }
    ],
    review: {
      lineNotes: {
        s2: '「歯が痛いんですが」：症状＋が铺垫，引出请求。',
        s3: '第一次提议：日期＋星期＋时间三个信息一起出现。',
        s4: '「ちょっと……」是日语最常用的委婉拒绝，后面不用说完。',
        s5: '第二次提议：改天改时间。',
        s7: '确认信息＋携带物请求。'
      },
      naturalResponses: [
        { ja: '木曜日はちょっと都合が悪いんですが……。', note: '更完整的委婉拒绝说法' }
      ],
      grammarNotes: [
        '空いていますか：空く→空いている（结果状态"是空着的"）。',
        '持ってきてください：持つ→持って＋くる→きて＋ください，"带来"。',
        '预约对话的套路：提议(いかがですか)→拒绝(ちょっと)→再提议→确认(それでお願いします)。'
      ]
    },
    reinforcement: [
      { type: 'frame', category: 'date', note: '在别的预约场景听日期' },
      { type: 'scenario', ref: 'scenario-hospital-reception-001' },
      { type: 'scenario', ref: 'scenario-school-absence-001' }
    ],
    contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
    origin: '基于已验证知识生成的练习示例', sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: 'AI编写的牙科预约常用表达；课程归属待对照教材核实。'
  },

  {
    id: 'scenario-pharmacy-pickup-001',
    title: '药局领取药物',
    category: 'medical',
    setting: '处方药局窗口',
    goal: '听懂吃药的次数、时间和费用',
    roles: ['薬剤師', 'あなた'],
    lessonRange: { min: 1, max: 21 }, lessonStatus: 'pending',
    difficulty: 2, estimatedDuration: 240,
    informationTypes: ['次数', '时间', '金额'],
    grammarPoints: ['数量词：回', 'てください', 'ないでください'],
    particles: ['に', 'を', 'で'], verbForms: ['て形', 'ない形'],
    numberTypes: ['counter', 'price'],
    knowledgeMap: [
      { module: 'core-grammar', section: '请求', node: 'cg-pol-kudasai' },
      { module: 'core-grammar', section: '动词变形', node: 'cg-nai-form' }
    ],
    knowledgeMapStatus: 'verified',
    extendedVocab: [
      { word: '処方箋', kana: 'しょほうせん', pos: '名词', zh: '处方', reason: '药局取药必需', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' },
      { word: '薬剤師', kana: 'やくざいし', pos: '名词', zh: '药剂师', reason: '场景角色名', scope: 'extended_basic', required: false, displayMode: '扩展生活词汇' }
    ],
    steps: [
      { stepId: 's1', speaker: 'あなた', interactionType: 'listen', script: 'すみません、処方箋をお願いします。', furiganaText: 'すみません、しょほうせんをおねがいします。', translation: '不好意思，处方给您（请配药）。', listeningTraps: [], grammarPoints: ['をお願いします'] },
      { stepId: 's2', speaker: '薬剤師', interactionType: 'listen', script: 'はい。こちらは一日に2回、朝と夜、食事の後で飲んでください。', furiganaText: 'はい。こちらはいちにちににかい、あさとよる、しょくじのあとでのんでください。', translation: '好的。这个一天吃2次，早晚饭后服用。', listeningTraps: ['にかい(2回)/にかい(2階)同音', '朝と夜=早和晚'], grammarPoints: ['数量词：回', 'てください', 'と（并列）'] },
      { stepId: 's3', speaker: '薬剤師', interactionType: 'listen', script: 'お酒と一緒に飲まないでくださいね。', furiganaText: 'おさけといっしょにのまないでくださいね。', translation: '请不要和酒一起服用。', listeningTraps: ['飲まないで=否定请求'], grammarPoints: ['ないでください'] },
      { stepId: 's4', speaker: '薬剤師', interactionType: 'listen', script: 'お会計は760円です。お大事に。', furiganaText: 'おかいけいはななひゃくろくじゅうえんです。おだいじに。', translation: '费用是760日元。请保重。', listeningTraps: ['ななひゃく(700)/ろくじゅう(60)', '760/670顺序'], grammarPoints: ['金额听辨'] },
      { stepId: 'q1', interactionType: 'choose', question: '药一天吃几次？', options: ['2次', '3次', '1次', '4次'], answer: '2次', infoCategory: 'counter', explanation: '「一日に2回（にかい）」。回（次数）与階（楼层）同音，吃药语境下是次数。', grammarPoints: ['数量词：回'] },
      { stepId: 'q2', interactionType: 'choose', question: '什么时候吃药？', options: ['早晚饭后', '早中晚饭前', '只在睡前', '只在早饭前'], answer: '早晚饭后', infoCategory: null, explanation: '「朝と夜、食事の後で」＝早上和晚上、饭后。と并列两个时间段，後（あと）=之后。', grammarPoints: ['と（并列）'] },
      { stepId: 'q3', interactionType: 'choose', question: '药剂师提醒不要做什么？', options: ['不要和酒一起吃', '不要空腹吃', '不要开车', '不要一天吃两次'], answer: '不要和酒一起吃', infoCategory: null, explanation: '「お酒と一緒に飲まないでください」。飲む→ない形飲まない＋でください＝否定请求"请不要喝/服用"。', grammarPoints: ['ないでください'] },
      { stepId: 'q4', interactionType: 'choose', question: '药费是多少？', options: ['760円', '670円', '706円', '860円'], answer: '760円', infoCategory: 'price', explanation: '「ななひゃくろくじゅうえん」＝760円。670 是顺序颠倒，706 是ろくじゅう(60)→ろく(6)滑位。', grammarPoints: ['金额听辨'] },
      { stepId: 'q5', speaker: '薬剤師', interactionType: 'respond', script: 'ジェネリックでよろしいですか。', furiganaText: 'ジェネリックでよろしいですか。', translation: '用仿制药（便宜的同成分药）可以吗？', question: '你同意用便宜的同成分药。怎么回答？', options: ['はい、お願いします。', 'いいえ、飲みません。', '760円です。', '2回です。'], answer: 'はい、お願いします。', acceptedAnswers: ['はい、お願いします。', 'はい、大丈夫です。'], infoCategory: null, explanation: '同意提议＝はい、お願いします。', grammarPoints: [] }
    ],
    review: {
      lineNotes: {
        s2: '服药说明的完整结构：频率（一日に2回）＋时段（朝と夜）＋时点（食事の後で）＋指示（飲んでください）。',
        s3: '否定请求：ない形＋でください。',
        s4: '金额＋「お大事に」（对病人的固定告别语）。'
      },
      naturalResponses: [
        { ja: 'はい、わかりました。ありがとうございます。', note: '听懂说明后的自然回应' }
      ],
      grammarNotes: [
        '飲まないでください：飲む（五段）→未然形飲ま＋ない＋でください。',
        '飲んでください：飲む→飲んで（む→んで拨音便）＋ください。同一动词的肯定/否定请求在本场景都出现了。',
        '一日に2回：に=每（比例基准）。'
      ]
    },
    reinforcement: [
      { type: 'frame', category: 'counter', note: '换场景听次数' },
      { type: 'scenario', ref: 'scenario-drugstore-buy-001' },
      { type: 'scenario', ref: 'scenario-hospital-reception-001' }
    ],
    contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
    origin: '基于已验证知识生成的练习示例', sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: 'AI编写的药局常用表达；课程归属待对照教材核实。'
  }
);
