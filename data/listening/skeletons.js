/* Listening Engine 2.0 —— 可组合听力素材池
 *
 * 由"词汇槽位 × 数字槽位 × 场景模板 × 人物 × 时间 × 题型"动态生成听力，
 * 而非依赖固定题库。素材为通用常见词与自然生活句模板（辞典可核实读音，
 * 课程归属 pending）；生成题为 ai_generated_practice。
 *
 * 模板同时给出 tmpl（汉字显示）与 kana（假名读音），生成时对同名 {TOKEN}
 * 双串替换，保证 displayText 与 speechText/readingText 同源。 */
window.MJT_DATA = window.MJT_DATA || {};

window.MJT_DATA.listeningPool = {
  ref: { sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: '标准日语读音与常见生活表达（辞典可核实）；课程归属待核实。',
    lessonAttribution: { lesson: null, status: 'pending' } },

  /* ==== 和语数词（つ）1–9 ==== */
  wago: { 1: 'ひとつ', 2: 'ふたつ', 3: 'みっつ', 4: 'よっつ', 5: 'いつつ', 6: 'むっつ', 7: 'ななつ', 8: 'やっつ', 9: 'ここのつ' },

  /* ==== 商品（含默认量词与价格档） ==== */
  products: [
    { ja: 'りんご', kana: 'りんご', counter: 'ko', pMin: 80, pMax: 200 },
    { ja: 'ジュース', kana: 'ジュース', counter: 'hon', pMin: 100, pMax: 200 },
    { ja: 'お茶', kana: 'おちゃ', counter: 'hon', pMin: 100, pMax: 180 },
    { ja: '水', kana: 'みず', counter: 'hon', pMin: 90, pMax: 150 },
    { ja: 'コーヒー', kana: 'コーヒー', counter: 'hai', pMin: 200, pMax: 500 },
    { ja: 'パン', kana: 'パン', counter: 'ko', pMin: 120, pMax: 350 },
    { ja: 'たまご', kana: 'たまご', counter: 'ko', pMin: 200, pMax: 320 },
    { ja: 'ノート', kana: 'ノート', counter: 'satsu', pMin: 100, pMax: 300 },
    { ja: '切手', kana: 'きって', counter: 'mai', pMin: 60, pMax: 140 },
    { ja: 'ペン', kana: 'ペン', counter: 'hon', pMin: 100, pMax: 300 },
    { ja: '本', kana: 'ほん', counter: 'satsu', pMin: 500, pMax: 2500 },
    { ja: 'シャツ', kana: 'シャツ', counter: 'mai', pMin: 900, pMax: 3000 },
    { ja: 'ケーキ', kana: 'ケーキ', counter: 'ko', pMin: 300, pMax: 600 },
    { ja: 'おにぎり', kana: 'おにぎり', counter: 'ko', pMin: 120, pMax: 250 },
    { ja: 'みかん', kana: 'みかん', counter: 'ko', pMin: 50, pMax: 150 }
  ],

  /* ==== 人物 ==== */
  people: [
    { ja: '田中さん', kana: 'たなかさん' }, { ja: '山田さん', kana: 'やまださん' },
    { ja: '木村さん', kana: 'きむらさん' }, { ja: '林さん', kana: 'りんさん' },
    { ja: '佐藤さん', kana: 'さとうさん' }, { ja: '鈴木さん', kana: 'すずきさん' },
    { ja: '先生', kana: 'せんせい' }, { ja: '友達', kana: 'ともだち' }
  ],

  /* ==== 地点（带场景标签，用于方向/移动句） ==== */
  places: [
    { ja: '病院', kana: 'びょういん', scene: 'hospital' }, { ja: '学校', kana: 'がっこう', scene: 'school' },
    { ja: '駅', kana: 'えき', scene: 'train' }, { ja: '図書館', kana: 'としょかん', scene: 'library' },
    { ja: '銀行', kana: 'ぎんこう', scene: 'bank' }, { ja: '郵便局', kana: 'ゆうびんきょく', scene: 'post' },
    { ja: 'スーパー', kana: 'スーパー', scene: 'supermarket' }, { ja: '会社', kana: 'かいしゃ', scene: 'work' },
    { ja: 'コンビニ', kana: 'コンビニ', scene: 'konbini' }, { ja: '公園', kana: 'こうえん', scene: 'weekend' }
  ],

  /* ==== L2 带单位短句模板（完整句·单主信息但结构完整） ==== */
  sentenceL2: [
    { id: 'l2-price-cnt', scene: 'shopping', tmpl: '{PRODUCT}は{WAGO}で{PRICE}です。', kana: '{PRODUCT}は{WAGO}で{PRICE}です。',
      slots: { PRODUCT: { type: 'product' }, WAGO: { type: 'wago', max: 5 }, PRICE: { type: 'price', min: 100, max: 800 } },
      questions: [{ asks: 'PRICE', q: '多少钱？' }, { asks: 'WAGO', q: '有几个？' }, { asks: 'PRODUCT', q: '是什么商品？' }],
      grammarPoints: ['で（数量/价格）', '名词谓语句'] },
    { id: 'l2-time-start', scene: 'school', tmpl: '授業は{TIME}から始まります。', kana: 'じゅぎょうは{TIME}からはじまります。',
      slots: { TIME: { type: 'time', hMin: 8, hMax: 11 } }, questions: [{ asks: 'TIME', q: '几点开始？' }], grammarPoints: ['から（起点）', '～時'] },
    { id: 'l2-counter-buy', scene: 'supermarket', tmpl: '{PRODUCT}を{CNT}買いました。', kana: '{PRODUCT}を{CNT}かいました。',
      slots: { PRODUCT: { type: 'product' }, CNT: { type: 'productCounter' } }, questions: [{ asks: 'CNT', q: '买了几个/几瓶？' }], grammarPoints: ['数量词', 'を'] },
    { id: 'l2-date-is', scene: 'weekend', tmpl: '今日は{DATE}です。', kana: 'きょうは{DATE}です。',
      slots: { DATE: { type: 'date' } }, questions: [{ asks: 'DATE', q: '今天几号？' }], grammarPoints: ['日期读法'] }
  ],

  /* ==== L3 场景单句模板（≥2信息点） ==== */
  sentenceL3: [
    { id: 'l3-shop-total', scene: 'konbini', tmpl: '{PLACE}で、{PRODUCT}を{CNT}買いました。全部で{PRICE}でした。', kana: '{PLACE}で、{PRODUCT}を{CNT}かいました。ぜんぶで{PRICE}でした。',
      slots: { PLACE: { type: 'place' }, PRODUCT: { type: 'product' }, CNT: { type: 'productCounter' }, PRICE: { type: 'price', min: 200, max: 1200 } },
      questions: [{ asks: 'CNT', q: '买了几个/几瓶？' }, { asks: 'PRICE', q: '一共多少钱？' }], grammarPoints: ['で（场所）', '全部で'] },
    { id: 'l3-appt-time', scene: 'hospital', tmpl: '{PLACE}の予約は{DATE}の{TIME}です。', kana: '{PLACE}のよやくは{DATE}の{TIME}です。',
      slots: { PLACE: { type: 'place' }, DATE: { type: 'date' }, TIME: { type: 'time', hMin: 9, hMax: 17 } },
      questions: [{ asks: 'DATE', q: '预约是哪天？' }, { asks: 'TIME', q: '预约是几点？' }], grammarPoints: ['の（所属）', '日期时间'] },
    { id: 'l3-train-depart', scene: 'train', tmpl: '次の電車は{TIME}に{PLACE}を出ます。', kana: 'つぎのでんしゃは{TIME}に{PLACE}をでます。',
      slots: { TIME: { type: 'time', hMin: 6, hMax: 22 }, PLACE: { type: 'place' } },
      questions: [{ asks: 'TIME', q: '电车几点发车？' }, { asks: 'PLACE', q: '从哪里发车？' }], grammarPoints: ['に（时点）', 'を（离开点）'] }
  ],

  /* ==== L4 双信息场景模板（人物+关系+≥2信息） ==== */
  structL4: [
    { id: 'l4-order-visit', scene: 'hospital', tmpl: '{PERSON}は{TIME}に{PLACE}へ行って、そのあと{TIME2}に{PLACE2}へ来ました。', kana: '{PERSON}は{TIME}に{PLACE}へいって、そのあと{TIME2}に{PLACE2}へきました。',
      slots: { PERSON: { type: 'person' }, TIME: { type: 'time', hMin: 8, hMax: 11 }, PLACE: { type: 'place' }, TIME2: { type: 'time', hMin: 12, hMax: 17 }, PLACE2: { type: 'place' } },
      questions: [{ asks: 'PLACE', q: '先去了哪里？' }, { asks: 'TIME2', q: '几点到第二个地方？' }, { asks: 'PLACE2', q: '后来去了哪里？' }],
      grammarPoints: ['て形动作链', 'そのあと', 'へ'] },
    { id: 'l4-buy-two', scene: 'supermarket', tmpl: '{PERSON}は{PLACE}で{PRODUCT}を{CNT}と{PRODUCT2}を{CNT2}買いました。', kana: '{PERSON}は{PLACE}で{PRODUCT}を{CNT}と{PRODUCT2}を{CNT2}かいました。',
      slots: { PERSON: { type: 'person' }, PLACE: { type: 'place' }, PRODUCT: { type: 'product' }, CNT: { type: 'productCounter' }, PRODUCT2: { type: 'product' }, CNT2: { type: 'productCounter' } },
      questions: [{ asks: 'CNT', q: '第一种商品买了几个/几瓶？' }, { asks: 'PRODUCT2', q: '第二种买了什么？' }],
      grammarPoints: ['と（并列）', '数量词', 'で（场所）'] }
  ],

  /* ==== L5 短对话模板（2–4轮，含确认/否定/选择/更正） ==== */
  dialogL5: [
    { id: 'l5-clinic', scene: 'hospital', turns: [
        { sp: '受付', tmpl: 'ご予約は{DATE}の{TIME}でよろしいですか。', kana: 'ごよやくは{DATE}の{TIME}でよろしいですか。' },
        { sp: '患者', tmpl: 'はい、お願いします。', kana: 'はい、おねがいします。' }
      ], slots: { DATE: { type: 'date' }, TIME: { type: 'time', hMin: 9, hMax: 17 } },
      questions: [{ asks: 'TIME', q: '预约是几点？' }, { asks: 'DATE', q: '预约是哪天？' }], grammarPoints: ['确认句', '日期时间'] },
    { id: 'l5-shop', scene: 'konbini', turns: [
        { sp: '店員', tmpl: 'いらっしゃいませ。{PRODUCT}は{CNT}でよろしいですか。', kana: 'いらっしゃいませ。{PRODUCT}は{CNT}でよろしいですか。' },
        { sp: '客', tmpl: 'あ、すみません、{CNT2}お願いします。', kana: 'あ、すみません、{CNT2}おねがいします。' },
        { sp: '店員', tmpl: 'かしこまりました。{PRICE}です。', kana: 'かしこまりました。{PRICE}です。' }
      ], slots: { PRODUCT: { type: 'product' }, CNT: { type: 'productCounter' }, CNT2: { type: 'productCounter' }, PRICE: { type: 'price', min: 200, max: 900 } },
      questions: [{ asks: 'CNT2', q: '客人最后要买几个/几瓶？（更正后）' }, { asks: 'PRICE', q: '一共多少钱？' }], grammarPoints: ['更正', '数量词', '金额'] },
    { id: 'l5-plan', scene: 'friends', turns: [
        { sp: 'A', tmpl: '{DATE}、一緒に{PLACE}へ行きませんか。', kana: '{DATE}、いっしょに{PLACE}へいきませんか。' },
        { sp: 'B', tmpl: 'いいですね。何時にしますか。', kana: 'いいですね。なんじにしますか。' },
        { sp: 'A', tmpl: '{TIME}はどうですか。', kana: '{TIME}はどうですか。' },
        { sp: 'B', tmpl: 'はい、{TIME}に駅で会いましょう。', kana: 'はい、{TIME}にえきであいましょう。' }
      ], slots: { DATE: { type: 'date' }, PLACE: { type: 'place' }, TIME: { type: 'time', hMin: 9, hMax: 18 } },
      questions: [{ asks: 'TIME', q: '两人约几点见面？' }, { asks: 'PLACE', q: '要去哪里？' }, { asks: 'DATE', q: '约在哪天？' }], grammarPoints: ['ませんか', 'ましょう'] },
    { id: 'l5-station', scene: 'train', turns: [
        { sp: '客', tmpl: 'すみません、{PLACE}行きは何番線ですか。', kana: 'すみません、{PLACE}ゆきはなんばんせんですか。' },
        { sp: '駅員', tmpl: '{NBAN}番線です。{TIME}に出ますよ。', kana: '{NBAN}ばんせんです。{TIME}にでますよ。' }
      ], slots: { PLACE: { type: 'place' }, NBAN: { type: 'smallnum', min: 1, max: 9 }, TIME: { type: 'time', hMin: 6, hMax: 22 } },
      questions: [{ asks: 'NBAN', q: '在几号站台？' }, { asks: 'TIME', q: '电车几点发车？' }], grammarPoints: ['番線', '时间'] }
  ],

  /* ==== L6 完整场景模板（4–8轮，含目标/变化/回应/综合问题） ==== */
  sceneL6: [
    { id: 'l6-dentist', scene: 'dental', goal: '给牙科打电话改约时间',
      turns: [
        { sp: '受付', tmpl: 'はい、さくら歯科です。', kana: 'はい、さくらしかです。' },
        { sp: '患者', tmpl: 'すみません、{DATE}の{TIME}の予約を変更したいんですが。', kana: 'すみません、{DATE}の{TIME}のよやくをへんこうしたいんですが。' },
        { sp: '受付', tmpl: 'では、{DATE2}の{TIME2}はいかがですか。', kana: 'では、{DATE2}の{TIME2}はいかがですか。' },
        { sp: '患者', tmpl: 'はい、大丈夫です。お願いします。', kana: 'はい、だいじょうぶです。おねがいします。' },
        { sp: '受付', tmpl: 'では{DATE2}の{TIME2}に、保険証を持ってきてください。', kana: 'では{DATE2}の{TIME2}に、ほけんしょうをもってきてください。' }
      ], slots: { DATE: { type: 'date' }, TIME: { type: 'time', hMin: 9, hMax: 12 }, DATE2: { type: 'date' }, TIME2: { type: 'time', hMin: 13, hMax: 17 } },
      questions: [{ asks: 'DATE2', q: '改约到哪天？' }, { asks: 'TIME2', q: '改约到几点？' }],
      respond: { q: '受付说要带什么来？请选择合适回应。', options: ['はい、保険証を持っていきます。', 'いいえ、行きません。', '予約はしません。', 'お茶をください。'], answer: 'はい、保険証を持っていきます。' },
      grammarPoints: ['变更/改约', 'てください', '日期时间'] },
    { id: 'l6-supermarket', scene: 'supermarket', goal: '在超市买东西并结账',
      turns: [
        { sp: '店内放送', tmpl: '本日、{PRODUCT}が{CNT}で{PRICE}です。', kana: 'ほんじつ、{PRODUCT}が{CNT}で{PRICE}です。' },
        { sp: '客', tmpl: 'すみません、{PRODUCT}はどこですか。', kana: 'すみません、{PRODUCT}はどこですか。' },
        { sp: '店員', tmpl: '{NBAN}番の棚です。', kana: '{NBAN}ばんのたなです。' },
        { sp: '客', tmpl: 'じゃあ、{CNT}ください。', kana: 'じゃあ、{CNT}ください。' },
        { sp: '店員', tmpl: '{PRICE}です。ありがとうございます。', kana: '{PRICE}です。ありがとうございます。' }
      ], slots: { PRODUCT: { type: 'product' }, CNT: { type: 'productCounter' }, PRICE: { type: 'price', min: 200, max: 1500 }, NBAN: { type: 'smallnum', min: 1, max: 9 } },
      questions: [{ asks: 'PRICE', q: '一共多少钱？' }, { asks: 'NBAN', q: '商品在几号货架？' }, { asks: 'CNT', q: '客人买了几个/几瓶？' }],
      respond: { q: '店员说了价格，客人要付钱。合适回应是？', options: ['はい、お願いします。', 'いいえ、けっこうです。', 'どこですか。', '何時ですか。'], answer: 'はい、お願いします。' },
      grammarPoints: ['どこですか', 'ください', '金额'] }
  ]
};
