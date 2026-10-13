/* (c) 2026 NoNameUser00. All rights reserved. See LICENSE. */
/* sfx.js — звук боя. Синтезируется прямо в браузере через Web Audio:
   ни файлов, ни лицензий, ничего не качается — работает офлайн и на телефоне.

   Почему не готовые файлы: у PyTactics нет сборки, всё статикой, и каждый
   лишний мегабайт аудио — это лишняя загрузка для школьного Wi-Fi и лицензия,
   которую надо помнить. Короткие сигналы (тук, звон, удар) oscillator и шум
   рисуют лучше, чем тянут за собой петли в формате.

   Вызовы: Sfx.move() Sfx.collect() Sfx.hit() Sfx.attack() Sfx.error()
          Sfx.win() Sfx.lose() Sfx.hint() Sfx.level()
   Выключатель: Sfx.toggle() — состояние хранится в localStorage. */
window.Sfx = (function () {
  "use strict";

  var KEY = "pytactics_sound";
  var ctx = null, master = null;
  var muted = false, unlocked = false;   // звук включается только после действия ученика
  try { muted = localStorage.getItem(KEY) === "off"; } catch (e) {}

  /* Браузеры запрещают запускать звук до первого клика или нажатия клавиши.
     Поэтому контекст создаём только после такого действия — иначе в консоли
     сыплются предупреждения, а звук всё равно не слышен. */
  ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
    window.addEventListener(ev, function once() {
      unlocked = true;
      window.removeEventListener(ev, once, true);
      ac();
    }, true);
  });

  /* Контекст создаём только после действия ученика: браузеры до первого
     клика не дают запускать звук, и контекст «в холоде» просто не стартует. */
  function ac() {
    if (muted || !unlocked) return null;
    try {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.22;      // негромко: в классе играют без наушников
        master.connect(ctx.destination);
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    } catch (e) { return null; }
  }

  /* один тон: частота, длительность, форма волны, громкость, задержка */
  function tone(freq, dur, type, vol, delay, slideTo) {
    var c = ac(); if (!c) return;
    var t0 = c.currentTime + (delay || 0);
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol == null ? 0.5 : vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }

  /* короткий шум — удары и шаги */
  function noise(dur, vol, cutoff, delay) {
    var c = ac(); if (!c) return;
    var t0 = c.currentTime + (delay || 0);
    var len = Math.max(1, Math.floor(c.sampleRate * dur));
    var buf = c.createBuffer(1, len, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = c.createBufferSource(); src.buffer = buf;
    var f = c.createBiquadFilter();
    f.type = "lowpass"; f.frequency.value = cutoff || 1200;
    var g = c.createGain(); g.gain.value = vol == null ? 0.4 : vol;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0);
  }

  return {
    isMuted: function () { return muted; },

    /* состояние звука — для проверки из консоли браузера и для учителя:
       "ждём действия" → "готово" → "playing" */
    state: function () {
      if (muted) return "выключен";
      if (!ctx) return unlocked ? "готов, но не запущен" : "ждём действия";
      return ctx.state;
    },

    toggle: function () {
      muted = !muted;
      try { localStorage.setItem(KEY, muted ? "off" : "on"); } catch (e) {}
      if (!muted) { unlocked = true; this.level(); }   // короткий отклик, что звук включился
      return muted;
    },

    /* ход робота: короткий «тук» */
    move: function () { tone(180, 0.06, "sine", 0.35); noise(0.04, 0.10, 900); },
    /* упёрся в стену: глухой стук */
    bump: function () { tone(110, 0.09, "triangle", 0.3); },
    /* кристалл собран: две ноты вверх */
    collect: function () {
      tone(880, 0.09, "triangle", 0.45);
      tone(1320, 0.12, "triangle", 0.4, 0.07);
    },
    /* ячейка энергии */
    cell: function () { tone(520, 0.10, "sine", 0.4); tone(780, 0.12, "sine", 0.3, 0.06); },
    /* удар робота по вирусу */
    attack: function () {
      noise(0.10, 0.45, 2200);
      tone(300, 0.09, "square", 0.22, 0, 140);
    },
    /* вирус ударил робота */
    hurt: function () {
      noise(0.13, 0.5, 700);
      tone(220, 0.18, "sawtooth", 0.28, 0, 90);
    },
    /* ошибка в коде */
    error: function () { tone(150, 0.16, "square", 0.3, 0, 90); },
    /* подсказка открылась */
    hint: function () { tone(660, 0.10, "sine", 0.3); tone(990, 0.14, "sine", 0.22, 0.08); },
    /* старт уровня */
    level: function () {
      tone(440, 0.10, "sine", 0.3);
      tone(660, 0.12, "sine", 0.26, 0.09);
    },
    /* победа: восходящее арпеджио */
    win: function () {
      var notes = [523, 659, 784, 1047];
      for (var i = 0; i < notes.length; i++) tone(notes[i], 0.22, "triangle", 0.4, i * 0.10);
    },
    /* поражение: две ноты вниз */
    lose: function () {
      tone(330, 0.18, "sawtooth", 0.28);
      tone(220, 0.28, "sawtooth", 0.24, 0.16);
    }
  };
})();