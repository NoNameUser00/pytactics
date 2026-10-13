/* (c) 2026 NoNameUser00. All rights reserved. See LICENSE. */
/* pyodide-engine.js — настоящий Python в браузере.

   Движок берёт тот же интерфейс, что и py_engine.js (run(code, api, opts)),
   поэтому game.js и rules.js работают без переписывания. Разница в подходе:
   это CPython 3.14, собранный в WebAssembly (Pyodide), а не свой
   мини-интерпретатор — значит у ученика настоящие f-строки, классы,
   comprehensions, исключения и вся стандартная библиотека.

   Настоящий turtle в браузере невозможен: он рисует через tkinter, а tkinter
   в WebAssembly нет. Поэтому модуль turtle пишем сами на JS и отдаём
   Python через registerJsModule: синтаксис и смысл команд — настоящие,
   «рисование» идёт на игровое поле.

   Ограничения по безопасности и по времени:
   - каждый ход тратит игровой ход, поэтому бесконечный while True упирается
     в maxTurns и останавливается сам;
   - код, который вообще не трогает поле, всё равно может зависнуть — за этим
     следит таймер прерывания (см. WATCHDOG_MS). */
window.PyRunner = (function () {
  "use strict";

  var VERSION = "314.0.7";          // совпадает с get-pyodide.js
  var INDEX_URL = "vendor/pyodide/";
  var WATCHDOG_MS = 8000;           // если код идёт дольше — считаем это зависанием
  var MAX_TURNS_GUARD = 400;        // страховка, если лимит ходов не сработал

  var pyPromise = null;             // один раз грузим Pyodide и держим
  var state = null;                 // текущий запуск: api, halted, цвет пера
  var stdoutAll = [];               // весь вывод подряд; каждый запуск берёт свой кусок

  /* ---------- загрузка ---------- */
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = function () { rej(new Error("не скачался " + src)); };
      document.head.appendChild(s);
    });
  }

  function ready() {
    if (pyPromise) return pyPromise;
    pyPromise = (async function () {
      if (!window.loadPyodide) await loadScript(INDEX_URL + "pyodide.js");
      if (!window.loadPyodide) throw new Error("Pyodide не загрузился");
      var py = await window.loadPyodide({ indexURL: INDEX_URL });
      py.pyodideVersion = VERSION;
      /* вывод модулей (например print из импортированного файла) тоже собираем */
      py.setStdout({ batched: function (s) { stdoutAll.push(s); } });
      py.setStderr({ batched: function (s) { stdoutAll.push(s); } });
      return py;
    })().catch(function (e) {
      pyPromise = null;
      throw e;
    });
    return pyPromise;
  }

  /* Предупреждаем, что Python ещё грузится: первый запуск ждёт 13 МБ. */
  function warmup() {
    if (window.PyRunner.__warming) return pyPromise;
    window.PyRunner.__warming = true;
    return ready().then(function () { return true; }, function () { return false; });
  }

  /* ---------- мост: команды робота ---------- */
  function bridge(api) {
    function guard(name, fn, args) {
      if (!state) throw new Error("нет запуска");
      if (state.steps > MAX_TURNS_GUARD) { state.halted = { win: false, reason: "Слишком много ходов — похоже на бесконечный цикл." }; throw new HaltError(); }
      try {
        return fn.apply(null, args || []);
      } catch (e) {
        // game.js сообщает конец боя особой меткой — это не ошибка
        if (e && e.__halt) { state.halted = { win: e.win, reason: e.reason }; throw new HaltError(); }
        if (e && e.pyError) { state.pyError = e; throw new HaltError(); }
        throw e;
      }
    }
    var mod = {};
    Object.keys(api).forEach(function (name) {
      if (name === "__print") return;                 // print ловим отдельно
      mod[name] = function () { return guard(name, api[name], arguments); };
    });
    return mod;
  }

  function HaltError() { this.name = "RobotStop"; this.message = "robot stop"; }
  HaltError.prototype = Object.create(Error.prototype);

  /* ---------- turtle: настоящий синтаксис, наша арена ---------- */
  var DIRS = { 0: [1, 0], 90: [0, -1], 180: [-1, 0], 270: [0, 1] }; // вверх = минус y

  function turn(api) {
    var head = state.head;
    var d = DIRS[head] || DIRS[0];
    var names = { "1,0": "right", "0,-1": "up", "-1,0": "left", "0,1": "down" };
    return names[d[0] + "," + d[1]];
  }

  /* Приведение к числу. Важно: Python приходит в JS объектом-прокси, и Number()
     на нём даёт NaN — команда молча превращалась в ноль шагов. Поэтому сначала
     пробуем как число, иначе читаем через toString(). */
  function num(v) {
    if (typeof v === "number") return isFinite(v) ? v : 0;
    if (v == null) return 0;
    if (typeof v === "boolean") return v ? 1 : 0;
    var n = Number(v);
    if (!isNaN(n)) return n;
    try { n = Number(String(v)); } catch (e) { return 0; }
    return isNaN(n) ? 0 : n;
  }

  function normalize(a) {
    a = Math.round(num(a)) % 360;
    return a < 0 ? a + 360 : a;
  }

  function step(api, cells) {
    var dir = turn(api);
    var r = api["move_" + dir];
    if (!r) throw new Error("нет команды move_" + dir);
    return r();
  }

  function turtleModule(api) {
    function moveCells(n) {
      n = Math.trunc(num(n));
      if (n < 0) { state.head = normalize(state.head + 180); n = -n; }
      for (var i = 0; i < n; i++) step(api);
      return null;
    }
    var m = {
      forward: moveCells,
      fd: moveCells,
      backward: function (n) { return moveCells(-n); },
      bk: function (n) { return moveCells(-n); },
      back: function (n) { return moveCells(-n); },
      left: function (a) { state.head = normalize(state.head + num(a)); return null; },
      lt: function (a) { state.head = normalize(state.head + num(a)); return null; },
      right: function (a) { state.head = normalize(state.head - num(a)); return null; },
      rt: function (a) { state.head = normalize(state.head - num(a)); return null; },
      penup: function () { state.pen = false; api.__pen && api.__pen(false); return null; },
      pu: function () { state.pen = false; api.__pen && api.__pen(false); return null; },
      up: function () { state.pen = false; api.__pen && api.__pen(false); return null; },
      pendown: function () { state.pen = true; api.__pen && api.__pen(true); return null; },
      pd: function () { state.pen = true; api.__pen && api.__pen(true); return null; },
      down: function () { state.pen = true; api.__pen && api.__pen(true); return null; },
      isdown: function () { return state.pen; },
      pencolor: function (c) { if (c) state.color = String(c); return state.color; },
      pensize: function (n) { if (n != null) state.width = num(n) || 1; return state.width; },
      speed: function () { return null; },
      heading: function () { return state.head; },
      setheading: function (a) { state.head = normalize(a); return null; },
      seth: function (a) { state.head = normalize(a); return null; },
      home: function () { api.home && api.home(); return null; },
      position: function () { return [api.get_x(), api.get_y()]; },
      pos: function () { return [api.get_x(), api.get_y()]; },
      xcor: function () { return api.get_x(); },
      ycor: function () { return api.get_y(); },
      goto: function (x, y) {
        /* идём по клеткам: сначала по горизонтали, потом по вертикали —
           как будто черепаха ползёт по полю, а не телепортируется */
        var tx = Math.trunc(num(x)), ty = Math.trunc(num(y));
        var cx = api.get_x(), cy = api.get_y();
        while (cx !== tx) {
          var before = cx;
          cx += tx > cx ? 1 : -1;
          face(api, cx > before ? 0 : 180);
          step(api);
          if (state.halted) break;
        }
        while (!state.halted && cy !== ty) {
          var b2 = cy;
          cy += ty > cy ? 1 : -1;
          face(api, cy > b2 ? 270 : 90);
          step(api);
        }
        return null;
      },
      /* полный круг: радиус в клетках, extent — сектор (по умолчанию 360) */
      circle: function (r, extent) {
        r = Math.max(1, Math.abs(Math.trunc(num(r) || 1)));
        extent = extent == null ? 360 : num(extent);
        var quarter = Math.max(1, Math.round(r / 2));
        var quarters = Math.max(1, Math.round(extent / 90));
        for (var q = 0; q < quarters; q++) {
          for (var i = 0; i < quarter; i++) step(api);
          m.left(90);
        }
        return null;
      },
      dot: function (n) { api.collect(); return null; },
      write: function (s) { api.__print ? api.__print(String(s)) : print(s); return null; },
      color: function (c) { return m.pencolor(c); },
      clear: function () { return null; },
      hideturtle: function () { state.hidden = true; return null; },
      showturtle: function () { state.hidden = false; return null; }
    };
    return m;
  }

  function face(api, head) { state.head = normalize(head); }

  /* ---------- запуск кода ---------- */
  async function run(code, api, opts) {
    opts = opts || {};
    var py = await ready();
    var logs = [];
    state = {
      api: api, pen: true, color: "accent", width: 1, head: 0,
      steps: 0, halted: null, pyError: null, hidden: false
    };

    /* модули на каждый запуск: api живёт один бой, старый должен умереть */
    var tmod = turtleModule(api), rmod = bridge(api);
    py.registerJsModule("robot", rmod);
    py.registerJsModule("turtle", tmod);

    /* Имена кладём в Python явно, а не через `from turtle import *`:
       звёздочка не переобновляет уже существующие имена между запусками —
       ученик получал бы функции прошлого боя. Прямое присваивание надёжно. */
    var g = py.globals;
    /* print() пишем на Python, а не на JS: значение из Python приходит в JS уже
       преобразованным (bool → true, tuple → массив), и печать выходила бы
       «true» вместо «True». Настоящий print делает str() сам — значит и
       определение должно быть на Python. */
    var from = stdoutAll.length;
    py.registerJsModule("gameio", {
      emit: function (s) { stdoutAll.push(String(s).replace(/\n$/, "")); }
    });
    py.runPython(
      "import gameio\n" +
      "def print(*args, sep=' ', end='\\n'):\n" +
      "    gameio.emit(sep.join(str(a) for a in args) + end)\n", { globals: g });
    Object.keys(tmod).forEach(function (k) { g.set(k, tmod[k]); });
    Object.keys(rmod).forEach(function (k) { if (k !== "__print") g.set(k, rmod[k]); });
    /* короткие псевдонимы: писать robot.get_x() каждый раз — лишний шум */
    g.set("energy", rmod.get_energy);
    g.set("crystals_left", rmod.crystals_left);
    g.set("x", rmod.get_x);
    g.set("y", rmod.get_y);

    var timer = null, watchdog = null;
    try {
      if (WATCHDOG_MS) {
        watchdog = setTimeout(function () {
          /* код завис — прерываем как Ctrl+C: ученик увидит понятное сообщение */
          try { py.checkInterrupt(); } catch (e) { /* прерывание уже было */ }
        }, WATCHDOG_MS);
      }
      await py.runPythonAsync(String(code));
      logs = stdoutAll.slice(from);
      return { logs: logs, traceLines: [], engine: "pyodide" };
    } catch (e) {
      logs = stdoutAll.slice(from);
      if (state.pyError) return { logs: logs, traceLines: [], error: state.pyError.message, engine: "pyodide" };
      if (state.halted) {
        if (state.halted.win) return { logs: logs, traceLines: [], halted: true, win: true, reason: state.halted.reason, engine: "pyodide" };
        return { logs: logs, traceLines: [], error: state.halted.reason || "Бой закончился.", engine: "pyodide" };
      }
      return { logs: logs, traceLines: [], error: describe(e), engine: "pyodide" };
    } finally {
      if (watchdog) clearTimeout(watchdog);
      if (timer) clearTimeout(timer);
      state = null;
    }
  }

  /* Ошибку Python показываем по-русски, но текст настоящий:
     "NameError: name 'mov' is not defined" — как в IDLE. */
  function describe(e) {
    var msg = e && e.message ? String(e.message) : String(e);
    if (/KeyboardInterrupt/.test(msg)) {
      return "Программа выполняется слишком долго — похоже на бесконечный цикл. Проверь while.";
    }
    var first = msg.split("\n").filter(function (s) { return s.trim(); })[0] || msg;
    return "Ошибка Python: " + first.slice(0, 220);
  }

  /* ---------- разбор кода для правил уровня ----------
   Работает по исходному тексту: цикл — это одна строка кода, поэтому
   повторы внутри цикла не считаются «хардкодом», а двадцать одинаковых
   строк подряд — считаются. Разбор мгновенный и синхронный: проверка
   уровня идёт до запуска боя, ждать Python нельзя. */
  function analyze(code) {
    var src = String(code || "");
    /* убираем комментарии и содержимое строк — иначе слово «for» внутри
       строки считалось бы циклом */
    var bare = src
      .replace(/#[^\n]*/g, "")
      .replace(/"""[\s\S]*?"""/g, '""')
      .replace(/'''[\s\S]*?'''/g, "''");
    var withoutStr = bare
      .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
      .replace(/'(?:[^'\\\n]|\\.)*'/g, "''");
    var flat = withoutStr.replace(/\s+/g, " ");

    function has(re) { return re.test(flat); }
    var calls = withoutStr.match(/\b[A-Za-z_][A-Za-z_0-9]*\s*\(/g) || [];
    var names = calls.map(function (c) { return c.replace(/\s*\($/, ""); });
    function count(list) {
      var m = {};
      list.forEach(function (n) { m[n] = (m[n] || 0) + 1; });
      return m;
    }

    var MOVE_NAMES = ["forward", "fd", "backward", "bk", "back", "goto", "circle", "dot",
      "move_up", "move_down", "move_left", "move_right"];
    var TURN_NAMES = ["left", "right", "lt", "rt", "setheading", "seth", "home"];
    var SENSOR_NAMES = ["is_wall", "is_enemy", "is_crystal", "is_exit"];
    var moveCalls = names.filter(function (n) { return MOVE_NAMES.indexOf(n) >= 0; });
    var turnCalls = names.filter(function (n) { return TURN_NAMES.indexOf(n) >= 0; });

    /* самая длинная серия одинаковых вызовов подряд */
    var seq = withoutStr.replace(/[^\w.]+\(/g, "|(").split("|").filter(Boolean);
    var maxRepeat = 1, run = 1;
    for (var i = 1; i < seq.length; i++) {
      if (seq[i] === seq[i - 1]) { run++; if (run > maxRepeat) maxRepeat = run; }
      else run = 1;
    }

    var strOps = /(\.upper|\.lower|\.strip|\.split|\.join|\.find|\.replace|\.startswith|\.endswith|\.index|\.count|\[[^\]]*:[^\]]*\])/.test(bare);
    var listOps = /(\.append|\.pop|\.insert|\.remove|\.sort|len\()/.test(bare);
    var dictOps = /\{[^}]*:|\.keys\(|\.values\(|\.items\(|\.get\(/.test(bare);
    var setOps = /\bset\(|\.add\(/.test(bare);
    var defs = withoutStr.match(/\bdef\s+(\w+)/g) || [];
    var selfCall = defs.some(function (d) {
      var nm = d.split(/\s+/)[1];
      return new RegExp("\\b" + nm + "\\s*\\(").test(withoutStr.split(d).join(""));
    });

    return {
      code: src,
      lines: src.split("\n").length,
      calls: names,
      print: has(/\bprint\s*\(/),
      hasPrint: has(/\bprint\s*\(/),
      for: has(/\bfor\b/),
      while: has(/\bwhile\b/),
      loop: has(/\bfor\b|\bwhile\b/),
      if: has(/\bif\b/),
      cond: has(/\bif\b|\belif\b/),
      def: has(/\bdef\s+\w+/),
      func: has(/\bdef\s+\w+/),
      ret: has(/\breturn\b/),
      break: has(/\bbreak\b/),
      continue: has(/\bcontinue\b/),
      try: has(/\btry\b/),
      except: has(/\bexcept\b/),
      raise: has(/\braise\b/),
      import: has(/\bimport\b|\bfrom\b/),
      comprehension: has(/\[[^\]]*\bfor\b[^\]]*\]|\{[^\}]*\bfor\b[^\}]*\}/),
      fstring: has(/f"|f'/),
      lambda: has(/\blambda\b/),
      global: has(/\bglobal\b/),
      str: strOps,
      list: listOps,
      dict: dictOps,
      set: setOps,
      recursion: selfCall,
      moves: count(moveCalls.concat(turnCalls)),
      sensors: count(SENSOR_NAMES.filter(function (n) { return names.indexOf(n) >= 0; })),
      moveCalls: moveCalls,
      maxRepeat: names.length ? maxRepeat : 0
    };
  }

  return {
    ready: ready,
    warmup: warmup,
    run: run,
    analyze: analyze,
    version: VERSION,
    isReady: function () { return !!window.PyRunner.__warming; }
  };
})();