/* =========================================================================
 * 知识图谱节点索引
 *
 * 本文件是对本仓库 index.html（Japanese Cognitive Atlas）中真实存在的
 * NODES 数据的只读镜像索引（节点 id + 模块 + 中文名），供训练题的
 * knowledgeMap 字段引用与验证器校验使用。
 * 禁止在此添加 Atlas 中不存在的节点；题目引用不在此列表中的节点时，
 * 验证器会把该题的 knowledgeMapStatus 判为无效。
 * 数字/时间/日期/数量词/金额类内容在 Atlas 中暂无对应节点，
 * 相关题目一律 knowledgeMapStatus: 'pending'。
 * ========================================================================= */
window.MJT_DATA = window.MJT_DATA || {};

window.MJT_DATA.knowledgeNodes = [
  // PART 1 · 语言认知（lang-cognition）
  { id: 'lc-word-order', module: 'lang-cognition', zh: '语序与角色分离' },
  { id: 'lc-predicate-core', module: 'lang-cognition', zh: '谓语核心' },
  { id: 'lc-particle-entry', module: 'lang-cognition', zh: '助词入场' },
  { id: 'lc-wa-topic', module: 'lang-cognition', zh: 'は话题标记' },
  { id: 'lc-ga-newinfo', module: 'lang-cognition', zh: 'が新信息' },
  { id: 'lc-verb-engine', module: 'lang-cognition', zh: '活用引擎' },
  { id: 'lc-te-interface', module: 'lang-cognition', zh: 'て形接口' },
  // PART 2 · 核心语法（core-grammar）
  { id: 'cg-pred-three-types', module: 'core-grammar', zh: '谓语三分类' },
  { id: 'cg-copula-da-desu', module: 'core-grammar', zh: 'だ/です系词' },
  { id: 'cg-i-adj-pred', module: 'core-grammar', zh: 'い形容词谓语' },
  { id: 'cg-na-adj-pred', module: 'core-grammar', zh: 'な形容词谓语' },
  { id: 'cg-verb-groups', module: 'core-grammar', zh: '动词分类' },
  { id: 'cg-masu-form', module: 'core-grammar', zh: 'ます形' },
  { id: 'cg-nai-form', module: 'core-grammar', zh: 'ない形' },
  { id: 'cg-te-form-formation', module: 'core-grammar', zh: 'て形音便' },
  { id: 'cg-ta-form', module: 'core-grammar', zh: 'た形' },
  { id: 'cg-p-wo', module: 'core-grammar', zh: 'を格' },
  { id: 'cg-p-ni', module: 'core-grammar', zh: 'に格' },
  { id: 'cg-p-de', module: 'core-grammar', zh: 'で格' },
  { id: 'cg-p-he', module: 'core-grammar', zh: 'へ格' },
  { id: 'cg-p-to', module: 'core-grammar', zh: 'と格' },
  { id: 'cg-p-kara-made', module: 'core-grammar', zh: 'から/まで' },
  { id: 'cg-p-yori', module: 'core-grammar', zh: 'より比较' },
  { id: 'cg-p-mo-dake-shika', module: 'core-grammar', zh: 'も/だけ/しか' },
  { id: 'cg-p-koso-sae', module: 'core-grammar', zh: 'こそ/さえ' },
  { id: 'cg-c-reason', module: 'core-grammar', zh: 'から/ので理由' },
  { id: 'cg-c-kedo-ga', module: 'core-grammar', zh: 'けど/が' },
  { id: 'cg-c-noni', module: 'core-grammar', zh: 'のに' },
  { id: 'cg-c-tari', module: 'core-grammar', zh: 'たり例举' },
  { id: 'cg-c-nagara', module: 'core-grammar', zh: 'ながら' },
  { id: 'cg-c-tame-you', module: 'core-grammar', zh: 'ために/ように' },
  { id: 'cg-c-cond-to-ba', module: 'core-grammar', zh: 'と/ば条件' },
  { id: 'cg-c-cond-tara-nara', module: 'core-grammar', zh: 'たら/なら条件' },
  { id: 'cg-a-teiru', module: 'core-grammar', zh: 'ている' },
  { id: 'cg-a-tearu', module: 'core-grammar', zh: 'てある' },
  { id: 'cg-a-teoku', module: 'core-grammar', zh: 'ておく' },
  { id: 'cg-a-teshimau', module: 'core-grammar', zh: 'てしまう' },
  { id: 'cg-a-tekuru-teiku', module: 'core-grammar', zh: 'てくる/ていく' },
  { id: 'cg-a-tokoro-bakari', module: 'core-grammar', zh: 'ところ/ばかり' },
  { id: 'cg-a-takoto', module: 'core-grammar', zh: 'たことがある' },
  { id: 'cg-m-tai-hoshii', module: 'core-grammar', zh: 'たい/ほしい' },
  { id: 'cg-m-souda-sama', module: 'core-grammar', zh: 'そうだ样态' },
  { id: 'cg-m-souda-denbun', module: 'core-grammar', zh: 'そうだ传闻' },
  { id: 'cg-m-youda-mitai', module: 'core-grammar', zh: 'ようだ/みたい' },
  { id: 'cg-m-rashii', module: 'core-grammar', zh: 'らしい' },
  { id: 'cg-m-hazu-beki', module: 'core-grammar', zh: 'はず/べき' },
  { id: 'cg-m-kamo-chigai', module: 'core-grammar', zh: 'かも/に違いない' },
  { id: 'cg-pol-kudasai', module: 'core-grammar', zh: 'てください' },
  { id: 'cg-pol-temoii', module: 'core-grammar', zh: 'てもいい/てはいけない' },
  { id: 'cg-pol-nakereba', module: 'core-grammar', zh: 'なければならない' },
  { id: 'cg-pol-mashou', module: 'core-grammar', zh: 'ましょう/ませんか' },
  { id: 'cg-pol-keigo', module: 'core-grammar', zh: '敬語三分' },
  { id: 'cg-pol-ladder', module: 'core-grammar', zh: '请求敬度阶梯' }
];
