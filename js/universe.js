/* universe.js — главная страница: карта галактик + вход через Supabase. */
(function () {
  "use strict";
  var GALAXIES = [
    { name: "Сектор «Внешнее Кольцо»", desc: "Учебный сектор Ордена Операторов: команды и переменные", levels: [1, 2], cls: "g1", icon: "🌌" },
    { name: "Сектор «Пояс Астероидов»", desc: "Завалы Империи Роя: ветвления и циклы", levels: [3, 4, 5], cls: "g2", icon: "☄️" },
    { name: "«Тёмный Сектор»", desc: "Логово Владыки Баг: функции и поиск пути. Финал — Узел Роя.", levels: [6, 7, 8], cls: "g3", icon: "🌑" }
  ];

  var $ = function (id) { return document.getElementById(id); };

  var THEMES = [
    { id: "nebula", name: "Небула (текущая)", c: ["#f778ba", "#58a6ff"] },
    { id: "abyss", name: "Бездна (ледяная)", c: ["#39c5cf", "#1f6feb"] },
    { id: "nova", name: "Нова (солнечная)", c: ["#ff7a3d", "#ffd60a"] },
    { id: "emerald", name: "Изумруд (матрица)", c: ["#3fb950", "#39c5cf"] },
    { id: "royal", name: "Корона (фиолет)", c: ["#c084fc", "#f778ba"] }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    starfield();
    initTheme();
    $("authBtn").onclick = openModal;
    $("modalClose").onclick = closeModal;
    $("modal").addEventListener("click", function (e) { if (e.target === $("modal")) closeModal(); });
    $("doLogin").onclick = doLogin;
    $("doRegister").onclick = doRegister;
    $("doLogout").onclick = doLogout;
    buildHangar();
    // история мира: первый визит — рассказ, дальше — по кнопке 📕
    var seen = null;
    try { seen = localStorage.getItem("pytactics_seen_story"); } catch (e) {}
    if (!seen) $("storyModal").classList.remove("hidden");
    $("storyGo").onclick = function () {
      try { localStorage.setItem("pytactics_seen_story", "1"); } catch (e) {}
      $("storyModal").classList.add("hidden");
    };
    $("storyBtn").onclick = function () { $("storyModal").classList.remove("hidden"); };
    var go = function () { render(); };
    if (window.Backend) window.Backend.init().then(go).catch(go);
    else go();
  });

  function isOpen(id, st) {
    if (id === 1) return true;
    return (st[id - 1] || 0) > 0;
  }

  function render() {
    var B = window.Backend;
    var st = B ? B.stars() : {};
    var lv = {};
    window.LEVELS.forEach(function (l) { lv[l.id] = l; });

    // шапка авторизации
    var u = B && B.currentUser();
    if (u) {
      $("authArea").innerHTML = "";
      var box = document.createElement("div");
      box.className = "userbox";
      box.innerHTML = "👩‍🚀 <b>" + esc(u.email || "ученик") + "</b><br>" +
        (B.isCloud() ? "☁️ прогресс в облаке" : "💾 только этот браузер");
      $("authArea").appendChild(box);
      var out = document.createElement("button");
      out.className = "authbtn"; out.textContent = "Выйти";
      out.onclick = doLogout;
      $("authArea").appendChild(out);
    } else {
      $("authArea").innerHTML = "";
      var note = B && !B.configured()
        ? "<div class='userbox'>💾 гостевой режим (Supabase не настроен)</div>" : "";
      $("authArea").innerHTML = note;
      var btn = document.createElement("button");
      btn.className = "authbtn"; btn.id = "authBtn2"; btn.textContent = "Войти / Регистрация";
      btn.onclick = openModal;
      $("authArea").appendChild(btn);
    }

    // статистика
    var total = 0, done = 0;
    window.LEVELS.forEach(function (l) {
      var s = st[l.id] || 0;
      total += s;
      if (s > 0) done++;
    });
    $("statStars").textContent = "★ " + total + "/" + (window.LEVELS.length * 3);
    $("statDone").textContent = "🪐 Пройдено: " + done + "/" + window.LEVELS.length;
    $("statMode").textContent = (B && B.currentUser()) ? "☁️ Облако" : "💾 Локально";

    // кнопка «Продолжить»
    var next = null;
    window.LEVELS.forEach(function (l) { if (!next && (st[l.id] || 0) === 0 && isOpen(l.id, st)) next = l; });
    var cb = $("continueBtn");
    if (next) { cb.textContent = "▶ Продолжить: уровень " + next.id + " «" + next.title + "»"; cb.onclick = function () { go2(next.id); }; }
    else if (done === window.LEVELS.length) { cb.textContent = "🏆 Вселенная пройдена! Переиграть финал"; cb.onclick = function () { go2(8); }; }
    else { cb.textContent = "▶ Начать: уровень 1"; cb.onclick = function () { go2(1); }; }

    // галактики
    var uni = $("universe");
    uni.innerHTML = "";
    GALAXIES.forEach(function (g) {
      var sec = document.createElement("section");
      sec.className = "galaxy " + g.cls;
      var h = document.createElement("h3");
      h.textContent = g.icon + " " + g.name;
      var d = document.createElement("div");
      d.className = "gdesc"; d.textContent = g.desc;
      var row = document.createElement("div");
      row.className = "planets";
      g.levels.forEach(function (id) {
        var l = lv[id];
        if (!l) return;
        var open = isOpen(id, st);
        var s = st[id] || 0;
        var p = document.createElement("div");
        p.className = "planet" + (open ? "" : " locked");
        p.innerHTML = "<div class='orb'>" + (open ? l.id : "🔒") + "</div>" +
          "<div class='pnum'>Планета " + l.id + "</div>" +
          "<div class='pname'>" + esc(l.title) + "</div>" +
          "<div class='ptopic'>" + esc(l.topic) + "</div>" +
          "<div class='pstars'>" + (s ? "★".repeat(s) + "☆".repeat(3 - s) : (open ? "— не пройдена —" : "— закрыта —")) + "</div>";
        if (open) p.onclick = function () { go2(id); };
        else p.title = "Сначала пройди планету " + (id - 1);
        row.appendChild(p);
      });
      sec.appendChild(h); sec.appendChild(d); sec.appendChild(row);
      uni.appendChild(sec);
    });
  }

  function go2(id) { location.href = "game.html?level=" + id; }

  // ---------- ангар ----------
  function robotId() {
    try { return localStorage.getItem("pytactics_robot") || "bolt"; }
    catch (e) { return "bolt"; }
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

  // ---------- темы ----------
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
    if (!box) return;
    THEMES.forEach(function (t) {
      var b = document.createElement("button");
      b.className = "tdot"; b.setAttribute("data-t", t.id); b.title = t.name;
      b.style.background = "linear-gradient(135deg," + t.c[0] + "," + t.c[1] + ")";
      b.onclick = function () { applyTheme(t.id); };
      box.appendChild(b);
    });
    applyTheme(savedTheme(), false);
  }
  function refreshStar() {
    try {
      window.__starColor = getComputedStyle(document.documentElement).getPropertyValue("--star").trim() || "#cfe4ff";
    } catch (e) { window.__starColor = "#cfe4ff"; }
  }

  // ---------- авторизация ----------
  function openModal() { $("modal").classList.remove("hidden"); $("merr").textContent = ""; }
  function closeModal() { $("modal").classList.add("hidden"); }
  function fields() {
    return {
      email: $("memail").value.trim(),
      pass: $("mpass").value,
      nick: $("mnick").value.trim()
    };
  }
  function doLogin() {
    var f = fields(), B = window.Backend;
    if (!B || !B.configured()) { $("merr").textContent = "Supabase не настроен — см. SUPABASE_SETUP.md."; return; }
    if (!f.email || !f.pass) { $("merr").textContent = "Введи email и пароль."; return; }
    $("merr").textContent = "Вхожу...";
    B.signIn(f.email, f.pass).then(function () { location.reload(); })
      .catch(function (e) { $("merr").textContent = "Не вышло: " + (e.message || e); });
  }
  function doRegister() {
    var f = fields(), B = window.Backend;
    if (!B || !B.configured()) { $("merr").textContent = "Supabase не настроен — см. SUPABASE_SETUP.md."; return; }
    if (!f.email || f.pass.length < 6) { $("merr").textContent = "Email + пароль от 6 символов."; return; }
    $("merr").textContent = "Регистрирую...";
    B.signUp(f.email, f.pass, f.nick || f.email.split("@")[0]).then(function (r) {
      if (r.needConfirm) $("merr").textContent = "Проверь почту: нужно подтвердить email, потом войди.";
      else location.reload();
    }).catch(function (e) { $("merr").textContent = "Не вышло: " + (e.message || e); });
  }
  function doLogout() {
    var B = window.Backend;
    if (B) B.signOut().then(function () { location.reload(); });
    else location.reload();
  }

  // ---------- звёздное небо ----------
  function starfield() {
    var c = $("stars"), ctx = c.getContext("2d"), stars = [];
    function size() {
      c.width = window.innerWidth; c.height = window.innerHeight;
      stars = [];
      for (var i = 0; i < 180; i++) {
        stars.push({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 1.4 + .3, p: Math.random() * 6.28, s: .5 + Math.random() });
      }
    }
    size();
    window.addEventListener("resize", size);
    (function tick(t) {
      ctx.clearRect(0, 0, c.width, c.height);
      var tm = (t || 0) / 1000;
      stars.forEach(function (s) {
        ctx.globalAlpha = .35 + .65 * Math.abs(Math.sin(tm * s.s + s.p));
        ctx.fillStyle = window.__starColor || "#cfe4ff";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.29); ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    })();
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
})();
