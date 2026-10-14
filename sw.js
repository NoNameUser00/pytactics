/* (c) 2026 NoNameUser00. All rights reserved. See LICENSE. */
/* sw.js — офлайн для десктопа/школы: после первой загрузки игра работает без сети.
   Облако Supabase без сети недоступно — прогресс пишется локально (см. backend.js). */
/* Версию кэша поднимаем при каждом изменении списка SHELL: статика
   отдаётся из кэша (hit || net), и без нового имени кэша ученик долго
   получал бы старые скрипты. Имя кэша и есть версия. */
var CACHE = "pytactics-v14";
var SHELL = [
  "./", "./index.html", "./map.html", "./galaxy.html", "./game.html", "./themes.html",
  "./manifest.webmanifest",
  "./css/style.css?v=9", "./css/universe.css?v=9",
  "./js/py_engine.js?v=9", "./js/levels.js?v=9", "./js/game.js?v=9", "./js/robots.js?v=9",
  "./js/sprites.js?v=9", "./js/ships.js?v=9", "./js/config.js?v=9", "./js/supabase.min.js?v=9",
  "./js/backend.js?v=9", "./js/ui.js?v=9", "./js/pages.js?v=9", "./js/mentor.js", "./js/mascot.js",
  "./js/maps.js", "./js/rules.js", "./js/sfx.js", "./js/pyodide-engine.js", "./js/cmdref.js", "./js/editor-mode.js",
  "./vendor/pyodide/pyodide.js", "./vendor/pyodide/pyodide.asm.wasm",
  "./vendor/pyodide/python_stdlib.zip", "./vendor/pyodide/pyodide-lock.json",
  "./vendor/codemirror.min.js", "./vendor/codemirror.min.css",
  "./vendor/mode/python/python.min.js", "./vendor/addon/edit/closebrackets.min.js",
  "./vendor/addon/edit/matchbrackets.min.js", "./vendor/addon/selection/active-line.min.js",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon.svg"
];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  /* Код (js/css) и документы — сначала сеть, кэш только запасным путём.
     Раньше статика отдавалась из кэша, а список файлов внутри sw.js не меняется
     при правке самих файлов: воркер не переустанавливается, кэш живёт старым
     и ученик видит прошлую версию. Сеть-первым это снимает, офлайн не ломается.
     Тяжёлое (ядро Python, картинки, шрифты) — наоборот, из кэша с тихим
     обновлением: там важна скорость, а файл меняется редко. */
  var fresh = e.request.mode === "navigate" || e.request.destination === "document"
    || e.request.destination === "script" || e.request.destination === "style";
  if (fresh) {
    e.respondWith(fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () {
      /* Сети нет — ищем в кэше без разбора адреса. Игра ходит по страницам
         вида game.html?level=17, и офлайн открытый level=40 не находился:
         в кэше лежит game.html с другим хвостом, и ученик вместо арены
         получал главную страницу. Уровни лежат в js/levels.js (кэшируется
         отдельно), поэтому подойдёт любой game.html. Для скриптов это тоже
         верно: ?v=9 положит — отдаст любую закэшированную версию файла,
         ведь лучше старая рабочая версия, чем никакой. */
      return caches.match(e.request, { ignoreSearch: true }).then(function (any) {
        return any || caches.match("./index.html");
      });
    }));
    return;
  }
  // тяжёлая статика: сразу из кэша + тихое обновление из сети
  e.respondWith(caches.match(e.request).then(function (hit) {
    var net = fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () { return hit; });
    return hit || net;
  }));
});
