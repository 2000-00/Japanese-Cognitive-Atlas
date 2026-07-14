/* 完整场景 —— 交通（待审核区）。AI 编写的常用表达，非教材原文。 */
window.MJT_DATA = window.MJT_DATA || {};
window.MJT_DATA.pendingScenarios = window.MJT_DATA.pendingScenarios || [];

window.MJT_DATA.pendingScenarios.push(
  {
    id: 'scenario-train-platform-001',
    title: '查电车时间与站台',
    category: 'transport',
    setting: '车站问讯处',
    goal: '问清下一班去横滨的电车几点发车、在几号站台',
    roles: ['駅員', 'あなた'],
    lessonRange: { min: 1, max: 21 }, lessonStatus: 'pending',
    difficulty: 2, estimatedDuration: 240,
    informationTypes: ['时间', '站台号', '金额'],
    grammarPoints: ['时间表达', 'から（出发）', '疑问词'],
    particles: ['に', 'から', 'まで'], verbForms: ['ます形'],
    numberTypes: ['time', 'counter', 'price'],
    knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-kara-made' }],
    knowledgeMapStatus: 'verified',
    extendedVocab: [
      { word: 'ホーム', kana: 'ホーム', pos: '名词', zh: '站台', reason: '车站场景核心词', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' },
      { word: '番線', kana: 'ばんせん', pos: '名词', zh: '～号线（站台编号）', reason: '车站广播固定说法', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' }
    ],
    steps: [
      { stepId: 's1', speaker: 'あなた', interactionType: 'listen', script: 'すみません、次の横浜行きの電車は何時ですか。', furiganaText: 'すみません、つぎのよこはまゆきのでんしゃはなんじですか。', translation: '请问下一班去横滨的电车是几点？', listeningTraps: [], grammarPoints: ['何時ですか'] },
      { stepId: 's2', speaker: '駅員', interactionType: 'listen', script: '次は10時24分です。4番線から出ます。', furiganaText: 'つぎはじゅうじにじゅうよんぷんです。よんばんせんからでます。', translation: '下一班是10点24分。从4号站台发车。', listeningTraps: ['にじゅうよんぷん(24分)/にじゅうよっか(24日)', '4番線/7番线（よん/なな）'], grammarPoints: ['から（出发点）'] },
      { stepId: 's3', speaker: 'あなた', interactionType: 'listen', script: '横浜までいくらですか。', furiganaText: 'よこはままでいくらですか。', translation: '到横滨多少钱？', listeningTraps: [], grammarPoints: ['まで'] },
      { stepId: 's4', speaker: '駅員', interactionType: 'listen', script: '480円です。切符は自動券売機で買ってください。', furiganaText: 'よんひゃくはちじゅうえんです。きっぷはじどうけんばいきでかってください。', translation: '480日元。车票请在自动售票机购买。', listeningTraps: ['480/840顺序颠倒'], grammarPoints: ['で（手段/场所）', 'てください'] },
      { stepId: 'q1', interactionType: 'choose', question: '下一班电车几点发车？', options: ['10:24', '10:44', '10:14', '4:24'], answer: '10:24', infoCategory: 'time', explanation: '「じゅうじにじゅうよんぷん」＝10:24。24分（にじゅうよんぷん）与44分（よんじゅうよんぷん）开头易混。', grammarPoints: ['时间表达'] },
      { stepId: 'q2', interactionType: 'choose', question: '在几号站台乘车？', options: ['4号站台', '7号站台', '1号站台', '2号站台'], answer: '4号站台', infoCategory: 'counter', explanation: '「4番線（よんばんせん）から出ます」。4（よん）与7（しち/なな）是车站广播的经典易混数字。', grammarPoints: ['から（出发点）'] },
      { stepId: 'q3', interactionType: 'choose', question: '到横滨的车票多少钱？', options: ['480円', '840円', '408円', '580円'], answer: '480円', infoCategory: 'price', explanation: '「よんひゃくはちじゅうえん」＝480円。840 是位数颠倒，408 是十位滑落。', grammarPoints: ['金额听辨'] },
      { stepId: 'q4', speaker: '駅員', interactionType: 'respond', script: '往復ですか、片道ですか。', furiganaText: 'おうふくですか、かたみちですか。', translation: '往返还是单程？', question: '你只买单程票。怎么回答？', options: ['片道でお願いします。', '往復です、けっこうです。', '4番線です。', '480円ください。'], answer: '片道でお願いします。', acceptedAnswers: ['片道でお願いします。', '片道です。'], infoCategory: null, explanation: '二选一的问题直接选一个＋でお願いします/です。', grammarPoints: [] }
    ],
    review: {
      lineNotes: {
        s1: '「～行き（ゆき）」=开往～。问时刻：何時ですか。',
        s2: '时刻＋站台两个数字连续出现，都要抓住。',
        s3: 'まで问到达点的费用。',
        s4: '金额＋购票方式（券売機で）。'
      },
      naturalResponses: [
        { ja: 'ありがとうございます。', note: '问讯后自然道谢' }
      ],
      grammarNotes: [
        'から的两个用法：4番線から出ます（出发点）；まで：横浜まで（到达点）。',
        '24分＝にじゅうよんぷん；4分よんぷん、24日にじゅうよっか——分/日读法不同。'
      ]
    },
    reinforcement: [
      { type: 'frame', category: 'time', note: '在别的场景听时刻' },
      { type: 'scenario', ref: 'scenario-bus-ride-001' },
      { type: 'scenario', ref: 'scenario-cafe-order-001' }
    ],
    contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
    origin: '基于已验证知识生成的练习示例', sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: 'AI编写的车站问讯常用表达；课程归属待对照教材核实。'
  },

  {
    id: 'scenario-bus-ride-001',
    title: '坐巴士与问路',
    category: 'transport',
    setting: '巴士站和车内',
    goal: '确认这班巴士到不到市民医院，听懂几站后下车和车费',
    roles: ['運転手', 'あなた'],
    lessonRange: { min: 1, max: 21 }, lessonStatus: 'pending',
    difficulty: 3, estimatedDuration: 300,
    informationTypes: ['肯定与否定', '次数（站数）', '金额'],
    grammarPoints: ['疑问确认', '数量词', 'てください'],
    particles: ['に', 'で', 'を'], verbForms: ['て形', 'ます形'],
    numberTypes: ['counter', 'price'],
    knowledgeMap: [{ module: 'core-grammar', section: '请求', node: 'cg-pol-kudasai' }],
    knowledgeMapStatus: 'verified',
    extendedVocab: [
      { word: '市民病院', kana: 'しみんびょういん', pos: '名词', zh: '市民医院', reason: '巴士报站常见目的地', scope: 'extended_basic', required: false, displayMode: '扩展生活词汇' },
      { word: '停留所', kana: 'ていりゅうじょ', pos: '名词', zh: '公交站', reason: '巴士场景核心词', scope: 'extended_basic', required: false, displayMode: '扩展生活词汇' }
    ],
    steps: [
      { stepId: 's1', speaker: 'あなた', interactionType: 'listen', script: 'すみません、このバスは市民病院へ行きますか。', furiganaText: 'すみません、このバスはしみんびょういんへいきますか。', translation: '请问这班巴士去市民医院吗？', listeningTraps: [], grammarPoints: ['へ（方向）'] },
      { stepId: 's2', speaker: '運転手', interactionType: 'listen', script: 'はい、行きますよ。ここから五つ目です。', furiganaText: 'はい、いきますよ。ここからいつつめです。', translation: '去的。从这里数第五站。', listeningTraps: ['いつつめ(第5个)/むっつめ(第6个)', '～目=第～'], grammarPoints: ['数量词＋目'] },
      { stepId: 's3', speaker: '運転手', interactionType: 'listen', script: '料金は220円です。降りるときに払ってください。', furiganaText: 'りょうきんはにひゃくにじゅうえんです。おりるときにはらってください。', translation: '车费220日元。下车时支付。', listeningTraps: ['にひゃくにじゅう两个に连续', '220/202'], grammarPoints: ['とき', 'てください'] },
      { stepId: 's4', speaker: '運転手', interactionType: 'listen', script: '次は市民病院前、市民病院前です。お降りの方はボタンを押してください。', furiganaText: 'つぎはしみんびょういんまえ、しみんびょういんまえです。おおりのかたはボタンをおしてください。', translation: '下一站市民医院前、市民医院前。要下车的乘客请按铃。', listeningTraps: ['車内放送语速快、重复站名'], grammarPoints: ['てください'] },
      { stepId: 'q1', interactionType: 'choose', question: '到市民医院要坐几站？', options: ['5站', '6站', '4站', '2站'], answer: '5站', infoCategory: 'counter', explanation: '「五つ目（いつつめ）」＝第5站。～目表示"第～个"。いつつ(5)/むっつ(6)开头相近。', grammarPoints: ['数量词＋目'] },
      { stepId: 'q2', interactionType: 'choose', question: '车费多少钱？什么时候付？', options: ['220円・下车时', '220円・上车时', '202円・下车时', '250円・上车时'], answer: '220円・下车时', infoCategory: 'price', explanation: '「220円」＋「降りるときに払ってください」＝下车时付。とき=……的时候。', grammarPoints: ['とき'] },
      { stepId: 'q3', interactionType: 'choose', question: '听到报站后，要下车该做什么？', options: ['按下车铃', '直接站起来', '喊司机', '付钱后等待'], answer: '按下车铃', infoCategory: null, explanation: '「ボタンを押してください」＝请按按钮（下车铃）。押す→押して（す→して）＋ください。', grammarPoints: ['てください'] },
      { stepId: 'q4', speaker: '運転手', interactionType: 'respond', script: '両替は止まってからお願いしますね。', furiganaText: 'りょうがえはとまってからおねがいしますね。', translation: '换零钱请等车停稳之后。', question: '司机提醒你等车停了再换零钱。怎么回应？', options: ['はい、わかりました。', 'いいえ、けっこうです。', '220円です。', '五つ目です。'], answer: 'はい、わかりました。', acceptedAnswers: ['はい、わかりました。', 'はい。'], infoCategory: null, explanation: '对提醒/指示的自然回应是「はい、わかりました」。', grammarPoints: [] }
    ],
    review: {
      lineNotes: {
        s1: '确认路线的基本句：このバスは～へ行きますか。',
        s2: '「五つ目」：和语数词＋目＝第几个。',
        s3: '费用＋支付时机（降りるとき）。',
        s4: '车内报站广播：站名重复两遍＋按铃提示。'
      },
      naturalResponses: [
        { ja: '市民病院はまだですか。', note: '不确定坐过站没有时的问法' }
      ],
      grammarNotes: [
        '降りるとき：辞书形＋とき=做…的时候。',
        '押してください／払ってください：て形请求连发，注意す→して、う→って的音便差异。'
      ]
    },
    reinforcement: [
      { type: 'frame', category: 'price', note: '在别的交通场景听金额' },
      { type: 'scenario', ref: 'scenario-train-platform-001' },
      { type: 'scenario', ref: 'scenario-hospital-reception-001' }
    ],
    contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
    origin: '基于已验证知识生成的练习示例', sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: 'AI编写的巴士乘车常用表达；课程归属待对照教材核实。'
  }
);
