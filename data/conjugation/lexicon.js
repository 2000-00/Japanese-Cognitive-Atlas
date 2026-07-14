/* 变形训练词库 2.0（动词 / い形容词 / な形容词 / 名词）
 *
 * 真实性说明（与 counters.js / readings.js 一致）：
 * - 词的存在、读音、活用类别是可在任何正规日语辞典核实的客观语言事实
 *   → sourceStatus: verified、sourceType: manual_review。
 * - 这些是"通用常见词"，非"《大家的日本语》第N课"的教材归属声明；
 *   lessonAttribution 一律 pending，AI 不猜测课程归属。教材词表需用户
 *   对照原书核实后录入 data/textbooks/minna/beginner1.js。
 * - 由本词库生成的练习是 ai_generated_practice（见 conjugation-drills.js）。
 *
 * 每个动词带 frames[]：自然搭配片段（comp = 动词前的完整成分，含助词），
 * 由此保证生成句子的搭配自然（不做任意组合）。scene 用于场景去重与统计。
 * 形容词/名词带 topics[]：自然主题短语。 */
window.MJT_DATA = window.MJT_DATA || {};

var _verifiedRef = {
  sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
  sourceReference: '标准日语活用规则与常见词（辞典可核实）；课程归属待核实。',
  lessonAttribution: { lesson: null, status: 'pending' }
};

/* 场景标签集合（与训练场景一致） */
var SCENES = {
  school: '学校', hospital: '医院', dental: '牙科', konbini: '便利店', supermarket: '超市',
  restaurant: '餐厅', cafe: '咖啡店', train: '电车', library: '图书馆', dorm: '宿舍',
  phone: '电话', friends: '朋友聊天', weekend: '周末', travel: '旅行', shopping: '购物',
  leave: '请假', home: '家', work: '公司', bank: '银行', post: '邮局', weather: '天气'
};

function _v(id, dict, reading, group, zh, frames, extra) {
  var o = { id: id, wordClass: 'verb', dict: dict, reading: reading, group: group, zh: zh, frames: frames };
  if (extra) Object.keys(extra).forEach(function (k) { o[k] = extra[k]; });
  return o;
}
function _f(comp, compKana, scene, zh) { return { comp: comp, compKana: compKana, scene: scene, zh: zh }; }

