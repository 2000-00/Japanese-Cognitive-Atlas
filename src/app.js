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
    adaptiveNext: true      // 根据错题自动生成下一组
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

  /* ============ 路由 ============ */
  var PAGES = [
    { id: 'home', name: '首页', icon: '🏠' },
    { id: 'today', name: '今日训练', icon: '📅' },
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
      html += '<div class="panel"><p class="script-label">最需要加强的项目</p><ul>' + weakest.map(function (w) {
        return '<li><b>' + esc(catNames[w.key] || moduleNames[w.key] || w.key) + '</b> — 正确率 ' +
          Math.round(w.stats.accuracy * 100) + '%，平均 ' + fmtSec(w.stats.avgResponseMs) + '</li>';
      }).join('') + '</ul></div>';
    } else {
      html += '<p class="dim">（完成几组训练后，这里会显示最需要加强的项目）</p>';
    }

    html += '<div class="btn-row home-actions">';
    if (last && last.module) {
      html += '<button class="btn btn-primary" data-go="continue">▶ 继续上次训练（' + esc(moduleNames[last.module] || last.module) +
        (last.category && catNames[last.category] ? '·' + catNames[last.category] : '') + '）</button>';
    }
    html += '<button class="btn btn-primary" data-go="random">🎲 开始随机训练</button>' +
      '<button class="btn btn-primary" data-go="numbers">🔢 开始数字专项</button>' +
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
        if (g === 'continue' && last) {
          if (last.module === 'numbers') startNumberSession(main, last.category || 'mixed', last.difficulty || s.difficulty);
          else navigate(last.module);
        } else if (g === 'random') navigate('mixed');
        else navigate('numbers');
      });
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

  function startNumberSession(main, category, difficulty) {
    var s = getSettings();
    var box = document.getElementById('numbers-session') || main;
    var counterPool = null;
    if (category === 'counter' || category === 'mixed') {
      var filtered = counterPoolForSettings(s);
      counterPool = filtered.allowed;
      if (category === 'counter' && !counterPool.length) {
        box.innerHTML = '<div class="panel warn-panel"><h3>当前已验证题目数量不足</h3>' +
          '<p>教材范围模式下，没有数量词的课程归属已被核实（本系统不默认任何数量词已在第21课前出现）。</p>' +
          '<p>可以：① 在「数据审核」页核实数量词课程出处；② 在设置中切换到「通用读法模式」（明确不声明教材出处）。</p>' +
          '<div class="btn-row"><button class="btn" onclick="MJT.app.navigate(\'review\')">前往数据审核</button>' +
          '<button class="btn" onclick="MJT.app.navigate(\'settings\')">前往设置</button></div></div>';
        return;
      }
    }
    saveLastSession({ module: 'numbers', category: category, difficulty: difficulty });
    MJT.session.start(box, {
      module: 'numbers',
      categoryId: category,
      difficulty: difficulty,
      count: s.questionCount,
      getNext: function () {
        return MJT.numbers.generate(category, difficulty, { counterPool: counterPool });
      },
      onRestart: function (plan) {
        startNumberSession(main, category, plan.difficulty);
      }
    });
  }

  function pageNumbers(main, param) {
    var s = getSettings();
    var cats = [{ id: 'mixed', name: '混合模式（推荐）' }].concat(MJT_DATA.meta.numberCategories);
    var html = '<h2>数字专项训练</h2>' +
      '<p class="dim">听到日语直接形成数量概念。全部读法为已验证的标准日语通用读法（' +
      (s.counterMode === 'universal' ? '通用读法模式：不声明教材课程出处' : '教材范围模式') + '）。</p>';
    html += '<div class="panel"><div class="form-row"><label>类别</label><div class="chip-row" id="num-cats">' +
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
    var chosen = { cat: param || 'mixed', diff: s.difficulty };
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
    html += '<h3>数字专项各类别</h3><div class="table-wrap"><table class="data-table"><thead><tr><th>类别</th><th>题数</th><th>正确率</th><th>平均反应</th><th>最快</th><th>最慢</th></tr></thead><tbody>';
    Object.keys(ov.byCategory).forEach(function (c) { html += row(catNames[c] || c, ov.byCategory[c]); });
    html += '</tbody></table></div>';
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

  /* ============ 数据审核 ============ */
  function pageReview(main) {
    var report = MJT.validator.validateAll();
    MJT.app.lastValidation = report;
    var decisions = MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {});
    var html = '<h2>数据审核</h2>';
    html += '<div class="stat-grid">' +
      '<div class="stat"><div class="stat-value ok">' + report.counts.verified + '</div><div class="stat-label">已验证</div></div>' +
      '<div class="stat"><div class="stat-value warn">' + report.counts.pending + '</div><div class="stat-label">待审核</div></div>' +
      '<div class="stat"><div class="stat-value bad">' + report.counts.rejected + '</div><div class="stat-label">已拒绝</div></div>' +
      '<div class="stat"><div class="stat-value bad">' + report.counts.invalid + '</div><div class="stat-label">校验失败</div></div>' +
      '</div>';
    html += '<p class="dim">最近一次验证：' + esc(report.ranAt) + '（每次打开本页与启动应用时自动运行）</p>';

    if (report.failures.length) {
      html += '<div class="panel warn-panel"><p class="script-label">校验失败条目（不进入任何训练）</p><ul>' +
        report.failures.map(function (f) {
          return '<li><b>' + esc(f.id) + '</b>（' + esc(f.dataset) + '）：' + esc(f.errors.join('；')) + '</li>';
        }).join('') + '</ul></div>';
    }

    html += '<div class="panel"><p class="script-label">审核说明</p>' +
      '<p>下列条目的<b>课程归属声明</b>尚未对照《大家的日语》实体教材核实（AI 不猜测某语法属于哪一课）。' +
      '请拿教材逐条确认后点击"核实通过"——这等同于 sourceType: user_material 的人工核实，条目随即进入正式训练。' +
      '错误的条目请点"拒绝"。决定保存在本机浏览器中，可随时撤销。</p></div>';

    function section(title, items, describe) {
      var out = '<h3>' + title + '（' + items.length + '）</h3>';
      items.forEach(function (it) {
        var d = decisions[it.id];
        var st = d ? d.status : it.sourceStatus;
        out += '<div class="review-item ' + esc(st) + '">' +
          '<div class="review-body">' + describe(it) + '</div>' +
          '<div class="review-actions">' +
          '<span class="badge badge-' + (st === 'verified' ? 'ok' : st === 'rejected' ? 'bad' : 'pending') + '">' +
          (st === 'verified' ? '已核实' : st === 'rejected' ? '已拒绝' : '待核实') + '</span>' +
          '<button class="btn btn-small" data-decide="verified" data-id="' + esc(it.id) + '">核实通过</button>' +
          '<button class="btn btn-small" data-decide="rejected" data-id="' + esc(it.id) + '">拒绝</button>' +
          (d ? '<button class="btn btn-small" data-decide="reset" data-id="' + esc(it.id) + '">撤销</button>' : '') +
          '</div></div>';
      });
      return out;
    }

    html += section('数量词课程归属', MJT_DATA.counters, function (c) {
      return '<b class="jp-text">' + esc(c.counter) + '</b>（' + esc(c.kana) + '，' + esc(c.zh) + '）— 读法已验证；' +
        '课程出处：' + esc(c.lessonAttribution.note) + '。核实时请填写实际课号后确认。';
    });
    html += section('语法题', MJT_DATA.pendingGrammar || [], function (q) {
      return '<b class="jp-text">' + esc(q.question) + '</b><br><span class="dim">声明课程：第' +
        esc((q.lesson || []).join('、')) + '课 · ' + esc(q.origin) + ' · ' + esc(q.sourceReference) + '</span>';
    });
    html += section('听力题', MJT_DATA.pendingListening || [], function (q) {
      return '<b class="jp-text">' + esc(q.scriptJa) + '</b><br><span class="dim">声明课程：第' +
        esc((q.lesson || []).join('、')) + '课 · ' + esc(q.origin) + '</span>';
    });
    html += section('阅读题', MJT_DATA.pendingReading || [], function (q) {
      return '<b>' + esc(q.title) + '</b>（' + esc(q.level) + '）<br><span class="dim">声明课程：第' +
        esc((q.lesson || []).join('、')) + '课 · ' + esc(q.origin) + '</span>';
    });

    main.innerHTML = html;
    main.querySelectorAll('[data-decide]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        var decide = b.getAttribute('data-decide');
        var map = MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {});
        if (decide === 'reset') delete map[id];
        else {
          if (decide === 'verified' && !confirm('确认你已对照《大家的日语》实体教材核实该条目的课程归属？\n（核实通过后该条目将进入正式训练）')) return;
          map[id] = { status: decide, at: new Date().toISOString(), by: 'user_manual_review' };
        }
        MJT.storage.save(MJT.storage.KEYS.reviewDecisions, map);
        route();
      });
    });
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
    numbers: pageNumbers,
    listening: bankPage('听力训练',
      '含单句听力、短对话、数字听写、动词变形识别、助词识别、影子跟读。使用浏览器语音合成（非母语者真人录音）；数据保留 audioUrl 接口以便后续接入真实音频。原文在作答后才显示。',
      function (s) { return MJT.listening.pool(s); },
      function (box, o) { MJT.listening.startSession(box, o); }),
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
    lastValidation: null
  };
})();

document.addEventListener('DOMContentLoaded', MJT.app.boot);
