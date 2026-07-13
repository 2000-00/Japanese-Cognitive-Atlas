/* 阅读扩充 —— 短消息/邮件（待审核区）。AI 编写，非教材原文。 */
window.MJT_DATA = window.MJT_DATA || {};
window.MJT_DATA.pendingReading = window.MJT_DATA.pendingReading || [];

(function () {
  function R(p) {
    p.lessonStatus = 'pending';
    p.contentType = 'ai_generated_practice'; p.displaySource = '基于已验证知识生成';
    p.isTextbookOriginal = false; p.origin = '待核实演示数据';
    p.sourceStatus = 'pending'; p.sourceType = 'manual_review'; p.reviewed = false;
    p.sourceReference = 'AI编写的情景短文；课程归属待对照教材核实。';
    if (!p.knowledgeMap) { p.knowledgeMap = []; p.knowledgeMapStatus = 'pending'; }
    return p;
  }

  window.MJT_DATA.pendingReading.push(
    R({
      id: 'r2-msg-001', type: 'line-message', level: '基础', title: 'LINE：约看电影', scenarioId: 'scene-friend-plan',
      textJa: 'あした、映画を見に行かない？\n3時からのと、6時半からのがあるよ。\nわたしは6時半のほうがいいな。駅の南口で会おう。',
      textKana: 'あした、えいがをみにいかない？\nさんじからのと、ろくじはんからのがあるよ。\nわたしはろくじはんのほうがいいな。えきのみなみぐちであおう。',
      translation: '明天要不要去看电影？\n有3点开始的和6点半开始的。\n我想看6点半的。车站南口见吧。',
      questions: [
        { q: '发消息的人想看几点的电影？', options: ['6点半的', '3点的', '6点的', '3点半的'], answer: '6点半的', locate: '信息定位：第3行「わたしは6時半のほうがいい」。', reasoning: '两个场次都出现（3時/6時半），但「～のほうがいい」表达了发件人的偏好。' },
        { q: '约在哪里见面？', options: ['车站南口', '车站北口', '电影院门口', '车站里面'], answer: '车站南口', locate: '信息定位：第3行「駅の南口で会おう」。', reasoning: '南口（みなみぐち）。会おう是会う的简体意向形，LINE消息常用简体。' }
      ],
      sentenceAnalysis: [
        '「見に行かない？」— 简体邀请（＝見に行きませんか），朋友之间用简体。',
        '「3時からのと、6時半からのがある」— の代替"场次"，と并列两个选项。',
        '「6時半のほうがいい」— 二选一的偏好表达。'
      ],
      keyVocab: [{ ja: '南口', kana: 'みなみぐち', zh: '南口' }, { ja: '会おう', kana: 'あおう', zh: '见面吧（简体意向形）' }],
      keyGrammar: ['简体邀请', 'のほうがいい', 'と（并列）'],
      lesson: [12, 20], difficulty: 2,
      knowledgeMap: [{ module: 'core-grammar', section: '比较', node: 'cg-p-yori' }], knowledgeMapStatus: 'verified'
    }),
    R({
      id: 'r2-msg-002', type: 'email', level: '初级', title: '邮件：作业提交说明', scenarioId: 'scenario-school-absence-001',
      textJa: '学生のみなさんへ\n来週の月曜日は祝日ですから、授業がありません。\nレポートは水曜日の午後5時までにメールで出してください。\n紙のレポートは受け取りません。\n山田',
      textKana: 'がくせいのみなさんへ\nらいしゅうのげつようびはしゅくじつですから、じゅぎょうがありません。\nレポートはすいようびのごごごじまでにメールでだしてください。\nかみのレポートはうけとりません。\nやまだ',
      translation: '各位同学：\n下周一是节日，所以没有课。\n报告请在周三下午5点之前用邮件提交。\n不接收纸质报告。\n山田',
      questions: [
        { q: '报告的截止时间是？', options: ['周三下午5点', '周一下午5点', '周三上午5点', '周五下午5点'], answer: '周三下午5点', locate: '信息定位：第3行「水曜日の午後5時までに」。', reasoning: 'までに=截止。周一（没课）和周三（截止）两个时间都出现，要对应正确。' },
        { q: '怎么提交报告？', options: ['用邮件', '交纸质版', '当面交给老师', '放到办公室'], answer: '用邮件', locate: '信息定位：第3行「メールで出してください」＋第4行「紙のレポートは受け取りません」。', reasoning: 'で标记手段（用邮件）；第4行的否定信息（不收纸质）排除了纸质选项——肯定+否定两条信息互相印证。' },
        { q: '下周一为什么没有课？', options: ['因为是节日', '因为老师出差', '因为考试', '因为教室维修'], answer: '因为是节日', locate: '信息定位：第2行「祝日ですから」。', reasoning: 'から表示原因：因为是节日（祝日）。' }
      ],
      sentenceAnalysis: [
        '「祝日ですから、授業がありません」— から（理由）。',
        '「午後5時までにメールで出してください」— までに（截止）＋で（手段）＋てください（指示）。',
        '「受け取りません」— 否定信息，阅读中容易被跳过。'
      ],
      keyVocab: [{ ja: '祝日', kana: 'しゅくじつ', zh: '法定节日' }, { ja: '受け取る', kana: 'うけとる', zh: '接收' }],
      keyGrammar: ['から（理由）', 'までに', 'で（手段）'],
      lesson: [9, 17], difficulty: 2,
      knowledgeMap: [{ module: 'core-grammar', section: '接续', node: 'cg-c-reason' }], knowledgeMapStatus: 'verified'
    }),
    R({
      id: 'r2-msg-003', type: 'line-message', level: '初级', title: 'LINE：帮忙买东西', scenarioId: 'scenario-supermarket-food-001',
      textJa: '今、スーパーにいる？\nすみませんが、牛乳を1本と卵を1パック買ってきてください。\nあ、それから、パンもお願い。パンは2個ね。\n全部で600円ぐらいだと思う。',
      textKana: 'いま、スーパーにいる？\nすみませんが、ぎゅうにゅうをいっぽんとたまごをワンパックかってきてください。\nあ、それから、パンもおねがい。パンはにこね。\nぜんぶでろっぴゃくえんぐらいだとおもう。',
      translation: '你现在在超市吗？\n不好意思，请买1瓶牛奶和1盒鸡蛋回来。\n啊对了，还要面包。面包要2个。\n我觉得总共600日元左右。',
      questions: [
        { q: '一共要买几样东西？', options: ['3样（牛奶、鸡蛋、面包）', '2样（牛奶、鸡蛋）', '4样（牛奶、鸡蛋、面包、茶）', '1样（面包）'], answer: '3样（牛奶、鸡蛋、面包）', locate: '信息定位：第2行（牛乳・卵）＋第3行「それから、パンも」。', reasoning: '第3行用「それから／も」追加了面包——追加信息容易漏。' },
        { q: '面包要买几个？', options: ['2个', '1个', '3个', '6个'], answer: '2个', locate: '信息定位：第3行「パンは2個ね」。', reasoning: '2個（にこ）。牛奶是1本、鸡蛋是1パック——数量词与物品要一一对应。' }
      ],
      sentenceAnalysis: [
        '「買ってきてください」— 買って＋くる：买了再回来（てくる的方向义）。',
        '「パンも」— も表示追加"也"。',
        '「600円ぐらいだと思う」— 简体＋と思う（推测）。'
      ],
      keyVocab: [{ ja: 'それから', kana: 'それから', zh: '然后、还有' }, { ja: '～ぐらい', kana: '～ぐらい', zh: '大约' }],
      keyGrammar: ['てくる', 'も（追加）', 'と思う'],
      lesson: [7, 21], difficulty: 2,
      knowledgeMap: [{ module: 'core-grammar', section: '体', node: 'cg-a-tekuru-teiku' }], knowledgeMapStatus: 'verified'
    }),
    R({
      id: 'r2-msg-004', type: 'email', level: '综合', title: '邮件：牙科预约变更', scenarioId: 'scenario-dentist-appointment-001',
      textJa: 'リン様\nさくら歯科です。ご予約の変更のお知らせです。\n15日金曜日の午後4時のご予約ですが、その日は先生が急に休みになりました。申し訳ありません。\n17日日曜日の午前11時か、18日月曜日の午後4時はいかがですか。\nお電話でお返事をお願いします。電話は03-1234-5678です。\nさくら歯科 受付',
      textKana: 'リンさま\nさくらしかです。ごよやくのへんこうのおしらせです。\nじゅうごにちきんようびのごごよじのごよやくですが、そのひはせんせいがきゅうにやすみになりました。もうしわけありません。\nじゅうしちにちにちようびのごぜんじゅういちじか、じゅうはちにちげつようびのごごよじはいかがですか。\nおでんわでおへんじをおねがいします。でんわはゼロさんのいちにさんよんのごろくななはちです。\nさくらしか うけつけ',
      translation: '林先生/女士：\n这里是樱花牙科。预约变更通知。\n您预约的15日周五下午4点，那天医生临时休息，非常抱歉。\n17日周日上午11点，或18日周一下午4点怎么样？\n请电话回复。电话是03-1234-5678。\n樱花牙科 前台',
      questions: [
        { q: '原来的预约是什么时候？', options: ['15日周五下午4点', '17日周日上午11点', '18日周一下午4点', '15日周五上午4点'], answer: '15日周五下午4点', locate: '信息定位：第3行「15日金曜日の午後4時のご予約」。', reasoning: '三个日期时间并存：原预约（15日）与两个新提议（17/18日）。「ご予約ですが」标记的是原预约。' },
        { q: '为什么要变更预约？', options: ['医生临时休息', '诊所搬家', '病人迟到', '设备维修'], answer: '医生临时休息', locate: '信息定位：第3行「先生が急に休みになりました」。', reasoning: '急に=突然；休みになりました=变成休息（なる的变化义）。' },
        { q: '诊所提供的新选项是？', options: ['17日上午11点或18日下午4点', '只有17日上午11点', '16日或17日的下午', '18日上午11点或17日下午4点'], answer: '17日上午11点或18日下午4点', locate: '信息定位：第4行「17日…11時か、18日…4時」。', reasoning: 'か连接两个选项（或者）。日期与时间要成对记忆，不能交叉。' },
        { q: '怎么回复诊所？', options: ['打电话', '回邮件', '直接到店', '发短信'], answer: '打电话', locate: '信息定位：第5行「お電話でお返事をお願いします」。', reasoning: 'で标记手段=用电话。' }
      ],
      sentenceAnalysis: [
        '「ご予約ですが」— が用于铺垫，引出下文变更。',
        '「休みになりました」— なる：状态变化。',
        '「11時か、…4時はいかがですか」— か表示二选一。',
        '「お電話でお返事を」— で（手段）。'
      ],
      keyVocab: [{ ja: '変更', kana: 'へんこう', zh: '变更' }, { ja: '急に', kana: 'きゅうに', zh: '突然' }, { ja: 'お返事', kana: 'おへんじ', zh: '回复' }],
      keyGrammar: ['が（铺垫）', 'なります（变化）', 'か（选择）'],
      lesson: [19, 21], difficulty: 3,
      knowledgeMap: [{ module: 'core-grammar', section: '接续', node: 'cg-c-kedo-ga' }], knowledgeMapStatus: 'verified'
    })
  );
})();