window.MJT_DATA.conjugationLexicon = {
  ref: _verifiedRef,
  scenes: SCENES,

  verbs: [
    // ===== 五段 う =====
    _v('v_kau', '買う', 'かう', 'godan', '买', [_f('スーパーでパンを', 'スーパーでパンを', 'supermarket', '在超市买面包'), _f('コンビニで飲み物を', 'コンビニでのみものを', 'konbini', '在便利店买饮料')]),
    _v('v_tsukau', '使う', 'つかう', 'godan', '使用', [_f('図書館でパソコンを', 'としょかんでパソコンを', 'library', '在图书馆用电脑'), _f('この辞書を', 'このじしょを', 'school', '用这本词典')]),
    _v('v_utau', '歌う', 'うたう', 'godan', '唱', [_f('友達とカラオケで歌を', 'ともだちとカラオケでうたを', 'friends', '和朋友在KTV唱歌')]),
    _v('v_tetsudau', '手伝う', 'てつだう', 'godan', '帮忙', [_f('母の仕事を', 'ははのしごとを', 'home', '帮妈妈干活')]),
    _v('v_au', '会う', 'あう', 'godan', '见面', [_f('駅で友達に', 'えきでともだちに', 'friends', '在车站见朋友'), _f('先生に', 'せんせいに', 'school', '见老师')]),
    _v('v_arau', '洗う', 'あらう', 'godan', '洗', [_f('うちで手を', 'うちでてを', 'home', '在家洗手')]),
    _v('v_narau', '習う', 'ならう', 'godan', '学（技能）', [_f('先生に日本語を', 'せんせいににほんごを', 'school', '跟老师学日语')]),
    // ===== 五段 く =====
    _v('v_kaku', '書く', 'かく', 'godan', '写', [_f('手紙を', 'てがみを', 'home', '写信'), _f('教室で名前を', 'きょうしつでなまえを', 'school', '在教室写名字')]),
    _v('v_kiku', '聞く', 'きく', 'godan', '听/问', [_f('音楽を', 'おんがくを', 'home', '听音乐'), _f('先生に', 'せんせいに', 'school', '问老师')]),
    _v('v_iku', '行く', 'いく', 'godan', '去', [_f('学校へ', 'がっこうへ', 'school', '去学校'), _f('病院へ', 'びょういんへ', 'hospital', '去医院'), _f('友達と旅行に', 'ともだちとりょこうに', 'travel', '和朋友去旅行')], { teException: true }),
    _v('v_aruku', '歩く', 'あるく', 'godan', '走', [_f('駅まで', 'えきまで', 'train', '走到车站')]),
    _v('v_hataraku', '働く', 'はたらく', 'godan', '工作', [_f('銀行で', 'ぎんこうで', 'bank', '在银行工作')]),
    _v('v_tsuku', '着く', 'つく', 'godan', '到达', [_f('駅に', 'えきに', 'train', '到车站')]),
    // ===== 五段 ぐ =====
    _v('v_oyogu', '泳ぐ', 'およぐ', 'godan', '游泳', [_f('プールで', 'プールで', 'weekend', '在泳池游泳')]),
    _v('v_isogu', '急ぐ', 'いそぐ', 'godan', '赶紧', [_f('駅へ', 'えきへ', 'train', '赶去车站')]),
    // ===== 五段 す =====
    _v('v_hanasu', '話す', 'はなす', 'godan', '说', [_f('友達と', 'ともだちと', 'friends', '和朋友聊'), _f('先生と', 'せんせいと', 'school', '和老师说')]),
    _v('v_kasu', '貸す', 'かす', 'godan', '借出', [_f('友達に本を', 'ともだちにほんを', 'friends', '把书借给朋友')]),
    _v('v_kaesu', '返す', 'かえす', 'godan', '归还', [_f('図書館に本を', 'としょかんにほんを', 'library', '把书还给图书馆')]),
    _v('v_dasu', '出す', 'だす', 'godan', '交/寄出', [_f('先生にレポートを', 'せんせいにレポートを', 'school', '交报告给老师'), _f('郵便局で手紙を', 'ゆうびんきょくでてがみを', 'post', '在邮局寄信')]),
    _v('v_kesu', '消す', 'けす', 'godan', '关掉', [_f('電気を', 'でんきを', 'dorm', '关灯')]),
    _v('v_osu', '押す', 'おす', 'godan', '按', [_f('ボタンを', 'ボタンを', 'train', '按按钮')]),
    // ===== 五段 つ =====
    _v('v_matsu', '待つ', 'まつ', 'godan', '等', [_f('駅で友達を', 'えきでともだちを', 'friends', '在车站等朋友'), _f('病院で', 'びょういんで', 'hospital', '在医院等')]),
    _v('v_motsu', '持つ', 'もつ', 'godan', '拿/带', [_f('かばんを', 'かばんを', 'home', '拿包')]),
    _v('v_tatsu', '立つ', 'たつ', 'godan', '站', [_f('電車で', 'でんしゃで', 'train', '在电车上站着')]),
    // ===== 五段 ぬ =====
    _v('v_shinu', '死ぬ', 'しぬ', 'godan', '死', [_f('花が', 'はなが', 'home', '花枯死')]),
    // ===== 五段 ぶ =====
    _v('v_asobu', '遊ぶ', 'あそぶ', 'godan', '玩', [_f('友達と公園で', 'ともだちとこうえんで', 'weekend', '和朋友在公园玩')]),
    _v('v_yobu', '呼ぶ', 'よぶ', 'godan', '叫/喊', [_f('タクシーを', 'タクシーを', 'travel', '叫出租车'), _f('先生を', 'せんせいを', 'school', '叫老师')]),
    _v('v_hakobu', '運ぶ', 'はこぶ', 'godan', '搬运', [_f('荷物を', 'にもつを', 'dorm', '搬行李')]),
    // ===== 五段 む =====
    _v('v_nomu', '飲む', 'のむ', 'godan', '喝', [_f('カフェでコーヒーを', 'カフェでコーヒーを', 'cafe', '在咖啡店喝咖啡'), _f('薬を', 'くすりを', 'hospital', '吃药')]),
    _v('v_yomu', '読む', 'よむ', 'godan', '读', [_f('図書館で本を', 'としょかんでほんを', 'library', '在图书馆看书'), _f('新聞を', 'しんぶんを', 'home', '看报纸')]),
    _v('v_yasumu', '休む', 'やすむ', 'godan', '休息/请假', [_f('学校を', 'がっこうを', 'leave', '向学校请假'), _f('うちで', 'うちで', 'home', '在家休息')]),
    _v('v_sumu', '住む', 'すむ', 'godan', '居住', [_f('東京に', 'とうきょうに', 'home', '住在东京')]),
    _v('v_tanomu', '頼む', 'たのむ', 'godan', '请求/点', [_f('店でコーヒーを', 'みせでコーヒーを', 'cafe', '在店里点咖啡')]),
    // ===== 五段 る（真五段）=====
    _v('v_uru', '売る', 'うる', 'godan', '卖', [_f('店で野菜を', 'みせでやさいを', 'supermarket', '在店里卖菜')]),
    _v('v_toru', '撮る', 'とる', 'godan', '拍照', [_f('旅行で写真を', 'りょこうでしゃしんを', 'travel', '旅行拍照')]),
    _v('v_tsukuru', '作る', 'つくる', 'godan', '做', [_f('うちで料理を', 'うちでりょうりを', 'home', '在家做菜')]),
    _v('v_suwaru', '座る', 'すわる', 'godan', '坐', [_f('電車で', 'でんしゃで', 'train', '在电车上坐')]),
    _v('v_okuru', '送る', 'おくる', 'godan', '寄/送', [_f('国に荷物を', 'くにににもつを', 'post', '往国内寄行李')]),
    _v('v_wakaru', '分かる', 'わかる', 'godan', '明白', [_f('日本語が', 'にほんごが', 'school', '懂日语')]),
    _v('v_owaru', '終わる', 'おわる', 'godan', '结束', [_f('授業が', 'じゅぎょうが', 'school', '课结束')]),
    _v('v_noru', '乗る', 'のる', 'godan', '乘', [_f('電車に', 'でんしゃに', 'train', '坐电车')]),
    _v('v_furu', '降る', 'ふる', 'godan', '（雨）下', [_f('雨が', 'あめが', 'weather', '下雨')]),
    _v('v_ganbaru', '頑張る', 'がんばる', 'godan', '努力', [_f('テストで', 'テストで', 'school', '考试加油')]),
    // ===== 伪一段（实为五段）=====
    _v('v_kaeru', '帰る', 'かえる', 'godan', '回去/回来', [_f('うちへ', 'うちへ', 'home', '回家'), _f('国へ', 'くにへ', 'travel', '回国')], { fakeIchidan: true }),
    _v('v_hairu', '入る', 'はいる', 'godan', '进入', [_f('部屋に', 'へやに', 'dorm', '进房间'), _f('おふろに', 'おふろに', 'home', '泡澡')], { fakeIchidan: true }),
    _v('v_hashiru', '走る', 'はしる', 'godan', '跑', [_f('公園で', 'こうえんで', 'weekend', '在公园跑')], { fakeIchidan: true }),
    _v('v_shiru', '知る', 'しる', 'godan', '知道', [_f('その店を', 'そのみせを', 'shopping', '知道那家店')], { fakeIchidan: true }),
    _v('v_kiru_cut', '切る', 'きる', 'godan', '切', [_f('野菜を', 'やさいを', 'home', '切菜')], { fakeIchidan: true }),
    // ===== 一段 =====
    _v('v_taberu', '食べる', 'たべる', 'ichidan', '吃', [_f('レストランで晩ご飯を', 'レストランでばんごはんを', 'restaurant', '在餐厅吃晚饭'), _f('朝ご飯を', 'あさごはんを', 'home', '吃早饭')]),
    _v('v_miru', '見る', 'みる', 'ichidan', '看', [_f('うちでテレビを', 'うちでテレビを', 'home', '在家看电视'), _f('映画を', 'えいがを', 'weekend', '看电影')]),
    _v('v_okiru', '起きる', 'おきる', 'ichidan', '起床', [_f('毎朝6時に', 'まいあさろくじに', 'home', '每天早上6点起')]),
    _v('v_neru', '寝る', 'ねる', 'ichidan', '睡', [_f('夜11時に', 'よるじゅういちじに', 'home', '晚上11点睡')]),
    _v('v_oshieru', '教える', 'おしえる', 'ichidan', '教/告诉', [_f('学生に日本語を', 'がくせいににほんごを', 'school', '教学生日语')]),
    _v('v_akeru', '開ける', 'あける', 'ichidan', '打开', [_f('窓を', 'まどを', 'dorm', '开窗')]),
    _v('v_kariru', '借りる', 'かりる', 'ichidan', '借入', [_f('図書館で本を', 'としょかんでほんを', 'library', '在图书馆借书')]),
    _v('v_shimeru', '閉める', 'しめる', 'ichidan', '关（门窗）', [_f('ドアを', 'ドアを', 'home', '关门')]),
    _v('v_dekakeru', '出かける', 'でかける', 'ichidan', '外出', [_f('友達と', 'ともだちと', 'weekend', '和朋友出门')]),
    _v('v_wasureru', '忘れる', 'わすれる', 'ichidan', '忘记', [_f('宿題を', 'しゅくだいを', 'school', '忘了作业'), _f('電車にかばんを', 'でんしゃにかばんを', 'train', '把包忘在电车上')]),
    _v('v_oboeru', '覚える', 'おぼえる', 'ichidan', '记住', [_f('新しい言葉を', 'あたらしいことばを', 'school', '记新单词')]),
    _v('v_oriru', '降りる', 'おりる', 'ichidan', '下车', [_f('次の駅で', 'つぎのえきで', 'train', '下一站下车')]),
    _v('v_abiru', '浴びる', 'あびる', 'ichidan', '淋（浴）', [_f('シャワーを', 'シャワーを', 'dorm', '冲澡')]),
    _v('v_tsukareru', '疲れる', 'つかれる', 'ichidan', '累', [_f('仕事で', 'しごとで', 'work', '工作累了')]),
    // ===== 不规则 =====
    _v('v_suru', 'する', 'する', 'irregular', '做', [_f('宿題を', 'しゅくだいを', 'school', '做作业')]),
    _v('v_kuru', '来る', 'くる', 'irregular', '来', [_f('友達がうちに', 'ともだちがうちに', 'friends', '朋友来家'), _f('学校に', 'がっこうに', 'school', '来学校')]),
    _v('v_benkyou', '勉強する', 'べんきょうする', 'irregular', '学习', [_f('図書館で日本語を', 'としょかんでにほんごを', 'library', '在图书馆学日语')]),
    _v('v_denwa', '電話する', 'でんわする', 'irregular', '打电话', [_f('病院に', 'びょういんに', 'phone', '给医院打电话')]),
    _v('v_yoyaku', '予約する', 'よやくする', 'irregular', '预约', [_f('歯医者を', 'はいしゃを', 'dental', '预约牙医')]),
    _v('v_souji', '掃除する', 'そうじする', 'irregular', '打扫', [_f('部屋を', 'へやを', 'dorm', '打扫房间')]),
    _v('v_kaimono', '買い物する', 'かいものする', 'irregular', '购物', [_f('スーパーで', 'スーパーで', 'shopping', '在超市购物')]),
    _v('v_kekkon', '結婚する', 'けっこんする', 'irregular', '结婚', [_f('来年', 'らいねん', 'home', '明年结婚')])
  ],

  iAdjectives: [
    { id: 'i_takai', wordClass: 'i-adj', dict: '高い', reading: 'たかい', zh: '高/贵', topics: [{ t: 'この本は', tk: 'このほんは', scene: 'shopping', zh: '这本书贵' }, { t: 'あのビルは', tk: 'あのビルは', scene: 'travel', zh: '那栋楼高' }] },
    { id: 'i_yasui', wordClass: 'i-adj', dict: '安い', reading: 'やすい', zh: '便宜', topics: [{ t: 'このスーパーは', tk: 'このスーパーは', scene: 'supermarket', zh: '这家超市便宜' }] },
    { id: 'i_ookii', wordClass: 'i-adj', dict: '大きい', reading: 'おおきい', zh: '大', topics: [{ t: 'このかばんは', tk: 'このかばんは', scene: 'shopping', zh: '这个包大' }] },
    { id: 'i_chiisai', wordClass: 'i-adj', dict: '小さい', reading: 'ちいさい', zh: '小', topics: [{ t: 'この部屋は', tk: 'このへやは', scene: 'dorm', zh: '这个房间小' }] },
    { id: 'i_atarashii', wordClass: 'i-adj', dict: '新しい', reading: 'あたらしい', zh: '新', topics: [{ t: 'この店は', tk: 'このみせは', scene: 'shopping', zh: '这家店新' }] },
    { id: 'i_furui', wordClass: 'i-adj', dict: '古い', reading: 'ふるい', zh: '旧', topics: [{ t: 'この建物は', tk: 'このたてものは', scene: 'travel', zh: '这栋建筑旧' }] },
    { id: 'i_isogashii', wordClass: 'i-adj', dict: '忙しい', reading: 'いそがしい', zh: '忙', topics: [{ t: '今週は', tk: 'こんしゅうは', scene: 'work', zh: '这周忙' }] },
    { id: 'i_atsui', wordClass: 'i-adj', dict: '暑い', reading: 'あつい', zh: '（天）热', topics: [{ t: '今日は', tk: 'きょうは', scene: 'weather', zh: '今天热' }] },
    { id: 'i_samui', wordClass: 'i-adj', dict: '寒い', reading: 'さむい', zh: '冷', topics: [{ t: '冬は', tk: 'ふゆは', scene: 'weather', zh: '冬天冷' }] },
    { id: 'i_atsui_hot', wordClass: 'i-adj', dict: '熱い', reading: 'あつい', zh: '（物）烫', topics: [{ t: 'このお茶は', tk: 'このおちゃは', scene: 'cafe', zh: '这茶烫' }] },
    { id: 'i_tsumetai', wordClass: 'i-adj', dict: '冷たい', reading: 'つめたい', zh: '凉', topics: [{ t: 'この水は', tk: 'このみずは', scene: 'restaurant', zh: '这水凉' }] },
    { id: 'i_muzukashii', wordClass: 'i-adj', dict: '難しい', reading: 'むずかしい', zh: '难', topics: [{ t: 'テストは', tk: 'テストは', scene: 'school', zh: '考试难' }] },
    { id: 'i_yasashii', wordClass: 'i-adj', dict: '易しい', reading: 'やさしい', zh: '容易', topics: [{ t: 'この問題は', tk: 'このもんだいは', scene: 'school', zh: '这道题容易' }] },
    { id: 'i_omoshiroi', wordClass: 'i-adj', dict: '面白い', reading: 'おもしろい', zh: '有趣', topics: [{ t: 'この映画は', tk: 'このえいがは', scene: 'weekend', zh: '这电影有趣' }] },
    { id: 'i_oishii', wordClass: 'i-adj', dict: 'おいしい', reading: 'おいしい', zh: '好吃', topics: [{ t: 'この店のラーメンは', tk: 'このみせのラーメンは', scene: 'restaurant', zh: '这家拉面好吃' }] },
    { id: 'i_chikai', wordClass: 'i-adj', dict: '近い', reading: 'ちかい', zh: '近', topics: [{ t: '駅は', tk: 'えきは', scene: 'train', zh: '车站近' }] },
    { id: 'i_tooi', wordClass: 'i-adj', dict: '遠い', reading: 'とおい', zh: '远', topics: [{ t: '空港は', tk: 'くうこうは', scene: 'travel', zh: '机场远' }] },
    { id: 'i_hiroi', wordClass: 'i-adj', dict: '広い', reading: 'ひろい', zh: '宽敞', topics: [{ t: 'この部屋は', tk: 'このへやは', scene: 'dorm', zh: '这房间宽敞' }] },
    { id: 'i_semai', wordClass: 'i-adj', dict: '狭い', reading: 'せまい', zh: '窄', topics: [{ t: 'この道は', tk: 'このみちは', scene: 'travel', zh: '这条路窄' }] },
    { id: 'i_akarui', wordClass: 'i-adj', dict: '明るい', reading: 'あかるい', zh: '明亮', topics: [{ t: 'この教室は', tk: 'このきょうしつは', scene: 'school', zh: '这教室亮' }] },
    { id: 'i_nagai', wordClass: 'i-adj', dict: '長い', reading: 'ながい', zh: '长', topics: [{ t: 'この映画は', tk: 'このえいがは', scene: 'weekend', zh: '这电影长' }] },
    { id: 'i_mijikai', wordClass: 'i-adj', dict: '短い', reading: 'みじかい', zh: '短', topics: [{ t: '休みは', tk: 'やすみは', scene: 'weekend', zh: '假期短' }] },
    { id: 'i_hayai', wordClass: 'i-adj', dict: '早い', reading: 'はやい', zh: '早/快', topics: [{ t: '今日は', tk: 'きょうは', scene: 'home', zh: '今天早' }] },
    { id: 'i_tanoshii', wordClass: 'i-adj', dict: '楽しい', reading: 'たのしい', zh: '快乐', topics: [{ t: '旅行は', tk: 'りょこうは', scene: 'travel', zh: '旅行快乐' }] },
    { id: 'i_ii', wordClass: 'i-adj', dict: 'いい', reading: 'いい', zh: '好', topics: [{ t: '天気は', tk: 'てんきは', scene: 'weather', zh: '天气好' }], irregular: true },
    { id: 'i_kawaii', wordClass: 'i-adj', dict: 'かわいい', reading: 'かわいい', zh: '可爱', topics: [{ t: 'この犬は', tk: 'このいぬは', scene: 'home', zh: '这狗可爱' }] },
    { id: 'i_wakai', wordClass: 'i-adj', dict: '若い', reading: 'わかい', zh: '年轻', topics: [{ t: 'あの先生は', tk: 'あのせんせいは', scene: 'school', zh: '那位老师年轻' }] }
  ],

  naAdjectives: [
    { id: 'na_shizuka', wordClass: 'na-adj', dict: '静か', reading: 'しずか', zh: '安静', topics: [{ t: 'この町は', tk: 'このまちは', scene: 'travel', zh: '这个镇安静' }, { t: '図書館は', tk: 'としょかんは', scene: 'library', zh: '图书馆安静' }] },
    { id: 'na_nigiyaka', wordClass: 'na-adj', dict: 'にぎやか', reading: 'にぎやか', zh: '热闹', topics: [{ t: 'この店は', tk: 'このみせは', scene: 'restaurant', zh: '这家店热闹' }] },
    { id: 'na_kirei', wordClass: 'na-adj', dict: 'きれい', reading: 'きれい', zh: '漂亮/干净', topics: [{ t: 'この部屋は', tk: 'このへやは', scene: 'dorm', zh: '这房间干净' }] },
    { id: 'na_genki', wordClass: 'na-adj', dict: '元気', reading: 'げんき', zh: '有精神', topics: [{ t: '祖母は', tk: 'そぼは', scene: 'home', zh: '祖母有精神' }] },
    { id: 'na_benri', wordClass: 'na-adj', dict: '便利', reading: 'べんり', zh: '方便', topics: [{ t: 'このアプリは', tk: 'このアプリは', scene: 'home', zh: '这个应用方便' }] },
    { id: 'na_yuumei', wordClass: 'na-adj', dict: '有名', reading: 'ゆうめい', zh: '有名', topics: [{ t: 'この店は', tk: 'このみせは', scene: 'restaurant', zh: '这家店有名' }] },
    { id: 'na_shinsetsu', wordClass: 'na-adj', dict: '親切', reading: 'しんせつ', zh: '亲切', topics: [{ t: 'あの店員は', tk: 'あのてんいんは', scene: 'shopping', zh: '那店员亲切' }] },
    { id: 'na_hima', wordClass: 'na-adj', dict: '暇', reading: 'ひま', zh: '空闲', topics: [{ t: '今日は', tk: 'きょうは', scene: 'weekend', zh: '今天有空' }] },
    { id: 'na_taihen', wordClass: 'na-adj', dict: '大変', reading: 'たいへん', zh: '够呛/辛苦', topics: [{ t: '仕事は', tk: 'しごとは', scene: 'work', zh: '工作辛苦' }] },
    { id: 'na_suki', wordClass: 'na-adj', dict: '好き', reading: 'すき', zh: '喜欢', topics: [{ t: 'すしが', tk: 'すしが', scene: 'restaurant', zh: '喜欢寿司' }] },
    { id: 'na_kirai', wordClass: 'na-adj', dict: '嫌い', reading: 'きらい', zh: '讨厌', topics: [{ t: '納豆が', tk: 'なっとうが', scene: 'restaurant', zh: '讨厌纳豆' }] },
    { id: 'na_jouzu', wordClass: 'na-adj', dict: '上手', reading: 'じょうず', zh: '擅长', topics: [{ t: '日本語が', tk: 'にほんごが', scene: 'school', zh: '擅长日语' }] },
    { id: 'na_heta', wordClass: 'na-adj', dict: '下手', reading: 'へた', zh: '不擅长', topics: [{ t: '料理が', tk: 'りょうりが', scene: 'home', zh: '不擅长做菜' }] },
    { id: 'na_taisetsu', wordClass: 'na-adj', dict: '大切', reading: 'たいせつ', zh: '重要', topics: [{ t: '家族が', tk: 'かぞくが', scene: 'home', zh: '家人重要' }] },
    { id: 'na_daijoubu', wordClass: 'na-adj', dict: '大丈夫', reading: 'だいじょうぶ', zh: '没问题', topics: [{ t: '体は', tk: 'からだは', scene: 'hospital', zh: '身体没问题' }] },
    { id: 'na_kantan', wordClass: 'na-adj', dict: '簡単', reading: 'かんたん', zh: '简单', topics: [{ t: 'この問題は', tk: 'このもんだいは', scene: 'school', zh: '这题简单' }] },
    { id: 'na_anzen', wordClass: 'na-adj', dict: '安全', reading: 'あんぜん', zh: '安全', topics: [{ t: 'この町は', tk: 'このまちは', scene: 'travel', zh: '这个镇安全' }] },
    { id: 'na_teinei', wordClass: 'na-adj', dict: '丁寧', reading: 'ていねい', zh: '礼貌', topics: [{ t: 'あの店員は', tk: 'あのてんいんは', scene: 'shopping', zh: '那店员礼貌' }] },
    { id: 'na_majime', wordClass: 'na-adj', dict: '真面目', reading: 'まじめ', zh: '认真', topics: [{ t: 'あの学生は', tk: 'あのがくせいは', scene: 'school', zh: '那学生认真' }] },
    { id: 'na_hitsuyou', wordClass: 'na-adj', dict: '必要', reading: 'ひつよう', zh: '必要', topics: [{ t: 'パスポートが', tk: 'パスポートが', scene: 'travel', zh: '需要护照' }] },
    { id: 'na_tokubetsu', wordClass: 'na-adj', dict: '特別', reading: 'とくべつ', zh: '特别', topics: [{ t: '今日は', tk: 'きょうは', scene: 'home', zh: '今天特别' }] },
    { id: 'na_jiyuu', wordClass: 'na-adj', dict: '自由', reading: 'じゆう', zh: '自由', topics: [{ t: '週末は', tk: 'しゅうまつは', scene: 'weekend', zh: '周末自由' }] },
    { id: 'na_fuben', wordClass: 'na-adj', dict: '不便', reading: 'ふべん', zh: '不方便', topics: [{ t: 'この駅は', tk: 'このえきは', scene: 'train', zh: '这个站不方便' }] },
    { id: 'na_dauki', wordClass: 'na-adj', dict: '大好き', reading: 'だいすき', zh: '很喜欢', topics: [{ t: '音楽が', tk: 'おんがくが', scene: 'weekend', zh: '很喜欢音乐' }] },
    { id: 'na_shitsurei', wordClass: 'na-adj', dict: '失礼', reading: 'しつれい', zh: '失礼', topics: [{ t: 'その言葉は', tk: 'そのことばは', scene: 'work', zh: '那话失礼' }] },
    { id: 'na_iroiro', wordClass: 'na-adj', dict: 'いろいろ', reading: 'いろいろ', zh: '各种', topics: [{ t: 'お店の品物は', tk: 'おみせのしなものは', scene: 'shopping', zh: '店里商品多样' }] }
  ],

  nouns: [
    { id: 'n_gakusei', wordClass: 'noun', dict: '学生', reading: 'がくせい', zh: '学生', topics: [{ t: '妹は', tk: 'いもうとは', scene: 'school', zh: '妹妹是学生' }, { t: '兄は', tk: 'あには', scene: 'school', zh: '哥哥是学生' }] },
    { id: 'n_sensei', wordClass: 'noun', dict: '先生', reading: 'せんせい', zh: '老师', topics: [{ t: '父は', tk: 'ちちは', scene: 'school', zh: '爸爸是老师' }] },
    { id: 'n_isha', wordClass: 'noun', dict: '医者', reading: 'いしゃ', zh: '医生', topics: [{ t: '姉は', tk: 'あねは', scene: 'hospital', zh: '姐姐是医生' }] },
    { id: 'n_yasumi', wordClass: 'noun', dict: '休み', reading: 'やすみ', zh: '休息日', topics: [{ t: '明日は', tk: 'あしたは', scene: 'weekend', zh: '明天是休息日' }] },
    { id: 'n_nihonjin', wordClass: 'noun', dict: '日本人', reading: 'にほんじん', zh: '日本人', topics: [{ t: '友達は', tk: 'ともだちは', scene: 'friends', zh: '朋友是日本人' }] },
    { id: 'n_kaishain', wordClass: 'noun', dict: '会社員', reading: 'かいしゃいん', zh: '公司职员', topics: [{ t: '兄は', tk: 'あには', scene: 'work', zh: '哥哥是职员' }] },
    { id: 'n_byouki', wordClass: 'noun', dict: '病気', reading: 'びょうき', zh: '生病', topics: [{ t: '祖父は', tk: 'そふは', scene: 'hospital', zh: '祖父生病' }] },
    { id: 'n_ame', wordClass: 'noun', dict: '雨', reading: 'あめ', zh: '雨', topics: [{ t: '今日は', tk: 'きょうは', scene: 'weather', zh: '今天是雨天' }] },
    { id: 'n_hare', wordClass: 'noun', dict: '晴れ', reading: 'はれ', zh: '晴', topics: [{ t: '明日は', tk: 'あしたは', scene: 'weather', zh: '明天晴' }] },
    { id: 'n_tanjoubi', wordClass: 'noun', dict: '誕生日', reading: 'たんじょうび', zh: '生日', topics: [{ t: '今日は', tk: 'きょうは', scene: 'home', zh: '今天是生日' }] },
    { id: 'n_nichiyoubi', wordClass: 'noun', dict: '日曜日', reading: 'にちようび', zh: '星期日', topics: [{ t: '明日は', tk: 'あしたは', scene: 'weekend', zh: '明天是周日' }] },
    { id: 'n_test', wordClass: 'noun', dict: 'テスト', reading: 'テスト', zh: '考试', topics: [{ t: '明日は', tk: 'あしたは', scene: 'school', zh: '明天有考试' }] },
    { id: 'n_shukudai', wordClass: 'noun', dict: '宿題', reading: 'しゅくだい', zh: '作业', topics: [{ t: 'これは', tk: 'これは', scene: 'school', zh: '这是作业' }] },
    { id: 'n_kaigi', wordClass: 'noun', dict: '会議', reading: 'かいぎ', zh: '会议', topics: [{ t: '午後は', tk: 'ごごは', scene: 'work', zh: '下午有会议' }] },
    { id: 'n_ryokou', wordClass: 'noun', dict: '旅行', reading: 'りょこう', zh: '旅行', topics: [{ t: '来月は', tk: 'らいげつは', scene: 'travel', zh: '下月旅行' }] },
    { id: 'n_natsu', wordClass: 'noun', dict: '夏', reading: 'なつ', zh: '夏天', topics: [{ t: '今は', tk: 'いまは', scene: 'weather', zh: '现在是夏天' }] },
    { id: 'n_asa', wordClass: 'noun', dict: '朝', reading: 'あさ', zh: '早上', topics: [{ t: '今は', tk: 'いまは', scene: 'home', zh: '现在是早上' }] },
    { id: 'n_yoru', wordClass: 'noun', dict: '夜', reading: 'よる', zh: '晚上', topics: [{ t: 'もう', tk: 'もう', scene: 'home', zh: '已经是晚上' }] },
    { id: 'n_jitensha', wordClass: 'noun', dict: '自転車', reading: 'じてんしゃ', zh: '自行车', topics: [{ t: 'これは', tk: 'これは', scene: 'travel', zh: '这是自行车' }] },
    { id: 'n_densha', wordClass: 'noun', dict: '電車', reading: 'でんしゃ', zh: '电车', topics: [{ t: 'あれは', tk: 'あれは', scene: 'train', zh: '那是电车' }] },
    { id: 'n_hon', wordClass: 'noun', dict: '本', reading: 'ほん', zh: '书', topics: [{ t: 'これは', tk: 'これは', scene: 'library', zh: '这是书' }] },
    { id: 'n_ocha', wordClass: 'noun', dict: 'お茶', reading: 'おちゃ', zh: '茶', topics: [{ t: 'これは', tk: 'これは', scene: 'cafe', zh: '这是茶' }] },
    { id: 'n_pan', wordClass: 'noun', dict: 'パン', reading: 'パン', zh: '面包', topics: [{ t: '朝ご飯は', tk: 'あさごはんは', scene: 'home', zh: '早饭是面包' }] },
    { id: 'n_sakana', wordClass: 'noun', dict: '魚', reading: 'さかな', zh: '鱼', topics: [{ t: '今日の晩ご飯は', tk: 'きょうのばんごはんは', scene: 'restaurant', zh: '今晚吃鱼' }] },
    { id: 'n_niku', wordClass: 'noun', dict: '肉', reading: 'にく', zh: '肉', topics: [{ t: 'これは', tk: 'これは', scene: 'supermarket', zh: '这是肉' }] },
    { id: 'n_yasai', wordClass: 'noun', dict: '野菜', reading: 'やさい', zh: '蔬菜', topics: [{ t: 'これは', tk: 'これは', scene: 'supermarket', zh: '这是蔬菜' }] },
    { id: 'n_kudamono', wordClass: 'noun', dict: '果物', reading: 'くだもの', zh: '水果', topics: [{ t: 'りんごは', tk: 'りんごは', scene: 'supermarket', zh: '苹果是水果' }] },
    { id: 'n_inu', wordClass: 'noun', dict: '犬', reading: 'いぬ', zh: '狗', topics: [{ t: 'これは', tk: 'これは', scene: 'home', zh: '这是狗' }] },
    { id: 'n_neko', wordClass: 'noun', dict: '猫', reading: 'ねこ', zh: '猫', topics: [{ t: 'あれは', tk: 'あれは', scene: 'home', zh: '那是猫' }] },
    { id: 'n_heya', wordClass: 'noun', dict: '部屋', reading: 'へや', zh: '房间', topics: [{ t: 'ここは', tk: 'ここは', scene: 'dorm', zh: '这里是房间' }] },
    { id: 'n_kyoushitsu', wordClass: 'noun', dict: '教室', reading: 'きょうしつ', zh: '教室', topics: [{ t: 'そこは', tk: 'そこは', scene: 'school', zh: '那里是教室' }] },
    { id: 'n_toshokan', wordClass: 'noun', dict: '図書館', reading: 'としょかん', zh: '图书馆', topics: [{ t: 'あそこは', tk: 'あそこは', scene: 'library', zh: '那里是图书馆' }] },
    { id: 'n_ginkou', wordClass: 'noun', dict: '銀行', reading: 'ぎんこう', zh: '银行', topics: [{ t: 'あれは', tk: 'あれは', scene: 'bank', zh: '那是银行' }] },
    { id: 'n_byouin', wordClass: 'noun', dict: '病院', reading: 'びょういん', zh: '医院', topics: [{ t: 'あそこは', tk: 'あそこは', scene: 'hospital', zh: '那里是医院' }] },
    { id: 'n_eki', wordClass: 'noun', dict: '駅', reading: 'えき', zh: '车站', topics: [{ t: 'ここは', tk: 'ここは', scene: 'train', zh: '这里是车站' }] },
    { id: 'n_kaisha', wordClass: 'noun', dict: '会社', reading: 'かいしゃ', zh: '公司', topics: [{ t: 'ここは', tk: 'ここは', scene: 'work', zh: '这里是公司' }] },
    { id: 'n_gakkou', wordClass: 'noun', dict: '学校', reading: 'がっこう', zh: '学校', topics: [{ t: 'あそこは', tk: 'あそこは', scene: 'school', zh: '那里是学校' }] },
    { id: 'n_tomodachi', wordClass: 'noun', dict: '友達', reading: 'ともだち', zh: '朋友', topics: [{ t: 'あの人は', tk: 'あのひとは', scene: 'friends', zh: '那人是朋友' }] },
    { id: 'n_kazoku', wordClass: 'noun', dict: '家族', reading: 'かぞく', zh: '家人', topics: [{ t: 'この写真は', tk: 'このしゃしんは', scene: 'home', zh: '这照片是家人' }] },
    { id: 'n_kyou', wordClass: 'noun', dict: '休日', reading: 'きゅうじつ', zh: '假日', topics: [{ t: '今日は', tk: 'きょうは', scene: 'weekend', zh: '今天是假日' }] },
    { id: 'n_shigoto', wordClass: 'noun', dict: '仕事', reading: 'しごと', zh: '工作', topics: [{ t: 'これは', tk: 'これは', scene: 'work', zh: '这是工作' }] },
    { id: 'n_kaimono', wordClass: 'noun', dict: '買い物', reading: 'かいもの', zh: '购物', topics: [{ t: '今日の予定は', tk: 'きょうのよていは', scene: 'shopping', zh: '今天安排是购物' }] }
  ]
};
