/* pages.js — постраничная навигация:
   home (index.html: выбор пилота) → map (map.html: секторы) →
   galaxy (galaxy.html: планеты главы) → game (game.html: арена).
   Экран выбирается по document.body.dataset.page. */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ---------- главы ----------
  function galaxies() {
    return [
      { name: "Глава 1. Первые программы", desc: "§1.1–1.6: вывод, комментарии, структура — сектор «Рассвет»", levels: [1, 2, 3, 4], cls: "g1", icon: "🌅" },
      { name: "Глава 2. Переменные", desc: "§2.1–2.5: имена, типы, del — сектор «Хранилище»", levels: [5, 6, 7, 8, 9], cls: "g2", icon: "🌌" },
      { name: "Глава 3. Операторы", desc: "§3.1–3.5: математика, строки, калькулятор — сектор «Кузница»", levels: [10, 11, 12, 13, 14, 15], cls: "g3", icon: "☄️" },
      { name: "Глава 4. Циклы и условия", desc: "§4.1–4.5: if, for, while, break — сектор «Лабиринт»", levels: [16, 17, 18, 19, 20, 21], cls: "g4", icon: "🌑" },
      { name: "Глава 5. Математика", desc: "§5.1–5.7: числа, round, random, «Угадай число» — сектор «Обсерватория»", levels: [22, 23, 24, 25, 26, 27, 28], cls: "g5", icon: "🔭" },
      { name: "Глава 6. Строки", desc: "§6.1–6.11: кавычки, срезы, методы, шифр — сектор «Архив»", levels: [29, 30, 31, 32, 33, 34, 35, 36], cls: "g6", icon: "📜" },
      { name: "Глава 7. Шаблоны", desc: "§7.1–7.6: поиск, маски, замена — сектор «Картотека»", levels: [37, 38, 39, 40, 41, 42], cls: "g1", icon: "🔍" },
      { name: "Глава 8. Списки", desc: "§8.1–8.11: шеренги, обход, сортировка — сектор «Склад»", levels: [43, 44, 45, 46, 47, 48, 49, 50], cls: "g2", icon: "🗂️" },
      { name: "Глава 9. Кортежи", desc: "§9.1–9.10: капсулы, распаковка, неизменность — сектор «Капсула»", levels: [51, 52, 53, 54, 55, 56, 57, 58], cls: "g3", icon: "📦" },
      { name: "Глава 10. Словари", desc: "§10.1–10.5: карточки, множества — сектор «Картотека-2»", levels: [59, 60, 61, 62, 63, 64], cls: "g4", icon: "🧾" },
      { name: "Глава 11. Функции", desc: "§11.1–11.10: def, рекурсия, global — сектор «Мастерская»", levels: [65, 66, 67, 68, 69, 70, 71], cls: "g5", icon: "⚙️" },
      { name: "Глава 13. Исключения", desc: "§13.1–13.5: try, страховка — сектор «Реактор»", levels: [72, 73, 74, 75], cls: "g6", icon: "🚨" }
    ];
  }
  function PTYPE() {
    return { 1: "rock", 2: "gas", 3: "city", 4: "rock", 5: "rock", 6: "gas", 7: "city", 8: "ice", 9: "lava", 10: "rock", 11: "gas", 12: "lava", 13: "ice", 14: "city", 15: "rock", 16: "lava", 17: "gas", 18: "rock", 19: "ice", 20: "ring", 21: "ring", 22: "rock", 23: "ice", 24: "gas", 25: "city", 26: "lava", 27: "ice", 28: "ring", 29: "rock", 30: "gas", 31: "city", 32: "ice", 33: "lava", 34: "ring", 35: "gas", 36: "ring", 37: "rock", 38: "gas", 39: "city", 40: "ice", 41: "lava", 42: "ring", 43: "rock", 44: "gas", 45: "city", 46: "ice", 47: "lava", 48: "ring", 49: "gas", 50: "ring", 51: "rock", 52: "gas", 53: "city", 54: "ice", 55: "lava", 56: "ring", 57: "gas", 58: "ring", 59: "rock", 60: "gas", 61: "city", 62: "ice", 63: "lava", 64: "ring", 65: "rock", 66: "gas", 67: "city", 68: "ice", 69: "lava", 70: "ring", 71: "gas", 72: "rock", 73: "city", 74: "ice", 75: "ring" };
  }
  function levelById(id) {
    for (var i = 0; i < window.LEVELS.length; i++) if (window.LEVELS[i].id === id) return window.LEVELS[i];
    return null;
  }
  function isOpen(id, st) {
    if (id === 1) return true;
    return (st[id - 1] || 0) > 0;
  }
  function galaxyOpen(gi, gals, st) {
    if (gi === 0) return true;
    var prev = gals[gi - 1].levels;
    return (st[prev[prev.length - 1]] || 0) > 0;
  }

  // ---------- темы ----------
  var THEMES = [
    { id: "nebula", name: "Небула", c: ["#f778ba", "#58a6ff"] },
    { id: "abyss", name: "Бездна", c: ["#39c5cf", "#1f6feb"] },
    { id: "nova", name: "Нова", c: ["#ff7a3d", "#ffd60a"] },
    { id: "emerald", name: "Изумруд", c: ["#3fb950", "#39c5cf"] },
    { id: "royal", name: "Корона", c: ["#c084fc", "#f778ba"] }
  ];
  function savedTheme() {
    try { return localStorage.getItem("pytactics_theme") || "abyss"; }
    catch (e) { return "abyss"; }
  }
  function applyTheme(id, save) {
    document.documentElement.setAttribute("data-theme", id);
    refreshStar();
    if (save !== false) { try { localStorage.setItem("pytactics_theme", id); } catch (e) {} }
    var dots = document.querySelectorAll(".tdot");
    for (var i = 0; i < dots.length; i++) dots[i].classList.toggle("active", dots[i].getAttribute("data-t") === id);
  }
  function initTheme() {
    var box = $("themeDots");
    if (box) {
      THEMES.forEach(function (t) {
        var b = document.createElement("button");
        b.className = "tdot"; b.setAttribute("data-t", t.id); b.title = t.name;
        b.style.background = "linear-gradient(135deg," + t.c[0] + "," + t.c[1] + ")";
        b.onclick = function () { applyTheme(t.id); };
        box.appendChild(b);
      });
    }
    applyTheme(savedTheme(), false);
  }
  function refreshStar() {
    try {
      window.__starColor = getComputedStyle(document.documentElement).getPropertyValue("--star").trim() || "#cfe4ff";
    } catch (e) { window.__starColor = "#cfe4ff"; }
  }

  // ---------- backend + шапка входа ----------
  function boot(fn) {
    initTheme();
    starfield();
    if (window.Backend) window.Backend.init().then(function () { paintAuth(); fn(); }, function () { paintAuth(); fn(); });
    else { paintAuth(); fn(); }
  }
  function paintAuth() {
    var box = $("authArea");
    if (!box) return;
    var B = window.Backend;
    box.innerHTML = "";
    var u = B && B.currentUser();
    if (u) {
      var d = document.createElement("div");
      d.className = "userbox";
      d.innerHTML = "👩‍🚀 <b>" + esc(u.email || "пилот") + "</b><br>" + (B.isCloud() ? "☁️ облако" : "💾 локально");
      box.appendChild(d);
      var out = document.createElement("button");
      out.className = "authbtn"; out.textContent = "Выйти";
      out.onclick = function () { B.signOut().then(function () { location.reload(); }); };
      box.appendChild(out);
    } else {
      if (B && !B.configured()) {
        var g = document.createElement("div");
        g.className = "userbox"; g.textContent = "💾 гость";
        box.appendChild(g);
      }
      if ($("modal")) {
        var b = document.createElement("button");
        b.className = "authbtn"; b.textContent = "Войти / Регистрация";
        b.onclick = function () { $("modal").classList.remove("hidden"); $("merr").textContent = ""; };
        box.appendChild(b);
      } else {
        var a = document.createElement("a");
        a.className = "authbtn"; a.style.textDecoration = "none"; a.href = "index.html"; a.textContent = "Войти";
        box.appendChild(a);
      }
    }
  }
  function authFields() {
    return { email: $("memail").value.trim(), pass: $("mpass").value, nick: $("mnick").value.trim() };
  }
  function wireAuthModal() {
    if (!$("modal")) return;
    $("modalClose").onclick = function () { $("modal").classList.add("hidden"); };
    $("modal").addEventListener("click", function (e) { if (e.target === $("modal") ) $("modal").classList.add("hidden"); });
    $("doLogin").onclick = function () {
      var f = authFields(), B = window.Backend;
      if (!B || !B.configured()) { $("merr").textContent = "Supabase не настроен — см. SUPABASE_SETUP.md."; return; }
      if (!f.email || !f.pass) { $("merr").textContent = "Введи email и пароль."; return; }
      $("merr").textContent = "Вхожу...";
      B.signIn(f.email, f.pass).then(function () { location.reload(); })
        .catch(function (e) { $("merr").textContent = "Не вышло: " + (e.message || e); });
    };
    $("doRegister").onclick = function () {
      var f = authFields(), B = window.Backend;
      if (!B || !B.configured()) { $("merr").textContent = "Supabase не настроен — см. SUPABASE_SETUP.md."; return; }
      if (!f.email || f.pass.length < 6) { $("merr").textContent = "Email + пароль от 6 символов."; return; }
      $("merr").textContent = "Регистрирую...";
      B.signUp(f.email, f.pass, f.nick || f.email.split("@")[0]).then(function (r) {
        if (r.needConfirm) $("merr").textContent = "Проверь почту: подтверди email, потом войди.";
        else location.reload();
      }).catch(function (e) { $("merr").textContent = "Не вышло: " + (e.message || e); });
    };
    $("doLogout").onclick = function () {
      var B = window.Backend;
      if (B) B.signOut().then(function () { location.reload(); });
      else location.reload();
    };
  }

  // ---------- ангар (home) ----------
  function robotId() {
    try { return localStorage.getItem("pytactics_robot") || "bolt"; }
    catch (e) { return "bolt"; }
  }
  function robotById(id) {
    for (var i = 0; i < window.ROBOTS.length; i++) if (window.ROBOTS[i].id === id) return window.ROBOTS[i];
    return window.ROBOTS[0];
  }
  function buildHangar() {
    var box = $("robots");
    if (!box || !window.ROBOTS) return;
    box.innerHTML = "";
    window.ROBOTS.forEach(function (r) {
      var d = document.createElement("div");
      d.className = "robot" + (robotId() === r.id ? " sel" : "");
      var face = ((window.sprite && window.sprite("hero_" + r.id)) || r.emoji);
      d.innerHTML = "<div class='remoji' style='border-color:" + r.color + "'>" + face + "</div>" +
        "<div class='rname'>" + r.name + "</div><div class='rtitle'>" + r.title + "</div>" +
        "<div class='rdesc'>" + r.desc + "</div>";
      d.onclick = function () {
        try { localStorage.setItem("pytactics_robot", r.id); } catch (e) {}
        paintRobots();
        paintFly();
      };
      box.appendChild(d);
    });
  }
  function paintRobots() {
    var box = $("robots");
    if (!box || !window.ROBOTS) return;
    var id = robotId();
    for (var i = 0; i < box.children.length && i < window.ROBOTS.length; i++) {
      box.children[i].classList.toggle("sel", window.ROBOTS[i].id === id);
    }
  }
  function paintFly() {
    var b = $("flyBtn");
    if (b) b.textContent = "🚀 Лететь далее: " + robotById(robotId()).name + " →";
  }
  function initHome() {
    buildHangar();
    paintFly();
    wireAuthModal();
    var seen = null;
    try { seen = localStorage.getItem("pytactics_seen_story"); } catch (e) {}
    if (!seen && $("storyModal")) $("storyModal").classList.remove("hidden");
    if ($("storyGo")) $("storyGo").onclick = function () {
      try { localStorage.setItem("pytactics_seen_story", "1"); } catch (e) {}
      $("storyModal").classList.add("hidden");
    };
    if ($("storyBtn")) $("storyBtn").onclick = function () { $("storyModal").classList.remove("hidden"); };
    if ($("flyBtn")) $("flyBtn").onclick = function () { location.href = "map.html"; };
  }

  // ---------- карта секторов (map) ----------
  function initMap() {
    var B = window.Backend, st = B ? B.stars() : {};
    var gals = galaxies();
    var total = 0, done = 0;
    window.LEVELS.forEach(function (l) {
      total += st[l.id] || 0;
      if ((st[l.id] || 0) > 0) done++;
    });
    if ($("statStars")) $("statStars").textContent = "★ " + total + "/" + (window.LEVELS.length * 3);
    if ($("statDone")) $("statDone").textContent = "🪐 Пройдено: " + done + "/" + window.LEVELS.length;
    if ($("statMode")) $("statMode").textContent = (B && B.currentUser()) ? "☁️ Облако" : "💾 Локально";
    var wrap = $("galaxies");
    if (!wrap) return;
    wrap.innerHTML = "";
    gals.forEach(function (g, gi) {
      var open = galaxyOpen(gi, gals, st);
      var s = 0, d = 0;
      g.levels.forEach(function (id) { s += st[id] || 0; if ((st[id] || 0) > 0) d++; });
      var sec = document.createElement("section");
      sec.className = "galaxy " + g.cls + " gcard" + (open ? "" : " locked");
      sec.innerHTML = "<h3>" + g.icon + " " + esc(g.name) + "</h3>" +
        "<div class='gdesc'>" + esc(g.desc) + "</div>" +
        "<div class='gdesc'>★ " + s + "/" + (g.levels.length * 3) + " · планет пройдено: " + d + "/" + g.levels.length +
        (open ? "" : " · 🔒 сначала заверши предыдущую главу") + "</div>";
      if (open) {
        (function (i) { sec.onclick = function () { location.href = "galaxy.html?g=" + (i + 1); }; })(gi);
      } else {
        sec.title = "Сначала заверши предыдущую главу";
      }
      wrap.appendChild(sec);
    });
  }

  // ---------- планеты главы (galaxy) ----------
  function initGalaxy() {
    var B = window.Backend, st = B ? B.stars() : {};
    var gals = galaxies(), pt = PTYPE();
    var m = location.search.match(/[?&]g=(\d+)/);
    var gi = m ? parseInt(m[1], 10) - 1 : 0;
    if (gi < 0 || gi >= gals.length) gi = 0;
    var g = gals[gi];
    if ($("gTitle")) $("gTitle").textContent = g.icon + " " + g.name;
    if ($("gDesc")) $("gDesc").textContent = g.desc;
    var row = $("planets");
    if (row) {
      row.innerHTML = "";
      g.levels.forEach(function (id) {
        var l = levelById(id);
        if (!l) return;
        var open = isOpen(id, st), s = st[id] || 0;
        var p = document.createElement("div");
        p.className = "planet" + (open ? "" : " locked");
        p.innerHTML = "<div class='orb pt-" + (pt[id] || "rock") + "'>" + (open ? l.id : "🔒") + "</div>" +
          "<div class='pnum'>Планета " + l.id + (l.book ? " · §" + esc(l.book) : "") + "</div>" +
          "<div class='pname'>" + esc(l.title) + "</div>" +
          "<div class='ptopic'>" + esc(l.topic) + "</div>" +
          "<div class='pgoal'>🎯 " + esc(l.goal) + "</div>" +
          "<div class='pstars'>" + (s ? "★".repeat(s) + "☆".repeat(3 - s) : (open ? "— не пройдена —" : "— закрыта —")) + "</div>";
        if (open) {
          (function (x) { p.onclick = function () { location.href = "game.html?level=" + x; }; })(id);
        } else {
          p.title = "Сначала пройди планету " + (id - 1);
        }
        row.appendChild(p);
      });
    }
    var s = 0, d = 0;
    g.levels.forEach(function (id) { s += st[id] || 0; if ((st[id] || 0) > 0) d++; });
    if ($("gStats")) $("gStats").textContent = "★ " + s + "/" + (g.levels.length * 3) + " · пройдено " + d + "/" + g.levels.length;
  }

  // ---------- звёзды ----------
  function starfield() {
    var c = $("stars");
    if (!c) return;
    var ctx = c.getContext("2d"), stars = [];
    function size() {
      c.width = window.innerWidth; c.height = window.innerHeight;
      stars = [];
      for (var i = 0; i < 180; i++) {
        stars.push({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 1.4 + 0.3, p: Math.random() * 6.28, s: 0.5 + Math.random() });
      }
    }
    size();
    window.addEventListener("resize", size);
    (function tick(t) {
      ctx.clearRect(0, 0, c.width, c.height);
      var tm = (t || 0) / 1000;
      stars.forEach(function (s) {
        ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(tm * s.s + s.p));
        ctx.fillStyle = window.__starColor || "#cfe4ff";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.29); ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    })();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var p = (document.body && document.body.getAttribute("data-page")) || "home";
    if (p === "home") boot(initHome);
    else if (p === "map") boot(initMap);
    else if (p === "galaxy") boot(initGalaxy);
    else boot(function () {});
  });
})();
