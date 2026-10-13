/* Правка уровней PyTactics: точечная замена полей внутри блока уровня.
   Файл levels.js не перегенерируется целиком — комментарии и разметка
   остаются нетронутыми, меняются только нужные поля.

   Запуск:  node patch-levels.js 9        главы 1-2: печать, переменные, черепаха
           node patch-levels.js truthful уровни, где старый движок соврал
           node patch-levels.js all      всё по порядку */
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "js", "levels.js");
const T = (s) => JSON.stringify(s);

/* ---------- главы 1-2 ---------- */
const CH1 = {
  1: {
    goal: 'Выведи «Привет, Грид!», забери 💎 и дойди до 🌀.',
    briefing: "§1.1: первая программа выводит текст. Робот — это черепаха: она смотрит вправо, forward(n) ведёт её на n клеток, dot() берёт ядро под ногами.",
    starter: 'print("Привет, Грид!")\nforward(1)\n',
    solution: 'print("Привет, Грид!")\nforward(1)\ndot()\nforward(1)',
    hint: "Намёк: черепаха смотрит вправо. forward(1) — шаг, dot() — взять ядро, потом ещё шаг до портала."
  },
  2: {
    goal: 'Пройди коридор и забери 💎.',
    briefing: "§1.4: программа выполняется сверху вниз, строка за строкой. Идти можно сразу на несколько клеток: forward(4) — это четыре шага одной строкой.",
    starter: '# Команды выполняются по порядку\nforward(1)\n',
    solution: 'forward(1)\ndot()\nforward(4)',
    hint: "Намёк: ядро на второй клетке. Один шаг, dot(), потом до портала — одной командой forward(4)."
  },
  3: {
    goal: "Собери 💎 и дойди до 🌀.",
    briefing: "§1.5: строки с # черепаха не читает, а человек понимает. Подпиши каждый шаг — и код станет понятнее через полгода.",
    starter: '# Иди и забери кристалл\nforward(2)\n',
    solution: '# до ядра\nforward(2)\ndot()\n# до портала\nforward(2)',
    hint: "Намёк: ядро через две клетки. Схема: forward(2), dot(), forward(2)."
  },
  4: {
    goal: 'Выведи число шагов, забери 💎 и дойди до 🌀.',
    briefing: "§1.6: сохрани число в переменную, выведи её — и используй как расстояние. Настоящий Python считает: forward(steps - 1).",
    starter: 'steps = 4\nprint(steps)\nforward(1)\n',
    solution: 'steps = 4\nprint(steps)\nforward(1)\ndot()\nforward(steps - 1)',
    hint: "Намёк: print уже выводит 4. До портала от старта 4 клетки, но одну ты потратишь на ядро — значит вперёд на steps - 1."
  },
  5: {
    goal: 'Выведи имя, забери 💎 и дойди до 🌀.',
    briefing: "§2.1: у каждой переменной есть имя. Назови робота и представь его консоли — консоль это и есть твой отчёт.",
    starter: 'name = "Бип"\nprint(name)\nforward(1)\n',
    solution: 'name = "Бип"\nprint(name)\nforward(1)\ndot()\nforward(3)',
    hint: "Намёк: имя уже выводится. Ядро — через клетку, до портала потом ещё три шага."
  },
  6: {
    goal: "Собери 2 💎, посчитай их, дойди до 🌀.",
    briefing: "§2.3: переменную можно менять на ходу: crystals = crystals + 1. Считай ядра и выведи итог.",
    starter: 'crystals = 0\nforward(2)\n',
    solution: 'crystals = 0\nforward(2)\ndot()\ncrystals = crystals + 1\nforward(2)\ndot()\ncrystals = crystals + 1\nprint(crystals)\nforward(2)',
    hint: "Намёк: после каждого dot() прибавляй 1. В конце print(crystals) и два шага до портала."
  },
  7: {
    goal: "Обойди стену, выведи ответ сенсора.",
    briefing: "§2.2: датчик is_wall() отвечает True или False. Черепаха смотрит вправо, поэтому «прямо по курсу» — это is_wall(\"right\").",
    starter: 'forward(1)\nwall = is_wall("right")\nprint(wall)\n',
    solution: 'forward(1)\nwall = is_wall("right")\nprint(wall)\nif wall:\n    right(90)\n    forward(1)\nelse:\n    forward(1)\nleft(90)\nforward(3)\nleft(90)\nforward(1)',
    hint: "Намёк: прямо курс упёрся в стену — поверни направо (right(90)) и обойди её снизу. Потом развернись обратно: left(90)."
  },
  8: {
    goal: "Выведи имя типа, забери 💎 и дойди до 🌀.",
    briefing: "§2.4: строка \"4\" — не число. Преврати её в int(). Настоящий Python печатает тип как <class 'int'>, а короткое имя даёт type(n).__name__.",
    starter: 'n = "4"\nn = int(n)\nprint(type(n).__name__)\nforward(1)\n',
    solution: 'n = "4"\nn = int(n)\nprint(type(n).__name__)\nforward(1)\ndot()\nforward(3)',
    hint: "Намёк: type(n) даст <class 'int'>, а нужен просто int — бери type(n).__name__."
  },
  9: {
    goal: "Выведи энергию, удали переменную, забери 💎 и дойди до 🌀.",
    briefing: "§2.5: временная переменная больше не нужна — удали её через del. Сначала выведи энергию: energy().",
    starter: 'temp = energy()\nprint(temp)\ndel temp\nforward(1)\n',
    solution: 'temp = energy()\nprint(temp)\ndel temp\nforward(1)\ndot()\nforward(1)',
    hint: "Намёк: энергия уже выводится. Дальше шаг, dot(), шаг до портала."
  }
};

