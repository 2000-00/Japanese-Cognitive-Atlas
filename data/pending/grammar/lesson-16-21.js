/* 语法题扩充 —— 声明课程段：第16～21课（待审核区）
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
      id: 'g2-1801', questionType: '单项选择', scenarioContext: '自我介绍：会开车',
      question: 'わたしは車を運転する（　）ができます。', questionKana: 'わたしはくるまをうんてんする（　）ができます。',
      options: ['こと', 'の', 'もの', 'とき'], answer: 'こと',
      translation: '我会开车。',
      explanation: '能力句型：辞书形＋ことができます。する是辞书形，こと把动词名词化。',
      wrongAnswerReasons: { 'の': 'のができます不是标准句型。', 'もの': 'もの指具体东西。', 'とき': 'とき是"……的时候"。' },
      grammarPoints: ['ことができます', '辞书形'], particles: ['が'], verbForms: ['辞书形'], lesson: [18], difficulty: 1,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    G({
      id: 'g2-1802', questionType: '单项选择', scenarioContext: '兴趣自我介绍',
      question: 'わたしの趣味は写真を（　）ことです。', questionKana: 'わたしのしゅみはしゃしんを（　）ことです。',
      options: ['撮る', '撮ります', '撮って', '撮った'], answer: '撮る',
      translation: '我的爱好是拍照。',
      explanation: '趣味は～ことです中间用辞书形：撮ることです。こと前必须是简体形。',
      wrongAnswerReasons: { '撮ります': 'こと前不能用ます形。', '撮って': 'て形不能直接接こと。', '撮った': '撮ったこと用于经历（たことがあります），爱好用辞书形。' },
      grammarPoints: ['趣味は～ことです', '辞书形'], particles: ['を'], verbForms: ['辞书形'], lesson: [18], difficulty: 2,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    G({
      id: 'g2-1803', questionType: '动词变形', scenarioContext: '旅行聊天：有没有去过北海道',
      question: '北海道へ（　）ことがありますか。', questionKana: 'ほっかいどうへ（　）ことがありますか。',
      options: ['行った', '行く', '行って', '行きます'], answer: '行った',
      translation: '去过北海道吗？',
      explanation: '经历句型：た形＋ことがあります（有过……的经历）。行く→行った（く组例外促音便）。',
      wrongAnswerReasons: { '行く': '行くことがあります是"有时会去"，不是经历。', '行って': 'て形不接ことがあります。', '行きます': 'ます形不能接こと。' },
      grammarPoints: ['たことがあります', 'た形'], particles: ['へ'], verbForms: ['た形'], lesson: [19], difficulty: 2,
      knowledgeMap: KM('cg-a-takoto', '经历'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1804', questionType: '单项选择', scenarioContext: '介绍周末：又看电影又逛街',
      question: '週末は映画を見（　）、買い物をし（　）します。', questionKana: 'しゅうまつはえいがをみ（　）、かいものをし（　）します。',
      options: ['たり／たり', 'て／て', 'たら／たら', 'ながら／ながら'], answer: 'たり／たり',
      translation: '周末看看电影、购购物。',
      explanation: '例举句型：た形＋り，句尾＋します：見たり、買い物をしたりします（暗示还做别的）。',
      wrongAnswerReasons: { 'て／て': 'て形动作链表示先后全部列出，不是例举。', 'たら／たら': 'たら是条件形。', 'ながら／ながら': 'ながら是同时进行且句型不同。' },
      grammarPoints: ['たり～たりします'], particles: ['を'], verbForms: ['た形'], lesson: [19], difficulty: 2,
      knowledgeMap: KM('cg-c-tari', '接续'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1805', questionType: '单项选择', scenarioContext: '天气变化：变暖和了',
      question: '春になって、暖かく（　）。', questionKana: 'はるになって、あたたかく（　）。',
      options: ['なりました', 'しました', 'ありました', 'いました'], answer: 'なりました',
      translation: '到了春天，变暖和了。',
      explanation: '变化句型：い形容词词干＋く＋なります（暖かい→暖かくなる）。なる=自然变化。',
      wrongAnswerReasons: { 'しました': 'く+します是"人为弄暖"，天气变化用なります。', 'ありました': 'あります是存在。', 'いました': 'います是有生命存在。' },
      grammarPoints: ['なります（变化）'], particles: ['に'], verbForms: [], lesson: [19], difficulty: 2,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    G({
      id: 'g2-1806', questionType: '简体与敬体转换', scenarioContext: '把和朋友的对话改成简体日记',
      question: '「きのう映画を見ました」的简体是？',
      options: ['きのう映画を見た', 'きのう映画を見たました', 'きのう映画を見るした', 'きのう映画を見ますた'], answer: 'きのう映画を見た',
      translation: '昨天看了电影。（简体）',
      explanation: '見ました（敬体过去）→簡体过去＝た形：見た。見る是一段动词，去る＋た。',
      wrongAnswerReasons: { 'きのう映画を見たました': 'た和ました重复。', 'きのう映画を見るした': '不存在的形式。', 'きのう映画を見ますた': '不存在的形式。' },
      grammarPoints: ['简体', 'た形'], particles: ['を'], verbForms: ['た形'], lesson: [20], difficulty: 1,
      knowledgeMap: KM('cg-ta-form', '动词变形'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1807', questionType: '简体与敬体转换', scenarioContext: '朋友之间的简体对话',
      question: '朋友问「あした暇？」，简体的否定回答是？',
      options: ['ううん、暇じゃない。', 'いいえ、暇ではありません。', 'ううん、暇くない。', 'ううん、暇じゃありません。'], answer: 'ううん、暇じゃない。',
      translation: '不，没空。（简体）',
      explanation: '簡体对话中：否定应答用ううん，暇（な形容词）的简体否定＝暇じゃない。',
      wrongAnswerReasons: { 'いいえ、暇ではありません。': '语法对但这是敬体，与简体对话不匹配。', 'ううん、暇くない。': '暇不是い形容词，不能用くない。', 'ううん、暇じゃありません。': 'じゃありません是敬体。' },
      grammarPoints: ['简体', 'な形容词否定'], particles: [], verbForms: [], lesson: [20], difficulty: 2,
      knowledgeMap: KM('cg-na-adj-pred', '形容词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1808', questionType: '单项选择', scenarioContext: '和朋友聊明天的天气',
      question: 'あしたは雨が降る（　）思います。', questionKana: 'あしたはあめがふる（　）おもいます。',
      options: ['と', 'を', 'が', 'に'], answer: 'と',
      translation: '我觉得明天会下雨。',
      explanation: '想法引用：简体句＋と思います。降る是辞书形（简体），と标记引用内容。',
      wrongAnswerReasons: { 'を': '思います的内容用と不用を。', 'が': 'が不标记引用。', 'に': 'に不标记引用。' },
      grammarPoints: ['と思います', '简体'], particles: ['と'], verbForms: ['辞书形'], lesson: [21], difficulty: 1,
      knowledgeMap: KM('cg-p-to', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1809', questionType: '正误判断', scenarioContext: '转述老师的话',
      question: '「先生は『あした試験があります』と言いました。」对吗？',
      options: ['对', '错，と应改为を', '错，言いました应改为思いました', '错，必须去掉『』'], answer: '对',
      translation: '老师说"明天有考试"。',
      explanation: '直接引用：「引用内容」＋と言いました。と标记引用，言う表示说话。句子完全正确。',
      wrongAnswerReasons: { '错，と应改为を': '引用一律用と。', '错，言いました应改为思いました': '转述别人说的话用言う，思う是自己的想法。', '错，必须去掉『』': '直接引用可以带引号。' },
      grammarPoints: ['と言います'], particles: ['と'], verbForms: [], lesson: [21], difficulty: 1,
      knowledgeMap: KM('cg-p-to', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1810', questionType: '单项选择', scenarioContext: '关心朋友：脸色不太好',
      question: '顔色がよくないですね。今日は早く（　）ほうがいいですよ。', questionKana: 'かおいろがよくないですね。きょうははやく（　）ほうがいいですよ。',
      options: ['帰った', '帰る', '帰って', '帰り'], answer: '帰った',
      translation: '脸色不太好啊。今天早点回去比较好哦。',
      explanation: '建议句型：た形＋ほうがいいです（做……比较好）。帰る（五段·伪一段）→帰った。',
      wrongAnswerReasons: { '帰る': '肯定建议用た形+ほうがいい（否定才用ない形：帰らないほうがいい）。', '帰って': 'て形不接ほうがいい。', '帰り': 'ます形词干不接ほうがいい。' },
      grammarPoints: ['たほうがいいです', 'た形'], particles: [], verbForms: ['た形'], lesson: [19, 21], difficulty: 2,
      knowledgeMap: KM('cg-ta-form', '动词变形'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1811', questionType: '动词变形', scenarioContext: '写简体日记：昨天喝了咖啡',
      question: '「飲みます」的た形（简体过去）是？',
      options: ['飲んだ', '飲みた', '飲った', '飲いだ'], answer: '飲んだ',
      translation: '喝了。',
      explanation: 'た形与て形共用音便：飲む→飲んで→飲んだ（む→んだ拨音便）。',
      wrongAnswerReasons: { '飲みた': '未经音便。', '飲った': 'った用于う/つ/る结尾。', '飲いだ': 'いだ用于ぐ结尾（泳ぐ→泳いだ）。' },
      grammarPoints: ['た形音便'], particles: [], verbForms: ['た形'], lesson: [19], difficulty: 1,
      knowledgeMap: KM('cg-ta-form', '动词变形'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1812', questionType: '情景选句', scenarioContext: '打工面试：说明自己会说的语言',
      question: '想说"我会说英语和一点日语"，最自然的是？',
      options: ['英語と日本語が少し話せます。', '英語と日本語を少しできます。', '英語と日本語が少しあります。', '英語と日本語は少し話しています。'], answer: '英語と日本語が少し話せます。',
      translation: '会说英语和一点日语。',
      explanation: '能力表达：話せます（話す的可能形）或「日本語ができます」。对象用が。',
      wrongAnswerReasons: { '英語と日本語を少しできます。': 'できます的对象用が不用を。', '英語と日本語が少しあります。': 'あります是存在不是能力。', '英語と日本語は少し話しています。': 'ています是"正在说"。' },
      grammarPoints: ['ことができます/可能'], particles: ['が'], verbForms: [], lesson: [18], difficulty: 2,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    G({
      id: 'g2-1813', questionType: '单项选择', scenarioContext: '车站广播：电车马上来，提醒不要跑',
      question: '危ないですから、（　）ないでください。', questionKana: 'あぶないですから、（　）ないでください。',
      options: ['走ら', '走り', '走れ', '走っ'], answer: '走ら',
      translation: '很危险，请不要跑。',
      explanation: '走る（五段·伪一段）的未然形是走ら：走らない→走らないでください。',
      wrongAnswerReasons: { '走り': '走り是连用形（ます形词干）。', '走れ': '走れ是命令形/可能形词干。', '走っ': '走っ是音便形（走って）。' },
      grammarPoints: ['ないでください', 'ない形', '伪一段动词'], particles: [], verbForms: ['ない形'], lesson: [17], difficulty: 2,
      knowledgeMap: KM('cg-verb-groups', '动词分类'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1814', questionType: '句子排序', scenarioContext: '组一句"我觉得日语考试不难"',
      question: '排序：①難しくない ②日本語の試験は ③と思います',
      options: ['②①③', '①②③', '②③①', '③②①'], answer: '②①③',
      translation: '我觉得日语考试不难。',
      explanation: '语序：话题（試験は）＋简体判断（難しくない）＋と思います。引用内容必须是简体。',
      wrongAnswerReasons: { '①②③': '把谓语放话题前不自然。', '②③①': 'と思います后不能再接内容。', '③②①': 'と思います不能开头。' },
      grammarPoints: ['と思います', '简体'], particles: ['は', 'と'], verbForms: [], lesson: [21], difficulty: 2,
      knowledgeMap: KM('cg-p-to', '格助词'), knowledgeMapStatus: 'verified'
    }),
    G({
      id: 'g2-1815', questionType: '改错', scenarioContext: '检查朋友的作文：爱好',
      question: '「趣味は本を読みますことです。」错在哪里？',
      options: ['読みます应改为読む', 'は应改为が', 'こと应改为の', '没有错'], answer: '読みます应改为読む',
      translation: '（改正后）爱好是读书。',
      explanation: 'こと前必须用简体（辞书形）：読むことです。ます形是敬体形式，不能修饰こと。',
      wrongAnswerReasons: { 'は应改为が': '趣味是话题，は正确。', 'こと应改为の': '趣味は～ことです是固定句型。', '没有错': 'ますこと是明显错误。' },
      grammarPoints: ['趣味は～ことです', '辞书形'], particles: ['を'], verbForms: ['辞书形'], lesson: [18], difficulty: 2,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    })
  );
})();
