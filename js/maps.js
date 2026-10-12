/* (c) 2026 NoNameUser00. All rights reserved. See LICENSE. */
/* maps.js — генератор арен.
   Зачем: раньше карта была одинаковой, и уровень проходился «на автопилоте»:
   напечатал move_right() нужное число раз — и готово, другие команды не нужны.
   Теперь карта собирается заново КАЖДЫЙ ЗАХОД: длина коридора, места кристаллов
   и вирусов меняются. Значит «выученный» путь не работает — надо решать задачу:
   читать карту и писать алгоритм (цикл + датчики).

   Виды арен:
     flat   — коридор со сквозняком кристаллов (нужен collect + цикл);
     enemy  — коридор с вирусами на пути (нужен attack + цикл);
     fixed  — карта из levels.js вручную (маленькие «синтаксические» уровни 1–3 главы).

   build() возвращает: { rows, energy, maxTurns, starTurns, kind }.
   Один и тот же seed — одна и та же карта (чтобы рендер и симуляция совпадали). */

window.MapGen = (function () {
  "use strict";

  // Простой детерминированный ГПСЧ (не Math.random — карта должна повторяться).
  function rng(seed) {
    var s = (seed | 0) % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () { s = (s * 16807) % 2147483647; return s / 2147483647; };
  }
  function pickInt(r, from, to) { return from + Math.floor(r() * (to - from + 1)); }

  function row(n, ch) { var s = ""; for (var i = 0; i < n; i++) s += ch || "#"; return s; }
  // клетки нумеруются с 1 («второй кристалл»), в строке индексы с 0
  function put(cells, pos, ch) { return cells.slice(0, pos - 1) + ch + cells.slice(pos); }

  /* flat: коридор длиной len клеток (4..7) + 1–2 кристалла + портал.
     Ходов нужно len, плюс collect() за каждый кристалл. */
  function flat(r) {
    var len = pickInt(r, 4, 7);
    var w = len + 3;
    var cells = "";
    var i;
    for (i = 0; i < len; i++) cells += ".";
    var k = pickInt(r, 1, 2);
    var used = {}, placed = 0, guard = 0;
    while (placed < k && guard++ < 40) {
      var p = pickInt(r, 1, len);
      if (used[p]) continue;
      used[p] = 1; placed++;
      cells = put(cells, p, "C");
    }
    return {
      rows: [row(w), "P" + cells + "X" + "#", row(w)],
      // ходов: клеток до портала (len + шаг на сам портал) + сбор каждого кристалла
      turns: len + 1 + placed
    };
  }

  /* enemy: вирус(ы) прямо в коридоре — пройти можно только после attack().
     Строим так: сначала кристалл, потом вирус СТРОГО перед ним — тогда и attack()
     действительно нужен, и никто друг на друга не наступает. */
  function enemy(r) {
    var len = pickInt(r, 5, 8);
    var w = len + 3;
    var cells = "";
    var i;
    for (i = 0; i < len; i++) cells += ".";

    var cp = pickInt(r, 2, len);              // кристалл (не в первой клетке)
    var firstFoe = pickInt(r, 1, cp - 1);     // вирус перед кристаллом
    var spots = {};
    spots[firstFoe] = 1;
    var n = 1;
    if (pickInt(r, 1, 2) === 2) {             // иногда — двое
      var p2 = pickInt(r, 1, len), tries = 0;
      while ((spots[p2] || p2 === cp) && tries++ < 40) p2 = pickInt(r, 1, len);
      if (!spots[p2] && p2 !== cp) { spots[p2] = 1; n++; }
    }
    for (var key in spots) cells = put(cells, +key, "E");
    cells = put(cells, cp, "C");
    return {
      rows: [row(w), "P" + cells + "X" + "#", row(w)],
      // ходов: путь до портала (len + шаг на портал) + кристалл + атаки
      turns: len + 1 + 1 + n,
      hits: n                 // столько раз герой получит по 3 энергии, если ошибётся
    };
  }

  /* Собрать арену уровня.
     level.gen === "flat" | "enemy" — случайная карта; иначе берём level.map. */
  function build(level, seed) {
    var kind = level.gen || "fixed";
    if (kind === "fixed") {
      return {
        kind: "fixed", rows: level.map,
        energy: level.energy, maxTurns: level.maxTurns, starTurns: level.starTurns
      };
    }
    var r = rng((level.id || 1) * 7919 + (seed || 0) * 104729 + 17);
    var res = kind === "enemy" ? enemy(r) : flat(r);
    var turns = res.turns;
    return {
      kind: kind, rows: res.rows,
      energy: turns + 10 + (res.hits || 0) * 3,
      maxTurns: turns + 8,
      starTurns: turns
    };
  }

  /* Сколько звёзд поставить: 3 — если уложился в оптимум. */
  function starFor(level, spec, turns) {
    var opt = spec && spec.starTurns ? spec.starTurns : (level.starTurns || 99);
    return turns <= opt ? 3 : (turns <= opt + 4 ? 2 : 1);
  }

  return { build: build, starFor: starFor };
})();