/* ---------- главы 3-4: арифметика на расстояниях, циклы по датчикам ---------- */
const CH34 = {
  10: {
    briefing: "§3.1: сначала умножение, потом сложение. Черепаха считает шаги настоящим Python — forward(n) берёт n из вычисления.",
    goal: "Выведи результат, забери 💎 и дойди до 🌀.",
    starter: 'print(7 + 3 * 2)\nforward(1)\n',
    solution: 'print(7 + 3 * 2)\nforward(1)\ndot()\nforward(1)',
    hint: "Намёк: 7 + 3 * 2 — сначала 3 * 2, потом сложение: будет 13. Дальше шаг, dot(), шаг до портала."
  },
  12: {
    briefing: "§3.1.3: // даёт целую часть от деления, % — остаток. Вместе они объясняют, на сколько заправок хватит топлива.",
    goal: "Выведи 3 и 1, забери 💎 и дойди до 🌀.",
    starter: 'fuel = 10\nper = 3\nprint(fuel // per)\nprint(fuel % per)\nforward(1)\n',
    solution: 'fuel = 10\nper = 3\nprint(fuel // per)\nprint(fuel % per)\nforward(1)\ndot()\nforward(1)',
    hint: "Намёк: 10 // 3 — это 3 полных заправки, 10 % 3 — остаток 1. Остальное — шаг, dot(), шаг."
  },
  13: {
    briefing: "§3.5-3.6: приоритет операций как в математике — умножение считается раньше сложения. Скобки меняют порядок.",
    goal: "Выведи 13, забери 💎, дойди до 🌀.",
    starter: 'print(2 + 3 * 4 - 1)\nforward(2)\n',
    solution: 'print(2 + 3 * 4 - 1)\nforward(2)\ndot()\nforward(2)',
    hint: "Намёк: сначала 3 * 4 = 12, потом 2 + 12 - 1 = 13. Ядро через две клетки, портал ещё через две."
  },
  14: {
    briefing: "§3.2: строки складываются знаком +, а len() считает символы. Число в кавычках — строка, даже если там цифры.",
    goal: "Выведи слово и длину, забери 💎 и дойди до 🌀.",
    starter: 'word = "Гри"\nprint(word + "д")\nprint(len(word))\nforward(1)\n',
    solution: 'word = "Гри"\nprint(word + "д")\nprint(len(word))\nforward(1)\ndot()\nforward(1)',
    hint: "Намёк: \"Гри\" + \"д\" даст \"Грид\", а len(\"Гри\") — 3. Потом шаг, dot(), шаг."
  },
  15: {
    briefing: "§3.3-3.4: есть сокращения +=, -=, *=, //= — они меняют переменную на месте. Читается как «прибавь и сохрани».",
    goal: "Выведи 16, забери 💎 и дойди до 🌀.",
    starter: 'x = 5\nx += 3\nx *= 2\nprint(x)\nforward(1)\n',
    solution: 'x = 5\nx += 3\nx *= 2\nprint(x)\nforward(1)\ndot()\nforward(3)',
    hint: "Намёк: 5 += 3 будет 8, потом 8 * 2 = 16. Дальше шаг, dot() и три шага до портала."
  },
  16: {
    goal: "Обойди стену и собрать 💎.",
    briefing: "§4.1: if/else — это развилка. Датчик is_wall() говорит, есть ли препятствие, и решает, куда идти. Помни: черепаха начинает лицом вправо.",
    starter: '# носом вправо: упрёмся в стену — обходим её снизу\nright(90)\nforward(1)\nleft(90)\n',
    solution: 'right(90)\nforward(2)\nleft(90)\nforward(2)\nif is_wall("up"):\n    forward(2)\nleft(90)\nforward(1)\nif is_crystal("here"):\n    dot()\nforward(1)\nright(90)\nforward(1)',
    hint: "Намёк: стена прямо по курсу — поверни направо (right(90)) и обойди её снизу. Потом развернись: left(90)."
  },
  17: {
    goal: "Пройди коридор циклом.",
    briefing: "§4.2.1: for повторяет тело цикла заданное число раз. Одна строка вместо семи — в этом и смысл алгоритма.",
    starter: '# цикл повторяет тело 7 раз\nfor i in range(7):\n    forward(1)\n',
    solution: 'for i in range(7):\n    forward(1)',
    hint: "Намёк: коридор из семи клеток, значит тело нужно повторить 7 раз. Цикл, а не семь строк подряд."
  },
  18: {
    goal: "Собери 💎 и дойди до 🌀.",
    briefing: "§4.2.2: while повторяет, пока условие истинно. Не знаешь, сколько шагов — спрашивай датчик: пока впереди не стена.",
    starter: '# спускаемся за кристаллом, потом ползём по нижнему коридору\nright(90)\nforward(1)\nleft(90)\n',
    solution: 'right(90)\nforward(1)\nleft(90)\nforward(1)\ndot()\nforward(1)\nright(90)\nforward(1)\nleft(90)\nwhile not is_wall("right"):\n    forward(1)\nleft(90)\nforward(2)',
    hint: "Намёк: дойди до кристалла внизу, потом развернись на юг, нызни в нижний коридор и ползи вправо, пока is_wall(\"right\") не станет правдой."
  },
  19: {
    goal: "Остановись у 💎 и дойди до 🌀.",
    briefing: "§4.2.3: break выходит из цикла раньше времени. Это удобно: идём вперёд, а как только нашли цель — останавливаемся.",
    starter: '# идём, пока кристалл не окажется впереди\nwhile True:\n    if is_crystal("right"):\n        break\n    forward(1)\n',
    solution: 'while True:\n    if is_crystal("right"):\n        break\n    forward(1)\nforward(1)\ndot()\nforward(2)',
    hint: "Намёк: while True с break — вечный цикл, который выходит сам. Иди вперёд, а как только is_crystal(\"right\") — break."
  },
  20: {
    goal: "Выведи 1–5 и дойди до 🌀.",
    briefing: "§4.2.4: range(a, b) берёт числа от a до b, не включая b. И это же число — количество повторов цикла.",
    starter: 'for i in range(1, 6):\n    print(i)\n    forward(1)\n',
    solution: 'for i in range(1, 6):\n    print(i)\n    forward(1)',
    hint: "Намёк: range(1, 6) даст 1, 2, 3, 4, 5 — пять шагов. Шестёрки в конце не будет: b не включается."
  },
  21: {
    goal: "Назови пароль, одолей стражу, дойди до 🌀.",
    briefing: "§4.4-4.5: строки можно сравнивать как ==, а условие в if решает, пускать ли дальше. На настоящей арене страж не спит.",
    solution: 'code = "py12"\nif code == "py12":\n    print("Доступ разрешён")',
    tail: true,
    hint: "Намёк: сравни code == \"py12\" и напечатай «Доступ разрешён». Вируса на пути сначала бей attack(), потом делай шаг."
  }
};

