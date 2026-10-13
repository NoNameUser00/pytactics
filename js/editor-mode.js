/* (c) 2026 NoNameUser00. All rights reserved. See LICENSE. */
/* editor-mode.js — свой режим CodeMirror поверх Python.

   Зачем: в стандартном режиме вызовы команд игры (forward, dot, is_wall)
   подсвечиваются как обычные переменные — тем же цветом, что и слова ученика.
   Глаз не отличает «это команда движка» от «это моя переменная», а разница
   главная: команда знакомая, переменная своя.

   Как сделано: берём настоящий python-токенизатор и обрамляем его. Свой
   обработчик вызывается только на границах токенов, поэтому он безопасно
   перехватывает имя-команду и отдаёт свой класс цвета. Всё остальное
   (f-строки, docstring, числа, комментарии) разбирает сам Python.

   Регистрация именно такая: сначала имя режима с фабрикой, потом MIME со
   строкой-именем. CodeMirror 5.65 ищет фабрику по имени (modes[spec.name]),
   поэтому defineMIME с готовым объектом-режимом не срабатывает: редактор
   молча уходит в режим "null", и подсветки нет вообще.

   Схема «поверх» вместо CodeMirror.overlayParser: в сборке 5.65.16 этот
   помощник наружу не экспортирован, а своя обёртка работает везде. */
(function () {
  "use strict";
  var CM = window.CodeMirror;
  if (!CM || !CM.modes || !CM.modes.python) return;

  var GAME_API = [
    /* движение и повороты */
    "forward", "fd", "backward", "bk", "left", "lt", "right", "rt",
    "goto", "circle", "setheading", "seth", "position", "pos", "heading",
    "home", "dot", "penup", "pu", "up", "pendown", "pd", "down",
    "hideturtle", "showturtle",
    /* сенсоры */
    "is_wall", "is_enemy", "is_crystal", "is_exit",
    "x", "y", "energy", "crystals_left",
    /* бой и старая механика */
    "attack", "collect", "wait",
    "move_up", "move_down", "move_left", "move_right",
    "get_x", "get_y", "get_energy"
  ];
  var isApi = {};
  GAME_API.forEach(function (n) { isApi[n] = 1; });

  var NAME_RE = /^[A-Za-z_]\w*/;
  var CALL_RE = /^\s*\(/;

  /* Оборачиваем токенизатор python: если впереди имя команды и сразу скобка —
     отдаём свой класс, иначе работает настоящий Python. */
  function makeToken(python) {
    return function (stream, state) {
      var rest = stream.string.slice(stream.pos);
      var m = NAME_RE.exec(rest);
      if (m && isApi[m[0]] && CALL_RE.test(rest.slice(m[0].length))) {
        stream.pos += m[0].length;
        return "cm-builtin";
      }
      return python.token(stream, state);
    };
  }

  try {
    CM.defineMode("pytactics", function (options) {
      var python = CM.getMode(options, "python");
      return {
        startState: function (base) { return python.startState(base); },
        copyState: python.copyState,
        token: makeToken(python),
        indent: python.indent,
        electricInput: python.electricInput,
        lineComment: python.lineComment,
        blockCommentStart: python.blockCommentStart,
        blockCommentEnd: python.blockCommentEnd,
        helperType: "python",
        closeBrackets: "()[]{}\"''",
        fold: "indent"
      };
    });
    CM.defineMIME("text/x-pytactics", "pytactics");
  } catch (e) {
    /* если что-то пошло не так — оставляем обычный python, игра не сломается */
    CM.defineMIME("text/x-pytactics", "python");
  }
})();