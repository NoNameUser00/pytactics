/* PyEngine — мини-интерпретатор подмножества Python.
   Поддерживает: присваивание, print, if/elif/else, while, for i in range(),
   def/return, break/continue, and/or/not, True/False/None, + - * / // % **,
   сравнения, вызовы API. Работает offline, без CDN. */
window.PyEngine = (function () {
  "use strict";

  function run(code, api, opts) {
    opts = opts || {};
    var maxSteps = opts.maxSteps || 15000;
    var state = {
      steps: 0,
      funcs: {},
      api: api,
      logs: [],
      currentLine: 0,
      rng: mulberry32(1),
      onLine: opts.onLine || null,
      traceLines: []
    };

    function fail(msg) {
      throw { pyError: true, message: msg, line: state.currentLine };
    }

    // ---------- 1. Разбор строк ----------
    var rawLines = String(code).split("\n");
    var items = [];
    rawLines.forEach(function (raw, idx) {
      var no = idx + 1;
      var expanded = raw.replace(/\t/g, "    ");
      var m = expanded.match(/^(\s*)(.*)$/);
      var indent = m[1].length;
      var text = m[2].replace(/\s+$/, "");
      if (text === "" || text.charAt(0) === "#") return; // пустые и комментарии
      // отрезать комментарий в конце (вне строк)
      text = stripComment(text);
      if (text === "") return;
      items.push({ no: no, indent: indent, text: text, children: [] });
    });

    // ---------- 2. Построение дерева ----------
    var root = { indent: -1, children: [], isBlock: true };
    var stack = [root];
    items.forEach(function (node) {
      node.isBlock = isBlockOpener(node.text);
      while (stack.length && stack[stack.length - 1].indent >= node.indent) stack.pop();
      var parent = stack[stack.length - 1];
      parent.children.push(node);
      if (node.isBlock) stack.push(node);
      else if (node.text.charAt(node.text.length - 1) === ":") {
        fail2(node.no, "Строка заканчивается на «:», но это не if/for/while/def/else");
      }
    });

    // ---------- 3. Выполнение ----------
    var globalScope = makeScope(null);
    // встроенные: True/False уже в eval, добавим len/abs/min/max
    try {
      execBlock(root.children, globalScope, state, fail, 0);
    } catch (e) {
      if (e && e.__return) return { logs: state.logs, traceLines: state.traceLines, error: "return вне функции (строка " + state.currentLine + ")" };
      if (e && e.__halt) return { logs: state.logs, traceLines: state.traceLines, halted: true, win: e.win, reason: e.reason };
      if (e && e.pyError) return { logs: state.logs, traceLines: state.traceLines, error: "Строка " + e.line + ": " + e.message };
      throw e;
    }
    return { logs: state.logs, traceLines: state.traceLines };

    // ================= helpers =================
    function fail2(line, msg) { throw { pyError: true, message: msg, line: line }; }

    function stripComment(s) {
      var inS = null;
      for (var i = 0; i < s.length; i++) {
        var c = s[i];
        if (inS) { if (c === inS && s[i - 1] !== "\\") inS = null; }
        else if (c === '"' || c === "'") inS = c;
        else if (c === "#") return s.slice(0, i).replace(/\s+$/, "");
      }
      return s;
    }

    function isBlockOpener(t) {
      return /^(if\b.*:|elif\b.*:|else:|while\b.*:|for\b.*:|def\b.*:)$/.test(t);
    }

    function makeScope(parent) {
      return { parent: parent, vars: {} };
    }
    function getVar(scope, name) {
      var s = scope;
      while (s) { if (Object.prototype.hasOwnProperty.call(s.vars, name)) return s.vars[name]; s = s.parent; }
      return undefined;
    }
    function setVar(scope, name, val) { scope.vars[name] = val; }

    function tick() {
      state.steps++;
      if (state.steps > maxSteps) fail("Похоже на бесконечный цикл (превышен лимит шагов). Проверь while / range.");
    }

    function execBlock(children, scope, st, failFn, depth) {
      if (depth > 200) fail("Слишком глубокая вложенность / рекурсия");
      var i = 0;
      var sig = { brk: false, cont: false };
      while (i < children.length) {
        var n = children[i];
        if (sig.brk || sig.cont) break;
        st.currentLine = n.no;
        if (st.onLine) st.onLine(n.no);
        st.traceLines.push(n.no);
        tick();
        var t = n.text;

        // --- if-цепочка ---
        if (/^if\b/.test(t)) {
          var matched = false;
          if (truthy(evalExpr(parseCond(t, "if"), scope, st))) { execBlock(n.children, scope, st, failFn, depth + 1); matched = true; }
          var j = i + 1;
          while (j < children.length && /^(elif\b|else:)/.test(children[j].text) && children[j].indent === n.indent) {
            var c = children[j];
            st.currentLine = c.no;
            if (!matched) {
              if (/^elif\b/.test(c.text)) {
                if (truthy(evalExpr(parseCond(c.text, "elif"), scope, st))) { execBlock(c.children, scope, st, failFn, depth + 1); matched = true; }
              } else { execBlock(c.children, scope, st, failFn, depth + 1); matched = true; }
            }
            j++;
          }
          i = j;
          checkBreak(scope, sig);
          continue;
        }
        if (/^(elif\b|else:)/.test(t)) fail("elif/else без if");

        // --- while ---
        if (/^while\b/.test(t)) {
          var cond = parseCond(t, "while");
          var guard = 0;
          while (truthy(evalExpr(cond, scope, st))) {
            tick();
            if (++guard > 5000) fail("Цикл while не завершается (guard). Добавь условие выхода.");
            var inner = { brk: false, cont: false };
            execBlockWithSig(n.children, scope, st, failFn, depth + 1, inner);
            if (inner.brk) break;
          }
          i++; continue;
        }
        // --- for ---
        var fm = t.match(/^for\s+([A-Za-z_]\w*)\s+in\s+range\((.*)\):$/);
        if (fm) {
          var vals = evalRange(fm[2], scope, st);
          var br = false;
          for (var k = 0; k < vals.length; k++) {
            setVar(scope, fm[1], vals[k]);
            var inner2 = { brk: false, cont: false };
            execBlockWithSig(n.children, scope, st, failFn, depth + 1, inner2);
            if (inner2.brk) break;
          }
          i++; continue;
        }
        if (/^for\b/.test(t)) {
          var fl = t.match(/^for\s+([A-Za-z_]\w*)\s+in\s+(.+):$/);
          if (fl) {
            var arr = evalExpr(fl[2], scope, st);
            if (typeof arr === "string") arr = arr.split("");
            if (!Array.isArray(arr)) fail("После in нужен список (или строка), а не «" + fl[2] + "»");
            for (var q = 0; q < arr.length; q++) {
              setVar(scope, fl[1], arr[q]);
              var inner3 = { brk: false, cont: false };
              execBlockWithSig(n.children, scope, st, failFn, depth + 1, inner3);
              if (inner3.brk) break;
            }
            i++; continue;
          }
          fail("Поддерживается: for i in range(...) или for x in список");
        }

        // --- def ---
        var dm = t.match(/^def\s+([A-Za-z_]\w*)\s*\((.*)\):$/);
        if (dm) {
          var params = dm[2].trim() === "" ? [] : dm[2].split(",").map(function (s) { return s.trim(); });
          st.funcs[dm[1]] = { params: params, body: n.children, defScope: scope };
          i++; continue;
        }

        // --- break/continue/return ---
        if (t === "break") { sig.brk = true; i++; break; }
        if (t === "continue") { sig.cont = true; i++; break; }
        var rm = t.match(/^return\b\s*(.*)$/);
        if (rm) {
          var rv = rm[1] === "" ? null : evalExpr(rm[1], scope, st);
          throw { __return: true, value: rv };
        }

        // --- del x / del a[i] ---
        var dli = t.match(/^del\s+([A-Za-z_]\w*)\[([^\]]+)\]$/);
        if (dli) {
          var arrv = getVar(scope, dli[1]);
          if (!Array.isArray(arrv)) fail("del [...]: «" + dli[1] + "» — не список");
          if (arrv.__tuple__) fail("Кортеж менять нельзя (del) — создай новый");
          var di = Math.floor(Number(evalExpr(dli[2], scope, st)));
          if (di < 0) di = arrv.length + di;
          arrv.splice(di, 1);
          i++; continue;
        }
        var dlm = t.match(/^del\s+([A-Za-z_]\w*)$/);
        if (dlm) {
          var ss = scope;
          while (ss) {
            if (Object.prototype.hasOwnProperty.call(ss.vars, dlm[1])) { delete ss.vars[dlm[1]]; break; }
            ss = ss.parent;
          }
          i++; continue;
        }

        // --- распаковка: x, y = пара ---
        var um = t.match(/^([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)+)\s*=\s*(.+)$/);
        if (um) {
          var names = um[1].split(",").map(function (s) { return s.trim(); });
          var uval = evalExpr(um[2], scope, st);
          if (!Array.isArray(uval) || uval.length !== names.length) fail("Нужно " + names.length + " значений через запятую");
          names.forEach(function (nm, k) { setVar(scope, nm, uval[k]); });
          i++; continue;
        }

        // --- присваивание ---
        var am = t.match(/^([A-Za-z_]\w*)\s*(\+=|-=|\*=|\/\/=|\/=|%=|\*\*=|=)(?!=)\s*(.+)$/);
        if (am && am[3] !== undefined) {
          var cur = getVar(scope, am[1]);
          var val = evalExpr(am[3], scope, st);
          if (am[2] === "=") setVar(scope, am[1], val);
          else {
            if (cur === undefined) fail("Переменная «" + am[1] + "» не задана");
            setVar(scope, am[1], applyAug(cur, val, am[2]));
          }
          i++; continue;
        }

        // --- выражение / вызов ---
        evalExpr(t, scope, st);
        i++;
      }
      if (sig.brk || sig.cont) {
        // пробросить наружу через scope-сигнал: используем исключение-обёртку
        throw { __sig: true, brk: sig.brk, cont: sig.cont };
      }
    }

    function execBlockWithSig(children, scope, st, failFn, depth, sig) {
      try {
        execBlock(children, scope, st, failFn, depth);
      } catch (e) {
        if (e && e.__sig) { sig.brk = e.brk; sig.cont = e.cont; return; }
        throw e;
      }
    }
    function checkBreak() { /* break вне цикла ловится через __sig на верхнем уровне */ }

    function parseCond(t, kw) {
      var m = t.match(new RegExp("^" + kw + "\\b\\s*(.+):$"));
      if (!m) fail("Ошибка синтаксиса в «" + kw + "». Пример: " + kw + " x > 0:");
      return m[1];
    }

    function evalRange(argStr, scope, st) {
      var parts = splitArgs(argStr).map(function (p) { return evalExpr(p, scope, st); });
      var a, b, step = 1;
      if (parts.length === 1) { a = 0; b = parts[0]; }
      else if (parts.length === 2) { a = parts[0]; b = parts[1]; }
      else if (parts.length === 3) { a = parts[0]; b = parts[1]; step = parts[2]; }
      else fail("range() принимает 1–3 аргумента");
      a = Math.floor(Number(a)); b = Math.floor(Number(b)); step = Math.floor(Number(step));
      if (!isFinite(a) || !isFinite(b) || !isFinite(step) || step === 0) fail("Плохие аргументы range()");
      var out = [];
      if (step > 0) for (var i = a; i < b && out.length < 500; i += step) out.push(i);
      else for (var j = a; j > b && out.length < 500; j += step) out.push(j);
      return out;
    }

    function splitArgs(s) {
      var res = [], depth = 0, cur = "", inS = null;
      for (var i = 0; i < s.length; i++) {
        var c = s[i];
        if (inS) { cur += c; if (c === inS && s[i - 1] !== "\\") inS = null; }
        else if (c === '"' || c === "'") { inS = c; cur += c; }
        else if (c === "(" || c === "[") { depth++; cur += c; }
        else if (c === ")" || c === "]") { depth--; cur += c; }
        else if (c === "," && depth === 0) { res.push(cur.trim()); cur = ""; }
        else cur += c;
      }
      if (cur.trim() !== "") res.push(cur.trim());
      return res;
    }

    function applyAug(a, b, op) {
      if (op === "+=") {
        if (Array.isArray(a) && a.__tuple__) fail("Кортеж менять нельзя (+=) — создай новый");
        if (Array.isArray(a) || Array.isArray(b)) {
          return (Array.isArray(a) ? a : [a]).concat(Array.isArray(b) ? b : [b]);
        }
        if (typeof a === "string" || typeof b === "string") return String(a) + String(b);
        a = Number(a); b = Number(b);
        return a + b;
      }
      a = Number(a); b = Number(b);
      if (op === "-=") return a - b;
      if (op === "*=") return a * b;
      if (op === "/=") return a / b;
      if (op === "//=") return Math.floor(a / b);
      if (op === "%=") return a % b;
      if (op === "**=") return Math.pow(a, b);
      return b;
    }

    function truthy(v) {
      if (Array.isArray(v)) return v.length > 0; // пустые [] и () — ложь, как в Python
      return !!v && v !== 0;
    }

    // Питоновский вывод: True/False/None, списки как [1, 2, 'a'], кортежи как (1, 2)
    function fmtPy(v, top) {
      if (Array.isArray(v)) {
        var inner = v.map(function (x) { return fmtPy(x, false); }).join(", ");
        if (v.__tuple__) return v.length === 1 ? "(" + inner + ",)" : "(" + inner + ")";
        return "[" + inner + "]";
      }
      if (v === true) return "True";
      if (v === false) return "False";
      if (v === null || v === undefined) return "None";
      if (typeof v === "string") return top ? v : "'" + v + "'";
      return String(v);
    }

    // Детерминированный ГСЧ: seed(n) делает random()/randint() повторяемыми —
    // задачи с «Угадай число» проверяются точным expect.
    function mulberry32(a) {
      return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        var t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    // Python-not связывается слабее сравнений, но сильнее and/or:
    // «not x > 5» = «not (x > 5)», «not a and b» = «(not a) and b».
    // Поэтому оборачиваем операнд not в скобки до замены and/or.
    function handleNot(s) {
      for (var g = 0; g < 10; g++) {
        var at = indexOfNot(s);
        if (at < 0) break;
        var i = at + 3, n = s.length, depth = 0, inS = null, j = i;
        while (j < n) {
          var c = s[j];
          if (inS) { if (c === inS && s[j - 1] !== "\\") inS = null; }
          else if (c === '"' || c === "'") inS = c;
          else if (c === "(" || c === "[") depth++;
          else if (c === ")" || c === "]") { if (depth === 0) break; depth--; }
          else if (depth === 0 && c === ",") break;
          else if (depth === 0 && (j === 0 || /\W/.test(s[j - 1])) && s.slice(j).match(/^(and|or)\b/)) break;
          j++;
        }
        var inner = s.slice(i, j).trim();
        if (!inner) break;
        s = s.slice(0, at) + "!(" + inner + ")" + s.slice(j);
      }
      return s;
    }
    function indexOfNot(s) {
      var inS = null;
      for (var i = 0; i < s.length; i++) {
        var c = s[i];
        if (inS) { if (c === inS && s[i - 1] !== "\\") inS = null; continue; }
        if (c === '"' || c === "'") { inS = c; continue; }
        if (c === "n" && s.slice(i, i + 3) === "not"
            && (i === 0 || /\W/.test(s[i - 1])) && /\W/.test(s[i + 3] || " ")) return i;
      }
      return -1;
    }

    function evalExpr(expr, scope, st) {
      expr = expr.trim();
      if (expr === "") return null;
      // print(...)
      var pm = expr.match(/^print\s*\((.*)\)$/);
      if (pm) {
        var raw = pm[1].trim() === "" ? "" : evalExpr(pm[1], scope, st);
        var val = fmtPy(raw, true);
        st.logs.push(val);
        if (st.api && st.api.__print) st.api.__print(val);
        return null;
      }
      // запрет опасных слов
      if (/(^|\W)(import|exec|eval|Function|window|document|localStorage|fetch|XMLHttpRequest|process|require)(\W|$)/.test(expr))
        fail("Запрещённое слово. Можно только hero-API, переменные и print().");
      if (/__/.test(expr)) fail("Символы «__» запрещены.");
      if (/^[A-Za-z_]\w*\s*\[.*\]\s*=[^=]/.test(expr)) fail("Присваивание элементу: для списков используй методы, кортежи менять нельзя");
      // перевод Python -> JS
      var js = expr
        .replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false").replace(/\bNone\b/g, "null");
      // прячем строковые литералы, чтобы операторы внутри них не трогать
      var savedStrs = [];
      js = js.replace(/"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, function (m) { savedStrs.push(m); return "__S" + (savedStrs.length - 1) + "__"; });
      js = js.replace(/\bnot\s+in\b/g, "__NOTIN__"); // единый оператор, до handleNot
      js = handleNot(js); // not (x > 5), а не (!x) > 5
      js = js.replace(/\band\b/g, "&&").replace(/\bor\b/g, "||");
      // кортеж: (a, b) и () — скобки НЕ после имени (вызовы не трогаем)
      js = js.replace(/(?<![\w)\]])\(\s*\)/g, "__tuple()");
      var tg = 0;
      while (tg++ < 20) {
        var before = js;
        js = js.replace(/(?<![\w)\]])\(([^()]*,[^()]*)\)/g, "__tuple($1)");
        if (js === before) break;
      }
      js = js.replace(/\*\*/g, "__POW__").replace(/\/\//g, "__FLOORDIV__");
      var opnd = "([A-Za-z_]\\w*(?:\\[[^\\[\\]]*\\]|\\((?:[^()]|\\([^()]*\\))*\\))?|\\[[^\\[\\]]*\\]|\\d+(?:\\.\\d+)?)";
      var opndCall = "([A-Za-z_]\\w*(?:\\[[^\\[\\]]*\\]|\\((?:[^()]|\\([^()]*\\))*\\))?|\\[[^\\[\\]]*\\]|\\d+(?:\\.\\d+)?)";
      // умножение (в т.ч. строк: "ab" * 3) — через общий helper
      var reMul = new RegExp(opnd + "\\s*\\*\\s*" + opnd, "g"), mguard = 0;
      while (mguard++ < 20) {
        reMul.lastIndex = 0;
        if (!reMul.test(js)) break;
        reMul.lastIndex = 0;
        js = js.replace(reMul, "__mul($1,$2)");
      }
      // сложение (в т.ч. списков и кортежей — через общий helper)
      var reAdd = new RegExp(opnd + "\\s*\\+\\s*" + opnd, "g"), aguard = 0;
      while (aguard++ < 20) {
        reAdd.lastIndex = 0;
        if (!reAdd.test(js)) break;
        reAdd.lastIndex = 0;
        js = js.replace(reAdd, "__add($1,$2)");
      }
      var opndCont = "(\\[[^\\[\\]]*\\]|[A-Za-z_]\\w*(?:\\([^()]*\\))?|\\d+(?:\\.\\d+)?)";
      js = js.replace(new RegExp(opndCall + "\\s+(__NOTIN__|in)\\s+" + opndCont, "g"), function (m, a, op, b) {
        return op === "__NOTIN__" ? "!__contains(" + b + "," + a + ")" : "__contains(" + b + "," + a + ")";
      });
      // отрицательный индекс: a[-1] (и для строк тоже)
      js = js.replace(/([A-Za-z_]\w*(?:\[[^\[\]]*\])*)\[(-\d+)\]/g, "__index($1,$2)");
      // срез: s[a:b:c] (строки и списки; база — имя, вызов или список)
      js = js.replace(/([A-Za-z_]\w*(?:\[[^\[\]]*\]|\([^()]*\))?|\[[^\[\]]*\])\[([^\[\]:]*):([^\[\]:]*)(?::([^\[\]:]*))?\]/g, "__slice($1,\"$2\",\"$3\",\"$4\")");
      // методы строк
      js = js.replace(/\.upper\(\)/g, ".toUpperCase()").replace(/\.lower\(\)/g, ".toLowerCase()")
        .replace(/\.strip\(\)/g, ".trim()").replace(/\.find\(/g, ".indexOf(").replace(/\.startswith\(/g, ".startsWith(").replace(/\.endswith\(/g, ".endsWith(");
      js = js.replace(/([A-Za-z_]\w*(?:\([^()]*\))?)\.replace\(([^,()]+),([^()]+)\)/g, "__replace($1,$2,$3)");
      js = js.replace(/(__S\d+__|[A-Za-z_]\w*(?:\([^()]*\))?)\.join\(([^()]+)\)/g, "__join($1,$2)");
      js = js.replace(/([A-Za-z_]\w*(?:\([^()]*\))?)\.isdigit\(\)/g, "__isdigit($1)")
        .replace(/([A-Za-z_]\w*(?:\([^()]*\))?)\.isalpha\(\)/g, "__isalpha($1)");
      // методы списков
      js = js.replace(/([A-Za-z_]\w*)\.append\(([^()]+)\)/g, "__append($1,$2)");
      js = js.replace(/([A-Za-z_]\w*)\.sort\(\)/g, "__sort($1)");
      js = js.replace(/([A-Za-z_]\w*)\.insert\(([^,()]+),([^()]+)\)/g, "__insert($1,$2,$3)");
      js = js.replace(/([A-Za-z_]\w*)\.remove\(([^()]+)\)/g, "__remove($1,$2)");
      js = js.replace(/([A-Za-z_]\w*)\.pop\(([^()]+)\)/g, "__pop($1,$2)");
      js = js.replace(/__POW__/g, "**");
      if (/__FLOORDIV__/.test(js)) {
        // a // b -> Math.floor(a/b): грубая замена через функцию
        js = js.split("__FLOORDIV__").join("/");
        js = "Math.floor(" + js + ")"; // приближение для простых выражений
      }
      for (var si = 0; si < savedStrs.length; si++) js = js.split("__S" + si + "__").join(savedStrs[si]);
      // контекст
      var ctx = {};
      var s = scope;
      while (s) { for (var k in s.vars) if (!(k in ctx)) ctx[k] = s.vars[k]; s = s.parent; }
      for (var fname in st.funcs) {
        (function (fn) {
          ctx[fn] = function () {
            var f = st.funcs[fn];
            var callScope = makeScope(f.defScope);
            for (var i = 0; i < f.params.length; i++) callScope.vars[f.params[i]] = arguments[i];
            try {
              execBlock(f.body, callScope, st, fail, 0);
            } catch (e) {
              if (e && e.__return) return e.value;
              throw e;
            }
            // синхронизировать изменённые глобалы? простые переменные — копируем назад новые имена
            for (var key in callScope.vars) {
              if (!(key in f.defScope.vars) || f.params.indexOf(key) === -1) {
                // записываем в вызывающий scope через цепочку
                scope.vars[key] = callScope.vars[key];
              }
            }
            return null;
          };
        })(fname);
      }
      for (var an in st.api) if (an !== "__print") ctx[an] = st.api[an];
      ctx["len"] = function (x) { return x && x.length !== undefined ? x.length : 0; };
      ctx["int"] = function (x) { return Math.trunc(Number(x)); };
      ctx["float"] = function (x) {
        if (x === "inf") return Infinity;
        if (x === "-inf") return -Infinity;
        if (x === "nan") return NaN;
        return Number(x);
      };
      ctx["str"] = function (x) { return String(x); };
      ctx["bool"] = function (x) { return !!x && x !== 0; };
      ctx["type"] = function (x) {
        if (Array.isArray(x)) return x.__tuple__ ? "tuple" : "list";
        if (typeof x === "string") return "str";
        if (typeof x === "boolean") return "bool";
        if (typeof x === "number") return Number.isInteger(x) ? "int" : "float";
        if (x === null || x === undefined) return "NoneType";
        return "unknown";
      };
      ctx["round"] = function (x, n) {
        x = Number(x);
        if (n === undefined) return Math.round(x);
        var p = Math.pow(10, Math.floor(Number(n)));
        return Math.round(x * p) / p;
      };
      ctx["seed"] = function (x) { st.rng = mulberry32(Math.floor(Number(x)) || 0); return null; };
      ctx["random"] = function () { return st.rng(); };
      ctx["randint"] = function (a, b) {
        a = Math.ceil(Number(a)); b = Math.floor(Number(b));
        return a + Math.floor(st.rng() * (b - a + 1));
      };
      ctx["abs"] = Math.abs;
      ctx["min"] = function () {
        var a = Array.prototype.slice.call(arguments);
        if (a.length === 1 && Array.isArray(a[0])) a = a[0];
        return Math.min.apply(null, a);
      };
      ctx["max"] = function () {
        var a = Array.prototype.slice.call(arguments);
        if (a.length === 1 && Array.isArray(a[0])) a = a[0];
        return Math.max.apply(null, a);
      };
      ctx["sum"] = function (a) { return a.reduce(function (s, x) { return s + x; }, 0); };
      function numCmp(x, y) {
        if (typeof x === "number" && typeof y === "number") return x - y;
        x = String(x); y = String(y);
        return x < y ? -1 : x > y ? 1 : 0;
      }
      ctx["sorted"] = function (a) { return a.slice().sort(numCmp); };
      ctx["reversed"] = function (a) { return a.slice().reverse(); };
      ctx["list"] = function (x) {
        if (typeof x === "string") return x.split("");
        if (Array.isArray(x)) return x.slice();
        return [x];
      };
      ctx["range"] = function (a, b, c) {
        var lo, hi, step = 1;
        if (b === undefined) { lo = 0; hi = Math.floor(Number(a)); }
        else if (c === undefined) { lo = Math.floor(Number(a)); hi = Math.floor(Number(b)); }
        else { lo = Math.floor(Number(a)); hi = Math.floor(Number(b)); step = Math.floor(Number(c)) || 1; }
        var out = [];
        if (step > 0) for (var i = lo; i < hi && out.length < 500; i += step) out.push(i);
        else for (var j = lo; j > hi && out.length < 500; j += step) out.push(j);
        return out;
      };
      ctx["shuffle"] = function (a) {
        noMut(a, "shuffle");
        for (var i = a.length - 1; i > 0; i--) {
          var j = Math.floor(st.rng() * (i + 1)), t = a[i];
          a[i] = a[j]; a[j] = t;
        }
        return null;
      };
      ctx["choice"] = function (a) { return a[Math.floor(st.rng() * a.length)]; };
      ctx["__index"] = function (s, i) {
        i = Math.floor(Number(i));
        var n = (typeof s === "string" || Array.isArray(s)) ? s.length : 0;
        if (i < 0) i = n + i;
        return s[i];
      };
      ctx["__remove"] = function (a, x) {
        noMut(a, "remove");
        for (var i = 0; i < a.length; i++) if (a[i] == x) { a.splice(i, 1); break; }
        return null;
      };
      ctx["__insert"] = function (a, i, x) { noMut(a, "insert"); a.splice(Math.floor(Number(i)), 0, x); return null; };
      ctx["__pop"] = function (a, i) { noMut(a, "pop"); return a.splice(Math.floor(Number(i)), 1)[0]; };
      ctx["__sort"] = function (a) {
        noMut(a, "sort");
        var nums = a.every(function (x) { return typeof x === "number"; });
        a.sort(nums ? function (x, y) { return x - y; } : undefined);
        return null;
      };
      ctx["__join"] = function (sep, a) { return a.join(String(sep)); };
      ctx["__mul"] = function (a, b) {
        if (Array.isArray(a) || Array.isArray(b)) {
          var arr = Array.isArray(a) ? a : b, n = Math.floor(Number(Array.isArray(a) ? b : a));
          var out = [];
          for (var i = 0; i < Math.max(0, n); i++) out = out.concat(arr);
          if (arr.__tuple__) Object.defineProperty(out, "__tuple__", { value: true });
          return out;
        }
        if (typeof a === "string") return a.repeat(Math.max(0, Math.floor(Number(b))));
        if (typeof b === "string") return b.repeat(Math.max(0, Math.floor(Number(a))));
        return a * b;
      };
      ctx["__add"] = function (a, b) {
        if (Array.isArray(a) || Array.isArray(b)) {
          var la = Array.isArray(a) ? a : [a], lb = Array.isArray(b) ? b : [b];
          var c = la.concat(lb);
          if ((Array.isArray(a) && a.__tuple__) || (Array.isArray(b) && b.__tuple__)) {
            Object.defineProperty(c, "__tuple__", { value: true });
          }
          return c;
        }
        if (typeof a === "string" || typeof b === "string") return String(a) + String(b);
        return a + b;
      };
      ctx["__tuple"] = function () {
        var a = Array.prototype.slice.call(arguments);
        Object.defineProperty(a, "__tuple__", { value: true });
        return a;
      };
      ctx["tuple"] = function (x) {
        var a = typeof x === "string" ? x.split("") : Array.isArray(x) ? x.slice() : [x];
        Object.defineProperty(a, "__tuple__", { value: true });
        return a;
      };
      function noMut(a, what) {
        if (Array.isArray(a) && a.__tuple__) fail("Кортеж менять нельзя (" + what + ") — создай новый");
      }
      ctx["__append"] = function (a, x) { noMut(a, "append"); a.push(x); return null; };
      ctx["__contains"] = function (c, x) { return String(c).indexOf(String(x)) >= 0; };
      ctx["__replace"] = function (s, a, b) { return String(s).split(String(a)).join(String(b)); };
      ctx["__slice"] = function (s, a, b, c) {
        var isArr = Array.isArray(s);
        if (!isArr) s = String(s);
        var n = s.length;
        function idx(v, def) {
          if (v === "" || v === undefined) return def;
          v = Math.floor(Number(v));
          if (v < 0) v = n + v;
          return v;
        }
        var step = (c === "" || c === undefined) ? 1 : Math.floor(Number(c));
        if (step === 0) return isArr ? [] : "";
        var out = [];
        if (step > 0) {
          var i0 = Math.max(0, idx(a, 0)), i1 = Math.min(n, idx(b, n));
          for (var i = i0; i < i1; i += step) out.push(s[i]);
        } else {
          var j0 = Math.min(n - 1, idx(a, n - 1)), j1 = idx(b, -1);
          for (var j = j0; j > j1; j += step) out.push(s[j]);
        }
        if (isArr && s.__tuple__) Object.defineProperty(out, "__tuple__", { value: true });
        return isArr ? out : out.join("");
      };
      ctx["__isdigit"] = function (x) { return /^[0-9]+$/.test(String(x)); };      ctx["__isalpha"] = function (x) { return /^[A-Za-z\u00c0-\u024f\u0400-\u04ff\u0500-\u052f]+$/.test(String(x)); };
      ctx["ord"] = function (x) { return String(x).codePointAt(0); };
      ctx["chr"] = function (x) { return String.fromCodePoint(Math.floor(Number(x))); };
      var keys = Object.keys(ctx), vals = keys.map(function (k) { return ctx[k]; });
      var fn;
      try {
        fn = new Function(keys.join(","), '"use strict"; return (' + js + ");");
      } catch (e) { fail("Ошибка синтаксиса: «" + expr + "»"); }
      var result;
      try { result = fn.apply(null, vals); }
      catch (e) {
        if (e && (e.__return || e.__halt || e.__sig || e.pyError)) throw e;
        fail("Ошибка в выражении «" + expr + "»: " + (e && e.message ? e.message : e));
      }
      // синхронизировать возможно изменённые мутабельные? примитивы — обновим то, что поменялось? нет, только через присваивание.
      // но API-функции могли вызываться — ок.
      // подтянуть переменные, если выражение было вызовом пользовательской функции, менявшей scope: уже сделано внутри wrapper.
      return result;
    }
  }

  return { run: run };
})();