/* ---------- уровни, где старый движок вёл себя не как настоящий Python ----------
   Всё, что ниже, проверяется настоящим CPython: значения в random зависят
   от версии алгоритма, округление .5 — по правилу «к чётному», деление
   всегда даёт float, а собственных исключений без «class» не бывает. */
const TRUTH = {
  11: {
    goal: "Выведи оба ответа деления, забери 💎 и дойди до 🌀.",
    briefing: "§3.1.2: в настоящем Python / всегда даёт дробное число, даже если делится нацело. Целочисленное деление — это //.",
    solution: 's = 120\nv = 60\nprint(s / v)\nprint(s // v)',
    expect: ['["2.0", "2"]'],
    hint: "Намёк: 120 / 60 даст 2.0 — потому что / в Python всегда возвращает float. Для целого числа есть оператор //."
  },
  22: {
    goal: "Выведи имена типов и дойди до 🌀.",
    briefing: "§5.1: type(5) показывает <class 'int'>, а короткое имя типа — type(5).__name__. Разница видна сразу.",
    solution: 'print(type(5).__name__)\nprint(type(3.5).__name__)',
    hint: "Намёк: type(5) даст <class 'int'>. Короткое имя типа лежит в __name__."
  },
  23: {
    goal: "Выведи оба округления, дойди до 🌀.",
    briefing: "§5.2.1: Python округляет ровно .5 к чётному числу — round(2.5) даёт 2, а не 3. Это не ошибка, а правило: banker’s rounding.",
    solution: 'print(round(3.14159, 2))\nprint(round(2.5))',
    expect: ['["3.14", "2"]'],
    hint: "Намёк: в Python round(2.5) == 2 — половинки округляются к чётному. Не как в школьной тетрадке."
  },
  26: {
    goal: "Выведи выпавшее число и дойди до 🌀.",
    briefing: "§5.4: случайность в Python настоящая — модуль random. Чтобы число каждый раз было одно и то же, ставь зерно: random.seed(7).",
    starter: 'import random\nrandom.seed(7)\nn = random.randint(1, 6)\nprint(n)\n',
    solution: 'import random\nrandom.seed(7)\nn = random.randint(1, 6)\nprint(n)',
    expect: ['["3"]'],
    hint: "Намёк: import random, потом random.seed(7) и random.randint(1, 6). С зерном 7 выпадает 3 — всегда."
  },
  27: {
    goal: "Выведи оба чуда и дойди до 🌀.",
    briefing: "§5.5: настоящий Python не делит на ноль — он бросает ZeroDivisionError. Бесконечность и «не число» берутся из модуля math и float('nan').",
    starter: 'import math\nprint(math.inf)\n',
    solution: "import math\nprint(math.inf)\nprint(float('nan'))",
    expect: ['["inf", "nan"]'],
    hint: "Намёк: math.inf — бесконечность, float('nan') — «не число». А вот 1 / 0 в Python вызовет ошибку."
  },
  28: {
    goal: "Угадай число, дойди до 🌀.",
    briefing: "§5.7: загадай число через random с зерном и найди его перебором. while + break — обычный способ не зациклиться.",
    starter: 'import random\nrandom.seed(3)\nhidden = random.randint(1, 10)\n',
    solution: 'import random\nrandom.seed(3)\nhidden = random.randint(1, 10)\nguess = 0\nwhile guess != hidden:\n    guess = guess + 1\nprint("Угадал: " + str(guess))',
    expect: ['["Угадал: 4"]'],
    hint: "Намёк: с зерном 3 выпадает 4. Сравнивай guess != hidden в while и прибавляй по единице."
  },
  49: {
    goal: "Выведи первую карту, дойди до 🌀.",
    briefing: "§8.5: random.shuffle перемешивает список на месте. С зерном результат всегда один и тот же — его можно проверять.",
    starter: 'import random\nrandom.seed(5)\ndeck = [1, 2, 3, 4]\nrandom.shuffle(deck)\n',
    solution: 'import random\nrandom.seed(5)\ndeck = [1, 2, 3, 4]\nrandom.shuffle(deck)\nprint(deck[0])',
    expect: ['["1"]'],
    hint: "Намёк: random.seed(5), потом random.shuffle(deck). Первая карта получается 1."
  },
  56: {
    goal: "Выведи имена типов и дойди до 🌀.",
    briefing: "§9.10: кортеж и список — разные типы. type((1,)) даст <class 'tuple'>, а короткое имя — type((1,)).__name__.",
    solution: 'print(type((1,)).__name__)\nprint(type([1]).__name__)',
    hint: "Намёк: type печатает <class 'tuple'>. Короткое имя типа — через __name__."
  },
  59: {
    goal: "Выведи значение и имя типа, дойди до 🌀.",
    briefing: "§10.1: словарь хранит ключи и значения. Имя типа, как и раньше, достаётся через __name__.",
    solution: 'd = {"пилот": "Бип"}\nprint(d["пилот"])\nprint(type(d).__name__)',
    hint: "Намёк: type(d) даст <class 'dict'>, а нужен просто dict — бери type(d).__name__."
  },
  73: {
    goal: "Выведи доклад и дойди до 🌀.",
    briefing: "§13.3: своя ошибка — это обычный класс, который наследуется от Exception. Объяви его через class и бросай через raise.",
    starter: 'class Ошибка(Exception):\n    pass\n\ntry:\n    raise Ошибка("Перегрев")\nexcept Ошибка as e:\n    print("Авария: " + str(e))\n',
    solution: 'class Ошибка(Exception):\n    pass\n\ntry:\n    raise Ошибка("Перегрев")\nexcept Ошибка as e:\n    print("Авария: " + str(e))',
    hint: "Намёк: сначала class Ошибка(Exception): pass, потом try и raise Ошибка(\"Перегрев\"). В except ловишь as e и печатаешь str(e)."
  },
  75: {
    goal: "Выведи аварию, дойди до 🌀.",
    briefing: "§13.3: finally выполняется всегда — даже если в try что-то сломалось. Это надёжный способ доложить об аварии.",
    starter: 'class Авария(Exception):\n    pass\n\ntemp = 15\ntry:\n    if temp > 10:\n        raise Авария("Перегрев!")\nexcept Авария as e:\n    print(e)\n',
    solution: 'class Авария(Exception):\n    pass\n\ntemp = 15\ntry:\n    if temp > 10:\n        raise Авария("Перегрев!")\nexcept Авария as e:\n    print(e)',
    hint: "Намёк: ошибка — это класс class Авария(Exception). Внутри try бросаешь raise Авария(\"Перегрев!\"), а в except печатаешь e."
  }
};

