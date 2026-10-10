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
        if (/^for\b/.test(t)) fail("Поддерживается только: for i in range(...)");

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

        // --- del x ---
        var dlm = t.match(/^del\s+([A-Za-z_]\w*)$/);
        if (dlm) {
          var ss = scope;
          while (ss) {
            if (Object.prototype.hasOwnProperty.call(ss.vars, dlm[1])) { delete ss.vars[dlm[1]]; break; }
            ss = ss.parent;
          }
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
      a = Number(a); b = Number(b);
      if (op === "+=") return a + b;
      if (op === "-=") return a - b;
      if (op === "*=") return a * b;
      if (op === "/=") return a / b;
      if (op === "//=") return Math.floor(a / b);
      if (op === "%=") return a % b;
      if (op === "**=") return Math.pow(a, b);
      return b;
    }

    function truthy(v) { return !!v && v !== 0; }

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
        var val = raw === true ? "True" : raw === false ? "False" : (raw === null || raw === undefined) ? "None" : String(raw);
        st.logs.push(val);
        if (st.api && st.api.__print) st.api.__print(val);
        return null;
      }
      // запрет опасных слов
      if (/(^|\W)(import|exec|eval|Function|window|document|localStorage|fetch|XMLHttpRequest|process|require)(\W|$)/.test(expr))
        fail("Запрещённое слово. Можно только hero-API, переменные и print().");
      if (/__/.test(expr)) fail("Символы «__» запрещены.");
      // перевод Python -> JS
      var js = expr
        .replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false").replace(/\bNone\b/g, "null");
      js = handleNot(js); // not (x > 5), а не (!x) > 5
      js = js.replace(/\band\b/g, "&&").replace(/\bor\b/g, "||")
        .replace(/\/\//g, "__FLOORDIV__");
      if (/__FLOORDIV__/.test(js)) {
        // a // b -> Math.floor(a/b): грубая замена через функцию
        js = js.split("__FLOORDIV__").join("/");
        js = "Math.floor(" + js + ")"; // приближение для простых выражений
      }
      js = js.replace(/\*\*/g, "**"); // степень — как в JS
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
      ctx["float"] = function (x) { return Number(x); };
      ctx["str"] = function (x) { return String(x); };
      ctx["bool"] = function (x) { return !!x && x !== 0; };
      ctx["type"] = function (x) {
        if (typeof x === "string") return "str";
        if (typeof x === "boolean") return "bool";
        if (typeof x === "number") return Number.isInteger(x) ? "int" : "float";
        if (x === null || x === undefined) return "NoneType";
        return "unknown";
      };
      ctx["abs"] = Math.abs; ctx["min"] = Math.min; ctx["max"] = Math.max;
      ctx["range"] = function () { return []; };
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
