/* 本地存储：所有用户数据分键保存于 localStorage，前缀 mjt: */
window.MJT = window.MJT || {};

MJT.storage = (function () {
  var PREFIX = 'mjt:';
  var KEYS = {
    settings: 'settings',
    userProgress: 'user-progress',
    wrongAnswers: 'wrong-answers',
    responseTimes: 'response-times',
    trainingHistory: 'training-history',
    masteryMap: 'mastery-map',
    reviewDecisions: 'review-decisions', // 数据审核页对 pending 条目的核实决定
    importedPending: 'imported-pending', // 用户导入的待审核数据
    lastSession: 'last-session'
  };

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(PREFIX + key);
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[storage] 读取失败:', key, e);
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('[storage] 保存失败:', key, e);
      return false;
    }
  }

  function remove(key) {
    try { localStorage.removeItem(PREFIX + key); } catch (e) {}
  }

  function exportAll() {
    var out = { exportedAt: new Date().toISOString(), app: 'minna-japanese-trainer', data: {} };
    Object.keys(KEYS).forEach(function (k) {
      out.data[KEYS[k]] = load(KEYS[k], null);
    });
    return out;
  }

  function importAll(obj) {
    if (!obj || !obj.data) return false;
    Object.keys(obj.data).forEach(function (k) {
      if (obj.data[k] !== null) save(k, obj.data[k]);
    });
    return true;
  }

  return { KEYS: KEYS, load: load, save: save, remove: remove, exportAll: exportAll, importAll: importAll };
})();
