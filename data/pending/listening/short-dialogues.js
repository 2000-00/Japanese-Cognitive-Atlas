/* 听力 Level 5 —— 短对话（2～4轮，≥2个信息点）（待审核区）
 * AI 编写的自然情景对话（非教材原文），课程归属待核实。
 * 核实通过后进入正式听力训练的 Level 5。 */
window.MJT_DATA = window.MJT_DATA || {};
window.MJT_DATA.pendingListening = window.MJT_DATA.pendingListening || [];

(function () {
  function L(q) {
    q.type = q.type || 'short-dialog'; q.level = q.level || 5; // 广播类条目自带 level:4 / type:'announcement'
    q.module = 'listening'; q.format = 'audio-choice';
    q.audioUrl = '';
    q.lessonStatus = 'pending';
    q.contentType = 'ai_generated_practice'; q.displaySource = '基于已验证知识生成';
    q.isTextbookOriginal = false; q.origin = '待核实演示数据';
    q.sourceStatus = 'pending'; q.sourceType = 'manual_review'; q.reviewed = false;
    q.sourceReference = 'AI编写的情景对话；课程归属待对照教材核实。';
    if (!q.knowledgeMap) { q.knowledgeMap = []; q.knowledgeMapStatus = 'pending'; }
    return q;
  }

  window.MJT_DATA.pendingListening.push(
    L({
      id: 'l5-001', scenarioId: 'scene-hotel-checkin', sceneName: '酒店入住', infoCount: 2,
      audioScript: 'チェックインをお願いします。かしこまりました。お部屋は302号室です。朝ごはんは7時から9時までです。',
      scriptJa: '「チェックインをお願いします。」「かしこまりました。お部屋は302号室です。朝ごはんは7時から9時までです。」',
      scriptKana: '「チェックインをおねがいします。」「かしこまりました。おへやはさんまるにごうしつです。あさごはんはしちじからくじまでです。」',
      question: '【酒店入住】房间号和早餐开始时间分别是？',
      options: ['302室・7点', '203室・7点', '302室・9点', '304室・8点'],
      answer: '302室・7点',
      translation: '"我要办理入住。""好的。您的房间是302室。早餐从7点到9点。"',
      explanation: '房间号逐位读さんまるに=302（0读まる）；「7時から」=早餐7点开始，9時まで是结束时间。两个信息都要抓：房间号+起始时间。',
      lesson: [4], grammarPoints: ['から～まで', '号码读法'], difficulty: 2,
      knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-kara-made' }], knowledgeMapStatus: 'verified'
    }),
    L({
      id: 'l5-002', scenarioId: 'scene-friend-plan', sceneName: '约朋友吃饭', infoCount: 2,
      audioScript: 'あした、一緒に晩ごはんを食べませんか。いいですね。何時にしますか。6時半はどうですか。じゃ、駅の北口で会いましょう。',
      scriptJa: '「あした、一緒に晩ごはんを食べませんか。」「いいですね。何時にしますか。」「6時半はどうですか。」「じゃ、駅の北口で会いましょう。」',
      scriptKana: '「あした、いっしょにばんごはんをたべませんか。」「いいですね。なんじにしますか。」「ろくじはんはどうですか。」「じゃ、えきのきたぐちであいましょう。」',
      question: '【约朋友】两人几点、在哪里见面？',
      options: ['6点半・车站北口', '6点・车站南口', '6点半・车站南口', '7点半・车站北口'],
      answer: '6点半・车站北口',
      translation: '"明天一起吃晚饭吗？""好啊。定几点？""6点半怎么样？""那在车站北口见吧。"',
      explanation: '「ろくじはん」=6点半；「北口（きたぐち）」=北口。时间和地点分散在两轮对话里，都要记住。',
      lesson: [6], grammarPoints: ['ませんか', 'ましょう', 'で（场所）'], difficulty: 2,
      knowledgeMap: [{ module: 'core-grammar', section: '劝诱', node: 'cg-pol-mashou' }], knowledgeMapStatus: 'verified'
    }),
    L({
      id: 'l5-003', scenarioId: 'scene-post-office', sceneName: '邮局寄信', infoCount: 2,
      audioScript: 'この手紙を中国までお願いします。航空便ですね。110円です。何日ぐらいかかりますか。一週間ぐらいです。',
      scriptJa: '「この手紙を中国までお願いします。」「航空便ですね。110円です。」「何日ぐらいかかりますか。」「一週間ぐらいです。」',
      scriptKana: '「このてがみをちゅうごくまでおねがいします。」「こうくうびんですね。ひゃくじゅうえんです。」「なんにちぐらいかかりますか。」「いっしゅうかんぐらいです。」',
      question: '【邮局】邮费多少钱？大约几天到？',
      options: ['110円・约1周', '110円・约1天', '100円・约1周', '190円・约2周'],
      answer: '110円・约1周',
      translation: '"这封信寄到中国。""航空信是吧，110日元。""大约要几天？""一周左右。"',
      explanation: '「ひゃくじゅうえん」=110円；「いっしゅうかん」=1周。いっしゅうかん（1周）与いちにち（1天）不要混。',
      lesson: [11], grammarPoints: ['まで', 'かかります'], difficulty: 2,
      knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-kara-made' }], knowledgeMapStatus: 'verified'
    }),
    L({
      id: 'l5-004', scenarioId: 'scene-taxi', sceneName: '坐出租车', infoCount: 2,
      audioScript: 'すみません、さくらホテルまでお願いします。はい。20分ぐらいかかりますよ。……着きました。1,400円です。',
      scriptJa: '「すみません、さくらホテルまでお願いします。」「はい。20分ぐらいかかりますよ。」「……着きました。1,400円です。」',
      scriptKana: '「すみません、さくらホテルまでおねがいします。」「はい。にじゅっぷんぐらいかかりますよ。」「……つきました。せんよんひゃくえんです。」',
      question: '【出租车】路程用了大约多久？车费是多少？',
      options: ['约20分钟・1,400円', '约20分钟・4,100円', '约10分钟・1,400円', '约12分钟・1,900円'],
      answer: '约20分钟・1,400円',
      translation: '"麻烦到樱花酒店。""好的，大约20分钟。""……到了。1400日元。"',
      explanation: '「にじゅっぷん」=20分钟（じゅっぷん促音）；「せんよんひゃく」=1400（せん无いち前缀）。',
      lesson: [11], grammarPoints: ['まで', 'かかります'], difficulty: 2,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    L({
      id: 'l5-005', scenarioId: 'scene-cinema', sceneName: '电影院买票', infoCount: 3,
      audioScript: '次の映画は何時からですか。3時50分からです。大人2枚お願いします。3,600円です。',
      scriptJa: '「次の映画は何時からですか。」「3時50分からです。」「大人2枚お願いします。」「3,600円です。」',
      scriptKana: '「つぎのえいがはなんじからですか。」「さんじごじゅっぷんからです。」「おとなにまいおねがいします。」「さんぜんろっぴゃくえんです。」',
      question: '【电影院】电影几点开始？买了几张票？',
      options: ['3:50・2张', '3:15・2张', '3:50・3张', '5:30・2张'],
      answer: '3:50・2张',
      translation: '"下一场电影几点开始？""3点50分。""两张成人票。""3600日元。"',
      explanation: '「さんじごじゅっぷん」=3:50（ごじゅっぷん50分，不是じゅうごふん15分）；「にまい」=2张。3:15是把50分听成15分的典型错误。',
      lesson: [11], grammarPoints: ['から', '数量词：枚'], difficulty: 3,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    L({
      id: 'l5-006', scenarioId: 'scene-lost-item', sceneName: '车站失物询问', infoCount: 2,
      audioScript: 'すみません、電車にかばんを忘れました。何時の電車ですか。10時40分の電車です。何色のかばんですか。黒いかばんです。',
      scriptJa: '「すみません、電車にかばんを忘れました。」「何時の電車ですか。」「10時40分の電車です。」「何色のかばんですか。」「黒いかばんです。」',
      scriptKana: '「すみません、でんしゃにかばんをわすれました。」「なんじのでんしゃですか。」「じゅうじよんじゅっぷんのでんしゃです。」「なんいろのかばんですか。」「くろいかばんです。」',
      question: '【失物】乘客坐的是几点的电车？包是什么颜色？',
      options: ['10:40・黑色', '10:14・黑色', '10:40・白色', '4:10・黑色'],
      answer: '10:40・黑色',
      translation: '"不好意思，我把包忘在电车上了。""几点的电车？""10点40分的。""什么颜色的包？""黑色的包。"',
      explanation: '「よんじゅっぷん」=40分（与14分じゅうよんぷん易混）；「くろい」=黑色。',
      lesson: [8], grammarPoints: ['时间表达', 'い形容词'], difficulty: 3,
      knowledgeMap: [{ module: 'core-grammar', section: '形容词', node: 'cg-i-adj-pred' }], knowledgeMapStatus: 'verified'
    }),
    L({
      id: 'l5-007', scenarioId: 'scene-restaurant-wait', sceneName: '餐厅等位', infoCount: 2,
      audioScript: 'すみません、今、席がいっぱいです。30分ぐらい待ちますが、よろしいですか。はい、待ちます。3人です。',
      scriptJa: '「すみません、今、席がいっぱいです。30分ぐらい待ちますが、よろしいですか。」「はい、待ちます。3人です。」',
      scriptKana: '「すみません、いま、せきがいっぱいです。さんじゅっぷんぐらいまちますが、よろしいですか。」「はい、まちます。さんにんです。」',
      question: '【餐厅等位】要等多久？一共几个人？',
      options: ['约30分钟・3人', '约13分钟・3人', '约30分钟・4人', '约3分钟・2人'],
      answer: '约30分钟・3人',
      translation: '"不好意思，现在满座。要等30分钟左右可以吗？""好，我们等。3个人。"',
      explanation: '「さんじゅっぷん」=30分钟；「さんにん」=3人。いっぱい在这里是"满"，不是"1杯"。',
      lesson: [11], grammarPoints: ['数量词：人', '时间'], difficulty: 3,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    L({
      id: 'l5-008', scenarioId: 'scene-supermarket-close', sceneName: '超市关门广播', infoCount: 2, listenKind: 'announcement', level: 4, type: 'announcement',
      audioScript: 'お客様にご案内いたします。当店は間もなく、8時に閉店いたします。レジは2階と1階にございます。',
      scriptJa: '「お客様にご案内いたします。当店は間もなく、8時に閉店いたします。レジは2階と1階にございます。」',
      scriptKana: '「おきゃくさまにごあんないいたします。とうてんはまもなく、はちじにへいてんいたします。レジはにかいといっかいにございます。」',
      question: '【超市广播】超市几点关门？收银台在几楼？',
      options: ['8点・1楼和2楼', '8点・只有3楼', '6点・1楼和2楼', '8点半・2楼'],
      answer: '8点・1楼和2楼',
      translation: '"顾客请注意。本店即将于8点闭店。收银台位于2楼和1楼。"',
      explanation: '「はちじに閉店」=8点关门；「2階と1階」=两个楼层，と并列。广播里的敬语（いたします/ございます）听懂大意即可。',
      lesson: [4, 10], grammarPoints: ['に（时点）', 'と（并列）'], difficulty: 3,
      knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-to' }], knowledgeMapStatus: 'verified'
    }),
    L({
      id: 'l5-009', scenarioId: 'scene-classroom-change', sceneName: '教室变更通知', infoCount: 2, listenKind: 'announcement', level: 4, type: 'announcement',
      audioScript: 'あしたの日本語の授業は、教室が変わります。305教室ではなくて、402教室です。時間は同じ、9時からです。',
      scriptJa: '「あしたの日本語の授業は、教室が変わります。305教室ではなくて、402教室です。時間は同じ、9時からです。」',
      scriptKana: '「あしたのにほんごのじゅぎょうは、きょうしつがかわります。さんまるごきょうしつではなくて、よんまるにきょうしつです。じかんはおなじ、くじからです。」',
      question: '【教室变更】明天在哪个教室上课？几点开始？',
      options: ['402教室・9点', '305教室・9点', '402教室・6点', '502教室・9点'],
      answer: '402教室・9点',
      translation: '"明天的日语课换教室。不是305教室，而是402教室。时间不变，9点开始。"',
      explanation: '「ではなくて」=不是A而是B——305是被否定的旧教室，402才是新教室。「くじ」=9点。否定信息是最容易听漏的。',
      lesson: [4], grammarPoints: ['ではなくて（否定更正）', 'から'], difficulty: 3,
      knowledgeMap: [], knowledgeMapStatus: 'pending'
    }),
    L({
      id: 'l5-010', scenarioId: 'scene-weather-plan', sceneName: '天气与计划', infoCount: 2,
      audioScript: 'あした、山へ行きませんか。あしたは雨が降ると思いますよ。じゃ、あさってはどうですか。あさっては大丈夫だと思います。じゃ、あさっての朝8時に出発しましょう。',
      scriptJa: '「あした、山へ行きませんか。」「あしたは雨が降ると思いますよ。」「じゃ、あさってはどうですか。」「あさっては大丈夫だと思います。じゃ、あさっての朝8時に出発しましょう。」',
      scriptKana: '「あした、やまへいきませんか。」「あしたはあめがふるとおもいますよ。」「じゃ、あさってはどうですか。」「あさってはだいじょうぶだとおもいます。じゃ、あさってのあさはちじにしゅっぱつしましょう。」',
      question: '【爬山计划】最后决定哪天、几点出发？',
      options: ['后天・早上8点', '明天・早上8点', '后天・早上6点', '明天・早上9点'],
      answer: '后天・早上8点',
      translation: '"明天去爬山吗？""明天我觉得会下雨。""那后天呢？""后天应该没问题。那后天早上8点出发吧。"',
      explanation: '计划从明天改到后天（あさって）——对话中的变更信息是关键；「はちじ」=8点。と思います标记推测。',
      lesson: [21], grammarPoints: ['と思います', 'ましょう'], difficulty: 3,
      knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-to' }], knowledgeMapStatus: 'verified'
    })
  );
})();
