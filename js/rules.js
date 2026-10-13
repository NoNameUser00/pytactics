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
    "call": "вызов своей функции",
    "break": "break",
    "continue": "continue",
    "print": "вывод print()",
    "fstring": "f-строка",
    "sensor": "хотя бы один датчик is_*()",
    "fight": "реакция на вируса (is_enemy() или attack())",
    "str": "работа со строкой",
    "list": "работа со списком",
    "dict": "работа со словарём",
    "tuple": "кортеж или распаковка",
    "comp": "списковое включение",
    "try": "try/except",
    "recursion": "рекурсия",
    "turtle": "команды черепахи (forward, left)"
  };

  /* Требования глав учебника: с каждой главой код усложняется, и глава требует
     именно своей конструкции — иначе уровень решается повтором одной команды.
     Порядок важен: частные параграфы стоят раньше общих. */
  var TOPIC = [
    { re: /^4\.1/, need: ["if"] },
    { re: /^4\.2\.1/, need: ["for"] },
    { re: /^4\.2\.2/, need: ["while"] },
    { re: /^4\.2\.3/, need: ["loop", "break"] },
    { re: /^5\./, need: ["print"] },
    { re: /^6\./, need: ["str"] },
    { re: /^7\./, need: ["str", "if"] },
    { re: /^8\./, need: ["list", "loop"] },
    { re: /^9\./, need: ["tuple"] },
    { re: /^10\./, need: ["dict", "loop"] },
    { re: /^11\./, need: ["def"] },
    { re: /^11\.2/, need: ["def", "call"] },
    { re: /^11\.3/, need: ["recursion"] },
    { re: /^11\.5/, need: ["def", "global"] },
    { re: /^12\./, need: ["comp"] },
    { re: /^13\./, need: ["try"] }
  ];

  /* Требования уровня. Инвариант: эталонное решение проходит проверку всегда. */
  function derive(level) {
    var a = (window.PyRunner || window.PyEngine).analyze(level.solution || "");
    var need = [];
    function add(x) { if (need.indexOf(x) < 0) need.push(x); }

    if (level.expect && level.expect.length) add("print");

    // 1) тема главы
    var book = level.book || "";
    TOPIC.forEach(function (r) {
      if (r.re.test(book)) r.need.forEach(add);
    });
    // 2) механика арены: случайная карта обязана читаться датчиками
    if (level.gen === "flat") { add("loop"); add("sensor"); }
    if (level.gen === "enemy") { add("loop"); add("sensor"); add("fight"); }
    // 3) черепаха вместо отдельных команд move_*: это уже сам по себе алгоритм
    if (level.turtle) add("turtle");
    // 4) если тема явно требует функцию/цикл, а решения нет — просим по мягкому правилу
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
    var a = (window.PyRunner || window.PyEngine).analyze(code || "");
    var miss = (level.need || []).filter(function (k) {
      switch (k) {
        case "loop": return !(a["for"] || a["while"]);
        case "call": return !(a.def && a.ret !== undefined && a.code && a.code.indexOf("(") > -1 && a.def);
        case "sensor": return !(a.sensors.is_wall || a.sensors.is_exit || a.sensors.is_crystal || a.sensors.is_enemy);
        case "fight": return !(a.sensors.is_enemy || a.moves.attack);
        case "tuple": return !(/\(/.test(a.code) && /,/.test(a.code) && /^\s*\w+\s*,/m.test(a.code) || /^\s*\w+\s*,\s*\w+\s*=/m.test(a.code));
        case "turtle": return !(a.moves.forward || a.moves.backward || a.moves.fd || a.moves.goto || a.moves.circle);
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