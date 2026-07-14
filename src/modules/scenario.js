/* 场景训练引擎：六阶段沉浸式流程
 *
 * 进入场景（只显示任务/人物/地点）→ 连续听力（不逐句显示原文）→
 * 信息提取（≥2个信息点）→ 用户回应 → 完整解析（原文/假名/翻译/
 * 逐句作用/语法/易听错点/更自然回应）→ 影子跟读（意群停顿）→
 * 迁移强化（同知识点换场景出题）。
 *
 * 定位：场景模板属于程序逻辑 / 基于已验证知识生成的练习，直接进入正式
 * 训练，不作为必须审核对象。只有教材原文/词汇/语法/例句走 pending→verified。
 * 场景可用性只受两点约束：① 用户在审核页显式"拒绝"的场景排除；
 * ② 扩展词汇设置（off/light）过滤。任何时候进入场景训练都有内容。 */
window.MJT = window.MJT || {};

MJT.scenario = (function () {
  var esc = function (s) { return MJT.session.esc(s); };
  var fmtSec = function (ms) { return MJT.session.fmtSec(ms); };

  var CATEGORY_NAMES = {
    shopping: '日常购物', dining: '餐饮', medical: '医疗',
    transport: '交通', school: '学校', housing: '居住',
    'daily-life': '日常生活', social: '社交', administrative: '行政手续'
  };

  function all() { return MJT_DATA.pendingScenarios || []; }

  function byId(id) {
    var out = null;
    all().forEach(function (s) { if (s.id === id) out = s; });
    return out;
  }

  /* 场景池：模板即程序逻辑，默认全部可直接训练（formal）。
   * 仅排除：① 用户在审核页显式"拒绝"(rejected) 的场景；
   *        ② 扩展词汇设置 off（含扩展词的场景）/ light（扩展词>5）。
   * previewable 保留为空（不再有"审核预览"门禁）。 */
  function pools(settings) {
    var decisions = MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {});
    var formal = [], previewable = [], blocked = [];
    all().forEach(function (s) {
      if (MJT.scope.effectiveSourceStatus(s, decisions) === 'rejected') {
        blocked.push({ item: s, reason: '已在数据审核页拒绝' }); return;
      }
      var ev = (s.extendedVocab || []).length;
      var mode = settings.extendedVocab || 'light';
      if (mode === 'off' && ev > 0) { blocked.push({ item: s, reason: '含扩展词汇（当前100%教材范围模式）' }); return; }
      if (mode === 'light' && ev > 5) { blocked.push({ item: s, reason: '扩展词汇超过5个（当前少量扩展模式）' }); return; }
      formal.push(s);
    });
    return { formal: formal, previewable: previewable, blocked: blocked };
  }

  /* ============ 播放器 ============ */

  function start(container, scenarioId, opts) {
    opts = opts || {};
    var sc = byId(scenarioId);
    if (!sc) { container.innerHTML = '<div class="panel warn-panel">场景不存在：' + esc(scenarioId) + '</div>'; return; }
    var settings = MJT.app.getSettings();
    var preview = !!opts.preview;

    var state = {
      stage: 'intro',
      qIndex: 0,             // 当前作答的步骤索引
      answers: [],           // {step, userAnswer, correct, responseTime}
      startTime: 0,
      listenGroups: buildListenGroups(sc),
      groupIdx: 0
    };

    var listenSteps = sc.steps.filter(function (s) { return s.script; });
    var questionSteps = sc.steps.filter(function (s) {
      return s.interactionType === 'choose' || s.interactionType === 'respond' || s.interactionType === 'input';
    });

    function buildListenGroups(sc2) {
      var steps = sc2.steps.filter(function (s) { return s.script; });
      var size = sc2.difficulty >= 3 ? steps.length : (sc2.difficulty === 2 ? 3 : 1);
      var groups = [];
      for (var i = 0; i < steps.length; i += size) groups.push(steps.slice(i, i + size));
      return groups;
    }

    function playSteps(steps, rate, idx, gap) {
      idx = idx || 0;
      if (idx >= steps.length) return;
      MJT.speech.speak(steps[idx].script.replace(/[（(].*?[)）]/g, ''), {
        rate: (rate || 1) * (settings.ttsRate || 1),
        volume: settings.volume,
        audioUrl: steps[idx].audioUrl || null,
        onend: function () {
          setTimeout(function () { playSteps(steps, rate, idx + 1, gap); }, gap !== undefined ? gap : 700);
        }
      });
    }

    /* 意群停顿播放：按 、。？ 切分（不逐词切割） */
    function playChunked(script, rate) {
      var chunks = script.split(/(?<=[、。？！])/).map(function (c) { return c.trim(); }).filter(Boolean);
      var i = 0;
      (function next() {
        if (i >= chunks.length) return;
        MJT.speech.speak(chunks[i], {
          rate: (rate || 0.85) * (settings.ttsRate || 1),
          volume: settings.volume,
          onend: function () { i++; setTimeout(next, 650); }
        });
      })();
    }

    function head(sub) {
      return '<div class="session-head">' +
        '<span class="progress-pill">' + esc(sc.title) + '</span>' +
        '<span class="badge">' + esc(CATEGORY_NAMES[sc.category] || sc.category) + '</span>' +
        '<span class="badge">难度 ' + '★'.repeat(sc.difficulty) + '</span>' +
        '<span class="badge badge-origin">' + esc(sc.displaySource) + '</span>' +
        (preview ? '<span class="badge badge-pending">审核预览模式 · 不计入正式统计</span>' : '') +
        (sub ? '<span class="badge badge-scope">' + esc(sub) + '</span>' : '') +
        '</div>' +
        '<p class="tts-note">※ 浏览器语音合成，非日本母语者真人录音（数据保留 audioUrl 真实音频接口）</p>';
    }

    /* ---- 阶段一：进入场景（不显示全文/翻译/答案） ---- */
    function renderIntro() {
      state.stage = 'intro';
      var evMode = settings.extendedVocab || 'light';
      var ev = sc.extendedVocab || [];
      var html = head('阶段 1/6 · 进入场景');
      html += '<div class="panel scenario-intro">' +
        '<h2>' + esc(sc.title) + '</h2>' +
        '<p><b>任务：</b>' + esc(sc.goal) + '</p>' +
        '<p><b>地点：</b>' + esc(sc.setting) + '　<b>人物：</b>' + sc.roles.map(esc).join('、') + '</p>' +
        '<p class="dim">信息类型：' + (sc.informationTypes || []).map(esc).join('、') +
        '　·　对话轮数：' + listenSteps.length + '　·　理解问题：' + questionSteps.length + ' 个</p>';
      if (ev.length && evMode !== 'off') {
        html += '<div class="ev-block"><p class="script-label">场景词卡（扩展生活词汇 · 教材第1～21课之外，帮助理解场景，不是考查重点）</p>' +
          ev.map(function (w) {
            return '<div class="ev-card"><span class="jp-text">' + esc(w.word) + '</span>（' + esc(w.kana) + '）' +
              '<span class="dim"> ' + esc(w.pos) + ' · ' + esc(w.zh) + ' · 出现原因：' + esc(w.reason) +
              ' · ' + (w.required ? '建议学习' : '了解即可') + '</span></div>';
          }).join('') + '</div>';
      }
      html += '<button class="btn btn-primary" id="sc-start">开始连续听力 →</button></div>';
      container.innerHTML = html;
      container.querySelector('#sc-start').addEventListener('click', renderListen);
    }

    /* ---- 阶段二：连续听力（不显示原文） ---- */
    function renderListen() {
      state.stage = 'listen';
      var g = state.listenGroups;
      var html = head('阶段 2/6 · 连续听力（' + (state.groupIdx + 1) + '/' + g.length + ' 段）');
      html += '<div class="panel"><p><b>' + esc(sc.goal) + '</b></p>' +
        '<p class="dim">正在播放对话，请专心听。原文将在全部作答后才显示。' +
        (sc.difficulty >= 3 ? '（综合难度：连续播放全部对话）' : sc.difficulty === 2 ? '（中等难度：每段2～3轮连续播放）' : '（基础难度：分段播放）') + '</p>' +
        '<div class="audio-player">' +
        '<button class="btn btn-audio" data-a="replay">▶ 再听本段</button>' +
        '<button class="btn btn-audio" data-a="slow">🐢 慢速重听</button>' +
        (state.groupIdx + 1 < g.length ? '<button class="btn btn-primary" data-a="next">听下一段 →</button>'
          : '<button class="btn btn-primary" data-a="questions">进入信息提取 →</button>') +
        '</div></div>';
      container.innerHTML = html;
      playSteps(g[state.groupIdx], 1);
      container.querySelectorAll('[data-a]').forEach(function (b) {
        b.addEventListener('click', function () {
          var a = b.getAttribute('data-a');
          MJT.speech.stop();
          if (a === 'replay') playSteps(g[state.groupIdx], 1);
          else if (a === 'slow') playSteps(g[state.groupIdx], 0.7);
          else if (a === 'next') { state.groupIdx++; renderListen(); }
          else renderQuestion();
        });
      });
    }

    /* ---- 阶段三/四：信息提取 + 用户回应 ---- */
    function renderQuestion() {
      MJT.speech.stop();
      if (state.qIndex >= questionSteps.length) return renderReview();
      var step = questionSteps[state.qIndex];
      state.stage = 'question';
      var isRespond = step.interactionType === 'respond';
      var stageLabel = isRespond ? '阶段 4/6 · 用户回应' : '阶段 3/6 · 信息提取';
      var html = head(stageLabel + '（' + (state.qIndex + 1) + '/' + questionSteps.length + '）');
      html += '<div class="question-card">';
      if (isRespond && step.script) {
        html += '<div class="audio-player"><button class="btn btn-audio" id="sc-replay-line">▶ 再听这句</button></div>';
      } else {
        html += '<div class="audio-player"><button class="btn btn-audio" id="sc-replay-all">▶ 再听对话</button></div>';
      }
      html += '<p class="question-text jp-text">' + esc(step.question) + '</p>';
      if (step.interactionType === 'input') {
        html += '<div class="input-row"><input type="text" id="sc-input" class="answer-input" placeholder="输入答案">' +
          '<button class="btn btn-primary" id="sc-submit">提交</button></div>';
      } else {
        html += '<div class="options">' + step.options.map(function (opt, i) {
          return '<button class="btn option-btn" data-opt="' + esc(opt) + '"><span class="opt-key">' + (i + 1) + '</span> <span class="opt-text jp-text">' + esc(opt) + '</span></button>';
        }).join('') + '</div>';
      }
      html += '</div><div id="sc-result"></div>';
      container.innerHTML = html;
      state.startTime = performance.now();
      var rl = container.querySelector('#sc-replay-line');
      if (rl) {
        rl.addEventListener('click', function () {
          MJT.speech.speak(step.script, { rate: settings.ttsRate, volume: settings.volume });
        });
        MJT.speech.speak(step.script, { rate: settings.ttsRate, volume: settings.volume });
      }
      var ra = container.querySelector('#sc-replay-all');
      if (ra) ra.addEventListener('click', function () { playSteps(listenSteps, 1); });
      container.querySelectorAll('[data-opt]').forEach(function (b) {
        b.addEventListener('click', function () { answer(step, b.getAttribute('data-opt')); });
      });
      var sub = container.querySelector('#sc-submit');
      if (sub) sub.addEventListener('click', function () {
        var v = (container.querySelector('#sc-input').value || '').trim();
        if (v) answer(step, v);
      });
    }

    function judge(step, userAnswer) {
      var norm = function (s) { return String(s).replace(/[\s。、！？!?.]/g, ''); };
      if (step.acceptedAnswers && step.acceptedAnswers.length) {
        return step.acceptedAnswers.some(function (a) { return norm(a) === norm(userAnswer); });
      }
      return norm(step.answer) === norm(userAnswer);
    }

    function answer(step, userAnswer) {
      MJT.speech.stop();
      var rt = Math.round(performance.now() - state.startTime);
      var correct = judge(step, userAnswer);
      state.answers.push({ step: step, userAnswer: userAnswer, correct: correct, responseTime: rt });
      if (!preview) {
        MJT.stats.record({
          questionId: sc.id + '/' + step.stepId,
          module: 'scenario', scenarioId: sc.id,
          category: step.infoCategory || null,
          questionText: '【' + sc.title + '】' + step.question,
          correct: correct, startTime: 0, answerTime: 0, responseTime: rt,
          interaction: step.interactionType
        });
        if (!correct) {
          MJT.errorbook.record({
            id: sc.id + '/' + step.stepId,
            type: step.interactionType === 'respond' ? 'scenario-respond' : 'scenario-info',
            numberCategory: step.infoCategory || null,
            question: '【' + sc.title + '】' + step.question,
            answer: step.answer,
            lesson: [], grammarPoints: step.grammarPoints || [],
            knowledgeMap: sc.knowledgeMap || []
          }, userAnswer, rt, false);
        }
        (step.grammarPoints || []).forEach(function (gp) { MJT.mastery.record(gp, sc.id, correct); });
        if (step.infoCategory) MJT.mastery.record('数字:' + step.infoCategory, sc.id, correct);
      }
      // 简短反馈（不显示原文，完整解析留到阶段五）
      var el = container.querySelector('#sc-result');
      container.querySelectorAll('[data-opt]').forEach(function (b) {
        var v = b.getAttribute('data-opt');
        if (v === step.answer || (step.acceptedAnswers || []).indexOf(v) !== -1) b.classList.add('correct');
        else if (v === userAnswer && !correct) b.classList.add('wrong');
        b.disabled = true;
      });
      el.innerHTML = '<div class="result-panel ' + (correct ? 'result-correct' : 'result-wrong') + '">' +
        '<div class="result-head"><strong>' + (correct ? '✓ 正确' : '✗ 错误') + '</strong>' +
        '<span class="rt-badge">反应时间 <b>' + fmtSec(rt) + '</b></span></div>' +
        (!correct ? '<p class="dim">正确答案与完整解析将在场景结束后统一显示。</p>' : '') +
        '<button class="btn btn-primary" data-a="next">继续 →</button></div>';
      el.querySelector('[data-a="next"]').addEventListener('click', function () {
        state.qIndex++; renderQuestion();
      });
    }

    /* ---- 阶段五：完整解析 ---- */
    function renderReview() {
      state.stage = 'review';
      var correct = state.answers.filter(function (a) { return a.correct; }).length;
      var html = head('阶段 5/6 · 完整解析');
      html += '<div class="panel"><p><b>本场景成绩：</b>' + correct + ' / ' + state.answers.length +
        '　平均反应 ' + fmtSec(state.answers.reduce(function (s, a) { return s + a.responseTime; }, 0) / Math.max(1, state.answers.length)) + '</p></div>';

      html += '<div class="panel"><p class="script-label">完整原文与逐句解析</p>';
      sc.steps.forEach(function (step) {
        if (!step.script) return;
        var note = (sc.review && sc.review.lineNotes && sc.review.lineNotes[step.stepId]) || step.explanation || '';
        html += '<div class="review-line">' +
          '<p><span class="badge">' + esc(step.speaker) + '</span> <span class="jp-text">' + esc(step.script) + '</span> ' +
          '<button class="btn btn-small" data-play="' + esc(step.stepId) + '">▶</button></p>' +
          (settings.showKana && step.furiganaText ? '<p class="kana-line">' + esc(step.furiganaText) + '</p>' : '') +
          (settings.showZh ? '<p class="zh-line">' + esc(step.translation) + '</p>' : '') +
          (note ? '<p class="dim small">' + esc(note) + '</p>' : '') +
          (step.listeningTraps && step.listeningTraps.length ? '<p class="wrong-reason">易听错：' + step.listeningTraps.map(esc).join('；') + '</p>' : '') +
          '</div>';
      });
      html += '</div>';

      // 用户作答回顾 + 更自然回应
      html += '<div class="panel"><p class="script-label">你的作答</p>';
      state.answers.forEach(function (a) {
        html += '<div class="review-line' + (a.correct ? '' : ' wrong-line') + '">' +
          '<p>' + (a.correct ? '✓' : '✗') + ' ' + esc(a.step.question) + '</p>' +
          '<p class="dim">你的答案：' + esc(a.userAnswer) + (a.correct ? '' : '　正确答案：<span class="correct-text jp-text">' + esc(a.step.answer) + '</span>') + '</p>' +
          (a.step.explanation ? '<p class="dim small">' + esc(a.step.explanation) + '</p>' : '') +
          '</div>';
      });
      if (sc.review && sc.review.naturalResponses && sc.review.naturalResponses.length) {
        html += '<p class="script-label">更自然的回应方式</p>' + sc.review.naturalResponses.map(function (n) {
          return '<p><span class="jp-text">' + esc(n.ja) + '</span> <span class="dim">— ' + esc(n.note) + '</span></p>';
        }).join('');
      }
      if (sc.review && sc.review.grammarNotes && sc.review.grammarNotes.length) {
        html += '<p class="script-label">重点语法 · 动词变形 · 助词</p><ul>' +
          sc.review.grammarNotes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>';
      }
      html += '</div>';
      html += '<div class="btn-row"><button class="btn btn-primary" id="sc-shadow">进入影子跟读 →</button>' +
        '<button class="btn" id="sc-skip-shadow">跳过，进入迁移强化 →</button></div>';
      container.innerHTML = html;
      container.querySelectorAll('[data-play]').forEach(function (b) {
        b.addEventListener('click', function () {
          var st = sc.steps.filter(function (s) { return s.stepId === b.getAttribute('data-play'); })[0];
          if (st) MJT.speech.speak(st.script, { rate: settings.ttsRate, volume: settings.volume });
        });
      });
      container.querySelector('#sc-shadow').addEventListener('click', renderShadow);
      container.querySelector('#sc-skip-shadow').addEventListener('click', renderReinforce);
    }

    /* ---- 影子跟读（意群停顿、角色过滤、循环） ---- */
    function renderShadow() {
      state.stage = 'shadow';
      var roles = [];
      listenSteps.forEach(function (s) { if (roles.indexOf(s.speaker) === -1) roles.push(s.speaker); });
      var shadowState = { role: 'all', loopStep: null, loopAll: false };
      var html = head('阶段 6a/6 · 影子跟读');
      html += '<div class="panel"><p class="dim">听一句、跟着说一句。「意群停顿」按（、。？）切分自然停顿，不逐词切割。</p>' +
        '<div class="audio-player">' +
        '<button class="btn btn-audio" data-sr="0.7">🐢 慢速</button>' +
        '<button class="btn btn-audio" data-sr="1">正常</button>' +
        '<button class="btn btn-audio" data-sr="1.25">🐇 稍快</button>' +
        '<button class="btn btn-audio" data-sr="chunk">✂ 意群停顿</button>' +
        '<button class="btn btn-audio" data-sr="loopall">🔁 完整对话循环</button>' +
        '<button class="btn btn-audio" data-sr="stop">⏹ 停止</button>' +
        '</div>' +
        '<div class="chip-row">角色：<button class="chip active" data-role="all">全部</button>' +
        roles.map(function (r) { return '<button class="chip" data-role="' + esc(r) + '">' + esc(r) + '</button>'; }).join('') +
        '</div>';
      listenSteps.forEach(function (s) {
        html += '<div class="review-line" data-linerole="' + esc(s.speaker) + '">' +
          '<p><span class="badge">' + esc(s.speaker) + '</span> <span class="jp-text">' + esc(s.script) + '</span> ' +
          '<button class="btn btn-small" data-sline="' + esc(s.stepId) + '">▶</button>' +
          '<button class="btn btn-small" data-schunk="' + esc(s.stepId) + '">✂ 意群</button>' +
          '<button class="btn btn-small" data-sloop="' + esc(s.stepId) + '">🔁 单句循环</button></p></div>';
      });
      html += '<button class="btn btn-primary" id="sc-to-reinforce">完成跟读，进入迁移强化 →</button></div>';
      container.innerHTML = html;
      var rate = 1;
      function stepById(id) { return listenSteps.filter(function (s) { return s.stepId === id; })[0]; }
      function visibleSteps() {
        return shadowState.role === 'all' ? listenSteps : listenSteps.filter(function (s) { return s.speaker === shadowState.role; });
      }
      container.querySelectorAll('[data-sr]').forEach(function (b) {
        b.addEventListener('click', function () {
          var v = b.getAttribute('data-sr');
          MJT.speech.stop();
          if (v === 'stop') return;
          if (v === 'chunk') { playChunkedSeq(visibleSteps(), 0); return; }
          if (v === 'loopall') { loopAllPlay(); return; }
          rate = parseFloat(v);
          playSteps(visibleSteps(), rate, 0, 1200); // 加大句间停顿供跟读
        });
      });
      var loopAllOn = false;
      function loopAllPlay() {
        loopAllOn = !loopAllOn;
        if (!loopAllOn) { MJT.speech.stop(); return; }
        (function cycle(i) {
          var steps = visibleSteps();
          if (!loopAllOn || !container.isConnected) return;
          if (i >= steps.length) { setTimeout(function () { cycle(0); }, 1500); return; }
          MJT.speech.speak(steps[i].script, {
            rate: rate * settings.ttsRate, volume: settings.volume,
            onend: function () { setTimeout(function () { cycle(i + 1); }, 1200); }
          });
        })(0);
      }
      function playChunkedSeq(steps, i) {
        if (i >= steps.length) return;
        var chunks = steps[i].script.split(/(?<=[、。？！])/).filter(Boolean);
        var j = 0;
        (function next() {
          if (j >= chunks.length) return setTimeout(function () { playChunkedSeq(steps, i + 1); }, 900);
          MJT.speech.speak(chunks[j], { rate: 0.85 * settings.ttsRate, volume: settings.volume, onend: function () { j++; setTimeout(next, 700); } });
        })();
      }
      container.querySelectorAll('[data-role]').forEach(function (b) {
        b.addEventListener('click', function () {
          container.querySelectorAll('[data-role]').forEach(function (x) { x.classList.remove('active'); });
          b.classList.add('active');
          shadowState.role = b.getAttribute('data-role');
          container.querySelectorAll('[data-linerole]').forEach(function (line) {
            line.style.display = (shadowState.role === 'all' || line.getAttribute('data-linerole') === shadowState.role) ? '' : 'none';
          });
        });
      });
      container.querySelectorAll('[data-sline]').forEach(function (b) {
        b.addEventListener('click', function () {
          var s = stepById(b.getAttribute('data-sline'));
          MJT.speech.speak(s.script, { rate: rate * settings.ttsRate, volume: settings.volume });
        });
      });
      container.querySelectorAll('[data-schunk]').forEach(function (b) {
        b.addEventListener('click', function () { playChunked(stepById(b.getAttribute('data-schunk')).script, 0.85); });
      });
      container.querySelectorAll('[data-sloop]').forEach(function (b) {
        b.addEventListener('click', function () {
          var s = stepById(b.getAttribute('data-sloop'));
          var stop = false;
          var handler = function () {
            if (stop) return;
            MJT.speech.speak(s.script, { rate: rate * settings.ttsRate, volume: settings.volume, onend: function () { setTimeout(handler, 1000); } });
          };
          MJT.speech.stop(); handler();
          b.textContent = '⏹ 停止循环';
          b.addEventListener('click', function () { stop = true; MJT.speech.stop(); }, { once: true });
        });
      });
      container.querySelector('#sc-to-reinforce').addEventListener('click', function () { MJT.speech.stop(); renderReinforce(); });
    }

    /* ---- 阶段六：迁移强化（同知识点换场景出题） ---- */
    function renderReinforce() {
      state.stage = 'reinforce';
      // 找出本场景答错的数字类别；没有错误则取场景涉及类别
      var weakCats = [];
      state.answers.forEach(function (a) {
        if (!a.correct && a.step.infoCategory && weakCats.indexOf(a.step.infoCategory) === -1) weakCats.push(a.step.infoCategory);
      });
      if (!weakCats.length) weakCats = (sc.numberTypes || []).slice();
      var html = head('阶段 6b/6 · 迁移强化');
      html += '<div class="panel"><p class="dim">围绕本场景的知识点，在<b>另一个场景</b>中再练一题（同一知识点需在' +
        MJT.mastery.CONTEXTS_REQUIRED + '个不同场景表现稳定才算掌握）。</p><div id="sc-transfer"></div></div>';
      html += '<div class="panel" id="sc-done-panel"></div>';
      container.innerHTML = html;

      var transferBox = container.querySelector('#sc-transfer');
      var cat = weakCats.length ? MJT.random.pick(weakCats) : 'mixed';
      // 用框架引擎生成不同场景的迁移题（排除与本场景同名场景）
      MJT.session.start(transferBox, {
        module: preview ? 'scenario-preview' : 'scenario-transfer',
        categoryId: cat, difficulty: sc.difficulty,
        count: Math.min(3, (sc.reinforcement && sc.reinforcement.length) || 2),
        getNext: function () {
          var q = MJT.scenarioNumbers.generate(cat === 'people' ? 'counter' : cat, 4, { minLevel: 2 });
          if (q && q.sceneName === sc.title) q = MJT.scenarioNumbers.generate(cat, 4, { minLevel: 2 });
          return q;
        },
        onFinish: function () { renderDone(); }
      });
      renderDone(true);
    }

    function renderDone(pendingTransfer) {
      var panel = container.querySelector('#sc-done-panel');
      if (!panel) return;
      var correct = state.answers.filter(function (a) { return a.correct; }).length;
      if (!pendingTransfer && !preview) {
        var hist = MJT.storage.load(MJT.storage.KEYS.trainingHistory, []);
        hist.push({
          at: new Date().toISOString(), module: 'scenario', scenarioId: sc.id, scenarioTitle: sc.title,
          count: state.answers.length, accuracy: state.answers.length ? correct / state.answers.length : null,
          avgResponseMs: state.answers.length ? Math.round(state.answers.reduce(function (s, a) { return s + a.responseTime; }, 0) / state.answers.length) : null,
          difficulty: sc.difficulty
        });
        MJT.storage.save(MJT.storage.KEYS.trainingHistory, hist);
        MJT.app.saveLastSession({ module: 'scenario', scenarioId: sc.id });
      }
      var related = (sc.reinforcement || []).filter(function (r) { return r.type === 'scenario' && byId(r.ref); });
      panel.innerHTML = '<p class="script-label">场景完成</p>' +
        '<p>理解成绩 ' + correct + '/' + state.answers.length + (preview ? '（预览模式，未计入统计）' : '') + '</p>' +
        (related.length ? '<p>相近场景（同知识点迁移）：' + related.map(function (r) {
          return '<button class="btn btn-small" data-goto="' + esc(r.ref) + '">' + esc(byId(r.ref).title) + '</button>';
        }).join(' ') + '</p>' : '') +
        '<div class="btn-row"><button class="btn" data-goto-list="1">返回场景列表</button></div>';
      panel.querySelectorAll('[data-goto]').forEach(function (b) {
        b.addEventListener('click', function () { start(container, b.getAttribute('data-goto'), opts); });
      });
      panel.querySelector('[data-goto-list]').addEventListener('click', function () { MJT.app.navigate('scenario'); });
    }

    renderIntro();
  }

  return { all: all, byId: byId, pools: pools, start: start, CATEGORY_NAMES: CATEGORY_NAMES };
})();
