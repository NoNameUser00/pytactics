/* game.js — пошаговая симуляция: карта, герой, враги, кристаллы, энергия. */
window.Game = (function () {
  "use strict";
  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  function parseMap(rows) {
    var grid = [], player = null, enemies = [], crystals = [], pickups = [], exit = null;
    rows.forEach(function (row, y) {
      var line = [];
      for (var x = 0; x < row.length; x++) {
        var c = row[x];
        if (c === "P") { player = { x: x, y: y }; line.push("."); }
        else if (c === "E") { enemies.push({ x: x, y: y, alive: true, rank: "E" }); line.push("."); }
        else if (c === "R") { enemies.push({ x: x, y: y, alive: true, rank: "R" }); line.push("."); }
        else if (c === "D") { enemies.push({ x: x, y: y, alive: true, rank: "D" }); line.push("."); }
        else if (c === "B") { enemies.push({ x: x, y: y, alive: true, rank: "B", boss: true }); line.push("."); }
        else if (c === "H") { pickups.push({ x: x, y: y }); line.push("."); }
        else if (c === "C") { crystals.push({ x: x, y: y }); line.push("C"); }
        else if (c === "X") { exit = { x: x, y: y }; line.push("X"); }
        else line.push(c);
      }
      grid.push(line);
    });
    return { grid: grid, player: player, enemies: enemies, crystals: crystals, pickups: pickups, exit: exit, w: grid[0].length, h: grid.length };
  }

  function isWall(par, x, y) {
    if (x < 0 || y < 0 || x >= par.w || y >= par.h) return true;
    return par.grid[y][x] === "#";
  }

  // Запустить код ученика на копии уровня. Возвращает trace для анимации.
  function simulate(level, code) {
    var par = parseMap(level.map);
    var st = {
      px: par.player.x, py: par.player.y,
      energy: level.energy, turns: 0,
      enemies: par.enemies.map(function (e) { return { x: e.x, y: e.y, alive: true, rank: e.rank || "E", boss: !!e.boss }; }),
      pickups: par.pickups.map(function (p) { return { x: p.x, y: p.y }; }),
      crystals: par.crystals.map(function (c) { return { x: c.x, y: c.y }; }),
      collected: 0, total: par.crystals.length,
      exit: par.exit, over: false, win: false
    };
    var events = [{ type: "start", snap: snap() }];
    var logs = [];
    var api = buildApi();

    var res = window.PyEngine.run(code, api, { maxSteps: 15000 });
    logs = res.logs || [];
    if (res.error && !st.over) {
      events.push({ type: "error", message: res.error, snap: snap() });
      return { events: events, logs: logs, win: false, error: res.error, turns: st.turns, collected: st.collected, total: st.total, energy: st.energy };
    }
    if (!st.over) {
      // код кончился, а победа не достигнута
      var msg = st.collected < st.total
        ? "Кристаллы собраны не все: " + st.collected + "/" + st.total + ". Добавь collect()."
        : "Робот не на портале 🌀. Доведи его до X.";
      events.push({ type: "error", message: msg, snap: snap() });
      return { events: events, logs: logs, win: false, error: msg, turns: st.turns, collected: st.collected, total: st.total, energy: st.energy };
    }
    return { events: events, logs: logs, win: st.win, turns: st.turns, collected: st.collected, total: st.total, energy: st.energy };

    // ---------- API героя ----------
    function buildApi() {
      function need(dir) {
        if (!DIRS[dir]) throw { pyError: true, message: "Направление должно быть \"up\"/\"down\"/\"left\"/\"right\", а не «" + dir + "»" };
      }
      return {
        __print: function (s) { events.push({ type: "log", message: s, snap: snap() }); },
        move_up: function () { return doMove("up"); },
        move_down: function () { return doMove("down"); },
        move_left: function () { return doMove("left"); },
        move_right: function () { return doMove("right"); },
        attack: function (dir) {
          need(dir);
          endTurn("attack " + dir);
          var d = DIRS[dir], tx = st.px + d[0], ty = st.py + d[1];
          var hit = false;
          st.enemies.forEach(function (e) {
            if (e.alive && e.x === tx && e.y === ty) { e.alive = false; hit = true; }
          });
          events.push({ type: hit ? "attack_hit" : "attack_miss", dir: dir, snap: snap(), message: hit ? "Вирус уничтожен!" : "Мимо — рядом нет вируса." });
          afterEnemyTurn();
          return hit;
        },
        collect: function () {
          endTurn("collect");
          var idx = -1;
          st.crystals.forEach(function (c, i) { if (c.x === st.px && c.y === st.py) idx = i; });
          if (idx >= 0) {
            st.crystals.splice(idx, 1); st.collected++;
            events.push({ type: "collect", snap: snap(), message: "Кристалл " + st.collected + "/" + st.total + " 💎" });
          } else {
            events.push({ type: "nocollect", snap: snap(), message: "Здесь нет кристалла. Встань на 💎." });
          }
          afterEnemyTurn();
          return idx >= 0;
        },
        wait: function () { endTurn("wait"); events.push({ type: "wait", snap: snap() }); afterEnemyTurn(); return true; },
        is_wall: function (dir) { need(dir); var d = DIRS[dir]; return isWall(par, st.px + d[0], st.py + d[1]); },
        is_enemy: function (dir) {
          need(dir); var d = DIRS[dir], tx = st.px + d[0], ty = st.py + d[1];
          return st.enemies.some(function (e) { return e.alive && e.x === tx && e.y === ty; });
        },
        is_crystal: function (dir) {
          need(dir); var d = DIRS[dir], tx = st.px + d[0], ty = st.py + d[1];
          return st.crystals.some(function (c) { return c.x === tx && c.y === ty; });
        },
        is_exit: function (dir) {
          need(dir); var d = DIRS[dir];
          return st.exit && st.exit.x === st.px + d[0] && st.exit.y === st.py + d[1];
        },
        get_x: function () { return st.px; },
        get_y: function () { return st.py; },
        get_energy: function () { return st.energy; },
        crystals_left: function () { return st.total - st.collected; }
      };
    }

    function doMove(dir) {
      endTurn("move " + dir);
      var d = DIRS[dir], nx = st.px + d[0], ny = st.py + d[1];
      if (isWall(par, nx, ny)) {
        events.push({ type: "bump", dir: dir, snap: snap(), message: "Тук! Там стена ⬛." });
      } else {
        var blocked = st.enemies.some(function (e) { return e.alive && e.x === nx && e.y === ny; });
        if (blocked) {
          events.push({ type: "bump", dir: dir, snap: snap(), message: "Там вирус 👾! Сначала attack()." });
        } else {
          st.px = nx; st.py = ny;
          events.push({ type: "move", dir: dir, snap: snap() });
          var pi = -1;
          st.pickups.forEach(function (p, i) { if (p.x === st.px && p.y === st.py) pi = i; });
          if (pi >= 0) {
            st.pickups.splice(pi, 1);
            st.energy += 6;
            events.push({ type: "cell", snap: snap(), message: "🔋 Энергоячейка! +6 энергии." });
          }
        }
      }
      afterEnemyTurn();
      return true;
    }

    function endTurn(what) {
      if (st.over) throw { __halt: true, win: st.win };
      st.turns++;
      st.energy -= 1;
      if (st.turns > level.maxTurns + 10) {
        st.over = true; st.win = false;
        events.push({ type: "lose", snap: snap(), message: "Ходы кончились (лимит " + level.maxTurns + "). Нужен более короткий алгоритм!" });
        throw { __halt: true, win: false };
      }
      if (st.energy < 0) st.energy = 0;
    }

    function afterEnemyTurn() {
      // враги — stationary guards: стоят на посту, бьют, если герой рядом.
      // (Не гоняются за игроком — так решения учеников детерминированы.)
      st.enemies.forEach(function (e) {
        if (!e.alive || st.over) return;
        var dist = Math.abs(e.x - st.px) + Math.abs(e.y - st.py);
        if (dist === 1) {
          st.energy -= 3;
          events.push({ type: "hurt", snap: snap(), message: "Вирус бьёт! −3 энергии (осталось " + Math.max(st.energy, 0) + ")" });
        }
      });
      if (st.energy <= 0) {
        st.over = true; st.win = false;
        events.push({ type: "lose", snap: snap(), message: "Энергия кончилась! Робот отключился. Иди короче и бей вирусов первым." });
        throw { __halt: true, win: false };
      }
      // победа?
      if (st.exit && st.px === st.exit.x && st.py === st.exit.y && st.collected >= st.total) {
        st.over = true; st.win = true;
        events.push({ type: "win", snap: snap(), message: "Портал активирован! Уровень пройден за " + st.turns + " ходов." });
        throw { __halt: true, win: true };
      }
    }

    function snap() {
      return {
        px: st.px, py: st.py, energy: Math.max(st.energy, 0), turns: st.turns,
        collected: st.collected, total: st.total,
        enemies: st.enemies.map(function (e) { return { x: e.x, y: e.y, alive: e.alive, rank: e.rank, boss: !!e.boss }; }),
        crystals: st.crystals.map(function (c) { return { x: c.x, y: c.y }; }),
        pickups: st.pickups.map(function (p) { return { x: p.x, y: p.y }; })
      };
    }
  }

  return { simulate: simulate, parseMap: parseMap };
})();