/* Хвост для уровней, где суть — в print/строках: арена случайная, поэтому
   идём по датчикам, а не «на автопилоте». Черепаха стартует лицом вправо,
   поэтому вперёд — это forward(1). */
const TAIL = '\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    forward(1)\n    if is_crystal("here"):\n        dot()\nforward(1)';

/* На аренах с вирусами в коридоре нужен удар: иначе робот не пройдёт. */
const TAIL_ENEMY = '\n# арена новая и вирусы на пути — сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    forward(1)\n    if is_crystal("here"):\n        dot()\nforward(1)';

/* ---------- правка файла ---------- */
function findBlock(src, id) {
  /* переводы строк бывают и CRLF, и LF — ищем оба */
  const m = new RegExp("\\r?\\n  \\{\\r?\\n    id: " + id + ",").exec(src);
  if (!m) throw new Error("уровень " + id + " не найден");
  const start = m.index + 1;
  const next = src.indexOf("\n  {\n    id: ", start + 1);
  const next2 = src.indexOf("\r\n  {\r\n    id: ", start + 1);
  const ends = [next, next2].filter(x => x > 0);
  return { start, end: ends.length ? Math.min.apply(null, ends) : src.length };
}

/* ---------- разбор блока уровня ----------
   Значение поля ищем сканером, а не регуляркой: в коде уровня есть «[» внутри
   строк (deck = [1, 2, 3, 4]), и регулярка принимала его за конец массива. */
