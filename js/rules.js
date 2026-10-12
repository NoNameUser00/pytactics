/* (c) 2026 NoNameUser00. All rights reserved. See LICENSE. */
/* rules.js — что ОБЯЗАТЕЛЬНО должно быть в коде ученика.
   Зачем: без этого уровень проходится «в лоб» — напечатал move_right() нужное
   число раз и готово, другие команды знать не нужно. Два барьера:

   1) КОНСТРУКЦИИ ТЕМЫ — цикл, условие, функция, print: выводятся из главы
      учебника и из эталонного решения уровня.
   2) АНТИХАРДКОД — нельзя писать больше N одинаковых команд подряд
      (move_right() ×20 — это готовый путь, а не алгоритм).

   Плюс механика арены: если карта случайная (level.gen), без цикла и датчиков
   её не пройти — это проверяется честно, самим боем, а не подсказкой. */

window.LevelRules = (function () {
  "use strict";

  var LABEL = {
    "loop": "цикл (for или while)",
    "for": "цикл for",
    "while": "цикл while",
    "if": "условие if",
    "def": "своя функция def",
    "break": "break",
    "continue": "continue",
    "print": "вывод print()",
    "sensor": "хотя бы один датчик is_*()",
    "fight": "реакция на вируса (is_enemy() или attack())"
  };

  // тема конкретных параграфов: что здесь обязательно
  var TOPIC = [
    { re: /^4\.1/, need: ["if"] },
    { re: /^4\.2\.1/, need: ["loop"] },
    { re: /^4\.2\.2/, need: ["while"] },
    { re: /^4\.2\.3/, need: ["loop", "break"] },
    { re: /^7\./, need: ["loop"] },
    { re: /^8\./, need: ["loop"] },
    { re: /^9\./, need: ["loop"] },
    { re: /^10\./, need: ["loop"] },
    { re: /^11\./, need: ["def"] }
  ];

  /* Требования уровня. Инвариант: эталонное решение проходит проверку всегда. */
  function derive(level) {
    var a = window.PyEngine.analyze(level.solution || "");
    var need = [];
    function add(x) { if (need.indexOf(x) < 0) need.push(x); }

    if (level.expect && level.expect.length) add("print");

    // 1) тема главы
    var book = level.book || "";
    TOPIC.forEach(function (r) {
      if (r.re.test(book)) r.need.forEach(add);
    });
    // 2) механика арены: случайная карна обязана читаться датчиками
    if (level.gen === "flat") { add("loop"); add("sensor"); }
    if (level.gen === "enemy") { add("loop"); add("sensor"); add("fight"); }
    // 3) если тема явно требует функцию/цикл, а решения нет — просим по мягкому правилу
    if (a.def && !level.gen) add("def");

    return need;
  }

  // Дописать правила к уровню (один раз при загрузке).
  function apply(level) {
    if (!level) return level;
    if (!level.need) level.need = derive(level);
    if (level.hardcode === undefined) level.hardcode = 3; // >3 одинаковых команд подряд — хардкод
    if (!level.needText) {
      level.needText = level.need.length
        ? "Обязательно в коде: " + level.need.map(function (k) { return LABEL[k] || k; }).join(" · ") + "."
        : "";
    }
    return level;
  }

  // Проверка кода ДО запуска: {ok:true, analysis} или {ok:false, reason, tip}
  function check(level, code) {
    var a = window.PyEngine.analyze(code || "");
    var miss = (level.need || []).filter(function (k) {
      switch (k) {
        case "loop": return !(a["for"] || a["while"]);
        case "sensor": return !(a.sensors.is_wall || a.sensors.is_exit || a.sensors.is_crystal || a.sensors.is_enemy);
        case "fight": return !(a.sensors.is_enemy || a.moves.attack);
        default: return !a[k];
      }
    });
    if (miss.length) {
      var names = miss.map(function (k) { return LABEL[k] || k; });
      var onlyLoop = names.length === 1 && /^цикл/.test(names[0]);
      return {
        ok: false,
        reason: "Пока не засчитано. Нужно в коде: " + names.join(", ") + ".",
        tip: onlyLoop
          ? "Коридор каждый раз новый — повторять одну команду вручную не выйдет. Нужен цикл. Кнопка 💡 подскажет."
          : "Тема этого уровня — именно это. Кнопка 💡 Подсказка покажет нужный шаг."
      };
    }
    if (level.hardcode && a.maxRepeat > level.hardcode) {
      return {
        ok: false,
        reason: "Слишком много одинаковых команд подряд (" + a.maxRepeat + " шт.) — это готовый путь, а не алгоритм.",
        tip: "Повторы делаются циклом: один for и одна команда заменяют десятки строк. В этом весь смысл алгоритмов."
      };
    }
    return { ok: true, analysis: a };
  }

  return { apply: apply, check: check, derive: derive };
})();