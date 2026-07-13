/* 随机工具 */
window.MJT = window.MJT || {};

MJT.random = (function () {
  function int(min, max) { // 含两端
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  /* 按权重挑选：items=[{...,weight:n}] */
  function weightedPick(items) {
    var total = 0, i;
    for (i = 0; i < items.length; i++) total += (items[i].weight || 1);
    var r = Math.random() * total;
    for (i = 0; i < items.length; i++) {
      r -= (items[i].weight || 1);
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }
  /* 生成与 correct 不同的 n 个干扰值，maker() 产生候选 */
  function distractors(correct, n, maker, keyFn) {
    var key = keyFn || function (x) { return String(x); };
    var seen = {}; seen[key(correct)] = true;
    var out = [], guard = 0;
    while (out.length < n && guard < 200) {
      guard++;
      var c = maker();
      if (c === null || c === undefined) continue;
      if (seen[key(c)]) continue;
      seen[key(c)] = true;
      out.push(c);
    }
    return out;
  }
  return { int: int, pick: pick, shuffle: shuffle, weightedPick: weightedPick, distractors: distractors };
})();
