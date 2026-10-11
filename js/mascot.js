/* � 2026 NoNameUser00. ��� ����� ��������. ��. LICENSE. */
/* mascot.js — Наставник-призрак бродит по странице как живой:
   медленно плывёт, останавливается по своим делам (читает, кодит,
   смотрит звёзды, медитирует), бормочет перевёртыши. Клики не перехватывает.
   Уважает prefers-reduced-motion: тогда сидит в углу. */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }

  var CSS = "#mascot{position:fixed;left:12px;bottom:12px;width:58px;z-index:5;pointer-events:none;transition:left 9s linear,top 9s linear;filter:drop-shadow(0 0 9px rgba(140,200,255,.75))}"
    + "#mascot svg{width:100%;height:auto;animation:ghostfloat 3s ease-in-out infinite}"
    + "#mascot .mact{position:absolute;left:50%;top:-26px;transform:translateX(-50%);font-size:22px}"
    + "#mascot .msay{position:absolute;left:60px;bottom:40px;max-width:210px;background:rgba(10,16,30,.94);border:1px solid #2b3648;border-radius:10px;padding:6px 9px;font-size:12px;line-height:1.45;color:#e6edf3;opacity:0;transition:opacity .5s;white-space:normal}"
    + "#mascot .msay.on{opacity:1}"
    + "#mascot.flip svg{transform:scaleX(-1)}"
    + "@keyframes ghostfloat{50%{margin-top:-5px}}"
    + "@media(max-width:640px){#mascot{width:44px}#mascot .msay{max-width:150px;font-size:11px;left:48px}}";

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

  function start() {
    var st = document.createElement("style");
    st.textContent = CSS;
    document.head.appendChild(st);
    var m = document.createElement("div");
    m.id = "mascot";
    m.innerHTML = ghostArt() + "<div class='mact'></div><div class='msay'></div>";
    document.body.appendChild(m);
    var act = m.children[1], say = m.children[2];

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // сидит в углу

    var x = 12, y = window.innerHeight - 90;
    function place(nx, ny) {
      x = nx; y = ny;
      m.style.left = x + "px";
      m.style.top = y + "px";
    }
    function wander() {
      var mx = 70, my = 90;
      var nx = mx + Math.random() * Math.max(mx, window.innerWidth - mx * 2);
      var ny = my + Math.random() * Math.max(my, window.innerHeight - my * 2 - 40);
      m.classList.toggle("flip", nx < x);
      place(nx, ny);
      setTimeout(doAct, 9000 + Math.random() * 5000);
    }
    function doAct() {
      var a = pick(ACTS);
      act.textContent = a.prop;
      say.textContent = a.text;
      say.classList.add("on");
      setTimeout(function () {
        say.classList.remove("on");
        setTimeout(function () { act.textContent = ""; wander(); }, 800);
      }, 4200);
    }
    place(x, y);
    setTimeout(wander, 2500);
    window.addEventListener("resize", function () {
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
