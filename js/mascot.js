/* (c) 2026 NoNameUser00. All rights reserved. See LICENSE. */
/* mascot.js — Наставник-призрак бродит по странице как живой:
   медленно плывёт, останавливается по своим делам (читает, кодит,
   смотрит звёзды, медитирует), бормочет перевёртыши. Клики не перехватывает.
   Уважает prefers-reduced-motion: тогда сидит в углу.
   Призрака можно выключить крестиком — выбор запоминается, а в углу
   остаётся маленькая кнопка, чтобы позвать его обратно. */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }

  /* Позиционирует только призрак (left/top в скрипте). Свойства bottom здесь
     быть не должно: если заданы и top, и bottom, блок растягивается между
     ними, а облако с bottom:40px привязывается к низу растянутого блока —
     и бурчит у нижнего края экрана, где призрака может вообще не быть.
     line-height:0 убирает лишнюю строку от пробела между SVG и подписями. */
  var CSS = "#mascot{position:fixed;left:12px;top:0;width:58px;line-height:0;z-index:5;pointer-events:auto;cursor:grab;touch-action:none;transition:left 9s linear,top 9s linear;filter:drop-shadow(0 0 9px rgba(140,200,255,.75))}"
    + "#mascot.drag{transition:none;cursor:grabbing}"
    + "#mascot svg{width:100%;height:auto;display:block;animation:ghostfloat 3s ease-in-out infinite}"
    + "#mascot .mact{position:absolute;left:50%;top:-26px;transform:translateX(-50%);font-size:22px;line-height:1}"
    /* Ширина задана явно: у абсолютного блока она иначе считается по месту
       справа от left внутри бокса призрака, а там 2 пикселя — облако
       сжималось в столбик из двух слов. */
    + "#mascot .msay{position:absolute;left:56px;top:2px;width:210px;max-width:calc(100vw - 84px);background:rgba(10,16,30,.94);border:1px solid #2b3648;border-radius:10px;padding:6px 9px;font-size:12px;line-height:1.45;color:#e6edf3;opacity:0;transition:opacity .5s;white-space:normal}"
    + "#mascot .msay.on{opacity:1}"
    /* у правого края экрана облако переворачивается влево от призрака */
    + "#mascot .msay.left{left:auto;right:56px}"
    + "#mascot .msay::before{content:'';position:absolute;left:-7px;top:10px;width:0;height:0;border:7px solid transparent;border-right-color:#1b2536;border-left:0}"
    + "#mascot .msay.left::before{left:auto;right:-7px;border-right:0;border-left:7px solid #1b2536}"
    + "#mascot.flip svg{transform:scaleX(-1)}"
    /* крестик выключения — на самом призраке, чтобы не искать в меню */
    + "#mascot .mclose{position:absolute;left:-6px;top:-8px;width:20px;height:20px;line-height:18px;text-align:center;border-radius:50%;background:#16202f;border:1px solid #2b3648;color:#8fa3ba;font-size:12px;cursor:pointer;opacity:.55;transition:opacity .2s;font-family:system-ui,sans-serif}"
    + "#mascot .mclose:hover{opacity:1;color:#fff;background:#23334a}"
    + "#mascot:hover .mclose{opacity:.9}"
    /* возвращатель в углу: без него выключенного призрака не вернуть */
    + "#mascotRecall{position:fixed;left:8px;bottom:8px;z-index:4;width:30px;height:30px;line-height:28px;text-align:center;border-radius:50%;background:rgba(16,24,38,.8);border:1px solid #2b3648;color:#8fa3ba;font-size:15px;cursor:pointer;opacity:.35;transition:opacity .2s;font-family:system-ui,sans-serif}"
    + "#mascotRecall:hover{opacity:1;color:#fff}"
    + "@keyframes ghostfloat{50%{margin-top:-5px}}"
    + "@media(max-width:640px){#mascot{width:44px}#mascot .msay{width:150px;max-width:calc(100vw - 70px);font-size:11px;left:44px;right:auto}"
    + "#mascot .msay.left{left:auto;right:44px}#mascot .msay::before{left:-7px;border-right:7px solid #1b2536;border-left:0}"
    + "#mascot .msay.left::before{left:auto;right:-7px;border-right:0;border-left:7px solid #1b2536}}";

  var ACTS = [
    { prop: "📖", text: "Хроники перечитываю я. Помнить всё должен." },
    { prop: "💻", text: "Баг ищу. Прячется он." },
    { prop: "🔭", text: "Звёзды старые. Мудрые они." },
    { prop: "💤", text: "Медитирую я. Не спать." },
    { prop: "🍵", text: "Чай пью. Терпение прибывает." }
  ];

  function ghostArt() {
    if (window.sprite) {
      var g = window.sprite("mentor_ghost");
      if (g) return g;
    }
    return "<span style='font-size:44px'>👻</span>";
  }

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* Помнит выбор ученика между открытиями: призрак, которому мешает,
     не должен снова появляться сам. */
  var KEY = "pytactics.mascotOff";
  function wasOff() {
    try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function rememberOff(off) {
    try { if (off) localStorage.setItem(KEY, "1"); else localStorage.removeItem(KEY); } catch (e) {}
  }

  function start() {
    var st = document.createElement("style");
    st.textContent = CSS;
    document.head.appendChild(st);
    var m = document.createElement("div");
    m.id = "mascot";
    m.innerHTML = ghostArt() + "<div class='mact'></div><div class='msay'></div>"
      + "<button class='mclose' type='button' title='Спрятать наставника' aria-label='Спрятать наставника'>×</button>";
    document.body.appendChild(m);
    var act = m.children[1], say = m.children[2], close = m.querySelector(".mclose");

    var recall = document.createElement("button");
    recall.id = "mascotRecall";
    recall.type = "button";
    recall.title = "Позвать наставника";
    recall.setAttribute("aria-label", "Позвать наставника");
    recall.textContent = "👻";
    recall.style.display = "none";
    document.body.appendChild(recall);

    var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var x = 12, y = window.innerHeight - 90;
    function place(nx, ny) {
      x = nx; y = ny;
      m.style.left = x + "px";
      m.style.top = y + "px";
    }
    /* Ставит облако с той стороны, где для него есть место: у правого края
       экрана облако уходит влево от призрака, иначе уезжает за край.
       Объявлено здесь же, а не рядом с pick(): say и x живут внутри start(),
       иначе ReferenceError — облако просто не показывалось бы. */
    function fitSay() {
      var w = say.offsetWidth || 210;
      var roomRight = window.innerWidth - (x + m.offsetWidth);
      say.classList.toggle("left", roomRight < w + 14 && x > w + 14);
    }
    function wander() {
      if (dragging) return;
      var g = gen;
      var mx = 70, my = 90;
      var nx = mx + Math.random() * Math.max(mx, window.innerWidth - mx * 2);
      var ny = my + Math.random() * Math.max(my, window.innerHeight - my * 2 - 40);
      m.classList.toggle("flip", nx < x);
      place(nx, ny);
      setTimeout(function () { if (g === gen && !dragging) doAct(); }, 9000 + Math.random() * 5000);
    }
    function doAct() {
      if (dragging) return;
      var g = gen;
      var a = pick(ACTS);
      act.textContent = a.prop;
      say.textContent = a.text;
      fitSay();
      say.classList.add("on");
      setTimeout(function () {
        if (g !== gen) return;
        say.classList.remove("on");
        setTimeout(function () { if (g === gen && !dragging) { act.textContent = ""; wander(); } }, 800);
      }, 4200);
    }
    var dragging = false, gen = 0;
    function dragMove(e) {
      x = Math.min(Math.max(e.clientX - 29, 0), window.innerWidth - 60);
      y = Math.min(Math.max(e.clientY - 29, 0), window.innerHeight - 90);
      m.style.left = x + "px";
      m.style.top = y + "px";
    }
    m.addEventListener("pointerdown", function (e) {
      dragging = true; gen++;
      m.classList.add("drag");
      say.classList.remove("on");
      act.textContent = "✋";
      try { m.setPointerCapture(e.pointerId); } catch (err) {}
      dragMove(e);
      e.preventDefault();
    });
    m.addEventListener("pointermove", function (e) { if (dragging) dragMove(e); });
    function drop() {
      if (!dragging) return;
      dragging = false;
      m.classList.remove("drag");
      act.textContent = "";
      var g = gen;
      say.textContent = "Несёшь меня ты. Приятно.";
      fitSay();
      say.classList.add("on");
      setTimeout(function () {
        if (g !== gen) return;
        say.classList.remove("on");
        setTimeout(function () { if (g === gen) wander(); }, 600);
      }, 1800);
    }
    m.addEventListener("pointerup", drop);
    m.addEventListener("pointercancel", drop);

    /* Выключение: гасим таймеры через gen (их проверяет каждая цепочка
       setTimeout), прячем призрака и оставляем кнопку возврата. */
    function setOff(off) {
      rememberOff(off);
      m.style.display = off ? "none" : "";
      recall.style.display = off ? "" : "none";
      if (off) { gen++; dragging = false; m.classList.remove("drag"); }
      else if (!calm) { place(12, window.innerHeight - 90); setTimeout(wander, 2500); }
    }
    close.addEventListener("click", function (e) {
      e.stopPropagation();   // иначе начнётся перетаскивание призрака
      setOff(true);
    });
    recall.addEventListener("click", function () { setOff(false); });

    place(x, y);
    if (wasOff()) setOff(true);
    else if (!calm) setTimeout(wander, 2500);   // при calm просто сидит в углу
    window.addEventListener("resize", function () {
      if (m.style.display === "none") return;
      x = Math.min(x, window.innerWidth - 70);
      y = Math.min(y, window.innerHeight - 90);
      place(x, y);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
