/* =========================================================================
 * 语法题库 —— 待审核区（pending-review）
 *
 * 状态说明：
 *  - 每题的日语句子为 AI 基于常见初级语法编写的自然情景句，
 *    属于"基于已验证知识生成的练习示例"，不是教材原文。
 *  - 每题声明的课程归属（lesson 字段）是"待核实演示数据"：
 *    未经用户对照《大家的日语》实体教材确认前，sourceStatus 一律
 *    为 'pending'，不进入正式训练模式。
 *  - 在"数据审核"页逐题核实课程归属后，可将该题提升为 verified
 *    （提升记录保存在 localStorage，原始文件保持 pending 不变）。
 *  - knowledgeMap 指向本仓库 index.html（Japanese Cognitive Atlas）中
 *    真实存在的知识图谱节点 id，映射本身已对照图谱数据核实。
 * ========================================================================= */
window.MJT_DATA = window.MJT_DATA || {};

window.MJT_DATA.pendingGrammar = [
  {
    id: 'g-pending-001',
    type: 'particle-choice',
    question: '図書館（　）本を読みます。',
    questionKana: 'としょかん（　）ほんをよみます。',
    options: ['で', 'に', 'を', 'へ'],
    answer: 'で',
    translation: '在图书馆读书。',
    explanation: '句子意思是"在图书馆读书"。読みます（原形：読む，五段动词，ます形：読み+ます）是一个动作，动作展开的场所用「で」标记；「に」标记存在落点或到达点（図書館にいます／図書館に行きます），不用于动作场所。「本を」中的「を」标记动作对象。',
    wrongAnswerReasons: {
      'に': '「に」标记存在落点（います/あります）或到达点（行きます），読みます是动作，动作场所用で。',
      'を': '「を」标记动作直接对象，本句对象是「本」，已由「本を」占据。',
      'へ': '「へ」标记移动方向，読みます不是移动动词。'
    },
    lesson: [6], difficulty: 1,
    grammarPoints: ['场所+で+动作动词', 'を宾语'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写；课程归属待对照教材核实。',
    knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-de' }],
    knowledgeMapStatus: 'verified'
  },
  {
    id: 'g-pending-002',
    type: 'particle-choice',
    question: '机の上（　）猫がいます。',
    questionKana: 'つくえのうえ（　）ねこがいます。',
    options: ['に', 'で', 'を', 'と'],
    answer: 'に',
    translation: '桌子上有一只猫。',
    explanation: '存在句「～がいます」表示"有/在"，存在的落点用「に」标记。「で」标记动作展开的场，而います表示静态存在而非动作，所以不用で。「猫が」的「が」引入新信息（第一次提到的猫）。',
    wrongAnswerReasons: {
      'で': '存在句（います/あります）的场所用に不用で；で用于动作句（図書館で勉強します）。',
      'を': 'を标记动作对象，存在句没有动作对象。',
      'と': 'と表示共同动作者或并列，与场所无关。'
    },
    lesson: [10], difficulty: 1,
    grammarPoints: ['场所+に+います/あります', 'が新信息'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写；课程归属待对照教材核实。',
    knowledgeMap: [
      { module: 'core-grammar', section: '格助词', node: 'cg-p-ni' },
      { module: 'lang-cognition', section: '助词', node: 'lc-ga-newinfo' }
    ],
    knowledgeMapStatus: 'verified'
  },
  {
    id: 'g-pending-003',
    type: 'verb-conjugation',
    question: '「書く」的て形是哪一个？',
    questionKana: '「かく」',
    options: ['書いて', '書って', '書きて', '書んで'],
    answer: '書いて',
    translation: '写（て形）',
    explanation: '書く（かく）是五段动词，词尾く。五段动词て形音便分组：く→いて（書く→書いて）。「書きて」是没有音便的错误形，「書って」误用了う/つ/る组的促音便，「書んで」误用了ぬ/ぶ/む组的拨音便。注意：行く→行って是く组唯一例外。',
    wrongAnswerReasons: {
      '書って': '促音便って用于う/つ/る结尾的五段动词（買う→買って），書く词尾是く。',
      '書きて': '连用形+て不经音便是古典形式，现代日语く结尾必须音便为いて。',
      '書んで': 'んで用于ぬ/ぶ/む结尾（飲む→飲んで），書く词尾是く。'
    },
    lesson: [14], difficulty: 2,
    grammarPoints: ['て形音便：く→いて', '五段动词'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写；课程归属待对照教材核实。',
    knowledgeMap: [{ module: 'core-grammar', section: '动词变形', node: 'cg-te-form-formation' }],
    knowledgeMapStatus: 'verified'
  },
  {
    id: 'g-pending-004',
    type: 'verb-conjugation',
    question: '「飲む」的て形是哪一个？',
    questionKana: '「のむ」',
    options: ['飲んで', '飲いて', '飲みて', '飲って'],
    answer: '飲んで',
    translation: '喝（て形）',
    explanation: '飲む（のむ）是五段动词，词尾む。五段动词て形音便分组：ぬ/ぶ/む→んで（飲む→飲んで）。同组例子：読む→読んで、遊ぶ→遊んで、死ぬ→死んで。',
    wrongAnswerReasons: {
      '飲いて': 'いて用于く结尾（書く→書いて），飲む词尾是む。',
      '飲みて': '现代日语必须音便，飲みて是未经音便的错误形。',
      '飲って': 'って用于う/つ/る结尾（待つ→待って），飲む词尾是む。'
    },
    lesson: [14], difficulty: 2,
    grammarPoints: ['て形音便：む→んで', '五段动词'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写；课程归属待对照教材核实。',
    knowledgeMap: [{ module: 'core-grammar', section: '动词变形', node: 'cg-te-form-formation' }],
    knowledgeMapStatus: 'verified'
  },
  {
    id: 'g-pending-005',
    type: 'verb-conjugation',
    question: '「食べる」的ない形是哪一个？',
    questionKana: '「たべる」',
    options: ['食べない', '食べらない', '食べりない', '食べあない'],
    answer: '食べない',
    translation: '不吃（ない形）',
    explanation: '食べる（たべる）是一段动词（る前是e段音べ）。一段动词ない形：去る+ない → 食べない。「食べらない」是把一段动词误按五段活用的典型错误。五段动词才把词尾变a段（飲む→飲まない）。',
    wrongAnswerReasons: {
      '食べらない': '把一段动词按五段活用是典型错误；一段动词直接去る加ない。',
      '食べりない': '不存在的变形。',
      '食べあない': '不存在的变形；う结尾五段动词才变わ（買う→買わない）。'
    },
    lesson: [17], difficulty: 2,
    grammarPoints: ['ない形', '一段动词'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写；课程归属待对照教材核实。',
    knowledgeMap: [
      { module: 'core-grammar', section: '动词变形', node: 'cg-nai-form' },
      { module: 'core-grammar', section: '动词分类', node: 'cg-verb-groups' }
    ],
    knowledgeMapStatus: 'verified'
  },
  {
    id: 'g-pending-006',
    type: 'choice',
    question: '朝ごはんを食べ（　）、学校へ行きます。',
    questionKana: 'あさごはんをたべ（　）、がっこうへいきます。',
    options: ['てから', 'ながら', 'たり', 'ても'],
    answer: 'てから',
    translation: '吃完早饭之后去学校。',
    explanation: '「てから」表示前一动作完成之后进行后一动作（先吃早饭，再去学校）。食べる→て形食べて＋から。「ながら」要求两个动作同时进行且同主体，吃饭和去学校不同时；「たり」是例举（做做这个做做那个），句尾需要する；「ても」是让步（即使……也）。',
    wrongAnswerReasons: {
      'ながら': 'ながら表示同时进行两个动作，本句是先后顺序。',
      'たり': 'たり例举需要「～たり～たりします」结构，本句不是例举。',
      'ても': 'ても表示让步"即使吃了早饭也去学校"，语义不通。'
    },
    lesson: [16], difficulty: 2,
    grammarPoints: ['てから', 'て形'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写；课程归属待对照教材核实。',
    knowledgeMap: [{ module: 'lang-cognition', section: '连接', node: 'lc-te-interface' }],
    knowledgeMapStatus: 'verified'
  },
  {
    id: 'g-pending-007',
    type: 'choice',
    question: 'ここで写真を撮っ（　）いいですか。',
    questionKana: 'ここでしゃしんをとっ（　）いいですか。',
    options: ['ても', 'ては', 'たら', 'てから'],
    answer: 'ても',
    translation: '可以在这里拍照吗？',
    explanation: '「てもいいですか」是请求许可的固定句型（做了也可以吗）。撮る（とる，五段动词）→て形撮って＋も＋いいですか。「てはいけません」表示禁止，正好相反；「たら」是条件；「てから」表示动作先后。回答许可用「はい、いいですよ」，拒绝用「すみません、ちょっと…」等缓和表达。',
    wrongAnswerReasons: {
      'ては': '「てはいけません」是禁止句型，与请求许可相反。',
      'たら': '撮ったらいいですか是"拍了之后怎么办好"的语感，不是请求许可。',
      'てから': 'てから表示动作先后顺序，语义不通。'
    },
    lesson: [15], difficulty: 2,
    grammarPoints: ['てもいいですか（许可）', 'て形'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写；课程归属待对照教材核实。',
    knowledgeMap: [{ module: 'core-grammar', section: '许可与禁止', node: 'cg-pol-temoii' }],
    knowledgeMapStatus: 'verified'
  },
  {
    id: 'g-pending-008',
    type: 'choice',
    question: '窓を開け（　）ください。暑いですから。',
    questionKana: 'まどをあけ（　）ください。あついですから。',
    options: ['て', 'ないで', 'たり', 'ば'],
    answer: 'て',
    translation: '请打开窗户。因为很热。',
    explanation: '「てください」是标准请求句型。開ける（あける，一段动词）→て形開けて＋ください。后句「暑いですから」用から给出请求的理由（因为热，所以要开窗）。「ないでください」是否定请求（请不要开），与理由矛盾。',
    wrongAnswerReasons: {
      'ないで': '「開けないでください」意为"请不要开窗"，与"因为很热"的理由矛盾。',
      'たり': 'たり是例举，不能直接接ください。',
      'ば': 'ば是条件形，不能接ください。'
    },
    lesson: [14], difficulty: 1,
    grammarPoints: ['てください（请求）', 'から（理由）'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写；课程归属待对照教材核实。',
    knowledgeMap: [
      { module: 'core-grammar', section: '请求', node: 'cg-pol-kudasai' },
      { module: 'core-grammar', section: '接续', node: 'cg-c-reason' }
    ],
    knowledgeMapStatus: 'verified'
  },
  {
    id: 'g-pending-009',
    type: 'adjective-conjugation',
    question: '昨日の映画は（　）です。',
    questionKana: 'きのうのえいがは（　）です。',
    options: ['おもしろかった', 'おもしろいでした', 'おもしろかったでした', 'おもしろいだった'],
    answer: 'おもしろかった',
    translation: '昨天的电影很有意思。',
    explanation: 'おもしろい是い形容词。い形容词自带谓语活用，过去时由形容词本体变形承担：おもしろい→おもしろかった，敬体在其后加です→おもしろかったです。「おもしろいでした」把时体交给です是典型错误；い形容词永远不接だ/だった。',
    wrongAnswerReasons: {
      'おもしろいでした': 'い形容词的过去时必须由本体变形（かった）承担，不能用でした。',
      'おもしろかったでした': '时体重复标记，かった已表过去，でした多余且错误。',
      'おもしろいだった': 'い形容词不接だ/だった，这是な形容词的活用范式。'
    },
    lesson: [12], difficulty: 2,
    grammarPoints: ['い形容词过去时', '～かったです'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写；课程归属待对照教材核实。',
    knowledgeMap: [{ module: 'core-grammar', section: '形容词', node: 'cg-i-adj-pred' }],
    knowledgeMapStatus: 'verified'
  },
  {
    id: 'g-pending-010',
    type: 'choice',
    question: '東京は大阪（　）人が多いです。',
    questionKana: 'とうきょうはおおさか（　）ひとがおおいです。',
    options: ['より', 'ほど', 'では', 'にも'],
    answer: 'より',
    translation: '东京比大阪人多。',
    explanation: '「AはBより＋性质」是比较句型，より标记比较的基准点（大阪是基准，东京人更多）。日语形容词没有"更"的词形变化，比较关系完全由より表达。「ほど」用于否定比较（AはBほど～ない）。',
    wrongAnswerReasons: {
      'ほど': 'ほど用于否定比较「大阪ほど多くない」，本句是肯定句。',
      'では': 'では表示范围或话题，不构成比较。',
      'にも': 'にも是"在……也"，不构成比较。'
    },
    lesson: [12], difficulty: 1,
    grammarPoints: ['比较：AはBより', 'より基准'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写；课程归属待对照教材核实。',
    knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-yori' }],
    knowledgeMapStatus: 'verified'
  },
  {
    id: 'g-pending-011',
    type: 'plain-polite',
    question: '「行きます」的普通体（简体）现在肯定形是哪一个？',
    questionKana: '「いきます」',
    options: ['行く', '行った', '行かない', '行いて'],
    answer: '行く',
    translation: '去（辞书形/普通体现在肯定）',
    explanation: '敬体「行きます」对应的普通体现在肯定形是辞书形「行く」。行く是五段动词。敬体与普通体的对应：行きます↔行く、行きました↔行った、行きません↔行かない、行きませんでした↔行かなかった。',
    wrongAnswerReasons: {
      '行った': '行った是普通体过去肯定（对应行きました）。',
      '行かない': '行かない是普通体现在否定（对应行きません）。',
      '行いて': '不存在的形；行く的て形是例外的行って。'
    },
    lesson: [20], difficulty: 2,
    grammarPoints: ['敬体与简体转换', '辞书形'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写；课程归属待对照教材核实。',
    knowledgeMap: [
      { module: 'core-grammar', section: '敬体', node: 'cg-masu-form' },
      { module: 'core-grammar', section: '简体', node: 'cg-ta-form' }
    ],
    knowledgeMapStatus: 'verified'
  },
  {
    id: 'g-pending-012',
    type: 'error-correction',
    question: '找出错误：「あした、映画を見ました。」',
    questionKana: '「あした、えいがをみました。」',
    options: ['見ました应改为見ます', 'あした应改为きのう也可以', 'を应改为が', '映画应改为映像'],
    answer: '見ました应改为見ます',
    translation: '（改正后）明天看电影。',
    explanation: '「あした（明天）」是未来时间词，谓语却用了过去形「見ました」，时制矛盾。改法有两种：把谓语改为非过去形「見ます」（明天看电影），或把时间词改为过去（きのう…見ました）。以保留「あした」为前提，正确答案是改谓语。日语谓语的时制由词尾活用强制表达，不能像中文一样省略。',
    wrongAnswerReasons: {
      'あした应改为きのう也可以': '这样改语法上成立，但题目要求以保留原句时间词为前提修改谓语。',
      'を应改为が': '見る是他动词，对象用を标记，原句を正确。',
      '映画应改为映像': '映画（电影）用词自然正确。'
    },
    lesson: [4], difficulty: 2,
    grammarPoints: ['时制一致', 'ます/ました'],
    origin: '待核实演示数据',
    sourceStatus: 'pending', sourceType: 'manual_review', reviewed: false,
    sourceReference: 'AI基于常见初级语法编写；课程归属待对照教材核实。',
    knowledgeMap: [
      { module: 'core-grammar', section: '敬体活用', node: 'cg-masu-form' },
      { module: 'lang-cognition', section: '活用', node: 'lc-verb-engine' }
    ],
    knowledgeMapStatus: 'verified'
  }
];
