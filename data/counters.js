/* =========================================================================
 * 数量词数据
 *
 * 读法本身：标准日语通用读法（辞典可核实）→ sourceStatus: verified。
 * 课程归属（该数量词是否在《大家的日语》第21课前出现）：未经用户对照
 * 教材核实 → lessonAttribution.status: 'pending'。
 * 按照真实性原则，不默认任何数量词已在第21课前出现；
 * "教材范围模式"下只有 lessonAttribution 被核实为 verified 的数量词
 * 才会进入训练，"通用读法模式"（明确标注不声明教材出处）下全部可用。
 * ========================================================================= */
window.MJT_DATA = window.MJT_DATA || {};

window.MJT_DATA.counters = [
  {
    id: 'counter-nin', counter: '人', kana: 'にん', zh: '……个人（人数）',
    question: { ja: '何人', kana: 'なんにん' },
    readings: {
      1: 'ひとり', 2: 'ふたり', 3: 'さんにん', 4: 'よにん', 5: 'ごにん',
      6: 'ろくにん', 7: 'しちにん', 8: 'はちにん', 9: 'きゅうにん', 10: 'じゅうにん'
    },
    irregularNote: '1人ひとり・2人ふたり 为固定读法；4人よにん（不读よんにん）。',
    sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: '标准日语通用读法，辞典可核实。',
    lessonAttribution: { lesson: null, status: 'pending', note: '课程出处待对照教材核实' }
  },
  {
    id: 'counter-hon', counter: '本', kana: 'ほん', zh: '……根/瓶/支（细长物）',
    question: { ja: '何本', kana: 'なんぼん' },
    readings: {
      1: 'いっぽん', 2: 'にほん', 3: 'さんぼん', 4: 'よんほん', 5: 'ごほん',
      6: 'ろっぽん', 7: 'ななほん', 8: 'はっぽん', 9: 'きゅうほん', 10: 'じゅっぽん'
    },
    irregularNote: '音变：1/6/8/10→ぽん，3→ぼん，何本→なんぼん。',
    sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: '标准日语通用读法，辞典可核实。',
    lessonAttribution: { lesson: null, status: 'pending', note: '课程出处待对照教材核实' }
  },
  {
    id: 'counter-mai', counter: '枚', kana: 'まい', zh: '……张/件（薄平物）',
    question: { ja: '何枚', kana: 'なんまい' },
    readings: {
      1: 'いちまい', 2: 'にまい', 3: 'さんまい', 4: 'よんまい', 5: 'ごまい',
      6: 'ろくまい', 7: 'ななまい', 8: 'はちまい', 9: 'きゅうまい', 10: 'じゅうまい'
    },
    irregularNote: '无音变，规则读法。',
    sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: '标准日语通用读法，辞典可核实。',
    lessonAttribution: { lesson: null, status: 'pending', note: '课程出处待对照教材核实' }
  },
  {
    id: 'counter-satsu', counter: '冊', kana: 'さつ', zh: '……本/册（书籍）',
    question: { ja: '何冊', kana: 'なんさつ' },
    readings: {
      1: 'いっさつ', 2: 'にさつ', 3: 'さんさつ', 4: 'よんさつ', 5: 'ごさつ',
      6: 'ろくさつ', 7: 'ななさつ', 8: 'はっさつ', 9: 'きゅうさつ', 10: 'じゅっさつ'
    },
    irregularNote: '音变：1→いっさつ，8→はっさつ，10→じゅっさつ。',
    sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: '标准日语通用读法，辞典可核实。',
    lessonAttribution: { lesson: null, status: 'pending', note: '课程出处待对照教材核实' }
  },
  {
    id: 'counter-dai', counter: '台', kana: 'だい', zh: '……台（机器/车辆）',
    question: { ja: '何台', kana: 'なんだい' },
    readings: {
      1: 'いちだい', 2: 'にだい', 3: 'さんだい', 4: 'よんだい', 5: 'ごだい',
      6: 'ろくだい', 7: 'ななだい', 8: 'はちだい', 9: 'きゅうだい', 10: 'じゅうだい'
    },
    irregularNote: '无音变，规则读法。',
    sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: '标准日语通用读法，辞典可核实。',
    lessonAttribution: { lesson: null, status: 'pending', note: '课程出处待对照教材核实' }
  },
  {
    id: 'counter-kai-times', counter: '回', kana: 'かい', zh: '……次（次数）',
    question: { ja: '何回', kana: 'なんかい' },
    readings: {
      1: 'いっかい', 2: 'にかい', 3: 'さんかい', 4: 'よんかい', 5: 'ごかい',
      6: 'ろっかい', 7: 'ななかい', 8: 'はっかい', 9: 'きゅうかい', 10: 'じゅっかい'
    },
    irregularNote: '音变：1/6/8/10→促音（いっかい等）。',
    sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: '标准日语通用读法，辞典可核实。',
    lessonAttribution: { lesson: null, status: 'pending', note: '课程出处待对照教材核实' }
  },
  {
    id: 'counter-kai-floor', counter: '階', kana: 'かい', zh: '……楼/层（楼层）',
    question: { ja: '何階', kana: 'なんがい' },
    readings: {
      1: 'いっかい', 2: 'にかい', 3: 'さんがい', 4: 'よんかい', 5: 'ごかい',
      6: 'ろっかい', 7: 'ななかい', 8: 'はっかい', 9: 'きゅうかい', 10: 'じゅっかい'
    },
    irregularNote: '3階→さんがい（浊音），何階→なんがい；与"回"同音但3階/何階浊化。',
    sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: '标准日语通用读法，辞典可核实。',
    lessonAttribution: { lesson: null, status: 'pending', note: '课程出处待对照教材核实' }
  },
  {
    id: 'counter-hai', counter: '杯', kana: 'はい', zh: '……杯（杯装饮品）',
    question: { ja: '何杯', kana: 'なんばい' },
    readings: {
      1: 'いっぱい', 2: 'にはい', 3: 'さんばい', 4: 'よんはい', 5: 'ごはい',
      6: 'ろっぱい', 7: 'ななはい', 8: 'はっぱい', 9: 'きゅうはい', 10: 'じゅっぱい'
    },
    irregularNote: '音变：1/6/8/10→ぱい，3→ばい，何杯→なんばい。',
    sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: '标准日语通用读法，辞典可核实。',
    lessonAttribution: { lesson: null, status: 'pending', note: '课程出处待对照教材核实' }
  },
  {
    id: 'counter-ko', counter: '個', kana: 'こ', zh: '……个（小物体）',
    question: { ja: '何個', kana: 'なんこ' },
    readings: {
      1: 'いっこ', 2: 'にこ', 3: 'さんこ', 4: 'よんこ', 5: 'ごこ',
      6: 'ろっこ', 7: 'ななこ', 8: 'はっこ', 9: 'きゅうこ', 10: 'じゅっこ'
    },
    irregularNote: '音变：1/6/8/10→促音（いっこ等）。',
    sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: '标准日语通用读法，辞典可核实。',
    lessonAttribution: { lesson: null, status: 'pending', note: '课程出处待对照教材核实' }
  },
  {
    id: 'counter-hiki', counter: '匹', kana: 'ひき', zh: '……只（小动物）',
    question: { ja: '何匹', kana: 'なんびき' },
    readings: {
      1: 'いっぴき', 2: 'にひき', 3: 'さんびき', 4: 'よんひき', 5: 'ごひき',
      6: 'ろっぴき', 7: 'ななひき', 8: 'はっぴき', 9: 'きゅうひき', 10: 'じゅっぴき'
    },
    irregularNote: '音变：1/6/8/10→ぴき，3→びき，何匹→なんびき。',
    sourceStatus: 'verified', sourceType: 'manual_review', reviewed: true,
    sourceReference: '标准日语通用读法，辞典可核实。',
    lessonAttribution: { lesson: null, status: 'pending', note: '课程出处待对照教材核实' }
  }
];
