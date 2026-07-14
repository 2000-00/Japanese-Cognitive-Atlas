/* 训练会话引擎：出题→计时→作答→判定→解析→统计→错题→下一题
 *
 * 用法：
 *   MJT.session.start(container, {
 *     module: 'numbers',
 *     count: 10,
 *     getNext: function(index){ return question|null },
 *     onFinish: function(summaryRecords){},
 *   })
 * 计时：performance.now()，responseTime 为出题(可作答)到作答的毫秒数。 */
window.MJT = window.MJT || {};

MJT.session = (function () {

  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fmtSec(ms) { return (ms / 1000).toFixed(1) + 's'; }

  function start(container, cfg) {
    var settings = MJT.app.getSettings();
    var state = {
      index: 0,
      count: cfg.count || settings.questionCount || 10,
      records: [],
      current: null,
      startTime: 0,
      answered: false,
      loop: false,
      keyHandler: null
    };

    function cleanup() {
      MJT.speech.stop();
      if (state.keyHandler) document.removeEventListener('keydown', state.keyHandler);
    }
    container.__mjtCleanup && container.__mjtCleanup();
    container.__mjtCleanup = cleanup;

    function next() {
      MJT.speech.stop();
      if (state.index >= state.count) return finish();
      var q = cfg.getNext(state.index);
      if (!q) {
        if (state.records.length) return finish();
        container.innerHTML =
          '<div class="panel warn-panel"><h3>当前已验证题目数量不足</h3>' +
          '<p>该模块暂无足够的已验证（verified）题目可用于正式训练。待核实内容不会进入正式训练。</p>' +
          '<p>请到「数据审核」页核实待审核题目的课程归属，核实通过后即可在此训练。</p>' +
          '<button class="btn" onclick="MJT.app.navigate(\'review\')">前往数据审核</button></div>';
        return;
      }
      state.current = q;
      state.index++;
      state.answered = false;
      render(q);
      state.startTime = performance.now();
      if (q.audioScript) playAudio(1);
    }

    function playAudio(rate) {
      var q = state.current;
      if (!q || !q.audioScript) return;
      MJT.speech.speak(q.audioScript, {
        rate: (rate || 1) * (settings.ttsRate || 1),
        volume: settings.volume !== undefined ? settings.volume : 1,
        audioUrl: q.audioUrl || null,
        onend: function () {
          if (state.loop && !state.answered) setTimeout(function () { if (state.loop && !state.answered) playAudio(rate); }, 800);
        }
      });
    }

    function render(q) {
      var html = '';
      html += '<div class="session-head">' +
        '<span class="progress-pill">' + state.index + ' / ' + state.count + '</span>' +
        '<span class="badge badge-origin">' + esc(q.origin || '') + '</span>' +
        '<span class="badge badge-scope">范围：第1～' + esc(settings.maxLesson) + '课</span>' +
        (q.lessonAttribution && q.lessonAttribution.status !== 'verified'
          ? '<span class="badge badge-pending">课程出处：待核实（通用读法）</span>'
          : (q.lesson ? '<span class="badge">第' + esc(Array.isArray(q.lesson) ? q.lesson.join('・') : q.lesson) + '课</span>' : '')) +
        '</div>';

      if (q.audioScript) {
        html += '<div class="audio-player" id="mjt-audio">' +
          '<button class="btn btn-audio" data-audio="play" title="播放">▶ 播放</button>' +
          '<button class="btn btn-audio" data-audio="slow" title="慢速">🐢 慢速</button>' +
          '<button class="btn btn-audio" data-audio="normal" title="正常">正常</button>' +
          '<button class="btn btn-audio" data-audio="fast" title="稍快">🐇 稍快</button>' +
          '<button class="btn btn-audio" data-audio="pause" title="暂停">⏸</button>' +
          '<button class="btn btn-audio" data-audio="loop" id="mjt-loop-btn" title="单句循环">🔁 循环</button>' +
          '</div>' +
          (MJT.speech.available
            ? '<p class="tts-note">※ 浏览器语音合成（非母语者真人录音）' + (MJT.speech.hasJaVoice() ? '' : '；未检测到日语语音，请在系统中安装日语TTS语音') + '</p>'
            : '<p class="tts-note warn">※ 当前浏览器不支持语音合成，无法播放。</p>');
      }

      html += '<div class="question-card">';
      if (q.passageJa) {
        html += '<div class="passage-block">' +
          (q.passageTitle ? '<p class="script-label">' + esc(q.passageTitle) + '</p>' : '') +
          '<p class="jp-text passage-text">' + esc(q.passageJa).replace(/\n/g, '<br>') + '</p>' +
          (settings.showKana && q.passageKana ? '<p class="kana-line">' + esc(q.passageKana).replace(/\n/g, '<br>') + '</p>' : '') +
          '</div>';
      }
      html += '<p class="question-text jp-text">' + esc(q.question).replace(/\n/g, '<br>') + '</p>';
      if (q.displayJa && !q.audioScript) {
        html += '<p class="question-ja jp-large">' + esc(q.displayJa) + '</p>';
        if (settings.showKana && q.questionKana) html += '<p class="kana-line">' + esc(q.questionKana) + '</p>';
      }
      if (!q.audioScript && q.questionKana && settings.showKana && !q.displayJa) {
        html += '<p class="kana-line">' + esc(q.questionKana) + '</p>';
      }

      if (q.format === 'audio-input') {
        html += '<div class="input-row"><input type="text" id="mjt-answer-input" class="answer-input" inputmode="numeric" placeholder="输入答案">' +
          '<button class="btn btn-primary" data-action="submit-input">提交</button></div>';
      } else {
        html += '<div class="options">';
        (q.options || []).forEach(function (opt, i) {
          html += '<button class="btn option-btn" data-option="' + esc(opt) + '"><span class="opt-key">' + (i + 1) + '</span> <span class="opt-text jp-text">' + esc(opt) + '</span></button>';
        });
        html += '</div>';
      }
      html += '</div><div id="mjt-result"></div>';
      container.innerHTML = html;

      // 事件绑定
      container.querySelectorAll('[data-audio]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var a = btn.getAttribute('data-audio');
          if (a === 'play' || a === 'normal') playAudio(1);
          else if (a === 'slow') playAudio(0.65);
          else if (a === 'fast') playAudio(1.25);
          else if (a === 'pause') MJT.speech.stop();
          else if (a === 'loop') {
            state.loop = !state.loop;
            btn.classList.toggle('active', state.loop);
            if (state.loop) playAudio(1);
          }
        });
      });
      container.querySelectorAll('[data-option]').forEach(function (btn) {
        btn.addEventListener('click', function () { answer(btn.getAttribute('data-option')); });
      });
      var submitBtn = container.querySelector('[data-action="submit-input"]');
      if (submitBtn) {
        var doSubmit = function () {
          var v = (container.querySelector('#mjt-answer-input').value || '').trim();
          if (v) answer(v);
        };
        submitBtn.addEventListener('click', doSubmit);
        container.querySelector('#mjt-answer-input').addEventListener('keydown', function (e) {
          if (e.key === 'Enter') doSubmit();
        });
      }
    }

    /* 判定：支持 acceptedAnswers（用户回应类题目允许多个自然答案） */
    function isCorrect(q, userAnswer) {
      if (q.format === 'audio-input') {
        var norm = function (s) { return String(s).replace(/[^0-9]/g, ''); };
        return norm(userAnswer) === norm(q.answer);
      }
      if (q.acceptedAnswers && q.acceptedAnswers.length) {
        var strip = function (s) { return String(s).replace(/[\s。、！？!?.]/g, ''); };
        if (q.acceptedAnswers.some(function (a) { return strip(a) === strip(userAnswer); })) return true;
      }
      return String(userAnswer) === String(q.answer);
    }

    function answer(userAnswer) {
      if (state.answered) return;
      state.answered = true;
      state.loop = false;
      MJT.speech.stop();
      var q = state.current;
      var answerTime = performance.now();
      var responseTime = Math.round(answerTime - state.startTime);
      var correct = isCorrect(q, userAnswer);

      var rec = {
        questionId: q.id,
        module: cfg.module || q.module || 'unknown',
        category: q.numberCategory || null,
        scenarioId: q.scenarioId || q.frameId || null,
        level: q.level || null,
        warmup: !!q.warmup,
        questionText: q.question || '',
        correct: correct,
        startTime: Math.round(state.startTime),
        answerTime: Math.round(answerTime),
        responseTime: responseTime
      };
      state.records.push(rec);
      MJT.stats.record(rec);
      if (MJT.mastery) MJT.mastery.recordFromQuestion(q, correct);

      var errorType = null;
      if (!correct) errorType = MJT.errorbook.record(q, userAnswer, responseTime, false);
      else {
        MJT.errorbook.markPracticed(q.id, true);
        if (responseTime > MJT.errorbook.SLOW_THRESHOLD_MS) errorType = MJT.errorbook.record(q, userAnswer, responseTime, true);
      }
      MJT.app.saveLastSession({ module: cfg.module, category: cfg.categoryId || null, difficulty: cfg.difficulty || 1 });

      // 高亮选项
      container.querySelectorAll('[data-option]').forEach(function (btn) {
        var v = btn.getAttribute('data-option');
        if (String(v) === String(q.answer)) btn.classList.add('correct');
        else if (String(v) === String(userAnswer) && !correct) btn.classList.add('wrong');
        btn.disabled = true;
      });

      renderResult(q, userAnswer, correct, responseTime, errorType);

      if (settings.autoNext && correct) {
        setTimeout(function () { if (state.answered) next(); }, 2500);
      }
    }

    function renderResult(q, userAnswer, correct, responseTime, errorType) {
      var el = container.querySelector('#mjt-result');
      var html = '<div class="result-panel ' + (correct ? 'result-correct' : 'result-wrong') + '">';
      html += '<div class="result-head"><strong>' + (correct ? '✓ 正确' : '✗ 错误') + '</strong>' +
        '<span class="rt-badge">反应时间 <b>' + fmtSec(responseTime) + '</b></span>' +
        (errorType ? '<span class="badge badge-error">' + esc(errorType) + '</span>' : '') + '</div>';
      if (!correct) {
        html += '<p>你的答案：<span class="wrong-text">' + esc(userAnswer) + '</span>　正确答案：<span class="correct-text jp-text">' + esc(q.answer) + '</span></p>';
      }
      // 听力：作答后才显示原文
      if (q.audioScript) {
        html += '<div class="script-block"><p class="script-label">原文</p>' +
          '<p class="jp-large">' + esc(q.scriptJa || q.displayJa || q.audioScript) + '</p>' +
          (settings.showKana ? '<p class="kana-line">' + esc(q.scriptKana || q.kana || q.audioScript) + '</p>' : '') +
          '</div>';
        html += '<button class="btn btn-small" data-shadow="1">🎙 影子跟读（再听一遍，跟着读）</button>';
      }
      if (settings.showZh && q.translation) {
        html += '<p class="zh-line">中文：' + esc(q.translation).replace(/\n/g, '<br>') + '</p>';
      }
      html += '<div class="explanation"><p class="script-label">解析</p><p>' + esc(q.explanation).replace(/\n/g, '<br>') + '</p>';
      if (q.wrongAnswerReasons) {
        Object.keys(q.wrongAnswerReasons).forEach(function (k) {
          if (String(k) === String(userAnswer) || !correct) {
            html += '<p class="wrong-reason">「' + esc(k) + '」：' + esc(q.wrongAnswerReasons[k]) + '</p>';
          }
        });
      }
      if (q.knowledgeMap && q.knowledgeMap.length) {
        html += '<p class="km-line">知识图谱：' + q.knowledgeMap.map(function (km) {
          return '<span class="badge badge-km">' + esc(km.module) + ' › ' + esc(km.node) + '</span>';
        }).join(' ') + '</p>';
      } else if (q.knowledgeMapStatus === 'pending') {
        html += '<p class="km-line dim">知识图谱对应：pending（图谱中暂无对应节点，不做猜测性关联）</p>';
      }
      html += '</div>';
      html += '<button class="btn btn-primary btn-next" data-action="next">下一题（Enter）→</button>';
      html += '</div>';
      el.innerHTML = html;
      el.querySelector('[data-action="next"]').addEventListener('click', next);
      var shadowBtn = el.querySelector('[data-shadow]');
      if (shadowBtn) shadowBtn.addEventListener('click', function () { playAudio(0.85); });
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function finish() {
      cleanup();
      var summary = MJT.stats.summarize(state.records);
      var streaks = MJT.stats.streaks(state.records);
      var plan = MJT.adaptive.nextDifficulty(cfg.difficulty || 1, summary, streaks);
      var html = '<div class="panel summary-panel"><h3>本组完成</h3>';
      html += '<div class="stat-grid">' +
        '<div class="stat"><div class="stat-value">' + summary.total + '</div><div class="stat-label">题数</div></div>' +
        '<div class="stat"><div class="stat-value">' + (summary.accuracy !== null ? Math.round(summary.accuracy * 100) + '%' : '—') + '</div><div class="stat-label">正确率</div></div>' +
        '<div class="stat"><div class="stat-value">' + (summary.avgResponseMs !== null ? fmtSec(summary.avgResponseMs) : '—') + '</div><div class="stat-label">平均反应</div></div>' +
        '<div class="stat"><div class="stat-value">' + (summary.fastest ? fmtSec(summary.fastest.responseTime) : '—') + '</div><div class="stat-label">最快</div></div>' +
        '<div class="stat"><div class="stat-value">' + (summary.slowest ? fmtSec(summary.slowest.responseTime) : '—') + '</div><div class="stat-label">最慢</div></div>' +
        '</div>';
      html += '<div class="plan-block"><p class="script-label">下一组自适应建议</p><ul>' +
        plan.reasons.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') +
        '</ul></div>';
      var review = MJT.adaptive.lessonReviewSuggestions();
      if (review.length) {
        html += '<p class="dim">错误集中的课程：' + review.slice(0, 3).map(function (x) { return '第' + x.lesson + '课（' + x.errors + '次）'; }).join('、') + ' —— 建议回到对应课程复习。</p>';
      }
      html += '<div class="btn-row">' +
        '<button class="btn btn-primary" data-action="again">按建议再来一组 →</button>' +
        '<button class="btn" data-action="home">返回首页</button></div></div>';
      container.innerHTML = html;
      container.querySelector('[data-action="again"]').addEventListener('click', function () {
        cfg.difficulty = plan.difficulty;
        if (cfg.onRestart) cfg.onRestart(plan);
        else start(container, cfg);
      });
      container.querySelector('[data-action="home"]').addEventListener('click', function () { MJT.app.navigate('home'); });
      if (cfg.onFinish) cfg.onFinish(state.records, plan);
      // 训练历史
      var hist = MJT.storage.load(MJT.storage.KEYS.trainingHistory, []);
      hist.push({
        at: new Date().toISOString(), module: cfg.module, category: cfg.categoryId || null,
        count: summary.total, accuracy: summary.accuracy, avgResponseMs: summary.avgResponseMs,
        difficulty: cfg.difficulty || 1
      });
      if (hist.length > 500) hist = hist.slice(hist.length - 500);
      MJT.storage.save(MJT.storage.KEYS.trainingHistory, hist);
    }

    // 键盘快捷键：1-9选项、Enter下一题、R重播
    state.keyHandler = function (e) {
      if (!container.isConnected) { cleanup(); return; }
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === 'Enter' && state.answered) { e.preventDefault(); next(); }
      else if ((e.key === 'r' || e.key === 'R') && state.current && state.current.audioScript) playAudio(1);
      else if (/^[1-9]$/.test(e.key) && !state.answered) {
        var btns = container.querySelectorAll('[data-option]');
        var i = parseInt(e.key, 10) - 1;
        if (btns[i]) btns[i].click();
      }
    };
    document.addEventListener('keydown', state.keyHandler);

    next();
  }

  return { start: start, esc: esc, fmtSec: fmtSec };
})();
