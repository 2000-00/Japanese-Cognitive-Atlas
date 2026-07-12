/* 阅读训练模块：把每篇文章的多个小题展开为会话题目序列，
 * 附带正文（passage），作答后显示翻译、逐句分析、定位与推理说明。 */
window.MJT = window.MJT || {};

MJT.reading = (function () {

  function pool(settings) {
    var reviewDecisions = MJT.storage.load(MJT.storage.KEYS.reviewDecisions, {});
    return MJT.scope.filter(MJT_DATA.pendingReading || [], {
      maxLesson: settings.maxLesson,
      mode: 'textbook',
      reviewDecisions: reviewDecisions
    }).allowed;
  }

  /* 一篇文章 → 展开为逐题的 session 题目 */
  function flatten(passage) {
    return (passage.questions || []).map(function (sub, i) {
      return {
        id: passage.id + '-q' + (i + 1),
        module: 'reading',
        type: 'reading',
        format: 'choice',
        passageTitle: passage.title,
        passageJa: passage.textJa,
        passageKana: passage.textKana,
        passageTranslation: passage.translation,
        question: sub.q,
        options: sub.options,
        answer: sub.answer,
        translation: passage.translation,
        explanation: sub.locate + '\n' + sub.reasoning +
          (i === (passage.questions.length - 1) && passage.sentenceAnalysis
            ? '\n\n【逐句分析】\n' + passage.sentenceAnalysis.join('\n')
            : ''),
        lesson: passage.lesson,
        lessonAttribution: passage.lessonAttribution,
        grammarPoints: passage.keyGrammar || [],
        keyVocab: passage.keyVocab || [],
        origin: passage.origin,
        sourceStatus: passage.sourceStatus,
        sourceType: passage.sourceType,
        sourceReference: passage.sourceReference,
        knowledgeMap: passage.knowledgeMap || [],
        knowledgeMapStatus: passage.knowledgeMapStatus,
        difficulty: passage.difficulty
      };
    });
  }

  function startSession(container, opts) {
    var settings = MJT.app.getSettings();
    var passages = MJT.random.shuffle(pool(settings));
    var queue = [];
    passages.forEach(function (p) { queue = queue.concat(flatten(p)); });
    MJT.session.start(container, {
      module: 'reading',
      difficulty: (opts && opts.difficulty) || 1,
      count: Math.min(settings.questionCount, queue.length) || settings.questionCount,
      getNext: function (i) { return queue[i] || null; }
    });
  }

  return { pool: pool, flatten: flatten, startSession: startSession };
})();
