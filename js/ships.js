/* ships.js — по кораблю каждому пилоту. Вид строго с хвоста сверху:
   нос вверх (улетает вглубь экрана), двигатели и хвост крупные внизу.
   Весь арт оригинальный. window.ship(id) по id робота. */
window.SHIPS = {
"bolt": '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="24" cy="86" rx="5" ry="7" fill="#39e6ff"/><ellipse class="engine" cx="40" cy="86" rx="5" ry="7" fill="#39e6ff"/><rect x="19" y="66" width="9" height="16" rx="3" fill="#1f6feb"/><rect x="36" y="66" width="9" height="16" rx="3" fill="#1f6feb"/><path d="M32 4 L44 38 L40 74 L24 74 L20 38 Z" fill="#2b6cb0" stroke="#9fd8ff" stroke-width="2" stroke-linejoin="round"/><ellipse cx="32" cy="30" rx="7" ry="10" fill="#bfe9ff" stroke="#0b3b66" stroke-width="1.5"/><rect x="24" y="48" width="16" height="4" rx="2" fill="#9fd8ff"/></svg>',
"magnet": '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="32" cy="87" rx="7" ry="7" fill="#ffb454"/><rect x="14" y="46" width="36" height="30" rx="6" fill="#7a3b2e" stroke="#f778ba" stroke-width="2"/><rect x="14" y="52" width="36" height="4" fill="#5b2440"/><line x1="20" y1="46" x2="14" y2="20" stroke="#8a6a3a" stroke-width="4"/><line x1="44" y1="46" x2="50" y2="20" stroke="#8a6a3a" stroke-width="4"/><path d="M10 12 h8 v7 a4 4 0 0 1 -8 0 Z" fill="#e63946"/><path d="M46 12 h8 v7 a4 4 0 0 1 -8 0 Z" fill="#e63946"/><circle cx="32" cy="61" r="6" fill="#22323f" stroke="#f778ba" stroke-width="2"/></svg>',
"yula": '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="32" cy="88" rx="4" ry="7" fill="#f778ba"/><polygon points="32,2 38,60 32,78 26,60" fill="#8b5cf6" stroke="#d2a8ff" stroke-width="2" stroke-linejoin="round"/><polygon points="26,52 8,80 26,74" fill="#6d28d9"/><polygon points="38,52 56,80 38,74" fill="#6d28d9"/><ellipse cx="32" cy="34" rx="4" ry="9" fill="#bfe9ff"/></svg>',
"hvat": '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="16" cy="84" rx="5" ry="7" fill="#ffd60a"/><ellipse class="engine" cx="32" cy="88" rx="6" ry="7" fill="#ff9e3d"/><ellipse class="engine" cx="48" cy="84" rx="5" ry="7" fill="#ffd60a"/><rect x="10" y="40" width="44" height="36" rx="8" fill="#8a5a2b" stroke="#ffd60a" stroke-width="2"/><rect x="10" y="52" width="44" height="5" fill="#5b3a17"/><circle cx="22" cy="34" r="6" fill="#6b7280" stroke="#ffd60a" stroke-width="1.5"/><circle cx="42" cy="34" r="6" fill="#6b7280" stroke="#ffd60a" stroke-width="1.5"/><polygon points="32,4 40,30 24,30" fill="#6b7280" stroke="#ffd60a" stroke-width="1.5"/></svg>',
"om": '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="32" cy="87" rx="6" ry="7" fill="#a3e635"/><path d="M6 60 Q32 34 58 60 L52 78 Q32 60 12 78 Z" fill="#14532d" stroke="#4ade80" stroke-width="2" stroke-linejoin="round"/><rect x="26" y="40" width="12" height="36" rx="6" fill="#1d5c38" stroke="#4ade80" stroke-width="2"/><circle cx="32" cy="26" r="7" fill="#86efac" stroke="#052e16" stroke-width="1.5"/><circle cx="32" cy="52" r="3" fill="#a3e635"/></svg>',
"slip": '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="24" cy="87" rx="7" ry="7" fill="#ff9e3d"/><ellipse class="engine" cx="44" cy="80" rx="4" ry="6" fill="#ffd60a"/><rect x="12" y="42" width="26" height="34" rx="7" fill="#c2410c" stroke="#ffd60a" stroke-width="2"/><rect x="40" y="30" width="12" height="42" rx="6" fill="#9a3412" stroke="#ffd60a" stroke-width="1.5"/><circle cx="46" cy="38" r="4" fill="#bfe9ff" stroke="#5b21b6" stroke-width="1.5"/><polygon points="12,42 4,60 12,66" fill="#7c2d12"/><rect x="16" y="58" width="18" height="4" rx="2" fill="#ffd60a"/></svg>',
"dorn": '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="24" cy="86" rx="5" ry="7" fill="#79c0ff"/><ellipse class="engine" cx="40" cy="86" rx="5" ry="7" fill="#79c0ff"/><polygon points="32,6 46,44 40,76 24,76 18,44" fill="#5b6b7c" stroke="#dfe9f2" stroke-width="2" stroke-linejoin="round"/><polygon points="18,44 8,70 20,66" fill="#334155"/><polygon points="46,44 56,70 44,66" fill="#334155"/><rect x="27" y="30" width="10" height="6" rx="2" fill="#0b1526"/><rect x="30" y="30" width="4" height="16" fill="#0b1526"/><rect x="28" y="56" width="8" height="4" rx="2" fill="#39e6ff"/></svg>',
"zix": '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="32" cy="88" rx="5" ry="7" fill="#4de3c2"/><polygon points="32,2 38,50 26,50" fill="#0f766e" stroke="#4de3c2" stroke-width="2" stroke-linejoin="round"/><line x1="32" y1="50" x2="14" y2="78" stroke="#0f766e" stroke-width="5"/><line x1="32" y1="50" x2="50" y2="78" stroke="#0f766e" stroke-width="5"/><circle cx="14" cy="80" r="4" fill="#4de3c2"/><circle cx="50" cy="80" r="4" fill="#4de3c2"/><circle cx="32" cy="30" r="5" fill="#d3f9e3" stroke="#0f766e" stroke-width="1.5"/><circle cx="26" cy="52" r="2.5" fill="#f472b6"/><circle cx="38" cy="52" r="2.5" fill="#f472b6"/></svg>',
"alda": '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="32" cy="87" rx="6" ry="7" fill="#ffe29a"/><ellipse cx="32" cy="58" rx="20" ry="7" fill="none" stroke="#ffd166" stroke-width="3"/><polygon points="32,4 40,52 36,76 28,76 24,52" fill="#f8fafc" stroke="#ffd166" stroke-width="2" stroke-linejoin="round"/><line x1="32" y1="10" x2="32" y2="70" stroke="#e63946" stroke-width="2"/><circle cx="32" cy="30" r="4" fill="#ffd166"/></svg>',
"glaz": '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="32" cy="88" rx="5" ry="6" fill="#f87171"/><circle cx="32" cy="58" r="13" fill="#3b82f6" stroke="#bfdbfe" stroke-width="2"/><circle cx="32" cy="58" r="5" fill="#111" stroke="#f87171" stroke-width="1.5"/><line x1="32" y1="45" x2="32" y2="22" stroke="#bfdbfe" stroke-width="3"/><path d="M22 22 A13 13 0 0 1 42 22" fill="none" stroke="#bfdbfe" stroke-width="2.5"/><line x1="22" y1="52" x2="14" y2="72" stroke="#bfdbfe" stroke-width="2.5"/><line x1="42" y1="52" x2="50" y2="72" stroke="#bfdbfe" stroke-width="2.5"/></svg>'
};
window.ship = function (id) {
  return window.SHIPS[id] || window.SHIPS.bolt || "";
};
/* Верфь: корабли на выбор (вид с хвоста, нос вверх). Без выбора — корабль пилота. */
window.SHIPYARD = [
  {
    id: "strela", name: "Стрела", title: "лёгкий перехватчик", color: "#e63946",
    desc: "Самый быстрый корпус Грида. Тормозит только об сюжет.",
    svg: '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="32" cy="88" rx="4" ry="7" fill="#ffd60a"/><polygon points="32,2 37,62 32,78 27,62" fill="#e8edf3" stroke="#e63946" stroke-width="2" stroke-linejoin="round"/><line x1="32" y1="8" x2="32" y2="70" stroke="#e63946" stroke-width="2"/><polygon points="27,58 16,76 27,72" fill="#9fb3c8"/><polygon points="37,58 48,76 37,72" fill="#9fb3c8"/><circle cx="32" cy="36" r="3.5" fill="#1c1007" stroke="#ffd60a" stroke-width="1.5"/></svg>'
  },
  {
    id: "bliznetsy", name: "Близнецы", title: "двухкорпусный паром", color: "#39c5cf",
    desc: "Два корпуса, ноль споров, кто моет иллюминаторы.",
    svg: '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="17" cy="86" rx="4" ry="6" fill="#39e6ff"/><ellipse class="engine" cx="47" cy="86" rx="4" ry="6" fill="#39e6ff"/><rect x="12" y="30" width="10" height="48" rx="5" fill="#2b6cb0" stroke="#9fd8ff" stroke-width="2"/><rect x="42" y="30" width="10" height="48" rx="5" fill="#2b6cb0" stroke="#9fd8ff" stroke-width="2"/><rect x="12" y="44" width="40" height="9" rx="3" fill="#1f6feb" stroke="#9fd8ff" stroke-width="1.5"/><circle cx="32" cy="48" r="3.5" fill="#bfe9ff"/><polygon points="12,30 17,14 22,30" fill="#9fd8ff"/><polygon points="42,30 47,14 52,30" fill="#9fd8ff"/></svg>'
  },
  {
    id: "blyudtse", name: "Блюдце", title: "дисковый разведчик", color: "#a371f7",
    desc: "Его путают с НЛО. Он не против — так проще пролететь посты.",
    svg: '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="22" cy="70" rx="3.5" ry="5" fill="#f778ba"/><ellipse class="engine" cx="32" cy="73" rx="3.5" ry="5" fill="#f778ba"/><ellipse class="engine" cx="42" cy="70" rx="3.5" ry="5" fill="#f778ba"/><ellipse cx="32" cy="52" rx="24" ry="12" fill="#8ab4ff" stroke="#d2a8ff" stroke-width="2"/><ellipse cx="32" cy="46" rx="10" ry="7" fill="#5b21b6" stroke="#d2a8ff" stroke-width="1.5"/><circle cx="14" cy="52" r="2" fill="#ffe16a"/><circle cx="50" cy="52" r="2" fill="#ffe16a"/><circle cx="32" cy="60" r="2" fill="#ffe16a"/></svg>'
  },
  {
    id: "molot", name: "Молот", title: "таранный фрегат", color: "#ff7a3d",
    desc: "Переговоры ведёт носом. Нос широкий, аргументы весомые.",
    svg: '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="24" cy="87" rx="6" ry="7" fill="#ff9e3d"/><ellipse class="engine" cx="40" cy="87" rx="6" ry="7" fill="#ff9e3d"/><rect x="8" y="16" width="48" height="13" rx="6" fill="#9a3412" stroke="#ffb454" stroke-width="2"/><rect x="26" y="29" width="12" height="16" fill="#7c2d12"/><polygon points="22,45 42,45 38,74 26,74" fill="#c2410c" stroke="#ffb454" stroke-width="2"/><rect x="29" y="56" width="6" height="10" rx="2" fill="#3b0a0a"/></svg>'
  },
  {
    id: "osa", name: "Оса", title: "патрульный жальщик", color: "#ffd60a",
    desc: "Жалит вирусы с двух рук. Полосатая — значит, быстрая.",
    svg: '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="32" cy="88" rx="4" ry="7" fill="#ff4d4d"/><rect x="28" y="10" width="8" height="66" rx="4" fill="#3a3a1a" stroke="#ffd60a" stroke-width="2"/><rect x="28" y="22" width="8" height="5" fill="#ffd60a"/><rect x="28" y="36" width="8" height="5" fill="#ffd60a"/><rect x="28" y="50" width="8" height="5" fill="#ffd60a"/><line x1="28" y1="30" x2="10" y2="58" stroke="#3a3a1a" stroke-width="5"/><line x1="36" y1="30" x2="54" y2="58" stroke="#3a3a1a" stroke-width="5"/><circle cx="10" cy="60" r="3.5" fill="#ff4d4d"/><circle cx="54" cy="60" r="3.5" fill="#ff4d4d"/><circle cx="32" cy="16" r="3" fill="#bfe9ff"/></svg>'
  },
  {
    id: "kovcheg", name: "Ковчег", title: "тяжёлый транспорт", color: "#4de3c2",
    desc: "Везёт всё: ядра, дроидов и твои несобранные звёзды.",
    svg: '<svg viewBox="0 0 64 96"><ellipse class="engine" cx="16" cy="85" rx="4" ry="6" fill="#4de3c2"/><ellipse class="engine" cx="27" cy="88" rx="4" ry="6" fill="#4de3c2"/><ellipse class="engine" cx="37" cy="88" rx="4" ry="6" fill="#4de3c2"/><ellipse class="engine" cx="48" cy="85" rx="4" ry="6" fill="#4de3c2"/><rect x="12" y="26" width="40" height="50" rx="9" fill="#0f766e" stroke="#4de3c2" stroke-width="2"/><rect x="17" y="34" width="30" height="7" rx="2" fill="#134e4a"/><rect x="17" y="45" width="30" height="7" rx="2" fill="#134e4a"/><rect x="17" y="56" width="30" height="7" rx="2" fill="#134e4a"/><polygon points="32,6 42,26 22,26" fill="#0f766e" stroke="#4de3c2" stroke-width="1.5"/></svg>'
  }
];
window.shipById = function (id) {
  for (var i = 0; i < window.SHIPYARD.length; i++) {
    if (window.SHIPYARD[i].id === id) return window.SHIPYARD[i].svg;
  }
  return "";
};
/* Корабль для прыжка: выбранный на верфи, иначе — корабль пилота */
window.currentShip = function () {
  var id = null;
  try { id = localStorage.getItem("pytactics_ship"); } catch (e) {}
  if (id) {
    var s = window.shipById(id);
    if (s) return s;
  }
  var rid = "bolt";
  try {
    rid = localStorage.getItem("pytactics_robot") || "bolt";
    if (window.currentRobot) rid = window.currentRobot().id;
  } catch (e) {}
  return window.ship(rid);
};