function skipString(s, i) {
  const q = s[i]; i++;
  while (i < s.length) {
    if (s[i] === "\\") { i += 2; continue; }
    if (s[i] === q) return i + 1;
    i++;
  }
  return i;
}

function valueEnd(s, i) {
  const c = s[i];
  if (c === '"' || c === "'") return skipString(s, i);
  if (c === "[" || c === "{") {
    const open = c, close = c === "[" ? "]" : "}";
    let depth = 0;
    while (i < s.length) {
      const ch = s[i];
      if (ch === '"' || ch === "'") { i = skipString(s, i); continue; }
      if (ch === open) depth++;
      else if (ch === close) { depth--; if (!depth) return i + 1; }
      i++;
    }
    return i;
  }
  /* простое значение: число, true/false, null — до запятой или перевода строки */
  let j = i;
  while (j < s.length && s[j] !== "," && s[j] !== "\n") j++;
  return j;
}

function replaceField(block, name, newLiteral) {
  const re = new RegExp("(?:^|[\\n,])\\s*" + name + "\\s*:\\s*");
  const m = re.exec(block);
  if (!m) throw new Error("поле " + name + " не найдено");
  const vStart = m.index + m[0].length;
  const vEnd = valueEnd(block, vStart);
  return block.slice(0, vStart) + newLiteral + block.slice(vEnd);
}

