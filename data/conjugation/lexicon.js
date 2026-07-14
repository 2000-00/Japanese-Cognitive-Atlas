/* 变形训练词库（动词 / い形容词 / な形容词 / 名词）
 *
 * 真实性说明（与 counters.js / readings.js 一致）：
 * - 词的存在、读音、活用类别（五段/一段/不规则；い形/な形）是可在任何
 *   正规日语辞典核实的客观语言事实 → sourceStatus: verified、
 *   sourceType: manual_review。
 * - "该词属于《大家的日本语》第几课"属于教材归属声明 → lessonAttribution
 *   一律 pending，AI 不猜测。
 * - 由本词库生成的变形练习是 ai_generated_practice（见 conjugation.js）。
 *
 * group: 'godan' | 'ichidan' | 'irregular'
 * 特别标注 fakeIchidan: 词形像一段（る前为 e/i 段）但实为五段（帰る/入る/走る…），
 * 活用引擎只依据 group 字段，绝不按词形猜测。 */
window.MJT_DATA = window.MJT_DATA || {};

var _verifiedRef = {
  sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
  sourceReference: '标准日语活用规则（辞典可核实）；课程归属待核实。',
  lessonAttribution: { lesson: null, status: 'pending' }
};

window.MJT_DATA.conjugationLexicon = {
  ref: _verifiedRef,

  verbs: [
    // ---- godan：覆盖全部词尾 う/く/ぐ/す/つ/ぬ/ぶ/む/る ----
    { dict: '買う', reading: 'かう', group: 'godan', zh: '买' },
    { dict: '書く', reading: 'かく', group: 'godan', zh: '写' },
    { dict: '行く', reading: 'いく', group: 'godan', zh: '去', teException: true },
    { dict: '泳ぐ', reading: 'およぐ', group: 'godan', zh: '游泳' },
    { dict: '話す', reading: 'はなす', group: 'godan', zh: '说' },
    { dict: '待つ', reading: 'まつ', group: 'godan', zh: '等' },
    { dict: '死ぬ', reading: 'しぬ', group: 'godan', zh: '死' },
    { dict: '遊ぶ', reading: 'あそぶ', group: 'godan', zh: '玩' },
    { dict: '飲む', reading: 'のむ', group: 'godan', zh: '喝' },
    { dict: '読む', reading: 'よむ', group: 'godan', zh: '读' },
    { dict: '売る', reading: 'うる', group: 'godan', zh: '卖' },
    { dict: '撮る', reading: 'とる', group: 'godan', zh: '拍（照）' },
    // fake ichidan（词形像一段，实为五段）
    { dict: '帰る', reading: 'かえる', group: 'godan', fakeIchidan: true, zh: '回去/回来' },
    { dict: '入る', reading: 'はいる', group: 'godan', fakeIchidan: true, zh: '进入' },
    { dict: '走る', reading: 'はしる', group: 'godan', fakeIchidan: true, zh: '跑' },
    { dict: '知る', reading: 'しる', group: 'godan', fakeIchidan: true, zh: '知道' },
    // ---- ichidan ----
    { dict: '食べる', reading: 'たべる', group: 'ichidan', zh: '吃' },
    { dict: '見る', reading: 'みる', group: 'ichidan', zh: '看' },
    { dict: '起きる', reading: 'おきる', group: 'ichidan', zh: '起床' },
    { dict: '寝る', reading: 'ねる', group: 'ichidan', zh: '睡' },
    { dict: '教える', reading: 'おしえる', group: 'ichidan', zh: '教' },
    { dict: '開ける', reading: 'あける', group: 'ichidan', zh: '打开' },
    { dict: '借りる', reading: 'かりる', group: 'ichidan', zh: '借入' },
    // ---- irregular ----
    { dict: 'する', reading: 'する', group: 'irregular', zh: '做' },
    { dict: '来る', reading: 'くる', group: 'irregular', zh: '来' },
    { dict: '勉強する', reading: 'べんきょうする', group: 'irregular', zh: '学习' }
  ],

  iAdjectives: [
    { dict: '高い', reading: 'たかい', zh: '高/贵' },
    { dict: '安い', reading: 'やすい', zh: '便宜' },
    { dict: '大きい', reading: 'おおきい', zh: '大' },
    { dict: '小さい', reading: 'ちいさい', zh: '小' },
    { dict: '新しい', reading: 'あたらしい', zh: '新' },
    { dict: '忙しい', reading: 'いそがしい', zh: '忙' },
    { dict: '暑い', reading: 'あつい', zh: '热' },
    { dict: 'いい', reading: 'いい', irregular: true, zh: '好（不规则：よかった/よくない）' }
  ],

  naAdjectives: [
    { dict: '静か', reading: 'しずか', zh: '安静' },
    { dict: 'にぎやか', reading: 'にぎやか', zh: '热闹' },
    { dict: 'きれい', reading: 'きれい', zh: '漂亮/干净' },
    { dict: '元気', reading: 'げんき', zh: '有精神' },
    { dict: '便利', reading: 'べんり', zh: '方便' },
    { dict: '有名', reading: 'ゆうめい', zh: '有名' }
  ],

  nouns: [
    { dict: '学生', reading: 'がくせい', zh: '学生' },
    { dict: '先生', reading: 'せんせい', zh: '老师' },
    { dict: '休み', reading: 'やすみ', zh: '休息/假期' },
    { dict: '日本人', reading: 'にほんじん', zh: '日本人' },
    { dict: '医者', reading: 'いしゃ', zh: '医生' }
  ]
};
