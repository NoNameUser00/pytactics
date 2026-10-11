/* � 2026 NoNameUser00. ��� ����� ��������. ��. LICENSE. */
/* backend.js — Supabase Auth + облачный прогресс.
   Без настроенного config.js или без интернета — тихий fallback на localStorage.
   Порядок скриптов: config.js -> supabase CDN -> backend.js -> ui.js / universe.js */
window.Backend = (function () {
  "use strict";
  var LS_STARS = "pytactics_stars";
  var LS_TURNS = "pytactics_turns";
  var client = null, user = null;
  var cache = {}, cacheT = {};

  function cfg() { return window.PYT_CONFIG || {}; }
  function configured() {
    var c = cfg();
    return c.SUPABASE_URL && c.SUPABASE_URL.indexOf("http") === 0 &&
           c.SUPABASE_ANON_KEY && c.SUPABASE_ANON_KEY.indexOf("PASTE") !== 0;
  }
  function ls(k) { try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch (e) { return {}; } }

  function init() {
    cache = ls(LS_STARS);
    cacheT = ls(LS_TURNS);
    if (!configured() || !window.supabase) return Promise.resolve({ mode: "local", user: null });
    client = window.supabase.createClient(cfg().SUPABASE_URL, cfg().SUPABASE_ANON_KEY);
    return client.auth.getSession().then(function (r) {
      user = r.data.session ? r.data.session.user : null;
      if (user) return pull().then(function () { return { mode: "cloud", user: user }; });
      return { mode: "cloud", user: null };
    }).catch(function () { return { mode: "local", user: null }; });
  }

  // Облако -> локальный кэш (берём максимум звёзд, минимум ходов)
  function pull() {
    return client.from("progress").select("level_id,stars,best_turns").eq("user_id", user.id)
      .then(function (r) {
        if (r.error) { console.warn("[backend]", r.error.message); return; }
        (r.data || []).forEach(function (row) {
          cache[row.level_id] = Math.max(cache[row.level_id] || 0, row.stars || 0);
          if (row.best_turns != null) {
            cacheT[row.level_id] = cacheT[row.level_id] != null
              ? Math.min(cacheT[row.level_id], row.best_turns) : row.best_turns;
          }
        });
        localStorage.setItem(LS_STARS, JSON.stringify(cache));
        localStorage.setItem(LS_TURNS, JSON.stringify(cacheT));
      });
  }

  function stars() { return cache; }
  function turns() { return cacheT; }
  function currentUser() { return user; }
  function isCloud() { return !!client; }

  // Сохранение: сразу в кэш + localStorage, потом upsert в облако (если вход выполнен)
  function saveStars(levelId, nstars, bestTurns) {
    cache[levelId] = Math.max(cache[levelId] || 0, nstars);
    localStorage.setItem(LS_STARS, JSON.stringify(cache));
    var row = { user_id: user && user.id, level_id: levelId, stars: cache[levelId], updated_at: new Date().toISOString() };
    if (bestTurns != null) {
      cacheT[levelId] = cacheT[levelId] != null ? Math.min(cacheT[levelId], bestTurns) : bestTurns;
      localStorage.setItem(LS_TURNS, JSON.stringify(cacheT));
      row.best_turns = cacheT[levelId];
    }
    if (!client || !user) return Promise.resolve(cache);
    delete row.user_id;
    row.user_id = user.id;
    return client.from("progress").upsert(row, { onConflict: "user_id,level_id" }).then(function (r) {
      if (r.error) console.warn("[backend]", r.error.message);
      return cache;
    });
  }

  function signUp(email, password, nickname) {
    return client.auth.signUp({ email: email, password: password }).then(function (r) {
      if (r.error) throw r.error;
      var u = r.user || (r.data && r.data.user);
      var sess = r.session || (r.data && r.data.session);
      if (u && nickname) {
        return client.from("profiles").upsert({ id: u.id, nickname: nickname }).then(function () {
          return { needConfirm: !sess, user: u };
        });
      }
      return { needConfirm: !sess, user: u };
    });
  }
  function signIn(email, password) {
    return client.auth.signInWithPassword({ email: email, password: password }).then(function (r) {
      if (r.error) throw r.error;
      return r;
    });
  }
  function signOut() {
    if (!client) return Promise.resolve();
    return client.auth.signOut();
  }

  return {
    init: init, stars: stars, turns: turns, currentUser: currentUser, isCloud: isCloud,
    saveStars: saveStars, signUp: signUp, signIn: signIn, signOut: signOut, configured: configured
  };
})();
