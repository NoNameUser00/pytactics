/* Уровни PyTactics: карта, брифинг, стартовый код, подсказки, решения.
   Карта: строки символов: # стена, . пол, P игрок, E враг, C кристалл, X выход */
window.LEVELS = [
  {
    id: 1, title: "Первый шаг", topic: "Команды · линейный алгоритм",
    briefing: "Станция «ГРИД» в темноте. Твой робот 🤖 стоит слева, портал 🌀 — справа. Пока просто иди: каждая команда move_* — это один ход. Дойди до портала.",
    lore: "Да пребудет с тобой Код. Маяк ждёт справа.",
    goal: "Дойди до 🌀 за ≤ 8 ходов.",
    map: ["#######", "#P...X#", "#.....#", "#######"],
    energy: 20, maxTurns: 20,
    starter: '# Твой первый код!\n# Каждая строка — приказ роботу.\nmove_right()\nmove_right()\n',
    hints: [
      "Намёк: от P до X — 4 клетки вправо. Нужно 4 раза move_right().",
      "Псевдокод:\nmove_right()\nmove_right()\nmove_right()\nmove_right()",
      "Решение:\nmove_right()\nmove_right()\nmove_right()\nmove_right()"
    ],
    solution: 'move_right()\nmove_right()\nmove_right()\nmove_right()',
    starTurns: 4
  },
  {
    id: 2, title: "Кристаллы", topic: "Переменные · print()",
    briefing: "Энергокристаллы 💎 питают станцию. Встань на кристалл и вызови collect(). Попробуй переменную: energy = get_energy() и print(energy). Собери 2 кристалла и иди на выход.",
    lore: "Ядра — сердце маяков. Без них сектор погрузится во тьму.",
    goal: "Собери 2 💎 и дойди до 🌀.",
    map: ["########", "#P.C.CX.#", "#......#", "########"],
    energy: 20, maxTurns: 20,
    starter: '# Встань на кристалл и забери его\nmove_right()\nmove_right()\ncollect()\n',
    hints: [
      "Намёк: кристаллы на 3-й и 5-й клетках. Схема: иди → забери → иди → забери → иди.",
      "Псевдокод:\nmove_right()\nmove_right()\ncollect()\nmove_right()\nmove_right()\ncollect()\nmove_right()",
      "Решение:\nmove_right()\nmove_right()\ncollect()\nmove_right()\nmove_right()\ncollect()\nmove_right()"
    ],
    solution: 'move_right()\nmove_right()\ncollect()\nmove_right()\nmove_right()\ncollect()\nmove_right()',
    starTurns: 7
  },
  {
    id: 3, title: "Стена", topic: "if / else · ветвление",
    briefing: "Впереди завал. Сенсор is_wall(\"up\"/\"down\"/\"left\"/\"right\") говорит True/False. Научи робота решать: если справа стена — иди вниз, иначе — вправо. Это ветвление!",
    lore: "Империя Роя обрушила переборку. Чувствуй ветвление, юный падаван.",
    goal: "Обойди стену и собери 💎.",
    map: ["########", "#P.#..X#", "#..#.C.#", "#.....##", "########"],
    energy: 30, maxTurns: 30,
    starter: '# Используй if / else\nif is_wall("right"):\n    move_down()\nelse:\n    move_right()\n',
    hints: [
      "Намёк: повторяй связку «проверь → шаг». Сначала спустись вниз, потом иди вправо вдоль низа.",
      "Псевдокод:\nmove_down()\nmove_down()\nmove_right()\nmove_right()\nmove_right()\nmove_up()\ncollect()\n…",
      "Решение: спустись на 2 вниз, иди вправо 4 раза, поднимись, забери кристалл, иди к выходу. Собери из move_down/move_right/move_up/collect."
    ],
    solution: 'move_down()\nmove_down()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_up()\ncollect()\nmove_up()\nmove_right()',
    starTurns: 12
  },
  {
    id: 4, title: "Длинный коридор", topic: "for i in range()",
    briefing: "Коридор длиной 6 клеток. Писать 6 раз move_right() — скучно. Цикл for повторит команду: for i in range(6): + отступ 4 пробела. Компьютер любит циклы!",
    lore: "Длинный коридор. Операторы не повторяют — они циклуют.",
    goal: "Пройди коридор циклом for.",
    map: ["##########", "#P......X#", "##########"],
    energy: 20, maxTurns: 20,
    starter: '# Цикл повторяет тело N раз\nfor i in range(7):\n    move_right()\n',
    hints: [
      "Намёк: посчитай клетки от P до X — их 7. range(7) даёт 0..6, то есть 7 повторов.",
      "Псевдокод:\nfor i in range(7):\n    move_right()",
      "Решение:\nfor i in range(7):\n    move_right()"
    ],
    solution: 'for i in range(7):\n    move_right()',
    starTurns: 7
  },
  {
    id: 5, title: "Лабиринт", topic: "while · and/or/not",
    briefing: "Выход далеко, число шагов неизвестно — нужен цикл while: «пока не у выхода — иди». Сенсор is_exit(\"right\") подскажет. Комбинируй: while not is_exit(\"right\"): ... Это цикл с условием!",
    lore: "Пояс астероидов шепчет: считай ходы, или блуждать вечно.",
    goal: "Дойди до 🌀 циклом while, собери 💎.",
    map: ["#########", "#P..#..X#", "#.C.#.#.#", "#.......#", "#########"],
    energy: 40, maxTurns: 40,
    starter: '# Спустись за кристаллом, потом обойди стену низом\nmove_down()\nmove_right()\ncollect()\n',
    hints: [
      "Намёк: кристалл рядом — спустись и шагни вправо. Затем спустись ещё ниже и обойди стену-колонну низом.",
      "Псевдокод:\nmove_down()\nmove_right()\ncollect()\nmove_down()\nfor i in range(5):\n    move_right()\nmove_up()\nmove_up()",
      "Решение:\nmove_down()\nmove_right()\ncollect()\nmove_down()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_up()\nmove_up()"
    ],
    solution: 'move_down()\nmove_right()\ncollect()\nmove_down()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_up()\nmove_up()',
    starTurns: 11
  },
  {
    id: 6, title: "Вирусы", topic: "def · функции · attack",
    briefing: "Вирусы 👾! Подойди вплотную и бей: attack(\"right\"). Чтобы не повторяться, упакуй приём в функцию: def бей_справа(): + вызов. Функция = твой собственный приказ!",
    lore: "Баг-штурмовики! Рррх уже рычит от нетерпения.",
    goal: "Уничтожь 2 вирусов и дойди до 🌀.",
    map: ["#########", "#P.E.E.X#", "#.......#", "#########"],
    energy: 30, maxTurns: 30,
    starter: '# Определи функцию и вызови её\ndef strike():\n    move_right()\n    attack("right")\n\nstrike()\n',
    hints: [
      "Намёк: схема на каждого вируса: подойди (move_right) → удар attack(\"right\") → шаг вперёд на его клетку.",
      "Псевдокод:\ndef kill():\n    attack(\"right\")\n    move_right()\nmove_right()\nkill()\nmove_right()\nkill()\nmove_right()\nmove_right()",
      "Решение:\nmove_right()\nattack(\"right\")\nmove_right()\nmove_right()\nattack(\"right\")\nmove_right()\nmove_right()\nmove_right()"
    ],
    solution: 'move_right()\nattack("right")\nmove_right()\nmove_right()\nattack("right")\nmove_right()\nmove_right()\nmove_right()',
    starTurns: 8
  },
  {
    id: 7, title: "Жадный сбор", topic: "Вложенные циклы · жадный алгоритм",
    briefing: "Кристаллов много! Жадный алгоритм: «всегда иди к ближайшему 💎». Используй вложенные проверки is_crystal(направление) и цикл while crystals_left() > 0: внутри — if-лесенка. Это уже настоящая стратегия!",
    lore: "Ядра разметало взрывом. Бери ближайшее — жадность тут светлая.",
    goal: "Собери 3 💎 и дойди до 🌀.",
    map: ["##########", "#P..C...X#", "#.##.##..#", "#C.....C.#", "##########"],
    energy: 40, maxTurns: 40,
    starter: '# Пока есть кристаллы — ищи и собирай\nwhile crystals_left() > 0:\n    move_right()\n    if is_crystal("right"):\n        move_right()\n        collect()\n',
    hints: [
      "Намёк: иди «змейкой»: верхняя строка вправо до 💎, спустись на 2, вернись влево за вторым 💎, потом вправо по низу за третьим.",
      "Псевдокод:\nfor i in range(3):\n    move_right()\ncollect()\nmove_down()\nmove_down()\nfor i in range(3):\n    move_left()\ncollect()\n…",
      "Решение:\nmove_right()\nmove_right()\nmove_right()\ncollect()\nmove_down()\nmove_down()\nmove_left()\nmove_left()\nmove_left()\ncollect()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\ncollect()\nmove_up()\nmove_up()\nmove_right()"
    ],
    solution: 'move_right()\nmove_right()\nmove_right()\ncollect()\nmove_down()\nmove_down()\nmove_left()\nmove_left()\nmove_left()\ncollect()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\ncollect()\nmove_up()\nmove_up()\nmove_right()',
    starTurns: 20
  },
  {
    id: 8, title: "Босс: Рой", topic: "Поиск пути · BFS-идея",
    briefing: "ФИНАЛ. Рой 👾👾👾 патрулирует, кристаллы за стенами. Лучшие операторы ищут кратчайший путь волной (BFS): «разойдись от старта во все стороны, первое касание выхода — кратчайший путь». Здесь пройди аккуратно: бей только вплотную, считай энергию. Удачи, оператор!",
    lore: "Узел Роя. ВЛАДЫКА БАГ ждёт за стеной. Зажги последний маяк.",
    goal: "Собери 2 💎, уничтожь рой, дойди до 🌀.",
    map: ["##########", "#P.#..B.X#", "#..#.##..#", "#C.#.....#", "#..###E..#", "#C....E..#", "##########"],
    energy: 50, maxTurns: 60,
    starter: '# Финальная стратегия\n# 1. вниз за кристаллами  2. низом вправо  3. вверх с боем\nmove_down()\nmove_down()\ncollect()\n',
    hints: [
      "Намёк: два кристалла слева внизу (вниз-вниз-collect, вниз-вниз-collect). Потом низом вправо, убей двух охранников (attack вплотную) и поднимись справа к порталу.",
      "Псевдокод (идея BFS — иди волной без возвратов):\n# этап 1: кристаллы\nmove_down()...\n# этап 2: коридор\nfor ...: move_right() + attack при is_enemy",
      "Решение: вниз×2, collect, вниз×2, collect, вправо×4, attack+шаг (×2), вправо, вверх×3, attack влево, вправо к выходу."
    ],
    solution: 'move_down()\nmove_down()\ncollect()\nmove_down()\nmove_down()\ncollect()\nmove_right()\nmove_right()\nmove_right()\nmove_right()\nattack("right")\nmove_right()\nattack("up")\nmove_up()\nmove_right()\nmove_up()\nmove_up()\nmove_up()\nattack("left")\nmove_right()',
    starTurns: 22
  }
];
