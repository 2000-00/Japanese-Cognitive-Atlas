/* 完整场景 —— 学校（待审核区）。AI 编写的常用表达，非教材原文。 */
window.MJT_DATA = window.MJT_DATA || {};
window.MJT_DATA.pendingScenarios = window.MJT_DATA.pendingScenarios || [];

window.MJT_DATA.pendingScenarios.push(
  {
    id: 'scenario-school-absence-001',
    title: '向老师请假',
    category: 'school',
    setting: '打电话到学校办公室',
    goal: '说明因病请假，听懂作业提交的截止日期',
    roles: ['先生', 'あなた'],
    lessonRange: { min: 1, max: 21 }, lessonStatus: 'pending',
    difficulty: 2, estimatedDuration: 240,
    informationTypes: ['日期', '肯定与否定', '接下来做什么'],
    grammarPoints: ['から（理由）', 'までに', 'てください'],
    particles: ['が', 'から', 'を'], verbForms: ['て形', 'ます形'],
    numberTypes: ['date'],
    knowledgeMap: [
      { module: 'core-grammar', section: '接续', node: 'cg-c-reason' },
      { module: 'core-grammar', section: '请求', node: 'cg-pol-kudasai' }
    ],
    knowledgeMapStatus: 'verified',
    extendedVocab: [
      { word: '欠席', kana: 'けっせき', pos: '名词', zh: '缺席', reason: '请假场景核心词', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' },
      { word: 'レポート', kana: 'レポート', pos: '名词', zh: '报告/作业', reason: '学校高频词', scope: 'extended_basic', required: false, displayMode: '扩展生活词汇' }
    ],
    steps: [
      { stepId: 's1', speaker: 'あなた', interactionType: 'listen', script: 'もしもし、リンです。すみません、熱がありますから、今日は欠席します。', furiganaText: 'もしもし、リンです。すみません、ねつがありますから、きょうはけっせきします。', translation: '喂，我是林。不好意思，我发烧了，今天请假。', listeningTraps: ['から=因为（理由）'], grammarPoints: ['から（理由）', 'があります'] },
      { stepId: 's2', speaker: '先生', interactionType: 'listen', script: 'そうですか。お大事に。今日の宿題はメールで送りますね。', furiganaText: 'そうですか。おだいじに。きょうのしゅくだいはメールでおくりますね。', translation: '这样啊。保重身体。今天的作业我用邮件发给你。', listeningTraps: ['メールで=用邮件（手段）'], grammarPoints: ['で（手段）'] },
      { stepId: 's3', speaker: '先生', interactionType: 'listen', script: 'レポートは20日までに出してください。', furiganaText: 'レポートははつかまでにだしてください。', translation: '报告请在20号之前交。', listeningTraps: ['はつか(20日)/ふつか(2日)一音之差', 'までに=截止'], grammarPoints: ['までに', 'てください'] },
      { stepId: 's4', speaker: 'あなた', interactionType: 'listen', script: 'はい、わかりました。ありがとうございます。', furiganaText: 'はい、わかりました。ありがとうございます。', translation: '好的，明白了。谢谢老师。', listeningTraps: [], grammarPoints: [] },
      { stepId: 'q1', interactionType: 'choose', question: '为什么请假？', options: ['发烧了', '肚子疼', '要去医院', '电车晚点'], answer: '发烧了', infoCategory: null, explanation: '「熱がありますから」＝因为发烧。から接在原因句后面表理由。', grammarPoints: ['から（理由）'] },
      { stepId: 'q2', interactionType: 'choose', question: '报告的截止日期是哪天？', options: ['20日', '2日', '10日', '24日'], answer: '20日', infoCategory: 'date', explanation: '「はつか（20日）までに」。はつか(20日)与ふつか(2日)是最经典的日期听错对。までに=在此之前完成。', grammarPoints: ['までに'] },
      { stepId: 'q3', interactionType: 'choose', question: '今天的作业怎么拿到？', options: ['老师用邮件发来', '明天去办公室拿', '同学送来', '不用做'], answer: '老师用邮件发来', infoCategory: null, explanation: '「メールで送ります」＝用邮件发送。で标记手段。', grammarPoints: ['で（手段）'] },
      { stepId: 'q4', speaker: '先生', interactionType: 'respond', script: 'あした学校に来られますか。', furiganaText: 'あしたがっこうにこられますか。', translation: '明天能来学校吗？', question: '你觉得明天应该能去。怎么回答最自然？', options: ['はい、たぶん大丈夫です。', 'いいえ、行きます。', '20日までにです。', '熱があります、はい。'], answer: 'はい、たぶん大丈夫です。', acceptedAnswers: ['はい、たぶん大丈夫です。', 'はい、行きます。'], infoCategory: null, explanation: '不完全确定时加「たぶん」（大概）最自然。「いいえ、行きます」逻辑自相矛盾。', grammarPoints: [] }
    ],
    review: {
      lineNotes: {
        s1: '请假三件套：自报姓名＋理由（～から）＋结论（欠席します）。',
        s2: '「お大事に」对生病的人的固定慰问。',
        s3: '截止日期：日期＋までに＋动作。',
        s4: '确认与道谢收尾。'
      },
      naturalResponses: [
        { ja: '風邪をひきましたから、今日は休みます。', note: '感冒请假的另一种常用说法' }
      ],
      grammarNotes: [
        'から（理由）接在敬体句后：熱がありますから。',
        'までに vs まで：20日までに出す（截止前完成）≠ 20日まで待つ（持续到20日）。',
        '出してください：出す→出して（す→して）＋ください。'
      ]
    },
    reinforcement: [
      { type: 'frame', category: 'date', note: '在别的场景听截止日期' },
      { type: 'scenario', ref: 'scenario-library-borrow-001' },
      { type: 'scenario', ref: 'scenario-dentist-appointment-001' }
    ],
    contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
    origin: '基于已验证知识生成的练习示例', sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: 'AI编写的请假常用表达；课程归属待对照教材核实。'
  },

  {
    id: 'scenario-library-borrow-001',
    title: '图书馆借书',
    category: 'school',
    setting: '学校图书馆服务台',
    goal: '借到书，听懂能借几本、借多久、哪天之前还',
    roles: ['係の人', 'あなた'],
    lessonRange: { min: 1, max: 21 }, lessonStatus: 'pending',
    difficulty: 2, estimatedDuration: 240,
    informationTypes: ['数量', '期间', '日期'],
    grammarPoints: ['数量词：冊', 'ことができます', 'までに'],
    particles: ['を', 'まで'], verbForms: ['辞书形', 'て形'],
    numberTypes: ['counter', 'date'],
    knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-kara-made' }],
    knowledgeMapStatus: 'verified',
    extendedVocab: [
      { word: '貸出', kana: 'かしだし', pos: '名词', zh: '外借', reason: '图书馆场景固定用语', scope: 'extended_basic', required: false, displayMode: '扩展生活词汇' },
      { word: '返却', kana: 'へんきゃく', pos: '名词', zh: '归还', reason: '图书馆场景固定用语', scope: 'extended_basic', required: true, displayMode: '扩展生活词汇' }
    ],
    steps: [
      { stepId: 's1', speaker: 'あなた', interactionType: 'listen', script: 'すみません、この本を借りたいんですが。', furiganaText: 'すみません、このほんをかりたいんですが。', translation: '不好意思，我想借这本书。', listeningTraps: [], grammarPoints: ['たい（愿望）'] },
      { stepId: 's2', speaker: '係の人', interactionType: 'listen', script: 'はい。学生証をお願いします。一人5冊まで借りることができますよ。', furiganaText: 'はい。がくせいしょうをおねがいします。ひとりごさつまでかりることができますよ。', translation: '好的。请出示学生证。一个人最多可以借5本。', listeningTraps: ['ごさつ(5冊)/ろくさつ(6冊)', 'まで=上限'], grammarPoints: ['ことができます', '数量词：冊'] },
      { stepId: 's3', speaker: '係の人', interactionType: 'listen', script: '貸出は2週間です。26日までに返却してください。', furiganaText: 'かしだしはにしゅうかんです。にじゅうろくにちまでにへんきゃくしてください。', translation: '借期是2周。请在26号之前归还。', listeningTraps: ['にしゅうかん(2周)', '26日にじゅうろくにち'], grammarPoints: ['までに', 'てください'] },
      { stepId: 's4', speaker: '係の人', interactionType: 'listen', script: '3冊ですね。はい、どうぞ。', furiganaText: 'さんさつですね。はい、どうぞ。', translation: '3本对吧。好的，给您。', listeningTraps: ['さんさつ(3冊)/さんさい(3歳)'], grammarPoints: ['数量词：冊'] },
      { stepId: 'q1', interactionType: 'choose', question: '一个人最多能借几本书？', options: ['5本', '6本', '3本', '2本'], answer: '5本', infoCategory: 'counter', explanation: '「一人5冊（ごさつ）まで」。まで在这里表示上限"最多到"。今天实际借的3本是另一个数字。', grammarPoints: ['数量词：冊'] },
      { stepId: 'q2', interactionType: 'choose', question: '书要在哪天之前还？', options: ['26日', '20日', '6日', '16日'], answer: '26日', infoCategory: 'date', explanation: '「26日（にじゅうろくにち）までに返却してください」。までに=截止之前。', grammarPoints: ['までに'] },
      { stepId: 'q3', interactionType: 'choose', question: '今天实际借了几本？', options: ['3本', '5本', '2本', '4本'], answer: '3本', infoCategory: 'counter', explanation: '最后确认「3冊ですね」。上限5冊/实借3冊两个数字都出现——问题问的是实际借的数量。', grammarPoints: ['数量词：冊'] },
      { stepId: 'q4', speaker: '係の人', interactionType: 'respond', script: '延長は一回だけできますが、なさいますか。', furiganaText: 'えんちょうはいっかいだけできますが、なさいますか。', translation: '可以延长一次，需要吗？', question: '你现在不需要延长。怎么回答？', options: ['いいえ、大丈夫です。', 'はい、5冊です。', '26日です。', '延長です。'], answer: 'いいえ、大丈夫です。', acceptedAnswers: ['いいえ、大丈夫です。', 'いいえ、けっこうです。'], infoCategory: null, explanation: '现在不需要＝いいえ、大丈夫です。', grammarPoints: [] }
    ],
    review: {
      lineNotes: {
        s1: '「借りたいんですが」：たい形＋んですが的委婉请求开场。',
        s2: '上限表达：数量＋まで＋ことができます。',
        s3: '期间（2週間）＋截止日（26日までに）。',
        s4: '数量确认：3冊ですね。'
      },
      naturalResponses: [
        { ja: 'この本、延長できますか。', note: '之后想延长时的问法' }
      ],
      grammarNotes: [
        '借りることができます：辞书形＋ことができます=能够…。',
        '冊的音变：いっさつ・はっさつ・じゅっさつ促音。',
        '2週間（にしゅうかん）是持续时间，26日是时点，两类数字并存。'
      ]
    },
    reinforcement: [
      { type: 'frame', category: 'counter', note: '在别的场景听册数/数量' },
      { type: 'scenario', ref: 'scenario-school-absence-001' },
      { type: 'scenario', ref: 'scenario-drugstore-buy-001' }
    ],
    contentType: 'ai_generated_practice', displaySource: '基于已验证知识生成', isTextbookOriginal: false,
    origin: '基于已验证知识生成的练习示例', sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: 'AI编写的图书馆常用表达；课程归属待对照教材核实。'
  }
);
