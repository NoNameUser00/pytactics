/* (c) 2026 NoNameUser00. All rights reserved. See LICENSE. */
/* ui.js — редактор, карта, анимация боя, подсказки, звёзды, прогресс. */
(function () {
  "use strict";
  var levelIdx = 0, animTimer = null, animPos = 0, lastTrace = null;
  var hintStep = 0, usedSolution = false;
  var spec = null, specSeed = 0;   // текущая арена уровня (карта может быть случайной)

  var $ = function (id) { return document.getElementById(id); };

  /* --- редактор кода ---
     Основной путь — CodeMirror 5: подсветка синтаксиса, номера строк, парные
     скобки, автозакрытие скобок. Лежит локально в vendor/, поэтому работает
     офлайн. Если библиотека не загрузилась, остаётся обычный textarea —
     игра в этом случае работает как раньше. */
  var cm = null;
  function getCode() { return cm ? cm.getValue() : $("editor").value; }
  function setCode(v) { if (cm) cm.setValue(v); else $("editor").value = v; }
  function focusEditor() { if (cm) cm.focus(); else $("editor").focus(); }

  function initEditor() {
    var ta = $("editor"), box = $("editorBox");
    if (!window.CodeMirror || !box) return false;
    try {
      cm = window.CodeMirror(box, {
        value: ta.value,
        mode: "python",
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        smartIndent: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        viewportMargin: 10,
        extraKeys: { "Ctrl-Space": "autocomplete" }
      });
    } catch (e) { cm = null; return false; }
    ta.style.display = "none";           // запасной textarea прячем, но не удаляем
    cm.on("change", function () { saveCode(); });
    cm.on("focus", function () { cm.focus(); });
    return true;
  }

  // Новая арена: случайная карта каждый заход (антихардкод) + пересчёт лимитов.
  function rollMap(l, keepSeed) {
    if (!window.MapGen) { spec = null; return; }
    if (!keepSeed) specSeed = (specSeed + 1 + Math.floor(Math.random() * 7));
    window.LevelRules.apply(l);
    spec = window.MapGen.build(l, specSeed);
  }
  function curSpec() { return spec || { rows: cur().map, energy: cur().energy, maxTurns: cur().maxTurns, starTurns: cur().starTurns, kind: "fixed" }; }

  function stars() {
    try {
      if (window.Backend) return window.Backend.stars();
      return JSON.parse(localStorage.getItem("pytactics_stars") || "{}");
    }
    catch (e) { return {}; }
  }
  function codeKey(id) { return "pytactics_code_" + id; }

  window.addEventListener("DOMContentLoaded", init);

  function init() {
    try { document.documentElement.setAttribute("data-theme", localStorage.getItem("pytactics_theme") || "abyss"); } catch (e) {}
    $("btnRun").onclick = onRun;
    $("btnStep").onclick = onStep;
    $("btnReset").onclick = onReset;
    var rb = $("btnRemap");
    if (rb) rb.onclick = onRemap;
    $("btnHint").onclick = onHint;
    $("btnSolution").onclick = onSolution;
    var sb = $("btnSound");
    if (sb) {
      var paint = function () { sb.textContent = (window.Sfx && window.Sfx.isMuted()) ? "🔇" : "🔊";
        sb.title = (window.Sfx && window.Sfx.isMuted()) ? "Звук выключен" : "Звук боя"; };
      sb.onclick = function () { if (window.Sfx) window.Sfx.toggle(); paint(); };
      paint();
    }
    $("btnNext").onclick = function () {
      if (levelIdx >= window.LEVELS.length - 1) return;
      var nl = window.LEVELS[levelIdx + 1];
      if (!isOpenLevel(nl.id)) { setStatus("🔒 Дальше — закрытая планета. Пройди текущую хоть на 1 ★.", "err"); return; }
      loadLevel(levelIdx + 1);
    };
    $("btnPrev").onclick = function () { if (levelIdx > 0) loadLevel(levelIdx - 1); };
    $("btnClearSave").onclick = function () {
      localStorage.removeItem("pytactics_stars");
      window.LEVELS.forEach(function (l) { localStorage.removeItem(codeKey(l.id)); });
      loadLevel(levelIdx);
    };
    // уровень из вселенной: game.html?level=5
    var start = 0;
    var m = location.search.match(/[?&]level=(\d+)/);
    if (m) {
      var n = parseInt(m[1], 10);
      if (n >= 1 && n <= window.LEVELS.length) start = n - 1;
    }
    var go = function () {
      loadLevel(start);
      var cs = $("cloudState");
      if (cs) {
        var B = window.Backend;
        cs.textContent = (B && B.currentUser()) ? "☁️ " + B.currentUser().email : "💾 локально";
      }
    };
    if (window.Backend && window.Backend.init) window.Backend.init().then(go, go);
    else go();
    if (initEditor()) focusEditor();
    if (window.CmdRef) window.CmdRef.build();   // справка по командам — один раз на страницу
    $("editor").addEventListener("input", function () {
      saveCode();
    });
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") onRun();
      // Tab в редакторе — 4 пробела (в CodeMirror отступ и так ставит сам)
      if (e.key === "Tab" && !cm && document.activeElement === $("editor")) {
        e.preventDefault();
        var el = $("editor"), s = el.selectionStart;
        el.value = el.value.slice(0, s) + "    " + el.value.slice(el.selectionEnd);
        el.selectionStart = el.selectionEnd = s + 4;
      }
    });
  }

  /* сохранение кода уровня + счётчик строк — вызывается и из textarea, и из CodeMirror */
  function saveCode() {
    localStorage.setItem(codeKey(cur().id), getCode());
    updateStats();
  }

  function cur() { return window.LEVELS[levelIdx]; }

  function isOpenLevel(id) {
    if (id === 1) return true;
    return (stars()[id - 1] || 0) > 0;
  }

  function buildLevelTabs() {
    var bar = $("levelTabs"); bar.innerHTML = "";
    var st = stars();
    window.LEVELS.forEach(function (l, i) {
      var b = document.createElement("button");
      var open = isOpenLevel(l.id);
      b.className = "tab" + (st[l.id] ? " done" : "") + (open ? "" : " locked");
      b.innerHTML = (open ? l.id + ". " + l.title : "🔒 " + l.id) + (st[l.id] ? " " + "★".repeat(st[l.id]) : "");
      b.title = open ? l.topic : "Сначала пройди планету " + (l.id - 1);
      b.onclick = function () {
        if (!isOpenLevel(l.id)) { setStatus("🔒 Планета закрыта. Сначала пройди планету " + (l.id - 1) + ".", "err"); return; }
        loadLevel(i);
      };
      bar.appendChild(b);
    });
  }

  function loadLevel(i) {
    levelIdx = i; hintStep = 0; usedSolution = false; lastTrace = null; specSeed = 0;
    stopAnim();
    var l = cur();
    window.LevelRules.apply(l);
    rollMap(l, false);
    var sp = curSpec();
    $("lvlTitle").textContent = "Уровень " + l.id + ": " + l.title;
    $("lvlTopic").textContent = (l.book ? "§" + l.book + " · " : "") + l.topic;
    var pl = $("place");
    if (pl) pl.textContent = l.place ? "📍 " + l.place : "";
    $("brief").textContent = l.briefing;
    $("goal").textContent = "🎯 " + l.goal + "  ·  ⚡ энергии: " + sp.energy + "  ·  макс. ходов: " + sp.maxTurns;
    if ($("needLine")) $("needLine").innerHTML = l.needText ? "<b>Требование темы:</b> " + esc(l.needText) : "";
    var lo = $("lore");
    if (lo) lo.textContent = l.lore ? "«" + l.lore + "»" : "";
    mentorSay("greet");
    if (window.CmdRef) window.CmdRef.render(l.id);
    $("hintBox").innerHTML = "<i>Нажми 💡 Подсказка — открою намёк, потом псевдокод. Кнопка «Решение» даёт готовый код, но срезает звёзды до 1.</i>";
    $("console").innerHTML = "";
    var saved = localStorage.getItem(codeKey(l.id));
    setCode(saved !== null ? saved : l.starter);
    if (window.Sfx) window.Sfx.level();
    $("btnNext").disabled = (i >= window.LEVELS.length - 1);
    buildLevelTabs();
    renderStatic();
    updateStats();
    setStatus("Напиши код и нажми ▶ Запустить (или Ctrl+Enter).", "");
    // подсветка активного таба
    var tabs = $("levelTabs").children;
    for (var k = 0; k < tabs.length; k++) tabs[k].classList.toggle("active", k === i);
  }

  function updateStats() {
    var lines = getCode().split("\n").filter(function (s) { return s.trim() !== "" && s.trim()[0] !== "#"; }).length;
    $("statLines").textContent = "строк кода: " + lines;
  }

  function setStatus(msg, cls) {
    var el = $("status"); el.textContent = msg; el.className = "status " + (cls || "");
  }

  function logConsole(html, cls) {
    var c = $("console");
    var div = document.createElement("div");
    div.className = "cline " + (cls || "");
    div.innerHTML = html;
    c.appendChild(div);
    c.scrollTop = c.scrollHeight;
  }

  // ---------- карта ----------
  // Иконка сущности: SVG-арт, fallback — эмодзи
  function entIcon(ch, heroId, heroEmoji, vx) {
    var EMOJI = { "#": "⬛", "P": heroEmoji, "E": "👾", "R": "👺", "D": "💀", "B": "👹", "H": "🔋", "C": "💎", "X": "🌀" };
    if (window.sprite) {
      var id = ch === "P" ? "hero_" + heroId
        : ch === "X" ? "tile_portal" : ch === "C" ? "tile_crystal" : ch === "H" ? "tile_cell"
        : ch === "#" ? "tile_rock" + ((vx || 0) % 3)
        : (ch === "E" || ch === "R" || ch === "D" || ch === "B") ? "foe_" + ch : null;
      if (id) {
        var s = window.sprite(id);
        if (s) return s;
      }
      if (ch === "#") return "⬛";
      return "";
    }
    return EMOJI[ch] || "";
  }

  function cellChar(l, x, y, snap) {
    var row = curSpec().rows[y];
    var base = row[x];
    if (snap) {
      if (snap.px === x && snap.py === y) return "P";
      var foe = null;
      snap.enemies.forEach(function (e) { if (e.alive && e.x === x && e.y === y) foe = e; });
      if (foe) return foe.rank || (foe.boss ? "B" : "E");
      if (snap.crystals.some(function (c) { return c.x === x && c.y === y; })) return "C";
      if (snap.pickups && snap.pickups.some(function (p) { return p.x === x && p.y === y; })) return "H";
      if (base === "E" || base === "B" || base === "R" || base === "D" || base === "C" || base === "H" || base === "P") base = ".";
    }
    if (base === "B" || base === "R" || base === "D" || base === "H") return base;
    return base;
  }

  function renderBoard(l, snap) {
    var board = $("board"); board.innerHTML = "";
    var sp = curSpec();
    board.className = l.biome ? "biome-" + l.biome : "";
    var rbE = "🤖", rbN = "", rbId = "bolt";
    if (window.currentRobot) { var rb = window.currentRobot(); rbE = rb.emoji; rbN = rb.name; rbId = rb.id; }
    var par = window.Game.parseMap(sp.rows);
    board.style.gridTemplateColumns = "repeat(" + par.w + ", 1fr)";
    for (var y = 0; y < par.h; y++) {
      for (var x = 0; x < par.w; x++) {
        var ch = cellChar(l, x, y, snap);
        var d = document.createElement("div");
        d.className = "cell t" + ch;
        d.innerHTML = entIcon(ch, rbId, rbE, x + y);
        if (snap && snap.px === x && snap.py === y) d.classList.add("hero");
        board.appendChild(d);
      }
    }
    var s = snap || { energy: sp.energy, turns: 0, collected: 0, total: par.crystals.length };
    var rbIcon = (window.sprite && window.sprite("hero_" + rbId)) || rbE;
    var rbHtml = rbIcon.indexOf("<svg") === 0 ? '<span class="hudhero">' + rbIcon + "</span>" : rbIcon;
    $("hud").innerHTML = rbHtml + " " + rbN + " &nbsp;·&nbsp; ⚡ " + s.energy + " &nbsp;·&nbsp; 🚶 ходов: " + s.turns + "/" + sp.maxTurns + " &nbsp;·&nbsp; 💎 " + s.collected + "/" + s.total;
  }

  function renderStatic() { renderBoard(cur(), null); }

  // ---------- запуск ----------
  function onRun() { runCode(false); }
  function onStep() { runCode(true); }

  async function runCode(stepMode) {
    stopAnim();
    $("console").innerHTML = "";
    var l = cur(), code = getCode();
    if (!code.trim()) { setStatus("Пустой код — напиши хотя бы одну команду.", "err"); return; }
    localStorage.setItem(codeKey(l.id), code);

    // --- правила уровня: тема + антихардкод (до запуска боя) ---
    var chk = window.LevelRules.check(l, code);
    if (!chk.ok) {
      setStatus("⛔ " + chk.reason, "err");
      logConsole("⛔ " + esc(chk.reason), "err");
      logConsole("💡 " + esc(chk.tip), "");
      mentorSay("fails");
      renderStatic();
      return;
    }

    // Первый запуск ждёт загрузки Python (около 13 МБ) — честно говорим об этом
    if (window.PyRunner && !window.PyRunner.__warming) {
      setStatus("⏳ Загружается настоящий Python (один раз, ~13 МБ)…", "");
      window.PyRunner.warmup();
    } else setStatus("Симуляция боя...", "");

    var trace;
    try {
      trace = await window.Game.simulate(l, code, curSpec());
    } catch (e) {
      setStatus("Внутренняя ошибка: " + (e && e.message), "err");
      return;
    }
    lastTrace = trace;
    trace.logs.forEach(function (t) { logConsole("› " + esc(t)); });
    if (stepMode) { startAnim(trace, 700); setStatus("Пошаговый режим: смотри каждый ход. Жми ▶ для быстрой прокрутки.", ""); }
    else { startAnim(trace, 260); }
  }

  function startAnim(trace, speed) {
    stopAnim();
    var l = cur();
    animPos = 0;
    var evs = trace.events;
    renderBoard(l, evs[0].snap);
    animTimer = setInterval(function () {
      animPos++;
      if (animPos >= evs.length) { stopAnim(); finishTrace(trace); return; }
      var ev = evs[animPos];
      renderBoard(l, ev.snap);
      narrate(ev);
    }, speed);
  }

  function stopAnim() { if (animTimer) clearInterval(animTimer); animTimer = null; }

  function narrate(ev) {
    var icons = { move: "🚶", bump: "🧱", collect: "💎", cell: "🔋", nocollect: "🤔", attack_hit: "⚔️", attack_miss: "💨", hurt: "💥", wait: "⏳", log: "💬", win: "🏆", lose: "💀", error: "⛔", start: "" };
    if (window.Sfx) soundFor(ev.type);
    if (ev.message) logConsole((icons[ev.type] || "·") + " " + esc(ev.message), ev.type);
    else if (ev.type === "move") logConsole("🚶 ход " + ev.snap.turns, "");
  }

  /* звук события боя; за шаг и ожидание не звучим — иначе на длинном коде
     превращается в треск, а ученик всё равно смотрит на поле */
  function soundFor(type) {
    var S = window.Sfx;
    if (!S) return;
    switch (type) {
      case "collect": S.collect(); break;
      case "cell": S.cell(); break;
      case "bump": S.bump(); break;
      case "attack_hit": S.attack(); break;
      case "hurt": S.hurt(); break;
      case "error": S.error(); break;
      case "move": if (animStep++ % 2 === 0) S.move(); break;   // через ход, иначе трещит
    }
  }
  var animStep = 0;

  function finishTrace(trace) {
    var l = cur();
    if (window.Sfx) { if (trace.win) window.Sfx.win(); else window.Sfx.lose(); }
    if (trace.win) {
      var lines = getCode().split("\n").filter(function (s) { return s.trim() !== "" && s.trim()[0] !== "#"; }).length;
      var nstars = window.MapGen ? window.MapGen.starFor(l, curSpec(), trace.turns) : 3;
      if (usedSolution) nstars = 1;
      else if (lines > 14) nstars = Math.min(nstars, 2);
      var st = stars();
      var better = Math.max(st[l.id] || 0, nstars);
      if (window.Backend && window.Backend.saveStars) {
        window.Backend.saveStars(l.id, better, trace.turns).then(function () { buildLevelTabs(); });
        st[l.id] = better; // кэш уже обновлён синхронно внутри saveStars
      }
      buildLevelTabs();
      setStatus("🏆 Победа за " + trace.turns + " ходов! Награда: " + "★".repeat(nstars) + (usedSolution ? " (было использовано решение)" : ""), "win");
      logConsole("🏆 Уровень пройден! " + "★".repeat(nstars), "win");
      // Второй слой обучения — тот же, что и в хороших играх про программирование:
      // задача выполнена, но можно короче. Показываем оптимум, чтобы ученик
      // сравнивал не только «выиграл/проиграл», а «насколько умно».
      var par = window.MapGen && curSpec().starTurns ? curSpec().starTurns : (l.starTurns || 0);
      if (par && trace.turns > 0) {
        if (trace.turns <= par) logConsole("⚡ Оптимально: " + trace.turns + " ходов — столько и нужно.", "win");
        else logConsole("⚡ Оптимально: " + par + " ходов, у тебя " + trace.turns +
          ". Задача та же — можно короче.", "");
      }
      if (window.currentRobot) {
        var rbw = window.currentRobot();
        logConsole(rbw.emoji + " <b>" + rbw.name + ":</b> «" + rbw.win + "»", "win");
      }
      mentorSay("wins");
      if (levelIdx < window.LEVELS.length - 1) setStatus($("status").textContent + " Жми «Далее →».", "win");
      if (l.id === 76) {
        setStatus("👑 ВЛАДЫКА БАГ ПОВЕРЖЕН! Маяки горят, ядра дома. Ты — Хранитель Грида. Да пребудет с тобой Код!", "win");
        logConsole("👑 <b>ХРОНИКИ ГРИДА ЗАВЕРШЕНЫ.</b> 76 планет · Орден гордится тобой.", "win");
      }
    } else {
      setStatus("⛔ Не вышло: " + (trace.error || "попробуй ещё") + " Подсказка — кнопка 💡.", "err");
      if (trace.error) logConsole("⛔ " + esc(trace.error), "err");
      mentorSay("fails");
    }
  }

  function onReset() {
    stopAnim();
    $("console").innerHTML = "";
    renderStatic();
    setStatus("Поле сброшено. Код на месте — жми ▶.", "");
  }

  // Новая карта: ученик специально проверяет, работает ли его алгоритм
  // на другом коридоре. Тема не меняется — меняется только арена.
  function onRemap() {
    var l = cur();
    if (!l.gen) { setStatus("У этой планеты карта неизменна — она часть учебной задачи.", ""); return; }
    rollMap(l, false);
    var sp = curSpec();
    $("goal").textContent = "🎯 " + l.goal + "  ·  ⚡ энергии: " + sp.energy + "  ·  макс. ходов: " + sp.maxTurns;
    stopAnim();
    $("console").innerHTML = "";
    renderStatic();
    setStatus("🔁 Новая арена: коридор другой длины, вирусы и кристаллы — на других местах. Твой код должен справиться и с ней.", "");
    logConsole("🔁 Карта обновлена. Если решение опиралось на «повтори N раз» — теперь оно сломается. Так и должно быть.", "");
  }

  // ---------- подсказки ----------
  function mentorSay(kind) {
    if (!window.MENTOR) return;
    var box = $("mentorText");
    if (box) box.textContent = window.MENTOR.pick(window.MENTOR[kind] || window.MENTOR.greetings);
    var face = $("mentorFace");
    if (face && window.sprite) {
      var g = window.sprite("mentor_ghost");
      if (g) face.innerHTML = g;
    }
  }

  function onHint() {
    var l = cur();
    if (window.Sfx) window.Sfx.hint();
    mentorSay("hintIntros");
    if (hintStep < 2) {
      var box = $("hintBox");
      box.innerHTML = "<b>💡 Подсказка " + (hintStep + 1) + "/2:</b><br>" + esc(l.hints[hintStep]).replace(/\n/g, "<br>");
      hintStep++;
      if (hintStep === 2) setStatus("Открыты обе подсказки. Дальше — только готовое решение (срежет звёзды).", "");
    } else setStatus("Подсказки кончились. Кнопка «Показать решение» — последний шанс (1 звезда).", "err");
  }

  function onSolution() {
    var l = cur();
    if (!confirm("Показать готовое решение? Награда за уровень упадёт до 1 звезды.")) return;
    usedSolution = true;
    setCode(l.solution);
    localStorage.setItem(codeKey(l.id), l.solution);
    $("hintBox").innerHTML = "<b>🔑 Решение:</b><pre>" + esc(l.solution) + "</pre>Нажми ▶ Запустить и разбери, как оно работает.";
    updateStats();
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
})();