function hintsBlock(hint, code) {
  return "[\n      " + T(hint) + ",\n      " +
    T("Псевдокод:\n" + code) + ",\n      " + T("Решение:\n" + code) + "\n    ]";
}

function patchLevel(src, id, data) {
  const b = findBlock(src, id);
  let block = src.slice(b.start, b.end);
  /* уровни «про print» (таблица TRUTH) получают хвост с проходом арены:
     суть задачи в выводе, а дойти до портала всё равно надо */
  const needTail = data.tail !== undefined ? data.tail : (data.__tail === true);
  const tail = /gen:\s*"enemy"/.test(block) ? TAIL_ENEMY : TAIL;
  const code = needTail ? data.solution + tail : data.solution;
  block = replaceField(block, "solution", T(code));
  block = replaceField(block, "hints", hintsBlock(data.hint, code));
  if (data.starter) block = replaceField(block, "starter", T(needTail ? data.starter.replace(/\n+$/, "") + tail + "\n" : data.starter));
  if (data.goal) block = replaceField(block, "goal", T(data.goal));
  if (data.briefing) block = replaceField(block, "briefing", T(data.briefing));
  if (data.expect) block = replaceField(block, "expect", data.expect[0]);
  return src.slice(0, b.start) + block + src.slice(b.end);
}

const which = process.argv[2] || "9";
const TABLE = { CH1: CH1, ch34: CH34, truthful: TRUTH };
const tables = which === "all"
  ? [CH1, CH34, TRUTH]
  : [TABLE[which] || CH1];
const table = Object.assign.apply(null, tables);
/* в TRUTH суть уровня — вывод и типы, поэтому хвост с проходом арены нужен всем;
   в CH1 и CH34 уровень сам решается turtle-ходом */
const withTail = tables.indexOf(TRUTH) > -1;
/* в таблице TRUTH суть уровня — вывод и работа с типом, поэтому хвост с
   проходом арены нужен всем им; в CH1 уровень сам решается turtle-ходом */
Object.keys(table).forEach(function (k) {
  if (table[k].tail === undefined) table[k].tail = withTail && (k in TRUTH);
});
const ids = Object.keys(table).map(Number).sort((a, b) => a - b);

let src = fs.readFileSync(FILE, "utf8");
let n = 0;
for (const id of ids) {
  src = patchLevel(src, id, table[id]);
  n++;
}
fs.writeFileSync(FILE, src, "utf8");
console.log("обновлено уровней: " + n);