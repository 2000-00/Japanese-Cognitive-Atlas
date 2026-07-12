/* =========================================================================
 * 听力题库 —— 待审核区（pending-review）
 *
 * 所有对话/句子为 AI 编写的自然情景句（基于常见初级语法与词汇），
 * 不是教材原文，也不是母语者真人录音——播放使用浏览器语音合成。
 * 课程归属为"待核实演示数据"，核实后才进入正式训练。
 * ========================================================================= */
window.MJT_DATA = window.MJT_DATA || {};

window.MJT_DATA.pendingListening = [
  {
    id: 'l-pending-001',
    type: 'single-sentence',
    audioScript: 'あしたのかいぎはごぜんくじからです。',
    scriptJa: '明日の会議は午前9時からです。',
    scriptKana: 'あしたのかいぎはごぜんくじからです。',
    audioUrl: '',
    question: '会议几点开始？',
    options: ['上午9点', '上午10点', '下午9点', '上午4点'],
    answer: '上午9点',
    translation: '明天的会议从上午9点开始。',
    explanation: '关键信息：「午前（ごぜん）」=上午，「9時（くじ）」——9時固定读くじ不读きゅうじ。「から」表示起点（从……开始）。易混点：くじ（9時）与よじ（4時）听感需要区分。',
    lesson: [4], difficulty: 1,
    grammarPoints: ['午前/午後', '～時', 'から'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写的情景句；课程归属待核实。',
    knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-kara-made' }],
    knowledgeMapStatus: 'verified'
  },
  {
    id: 'l-pending-002',
    type: 'short-dialog',
    audioScript: 'すみません、このりんごはいくらですか。ひとつひゃくごじゅうえんです。じゃ、みっつください。',
    scriptJa: '「すみません、このりんごはいくらですか。」「一つ150円です。」「じゃ、三つください。」',
    scriptKana: '「すみません、このりんごはいくらですか。」「ひとつひゃくごじゅうえんです。」「じゃ、みっつください。」',
    audioUrl: '',
    question: '顾客一共要付多少钱？',
    options: ['450円', '150円', '300円', '350円'],
    answer: '450円',
    translation: '"请问这个苹果多少钱？""一个150日元。""那么请给我三个。"',
    explanation: '单价150円（ひゃくごじゅうえん）×三つ（みっつ，3个）=450円。关键：听懂「一つ150円」是单价，「三つください」是数量。ひとつ/ふたつ/みっつ是和语数词固定读法。',
    lesson: [3, 11], difficulty: 2,
    grammarPoints: ['いくらですか', '～円', '和语数词', 'ください'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写的情景对话；课程归属待核实。',
    knowledgeMap: [],
    knowledgeMapStatus: 'pending'
  },
  {
    id: 'l-pending-003',
    type: 'single-sentence',
    audioScript: 'ぎんこうはえきのまえにあります。',
    scriptJa: '銀行は駅の前にあります。',
    scriptKana: 'ぎんこうはえきのまえにあります。',
    audioUrl: '',
    question: '银行在哪里？',
    options: ['车站前面', '车站后面', '车站里面', '车站旁边'],
    answer: '车站前面',
    translation: '银行在车站前面。',
    explanation: '存在句「～にあります」。方位词「前（まえ）」=前面。结构：銀行は＋駅の前（车站的前面）＋に（存在落点）＋あります（无生命物存在）。易混方位词：前まえ/後ろうしろ/中なか/隣となり。',
    lesson: [10], difficulty: 1,
    grammarPoints: ['にあります', '方位词'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写的情景句；课程归属待核实。',
    knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-ni' }],
    knowledgeMapStatus: 'verified'
  },
  {
    id: 'l-pending-004',
    type: 'number-dictation',
    audioScript: 'このほんはにせんはっぴゃくえんです。',
    scriptJa: 'この本は2800円です。',
    scriptKana: 'このほんはにせんはっぴゃくえんです。',
    audioUrl: '',
    question: '这本书多少钱？（听写价格）',
    options: ['2800円', '2600円', '8200円', '2080円'],
    answer: '2800円',
    translation: '这本书2800日元。',
    explanation: '「にせん」=2000，「はっぴゃく」=800（8+百的促音音变はっぴゃく）。易混：はっぴゃく（800）与ろっぴゃく（600）开头一音之差。',
    lesson: [3], difficulty: 2,
    grammarPoints: ['金额读法', '百位音变'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于通用金额读法编写；课程归属待核实。',
    knowledgeMap: [],
    knowledgeMapStatus: 'pending'
  },
  {
    id: 'l-pending-005',
    type: 'verb-form-recognition',
    audioScript: 'ちょっとまってください。',
    scriptJa: 'ちょっと待ってください。',
    scriptKana: 'ちょっとまってください。',
    audioUrl: '',
    question: '句中动词「待って」的原形是哪一个？',
    options: ['待つ', '待る', '待う', '待く'],
    answer: '待つ',
    translation: '请稍等。',
    explanation: '「待って」是て形。促音便って对应う/つ/る三种词尾，本词原形是待つ（まつ，五段动词）：待つ→待って。听力中识别促音（っ）是关键：まって有促音停顿，まつ没有。',
    lesson: [14], difficulty: 2,
    grammarPoints: ['て形→原形还原', '促音便'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写；课程归属待核实。',
    knowledgeMap: [{ module: 'core-grammar', section: '动词变形', node: 'cg-te-form-formation' }],
    knowledgeMapStatus: 'verified'
  },
  {
    id: 'l-pending-006',
    type: 'particle-recognition',
    audioScript: 'ともだちとえいがをみにいきます。',
    scriptJa: '友達と映画を見に行きます。',
    scriptKana: 'ともだちとえいがをみにいきます。',
    audioUrl: '',
    question: '「友達」后面听到的助词是哪一个？',
    options: ['と', 'に', 'を', 'は'],
    answer: 'と',
    translation: '和朋友去看电影。',
    explanation: '「友達と」的「と」标记共同动作者（和朋友一起）。整句结构：友達と（同伴）＋映画を（对象）＋見に（目的：动词ます形词干+に）＋行きます（移动动词）。「見に行きます」=去看（移动目的）。',
    lesson: [13], difficulty: 2,
    grammarPoints: ['と（共同动作者）', 'ます形词干+に行きます'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写；课程归属待核实。',
    knowledgeMap: [
      { module: 'core-grammar', section: '格助词', node: 'cg-p-to' },
      { module: 'core-grammar', section: '格助词', node: 'cg-p-ni' }
    ],
    knowledgeMapStatus: 'verified'
  }
];
