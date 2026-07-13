/* 语音合成（浏览器 TTS）
 *
 * 诚实性说明：这里使用的是浏览器内置的语音合成（speechSynthesis），
 * 不是日本母语者真人录音，音质与自然度取决于用户设备上安装的日语语音。
 * 每条听力数据保留 audioUrl 字段作为后续接入真实音频文件的接口：
 * audioUrl 非空时优先播放该音频文件，否则退回 TTS。 */
window.MJT = window.MJT || {};

MJT.speech = (function () {
  var jaVoice = null;
  var available = typeof window !== 'undefined' && 'speechSynthesis' in window;
  var currentAudio = null;

  function findJaVoice() {
    if (!available) return null;
    var voices = window.speechSynthesis.getVoices() || [];
    var ja = voices.filter(function (v) { return (v.lang || '').toLowerCase().indexOf('ja') === 0; });
    // 优先本地日语语音
    var local = ja.filter(function (v) { return v.localService; });
    return local[0] || ja[0] || null;
  }

  if (available) {
    jaVoice = findJaVoice();
    window.speechSynthesis.onvoiceschanged = function () { jaVoice = findJaVoice(); };
  }

  function stop() {
    if (available) window.speechSynthesis.cancel();
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  }

  /* speak(text, {rate, volume, audioUrl, onend}) */
  function speak(text, opts) {
    opts = opts || {};
    stop();
    // 真实音频接口：优先播放音频文件
    if (opts.audioUrl) {
      currentAudio = new Audio(opts.audioUrl);
      currentAudio.playbackRate = opts.rate || 1;
      currentAudio.volume = opts.volume !== undefined ? opts.volume : 1;
      if (opts.onend) currentAudio.onended = opts.onend;
      currentAudio.play().catch(function () {
        currentAudio = null;
        speakTTS(text, opts); // 音频失败退回 TTS
      });
      return true;
    }
    return speakTTS(text, opts);
  }

  function speakTTS(text, opts) {
    if (!available) return false;
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    if (jaVoice) u.voice = jaVoice;
    u.rate = opts.rate || 1;
    u.volume = opts.volume !== undefined ? opts.volume : 1;
    if (opts.onend) u.onend = opts.onend;
    window.speechSynthesis.speak(u);
    return true;
  }

  function pause() { if (available) window.speechSynthesis.pause(); if (currentAudio) currentAudio.pause(); }
  function resume() { if (available) window.speechSynthesis.resume(); if (currentAudio) currentAudio.play(); }

  function hasJaVoice() { return !!(jaVoice || findJaVoice()); }

  return {
    available: available,
    speak: speak,
    stop: stop,
    pause: pause,
    resume: resume,
    hasJaVoice: hasJaVoice
  };
})();
