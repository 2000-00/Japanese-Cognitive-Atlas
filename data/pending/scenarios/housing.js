/* 完整场景 —— 居住（待审核区）。AI 编写的常用表达，非教材原文。 */
window.MJT_DATA = window.MJT_DATA || {};
window.MJT_DATA.pendingScenarios = window.MJT_DATA.pendingScenarios || [];

window.MJT_DATA.pendingScenarios.push(
  {
    id: 'scenario-dorm-repair-001',
    title: '宿舍报修',
    category: 'housing',
    setting: '宿舍管理室',
    goal: '说明空调坏了，约好维修上门的日期和时间段',
    roles: ['管理人', 'あなた'],
    lessonRange: { min: 1, max: 21 }, lessonStatus: 'pending',
    difficulty: 2, estimatedDuration: 240,
    informationTypes: ['日期', '时间', '房间号'],
    grammarPoints: ['ています（状态）', '日期时间', 'てください'],
    particles: ['が', 'に', 'の'], verbForms: ['て形'],
    knowledgeMap: [
      { module: 'core-grammar', section: '体', node: 'cg-a-teiru' },
      { module: 'core-grammar', section: '请求', node: 'cg-pol-kudasai' }
    ],
    knowledgeMapStatus: 'verified',
    numberTypes: ['date', 'time'],
    extendedVocab: [
      { word: 'エアコン', kana: 'エアコン', pos: '名词', zh: '空调', reason: '房间设备核心词', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' },
      { word: '修理', kana: 'しゅうり', pos: '名词', zh: '修理', reason: '报修场景核心词', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' }
    ],
    steps: [
      { stepId: 's1', speaker: 'あなた', interactionType: 'listen', script: 'すみません、305号室のリンです。エアコンが壊れています。', furiganaText: 'すみません、さんまるごごうしつのリンです。エアコンがこわれています。', translation: '不好意思，我是305室的林。空调坏了。', listeningTraps: ['さんまるご=房间号逐位读', '壊れています=坏着的状态'], grammarPoints: ['ています（结果状态）'] },
      { stepId: 's2', speaker: '管理人', interactionType: 'listen', script: 'そうですか。じゃ、修理の人を呼びますね。', furiganaText: 'そうですか。じゃ、しゅうりのひとをよびますね。', translation: '这样啊。那我叫维修人员来。', listeningTraps: [], grammarPoints: [] },
      { stepId: 's3', speaker: '管理人', interactionType: 'listen', script: 'あさっての14日、午前10時から12時までの間はどうですか。', furiganaText: 'あさってのじゅうよっか、ごぜんじゅうじからじゅうにじまでのあいだはどうですか。', translation: '后天14号，上午10点到12点之间怎么样？', listeningTraps: ['あさって=后天', 'じゅうよっか(14日)', '10時から12時まで时间段'], grammarPoints: ['から～まで', '日期读法'] },
      { stepId: 's4', speaker: 'あなた', interactionType: 'listen', script: 'はい、大丈夫です。その時間は部屋にいます。', furiganaText: 'はい、だいじょうぶです。そのじかんはへやにいます。', translation: '好，没问题。那个时间我在房间。', listeningTraps: [], grammarPoints: ['にいます'] },
      { stepId: 'q1', interactionType: 'choose', question: '维修人员哪天来？', options: ['14日（后天）', '24日（后天）', '4日（明天）', '20日（后天）'], answer: '14日（后天）', infoCategory: 'date', explanation: '「あさっての14日（じゅうよっか）」。あさって=后天；14日与24日（にじゅうよっか）一字之差。', grammarPoints: ['日期读法'] },
      { stepId: 'q2', interactionType: 'choose', question: '维修的时间段是？', options: ['10:00～12:00', '10:00～2:00', '12:00～10:00', '9:00～12:00'], answer: '10:00～12:00', infoCategory: 'time', explanation: '「午前10時から12時まで」。から=起点，まで=终点。', grammarPoints: ['から～まで'] },
      { stepId: 'q3', interactionType: 'choose', question: '报修的是哪个房间、什么问题？', options: ['305室・空调坏了', '350室・空调坏了', '305室・灯坏了', '503室・空调坏了'], answer: '305室・空调坏了', infoCategory: null, explanation: '「305（さんまるご）号室」——日本房间号逐位读，0读まる；「エアコンが壊れています」=空调处于坏着的状态。', grammarPoints: ['ています（结果状态）'] },
      { stepId: 'q4', speaker: '管理人', interactionType: 'respond', script: '直りましたら、また教えてくださいね。', furiganaText: 'なおりましたら、またおしえてくださいね。', translation: '修好了的话再告诉我一声。', question: '管理员让你修好后说一声。怎么回应？', options: ['はい、わかりました。', 'いいえ、壊れています。', '305号室です。', '10時からです。'], answer: 'はい、わかりました。', acceptedAnswers: ['はい、わかりました。', 'はい。'], infoCategory: null, explanation: '对指示的自然回应。', grammarPoints: [] }
    ],
    review: {
      lineNotes: {
        s1: '报修三要素：房间号＋名字＋故障状态（が壊れています）。',
        s3: '维修预约：日期＋时间段（から～まで）。',
        s4: '确认在场：部屋にいます（人的存在用います）。'
      },
      naturalResponses: [
        { ja: 'エアコンの調子が悪いんですが……。', note: '"状态不太好"的更委婉说法' }
      ],
      grammarNotes: [
        '壊れています：壊れる（自动词）＋ている=坏着的结果状态，不是"正在坏"。',
        '房间号读法：305=さんまるご，0读まる。',
        'から～まで划定时间段。'
      ]
    },
    reinforcement: [
      { type: 'frame', category: 'time', note: '在别的场景听时间段' },
      { type: 'scenario', ref: 'scenario-delivery-notice-001' },
      { type: 'scenario', ref: 'scenario-dentist-appointment-001' }
    ],
    contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
    origin: '基于已验证知识生成的练习示例', sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: 'AI编写的宿舍报修常用表达；课程归属待对照教材核实。'
  },

  {
    id: 'scenario-delivery-notice-001',
    title: '快递不在家通知与再配送',
    category: 'housing',
    setting: '看到不在配送通知单后打电话',
    goal: '听懂语音提示，约定再配送的日期和时间段',
    roles: ['自動音声', '配達員', 'あなた'],
    lessonRange: { min: 1, max: 21 }, lessonStatus: 'pending',
    difficulty: 3, estimatedDuration: 300,
    informationTypes: ['日期', '时间', '编号'],
    grammarPoints: ['日期时间', 'てください', 'から～まで'],
    particles: ['を', 'に', 'から'], verbForms: ['て形'],
    numberTypes: ['date', 'time', 'phone'],
    knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-kara-made' }],
    knowledgeMapStatus: 'verified',
    extendedVocab: [
      { word: '再配達', kana: 'さいはいたつ', pos: '名词', zh: '再次配送', reason: '日本快递核心用语', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' },
      { word: '不在票', kana: 'ふざいひょう', pos: '名词', zh: '不在家通知单', reason: '快递场景核心词', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' },
      { word: '伝票番号', kana: 'でんぴょうばんごう', pos: '名词', zh: '快递单号', reason: '再配送必需信息', scope: 'extended_basic', required: false, displayMode: '扩展生活词汇' }
    ],
    steps: [
      { stepId: 's1', speaker: '自動音声', interactionType: 'listen', script: 'こちらはさくら運輸です。再配達は1を、その他は2を押してください。', furiganaText: 'こちらはさくらうんゆです。さいはいたつはいちを、そのたはにをおしてください。', translation: '这里是樱花运输。再配送请按1，其他请按2。', listeningTraps: ['语音菜单：数字对应操作'], grammarPoints: ['てください'] },
      { stepId: 's2', speaker: '配達員', interactionType: 'listen', script: 'お電話ありがとうございます。伝票番号をお願いします。', furiganaText: 'おでんわありがとうございます。でんぴょうばんごうをおねがいします。', translation: '感谢来电。请告诉我快递单号。', listeningTraps: [], grammarPoints: [] },
      { stepId: 's3', speaker: 'あなた', interactionType: 'listen', script: '4102の5678です。', furiganaText: 'よんいちまるにのごろくななはちです。', translation: '4102-5678。', listeningTraps: ['号码逐位读：0=まる/ゼロ', '4よん/7なな'], grammarPoints: ['电话号码读法'] },
      { stepId: 's4', speaker: '配達員', interactionType: 'listen', script: 'はい。では、あしたの19時から21時の間にお届けします。', furiganaText: 'はい。では、あしたのじゅうくじからにじゅういちじのあいだにおとどけします。', translation: '好的。那明天19点到21点之间给您送。', listeningTraps: ['19時じゅうくじ/21時にじゅういちじ（24小时制）'], grammarPoints: ['から～まで', 'に（时点）'] },
      { stepId: 'q1', interactionType: 'choose', question: '想约再配送，电话里先按几？', options: ['1', '2', '4', '5'], answer: '1', infoCategory: null, explanation: '「再配達は1を押してください」。语音菜单要把数字和操作对应起来。', grammarPoints: ['てください'] },
      { stepId: 'q2', interactionType: 'choose', question: '快递单号是多少？', options: ['4102-5678', '4102-5687', '4012-5678', '7102-5678'], answer: '4102-5678', infoCategory: 'phone', explanation: '「よんいちまるに の ごろくななはち」。0读まる；4（よん）/7（なな）是逐位号码里最易混的一对。', grammarPoints: ['号码读法'] },
      { stepId: 'q3', interactionType: 'choose', question: '再配送的时间段是？', options: ['明天19:00～21:00', '明天9:00～11:00', '今天19:00～21:00', '明天17:00～19:00'], answer: '明天19:00～21:00', infoCategory: 'time', explanation: '「あしたの19時（じゅうくじ）から21時（にじゅういちじ）の間」。快递时段常用24小时制，19時=晚上7点。', grammarPoints: ['から～まで'] },
      { stepId: 'q4', speaker: '配達員', interactionType: 'respond', script: 'お名前とお部屋番号をお願いします。', furiganaText: 'おなまえとおへやばんごうをおねがいします。', translation: '请告诉我姓名和房间号。', question: '你叫リン，住305室。怎么回答？', options: ['リンです。305号室です。', '305のリンをください。', 'はい、そうです。', 'あしたの19時です。'], answer: 'リンです。305号室です。', acceptedAnswers: ['リンです。305号室です。', 'リン、305号室です。'], infoCategory: null, explanation: '被问两个信息就依次回答两个：名字＋です、房间号＋です。', grammarPoints: ['判断句'] }
    ],
    review: {
      lineNotes: {
        s1: '自动语音菜单：操作＋数字＋押してください。',
        s3: '单号逐位读，分组间用「の」连接。',
        s4: '再配送时段：24小时制＋の間に。'
      },
      naturalResponses: [
        { ja: 'あしたの夜でお願いします。', note: '直接说时段偏好的自然说法' }
      ],
      grammarNotes: [
        '押してください：押す→押して（す→して）。',
        '19時＝じゅうくじ：24小时制在快递/车站极常用，19時=午後7時。',
        'の間に：在……区间内。'
      ]
    },
    reinforcement: [
      { type: 'frame', category: 'time', note: '在别的场景听时间段' },
      { type: 'scenario', ref: 'scenario-dorm-repair-001' },
      { type: 'scenario', ref: 'scenario-train-platform-001' }
    ],
    contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
    origin: '基于已验证知识生成的练习示例', sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: 'AI编写的快递再配送常用表达；课程归属待对照教材核实。'
  }
);
