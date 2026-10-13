/* (c) 2026 NoNameUser00. All rights reserved. See LICENSE. */

/* � 2026 NoNameUser00. ��� ����� ��������. ��. LICENSE. */
/* Уровни PyTactics = учебник: глава → галактика, параграф → планета.
   Поля: book (§ учебника), expect (точные строки print для победы),
   biome/place (окружение), остальное как раньше.
   Карта: # стена, . пол, P игрок, E/R/D/B враги, C кристалл, H ячейка, X выход */
window.LEVELS = [
  // ---------- Глава 1. Первые программы ----------
  {
    id: 1, title: "Первая программа", topic: "print()", book: "1.1",
    briefing: "§1.1: первая программа выводит текст. Робот — это черепаха: она смотрит вправо, forward(n) ведёт её на n клеток, dot() берёт ядро под ногами.",
    lore: "Да пребудет с тобой Код. Маяк ждёт справа.",
    goal: "Выведи «Привет, Грид!», забери 💎 и дойди до 🌀.",
    map: ["#####", "#PCX#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Привет, Грид!"],
    starter: "print(\"Привет, Грид!\")\nforward(1)\n",
    hints: [
      "Намёк: черепаха смотрит вправо. forward(1) — шаг, dot() — взять ядро, потом ещё шаг до портала.",
      "Псевдокод:\nprint(\"Привет, Грид!\")\nforward(1)\ndot()\nforward(1)",
      "Решение:\nprint(\"Привет, Грид!\")\nforward(1)\ndot()\nforward(1)"
    ],
    solution: "print(\"Привет, Грид!\")\nforward(1)\ndot()\nforward(1)",
    starTurns: 3
  },
  {
    id: 2, hardcode: 6, title: "Структура программы", topic: "последовательность команд", book: "1.4",
    briefing: "§1.4: программа выполняется сверху вниз, строка за строкой. Идти можно сразу на несколько клеток: forward(4) — это четыре шага одной строкой.",
    lore: "Код идёт сверху вниз, как corridor. Шаг за шагом.",
    goal: "Пройди коридор и забери 💎.",
    map: ["########", "#PC...X#", "########"],
    energy: 20, maxTurns: 15,
    starter: "# Команды выполняются по порядку\nforward(1)\n",
    hints: [
      "Намёк: ядро на второй клетке. Один шаг, dot(), потом до портала — одной командой forward(4).",
      "Псевдокод:\nforward(1)\ndot()\nforward(4)",
      "Решение:\nforward(1)\ndot()\nforward(4)"
    ],
    solution: "forward(1)\ndot()\nforward(4)",
    starTurns: 6
  },
  {
    id: 3, title: "Комментарии", topic: "# комментарии", book: "1.5",
    briefing: "§1.5: строки с # черепаха не читает, а человек понимает. Подпиши каждый шаг — и код станет понятнее через полгода.",
    lore: "Мудрый оператор подписывает путь. Решётка # — чернила.",
    goal: "Собери 💎 и дойди до 🌀.",
    map: ["#######", "#P.C.X#", "#######"],
    energy: 20, maxTurns: 15,
    starter: "# Иди и забери кристалл\nforward(2)\n",
    hints: [
      "Намёк: ядро через две клетки. Схема: forward(2), dot(), forward(2).",
      "Псевдокод:\n# до ядра\nforward(2)\ndot()\n# до портала\nforward(2)",
      "Решение:\n# до ядра\nforward(2)\ndot()\n# до портала\nforward(2)"
    ],
    solution: "# до ядра\nforward(2)\ndot()\n# до портала\nforward(2)",
    starTurns: 5
  },
  {
    id: 4, title: "Вывод данных", topic: "print() и переменные", book: "1.6",
    briefing: "§1.6: сохрани число в переменную, выведи её — и используй как расстояние. Настоящий Python считает: forward(steps - 1).",
    lore: "Сначала посчитай, потом шагай.",
    goal: "Выведи число шагов, забери 💎 и дойди до 🌀.",
    map: ["#######", "#PC..X#", "#######"],
    energy: 20, maxTurns: 14, expect: ["4"],
    starter: "steps = 4\nprint(steps)\nforward(1)\n",
    hints: [
      "Намёк: print уже выводит 4. До портала от старта 4 клетки, но одну ты потратишь на ядро — значит вперёд на steps - 1.",
      "Псевдокод:\nsteps = 4\nprint(steps)\nforward(1)\ndot()\nforward(steps - 1)",
      "Решение:\nsteps = 4\nprint(steps)\nforward(1)\ndot()\nforward(steps - 1)"
    ],
    solution: "steps = 4\nprint(steps)\nforward(1)\ndot()\nforward(steps - 1)",
    starTurns: 5
  },
  // ---------- Глава 2. Переменные и типы ----------
  {
    id: 5, title: "Имена", topic: "переменные", book: "2.1",
    briefing: "§2.1: у каждой переменной есть имя. Назови робота и представь его консоли — консоль это и есть твой отчёт.",
    lore: "Безымянный робот — просто железо. Назови его.",
    goal: "Выведи имя, забери 💎 и дойди до 🌀.",
    map: ["#######", "#PC..X#", "#######"],
    energy: 20, maxTurns: 13, expect: ["Бип"],
    starter: "name = \"Бип\"\nprint(name)\nforward(1)\n",
    hints: [
      "Намёк: имя уже выводится. Ядро — через клетку, до портала потом ещё три шага.",
      "Псевдокод:\nname = \"Бип\"\nprint(name)\nforward(1)\ndot()\nforward(3)",
      "Решение:\nname = \"Бип\"\nprint(name)\nforward(1)\ndot()\nforward(3)"
    ],
    solution: "name = \"Бип\"\nprint(name)\nforward(1)\ndot()\nforward(3)",
    starTurns: 5
  },
  {
    id: 6, title: "Присваивание", topic: "= и счётчик", book: "2.3",
    briefing: "§2.3: переменную можно менять на ходу: crystals = crystals + 1. Считай ядра и выведи итог.",
    lore: "Считай ядра — Орден любит порядок.",
    goal: "Собери 2 💎, посчитай их, дойди до 🌀.",
    map: ["#########", "#P.C.C.X#", "#########"],
    energy: 20, maxTurns: 18, expect: ["2"],
    starter: "crystals = 0\nforward(2)\n",
    hints: [
      "Намёк: после каждого dot() прибавляй 1. В конце print(crystals) и два шага до портала.",
      "Псевдокод:\ncrystals = 0\nforward(2)\ndot()\ncrystals = crystals + 1\nforward(2)\ndot()\ncrystals = crystals + 1\nprint(crystals)\nforward(2)",
      "Решение:\ncrystals = 0\nforward(2)\ndot()\ncrystals = crystals + 1\nforward(2)\ndot()\ncrystals = crystals + 1\nprint(crystals)\nforward(2)"
    ],
    solution: "crystals = 0\nforward(2)\ndot()\ncrystals = crystals + 1\nforward(2)\ndot()\ncrystals = crystals + 1\nprint(crystals)\nforward(2)",
    starTurns: 8
  },
  {
    id: 7, title: "Типы", topic: "bool и сенсоры", book: "2.2",
    briefing: "§2.2: датчик is_wall() отвечает True или False. Черепаха смотрит вправо, поэтому «прямо по курсу» — это is_wall(\"right\").",
    lore: "Стена отвечает честно: True. Слушай её.",
    goal: "Обойди стену, выведи ответ сенсора.",
    map: ["#######", "#P.#.X#", "#.....#", "#######"],
    energy: 20, maxTurns: 16, expect: ["True"],
    starter: "forward(1)\nwall = is_wall(\"right\")\nprint(wall)\n",
    hints: [
      "Намёк: прямо курс упёрся в стену — поверни направо (right(90)) и обойди её снизу. Потом развернись обратно: left(90).",
      "Псевдокод:\nforward(1)\nwall = is_wall(\"right\")\nprint(wall)\nif wall:\n    right(90)\n    forward(1)\nelse:\n    forward(1)\nleft(90)\nforward(3)\nleft(90)\nforward(1)",
      "Решение:\nforward(1)\nwall = is_wall(\"right\")\nprint(wall)\nif wall:\n    right(90)\n    forward(1)\nelse:\n    forward(1)\nleft(90)\nforward(3)\nleft(90)\nforward(1)"
    ],
    solution: "forward(1)\nwall = is_wall(\"right\")\nprint(wall)\nif wall:\n    right(90)\n    forward(1)\nelse:\n    forward(1)\nleft(90)\nforward(3)\nleft(90)\nforward(1)",
    starTurns: 6
  },
  {
    id: 8, title: "Приведение типов", topic: "int() и type()", book: "2.4",
    briefing: "§2.4: строка \"4\" — не число. Преврати её в int(). Настоящий Python печатает тип как <class 'int'>, а короткое имя даёт type(n).__name__.",
    lore: "Слова — в числа. Магия приведения.",
    goal: "Выведи имя типа, забери 💎 и дойди до 🌀.",
    map: ["#######", "#PC..X#", "#######"],
    energy: 20, maxTurns: 14, expect: ["int"],
    starter: "n = \"4\"\nn = int(n)\nprint(type(n).__name__)\nforward(1)\n",
    hints: [
      "Намёк: type(n) даст <class 'int'>, а нужен просто int — бери type(n).__name__.",
      "Псевдокод:\nn = \"4\"\nn = int(n)\nprint(type(n).__name__)\nforward(1)\ndot()\nforward(3)",
      "Решение:\nn = \"4\"\nn = int(n)\nprint(type(n).__name__)\nforward(1)\ndot()\nforward(3)"
    ],
    solution: "n = \"4\"\nn = int(n)\nprint(type(n).__name__)\nforward(1)\ndot()\nforward(3)",
    starTurns: 5
  },
  {
    id: 9, title: "Удаление", topic: "del", book: "2.5",
    briefing: "§2.5: временная переменная больше не нужна — удали её через del. Сначала выведи энергию: energy().",
    lore: "Чистый код — чистый коридор.",
    goal: "Выведи энергию, удали переменную, забери 💎 и дойди до 🌀.",
    map: ["#####", "#PCX#", "#####"],
    energy: 20, maxTurns: 12, expect: ["20"],
    starter: "temp = energy()\nprint(temp)\ndel temp\nforward(1)\n",
    hints: [
      "Намёк: энергия уже выводится. Дальше шаг, dot(), шаг до портала.",
      "Псевдокод:\ntemp = energy()\nprint(temp)\ndel temp\nforward(1)\ndot()\nforward(1)",
      "Решение:\ntemp = energy()\nprint(temp)\ndel temp\nforward(1)\ndot()\nforward(1)"
    ],
    solution: "temp = energy()\nprint(temp)\ndel temp\nforward(1)\ndot()\nforward(1)",
    starTurns: 3
  },
  // ---------- Глава 3. Операторы ----------
  {
    id: 10, title: "Математика", topic: "+ - * /", book: "3.1",
    briefing: "§3.1: бортовой компьютер считает сам. Выведи 7 + 3 * 2 и иди к маяку.",
    lore: "Компьютер считает — оператор приказывает.",
    goal: 'Выведи результат, забери 💎 и дойди до 🌀.',
    map: ["#####", "#PCX#", "#####"],
    energy: 20, maxTurns: 12, expect: ["13"],
    starter: 'print(7 + 3 * 2)\nmove_right()\n',
    hints: [
      'Намёк: умножение раньше сложения: 13. На второй клетке кристалл — нужен collect().',
      'Псевдокод:\nprint(7 + 3 * 2)\nmove_right()\ncollect()\nmove_right()',
      'Решение:\nprint(7 + 3 * 2)\nmove_right()\ncollect()\nmove_right()'
    ],
    solution: 'print(7 + 3 * 2)\nmove_right()\ncollect()\nmove_right()',
    starTurns: 3
  },
  {
    id: 11, title: "Время в пути", topic: "деление", book: "3.1.2",
    briefing: "§3.1.2: в настоящем Python / всегда даёт дробное число, даже если делится нацело. Целочисленное деление — это //.",
    lore: "Сто двадцать парсеков? Нет — сто двадцать шагов пополам.",
    goal: "Выведи оба ответа деления, забери 💎 и дойди до 🌀.",
    map: ["#######", "#PC..X#", "#######"],
    energy: 20, maxTurns: 13, expect: ["2.0", "2"],
    starter: 's = 120\nv = 60\nt = s / v\nprint(t)\nmove_right()\n',
    hints: [
      "Намёк: 120 / 60 даст 2.0 — потому что / в Python всегда возвращает float. Для целого числа есть оператор //.",
      "Псевдокод:\ns = 120\nv = 60\nprint(s / v)\nprint(s // v)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
      "Решение:\ns = 120\nv = 60\nprint(s / v)\nprint(s // v)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)"
    ],
    solution: "s = 120\nv = 60\nprint(s / v)\nprint(s // v)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
    starTurns: 5
  },
  {
    id: 12, title: "Топливо", topic: "// и %", book: "3.1.3",
    briefing: "§3.1.3: бак 10, расход 3. Сколько полных баков и остаток? Выведи оба числа.",
    lore: "Считай баки, падаван.",
    goal: 'Выведи 3 и 1, забери 💎 и дойди до 🌀.',
    map: ["#####", "#PCX#", "#####"],
    energy: 20, maxTurns: 12, expect: ["3", "1"],
    starter: 'fuel = 10\nper = 3\nprint(fuel // per)\nprint(fuel % per)\nmove_right()\n',
    hints: [
      'Намёк: оба print уже есть. На второй клетке кристалл — добавь collect().',
      'Псевдокод:\nfuel = 10\nper = 3\nprint(fuel // per)\nprint(fuel % per)\nmove_right()\ncollect()\nmove_right()',
      'Решение:\nfuel = 10\nper = 3\nprint(fuel // per)\nprint(fuel % per)\nmove_right()\ncollect()\nmove_right()'
    ],
    solution: 'fuel = 10\nper = 3\nprint(fuel // per)\nprint(fuel % per)\nmove_right()\ncollect()\nmove_right()',
    starTurns: 3
  },
  {
    id: 13, title: "Калькулятор", topic: "приоритет операций", book: "3.5/3.6",
    briefing: "§3.5–3.6: собери калькулятор — посчитай 2 + 3 * 4 − 1, забери ядро по пути.",
    lore: "Приоритет — как приказы: сначала важные.",
    goal: "Выведи 13, забери 💎, дойди до 🌀.",
    map: ["#######", "#P.C.X#", "#######"],
    energy: 20, maxTurns: 15, expect: ["13"],
    starter: 'print(2 + 3 * 4 - 1)\nmove_right()\nmove_right()\ncollect()\n',
    hints: [
      "Намёк: 2+12−1=13. После ядра — ещё два шага.",
      "Псевдокод: print + шаги + collect + 2 шага.",
      "Решение:\nprint(2 + 3 * 4 - 1)\nmove_right()\nmove_right()\ncollect()\nmove_right()\nmove_right()"
    ],
    solution: 'print(2 + 3 * 4 - 1)\nmove_right()\nmove_right()\ncollect()\nmove_right()\nmove_right()',
    starTurns: 5
  },
  {
    id: 14, title: "Строки", topic: "str и len()", book: "3.2",
    briefing: "§3.2: строки склеиваются через +. Собери слово «Грид» и измерь его длину.",
    lore: "Слова — тоже детали. Склеивай аккуратно.",
    goal: 'Выведи слово и длину, забери 💎 и дойди до 🌀.',
    map: ["#####", "#PCX#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Грид", "3"],
    starter: 'word = "Гри"\nprint(word + "д")\nprint(len(word))\nmove_right()\n',
    hints: [
      'Намёк: длина «Гри» — 3. На второй клетке кристалл — добавь collect().',
      'Псевдокод:\nword = "Гри"\nprint(word + "д")\nprint(len(word))\nmove_right()\ncollect()\nmove_right()',
      'Решение:\nword = "Гри"\nprint(word + "д")\nprint(len(word))\nmove_right()\ncollect()\nmove_right()'
    ],
    solution: 'word = "Гри"\nprint(word + "д")\nprint(len(word))\nmove_right()\ncollect()\nmove_right()',
    starTurns: 3
  },
  {
    id: 15, title: "Хитрые присваивания", topic: "+= *= //=", book: "3.3/3.4",
    briefing: "§3.3–3.4: x += 3 короче, чем x = x + 3. Разгони x с 5 до 16.",
    lore: "Короткий код — быстрый клинок.",
    goal: 'Выведи 16, забери 💎 и дойди до 🌀.',
    map: ["#######", "#PC..X#", "#######"],
    energy: 20, maxTurns: 13, expect: ["16"],
    starter: 'x = 5\nx += 3\nx *= 2\nprint(x)\nmove_right()\n',
    hints: [
      'Намёк: 5+3=8, 8×2=16. На второй клетке кристалл — добавь collect().',
      'Псевдокод:\nx = 5\nx += 3\nx *= 2\nprint(x)\nmove_right()\ncollect()\nmove_right()\nmove_right()\nmove_right()',
      'Решение:\nx = 5\nx += 3\nx *= 2\nprint(x)\nmove_right()\ncollect()\nmove_right()\nmove_right()\nmove_right()'
    ],
    solution: 'x = 5\nx += 3\nx *= 2\nprint(x)\nmove_right()\ncollect()\nmove_right()\nmove_right()\nmove_right()',
    starTurns: 5
  },
  // ---------- Глава 4. Циклы и условные операторы ----------
  {
    id: 16, title: "Ветвление", topic: "if / else", book: "4.1",
    briefing: "§4.1: впереди завал. Сенсор is_wall() говорит True/False. Если стена — вниз, иначе — вправо.",
    lore: "Думай, как стена, — и обойдёшь её.",
    goal: "Обойди стену и собери 💎.",
    map: ["########", "#P.#..X#", "#..#.C.#", "#.....##", "########"],
    energy: 30, maxTurns: 22,
    starter: '# Используй if / else\nif is_wall("right"):\n    move_down()\nelse:\n    move_right()\n',
    hints: [
      'Намёк: сначала вниз, потом проверь is_wall("up") — по прямой сверху стена, значит путь уходит вправо. Вверх на кристалл — и собери его, только если is_crystal("here").',
      'Псевдокод:\nmove_down()\nmove_down()\nmove_right()\nmove_right()\n# прямо над нами стена — значит, идём вправо\nif is_wall("up"):\n    move_right()\n    move_right()\nmove_up()\nif is_crystal("here"):\n    collect()\nmove_up()\nmove_right()',
      'Решение:\nmove_down()\nmove_down()\nmove_right()\nmove_right()\n# прямо над нами стена — значит, идём вправо\nif is_wall("up"):\n    move_right()\n    move_right()\nmove_up()\nif is_crystal("here"):\n    collect()\nmove_up()\nmove_right()'
    ],
    solution: 'move_down()\nmove_down()\nmove_right()\nmove_right()\n# прямо над нами стена — значит, идём вправо\nif is_wall("up"):\n    move_right()\n    move_right()\nmove_up()\nif is_crystal("here"):\n    collect()\nmove_up()\nmove_right()',
    starTurns: 10
  },
  {
    id: 17, title: "Цикл for", topic: "for i in range()", book: "4.2.1",
    briefing: "§4.2.1: коридор из 7 клеток. Писать 7 строк скучно — пусть повторит цикл.",
    lore: "Операторы не повторяют — они циклуют.",
    goal: "Пройди коридор циклом.",
    map: ["##########", "#P......X#", "##########"],
    energy: 20, maxTurns: 17,
    starter: '# Цикл повторяет тело 7 раз\nfor i in range(7):\n    move_right()\n',
    hints: [
      "Намёк: стартовый код уже решает уровень. Жми запуск!",
      "Псевдокод:\nfor i in range(7):\n    move_right()",
      "Решение:\nfor i in range(7):\n    move_right()"
    ],
    solution: 'for i in range(7):\n    move_right()',
    starTurns: 7
  },
  {
    id: 18, title: "Цикл while", topic: "while и сенсоры", book: "4.2.2",
    briefing: "§4.2.2: выход далеко. Сначала забери ядро, потом обойди колонну низом через Барханы.",
    lore: "Считай ходы, или блуждать вечно.",
    goal: "Собери 💎 и дойди до 🌀.",
    map: ["#########", "#P..#..X#", "#.C.#.#.#", "#.......#", "#########"],
    energy: 40, maxTurns: 25, biome: "desert", place: "Барханы",
    starter: '# Спустись за кристаллом, потом обойди стену низом\nmove_down()\nmove_right()\ncollect()\n',
    hints: [
      'Намёк: while работает, пока условие верно. Внизу справа будет стена — значит крутим цикл, пока is_wall("right") == False, потом дважды вверх.',
      'Псевдокод:\nmove_down()\nmove_right()\ncollect()\nmove_right()\nmove_down()\n# ползём вправо, пока не упрёмся в стену\nwhile not is_wall("right"):\n    move_right()\nmove_up()\nmove_up()',
      'Решение:\nmove_down()\nmove_right()\ncollect()\nmove_right()\nmove_down()\n# ползём вправо, пока не упрёмся в стену\nwhile not is_wall("right"):\n    move_right()\nmove_up()\nmove_up()'
    ],
    solution: 'move_down()\nmove_right()\ncollect()\nmove_right()\nmove_down()\n# ползём вправо, пока не упрёмся в стену\nwhile not is_wall("right"):\n    move_right()\nmove_up()\nmove_up()',
    starTurns: 11
  },
  {
    id: 19, title: "Прерви цикл", topic: "break", book: "4.2.3",
    briefing: "§4.2.3: иди, пока впереди нет ядра. Увидел — break, забери и иди к выходу.",
    lore: "Умей останавливаться. Даже циклу нужен конец.",
    goal: "Остановись у 💎 и дойди до 🌀.",
    map: ["#########", "#P...C.X#", "#########"],
    energy: 20, maxTurns: 17, biome: "ice", place: "Ледяной пояс",
    starter: 'while True:\n    if is_crystal("right"):\n        break\n    move_right()\nmove_right()\ncollect()\n',
    hints: [
      "Намёк: цикл останавливается у ядра. Шагни на него, забери и сделай два финальных шага.",
      "Псевдокод: цикл + шаг + collect() + 2× move_right().",
      "Решение:\nwhile True:\n    if is_crystal(\"right\"):\n        break\n    move_right()\nmove_right()\ncollect()\nmove_right()\nmove_right()"
    ],
    solution: 'while True:\n    if is_crystal("right"):\n        break\n    move_right()\nmove_right()\ncollect()\nmove_right()\nmove_right()',
    starTurns: 7
  },
  {
    id: 20, title: "Шаг диапазона", topic: "range(a, b)", book: "4.2.4",
    briefing: "§4.2.4: range умеет начинать не с нуля: range(1, 6) даёт 1, 2, 3, 4, 5. Выведи их и пройди.",
    lore: "Диапазон — как маршрут: начало и конец.",
    goal: "Выведи 1–5 и дойди до 🌀.",
    map: ["########", "#P....X#", "########"],
    energy: 20, maxTurns: 15, expect: ["1", "2", "3", "4", "5"],
    starter: 'for i in range(1, 6):\n    print(i)\n    move_right()\n',
    hints: [
      "Намёк: стартовый код уже решает уровень. Жми запуск!",
      "Псевдокод:\nfor i in range(1, 6):\n    print(i)\n    move_right()",
      "Решение:\nfor i in range(1, 6):\n    print(i)\n    move_right()"
    ],
    solution: 'for i in range(1, 6):\n    print(i)\n    move_right()',
    starTurns: 5
  },
  {
    id: 21, gen: "enemy", title: "Уровень доступа", topic: "сравнение строк", book: "4.4/4.5",
    briefing: "§4.4–4.5 из учебника: программа «Уровень доступа» пускает только с верным паролем. Пароль «py12», а маяк охраняет штурмовик.",
    lore: "Доступ есть. Но маяк охраняют. Да пребудет с тобой Код.",
    goal: "Назови пароль, одолей стражу, дойди до 🌀.",
    map: ["#######", "#P.E.X#", "#######"],
    energy: 20, maxTurns: 14, expect: ["Доступ разрешён"],
    starter: 'code = "py12"\nif code == "py12":\n    print("Доступ разрешён")\nmove_right()\nattack("right")\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый, а вирус перекрывает путь. Нужен цикл: увидел вируса — attack(), встал на кристалл — collect(), иначе шаг.',
      'Псевдокод:\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ncode = "py12"\nif code == "py12":\n    print("Доступ разрешён")\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'code = "py12"\nif code == "py12":\n    print("Доступ разрешён")\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 5
  },
  // ---------- Глава 5. Математические функции ----------
  {
    id: 22, gen: "flat", title: "Типы чисел", topic: "int и float", book: "5.1",
    briefing: "§5.1: type(5) показывает <class 'int'>, а короткое имя типа — type(5).__name__. Разница видна сразу.",
    lore: "Числа — тоже Сила. Целые и дробные.",
    goal: "Выведи имена типов и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["int", "float"],
    starter: 'print(type(5))\nprint(type(3.5))\nmove_right()\n',
    hints: [
      "Намёк: type(5) даст <class 'int'>. Короткое имя типа лежит в __name__.",
      "Псевдокод:\nprint(type(5).__name__)\nprint(type(3.5).__name__)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
      "Решение:\nprint(type(5).__name__)\nprint(type(3.5).__name__)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)"
    ],
    solution: "print(type(5).__name__)\nprint(type(3.5).__name__)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
    starTurns: 2
  },
  {
    id: 23, gen: "flat", title: "Округление", topic: "round()", book: "5.2.1",
    briefing: "§5.2.1: Python округляет ровно .5 к чётному числу — round(2.5) даёт 2, а не 3. Это не ошибка, а правило: banker’s rounding.",
    lore: "Округляй точно, как прицел.",
    goal: "Выведи оба округления, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["3.14", "2"],
    starter: 'print(round(3.14159, 2))\nprint(round(2.5))\nmove_right()\n',
    hints: [
      "Намёк: в Python round(2.5) == 2 — половинки округляются к чётному. Не как в школьной тетрадке.",
      "Псевдокод:\nprint(round(3.14159, 2))\nprint(round(2.5))\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
      "Решение:\nprint(round(3.14159, 2))\nprint(round(2.5))\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)"
    ],
    solution: "print(round(3.14159, 2))\nprint(round(2.5))\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
    starTurns: 2
  },
  {
    id: 24, gen: "flat", title: "Красивый вывод", topic: "форматирование чисел", book: "5.2.2",
    briefing: "§5.2.2: числа для вывода готовят заранее. Выведи 7/2 и 10/3 в двух знаках.",
    lore: "Красивый вывод — вежливость оператора.",
    goal: "Выведи 3.5 и 3.33, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["3.5", "3.33"],
    starter: 'a = 7\nb = 2\nprint(a / b)\nprint(round(10 / 3, 2))\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\na = 7\nb = 2\nprint(a / b)\nprint(round(10 / 3, 2))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'a = 7\nb = 2\nprint(a / b)\nprint(round(10 / 3, 2))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 25, gen: "flat", title: "Арсенал", topic: "abs/max/степень", book: "5.3",
    briefing: "§5.3: модуль, максимум и степень — штатный арсенал. Выведи 7, 9 и 1024.",
    lore: "Модуль, максимум, степень. Арсенал растёт.",
    goal: "Выведи три числа и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["7", "9", "1024"],
    starter: 'print(abs(0 - 7))\nprint(max(3, 9, 4))\nprint(2 ** 10)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nprint(abs(0 - 7))\nprint(max(3, 9, 4))\nprint(2 ** 10)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'print(abs(0 - 7))\nprint(max(3, 9, 4))\nprint(2 ** 10)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 26, gen: "flat", title: "Генератор", topic: "seed() и randint()", book: "5.4",
    briefing: "§5.4: случайность в Python настоящая — модуль random. Чтобы число каждый раз было одно и то же, ставь зерно: random.seed(7).",
    lore: "Случайность можно приручить. Зерно решает.",
    goal: "Выведи выпавшее число и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["3"],
    starter: "import random\nrandom.seed(7)\nn = random.randint(1, 6)\nprint(n)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)\n",
    hints: [
      "Намёк: import random, потом random.seed(7) и random.randint(1, 6). С зерном 7 выпадает 3 — всегда.",
      "Псевдокод:\nimport random\nrandom.seed(7)\nn = random.randint(1, 6)\nprint(n)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
      "Решение:\nimport random\nrandom.seed(7)\nn = random.randint(1, 6)\nprint(n)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)"
    ],
    solution: "import random\nrandom.seed(7)\nn = random.randint(1, 6)\nprint(n)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
    starTurns: 2
  },
  {
    id: 27, gen: "flat", title: "За гранью", topic: "Infinity и NaN", book: "5.5",
    briefing: "§5.5: настоящий Python не делит на ноль — он бросает ZeroDivisionError. Бесконечность и «не число» берутся из модуля math и float('nan').",
    lore: "Делить на ноль? В Гриде бывает и такое.",
    goal: "Выведи оба чуда и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["inf", "nan"],
    starter: "import math\nprint(math.inf)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)\n",
    hints: [
      "Намёк: math.inf — бесконечность, float('nan') — «не число». А вот 1 / 0 в Python вызовет ошибку.",
      "Псевдокод:\nimport math\nprint(math.inf)\nprint(float('nan'))\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
      "Решение:\nimport math\nprint(math.inf)\nprint(float('nan'))\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)"
    ],
    solution: "import math\nprint(math.inf)\nprint(float('nan'))\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
    starTurns: 2
  },
  {
    id: 28, gen: "enemy", title: "Угадай число", topic: "мини-босс §5.7", book: "5.7",
    briefing: "§5.7: загадай число через random с зерном и найди его перебором. while + break — обычный способ не зациклиться.",
    lore: "Угадай число Владыки. Десять попыток — и ни одной лишней.",
    goal: "Угадай число, дойди до 🌀.",
    map: ["########", "#P.E..X#", "########"],
    energy: 20, maxTurns: 16, expect: ["Угадал: 4"], biome: "deathstar", place: "Узел Роя",
    starter: "import random\nrandom.seed(3)\nhidden = random.randint(1, 10)\n# арена новая и вирусы на пути — сначала удар, потом шаг\nwhile not is_exit(\"right\"):\n    if is_enemy(\"right\"):\n        attack(\"right\")\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)\n",
    hints: [
      "Намёк: с зерном 3 выпадает 4. Сравнивай guess != hidden в while и прибавляй по единице.",
      "Псевдокод:\nimport random\nrandom.seed(3)\nhidden = random.randint(1, 10)\nguess = 0\nwhile guess != hidden:\n    guess = guess + 1\nprint(\"Угадал: \" + str(guess))\n# арена новая и вирусы на пути — сначала удар, потом шаг\nwhile not is_exit(\"right\"):\n    if is_enemy(\"right\"):\n        attack(\"right\")\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
      "Решение:\nimport random\nrandom.seed(3)\nhidden = random.randint(1, 10)\nguess = 0\nwhile guess != hidden:\n    guess = guess + 1\nprint(\"Угадал: \" + str(guess))\n# арена новая и вирусы на пути — сначала удар, потом шаг\nwhile not is_exit(\"right\"):\n    if is_enemy(\"right\"):\n        attack(\"right\")\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)"
    ],
    solution: "import random\nrandom.seed(3)\nhidden = random.randint(1, 10)\nguess = 0\nwhile guess != hidden:\n    guess = guess + 1\nprint(\"Угадал: \" + str(guess))\n# арена новая и вирусы на пути — сначала удар, потом шаг\nwhile not is_exit(\"right\"):\n    if is_enemy(\"right\"):\n        attack(\"right\")\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
    starTurns: 7
  },
  // ---------- Глава 6. Строки ----------
  {
    id: 29, gen: "flat", title: "Кавычки", topic: "строки", book: "6.1",
    briefing: "§6.1: строка живёт в кавычках. Выведи фразу с кавычками внутри и иди.",
    lore: "Кавычки — как створки шлема: держат слова.",
    goal: "Выведи фразу и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ['Он сказал "Вперёд!"'],
    starter: 'print(\'Он сказал "Вперёд!"\')\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nprint(\'Он сказал "Вперёд!"\')\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'print(\'Он сказал "Вперёд!"\')\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 30, gen: "flat", title: "Новая строка", topic: "спецсимвол \\n", book: "6.4",
    briefing: "§6.4: символ \\n переносит строку. Выведи две строки одним print.",
    lore: "Новая строка — новый коридор.",
    goal: "Выведи две строки и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Строка1\nСтрока2"],
    starter: 'print("Строка1\\nСтрока2")\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nprint("Строка1\\nСтрока2")\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'print("Строка1\\nСтрока2")\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 31, gen: "flat", title: "Символы", topic: "индекс s[i]", book: "6.5.1",
    briefing: "§6.5.1: символы нумеруются с нуля. Собери слово из 1-го и 4-го символов «Грид».",
    lore: "Первый символ — как первый шаг: с нуля.",
    goal: "Выведи «Гд» и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Гд"],
    starter: 'word = "Грид"\nprint(word[0] + word[3])\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nword = "Грид"\nprint(word[0] + word[3])\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'word = "Грид"\nprint(word[0] + word[3])\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 32, gen: "flat", title: "Срез", topic: "срез s[a:b]", book: "6.5.2",
    briefing: "§6.5.2: срез берёт кусок: word[0:5] — первые пять символов. Вырежь «Маяки».",
    lore: "Срез точен, как лазер.",
    goal: "Выведи «Маяки» и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Маяки"],
    starter: 'word = "Маяки горят"\nprint(word[0:5])\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nword = "Маяки горят"\nprint(word[0:5])\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'word = "Маяки горят"\nprint(word[0:5])\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 33, gen: "flat", title: "Склейка и повтор", topic: "конкатенация и *", book: "6.5.3/6.5.5",
    briefing: "§6.5.3 и §6.5.5: строки склеиваются через +, а умножаются — в повтор. Три «Ха» и «Код!».",
    lore: "Повторяй. Умножай. Побеждай.",
    goal: "Выведи оба слова и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["ХаХаХа", "Код!"],
    starter: 'print("Ха" * 3)\nprint("Код" + "!")\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nprint("Ха" * 3)\nprint("Код" + "!")\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'print("Ха" * 3)\nprint("Код" + "!")\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 34, gen: "flat", title: "Поиск в строке", topic: "in и isalpha()", book: "6.5.4/6.10",
    briefing: "§6.5.4 и §6.10: проверь, есть ли «я» в слове «маяк», и все ли символы — буквы.",
    lore: "Ищи знак в строке, как друга в толпе.",
    goal: "Выведи два True и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["True", "True"],
    starter: 's = "маяк"\nprint("я" in s)\nprint(s.isalpha())\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ns = "маяк"\nprint("я" in s)\nprint(s.isalpha())\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 's = "маяк"\nprint("я" in s)\nprint(s.isalpha())\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 35, gen: "flat", title: "Регистр", topic: "upper()/lower()", book: "6.7/6.9",
    briefing: "§6.7 и §6.9: приказы пишут капсом. Подними «маяк» в верхний регистр, опусти «роЙ».",
    lore: "Большие буквы — для приказов.",
    goal: "Выведи оба слова и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["МАЯК", "рой"],
    starter: 's = "  маяк  "\nprint(s.strip().upper())\nprint("роЙ".lower())\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ns = "  маяк  "\nprint(s.strip().upper())\nprint("роЙ".lower())\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 's = "  маяк  "\nprint(s.strip().upper())\nprint("роЙ".lower())\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 36, gen: "enemy", title: "Шифр Владыки", topic: "босс: ord()/chr()", book: "6.11",
    briefing: "§6.11 из учебника: Владыка шифрует приказы сдвигом на 1 (Цезарь). Расшифруй «Лпе», одолей стражу.",
    lore: "Шифр Владыки. Ключ — единица. Да пребудет с тобой Код.",
    goal: "Расшифруй слово, одолей стражу, дойди до 🌀.",
    map: ["########", "#P.E..X#", "########"],
    energy: 20, maxTurns: 16, expect: ["Код"], biome: "lava", place: "Пепел Роя",
    starter: 'coded = "Лпе"\nkey = 1\nresult = ""\nfor i in range(len(coded)):\n    result = result + chr(ord(coded[i]) - key)\nprint(result)\nmove_right()\nattack("right")\n',
    hints: [
      'Намёк: коридор каждый раз новый, а вирус перекрывает путь. Нужен цикл: увидел вируса — attack(), встал на кристалл — collect(), иначе шаг.',
      'Псевдокод:\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ncoded = "Лпе"\nkey = 1\nresult = ""\nfor i in range(len(coded)):\n    result = result + chr(ord(coded[i]) - key)\nprint(result)\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'coded = "Лпе"\nkey = 1\nresult = ""\nfor i in range(len(coded)):\n    result = result + chr(ord(coded[i]) - key)\nprint(result)\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 6
  },
  // ---------- Глава 7. Шаблоны (ручные регулярки) ----------
  {
    id: 37, gen: "flat", title: "Найди знак", topic: "find()", book: "7.1/7.3",
    briefing: "§7.1 и §7.3: поиск — первый шаблон. Найди позицию «я» в слове «маяк».",
    lore: "Ищи знак — найдёшь путь.",
    goal: "Выведи позицию и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["2"],
    starter: 's = "маяк"\nprint(s.find("я"))\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ns = "маяк"\nprint(s.find("я"))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 's = "маяк"\nprint(s.find("я"))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 38, gen: "flat", title: "Начало и поиск", topic: "startswith() и in", book: "7.3",
    briefing: "§7.3: match смотрит в начало, search — везде. Проверь слово «маяк» обоими.",
    lore: "Начало важно. Остальное — тоже.",
    goal: "Выведи два True и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["True", "True"],
    starter: 's = "маяк"\nprint(s.startswith("ма"))\nprint("я" in s)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ns = "маяк"\nprint(s.startswith("ма"))\nprint("я" in s)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 's = "маяк"\nprint(s.startswith("ма"))\nprint("я" in s)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 39, gen: "flat", title: "Считалка", topic: "findall вручную", book: "7.4",
    briefing: "§7.4: findall собирает все совпадения. Собери вручную: посчитай «а» в «Барабан» циклом.",
    lore: "Считай совпадения — побеждай.",
    goal: "Выведи 3 и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["3"],
    starter: 's = "Барабан"\nn = 0\nfor i in range(len(s)):\n    if s[i] == "а":\n        n = n + 1\nprint(n)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ns = "Барабан"\nn = 0\nfor i in range(len(s)):\n    if s[i] == "а":\n        n = n + 1\nprint(n)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 's = "Барабан"\nn = 0\nfor i in range(len(s)):\n    if s[i] == "а":\n        n = n + 1\nprint(n)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 40, gen: "flat", title: "Замена", topic: "sub вручную: replace()", book: "7.5/7.6.6",
    briefing: "§7.5 и §7.6.6: sub меняет текст. Успокой Рой и вычисти мусор из слова.",
    lore: "Меняй текст — меняй мир.",
    goal: "Выведи оба слова и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Рой молчит", "мусор"],
    starter: 'print("Рой гудит".replace("гудит", "молчит"))\nprint("м-у-с-о-р".replace("-", ""))\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nprint("Рой гудит".replace("гудит", "молчит"))\nprint("м-у-с-о-р".replace("-", ""))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'print("Рой гудит".replace("гудит", "молчит"))\nprint("м-у-с-о-р".replace("-", ""))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 41, gen: "flat", title: "Маска", topic: "шаблон *.txt", book: "7.6.1/7.6.2",
    briefing: "§7.6.1–7.6.2: маска «rep*.txt» — начало «rep» и конец «.txt». Проверь файл.",
    lore: "Маска видит суть файла.",
    goal: "Выведи два True и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["True", "True"],
    starter: 'name = "report.txt"\nprint(name.startswith("rep"))\nprint(name.endswith(".txt"))\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nname = "report.txt"\nprint(name.startswith("rep"))\nprint(name.endswith(".txt"))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'name = "report.txt"\nprint(name.startswith("rep"))\nprint(name.endswith(".txt"))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 42, gen: "enemy", title: "Патруль шаблонов", topic: "босс: три проверки", book: "7.6.4/7.6.5",
    briefing: "§7.6.4–7.6.5: патруль пропустит только «.py»-файлы. Проверь три имени, одолей стражу.",
    lore: "Шаблон не врёт. Штурмовик — тем более.",
    goal: "Проверь имена, одолей стражу, дойди до 🌀.",
    map: ["########", "#P.E..X#", "########"],
    energy: 20, maxTurns: 16, expect: ["True", "False", "True"], biome: "ice", place: "Ледяной архив",
    starter: 'a = "bot.py"\nb = "bot.txt"\nc = "run.py"\nprint(a.endswith(".py"))\nprint(b.endswith(".py"))\nprint(c.endswith(".py"))\nmove_right()\nattack("right")\n',
    hints: [
      'Намёк: коридор каждый раз новый, а вирус перекрывает путь. Нужен цикл: увидел вируса — attack(), встал на кристалл — collect(), иначе шаг.',
      'Псевдокод:\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\na = "bot.py"\nb = "bot.txt"\nc = "run.py"\nprint(a.endswith(".py"))\nprint(b.endswith(".py"))\nprint(c.endswith(".py"))\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'a = "bot.py"\nb = "bot.txt"\nc = "run.py"\nprint(a.endswith(".py"))\nprint(b.endswith(".py"))\nprint(c.endswith(".py"))\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 6
  },
  // ---------- Глава 8. Списки ----------
  {
    id: 43, gen: "flat", title: "Первый список", topic: "литерал []", book: "8.1",
    briefing: "§8.1: список — шеренга значений в скобках. Построй шеренгу и покажи её.",
    lore: "Шеренга в скобках. Ровно, как штурмовики. Только наши.",
    goal: "Выведи список и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["[3, 1, 2]"],
    starter: 'nums = [3, 1, 2]\nprint(nums)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nnums = [3, 1, 2]\nprint(nums)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'nums = [3, 1, 2]\nprint(nums)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 44, gen: "flat", title: "Обход", topic: "for x in список", book: "8.4",
    briefing: "§8.4: цикл идёт по элементам сам: for x in [1, 2, 3]. Сложи всё в сумму.",
    lore: "Обойди всех. Сложи всех.",
    goal: "Выведи 6 и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["6"],
    starter: 's = 0\nfor x in [1, 2, 3]:\n    s = s + x\nprint(s)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ns = 0\nfor x in [1, 2, 3]:\n    s = s + x\nprint(s)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 's = 0\nfor x in [1, 2, 3]:\n    s = s + x\nprint(s)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 45, gen: "flat", title: "Досмотр", topic: "in и индекс", book: "8.5",
    briefing: "§8.5: проверь, есть ли «b» в шеренге, и назови второй элемент.",
    lore: "Досмотр на входе. Кто в списке?",
    goal: "Выведи True и b, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["True", "b"],
    starter: 'lst = ["a", "b", "c"]\nprint("b" in lst)\nprint(lst[1])\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nlst = ["a", "b", "c"]\nprint("b" in lst)\nprint(lst[1])\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'lst = ["a", "b", "c"]\nprint("b" in lst)\nprint(lst[1])\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 46, gen: "flat", title: "Стройся", topic: "append() и del", book: "8.6",
    briefing: "§8.6: append ставит в конец, del убирает по номеру. Из [1, 2] сделай [2, 3].",
    lore: "Перестрой шеренгу: в конец — встань, первый — вон.",
    goal: "Выведи [2, 3] и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["[2, 3]"],
    starter: 'a = [1, 2]\na.append(3)\ndel a[0]\nprint(a)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\na = [1, 2]\na.append(3)\ndel a[0]\nprint(a)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'a = [1, 2]\na.append(3)\ndel a[0]\nprint(a)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 47, gen: "flat", title: "Сортировка", topic: "sort()", book: "8.8",
    briefing: "§8.8: sort() ставит по возрастанию — по-настоящему, не как попало. Упорядочи [30, 4, 200].",
    lore: "Порядок бьёт хаос.",
    goal: "Выведи [4, 30, 200] и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["[4, 30, 200]"],
    starter: 'a = [30, 4, 200]\na.sort()\nprint(a)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\na = [30, 4, 200]\na.sort()\nprint(a)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'a = [30, 4, 200]\na.sort()\nprint(a)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 48, gen: "flat", title: "В строку", topic: "join()", book: "8.9",
    briefing: "§8.9: join склеивает шеренгу в строку через разделитель. Собери девиз.",
    lore: "Шеренга — в слово. Слово — в девиз.",
    goal: "Выведи девиз и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Да пребудет Код"],
    starter: 'words = ["Да", "пребудет", "Код"]\nprint(" ".join(words))\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nwords = ["Да", "пребудет", "Код"]\nprint(" ".join(words))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'words = ["Да", "пребудет", "Код"]\nprint(" ".join(words))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 49, gen: "flat", title: "Тас", topic: "shuffle() с зерном", book: "8.7",
    briefing: "§8.5: random.shuffle перемешивает список на месте. С зерном результат всегда один и тот же — его можно проверять.",
    lore: "Тас честен, если зерно одно.",
    goal: "Выведи первую карту, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["1"],
    starter: "import random\nrandom.seed(5)\ndeck = [1, 2, 3, 4]\nrandom.shuffle(deck)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)\n",
    hints: [
      "Намёк: random.seed(5), потом random.shuffle(deck). Первая карта получается 1.",
      "Псевдокод:\nimport random\nrandom.seed(5)\ndeck = [1, 2, 3, 4]\nrandom.shuffle(deck)\nprint(deck[0])\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
      "Решение:\nimport random\nrandom.seed(5)\ndeck = [1, 2, 3, 4]\nrandom.shuffle(deck)\nprint(deck[0])\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)"
    ],
    solution: "import random\nrandom.seed(5)\ndeck = [1, 2, 3, 4]\nrandom.shuffle(deck)\nprint(deck[0])\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
    starTurns: 2
  },
  {
    id: 50, gen: "enemy", title: "Гараж", topic: "босс §8.11", book: "8.11",
    briefing: "§8.11 из учебника: в гараже среди хлама затерялся ключ. Проверь списком, одолей стражу.",
    lore: "Ключ в гараже. Стража у маяка. Обычный вторник.",
    goal: "Найди ключ, одолей стражу, дойди до 🌀.",
    map: ["########", "#P.E..X#", "########"],
    energy: 20, maxTurns: 16, expect: ["Ключ на месте"],
    starter: 'garage = ["метла", "шина", "ключ"]\nif "ключ" in garage:\n    print("Ключ на месте")\nmove_right()\nattack("right")\n',
    hints: [
      'Намёк: коридор каждый раз новый, а вирус перекрывает путь. Нужен цикл: увидел вируса — attack(), встал на кристалл — collect(), иначе шаг.',
      'Псевдокод:\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ngarage = ["метла", "шина", "ключ"]\nif "ключ" in garage:\n    print("Ключ на месте")\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'garage = ["метла", "шина", "ключ"]\nif "ключ" in garage:\n    print("Ключ на месте")\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 6
  },
  // ---------- Глава 9. Кортежи ----------
  {
    id: 51, gen: "flat", title: "Капсула", topic: "кортеж ()", book: "9.1/9.2",
    briefing: "§9.1–9.2: кортеж — как список, только в круглых скобках. Собери капсулу и назови первый элемент.",
    lore: "Круглые скобки. Крепкая вещь.",
    goal: "Выведи капсулу и 10, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["(10, 20)", "10"],
    starter: 't = (10, 20)\nprint(t)\nprint(t[0])\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nt = (10, 20)\nprint(t)\nprint(t[0])\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 't = (10, 20)\nprint(t)\nprint(t[0])\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 52, gen: "flat", title: "Обход капсулы", topic: "for по кортежу", book: "9.4",
    briefing: "§9.4: цикл идёт и по кортежу. Сложи (1, 2, 3) в сумму.",
    lore: "Обойди всех. Даже запечатанных.",
    goal: "Выведи 6 и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["6"],
    starter: 's = 0\nfor x in (1, 2, 3):\n    s = s + x\nprint(s)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ns = 0\nfor x in (1, 2, 3):\n    s = s + x\nprint(s)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 's = 0\nfor x in (1, 2, 3):\n    s = s + x\nprint(s)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 53, gen: "flat", title: "Длина и поиск", topic: "len() и in", book: "9.6",
    briefing: "§9.6: длина и вхождение работают и здесь. Измерь («a», «b») и найди «b».",
    lore: "Измерь. Найди. Иди.",
    goal: "Выведи 2 и True, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["2", "True"],
    starter: 't = ("a", "b")\nprint(len(t))\nprint("b" in t)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nt = ("a", "b")\nprint(len(t))\nprint("b" in t)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 't = ("a", "b")\nprint(len(t))\nprint("b" in t)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 54, gen: "flat", title: "Распаковка", topic: "x, y = ...", book: "9.9",
    briefing: "§9.9: координаты (3, 4) можно разложить в два имени одним махом. Сложи их.",
    lore: "Одна капсула — два имени.",
    goal: "Выведи 7 и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["7"],
    starter: 'coords = (3, 4)\nx, y = coords\nprint(x + y)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ncoords = (3, 4)\nx, y = coords\nprint(x + y)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'coords = (3, 4)\nx, y = coords\nprint(x + y)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 55, gen: "flat", title: "Слияние", topic: "склейка кортежей", book: "9.7",
    briefing: "§9.7: плюс склеивает капсулы в новую: (1, 2) + (3,) — и вот уже (1, 2, 3).",
    lore: "Склеивай. Новое — не запрет.",
    goal: "Выведи (1, 2, 3) и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["(1, 2, 3)"],
    starter: 'a = (1, 2)\nb = a + (3,)\nprint(b)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\na = (1, 2)\nb = a + (3,)\nprint(b)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'a = (1, 2)\nb = a + (3,)\nprint(b)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 56, gen: "flat", title: "Кто есть кто", topic: "type()", book: "9.10",
    briefing: "§9.10: кортеж и список — разные типы. type((1,)) даст <class 'tuple'>, а короткое имя — type((1,)).__name__.",
    lore: "Похожи — не значит одинаковы.",
    goal: "Выведи имена типов и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["tuple", "list"],
    starter: 'print(type((1,)))\nprint(type([1]))\nmove_right()\n',
    hints: [
      "Намёк: type печатает <class 'tuple'>. Короткое имя типа — через __name__.",
      "Псевдокод:\nprint(type((1,)).__name__)\nprint(type([1]).__name__)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
      "Решение:\nprint(type((1,)).__name__)\nprint(type([1]).__name__)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)"
    ],
    solution: "print(type((1,)).__name__)\nprint(type([1]).__name__)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
    starTurns: 2
  },
  {
    id: 57, gen: "flat", title: "Пустая капсула", topic: "кортеж как условие", book: "9.5",
    briefing: "§9.5: пустая капсула — ложь, полная — правда. Проверь пустую.",
    lore: "Пустота тоже ответ.",
    goal: "Выведи «пуст» и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["пуст"],
    starter: 't = ()\nif t:\n    print("полон")\nelse:\n    print("пуст")\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nt = ()\nif t:\n    print("полон")\nelse:\n    print("пуст")\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 't = ()\nif t:\n    print("полон")\nelse:\n    print("пуст")\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 58, gen: "enemy", title: "Сейф", topic: "босс: списки vs кортежи", book: "9.10",
    briefing: "§9.10 из учебника: в сейфе груз двух видов. Посчитай всё вместе и вскрой маяк.",
    lore: "Списки и капсулы. Считай всё.",
    goal: "Выведи 3, одолей стражу, дойди до 🌀.",
    map: ["########", "#P.E..X#", "########"],
    energy: 20, maxTurns: 16, expect: ["3"],
    starter: 'cargo = ["ключ"]\nbox = ("болт", "гайка")\nprint(len(cargo) + len(box))\nmove_right()\nattack("right")\n',
    hints: [
      'Намёк: коридор каждый раз новый, а вирус перекрывает путь. Нужен цикл: увидел вируса — attack(), встал на кристалл — collect(), иначе шаг.',
      'Псевдокод:\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ncargo = ["ключ"]\nbox = ("болт", "гайка")\nprint(len(cargo) + len(box))\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'cargo = ["ключ"]\nbox = ("болт", "гайка")\nprint(len(cargo) + len(box))\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 6
  },
  // ---------- Глава 10. Словари и множества ----------
  {
    id: 59, gen: "flat", title: "Картотека", topic: "словарь {}", book: "10.1",
    briefing: "§10.1: словарь хранит ключи и значения. Имя типа, как и раньше, достаётся через __name__.",
    lore: "Каждая вещь — на своей карточке.",
    goal: "Выведи значение и имя типа, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Бип", "dict"],
    starter: 'd = {"пилот": "Бип"}\nprint(d["пилот"])\nprint(type(d))\nmove_right()\n',
    hints: [
      "Намёк: type(d) даст <class 'dict'>, а нужен просто dict — бери type(d).__name__.",
      "Псевдокод:\nd = {\"пилот\": \"Бип\"}\nprint(d[\"пилот\"])\nprint(type(d).__name__)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
      "Решение:\nd = {\"пилот\": \"Бип\"}\nprint(d[\"пилот\"])\nprint(type(d).__name__)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)"
    ],
    solution: "d = {\"пилот\": \"Бип\"}\nprint(d[\"пилот\"])\nprint(type(d).__name__)\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
    starTurns: 2
  },
  {
    id: 60, gen: "flat", title: "Новая карточка", topic: "d[k] = v", book: "10.2",
    briefing: "§10.2: карточки можно добавлять: inv[«щит»] = 1. Доложи количество.",
    lore: "Картотека растёт.",
    goal: "Выведи 1 и 2, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["1", "2"],
    starter: 'inv = {"ядро": 2}\ninv["щит"] = 1\nprint(inv["щит"])\nprint(len(inv))\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ninv = {"ядро": 2}\ninv["щит"] = 1\nprint(inv["щит"])\nprint(len(inv))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'inv = {"ядро": 2}\ninv["щит"] = 1\nprint(inv["щит"])\nprint(len(inv))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 61, gen: "flat", title: "Обход карточек", topic: "for по словарю", book: "10.2",
    briefing: "§10.2: цикл идёт по ключам. Сложи все значения и проверь ключ «a».",
    lore: "Пройди все карточки.",
    goal: "Выведи 3 и True, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["3", "True"],
    starter: 'data = {"a": 1, "b": 2}\ns = 0\nfor k in data:\n    s = s + data[k]\nprint(s)\nprint("a" in data)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ndata = {"a": 1, "b": 2}\ns = 0\nfor k in data:\n    s = s + data[k]\nprint(s)\nprint("a" in data)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'data = {"a": 1, "b": 2}\ns = 0\nfor k in data:\n    s = s + data[k]\nprint(s)\nprint("a" in data)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 62, gen: "flat", title: "В архив", topic: "del d[k]", book: "10.2",
    briefing: "§10.2: лишнюю карточку — в архив через del. Убери «x» и измерь остаток.",
    lore: "Лишнее — в архив.",
    goal: "Выведи 1 и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["1"],
    starter: 'd = {"x": 1, "y": 2}\ndel d["x"]\nprint(len(d))\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\nd = {"x": 1, "y": 2}\ndel d["x"]\nprint(len(d))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'd = {"x": 1, "y": 2}\ndel d["x"]\nprint(len(d))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 63, gen: "flat", title: "Без повторов", topic: "множество set()", book: "10.3/10.5",
    briefing: "§10.3 и §10.5: множество не терпит повторов. Сожми [1, 2, 2, 3] и добавь 4.",
    lore: "Повторы — мусор. Множество — порядок.",
    goal: "Выведи 3 и True, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["3", "True"],
    starter: 's = set([1, 2, 2, 3])\nprint(len(s))\ns.add(4)\nprint(4 in s)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ns = set([1, 2, 2, 3])\nprint(len(s))\ns.add(4)\nprint(4 in s)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 's = set([1, 2, 2, 3])\nprint(len(s))\ns.add(4)\nprint(4 in s)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 64, gen: "enemy", title: "Картотека", topic: "босс: проверка ключа", book: "10.2",
    briefing: "§10.2 из учебника: на складе всё по карточкам. Проверь «ключи», одолей стражу.",
    lore: "Всё по карточкам. Стража — по расписанию.",
    goal: "Проверь ключ, одолей стражу, дойди до 🌀.",
    map: ["########", "#P.E..X#", "########"],
    energy: 20, maxTurns: 16, expect: ["Есть"],
    starter: 'depot = {"ключи": 1}\nif "ключи" in depot:\n    print("Есть")\nmove_right()\nattack("right")\n',
    hints: [
      'Намёк: коридор каждый раз новый, а вирус перекрывает путь. Нужен цикл: увидел вируса — attack(), встал на кристалл — collect(), иначе шаг.',
      'Псевдокод:\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ndepot = {"ключи": 1}\nif "ключи" in depot:\n    print("Есть")\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'depot = {"ключи": 1}\nif "ключи" in depot:\n    print("Есть")\n# вирус перекрывает путь: сначала удар, потом шаг\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 6
  },
  // ---------- Глава 11. Функции ----------
  {
    id: 65, gen: "flat", title: "Своя команда", topic: "def", book: "11.1",
    briefing: "§11.1: объяви свою команду greet(name) — она здоровается и возвращает фразу.",
    lore: "Своя команда — своя сила.",
    goal: "Выведи приветствие и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Привет, Бип"],
    starter: 'def greet(name):\n    return "Привет, " + name\nprint(greet("Бип"))\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ndef greet(name):\n    return "Привет, " + name\nprint(greet("Бип"))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'def greet(name):\n    return "Привет, " + name\nprint(greet("Бип"))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 66, gen: "flat", title: "Умолчания", topic: "параметры по умолчанию", book: "11.2",
    briefing: "§11.2: степень по умолчанию — квадрат. Вызови power(3) и power(2, 3).",
    lore: "Умолчание — как автопилот.",
    goal: "Выведи 9 и 8, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["9", "8"],
    starter: 'def power(n, exp=2):\n    return n ** exp\nprint(power(3))\nprint(power(2, 3))\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ndef power(n, exp=2):\n    return n ** exp\nprint(power(3))\nprint(power(2, 3))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'def power(n, exp=2):\n    return n ** exp\nprint(power(3))\nprint(power(2, 3))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 67, gen: "flat", title: "Пара назад", topic: "возврат нескольких", book: "11.10",
    briefing: "§11.10: return может вернуть пару. Разложи её обратно в имена и сложи.",
    lore: "Пара туда — пара обратно.",
    goal: "Выведи 7 и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["7"],
    starter: 'def pos():\n    return 3, 4\nx, y = pos()\nprint(x + y)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ndef pos():\n    return 3, 4\nx, y = pos()\nprint(x + y)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'def pos():\n    return 3, 4\nx, y = pos()\nprint(x + y)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 68, gen: "flat", title: "Зеркало", topic: "рекурсия", book: "11.7",
    briefing: "§11.7: функция зовёт саму себя — рекурсия. Посчитай факториал 5.",
    lore: "Функция в зеркале. Зеркало в функции.",
    goal: "Выведи 120 и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["120"],
    starter: 'def fact(n):\n    if n <= 1:\n        return 1\n    else:\n        return n * fact(n - 1)\nprint(fact(5))\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ndef fact(n):\n    if n <= 1:\n        return 1\n    else:\n        return n * fact(n - 1)\nprint(fact(5))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'def fact(n):\n    if n <= 1:\n        return 1\n    else:\n        return n * fact(n - 1)\nprint(fact(5))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 69, gen: "flat", title: "Общий счёт", topic: "global", book: "11.8",
    briefing: "§11.8: без global функция пишет в свою тетрадку. Объяви общий счётчик.",
    lore: "Общее — значит общее.",
    goal: "Выведи 2 и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["2"],
    starter: 'count = 0\ndef tick():\n    global count\n    count = count + 1\ntick()\ntick()\nprint(count)\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ncount = 0\ndef tick():\n    global count\n    count = count + 1\ntick()\ntick()\nprint(count)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'count = 0\ndef tick():\n    global count\n    count = count + 1\ntick()\ntick()\nprint(count)\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 70, gen: "flat", title: "Паспорт функции", topic: "docstring", book: "11.9",
    briefing: "§11.9: у приличной функции есть паспорт — строка-документация. Выдай паспорт и посчитай площадь 3×4.",
    lore: "Без паспорта — не функция.",
    goal: "Выведи 12 и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["12"],
    starter: 'def area(w, h):\n    """Площадь прямоугольника."""\n    return w * h\nprint(area(3, 4))\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ndef area(w, h):\n    """Площадь прямоугольника."""\n    return w * h\nprint(area(3, 4))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'def area(w, h):\n    """Площадь прямоугольника."""\n    return w * h\nprint(area(3, 4))\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 71, gen: "enemy", title: "Штурмовая функция", topic: "босс: приём в def", book: "11.1",
    briefing: "§11.1 в бою: упакуй «удар + шаг» в функцию kill() и зачисти коридор.",
    lore: "Приём, упакованный в слово, бьёт дважды.",
    goal: "Зачисти коридор и дойди до 🌀.",
    map: ["#########", "#P.E.E.X#", "#########"],
    energy: 30, maxTurns: 20,
    starter: 'def kill():\n    attack("right")\n    move_right()\nmove_right()\nkill()\n',
    hints: [
      'Намёк: приём kill() уже упакован. Осталось решить, когда его звать: коридор-то каждый раз новый.',
      'Псевдокод:\ndef kill():\n    attack("right")\n    move_right()\n\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        kill()\n    else:\n        move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ndef kill():\n    attack("right")\n    move_right()\ndef kill():\n    attack("right")\n    move_right()\n\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        kill()\n    else:\n        move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'def kill():\n    attack("right")\n    move_right()\ndef kill():\n    attack("right")\n    move_right()\n\nwhile not is_exit("right"):\n    if is_enemy("right"):\n        kill()\n    else:\n        move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 8
  },
  // ---------- Глава 13. Исключения ----------
  {
    id: 72, gen: "flat", title: "Страховка", topic: "try/except", book: "13.1",
    briefing: "§13.1: ошибка — не конец света, если есть страховка. Брось сигнал и поймай его.",
    lore: "Падай — но в страховку.",
    goal: "Выведи «Поймано» и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Поймано"],
    starter: 'try:\n    raise("Бум!")\nexcept:\n    print("Поймано")\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ntry:\n    raise("Бум!")\nexcept:\n    print("Поймано")\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'try:\n    raise("Бум!")\nexcept:\n    print("Поймано")\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 73, gen: "flat", title: "Имя аварии", topic: "except as", book: "13.3",
    briefing: "§13.3: своя ошибка — это обычный класс, который наследуется от Exception. Объяви его через class и бросай через raise.",
    lore: "Назови аварию — и она уже меньше.",
    goal: "Выведи доклад и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Авария: Перегрев"],
    starter: "class Ошибка(Exception):\n    pass\n\ntry:\n    raise Ошибка(\"Перегрев\")\nexcept Ошибка as e:\n    print(\"Авария: \" + str(e))\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)\n",
    hints: [
      "Намёк: сначала class Ошибка(Exception): pass, потом try и raise Ошибка(\"Перегрев\"). В except ловишь as e и печатаешь str(e).",
      "Псевдокод:\nclass Ошибка(Exception):\n    pass\n\ntry:\n    raise Ошибка(\"Перегрев\")\nexcept Ошибка as e:\n    print(\"Авария: \" + str(e))\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
      "Решение:\nclass Ошибка(Exception):\n    pass\n\ntry:\n    raise Ошибка(\"Перегрев\")\nexcept Ошибка as e:\n    print(\"Авария: \" + str(e))\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)"
    ],
    solution: "class Ошибка(Exception):\n    pass\n\ntry:\n    raise Ошибка(\"Перегрев\")\nexcept Ошибка as e:\n    print(\"Авария: \" + str(e))\n# арена каждый раз новая — идём по датчикам, а не «на автопилоте»\nwhile not is_exit(\"right\"):\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
    starTurns: 2
  },
  {
    id: 74, gen: "flat", title: "Чистый полёт", topic: "else/finally", book: "13.3",
    briefing: "§13.3: else — если всё чисто, finally — в любом случае. Пролети без аварий.",
    lore: "Чисто. И точка в конце.",
    goal: "Выведи два слова и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["чисто", "конец"],
    starter: 'try:\n    x = 1\nexcept:\n    print("нет")\nelse:\n    print("чисто")\nfinally:\n    print("конец")\nmove_right()\n',
    hints: [
      'Намёк: коридор каждый раз новый — запомнить путь не выйдет. Нужен цикл, который сам ищет портал через is_exit() и забирает кристаллы через is_crystal().',
      'Псевдокод:\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
      'Решение:\ntry:\n    x = 1\nexcept:\n    print("нет")\nelse:\n    print("чисто")\nfinally:\n    print("конец")\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()'
    ],
    solution: 'try:\n    x = 1\nexcept:\n    print("нет")\nelse:\n    print("чисто")\nfinally:\n    print("конец")\n# карта новая каждый заход — идём по датчикам, а не «на автопилоте»\nwhile not is_exit("right"):\n    move_right()\n    if is_crystal("here"):\n        collect()\nmove_right()',
    starTurns: 2
  },
  {
    id: 75, gen: "enemy", title: "Реактор", topic: "босс: перегрев", book: "13.3",
    briefing: "§13.3: finally выполняется всегда — даже если в try что-то сломалось. Это надёжный способ доложить об аварии.",
    lore: "Реактор греется. Руки — нет.",
    goal: "Выведи аварию, дойди до 🌀.",
    map: ["########", "#P.E..X#", "########"],
    energy: 20, maxTurns: 16, expect: ["Перегрев!"], biome: "deathstar", place: "Реактор",
    starter: "class Авария(Exception):\n    pass\n\ntemp = 15\ntry:\n    if temp > 10:\n        raise Авария(\"Перегрев!\")\nexcept Авария as e:\n    print(e)\n# арена новая и вирусы на пути — сначала удар, потом шаг\nwhile not is_exit(\"right\"):\n    if is_enemy(\"right\"):\n        attack(\"right\")\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)\n",
    hints: [
      "Намёк: ошибка — это класс class Авария(Exception). Внутри try бросаешь raise Авария(\"Перегрев!\"), а в except печатаешь e.",
      "Псевдокод:\nclass Авария(Exception):\n    pass\n\ntemp = 15\ntry:\n    if temp > 10:\n        raise Авария(\"Перегрев!\")\nexcept Авария as e:\n    print(e)\n# арена новая и вирусы на пути — сначала удар, потом шаг\nwhile not is_exit(\"right\"):\n    if is_enemy(\"right\"):\n        attack(\"right\")\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
      "Решение:\nclass Авария(Exception):\n    pass\n\ntemp = 15\ntry:\n    if temp > 10:\n        raise Авария(\"Перегрев!\")\nexcept Авария as e:\n    print(e)\n# арена новая и вирусы на пути — сначала удар, потом шаг\nwhile not is_exit(\"right\"):\n    if is_enemy(\"right\"):\n        attack(\"right\")\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)"
    ],
    solution: "class Авария(Exception):\n    pass\n\ntemp = 15\ntry:\n    if temp > 10:\n        raise Авария(\"Перегрев!\")\nexcept Авария as e:\n    print(e)\n# арена новая и вирусы на пути — сначала удар, потом шаг\nwhile not is_exit(\"right\"):\n    if is_enemy(\"right\"):\n        attack(\"right\")\n    forward(1)\n    if is_crystal(\"here\"):\n        dot()\nforward(1)",
    starTurns: 6
  },
  // ---------- Финал: Владыка Баг ----------
  {
    id: 76, title: "Владыка Баг", topic: "финал: всё вместе", book: "Финал",
    briefing: "Всё, чему учил Орден: функция-приём, цикл не нужен — иди точно, ядра, стража и сам ВЛАДЫКА 👹. Зажги последний маяк.",
    lore: "Последний маяк. Последний бой. Да пребудет с тобой Код.",
    goal: "Собери 2 💎, одолей всех, дойди до 🌀.",
    map: ["##########", "#P..C.EB.#", "#........#", "#.######.#", "#C..H..EX#", "##########"],
    energy: 60, maxTurns: 50, biome: "deathstar", place: "Тронный зал",
    starter: '# Финальный бой. Приём take() уже заряжен.\ndef take():\n    attack("right")\n    move_right()\n\nmove_right()\nmove_right()\nmove_right()\ncollect()\n',
    hints: [
      "Намёк: верх — три шага, ядро, шаг, take(), take(), два шага. Низ — спустись справа, убей, иди влево за ядром и вернись.",
      "Псевдокод: верх → вниз справа → влево до ядра → вправо к выходу.",
      "Решение:\ndef take():\n    attack(\"right\")\n    move_right()\nmove_right()\nmove_right()\nmove_right()\ncollect()\nmove_right()\ntake()\ntake()\nmove_right()\nmove_right()\nmove_down()\nmove_down()\nmove_down()\nattack(\"left\")\nmove_left()\nmove_left()\nmove_left()\nmove_left()\nmove_left()\nmove_left()\nmove_left()\ncollect()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_right()"
    ],
    solution: 'def right_step():\n    if is_enemy("right"):\n        attack("right")\n    move_right()\n    if is_crystal("here"):\n        collect()\n\ndef left_step():\n    if is_enemy("left"):\n        attack("left")\n    move_left()\n    if is_crystal("here"):\n        collect()\n\nmove_right()\nmove_right()\n# верхний коридор: вперёд до стены, попутно бьём вирусов\nwhile not is_wall("right"):\n    right_step()\nmove_down()\nmove_down()\nmove_down()\n# нижний ярус: до левого края, потом обратно к порталу\nwhile not is_wall("left"):\n    left_step()\nwhile not is_exit("here"):\n    right_step()',
    starTurns: 30
  }
];
