/* sw.js — офлайн для десктопа/школы: после первой загрузки игра работает без сети.
   Облако Supabase без сети недоступно — прогресс пишется локально (см. backend.js). */
var CACHE = "pytactics-v2";
var SHELL = [
  "./", "./index.html", "./game.html", "./themes.html",
  "./manifest.webmanifest",
  "./css/style.css", "./css/universe.css",
  "./js/py_engine.js", "./js/levels.js", "./js/game.js", "./js/robots.js",
  "./js/sprites.js", "./js/config.js", "./js/supabase.min.js",
  "./js/backend.js", "./js/ui.js", "./js/universe.js",
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
  e.respondWith(caches.match(e.request).then(function (hit) {
    return hit || fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () { return caches.match("./index.html"); });
  }));
});
