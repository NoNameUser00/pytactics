/* Уровни PyTactics = учебник: глава → галактика, параграф → планета.
   Поля: book (§ учебника), expect (точные строки print для победы),
   biome/place (окружение), остальное как раньше.
   Карта: # стена, . пол, P игрок, E/R/D/B враги, C кристалл, H ячейка, X выход */
window.LEVELS = [
  // ---------- Глава 1. Первые программы ----------
  {
    id: 1, title: "Первая программа", topic: "print()", book: "1.1",
    briefing: "§1.1 из учебника: первая программа просто выводит текст. Твой маяк ждёт справа, а консоль — твой первый отчёт.",
    lore: "Да пребудет с тобой Код. Маяк ждёт справа.",
    goal: "Выведи «Привет, Грид!» и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Привет, Грид!"],
    starter: 'print("Привет, Грид!")\nmove_right()\n',
    hints: [
      "Намёк: print уже есть. Добавь второй move_right() — до портала 2 клетки.",
      "Псевдокод:\nprint(\"Привет, Грид!\")\nmove_right()\nmove_right()",
      "Решение:\nprint(\"Привет, Грид!\")\nmove_right()\nmove_right()"
    ],
    solution: 'print("Привет, Грид!")\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 2, title: "Структура программы", topic: "последовательность команд", book: "1.4",
    briefing: "§1.4: программа выполняется сверху вниз, строка за строкой. Проведи робота по коридору — 5 приказов подряд.",
    lore: "Код идёт сверху вниз, как corridor. Шаг за шагом.",
    goal: "Пройди коридор из 5 клеток.",
    map: ["########", "#P....X#", "########"],
    energy: 20, maxTurns: 15,
    starter: '# Команды выполняются по порядку\nmove_right()\nmove_right()\n',
    hints: [
      "Намёк: клеток 5 — нужно 5 одинаковых строк.",
      "Псевдокод: пять раз move_right().",
      "Решение:\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_right()"
    ],
    solution: 'move_right()\nmove_right()\nmove_right()\nmove_right()\nmove_right()',
    starTurns: 5
  },
  {
    id: 3, title: "Комментарии", topic: "# комментарии", book: "1.5",
    briefing: "§1.5: строки с # робот-читатель пропускает, а человек понимает. Забери ядро, подписав каждый шаг.",
    lore: "Мудрый оператор подписывает путь. Решётка # — чернила.",
    goal: "Собери 💎 и дойди до 🌀.",
    map: ["#######", "#P.C.X#", "#######"],
    energy: 20, maxTurns: 15,
    starter: '# Иди и забери кристалл\nmove_right()\nmove_right()\ncollect()\n',
    hints: [
      "Намёк: ядро на 3-й клетке. Схема: шаг, шаг, взять, шаг, шаг.",
      "Псевдокод:\nmove_right()\nmove_right()\ncollect()\nmove_right()\nmove_right()",
      "Решение:\nmove_right()\nmove_right()\ncollect()\nmove_right()\nmove_right()"
    ],
    solution: 'move_right()\nmove_right()\ncollect()\nmove_right()\nmove_right()',
    starTurns: 5
  },
  {
    id: 4, title: "Вывод данных", topic: "print() и переменные", book: "1.6",
    briefing: "§1.6: сохрани число шагов в переменную, выведи её и только потом иди. Консоль должна показать 4.",
    lore: "Сначала посчитай, потом шагай.",
    goal: "Выведи число шагов и дойди до 🌀.",
    map: ["#######", "#P...X#", "#######"],
    energy: 20, maxTurns: 14, expect: ["4"],
    starter: 'steps = 4\nprint(steps)\nmove_right()\n',
    hints: [
      "Намёк: print уже выводит 4. Добавь ещё три move_right().",
      "Псевдокод:\nsteps = 4\nprint(steps)\nmove_right()\nmove_right()\nmove_right()\nmove_right()",
      "Решение:\nsteps = 4\nprint(steps)\nmove_right()\nmove_right()\nmove_right()\nmove_right()"
    ],
    solution: 'steps = 4\nprint(steps)\nmove_right()\nmove_right()\nmove_right()\nmove_right()',
    starTurns: 4
  },
  // ---------- Глава 2. Переменные и типы ----------
  {
    id: 5, title: "Имена", topic: "переменные", book: "2.1",
    briefing: "§2.1: у каждой переменной — имя. Назови своего робота и представь его консоли.",
    lore: "Безымянный робот — просто железо. Назови его.",
    goal: "Выведи имя и дойди до 🌀.",
    map: ["#######", "#P...X#", "#######"],
    energy: 20, maxTurns: 13, expect: ["Бип"],
    starter: 'name = "Бип"\nprint(name)\nmove_right()\n',
    hints: [
      "Намёк: имя уже выводится. Доведи робота: ещё три шага.",
      "Псевдокод:\nname = \"Бип\"\nprint(name)\nmove_right() x4",
      "Решение:\nname = \"Бип\"\nprint(name)\nmove_right()\nmove_right()\nmove_right()\nmove_right()"
    ],
    solution: 'name = "Бип"\nprint(name)\nmove_right()\nmove_right()\nmove_right()\nmove_right()',
    starTurns: 4
  },
  {
    id: 6, title: "Присваивание", topic: "= и счётчик", book: "2.3",
    briefing: "§2.3: переменную можно менять: crystals = crystals + 1. Считай ядра в переменную.",
    lore: "Считай ядра — Орден любит порядок.",
    goal: "Собери 2 💎, посчитай их, дойди до 🌀.",
    map: ["#########", "#P.C.C.X#", "#########"],
    energy: 20, maxTurns: 18, expect: ["2"],
    starter: 'crystals = 0\nmove_right()\nmove_right()\ncollect()\ncrystals = crystals + 1\n',
    hints: [
      "Намёк: после каждого collect() прибавляй 1, в конце выведи и сделай 2 финальных шага.",
      "Псевдокод: collect → +1 … collect → +1 … print(crystals) … иди.",
      "Решение:\ncrystals = 0\nmove_right()\nmove_right()\ncollect()\ncrystals = crystals + 1\nmove_right()\nmove_right()\ncollect()\ncrystals = crystals + 1\nprint(crystals)\nmove_right()\nmove_right()"
    ],
    solution: 'crystals = 0\nmove_right()\nmove_right()\ncollect()\ncrystals = crystals + 1\nmove_right()\nmove_right()\ncollect()\ncrystals = crystals + 1\nprint(crystals)\nmove_right()\nmove_right()',
    starTurns: 8
  },
  {
    id: 7, title: "Типы", topic: "bool и сенсоры", book: "2.2",
    briefing: "§2.2: сенсор is_wall() возвращает логическое True/False. Сохрани ответ в переменную и реши, куда идти.",
    lore: "Стена отвечает честно: True. Слушай её.",
    goal: "Обойди стену, выведи ответ сенсора.",
    map: ["#######", "#P.#.X#", "#.....#", "#######"],
    energy: 20, maxTurns: 16, expect: ["True"],
    starter: 'move_right()\nwall = is_wall("right")\nprint(wall)\nif wall:\n    move_down()\nelse:\n    move_right()\n',
    hints: [
      "Намёк: скелет верный. После спуска: два шага вправо, вверх, шаг к выходу.",
      "Псевдокод: … move_down() … move_right() x2 … move_up() … move_right().",
      "Решение:\nmove_right()\nwall = is_wall(\"right\")\nprint(wall)\nif wall:\n    move_down()\nelse:\n    move_right()\nmove_right()\nmove_right()\nmove_up()\nmove_right()"
    ],
    solution: 'move_right()\nwall = is_wall("right")\nprint(wall)\nif wall:\n    move_down()\nelse:\n    move_right()\nmove_right()\nmove_right()\nmove_up()\nmove_right()',
    starTurns: 6
  },
  {
    id: 8, title: "Приведение типов", topic: "int() и type()", book: "2.4",
    briefing: "§2.4: строка \"4\" — не число. Преврати её в int(), проверь type() и пройди 4 клетки.",
    lore: "Слова — в числа. Магия приведения.",
    goal: "Выведи тип и дойди до 🌀.",
    map: ["#######", "#P...X#", "#######"],
    energy: 20, maxTurns: 14, expect: ["int"],
    starter: 'n = "4"\nn = int(n)\nprint(type(n))\nmove_right()\n',
    hints: [
      "Намёк: тип уже выводится. Добавь ещё три шага — всего 4.",
      "Псевдокод: int + print + 4× move_right().",
      "Решение:\nn = \"4\"\nn = int(n)\nprint(type(n))\nmove_right()\nmove_right()\nmove_right()\nmove_right()"
    ],
    solution: 'n = "4"\nn = int(n)\nprint(type(n))\nmove_right()\nmove_right()\nmove_right()\nmove_right()',
    starTurns: 4
  },
  {
    id: 9, title: "Удаление", topic: "del", book: "2.5",
    briefing: "§2.5: временная переменная больше не нужна — удали её через del. Сначала выведи энергию.",
    lore: "Чистый код — чистый коридор.",
    goal: "Выведи энергию, удали переменную, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["20"],
    starter: 'temp = get_energy()\nprint(temp)\ndel temp\nmove_right()\n',
    hints: [
      "Намёк: всё уже написано, кроме последнего шага.",
      "Псевдокод: print → del → 2× move_right().",
      "Решение:\ntemp = get_energy()\nprint(temp)\ndel temp\nmove_right()\nmove_right()"
    ],
    solution: 'temp = get_energy()\nprint(temp)\ndel temp\nmove_right()\nmove_right()',
    starTurns: 2
  },
  // ---------- Глава 3. Операторы ----------
  {
    id: 10, title: "Математика", topic: "+ - * /", book: "3.1",
    briefing: "§3.1: бортовой компьютер считает сам. Выведи 7 + 3 * 2 и иди к маяку.",
    lore: "Компьютер считает — оператор приказывает.",
    goal: "Выведи результат и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["13"],
    starter: 'print(7 + 3 * 2)\nmove_right()\n',
    hints: [
      "Намёк: умножение раньше сложения: 13. Добавь второй шаг.",
      "Псевдокод:\nprint(7 + 3 * 2)\nmove_right()\nmove_right()",
      "Решение:\nprint(7 + 3 * 2)\nmove_right()\nmove_right()"
    ],
    solution: 'print(7 + 3 * 2)\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 11, title: "Время в пути", topic: "деление", book: "3.1.2",
    briefing: "§3.1.2 из учебника: время = путь / скорость. Путь 120, скорость 60 — выведи время и иди.",
    lore: "Сто двадцать парсеков? Нет — сто двадцать шагов пополам.",
    goal: "Выведи время и дойди до 🌀.",
    map: ["#######", "#P...X#", "#######"],
    energy: 20, maxTurns: 13, expect: ["2"],
    starter: 's = 120\nv = 60\nt = s / v\nprint(t)\nmove_right()\n',
    hints: [
      "Намёк: время уже посчитано (2). Добавь ещё три шага.",
      "Псевдокод: s, v, t, print + 4× move_right().",
      "Решение:\ns = 120\nv = 60\nt = s / v\nprint(t)\nmove_right()\nmove_right()\nmove_right()\nmove_right()"
    ],
    solution: 's = 120\nv = 60\nt = s / v\nprint(t)\nmove_right()\nmove_right()\nmove_right()\nmove_right()',
    starTurns: 4
  },
  {
    id: 12, title: "Топливо", topic: "// и %", book: "3.1.3",
    briefing: "§3.1.3: бак 10, расход 3. Сколько полных баков и остаток? Выведи оба числа.",
    lore: "Считай баки, падаван.",
    goal: "Выведи 3 и 1, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["3", "1"],
    starter: 'fuel = 10\nper = 3\nprint(fuel // per)\nprint(fuel % per)\nmove_right()\n',
    hints: [
      "Намёк: оба print уже есть. Добавь второй шаг.",
      "Псевдокод: два print + 2× move_right().",
      "Решение:\nfuel = 10\nper = 3\nprint(fuel // per)\nprint(fuel % per)\nmove_right()\nmove_right()"
    ],
    solution: 'fuel = 10\nper = 3\nprint(fuel // per)\nprint(fuel % per)\nmove_right()\nmove_right()',
    starTurns: 2
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
    goal: "Выведи слово и длину, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Грид", "3"],
    starter: 'word = "Гри"\nprint(word + "д")\nprint(len(word))\nmove_right()\n',
    hints: [
      "Намёк: длина «Гри» — 3. Добавь второй шаг.",
      "Псевдокод: два print + 2× move_right().",
      "Решение:\nword = \"Гри\"\nprint(word + \"д\")\nprint(len(word))\nmove_right()\nmove_right()"
    ],
    solution: 'word = "Гри"\nprint(word + "д")\nprint(len(word))\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 15, title: "Хитрые присваивания", topic: "+= *= //=", book: "3.3/3.4",
    briefing: "§3.3–3.4: x += 3 короче, чем x = x + 3. Разгони x с 5 до 16.",
    lore: "Короткий код — быстрый клинок.",
    goal: "Выведи 16 и дойди до 🌀.",
    map: ["#######", "#P...X#", "#######"],
    energy: 20, maxTurns: 13, expect: ["16"],
    starter: 'x = 5\nx += 3\nx *= 2\nprint(x)\nmove_right()\n',
    hints: [
      "Намёк: 5+3=8, 8×2=16. Добавь ещё три шага.",
      "Псевдокод: три строки математики + print + 4 шага.",
      "Решение:\nx = 5\nx += 3\nx *= 2\nprint(x)\nmove_right()\nmove_right()\nmove_right()\nmove_right()"
    ],
    solution: 'x = 5\nx += 3\nx *= 2\nprint(x)\nmove_right()\nmove_right()\nmove_right()\nmove_right()',
    starTurns: 4
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
      "Намёк: скелет верный, но стену надо обойти: сначала дважды вниз.",
      "Псевдокод: вниз ×2, вправо ×4, вверх, взять, вверх, вправо.",
      "Решение:\nmove_down()\nmove_down()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_up()\ncollect()\nmove_up()\nmove_right()"
    ],
    solution: 'move_down()\nmove_down()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_up()\ncollect()\nmove_up()\nmove_right()',
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
      "Намёк: после ядра — ещё вниз и пять шагов вправо, потом дважды вверх.",
      "Псевдокод: вниз, вправо, взять, вниз, вправо ×5, вверх ×2.",
      "Решение:\nmove_down()\nmove_right()\ncollect()\nmove_down()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_up()\nmove_up()"
    ],
    solution: 'move_down()\nmove_right()\ncollect()\nmove_down()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_up()\nmove_up()',
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
    id: 21, title: "Уровень доступа", topic: "сравнение строк", book: "4.4/4.5",
    briefing: "§4.4–4.5 из учебника: программа «Уровень доступа» пускает только с верным паролем. Пароль «py12», а маяк охраняет штурмовик.",
    lore: "Доступ есть. Но маяк охраняют. Да пребудет с тобой Код.",
    goal: "Назови пароль, одолей стражу, дойди до 🌀.",
    map: ["#######", "#P.E.X#", "#######"],
    energy: 20, maxTurns: 14, expect: ["Доступ разрешён"],
    starter: 'code = "py12"\nif code == "py12":\n    print("Доступ разрешён")\nmove_right()\nattack("right")\nmove_right()\n',
    hints: [
      "Намёк: скелет верный: подойди, ударь, пройди три клетки до маяка.",
      "Псевдокод: if + print + шаг + удар + 3 шага.",
      "Решение:\ncode = \"py12\"\nif code == \"py12\":\n    print(\"Доступ разрешён\")\nmove_right()\nattack(\"right\")\nmove_right()\nmove_right()\nmove_right()"
    ],
    solution: 'code = "py12"\nif code == "py12":\n    print("Доступ разрешён")\nmove_right()\nattack("right")\nmove_right()\nmove_right()\nmove_right()',
    starTurns: 5
  },
  // ---------- Глава 5. Математические функции ----------
  {
    id: 22, title: "Типы чисел", topic: "int и float", book: "5.1",
    briefing: "§5.1: числа бывают целые (int) и дробные (float). Выведи оба типа и иди.",
    lore: "Числа — тоже Сила. Целые и дробные.",
    goal: "Выведи типы и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["int", "float"],
    starter: 'print(type(5))\nprint(type(3.5))\nmove_right()\n',
    hints: [
      "Намёк: оба типа уже выводятся. Добавь второй шаг.",
      "Псевдокод: два print + 2× move_right().",
      "Решение:\nprint(type(5))\nprint(type(3.5))\nmove_right()\nmove_right()"
    ],
    solution: 'print(type(5))\nprint(type(3.5))\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 23, title: "Округление", topic: "round()", book: "5.2.1",
    briefing: "§5.2.1: число пи бесконечно, а экран — нет. Округли 3.14159 до сотых.",
    lore: "Округляй точно, как прицел.",
    goal: "Выведи 3.14 и 3, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["3.14", "3"],
    starter: 'print(round(3.14159, 2))\nprint(round(2.5))\nmove_right()\n',
    hints: [
      "Намёк: round(x, 2) — два знака после точки. Добавь второй шаг.",
      "Псевдокод: два print + 2× move_right().",
      "Решение:\nprint(round(3.14159, 2))\nprint(round(2.5))\nmove_right()\nmove_right()"
    ],
    solution: 'print(round(3.14159, 2))\nprint(round(2.5))\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 24, title: "Красивый вывод", topic: "форматирование чисел", book: "5.2.2",
    briefing: "§5.2.2: числа для вывода готовят заранее. Выведи 7/2 и 10/3 в двух знаках.",
    lore: "Красивый вывод — вежливость оператора.",
    goal: "Выведи 3.5 и 3.33, дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["3.5", "3.33"],
    starter: 'a = 7\nb = 2\nprint(a / b)\nprint(round(10 / 3, 2))\nmove_right()\n',
    hints: [
      "Намёк: оба числа уже готовы. Добавь второй шаг.",
      "Псевдокод: два print + 2× move_right().",
      "Решение:\na = 7\nb = 2\nprint(a / b)\nprint(round(10 / 3, 2))\nmove_right()\nmove_right()"
    ],
    solution: 'a = 7\nb = 2\nprint(a / b)\nprint(round(10 / 3, 2))\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 25, title: "Арсенал", topic: "abs/max/степень", book: "5.3",
    briefing: "§5.3: модуль, максимум и степень — штатный арсенал. Выведи 7, 9 и 1024.",
    lore: "Модуль, максимум, степень. Арсенал растёт.",
    goal: "Выведи три числа и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["7", "9", "1024"],
    starter: 'print(abs(0 - 7))\nprint(max(3, 9, 4))\nprint(2 ** 10)\nmove_right()\n',
    hints: [
      "Намёк: все три уже посчитаны. Добавь второй шаг.",
      "Псевдокод: три print + 2× move_right().",
      "Решение:\nprint(abs(0 - 7))\nprint(max(3, 9, 4))\nprint(2 ** 10)\nmove_right()\nmove_right()"
    ],
    solution: 'print(abs(0 - 7))\nprint(max(3, 9, 4))\nprint(2 ** 10)\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 26, title: "Генератор", topic: "seed() и randint()", book: "5.4",
    briefing: "§5.4: случайность приручается зерном: seed(7) — и кубик всегда честен. Брось кубик 1–6.",
    lore: "Случайность можно приручить. Зерно решает.",
    goal: "Выведи выпавшее число и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["1"],
    starter: 'seed(7)\nn = randint(1, 6)\nprint(n)\nmove_right()\n',
    hints: [
      "Намёк: с зерном 7 всегда выпадает 1. Добавь второй шаг.",
      "Псевдокод: seed + randint + print + 2× move_right().",
      "Решение:\nseed(7)\nn = randint(1, 6)\nprint(n)\nmove_right()\nmove_right()"
    ],
    solution: 'seed(7)\nn = randint(1, 6)\nprint(n)\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 27, title: "За гранью", topic: "Infinity и NaN", book: "5.5",
    briefing: "§5.5: что будет, если разделить на ноль? В Гриде — бесконечность. Проверь сам.",
    lore: "Делить на ноль? В Гриде бывает и такое.",
    goal: "Выведи оба чуда и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Infinity", "NaN"],
    starter: 'print(1 / 0)\nprint(0 / 0)\nmove_right()\n',
    hints: [
      "Намёк: оба чуда уже выводятся. Добавь второй шаг.",
      "Псевдокод: два print + 2× move_right().",
      "Решение:\nprint(1 / 0)\nprint(0 / 0)\nmove_right()\nmove_right()"
    ],
    solution: 'print(1 / 0)\nprint(0 / 0)\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 28, title: "Угадай число", topic: "мини-босс §5.7", book: "5.7",
    briefing: "§5.7 из учебника: Владыка задумал число от 1 до 10 (зерно 3). Перебери по порядку, угадай, одолей стражу и зажги маяк.",
    lore: "Угадай число Владыки. Десять попыток — и ни одной лишней.",
    goal: "Угадай число, одолей стражу, дойди до 🌀.",
    map: ["########", "#P.E..X#", "########"],
    energy: 20, maxTurns: 16, expect: ["Угадал: 8"], biome: "deathstar", place: "Узел Роя",
    starter: 'seed(3)\nhidden = randint(1, 10)\nguess = 0\nwhile guess != hidden:\n    guess = guess + 1\n    if guess == hidden:\n        print("Угадал: " + str(guess))\n        break\nmove_right()\nattack("right")\nmove_right()\n',
    hints: [
      "Намёк: цикл уже угадывает (ответ — 8). После цикла: шаг, удар, четыре шага.",
      "Псевдокод: цикл + шаг + удар + 4 шага.",
      "Решение:\nseed(3)\nhidden = randint(1, 10)\nguess = 0\nwhile guess != hidden:\n    guess = guess + 1\n    if guess == hidden:\n        print(\"Угадал: \" + str(guess))\n        break\nmove_right()\nattack(\"right\")\nmove_right()\nmove_right()\nmove_right()\nmove_right()"
    ],
    solution: 'seed(3)\nhidden = randint(1, 10)\nguess = 0\nwhile guess != hidden:\n    guess = guess + 1\n    if guess == hidden:\n        print("Угадал: " + str(guess))\n        break\nmove_right()\nattack("right")\nmove_right()\nmove_right()\nmove_right()\nmove_right()',
    starTurns: 7
  },
  // ---------- Глава 6. Строки ----------
  {
    id: 29, title: "Кавычки", topic: "строки", book: "6.1",
    briefing: "§6.1: строка живёт в кавычках. Выведи фразу с кавычками внутри и иди.",
    lore: "Кавычки — как створки шлема: держат слова.",
    goal: "Выведи фразу и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ['Он сказал "Вперёд!"'],
    starter: 'print(\'Он сказал "Вперёд!"\')\nmove_right()\n',
    hints: [
      "Намёк: фраза уже выводится. Добавь второй шаг.",
      "Псевдокод: print + 2× move_right().",
      "Решение:\nprint('Он сказал \"Вперёд!\"')\nmove_right()\nmove_right()"
    ],
    solution: 'print(\'Он сказал "Вперёд!"\')\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 30, title: "Новая строка", topic: "спецсимвол \\n", book: "6.4",
    briefing: "§6.4: символ \\n переносит строку. Выведи две строки одним print.",
    lore: "Новая строка — новый коридор.",
    goal: "Выведи две строки и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Строка1\nСтрока2"],
    starter: 'print("Строка1\\nСтрока2")\nmove_right()\n',
    hints: [
      "Намёк: \\n внутри строки работает сам. Добавь второй шаг.",
      "Псевдокод: print + 2× move_right().",
      "Решение:\nprint(\"Строка1\\nСтрока2\")\nmove_right()\nmove_right()"
    ],
    solution: 'print("Строка1\\nСтрока2")\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 31, title: "Символы", topic: "индекс s[i]", book: "6.5.1",
    briefing: "§6.5.1: символы нумеруются с нуля. Собери слово из 1-го и 4-го символов «Грид».",
    lore: "Первый символ — как первый шаг: с нуля.",
    goal: "Выведи «Гд» и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Гд"],
    starter: 'word = "Грид"\nprint(word[0] + word[3])\nmove_right()\n',
    hints: [
      "Намёк: word[0] — «Г», word[3] — «д». Добавь второй шаг.",
      "Псевдокод: print + 2× move_right().",
      "Решение:\nword = \"Грид\"\nprint(word[0] + word[3])\nmove_right()\nmove_right()"
    ],
    solution: 'word = "Грид"\nprint(word[0] + word[3])\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 32, title: "Срез", topic: "срез s[a:b]", book: "6.5.2",
    briefing: "§6.5.2: срез берёт кусок: word[0:5] — первые пять символов. Вырежь «Маяки».",
    lore: "Срез точен, как лазер.",
    goal: "Выведи «Маяки» и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["Маяки"],
    starter: 'word = "Маяки горят"\nprint(word[0:5])\nmove_right()\n',
    hints: [
      "Намёк: символы 0–4 — это «Маяки». Добавь второй шаг.",
      "Псевдокод: print + 2× move_right().",
      "Решение:\nword = \"Маяки горят\"\nprint(word[0:5])\nmove_right()\nmove_right()"
    ],
    solution: 'word = "Маяки горят"\nprint(word[0:5])\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 33, title: "Склейка и повтор", topic: "конкатенация и *", book: "6.5.3/6.5.5",
    briefing: "§6.5.3 и §6.5.5: строки склеиваются через +, а умножаются — в повтор. Три «Ха» и «Код!».",
    lore: "Повторяй. Умножай. Побеждай.",
    goal: "Выведи оба слова и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["ХаХаХа", "Код!"],
    starter: 'print("Ха" * 3)\nprint("Код" + "!")\nmove_right()\n',
    hints: [
      "Намёк: оба слова уже готовы. Добавь второй шаг.",
      "Псевдокод: два print + 2× move_right().",
      "Решение:\nprint(\"Ха\" * 3)\nprint(\"Код\" + \"!\")\nmove_right()\nmove_right()"
    ],
    solution: 'print("Ха" * 3)\nprint("Код" + "!")\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 34, title: "Поиск в строке", topic: "in и isalpha()", book: "6.5.4/6.10",
    briefing: "§6.5.4 и §6.10: проверь, есть ли «я» в слове «маяк», и все ли символы — буквы.",
    lore: "Ищи знак в строке, как друга в толпе.",
    goal: "Выведи два True и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["True", "True"],
    starter: 's = "маяк"\nprint("я" in s)\nprint(s.isalpha())\nmove_right()\n',
    hints: [
      "Намёк: обе проверки дают True. Добавь второй шаг.",
      "Псевдокод: два print + 2× move_right().",
      "Решение:\ns = \"маяк\"\nprint(\"я\" in s)\nprint(s.isalpha())\nmove_right()\nmove_right()"
    ],
    solution: 's = "маяк"\nprint("я" in s)\nprint(s.isalpha())\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 35, title: "Регистр", topic: "upper()/lower()", book: "6.7/6.9",
    briefing: "§6.7 и §6.9: приказы пишут капсом. Подними «маяк» в верхний регистр, опусти «роЙ».",
    lore: "Большие буквы — для приказов.",
    goal: "Выведи оба слова и дойди до 🌀.",
    map: ["#####", "#P.X#", "#####"],
    energy: 20, maxTurns: 12, expect: ["МАЯК", "рой"],
    starter: 's = "  маяк  "\nprint(s.strip().upper())\nprint("роЙ".lower())\nmove_right()\n',
    hints: [
      "Намёк: strip() срезает пробелы, upper() поднимает. Добавь второй шаг.",
      "Псевдокод: два print + 2× move_right().",
      "Решение:\ns = \"  маяк  \"\nprint(s.strip().upper())\nprint(\"роЙ\".lower())\nmove_right()\nmove_right()"
    ],
    solution: 's = "  маяк  "\nprint(s.strip().upper())\nprint("роЙ".lower())\nmove_right()\nmove_right()',
    starTurns: 2
  },
  {
    id: 36, title: "Шифр Владыки", topic: "босс: ord()/chr()", book: "6.11",
    briefing: "§6.11 из учебника: Владыка шифрует приказы сдвигом на 1 (Цезарь). Расшифруй «Лпе», одолей стражу.",
    lore: "Шифр Владыки. Ключ — единица. Да пребудет с тобой Код.",
    goal: "Расшифруй слово, одолей стражу, дойди до 🌀.",
    map: ["########", "#P.E..X#", "########"],
    energy: 20, maxTurns: 16, expect: ["Код"], biome: "lava", place: "Пепел Роя",
    starter: 'coded = "Лпе"\nkey = 1\nresult = ""\nfor i in range(len(coded)):\n    result = result + chr(ord(coded[i]) - key)\nprint(result)\nmove_right()\nattack("right")\n',
    hints: [
      "Намёк: цикл уже расшифровывает («Код»). После: шаг, удар, четыре шага.",
      "Псевдокод: цикл + шаг + удар + 4 шага.",
      "Решение:\ncoded = \"Лпе\"\nkey = 1\nresult = \"\"\nfor i in range(len(coded)):\n    result = result + chr(ord(coded[i]) - key)\nprint(result)\nmove_right()\nattack(\"right\")\nmove_right()\nmove_right()\nmove_right()\nmove_right()"
    ],
    solution: 'coded = "Лпе"\nkey = 1\nresult = ""\nfor i in range(len(coded)):\n    result = result + chr(ord(coded[i]) - key)\nprint(result)\nmove_right()\nattack("right")\nmove_right()\nmove_right()\nmove_right()\nmove_right()',
    starTurns: 6
  }
];
