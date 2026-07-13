/* Minna Japanese Trainer — 应用外壳：路由、导航、各页面 */
window.MJT = window.MJT || {};

MJT.app = (function () {
  var esc = function (s) { return MJT.session.esc(s); };
  var fmtSec = function (ms) { return MJT.session.fmtSec(ms); };

  /* ============ 设置 ============ */
  var DEFAULT_SETTINGS = {
    maxLesson: 21,          // 学习范围上限（1~21）
    questionCount: 10,      // 每组题目数量
    difficulty: 1,          // 1基础 2初级 3综合
    showKana: true,
    showZh: true,
    ttsRate: 1,
    volume: 1,
    autoNext: false,
    timing: true,
    theme: 'auto',          // auto | light | dark
    fontSize: 'normal',     // normal | large | xlarge
    counterMode: 'universal', // universal=通用读法模式 | textbook=教材范围模式
    adaptiveNext: true,     // 根据错题自动生成下一组
    extendedVocab: 'light', // off=100%教材范围 | light=少量扩展（推荐） | normal=正常生活模式
    listeningLevel: 3       // 听力默认等级（Level 3）
  };

  function getSettings() {
    var s = MJT.storage.load(MJT.storage.KEYS.settings, {});
    var out = {};
    Object.keys(DEFAULT_SETTINGS).forEach(function (k) {
      out[k] = s[k] !== undefined ? s[k] : DEFAULT_SETTINGS[k];
    });
    return out;
  }
  function saveSettings(patch) {
    var s = getSettings();
    Object.keys(patch).forEach(function (k) { s[k] = patch[k]; });
    MJT.storage.save(MJT.storage.KEYS.settings, s);
    applyTheme();
    return s;
  }

  function applyTheme() {
    var s = getSettings();
    var root = document.documentElement;
    var dark = s.theme === 'dark' || (s.theme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    root.setAttribute('data-fontsize', s.fontSize);
  }

  function saveLastSession(info) {
    MJT.storage.save(MJT.storage.KEYS.lastSession, info);
  }

  /* 用户导入的待审核数据（localStorage）。kind=null 返回全部 */
  function importedItems(kind) {
    var all = MJT.storage.load('imported-pending', []);
    if (!kind) return all;
    return all.filter(function (it) { return it.importKind === kind; });
  }

  /* ============ 路由 ============ */
  var PAGES = [
    { id: 'home', name: '首页', icon: '🏠' },
    { id: 'today', name: '今日训练', icon: '📅' },
    { id: 'scenario', name: '场景训练', icon: '🎬' },
    { id: 'numbers', name: '数字专项', icon: '🔢' },
    { id: 'listening', name: '听力训练', icon: '🎧' },
    { id: 'grammar', name: '语法训练', icon: '📖' },
    { id: 'reading', name: '阅读训练', icon: '📄' },
    { id: 'mixed', name: '综合训练', icon: '🎯' },
    { id: 'errorbook', name: '错题本', icon: '📕' },
    { id: 'stats', name: '学习统计', icon: '📊' },
    { id: 'knowledge', name: '知识图谱', icon: '🗺️' },
    { id: 'review', name: '数据审核', icon: '🔍' },
    { id: 'settings', name: '设置', icon: '⚙️' }
  ];

  function navigate(page, param) {
    location.hash = '#' + page + (param ? '/' + param : '');
  }

  function currentRoute() {
    var h = (location.hash || '#home').slice(1);
    var parts = h.split('/');
    return { page: parts[0] || 'home', param: parts[1] || null };
  }

  function renderNav() {
    var route = currentRoute();
    var nav = document.getElementById('mjt-nav');
    nav.innerHTML = PAGES.map(function (p) {
      return '<a href="#' + p.id + '" class="nav-item' + (route.page === p.id ? ' active' : '') + '">' +
        '<span class="nav-icon">' + p.icon + '</span><span class="nav-label">' + p.name + '</span></a>';
    }).join('');
  }

  function route() {
    var r = currentRoute();
    renderNav();
    var main = document.getElementById('mjt-main');
    if (main.__mjtCleanup) { main.__mjtCleanup(); main.__mjtCleanup = null; }
    MJT.speech.stop();
    var fn = ROUTES[r.page] || ROUTES.home;
    fn(main, r.param);
    // 顶栏始终显示当前范围
    var s = getSettings();
    document.getElementById('mjt-scope-badge').textContent = '《大家的日语》第1～' + s.maxLesson + '课';
    window.scrollTo(0, 0);
  }

  /* ============ 首页 ============ */
  function pageHome(main) {
    var s = getSettings();
    var ov = MJT.stats.overview();
    var weakest = MJT.stats.weakestAreas(3);
    var last = MJT.storage.load(MJT.storage.KEYS.lastSession, null);
    var catNames = {};
    MJT_DATA.meta.numberCategories.forEach(function (c) { catNames[c.id] = c.name; });
    var moduleNames = { numbers: '数字专项', grammar: '语法', listening: '听力', reading: '阅读', mixed: '综合' };

    var html = '<div class="page-home">';
    html += '<h2>' + esc(MJT_DATA.meta.appNameZh) + '</h2>';
    html += '<p class="dim">当前学习范围：<b>《大家的日语》第1～' + s.maxLesson + '课</b>（可在设置中调整；系统硬上限第21课）</p>';

    html += '<div class="stat-grid">' +
      '<div class="stat"><div class="stat-value">' + ov.today.total + '</div><div class="stat-label">今日完成</div></div>' +
      '<div class="stat"><div class="stat-value">' + (ov.today.accuracy !== null ? Math.round(ov.today.accuracy * 100) + '%' : '—') + '</div><div class="stat-label">今日正确率</div></div>' +
      '<div class="stat"><div class="stat-value">' + (ov.today.avgResponseMs !== null ? fmtSec(ov.today.avgResponseMs) : '—') + '</div><div class="stat-label">今日平均反应</div></div>' +
      '</div>';

    if (weakest.length) {
      html += '<div class="panel"><p class="script-label">最需要加强的项目（时间/金额/数量词等弱点）</p><ul>' + weakest.map(function (w) {
        return '<li><b>' + esc(catNames[w.key] || moduleNames[w.key] || w.key) + '</b> — 正确率 ' +
          Math.round(w.stats.accuracy * 100) + '%，平均 ' + fmtSec(w.stats.avgResponseMs) + '</li>';
      }).join('') + '</ul></div>';
    } else {
      html += '<p class="dim">（完成几组训练后，这里会显示最需要加强的项目）</p>';
    }

    // 场景概况：最近完成 + 今日推荐
    var hist = MJT.storage.load(MJT.storage.KEYS.trainingHistory, []);
    var recentScenarios = hist.filter(function (h) { return h.module === 'scenario'; }).slice(-3).reverse();
    var scenarioPools = MJT.scenario.pools(s);
    var doneIds = {};
    hist.forEach(function (h) { if (h.scenarioId) doneIds[h.scenarioId] = true; });
    var recommend = scenarioPools.formal.concat(scenarioPools.previewable).filter(function (sc) { return !doneIds[sc.id]; })[0]
      || scenarioPools.formal[0] || scenarioPools.previewable[0];
    html += '<div class="panel"><p class="script-label">场景训练</p>';
    if (recentScenarios.length) {
      html += '<p class="dim">最近完成：' + recentScenarios.map(function (h) {
        return esc(h.scenarioTitle || h.scenarioId) + '（' + (h.accuracy !== null ? Math.round(h.accuracy * 100) + '%' : '—') + '）';
      }).join('、') + '</p>';
    }
    if (recommend) {
      html += '<p>今日推荐场景：<b>' + esc(recommend.title) + '</b>（' + esc(MJT.scenario.CATEGORY_NAMES[recommend.category] || '') + '，难度' + '★'.repeat(recommend.difficulty) + '）</p>';
    }
    html += '</div>';

    html += '<div class="btn-row home-actions">';
    if (last && last.module === 'scenario' && last.scenarioId && MJT.scenario.byId(last.scenarioId)) {
      html += '<button class="btn btn-primary" data-go="continue-scenario">▶ 继续上次场景（' + esc(MJT.scenario.byId(last.scenarioId).title) + '）</button>';
    } else if (last && last.module) {
      html += '<button class="btn btn-primary" data-go="continue">▶ 继续上次训练（' + esc(moduleNames[last.module] || last.module) +
        (last.category && catNames[last.category] ? '·' + catNames[last.category] : '') + '）</button>';
    }
    html += '<button class="btn btn-primary" data-go="scenario">🎬 开始日本生活模拟</button>' +
      '<button class="btn btn-primary" data-go="numbers">🔢 数字场景强化</button>' +
      '<button class="btn" data-go="random">🎲 随机综合训练</button>' +
      '</div>';

    // 数据可信度概览
    var report = MJT.app.lastValidation || MJT.validator.validateAll();
    MJT.app.lastValidation = report;
    html += '<div class="panel dim small">数据状态：已验证 ' + report.counts.verified + ' 条 · 待审核 ' + report.counts.pending +
      ' 条 · 已拒绝 ' + report.counts.rejected + ' 条 · 校验失败 ' + report.counts.invalid +
      ' 条（详见「数据审核」）。数字类题目为运行时按已验证读法随机生成，不计入条目数。</div>';
    html += '</div>';
    main.innerHTML = html;
    main.querySelectorAll('[data-go]').forEach(function (b) {
      b.addEventListener('click', function () {
        var g = b.getAttribute('data-go');
        if (g === 'continue-scenario' && last) navigate('scenario', last.scenarioId);
        else if (g === 'continue' && last) {
          if (last.module === 'numbers') startNumberSession(main, last.category || 'mixed', last.difficulty || s.difficulty);
          else navigate(last.module);
        } else if (g === 'random') navigate('mixed');
        else if (g === 'scenario') navigate('scenario');
        else navigate('numbers');
      });
    });
  }

  /* ============ 场景训练页 ============ */
  function pageScenario(main, param) {
    var s = getSettings();
    var pools = MJT.scenario.pools(s);
    if (param) {
      // 直接进入指定场景
      var sc = MJT.scenario.byId(param);
      if (sc) {
        var isFormal = pools.formal.some(function (x) { return x.id === param; });
        var isPreview = pools.previewable.some(function (x) { return x.id === param; });
        if (isFormal || isPreview) {
          main.innerHTML = '<div id="sc-player"></div>';
          MJT.scenario.start(document.getElementById('sc-player'), param, { preview: !isFormal });
          return;
        }
      }
    }
    var hist = MJT.storage.load(MJT.storage.KEYS.trainingHistory, []);
    var lastAcc = {};
    hist.forEach(function (h) { if (h.module === 'scenario' && h.scenarioId) lastAcc[h.scenarioId] = h.accuracy; });

    var html = '<h2>场景训练 · 日本生活模拟</h2>' +
      '<p class="dim">场景 → 连续听力 → 信息提取 → 用户回应 → 完整解析 → 影子跟读 → 迁移强化。' +
      '答题前不显示原文；浏览器语音合成（非真人录音）。</p>';
    if (!pools.formal.length) {
      html += '<div class="panel warn-panel"><b>正式训练场景数量不足。</b> 全部场景的课程归属尚待核实（AI 不猜测知识点属于哪一课）。' +
        '你可以：① 在「数据审核」页核实场景后正式训练并计入统计；② 直接用<b>审核预览模式</b>体验（不计入正式统计与掌握判定）。</div>';
    }
    var byCat = {};
    pools.formal.forEach(function (sc) { (byCat[sc.category] = byCat[sc.category] || { formal: [], preview: [] }).formal.push(sc); });
    pools.previewable.forEach(function (sc) { (byCat[sc.category] = byCat[sc.category] || { formal: [], preview: [] }).preview.push(sc); });
    Object.keys(byCat).forEach(function (cat) {
      html += '<h3>' + esc(MJT.scenario.CATEGORY_NAMES[cat] || cat) + '</h3><div class="scenario-grid">';
      byCat[cat].formal.concat(byCat[cat].preview).forEach(function (sc) {
        var formal = byCat[cat].formal.indexOf(sc) !== -1;
        var acc = lastAcc[sc.id];
        html += '<div class="scenario-card">' +
          '<p class="sc-title">' + esc(sc.title) + '</p>' +
          '<p class="dim small">任务：' + esc(sc.goal) + '</p>' +
          '<p class="dim small">难度' + '★'.repeat(sc.difficulty) + ' · ' + (sc.steps ? sc.steps.filter(function (st) { return st.script; }).length : 0) + '轮对话 · ' +
          esc((sc.informationTypes || []).join('/')) +
          (acc !== undefined && acc !== null ? ' · 上次 ' + Math.round(acc * 100) + '%' : '') + '</p>' +
          '<p>' + (formal ? '<span class="badge badge-ok">已核实</span>' : '<span class="badge badge-pending">待核实 · 预览模式</span>') + '</p>' +
          '<button class="btn ' + (formal ? 'btn-primary' : '') + '" data-sc="' + esc(sc.id) + '" data-formal="' + formal + '">' + (formal ? '开始训练 →' : '预览体验 →') + '</button>' +
          '</div>';
      });
      html += '</div>';
    });
    if (pools.blocked.length) {
      html += '<p class="dim small">已过滤 ' + pools.blocked.length + ' 个场景（' + esc(pools.blocked[0].reason) + ' 等）。</p>';
    }
    main.innerHTML = html;
    main.querySelectorAll('[data-sc]').forEach(function (b) {
      b.addEventListener('click', function () { navigate('scenario', b.getAttribute('data-sc')); });
    });
  }

  /* ============ 今日训练（自适应） ============ */
  function pageToday(main) {
    var plan = MJT.adaptive.buildSessionPlan({ difficulty: getSettings().difficulty });
    var html = '<h2>今日训练（自适应）</h2>';
    html += '<div class="panel"><p class="script-label">今日训练计划（根据你的错题与反应时间自动生成）</p><ul>' +
      plan.reasons.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>';
    html += '<p class="dim">类别权重：' + plan.categoryWeights.map(function (w) {
      return esc(w.name) + ' ×' + w.weight.toFixed(1);
    }).join('　') + '</p>';
    if (plan.lessonReview.length) {
      html += '<p class="dim">建议复习：' + plan.lessonReview.slice(0, 3).map(function (x) { return '第' + x.lesson + '课'; }).join('、') + '</p>';
    }
    html += '<button class="btn btn-primary" id="start-today">开始今日训练 →</button></div>';
    html += '<div id="today-session"></div>';
    main.innerHTML = html;
    document.getElementById('start-today').addEventListener('click', function () {
      var box = document.getElementById('today-session');
      main.querySelector('.panel').style.display = 'none';
      main.querySelector('h2').style.display = 'none';
      MJT.mixed.startSession(box, { difficulty: plan.difficulty });
    });
  }

  /* ============ 数字专项 ============ */
  function counterPoolForSettings(s) {
    var reviewDecisions = MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {});
    return MJT.scope.filter(MJT_DATA.counters, {
      maxLesson: s.maxLesson,
      mode: s.counterMode === 'textbook' ? 'textbook' : 'universal',
      reviewDecisions: reviewDecisions
    });
  }

  function startNumberSession(main, category, difficulty, mode) {
    var s = getSettings();
    var box = document.getElementById('numbers-session') || main;
    mode = mode || 'scene'; // scene=场景数字（默认） basic=基础反应（热身）
    var counterPool = null;
    if (category === 'counter' || category === 'mixed') {
      var filtered = counterPoolForSettings(s);
      counterPool = filtered.allowed;
      if (category === 'counter' && !counterPool.length && mode === 'basic') {
        box.innerHTML = '<div class="panel warn-panel"><h3>当前已验证题目数量不足</h3>' +
          '<p>教材范围模式下，没有数量词的课程归属已被核实（本系统不默认任何数量词已在第21课前出现）。</p>' +
          '<p>可以：① 在「数据审核」页核实数量词课程出处；② 在设置中切换到「通用读法模式」（明确不声明教材出处）。</p>' +
          '<div class="btn-row"><button class="btn" onclick="MJT.app.navigate(\'review\')">前往数据审核</button>' +
          '<button class="btn" onclick="MJT.app.navigate(\'settings\')">前往设置</button></div></div>';
        return;
      }
    }
    saveLastSession({ module: 'numbers', category: category, difficulty: difficulty, mode: mode });
    var level = difficulty >= 3 ? 4 : (difficulty === 2 ? 3 : 2);
    MJT.session.start(box, {
      module: 'numbers',
      categoryId: category,
      difficulty: difficulty,
      count: s.questionCount,
      getNext: function () {
        if (mode === 'basic') {
          // 基础热身：孤立数字反应（明确标注，不进入正式训练占比）
          var q = MJT.numbers.generate(category, difficulty, { counterPool: counterPool });
          if (q) { q.level = 1; q.warmup = true; q.question = '【基础热身】' + q.question; }
          return q;
        }
        // 场景数字（默认）：时间/日期/数量词/金额进入生活场景
        var sq = MJT.scenarioNumbers.generate(category === 'basic' || category === 'phone' ? 'mixed' : category, level, { minLevel: 2 });
        return sq || MJT.numbers.generate(category, difficulty, { counterPool: counterPool });
      },
      onRestart: function (plan) {
        startNumberSession(main, category, plan.difficulty, mode);
      }
    });
  }

  function pageNumbers(main, param) {
    var s = getSettings();
    var cats = [{ id: 'mixed', name: '混合模式（推荐）' }].concat(MJT_DATA.meta.numberCategories);
    var html = '<h2>数字专项训练</h2>' +
      '<p class="dim">听到日语直接形成数量概念。全部读法为已验证的标准日语通用读法（' +
      (s.counterMode === 'universal' ? '通用读法模式：不声明教材课程出处' : '教材范围模式') + '）。</p>';
    html += '<div class="panel">' +
      '<div class="form-row"><label>入口</label><div class="chip-row" id="num-mode">' +
      '<button class="chip active" data-mode="scene">场景数字（默认：数字进入生活场景）</button>' +
      '<button class="chip" data-mode="basic">基础反应（热身：孤立读音/音变/特殊读法）</button>' +
      '</div></div>' +
      '<div class="form-row"><label>类别</label><div class="chip-row" id="num-cats">' +
      cats.map(function (c, i) {
        return '<button class="chip' + ((param ? c.id === param : i === 0) ? ' active' : '') + '" data-cat="' + c.id + '">' + esc(c.name) + '</button>';
      }).join('') + '</div></div>' +
      '<div class="form-row"><label>难度</label><div class="chip-row" id="num-diff">' +
      [1, 2, 3].map(function (d) {
        return '<button class="chip' + (d === s.difficulty ? ' active' : '') + '" data-diff="' + d + '">' + ['基础', '初级', '综合'][d - 1] + '</button>';
      }).join('') + '</div></div>' +
      '<button class="btn btn-primary" id="num-start">开始训练 →</button></div>' +
      '<div id="numbers-session"></div>';
    main.innerHTML = html;
    var chosen = { cat: param || 'mixed', diff: s.difficulty, mode: 'scene' };
    main.querySelectorAll('[data-mode]').forEach(function (b) {
      b.addEventListener('click', function () {
        main.querySelectorAll('[data-mode]').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active'); chosen.mode = b.getAttribute('data-mode');
      });
    });
    main.querySelectorAll('[data-cat]').forEach(function (b) {
      b.addEventListener('click', function () {
        main.querySelectorAll('[data-cat]').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active'); chosen.cat = b.getAttribute('data-cat');
      });
    });
    main.querySelectorAll('[data-diff]').forEach(function (b) {
      b.addEventListener('click', function () {
        main.querySelectorAll('[data-diff]').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active'); chosen.diff = parseInt(b.getAttribute('data-diff'), 10);
      });
    });
    document.getElementById('num-start').addEventListener('click', function () {
      startNumberSession(main, chosen.cat, chosen.diff);
      document.getElementById('numbers-session').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ============ 题库类训练页（语法/听力/阅读/综合） ============ */
  function bankPage(title, note, poolFn, startFn) {
    return function (main) {
      var s = getSettings();
      var pool = poolFn ? poolFn(s) : null;
      var html = '<h2>' + title + '</h2><p class="dim">' + note + '</p>';
      if (pool !== null) {
        html += '<div class="panel small dim">当前已验证可用题目：<b>' + pool.length + '</b> 条' +
          (pool.length === 0 ? ' —— <b>当前已验证题目数量不足</b>。全部题目的课程归属尚待核实，请在「数据审核」页对照教材核实后使用。' : '') +
          '</div>';
      }
      html += '<div class="btn-row"><button class="btn btn-primary" id="bank-start">开始训练 →</button>' +
        '<button class="btn" onclick="MJT.app.navigate(\'review\')">数据审核</button></div>' +
        '<div id="bank-session"></div>';
      main.innerHTML = html;
      document.getElementById('bank-start').addEventListener('click', function () {
        startFn(document.getElementById('bank-session'), { difficulty: s.difficulty });
      });
    };
  }

  /* ============ 听力训练（等级系统） ============ */
  function pageListening(main) {
    var s = getSettings();
    var LEVELS = [
      { v: 1, n: 'L1 基础热身', d: '孤立数字/时间/金额（正式训练占比≤5%）' },
      { v: 2, n: 'L2 带单位短句', d: '数字进入完整表达' },
      { v: 3, n: 'L3 场景单句（默认）', d: '自然场景句信息提取' },
      { v: 4, n: 'L4 双信息场景', d: '一句含两个以上信息' },
      { v: 5, n: 'L5 短对话', d: '2～4轮对话（题库，需核实）' },
      { v: 6, n: 'L6 完整情景', d: '4～8轮连续对话 → 场景训练页' }
    ];
    var level = s.listeningLevel || MJT.listening.DEFAULT_LEVEL;
    var l5count = MJT.listening.pool(s, 5).length;
    var html = '<h2>听力训练</h2>' +
      '<p class="dim">默认从 Level 3 开始；可手动进入 Level 1 热身。浏览器语音合成（非母语者真人录音），数据保留 audioUrl 真实音频接口。原文在作答后才显示。</p>';
    html += '<div class="panel"><div class="form-row"><label>听力等级</label><div class="chip-row">' +
      LEVELS.map(function (L) {
        return '<button class="chip' + (L.v === level ? ' active' : '') + '" data-lv="' + L.v + '" title="' + esc(L.d) + '">' + esc(L.n) + '</button>';
      }).join('') + '</div></div>' +
      '<p class="dim small" id="lv-desc"></p>' +
      '<button class="btn btn-primary" id="listen-start">开始训练 →</button></div>' +
      '<div id="bank-session"></div>';
    main.innerHTML = html;
    var chosen = { lv: level };
    function updateDesc() {
      var L = LEVELS.filter(function (x) { return x.v === chosen.lv; })[0];
      var extra = chosen.lv === 5 ? ('　当前已核实对话题：' + l5count + ' 条' + (l5count === 0 ? '（<b>当前已验证题目数量不足</b>，请先在数据审核页核实）' : '')) : '';
      document.getElementById('lv-desc').innerHTML = esc(L.d) + extra;
    }
    main.querySelectorAll('[data-lv]').forEach(function (b) {
      b.addEventListener('click', function () {
        main.querySelectorAll('[data-lv]').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        chosen.lv = parseInt(b.getAttribute('data-lv'), 10);
        updateDesc();
      });
    });
    updateDesc();
    document.getElementById('listen-start').addEventListener('click', function () {
      if (chosen.lv === 6) { navigate('scenario'); return; }
      saveSettings({ listeningLevel: chosen.lv === 1 ? 3 : chosen.lv }); // L1只作热身，不改默认
      MJT.listening.startSession(document.getElementById('bank-session'), {
        level: chosen.lv === 1 ? 1 : chosen.lv,
        warmupOnly: chosen.lv === 1
      });
    });
  }

  /* ============ 错题本 ============ */
  function pageErrorbook(main) {
    var list = MJT.errorbook.all();
    var html = '<h2>错题本</h2>';
    if (!list.length) {
      html += '<p class="dim">还没有错题记录。答错的题目（以及反应超过10秒的题目）会自动记录在这里。</p>';
      main.innerHTML = html;
      return;
    }
    var weak = list.filter(function (e) { return e.masteryStatus !== 'mastered'; });
    html += '<p class="dim">共 ' + list.length + ' 条，其中未掌握 ' + weak.length + ' 条。' +
      '系统会自动提高相关类别的出题权重，并围绕同一知识点生成新的情景（不是重复原题）。</p>';
    html += '<div class="btn-row"><button class="btn btn-primary" id="eb-train">🎯 针对错题练一组 →</button>' +
      '<button class="btn btn-danger" id="eb-clear">清空错题本</button></div>';
    html += '<div id="eb-session"></div>';
    html += '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th>题目</th><th>你的答案</th><th>正确答案</th><th>错误类型</th><th>次数</th><th>反应</th><th>状态</th><th></th></tr></thead><tbody>';
    list.slice().reverse().forEach(function (e) {
      var statusZh = { weak: '薄弱', improving: '进步中', mastered: '已掌握' }[e.masteryStatus] || e.masteryStatus;
      html += '<tr>' +
        '<td class="jp-text">' + esc(e.questionText || e.questionId) + '</td>' +
        '<td class="wrong-text">' + esc(e.userAnswer) + '</td>' +
        '<td class="correct-text jp-text">' + esc(e.correctAnswer) + '</td>' +
        '<td>' + esc(e.errorType) + '</td>' +
        '<td>' + e.errorCount + '</td>' +
        '<td>' + fmtSec(e.responseTime) + '</td>' +
        '<td>' + statusZh + '</td>' +
        '<td><button class="btn btn-small" data-remove="' + esc(e.questionId) + '">删除</button></td>' +
        '</tr>';
    });
    html += '</tbody></table></div>';
    main.innerHTML = html;
    document.getElementById('eb-train').addEventListener('click', function () {
      // 围绕错题类别生成新题：数字类按类别权重生成；题库类重新出同知识点的题
      var box = document.getElementById('eb-session');
      var s = getSettings();
      var weakCats = {};
      weak.forEach(function (e) { if (e.numberCategory) weakCats[e.numberCategory] = true; });
      var catList = Object.keys(weakCats);
      var bankRetry = weak.filter(function (e) { return !e.numberCategory; });
      var allBank = MJT.grammar.pool(s).concat(MJT.listening.pool(s));
      MJT.session.start(box, {
        module: 'mixed', categoryId: 'errorbook', difficulty: s.difficulty,
        count: s.questionCount,
        getNext: function (i) {
          // 优先重练题库错题（同题重现），数字错题按类别生成"新情景"
          if (i < bankRetry.length) {
            var qid = bankRetry[i].questionId;
            for (var j = 0; j < allBank.length; j++) if (allBank[j].id === qid) return allBank[j];
          }
          if (catList.length) return MJT.numbers.generate(MJT.random.pick(catList), s.difficulty);
          return MJT.numbers.generate('mixed', s.difficulty);
        }
      });
      box.scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('eb-clear').addEventListener('click', function () {
      if (confirm('确定清空错题本？此操作不可恢复。')) { MJT.errorbook.clear(); route(); }
    });
    main.querySelectorAll('[data-remove]').forEach(function (b) {
      b.addEventListener('click', function () {
        MJT.errorbook.removeEntry(b.getAttribute('data-remove')); route();
      });
    });
  }

  /* ============ 学习统计 ============ */
  function pageStats(main) {
    var ov = MJT.stats.overview();
    var catNames = {};
    MJT_DATA.meta.numberCategories.forEach(function (c) { catNames[c.id] = c.name; });
    var moduleNames = { numbers: '数字专项', grammar: '语法', listening: '听力', reading: '阅读', mixed: '综合' };
    function row(name, s) {
      return '<tr><td>' + esc(name) + '</td><td>' + s.total + '</td>' +
        '<td>' + (s.accuracy !== null ? Math.round(s.accuracy * 100) + '%' : '—') + '</td>' +
        '<td>' + (s.avgResponseMs !== null ? fmtSec(s.avgResponseMs) : '—') + '</td>' +
        '<td>' + (s.fastest ? fmtSec(s.fastest.responseTime) : '—') + '</td>' +
        '<td>' + (s.slowest ? fmtSec(s.slowest.responseTime) : '—') + '</td></tr>';
    }
    var html = '<h2>学习统计</h2>';
    html += '<div class="stat-grid">' +
      '<div class="stat"><div class="stat-value">' + ov.all.total + '</div><div class="stat-label">总题数</div></div>' +
      '<div class="stat"><div class="stat-value">' + (ov.all.accuracy !== null ? Math.round(ov.all.accuracy * 100) + '%' : '—') + '</div><div class="stat-label">总正确率</div></div>' +
      '<div class="stat"><div class="stat-value">' + (ov.all.avgResponseMs !== null ? fmtSec(ov.all.avgResponseMs) : '—') + '</div><div class="stat-label">平均反应</div></div>' +
      '<div class="stat"><div class="stat-value">' + ov.streaks.maxCorrect + '</div><div class="stat-label">最长连对</div></div>' +
      '<div class="stat"><div class="stat-value">' + ov.streaks.maxWrong + '</div><div class="stat-label">最长连错</div></div>' +
      '</div>';
    html += '<h3>各模块</h3><div class="table-wrap"><table class="data-table"><thead><tr><th>模块</th><th>题数</th><th>正确率</th><th>平均反应</th><th>最快</th><th>最慢</th></tr></thead><tbody>';
    Object.keys(ov.byModule).forEach(function (m) { html += row(moduleNames[m] || m, ov.byModule[m]); });
    html += '</tbody></table></div>';
    html += '<h3>各信息类别（时间/日期/金额/数量词反应）</h3><div class="table-wrap"><table class="data-table"><thead><tr><th>类别</th><th>题数</th><th>正确率</th><th>平均反应</th><th>最快</th><th>最慢</th></tr></thead><tbody>';
    var slowestCat = null;
    Object.keys(ov.byCategory).forEach(function (c) {
      html += row(catNames[c] || c, ov.byCategory[c]);
      if (ov.byCategory[c].total >= 3 && (!slowestCat || ov.byCategory[c].avgResponseMs > ov.byCategory[slowestCat].avgResponseMs)) slowestCat = c;
    });
    html += '</tbody></table></div>';
    if (slowestCat) html += '<p class="dim">最慢信息类型：<b>' + esc(catNames[slowestCat] || slowestCat) + '</b>（平均 ' + fmtSec(ov.byCategory[slowestCat].avgResponseMs) + '）——自适应引擎会在多个新场景中增加该类信息。</p>';

    // 场景统计
    var records = MJT.stats.allRecords();
    var scRecords = records.filter(function (r) { return r.module === 'scenario'; });
    var hist = MJT.storage.load(MJT.storage.KEYS.trainingHistory, []);
    var scenariosDone = hist.filter(function (h) { return h.module === 'scenario'; });
    var uniqueScenarios = {};
    scenariosDone.forEach(function (h) { uniqueScenarios[h.scenarioId] = h; });
    var respondRecs = records.filter(function (r) { return r.interaction === 'respond'; });
    var respondAcc = respondRecs.length ? respondRecs.filter(function (r) { return r.correct; }).length / respondRecs.length : null;
    html += '<h3>场景训练</h3>';
    html += '<div class="stat-grid">' +
      '<div class="stat"><div class="stat-value">' + scenariosDone.length + '</div><div class="stat-label">完成场景次数</div></div>' +
      '<div class="stat"><div class="stat-value">' + Object.keys(uniqueScenarios).length + '</div><div class="stat-label">不同场景数</div></div>' +
      '<div class="stat"><div class="stat-value">' + (respondAcc !== null ? Math.round(respondAcc * 100) + '%' : '—') + '</div><div class="stat-label">用户回应正确率</div></div>' +
      '</div>';
    // 各场景理解率 + 最弱三个场景
    var byScenario = {};
    scRecords.forEach(function (r) { (byScenario[r.scenarioId] = byScenario[r.scenarioId] || []).push(r); });
    var scRows = Object.keys(byScenario).map(function (id) {
      var sum = MJT.stats.summarize(byScenario[id]);
      var sc = MJT.scenario.byId(id);
      return { id: id, title: sc ? sc.title : id, s: sum };
    });
    if (scRows.length) {
      html += '<div class="table-wrap"><table class="data-table"><thead><tr><th>场景</th><th>题数</th><th>理解率</th><th>平均反应</th></tr></thead><tbody>';
      scRows.forEach(function (r) {
        html += '<tr><td>' + esc(r.title) + '</td><td>' + r.s.total + '</td><td>' + (r.s.accuracy !== null ? Math.round(r.s.accuracy * 100) + '%' : '—') + '</td><td>' + (r.s.avgResponseMs !== null ? fmtSec(r.s.avgResponseMs) : '—') + '</td></tr>';
      });
      html += '</tbody></table></div>';
      var weakestSc = scRows.filter(function (r) { return r.s.total >= 2; }).sort(function (a, b) { return (a.s.accuracy || 0) - (b.s.accuracy || 0); }).slice(0, 3);
      if (weakestSc.length) {
        html += '<p class="dim">最弱场景：' + weakestSc.map(function (r) { return '<b>' + esc(r.title) + '</b>（' + Math.round((r.s.accuracy || 0) * 100) + '%）'; }).join('、') + '</p>';
      }
    }

    // 跨场景掌握
    var mastery = MJT.mastery.summary();
    html += '<h3>知识点掌握（同一知识点需在 ' + MJT.mastery.CONTEXTS_REQUIRED + ' 个不同场景表现稳定）</h3>';
    html += '<p><span class="badge badge-ok">已掌握 ' + mastery.mastered.length + '</span> ' +
      '<span class="badge">学习中（尚未跨场景）' + mastery.learning.length + '</span> ' +
      '<span class="badge badge-pending">薄弱 ' + mastery.weak.length + '</span></p>';
    if (mastery.mastered.length) html += '<p class="dim small">已掌握：' + mastery.mastered.map(function (m) { return esc(m.point); }).join('、') + '</p>';
    if (mastery.learning.length) html += '<p class="dim small">尚未跨场景掌握：' + mastery.learning.slice(0, 12).map(function (m) { return esc(m.point) + '（' + m.contexts + '/' + MJT.mastery.CONTEXTS_REQUIRED + '场景）'; }).join('、') + '</p>';
    if (mastery.weak.length) html += '<p class="dim small">薄弱：' + mastery.weak.slice(0, 12).map(function (m) { return esc(m.point); }).join('、') + '</p>';

    if (ov.all.slowest) {
      html += '<p class="dim">最慢题目：「' + esc(ov.all.slowest.questionText || ov.all.slowest.questionId) + '」（' + fmtSec(ov.all.slowest.responseTime) + '）</p>';
    }
    main.innerHTML = html;
  }

  /* ============ 知识图谱 ============ */
  function pageKnowledge(main) {
    var nodes = MJT_DATA.knowledgeNodes;
    var html = '<h2>知识图谱对应</h2>' +
      '<p class="dim">训练题通过 knowledgeMap 字段对应到本仓库 <a href="index.html" target="_blank">Japanese Cognitive Atlas</a> 中真实存在的节点。' +
      '映射经过与图谱数据逐一核对；图谱中暂无对应节点的内容（数字/时间/日期/数量词/金额）标记为 knowledgeMapStatus: pending，不做猜测性关联。</p>';
    // 汇总各节点被多少题引用
    var refCount = {};
    var banks = (MJT_DATA.pendingGrammar || []).concat(MJT_DATA.pendingListening || []).concat(MJT_DATA.pendingReading || []);
    banks.forEach(function (q) {
      (q.knowledgeMap || []).forEach(function (km) { refCount[km.node] = (refCount[km.node] || 0) + 1; });
    });
    var byModule = {};
    nodes.forEach(function (n) { (byModule[n.module] = byModule[n.module] || []).push(n); });
    Object.keys(byModule).forEach(function (m) {
      html += '<h3>' + esc(m) + '</h3><div class="chip-row">';
      byModule[m].forEach(function (n) {
        var c = refCount[n.id] || 0;
        html += '<span class="chip' + (c ? ' active' : '') + '" title="' + esc(n.id) + '">' + esc(n.zh) + (c ? '（' + c + '题）' : '') + '</span>';
      });
      html += '</div>';
    });
    main.innerHTML = html;
  }

  /* ============ 数据审核工作台 ============ */
  var reviewFilter = { dataset: 'all', status: 'pending', lesson: 'all', keyword: '' };

  function collectReviewItems() {
    var list = [];
    (MJT_DATA.counters || []).forEach(function (it) { list.push({ item: it, dataset: 'counter', label: '数量词' }); });
    (MJT_DATA.pendingGrammar || []).forEach(function (it) { list.push({ item: it, dataset: 'grammar', label: '语法' }); });
    (MJT_DATA.pendingListening || []).forEach(function (it) { list.push({ item: it, dataset: 'listening', label: '听力' }); });
    (MJT_DATA.pendingReading || []).forEach(function (it) { list.push({ item: it, dataset: 'reading', label: '阅读' }); });
    (MJT_DATA.pendingScenarios || []).forEach(function (it) { list.push({ item: it, dataset: 'scenario', label: '场景' }); });
    importedItems(null).forEach(function (it) { list.push({ item: it, dataset: 'imported', label: '导入' }); });
    return list;
  }

  function pageReview(main) {
    var report = MJT.validator.validateAll();
    MJT.app.lastValidation = report;
    var decisions = MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {});
    var all = collectReviewItems();
    var invalidIds = {};
    report.failures.forEach(function (f) { invalidIds[f.id] = f.errors; });

    function statusOf(entry) {
      if (invalidIds[entry.item.id]) return 'invalid';
      var d = decisions[entry.item.id];
      return d && d.status ? d.status : entry.item.sourceStatus;
    }
    function lessonsOf(it) {
      var d = decisions[it.id];
      if (d && typeof d.lesson === 'number') return [d.lesson];
      if (Array.isArray(it.lesson)) return it.lesson;
      if (typeof it.lesson === 'number') return [it.lesson];
      if (it.lessonRange) return [it.lessonRange.min, it.lessonRange.max];
      return [];
    }
    var filtered = all.filter(function (e) {
      if (reviewFilter.dataset !== 'all' && e.dataset !== reviewFilter.dataset) return false;
      var st = statusOf(e);
      if (reviewFilter.status !== 'all' && st !== reviewFilter.status) return false;
      if (reviewFilter.lesson !== 'all') {
        var ls = lessonsOf(e.item);
        var target = parseInt(reviewFilter.lesson, 10);
        if (!ls.some(function (l) { return l === target; })) return false;
      }
      if (reviewFilter.keyword) {
        var kw = reviewFilter.keyword.toLowerCase();
        var text = JSON.stringify([e.item.id, e.item.question, e.item.title, e.item.scriptJa, e.item.grammarPoints, e.item.scenarioId, e.item.scenarioContext]).toLowerCase();
        if (text.indexOf(kw) === -1) return false;
      }
      return true;
    });

    var pendingTotal = all.filter(function (e) { return statusOf(e) === 'pending'; }).length;
    var verifiedTotal = all.filter(function (e) { return statusOf(e) === 'verified'; }).length;
    var rejectedTotal = all.filter(function (e) { return statusOf(e) === 'rejected'; }).length;
    var progress = all.length ? Math.round((verifiedTotal + rejectedTotal) / all.length * 100) : 0;

    var html = '<h2>数据审核工作台</h2>';
    html += '<div class="stat-grid">' +
      '<div class="stat"><div class="stat-value ok">' + verifiedTotal + '</div><div class="stat-label">已核实</div></div>' +
      '<div class="stat"><div class="stat-value warn">' + pendingTotal + '</div><div class="stat-label">待审核</div></div>' +
      '<div class="stat"><div class="stat-value bad">' + rejectedTotal + '</div><div class="stat-label">已拒绝</div></div>' +
      '<div class="stat"><div class="stat-value bad">' + report.counts.invalid + '</div><div class="stat-label">校验失败</div></div>' +
      '<div class="stat"><div class="stat-value">' + progress + '%</div><div class="stat-label">审核进度</div></div>' +
      '</div>';
    html += '<p class="dim small">最近一次验证：' + esc(report.ranAt) + '。核实通过=你已对照《大家的日语》实体教材确认课程归属；审核通过前内容不进入正式训练。</p>';

    if (report.failures.length) {
      html += '<details class="panel warn-panel"><summary>校验失败条目 ' + report.failures.length + ' 条（不进入任何训练）</summary><ul>' +
        report.failures.map(function (f) { return '<li><b>' + esc(f.id) + '</b>（' + esc(f.dataset) + '）：' + esc(f.errors.join('；')) + '</li>'; }).join('') +
        '</ul></details>';
    }

    // 筛选器
    var datasets = [['all', '全部'], ['scenario', '场景'], ['grammar', '语法'], ['listening', '听力'], ['reading', '阅读'], ['counter', '数量词'], ['imported', '导入']];
    var statuses = [['pending', '待审核'], ['verified', '已核实'], ['rejected', '已拒绝'], ['invalid', '校验失败'], ['all', '全部']];
    html += '<div class="panel"><div class="form-row"><label>题型/数据集</label><div class="chip-row">' +
      datasets.map(function (d) { return '<button class="chip' + (reviewFilter.dataset === d[0] ? ' active' : '') + '" data-f-dataset="' + d[0] + '">' + d[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="form-row"><label>来源状态</label><div class="chip-row">' +
      statuses.map(function (d) { return '<button class="chip' + (reviewFilter.status === d[0] ? ' active' : '') + '" data-f-status="' + d[0] + '">' + d[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="form-row"><label>课程</label><select id="f-lesson" class="answer-input" style="max-width:8rem">' +
      '<option value="all">全部</option>' +
      (function () { var o = ''; for (var l = 1; l <= 21; l++) o += '<option value="' + l + '"' + (reviewFilter.lesson === String(l) ? ' selected' : '') + '>第' + l + '课</option>'; return o; })() +
      '</select>　<label>关键词/语法点/场景</label><input id="f-kw" class="answer-input" style="max-width:14rem" placeholder="如：て形 / 便利店 / から" value="' + esc(reviewFilter.keyword) + '"></div>' +
      '<div class="btn-row">' +
      '<button class="btn btn-primary" id="batch-verify">✓ 批量核实（当前筛选 ' + filtered.filter(function (e) { return statusOf(e) === 'pending'; }).length + ' 条待审核）</button>' +
      '<button class="btn btn-danger" id="batch-reject">✗ 批量拒绝</button>' +
      '<button class="btn" id="export-review">导出审核结果</button>' +
      '<label class="btn">导入数据（JSON/CSV/TXT）<input type="file" id="import-review" accept=".json,.csv,.txt" style="display:none"></label>' +
      '</div></div>';

    // 条目列表（最多显示100条防止过长）
    html += '<p class="dim small">当前筛选：' + filtered.length + ' 条' + (filtered.length > 100 ? '（仅显示前100条，请用筛选器缩小范围）' : '') + '</p>';
    filtered.slice(0, 100).forEach(function (e) {
      var it = e.item;
      var st = statusOf(e);
      var d = decisions[it.id];
      var stClass = st === 'invalid' ? 'rejected' : st;
      var body = '<p><span class="badge">' + esc(e.label) + '</span> <b class="jp-text">' +
        esc(it.title || it.question || it.scriptJa || it.counter || it.id) + '</b></p>';
      body += '<p class="dim small">id: ' + esc(it.id) +
        ' · 声明课程: ' + (lessonsOf(it).length ? '第' + lessonsOf(it).join('、') + '课' : '未声明') +
        (it.scenarioId || it.scenarioContext ? ' · 场景: ' + esc(it.scenarioContext || it.scenarioId) : '') +
        (it.grammarPoints && it.grammarPoints.length ? ' · 语法: ' + esc(it.grammarPoints.join('、')) : '') +
        ' · ' + esc(it.displaySource || it.origin || '') + '</p>';
      if (invalidIds[it.id]) body += '<p class="wrong-reason">校验失败：' + esc(invalidIds[it.id].join('；')) + '</p>';
      // 详情：完整题目/答案/解析/播放
      var detail = '';
      if (it.scriptJa || it.audioScript) {
        detail += '<p class="jp-text">' + esc(it.scriptJa || '') + '</p>' +
          '<button class="btn btn-small" data-play-text="' + esc(it.audioScript || it.scriptKana || '') + '">▶ 播放听力文本</button>';
      }
      if (it.steps) {
        detail += it.steps.filter(function (s2) { return s2.script; }).map(function (s2) {
          return '<p><span class="badge">' + esc(s2.speaker) + '</span> <span class="jp-text">' + esc(s2.script) + '</span> ' +
            '<button class="btn btn-small" data-play-text="' + esc(s2.script) + '">▶</button></p>';
        }).join('');
      }
      if (it.textJa) detail += '<p class="jp-text passage-text">' + esc(it.textJa).replace(/\n/g, '<br>') + '</p>';
      if (it.options) detail += '<p class="dim">选项：' + it.options.map(esc).join(' ／ ') + '</p>';
      if (it.answer !== undefined) detail += '<p>答案：<span class="correct-text jp-text">' + esc(it.answer) + '</span></p>';
      if (it.explanation) detail += '<p class="dim small">解析：' + esc(it.explanation) + '</p>';
      if (it.questions) detail += it.questions.map(function (q2) { return '<p class="dim small">问：' + esc(q2.q) + '　答：' + esc(q2.answer) + '</p>'; }).join('');
      body += '<details><summary class="dim small">显示完整内容</summary>' + detail + '</details>';

      html += '<div class="review-item ' + esc(stClass) + '">' +
        '<div class="review-body">' + body + '</div>' +
        '<div class="review-actions">' +
        '<span class="badge badge-' + (st === 'verified' ? 'ok' : st === 'rejected' || st === 'invalid' ? 'bad' : 'pending') + '">' +
        (st === 'verified' ? '已核实' : st === 'rejected' ? '已拒绝' : st === 'invalid' ? '校验失败' : '待核实') + '</span>' +
        (st !== 'invalid' ? '<button class="btn btn-small" data-decide="verified" data-id="' + esc(it.id) + '">核实通过</button>' +
          '<button class="btn btn-small" data-decide="rejected" data-id="' + esc(it.id) + '">拒绝</button>' +
          '<button class="btn btn-small" data-edit-lesson="' + esc(it.id) + '">改课程</button>' : '') +
        (d ? '<button class="btn btn-small" data-decide="reset" data-id="' + esc(it.id) + '">撤销</button>' : '') +
        '</div></div>';
    });

    main.innerHTML = html;

    // 事件
    main.querySelectorAll('[data-f-dataset]').forEach(function (b) {
      b.addEventListener('click', function () { reviewFilter.dataset = b.getAttribute('data-f-dataset'); route(); });
    });
    main.querySelectorAll('[data-f-status]').forEach(function (b) {
      b.addEventListener('click', function () { reviewFilter.status = b.getAttribute('data-f-status'); route(); });
    });
    document.getElementById('f-lesson').addEventListener('change', function (e2) { reviewFilter.lesson = e2.target.value; route(); });
    document.getElementById('f-kw').addEventListener('change', function (e2) { reviewFilter.keyword = e2.target.value.trim(); route(); });
    main.querySelectorAll('[data-play-text]').forEach(function (b) {
      b.addEventListener('click', function () {
        MJT.speech.speak(b.getAttribute('data-play-text'), { rate: getSettings().ttsRate, volume: getSettings().volume });
      });
    });
    function decide(id, status) {
      var map = MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {});
      if (status === 'reset') delete map[id];
      else map[id] = Object.assign(map[id] || {}, { status: status, at: new Date().toISOString(), by: 'user_manual_review' });
      MJT.storage.save(MJT.storage.KEYS.reviewDecisions, map);
    }
    main.querySelectorAll('[data-decide]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id'), st = b.getAttribute('data-decide');
        if (st === 'verified' && !confirm('确认你已对照《大家的日语》实体教材核实该条目的课程归属？\n（核实通过后该条目将进入正式训练）')) return;
        decide(id, st); route();
      });
    });
    main.querySelectorAll('[data-edit-lesson]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-edit-lesson');
        var v = prompt('输入核实后的课程编号（1～21），留空取消：');
        if (!v) return;
        var n = parseInt(v, 10);
        if (isNaN(n) || n < 1 || n > 21) { alert('课程编号必须在1～21之间'); return; }
        var map = MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {});
        map[id] = Object.assign(map[id] || {}, { lesson: n, at: new Date().toISOString() });
        MJT.storage.save(MJT.storage.KEYS.reviewDecisions, map);
        route();
      });
    });
    document.getElementById('batch-verify').addEventListener('click', function () {
      var targets = filtered.filter(function (e) { return statusOf(e) === 'pending'; });
      if (!targets.length) { alert('当前筛选内没有待审核条目'); return; }
      if (!confirm('确认你已对照实体教材核实当前筛选的 ' + targets.length + ' 条内容的课程归属？\n批量核实后这些内容将进入正式训练。')) return;
      targets.forEach(function (e) { decide(e.item.id, 'verified'); });
      route();
    });
    document.getElementById('batch-reject').addEventListener('click', function () {
      var targets = filtered.filter(function (e) { return statusOf(e) === 'pending'; });
      if (!targets.length) { alert('当前筛选内没有待审核条目'); return; }
      if (!confirm('确认批量拒绝当前筛选的 ' + targets.length + ' 条内容？（拒绝后对学习者完全隐藏）')) return;
      targets.forEach(function (e) { decide(e.item.id, 'rejected'); });
      route();
    });
    document.getElementById('export-review').addEventListener('click', function () {
      var out = {
        exportedAt: new Date().toISOString(),
        decisions: MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {}),
        summary: { verified: verifiedTotal, pending: pendingTotal, rejected: rejectedTotal, invalid: report.counts.invalid }
      };
      var blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'review-decisions-' + new Date().toISOString().slice(0, 10) + '.json';
      a.click();
    });
    document.getElementById('import-review').addEventListener('change', function (ev) {
      var f = ev.target.files[0]; if (!f) return;
      var reader = new FileReader();
      reader.onload = function () { handleImport(f.name, reader.result); route(); };
      reader.readAsText(f);
    });
  }

  /* ============ 数据导入（JSON/CSV/TXT → 待审核区） ============ */
  function handleImport(filename, text) {
    var items = [];
    try {
      if (/\.json$/i.test(filename)) {
        var parsed = JSON.parse(text);
        items = Array.isArray(parsed) ? parsed : (parsed.items || []);
      } else if (/\.csv$/i.test(filename)) {
        // CSV：首行表头 question,options(以|分隔),answer,explanation,lesson,grammarPoints(以|分隔)
        var lines = text.split(/\r?\n/).filter(function (l) { return l.trim(); });
        var headers = lines[0].split(',').map(function (h) { return h.trim(); });
        lines.slice(1).forEach(function (line, i) {
          var cols = line.split(',');
          var obj = {};
          headers.forEach(function (h, j) { obj[h] = (cols[j] || '').trim(); });
          items.push({
            id: 'import-csv-' + Date.now() + '-' + i,
            question: obj.question, options: (obj.options || '').split('|').filter(Boolean),
            answer: obj.answer, explanation: obj.explanation,
            lesson: obj.lesson ? [parseInt(obj.lesson, 10)] : null,
            grammarPoints: (obj.grammarPoints || '').split('|').filter(Boolean)
          });
        });
      } else { // TXT：每行 question|opt1;opt2;opt3;opt4|answer|explanation
        text.split(/\r?\n/).filter(function (l) { return l.trim(); }).forEach(function (line, i) {
          var parts = line.split('|');
          if (parts.length < 3) return;
          items.push({
            id: 'import-txt-' + Date.now() + '-' + i,
            question: parts[0].trim(), options: parts[1].split(';').map(function (o) { return o.trim(); }).filter(Boolean),
            answer: parts[2].trim(), explanation: (parts[3] || '').trim(),
            lesson: null, grammarPoints: []
          });
        });
      }
    } catch (e) { alert('导入解析失败：' + e.message); return; }
    if (!items.length) { alert('未能从文件中解析出任何条目'); return; }

    // 强制待审核 + 验证（不因来自用户就标记 verified）
    var existing = MJT.storage.load('imported-pending', []);
    var existingIds = {};
    existing.forEach(function (it) { existingIds[it.id] = true; });
    (MJT_DATA.pendingGrammar || []).forEach(function (it) { existingIds[it.id] = true; });
    var accepted = 0, rejected = [];
    items.forEach(function (it) {
      it.sourceStatus = 'pending'; // 强制：导入数据一律待审核
      it.sourceType = 'user_material';
      it.lessonStatus = 'pending';
      it.contentType = it.contentType || 'user_import';
      it.displaySource = '用户提供';
      it.isTextbookOriginal = false;
      it.origin = '用户提供（待核实）';
      it.reviewed = false;
      it.importKind = it.importKind || (it.textJa ? 'reading' : it.audioScript ? 'listening' : 'grammar');
      it.type = it.type || 'grammar';
      if (!it.grammarPoints || !it.grammarPoints.length) it.grammarPoints = ['未标注'];
      if (!it.sourceReference) it.sourceReference = '用户导入文件：' + filename;
      if (existingIds[it.id]) { rejected.push(it.id + '：重复 id'); return; }
      var errs = MJT.validator.validateItem(it, { kind: 'question', seenIds: {} });
      if (errs.length) { rejected.push((it.id || '(无id)') + '：' + errs.join('；')); return; }
      existingIds[it.id] = true;
      existing.push(it);
      accepted++;
    });
    MJT.storage.save('imported-pending', existing);
    alert('导入完成：接收 ' + accepted + ' 条进入待审核区' +
      (rejected.length ? '；拒绝 ' + rejected.length + ' 条（' + rejected.slice(0, 3).join('；') + (rejected.length > 3 ? '…' : '') + '）' : '') +
      '。\n导入内容不会自动标记为已核实，请在审核工作台逐条/批量核实。');
  }

  /* ============ 设置 ============ */
  function pageSettings(main) {
    var s = getSettings();
    function chipRow(key, options) {
      return '<div class="chip-row">' + options.map(function (o) {
        return '<button class="chip' + (String(s[key]) === String(o.v) ? ' active' : '') + '" data-set="' + key + '" data-val="' + o.v + '">' + o.n + '</button>';
      }).join('') + '</div>';
    }
    var lessonOpts = []; for (var i = 5; i <= 21; i++) if (i % 3 === 0 || i === 21) lessonOpts.push({ v: i, n: '～第' + i + '课' });
    var html = '<h2>设置</h2><div class="panel settings-panel">';
    html += '<div class="form-row"><label>学习范围（最高课程）</label>' + chipRow('maxLesson', lessonOpts) + '</div>';
    html += '<div class="form-row"><label>每组题目数量</label>' + chipRow('questionCount', [{ v: 5, n: '5' }, { v: 10, n: '10' }, { v: 20, n: '20' }, { v: 30, n: '30' }]) + '</div>';
    html += '<div class="form-row"><label>默认难度</label>' + chipRow('difficulty', [{ v: 1, n: '基础' }, { v: 2, n: '初级' }, { v: 3, n: '综合' }]) + '</div>';
    html += '<div class="form-row"><label>显示假名</label>' + chipRow('showKana', [{ v: true, n: '开' }, { v: false, n: '关' }]) + '</div>';
    html += '<div class="form-row"><label>显示中文</label>' + chipRow('showZh', [{ v: true, n: '开' }, { v: false, n: '关' }]) + '</div>';
    html += '<div class="form-row"><label>播放速度</label>' + chipRow('ttsRate', [{ v: 0.7, n: '慢' }, { v: 1, n: '正常' }, { v: 1.25, n: '稍快' }]) + '</div>';
    html += '<div class="form-row"><label>音量</label>' + chipRow('volume', [{ v: 0.3, n: '小' }, { v: 0.7, n: '中' }, { v: 1, n: '大' }]) + '</div>';
    html += '<div class="form-row"><label>答对后自动下一题</label>' + chipRow('autoNext', [{ v: true, n: '开' }, { v: false, n: '关' }]) + '</div>';
    html += '<div class="form-row"><label>主题</label>' + chipRow('theme', [{ v: 'auto', n: '跟随系统' }, { v: 'light', n: '浅色' }, { v: 'dark', n: '深色' }]) + '</div>';
    html += '<div class="form-row"><label>字号</label>' + chipRow('fontSize', [{ v: 'normal', n: '标准' }, { v: 'large', n: '大' }, { v: 'xlarge', n: '特大' }]) + '</div>';
    html += '<div class="form-row"><label>数量词/数字模式</label>' + chipRow('counterMode', [
      { v: 'universal', n: '通用读法模式（不声明教材出处）' }, { v: 'textbook', n: '教材范围模式（仅已核实）' }]) + '</div>';
    html += '<div class="form-row"><label>根据错题自适应下一组</label>' + chipRow('adaptiveNext', [{ v: true, n: '开' }, { v: false, n: '关' }]) + '</div>';
    html += '<div class="form-row"><label>场景扩展词汇</label>' + chipRow('extendedVocab', [
      { v: 'light', n: '② 少量扩展（推荐，每场景≤5个）' },
      { v: 'off', n: '① 完全关闭（100%教材范围）' },
      { v: 'normal', n: '③ 正常生活模式' }]) + '</div>';
    html += '</div>';
    html += '<div class="panel"><p class="script-label">数据</p><div class="btn-row">' +
      '<button class="btn" id="export-data">导出学习数据（JSON）</button>' +
      '<label class="btn">导入学习数据<input type="file" id="import-data" accept=".json" style="display:none"></label>' +
      '<button class="btn btn-danger" id="reset-data">重置全部学习数据</button></div>' +
      '<p class="dim small">全部数据保存在本机浏览器 localStorage（键前缀 mjt:），不上传任何服务器。键盘快捷键：1-9 选择选项，Enter 下一题，R 重播音频。</p></div>';
    main.innerHTML = html;
    main.querySelectorAll('[data-set]').forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-set');
        var raw = b.getAttribute('data-val');
        var val = raw === 'true' ? true : raw === 'false' ? false : (isNaN(Number(raw)) ? raw : Number(raw));
        var patch = {}; patch[key] = val;
        saveSettings(patch);
        route();
      });
    });
    document.getElementById('export-data').addEventListener('click', function () {
      var blob = new Blob([JSON.stringify(MJT.storage.exportAll(), null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'minna-trainer-data-' + new Date().toISOString().slice(0, 10) + '.json';
      a.click();
    });
    document.getElementById('import-data').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          if (MJT.storage.importAll(JSON.parse(reader.result))) { alert('导入成功'); route(); }
          else alert('导入失败：文件格式不正确');
        } catch (err) { alert('导入失败：' + err.message); }
      };
      reader.readAsText(f);
    });
    document.getElementById('reset-data').addEventListener('click', function () {
      if (confirm('确定重置全部学习数据（进度、错题、统计、设置、审核决定）？此操作不可恢复。')) {
        Object.keys(MJT.storage.KEYS).forEach(function (k) { MJT.storage.remove(MJT.storage.KEYS[k]); });
        route();
      }
    });
  }

  /* ============ 路由表 ============ */
  var ROUTES = {
    home: pageHome,
    today: pageToday,
    scenario: pageScenario,
    numbers: pageNumbers,
    listening: pageListening,
    grammar: bankPage('语法训练',
      '单项选择、助词选择、动词/形容词变形、敬体简体转换、改错等。每题附完整解析（句义、语法结构、变形过程、各错误选项原因、知识图谱位置）。',
      function (s) { return MJT.grammar.pool(s); },
      function (box, o) { MJT.grammar.startSession(box, o); }),
    reading: bankPage('阅读训练',
      '通知、邮件、日记等贴近生活的短文。作答后显示翻译、逐句分析、信息定位与推理过程说明。',
      function (s) { return MJT.reading.pool(s); },
      function (box, o) { MJT.reading.startSession(box, o); }),
    mixed: bankPage('综合训练',
      '混合听力、语法、阅读与数字反应，按错题权重自适应出题。',
      null,
      function (box, o) { MJT.mixed.startSession(box, o); }),
    errorbook: pageErrorbook,
    stats: pageStats,
    knowledge: pageKnowledge,
    review: pageReview,
    settings: pageSettings
  };

  /* ============ 启动 ============ */
  function boot() {
    applyTheme();
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
    }
    // 启动时运行数据验证器；失败条目已被 validator/scope 双重拦截
    MJT.app.lastValidation = MJT.validator.validateAll();
    window.addEventListener('hashchange', route);
    route();
  }

  return {
    boot: boot,
    navigate: navigate,
    getSettings: getSettings,
    saveSettings: saveSettings,
    saveLastSession: saveLastSession,
    importedItems: importedItems,
    handleImport: handleImport,
    lastValidation: null
  };
})();

document.addEventListener('DOMContentLoaded', MJT.app.boot);
