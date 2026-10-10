/* ui.js — редактор, карта, анимация боя, подсказки, звёзды, прогресс. */
(function () {
  "use strict";
  var levelIdx = 0, animTimer = null, animPos = 0, lastTrace = null;
  var hintStep = 0, usedSolution = false;

  var $ = function (id) { return document.getElementById(id); };

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
    $("btnHint").onclick = onHint;
    $("btnSolution").onclick = onSolution;
    $("btnNext").onclick = function () { if (levelIdx < window.LEVELS.length - 1) loadLevel(levelIdx + 1); };
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
    $("editor").addEventListener("input", function () {
      localStorage.setItem(codeKey(cur().id), $("editor").value);
      updateStats();
    });
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") onRun();
      // Tab в редакторе — 4 пробела
      if (e.key === "Tab" && document.activeElement === $("editor")) {
        e.preventDefault();
        var el = $("editor"), s = el.selectionStart;
        el.value = el.value.slice(0, s) + "    " + el.value.slice(el.selectionEnd);
        el.selectionStart = el.selectionEnd = s + 4;
      }
    });
  }

  function cur() { return window.LEVELS[levelIdx]; }

  function buildLevelTabs() {
    var bar = $("levelTabs"); bar.innerHTML = "";
    var st = stars();
    window.LEVELS.forEach(function (l, i) {
      var b = document.createElement("button");
      b.className = "tab" + (st[l.id] ? " done" : "");
      b.innerHTML = l.id + ". " + l.title + (st[l.id] ? " " + "★".repeat(st[l.id]) : "");
      b.title = l.topic;
      b.onclick = function () { loadLevel(i); };
      bar.appendChild(b);
    });
  }

  function loadLevel(i) {
    levelIdx = i; hintStep = 0; usedSolution = false; lastTrace = null;
    stopAnim();
    var l = cur();
    $("lvlTitle").textContent = "Уровень " + l.id + ": " + l.title;
    $("lvlTopic").textContent = l.topic;
    var pl = $("place");
    if (pl) pl.textContent = l.place ? "📍 " + l.place : "";
    $("brief").textContent = l.briefing;
    $("goal").textContent = "🎯 " + l.goal + "  ·  ⚡ энергии: " + l.energy + "  ·  макс. ходов: " + l.maxTurns;
    var lo = $("lore");
    if (lo) lo.textContent = l.lore ? "«" + l.lore + "»" : "";
    $("hintBox").innerHTML = "<i>Нажми 💡 Подсказка — открою намёк, потом псевдокод. Кнопка «Решение» даёт готовый код, но срезает звёзды до 1.</i>";
    $("console").innerHTML = "";
    var saved = localStorage.getItem(codeKey(l.id));
    $("editor").value = saved !== null ? saved : l.starter;
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
    var lines = $("editor").value.split("\n").filter(function (s) { return s.trim() !== "" && s.trim()[0] !== "#"; }).length;
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
  function entIcon(ch, heroId, heroEmoji) {
    var EMOJI = { "#": "⬛", "P": heroEmoji, "E": "👾", "R": "👺", "D": "💀", "B": "👹", "H": "🔋", "C": "💎", "X": "🌀" };
    if (window.sprite) {
      var id = ch === "P" ? "hero_" + heroId
        : ch === "X" ? "tile_portal" : ch === "C" ? "tile_crystal" : ch === "H" ? "tile_cell"
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
    var row = l.map[y];
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
    board.className = l.biome ? "biome-" + l.biome : "";
    var rbE = "🤖", rbN = "", rbId = "bolt";
    if (window.currentRobot) { var rb = window.currentRobot(); rbE = rb.emoji; rbN = rb.name; rbId = rb.id; }
    var par = window.Game.parseMap(l.map);
    board.style.gridTemplateColumns = "repeat(" + par.w + ", 1fr)";
    for (var y = 0; y < par.h; y++) {
      for (var x = 0; x < par.w; x++) {
        var ch = cellChar(l, x, y, snap);
        var d = document.createElement("div");
        d.className = "cell t" + ch;
        d.innerHTML = entIcon(ch, rbId, rbE);
        if (snap && snap.px === x && snap.py === y) d.classList.add("hero");
        board.appendChild(d);
      }
    }
    var s = snap || { energy: l.energy, turns: 0, collected: 0, total: par.crystals.length };
    var rbIcon = (window.sprite && window.sprite("hero_" + rbId)) || rbE;
    var rbHtml = rbIcon.indexOf("<svg") === 0 ? '<span class="hudhero">' + rbIcon + "</span>" : rbIcon;
    $("hud").innerHTML = rbHtml + " " + rbN + " &nbsp;·&nbsp; ⚡ " + s.energy + " &nbsp;·&nbsp; 🚶 ходов: " + s.turns + "/" + l.maxTurns + " &nbsp;·&nbsp; 💎 " + s.collected + "/" + s.total;
  }

  function renderStatic() { renderBoard(cur(), null); }

  // ---------- запуск ----------
  function onRun() { runCode(false); }
  function onStep() { runCode(true); }

  function runCode(stepMode) {
    stopAnim();
    $("console").innerHTML = "";
    var l = cur(), code = $("editor").value;
    if (!code.trim()) { setStatus("Пустой код — напиши хотя бы одну команду.", "err"); return; }
    localStorage.setItem(codeKey(l.id), code);
    setStatus("Симуляция боя...", "");
    var trace;
    try {
      trace = window.Game.simulate(l, code);
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
    if (ev.message) logConsole((icons[ev.type] || "·") + " " + esc(ev.message), ev.type);
    else if (ev.type === "move") logConsole("🚶 ход " + ev.snap.turns, "");
  }

  function finishTrace(trace) {
    var l = cur();
    if (trace.win) {
      var lines = $("editor").value.split("\n").filter(function (s) { return s.trim() !== "" && s.trim()[0] !== "#"; }).length;
      var nstars = 3;
      if (usedSolution) nstars = 1;
      else if (trace.turns > l.starTurns || lines > 14) nstars = 2;
      var st = stars();
      var better = Math.max(st[l.id] || 0, nstars);
      if (window.Backend && window.Backend.saveStars) {
        window.Backend.saveStars(l.id, better, trace.turns).then(function () { buildLevelTabs(); });
        st[l.id] = better; // кэш уже обновлён синхронно внутри saveStars
      }
      buildLevelTabs();
      setStatus("🏆 Победа за " + trace.turns + " ходов! Награда: " + "★".repeat(nstars) + (usedSolution ? " (было использовано решение)" : ""), "win");
      logConsole("🏆 Уровень пройден! " + "★".repeat(nstars), "win");
      if (window.currentRobot) {
        var rbw = window.currentRobot();
        logConsole(rbw.emoji + " <b>" + rbw.name + ":</b> «" + rbw.win + "»", "win");
      }
      if (levelIdx < window.LEVELS.length - 1) setStatus($("status").textContent + " Жми «Далее →».", "win");
    } else {
      setStatus("⛔ Не вышло: " + (trace.error || "попробуй ещё") + " Подсказка — кнопка 💡.", "err");
      if (trace.error) logConsole("⛔ " + esc(trace.error), "err");
    }
  }

  function onReset() {
    stopAnim();
    $("console").innerHTML = "";
    renderStatic();
    setStatus("Поле сброшено. Код на месте — жми ▶.", "");
  }

  // ---------- подсказки ----------
  function onHint() {
    var l = cur();
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
    $("editor").value = l.solution;
    localStorage.setItem(codeKey(l.id), l.solution);
    $("hintBox").innerHTML = "<b>🔑 Решение:</b><pre>" + esc(l.solution) + "</pre>Нажми ▶ Запустить и разбери, как оно работает.";
    updateStats();
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
})();
