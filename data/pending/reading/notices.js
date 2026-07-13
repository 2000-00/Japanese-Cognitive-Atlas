/* 阅读扩充 —— 通知/公告（待审核区）。AI 编写，非教材原文。 */
window.MJT_DATA = window.MJT_DATA || {};
window.MJT_DATA.pendingReading = window.MJT_DATA.pendingReading || [];

(function () {
  function R(p) {
    p.lessonStatus = 'pending';
    p.contentType = 'ai_generated_practice'; p.displaySource = '基于已验证知识生成';
    p.isTextbookOriginal = false; p.origin = '待核实演示数据';
    p.sourceStatus = 'pending'; p.sourceType = 'manual_review'; p.reviewed = false;
    p.sourceReference = 'AI编写的情景通知；课程归属待对照教材核实。';
    if (!p.knowledgeMap) { p.knowledgeMap = []; p.knowledgeMapStatus = 'pending'; }
    return p;
  }

  window.MJT_DATA.pendingReading.push(
    R({
      id: 'r2-ntc-001', type: 'notice', level: '基础', title: '宿舍垃圾分类通知', scenarioId: 'scenario-dorm-repair-001',
      textJa: 'ごみの出し方\n燃えるごみ：月曜日と木曜日\n燃えないごみ：水曜日\nペットボトル：金曜日\n朝8時までに出してください。\n夜、ごみを出してはいけません。',
      textKana: 'ごみのだしかた\nもえるごみ：げつようびともくようび\nもえないごみ：すいようび\nペットボトル：きんようび\nあさはちじまでにだしてください。\nよる、ごみをだしてはいけません。',
      translation: '垃圾的扔法\n可燃垃圾：周一和周四\n不可燃垃圾：周三\n塑料瓶：周五\n请在早上8点前扔出。\n晚上不可以扔垃圾。',
      questions: [
        { q: '可燃垃圾星期几扔？', options: ['周一和周四', '周三', '周五', '周一和周三'], answer: '周一和周四', locate: '信息定位：第2行「燃えるごみ：月曜日と木曜日」。', reasoning: '表格式通知按行定位；と并列两天。' },
        { q: '垃圾最晚什么时候扔出？', options: ['早上8点前', '晚上8点前', '中午之前', '任何时间'], answer: '早上8点前', locate: '信息定位：第5行「朝8時までに」＋第6行「夜…いけません」。', reasoning: 'までに=截止；最后一行的禁止信息（晚上不行）排除"任何时间"。' }
      ],
      sentenceAnalysis: [
        '「出し方」— ます形词干＋方＝做…的方法。',
        '「8時までに出してください」— までに＋てください。',
        '「出してはいけません」— 禁止句型。'
      ],
      keyVocab: [{ ja: '燃える', kana: 'もえる', zh: '可燃' }, { ja: '出す', kana: 'だす', zh: '扔出、提交' }],
      keyGrammar: ['までに', 'てはいけません'],
      lesson: [15, 17], difficulty: 1,
      knowledgeMap: [{ module: 'core-grammar', section: '许可禁止', node: 'cg-pol-temoii' }], knowledgeMapStatus: 'verified'
    }),
    R({
      id: 'r2-ntc-002', type: 'notice', level: '初级', title: '图书馆临时闭馆通知', scenarioId: 'scenario-library-borrow-001',
      textJa: 'お知らせ\n図書館は、25日から27日まで、工事のため休みます。\n28日から、また利用することができます。\n25日までに借りた本は、来月の10日までに返してください。',
      textKana: 'おしらせ\nとしょかんは、にじゅうごにちからにじゅうしちにちまで、こうじのためやすみます。\nにじゅうはちにちから、またりようすることができます。\nにじゅうごにちまでにかりたほんは、らいげつのとおかまでにかえしてください。',
      translation: '通知\n图书馆25日到27日因施工闭馆。\n28日起恢复使用。\n25日前借的书，请在下月10日前归还。',
      questions: [
        { q: '图书馆哪几天闭馆？', options: ['25日～27日', '25日～28日', '27日～28日', '只有25日'], answer: '25日～27日', locate: '信息定位：第2行「25日から27日まで…休みます」。', reasoning: 'から～まで划定区间；28日是恢复日不在闭馆区间内。' },
        { q: '借的书最晚哪天还？', options: ['下月10日', '本月27日', '本月25日', '下月28日'], answer: '下月10日', locate: '信息定位：第4行「来月の10日までに返してください」。', reasoning: '来月=下个月；10日读とおか。文中多个日期需分辨"闭馆日/恢复日/还书截止日"。' },
        { q: '为什么闭馆？', options: ['因为施工', '因为节日', '因为整理图书', '因为搬家'], answer: '因为施工', locate: '信息定位：第2行「工事のため」。', reasoning: '名词＋のため=因为…（原因）。' }
      ],
      sentenceAnalysis: [
        '「工事のため休みます」— のため表示原因。',
        '「利用することができます」— 辞书形＋ことができます（可以使用）。',
        '「借りた本」— た形修饰名词：借了的书。'
      ],
      keyVocab: [{ ja: '工事', kana: 'こうじ', zh: '施工' }, { ja: '利用', kana: 'りよう', zh: '使用' }],
      keyGrammar: ['から～まで', 'ことができます', 'た形修饰名词'],
      lesson: [18, 19], difficulty: 2,
      knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-kara-made' }], knowledgeMapStatus: 'verified'
    }),
    R({
      id: 'r2-ntc-003', type: 'notice', level: '初级', title: '快递不在配送通知单', scenarioId: 'scenario-delivery-notice-001',
      textJa: 'ご不在連絡票\nお荷物をお届けに来ましたが、ご不在でした。\n再配達をご希望の方は、下の電話番号に電話してください。\n電話：0120-45-6789\n受付時間：朝8時から夜9時まで\n荷物は7日間、営業所にあります。',
      textKana: 'ごふざいれんらくひょう\nおにもつをおとどけにきましたが、ごふざいでした。\nさいはいたつをごきぼうのかたは、したのでんわばんごうにでんわしてください。\nでんわ：ゼロいちにゼロのよんごのろくななはちきゅう\nうけつけじかん：あさはちじからよるくじまで\nにもつはなのかかん、えいぎょうしょにあります。',
      translation: '不在家联络票\n来给您送包裹，但您不在家。\n希望再次配送请拨打下面的电话。\n电话：0120-45-6789\n受理时间：早8点到晚9点\n包裹在营业所保管7天。',
      questions: [
        { q: '想再配送应该打哪个电话？', options: ['0120-45-6789', '0120-45-6798', '0210-45-6789', '0120-54-6789'], answer: '0120-45-6789', locate: '信息定位：第4行「電話：0120-45-6789」。', reasoning: '号码题干扰项都是相邻数字交换——需要逐位核对。' },
        { q: '电话受理到几点？', options: ['晚上9点', '晚上8点', '早上9点', '晚上7点'], answer: '晚上9点', locate: '信息定位：第5行「夜9時まで」。', reasoning: 'まで=截止终点；朝8時是开始时间。' },
        { q: '包裹在营业所保管几天？', options: ['7天', '9天', '2天', '10天'], answer: '7天', locate: '信息定位：第6行「7日間（なのかかん）」。', reasoning: '7日間读なのかかん（特殊读法＋間）。' }
      ],
      sentenceAnalysis: [
        '「お届けに来ましたが」— ます形词干＋に来る（来做…）；が=转折（来了但是不在）。',
        '「ご希望の方は」— 敬语式条件"希望…的人"。',
        '「7日間、営業所にあります」— 期间＋存在句。'
      ],
      keyVocab: [{ ja: '不在', kana: 'ふざい', zh: '不在家' }, { ja: '再配達', kana: 'さいはいたつ', zh: '再次配送' }, { ja: '営業所', kana: 'えいぎょうしょ', zh: '营业所' }],
      keyGrammar: ['に来る（目的）', 'が（转折）', 'から～まで'],
      lesson: [13], difficulty: 2,
      knowledgeMap: [{ module: 'core-grammar', section: '格助词', node: 'cg-p-ni' }], knowledgeMapStatus: 'verified'
    }),
    R({
      id: 'r2-ntc-004', type: 'notice', level: '综合', title: '牙科拔牙后注意事项', scenarioId: 'scenario-dentist-appointment-001',
      textJa: '歯を抜いた後の注意\n・今日はおふろに入らないでください。シャワーはいいです。\n・お酒を飲んではいけません。\n・激しい運動をしないでください。\n・薬は夜ごはんの後で1回、あした朝ごはんの後で1回飲んでください。\n・血が止まらないときは、電話してください。',
      textKana: 'はをぬいたあとのちゅうい\n・きょうはおふろにはいらないでください。シャワーはいいです。\n・おさけをのんではいけません。\n・はげしいうんどうをしないでください。\n・くすりはよるごはんのあとでいっかい、あしたあさごはんのあとでいっかいのんでください。\n・ちがとまらないときは、でんわしてください。',
      translation: '拔牙后的注意事项\n・今天请不要泡澡。淋浴可以。\n・不可以喝酒。\n・请不要做剧烈运动。\n・药请今晚饭后吃1次、明天早饭后吃1次。\n・血止不住时请打电话。',
      questions: [
        { q: '今天可以做的是哪一项？', options: ['淋浴', '泡澡', '喝酒', '剧烈运动'], answer: '淋浴', locate: '信息定位：第2行「シャワーはいいです」。', reasoning: '禁止列表里唯一的许可信息：泡澡不行但淋浴可以——肯定与否定对比。' },
        { q: '药一共吃几次？什么时候吃？', options: ['2次：今晚饭后和明早饭后', '1次：今晚饭后', '3次：每顿饭后', '2次：今早和今晚'], answer: '2次：今晚饭后和明早饭后', locate: '信息定位：第5行「夜ごはんの後で1回、あした朝ごはんの後で1回」。', reasoning: '两个「1回」相加=共2次，且时间不同（今晚/明早）——数量与时间组合信息。' },
        { q: '什么情况下要打电话？', options: ['血止不住时', '疼的时候', '忘记吃药时', '想预约时'], answer: '血止不住时', locate: '信息定位：最后一行「血が止まらないときは」。', reasoning: 'ない形＋とき=…的时候（否定条件）。' }
      ],
      sentenceAnalysis: [
        '「抜いた後の注意」— た形＋後（あと）：做完…之后。',
        '「入らないでください」vs「飲んではいけません」— 否定请求与禁止两种句型并用。',
        '「止まらないときは」— ない形＋とき。'
      ],
      keyVocab: [{ ja: '抜く', kana: 'ぬく', zh: '拔' }, { ja: '激しい', kana: 'はげしい', zh: '剧烈的' }, { ja: '血が止まる', kana: 'ちがとまる', zh: '血止住' }],
      keyGrammar: ['ないでください', 'てはいけません', 'た後で'],
      lesson: [15, 17, 19], difficulty: 3,
      knowledgeMap: [
        { module: 'core-grammar', section: '许可禁止', node: 'cg-pol-temoii' },
        { module: 'core-grammar', section: '动词变形', node: 'cg-nai-form' }
      ], knowledgeMapStatus: 'verified'
    })
  );
})();
