/* Ангар: дроиды-помощники оператора. Выбор purely cosmetic (на баланс не влияет),
   хранится локально (pytactics_robot). */
window.ROBOTS = [
  {
    id: "bolt", emoji: "🤖", name: "Бип", title: "астромеханик", color: "#39c5cf",
    desc: "Гудит на бинарном, чинит маяки отвёрткой и верой в Светлую сторону. Проснулся первым."
  },
  {
    id: "magnet", emoji: "🧲", name: "Скрэп", title: "падаван-сборщик", color: "#f778ba",
    desc: "Вырос на свалке Звезды Багов. Чует энергоядра за три коридора."
  },
  {
    id: "yula", emoji: "🛸", name: "Комета", title: "развед-корабль", color: "#a371f7",
    desc: "Прорвалась через пояс астероидов «за 12 ходов». Стены считает личным оскорблением."
  },
  {
    id: "hvat", emoji: "🦾", name: "Рррх", title: "мохнатый механик", color: "#ffd60a",
    desc: "Рычит на баг-штурмовиков. Штурмовики рычат в ответ. Потом разбегаются."
  }
];
window.currentRobot = function () {
  var id = null;
  try { id = localStorage.getItem("pytactics_robot"); } catch (e) {}
  for (var i = 0; i < window.ROBOTS.length; i++) {
    if (window.ROBOTS[i].id === id) return window.ROBOTS[i];
  }
  return window.ROBOTS[0];
};
