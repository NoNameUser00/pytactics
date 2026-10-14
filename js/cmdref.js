/* (c) 2026 NoNameUser00. All rights reserved. See LICENSE. */
/* cmdref.js — справка по командам под полем ввода.

   Задача: подсказки не должны выдавать всё сразу. Ученик на третьем уровне не
   должен видеть circle() и словари — он их ещё не открывал. Поэтому справка
   собирается из данных самих уровней: разбираем решение каждого уровня и
   смотрим, какие команды в нём встречаются. Команда появляется в том уровне,
   где она впервые нужна.

   Что видит ученик:
   - команды, которые встретились на уровнях до текущего (уже знакомые);
   - отдельно подсвечены команды, которые понадобятся именно здесь;
   - постоянная легенда поля (астероид, маяк, ядро…) — она нужна всегда.

   Ничего не зашито списком уровней: если решение поменяется, справка
   пересоберётся сама при следующей загрузке страницы. */
window.CmdRef = (function () {
  "use strict";

  /* Описание команд. Всё, чего здесь нет, всё равно попадёт в список —
     просто без пояснения. */
  var DOC = {
    /* движение */
    forward: ["Движение", "шаг вперёд на n клеток"],
    fd: ["Движение", "то же, коротко"],
    backward: ["Движение", "шаг назад на n клеток"],
    bk: ["Движение", "то же, коротко"],
    left: ["Движение", "поворот налево на угол (ход не тратится)"],
    right: ["Движение", "поворот направо на угол"],
    lt: ["Движение", "то же, коротко"],
    rt: ["Движение", "то же, коротко"],
    goto: ["Движение", "идти в точку (x, y)"],
    circle: ["Движение", "обойти квадрат r×r"],
    setheading: ["Движение", "сразу повернуться на угол: 0 — восток, 180 — запад, 270 — юг"],
    seth: ["Движение", "то же, коротко"],
    position: ["Движение", "где сейчас черепаха: (x, y)"],
    pos: ["Движение", "то же, коротко"],
    heading: ["Движение", "куда смотрит: угол в градусах"],
    home: ["Движение", "вернуться в начало"],
    dot: ["Действия", "взять ядро под ногами"],
    penup: ["Действия", "поднять перо: ядра по пути не собираются"],
    pu: ["Действия", "то же, коротко"],
    up: ["Действия", "то же, коротко"],
    pendown: ["Действия", "опустить перо: ядра по пути собираются сами"],
    pd: ["Действия", "то же, коротко"],
    down: ["Действия", "то же, коротко"],
    hideturtle: ["Действия", "спрятать черепаху"],
    showturtle: ["Действия", "показать черепаху"],

    /* датчики */
    is_wall: ["Сенсоры", "стена ли в направлении dir?"],
    is_enemy: ["Сенсоры", "вирус ли в направлении dir?"],
    is_crystal: ["Сенсоры", "ядро ли там? «here» — под ногами"],
    is_exit: ["Сенсоры", "портал ли в направлении dir?"],
    x: ["Сенсоры", "координата X робота"],
    y: ["Сенсоры", "координата Y робота"],
    energy: ["Сенсоры", "сколько осталось энергии"],
    crystals_left: ["Сенсоры", "сколько ядер ещё не собрано"],

    /* бой */
    attack: ["Бой", "удар в направлении dir"],
    collect: ["Бой", "старое имя dot()"],
    wait: ["Бой", "пропустить ход"],
    move_up: ["Бой", "старое имя: шаг вверх"],
    move_down: ["Бой", "старое имя: шаг вниз"],
    move_left: ["Бой", "старое имя: шаг влево"],
    move_right: ["Бой", "старое имя: шаг вправо"],
    get_x: ["Бой", "старое имя: x()"],
    get_y: ["Бой", "старое имя: y()"],
    get_energy: ["Бой", "старое имя: energy()"],

    /* Python */
    print: ["Python", "вывести в консоль"],
    len: ["Python", "длина строки или списка"],
    int: ["Python", "превратить в целое число"],
    float: ["Python", "превратить в дробное"],
    str: ["Python", "превратить в строку"],
    type: ["Python", "тип значения; type(x).__name__ даст имя без скобок"],
    range: ["Python", "числа от a до b (b не включается)"],
    sum: ["Python", "сумма чисел списка"],
    min: ["Python", "наименьшее значение"],
    max: ["Python", "наибольшее значение"],
    sorted: ["Python", "отсортированная копия"],
    abs: ["Python", "модуль числа"],
    round: ["Python", "округление; .5 округляется к чётному"],
    list: ["Python", "список из значений"],
    set: ["Python", "множество — без повторов"],
    tuple: ["Python", "кортеж — неизменяемая группа"],
    dict: ["Python", "словарь: ключ → значение"],
    chr: ["Python", "символ по номеру кода"],
    ord: ["Python", "номер кода символа"],
    join: ["Python", "склеить список строк через разделитель"],
    split: ["Python", "разрезать строку на части"],
    upper: ["Python", "строка заглавными"],
    lower: ["Python", "строка строчными"],
    strip: ["Python", "убрать пробелы по краям"],
    replace: ["Python", "заменить подстроку"],
    find: ["Python", "найти подстроку"],
    startswith: ["Python", "начинается ли строка с подстроки"],
    endswith: ["Python", "заканчивается ли строка подстрокой"],
    isalpha: ["Python", "только ли буквы в строке"],
    append: ["Python", "добавить в список в конец"],
    pop: ["Python", "забрать последний элемент"],
    insert: ["Python", "вставить в список"],
    remove: ["Python", "удалить из списка"],
    sort: ["Python", "отсортировать на месте"],
    shuffle: ["Python", "перемешать список"],
    randint: ["Python", "случайное целое от a до b"],
    seed: ["Python", "зерно: чтобы случайное было каждый раз одно и то же"],
    inf: ["Python", "бесконечность"],
    nan: ["Python", "«не число»"],

    /* модули */
    random: ["Модули", "случайные числа и перемешивание"],
    math: ["Модули", "sqrt, pi, inf и другая математика"],
    re: ["Модули", "регулярные выражения: search, findall, sub"]
  };

  /* конструкции языка — те же правила, но ищем по ключевым словам */
  var CONSTRUCTS = [
    ["комментарий", /#[^\n]*/, "строка с # — человек читает, робот пропускает"],
    ["переменная", /^\s*\w+\s*=\s*[^=]/m, "x = 5 — дали имя значению"],
    ["f-строка", /f["']/i, "f\"{x}\" — подставляет значение прямо в строку"],
    ["if / elif / else", /\bif\b/, "условие: если / иначе"],
    ["for ... in range", /\bfor\b/, "повторить действие несколько раз"],
    ["while", /\bwhile\b/, "повторять, пока условие истинно"],
    ["break", /\bbreak\b/, "выйти из цикла раньше времени"],
    ["continue", /\bcontinue\b/, "перейти к следующему шагу цикла"],
    ["def", /\bdef\s+\w+/, "своя функция: написал один раз — зовёшь по имени"],
    ["return", /\breturn\b/, "вернуть значение из функции"],
    ["рекурсия", /def\s+(\w+)[\s\S]*?\b\1\s*\(/, "функция вызывает сама себя"],
    ["try / except", /\btry\b/, "перехватить ошибку и не сломаться"],
    ["raise", /\braise\b/, "самому вызвать ошибку"],
    ["class", /\bclass\s+\w+/, "свой класс — например, своя ошибка"],
    ["список", /\[/, "список в квадратных скобках"],
    ["словарь", /\{\s*\w+\s*:/, "словарь: ключ → значение"],
    ["кортеж", /\(\s*\w+\s*,/, "кортеж в круглых скобках"],
    ["генератор", /\([^)]*\bfor\b[^)]*\)|\[[^\]]*\bfor\b[^\]]*\]/, "список, собранный одной строкой"],
    ["срез", /\[[^\]]*:[^\]]*\]/, "s[a:b] — часть строки или списка"]
  ];

  var FIELD = [
    ["🪨", "астероид — стена"], ["🌀", "маяк: выход"], ["💎", "ядро: кристалл"],
    ["🔋", "ячейка +6 энергии"], ["👾", "штурмовик"], ["👺", "алый страж"],
    ["💀", "морт"], ["👹", "владыка"]
  ];

  var index = null;   // { firstUse: {команда: уровень}, perLevel: {уровень: [команды]}, constructs: {...} }

  /* Собираем справку один раз: идём по уровням в порядке учебника и запоминаем,
     где какая команда встречается впервые. */
  function build() {
    if (index) return index;
    var firstUse = {}, perLevel = {}, seen = {};
    var constructFirst = {}, constructsPerLevel = {};

    (window.LEVELS || []).forEach(function (l) {
      var a = (window.PyRunner || window.PyEngine).analyze(l.solution || "");
      var used = {};
      (a.calls || []).forEach(function (n) {
        if (seen[n]) return;               // уже знакома — не считаем новой
        seen[n] = true; firstUse[n] = l.id;
      });
      (a.calls || []).forEach(function (n) { used[n] = 1; });
      perLevel[l.id] = Object.keys(used);

      var cons = {};
      CONSTRUCTS.forEach(function (c) {
        if (c[1].test(l.solution || "")) {
          cons[c[0]] = c[2];
          if (!constructFirst[c[0]]) constructFirst[c[0]] = { level: l.id, note: c[2] };
        }
      });
      constructsPerLevel[l.id] = cons;
    });

    index = { firstUse: firstUse, perLevel: perLevel, constructFirst: constructFirst, constructsPerLevel: constructsPerLevel };
    return index;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* Один пункт: команда + пояснение серым. Пояснение короткое — длинные
     съедали строку и рвали её по середине. */
  function item(name, note, fresh) {
    return '<span class="cmdref-item"><code' + (fresh ? ' class="fresh"' : "") + ">" + esc(name) + "</code>" +
      (note ? ' <i class="cmdnote">' + esc(note) + "</i>" : "") + "</span>";
  }

  /* Список одной группы: заголовок на своей строке, команды — в свободном
     потоке с отступом, чтобы группа читалась как блок, а не как строка. */
  function group(title, items) {
    if (!items.length) return "";
    return '<div class="cmdref-group"><b>' + esc(title) + "</b>" + items.join("") + "</div>";
  }

  /* Подсказка для текущего уровня: что пригодится здесь — наверху открытым
     текстом, весь накопленный запас — под «показать». На 76 уровне накопленных
     команд 48 и конструкций 19: сплошной стеной это больше тысячи знаков,
     и нужное в ней уже не видно. Пока команд мало (ранние уровни), список
     раскрыт сам — учить удобнее, когда перед глазами. */
  var AUTO_OPEN = 14;

  function render(levelId) {
    var box = document.getElementById("cmdRef");
    if (!box) return;
    var ix = build();
    var here = ix.perLevel[levelId] || [];
    var hereCons = ix.constructsPerLevel[levelId] || {};

    /* Всё, что открыто к этому уровню: команда считается знакомой с того
       уровня, где впервые понадобилась. Берём весь набор, а не только
       решение текущего уровня — иначе из подсказки выпадают команды,
       выученные раньше и сегодня не нужные. */
    var groups = {};
    Object.keys(ix.firstUse).forEach(function (name) {
      if (ix.firstUse[name] > levelId) return;
      var g = (DOC[name] || ["Прочее", ""])[0];
      (groups[g] = groups[g] || []).push(name);
    });
    /* внутри группы — по порядку знакомства: так список читается как путь */
    Object.keys(groups).forEach(function (g) {
      groups[g].sort(function (a, b) { return ix.firstUse[a] - ix.firstUse[b]; });
    });

    var order = ["Движение", "Действия", "Сенсоры", "Бой", "Python", "Модули", "Прочее"];
    var total = 0;
    var html = "";

    html += '<div class="cmdref-head">🐍 <b>Команды, которые ты уже знаешь</b> · ' +
      "уровень " + levelId + " из " + (window.LEVELS || []).length + "</div>";

    if (here.length) {
      html += '<div class="cmdref-new"><b>🔦 Здесь пригодится:</b>' +
        here.map(function (n) { return item(n, (DOC[n] || [])[1] || ""); }).join("") + "</div>";
    }

    var body = order.map(function (g) {
      var names = groups[g] || [];
      total += names.length;
      return group(g, names.map(function (n) {
        return item(n, (DOC[n] || [])[1] || "", ix.firstUse[n] === levelId);
      }));
    }).join("");

    /* конструкции языка — те же правила роста, но отдельным блоком:
       заголовок «Python» уже занят списком команд Python */
    var cons = [];
    for (var name in ix.constructFirst) {
      if (ix.constructFirst[name].level <= levelId) cons.push(name);
    }
    if (cons.length) {
      cons.sort(function (a, b) { return ix.constructFirst[a].level - ix.constructFirst[b].level; });
      total += cons.length;
      body += group("Конструкции", cons.map(function (c) {
        /* пояснение нужно ровно там, где конструкция появляется, дальше —
           достаточно названия: стена пояснений съедала половину блока */
        return item(c, hereCons[c] ? "" : ix.constructFirst[c].note, ix.constructFirst[c].level === levelId);
      }));
    }

    if (total > AUTO_OPEN) {
      html += '<details class="cmdref-all"' + (total <= AUTO_OPEN ? " open" : "") +
        "><summary>Все открытые команды и конструкции — " + total + " · показать</summary>" +
        body + "</details>";
    } else {
      html += body;
    }

    html += '<div class="cmdref-note"><b>dir</b> — <code>"up"/"down"/"left"/"right"</code>, ' +
      'а <code>"here"</code> — клетка под роботом.</div>';
    html += '<div class="cmdref-note"><b>Поле:</b> ' +
      FIELD.map(function (f) { return f[0] + " " + esc(f[1]); }).join(" · ") + "</div>";

    box.innerHTML = html;
  }

  return { build: build, render: render, DOC: DOC };
})();