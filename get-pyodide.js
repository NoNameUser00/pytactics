/* (c) 2026 NoNameUser00. All rights reserved. See LICENSE. */
/* get-pyodide.js — скачивает Pyodide в vendor/pyodide/, чтобы игра работала офлайн.
   Запуск:  node get-pyodide.js
   Файлы уже лежат в репозитории; скрипт нужен только если папка потерялась.
   Версию меняем здесь и в js/pyodide-engine.js — они должны совпадать. */
const fs = require("fs");
const path = require("path");

const VERSION = "314.0.7";                       // совпадает с js/pyodide-engine.js
const OUT = path.join(__dirname, "vendor", "pyodide");
const BASE = "https://cdn.jsdelivr.net/pyodide/v" + VERSION + "/full/";

/* Минимальный набор: загрузчик, ядро CPython и стандартная библиотека.
   Всё вместе ~5,7 МБ — один раз, дальше работает сервис-воркер и офлайн. */
const FILES = [
  "pyodide.js",              // загрузчик, 18 КБ
  "pyodide.asm.wasm",        // сам CPython, 3,3 МБ
  "python_stdlib.zip",       // стандартная библиотека, 2,4 МБ
  "pyodide-lock.json",       // список пакетов
  "pyodide.asm.mjs"          // запасной путь загрузки
];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36";

(async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  let total = 0, done = 0;

  for (const name of FILES) {
    const dest = path.join(OUT, name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1024) {
      const mb = fs.statSync(dest).size / 1048576;
      console.log("уже есть  " + name.padEnd(22) + mb.toFixed(2) + " МБ");
      total += mb; done++;
      continue;
    }
    const url = BASE + name;
    process.stdout.write("качаю    " + name.padEnd(22));
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(180000), headers: { "User-Agent": UA } });
      if (!r.ok) { console.log("— код " + r.status); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      fs.writeFileSync(dest, buf);
      const mb = buf.length / 1048576;
      console.log(mb.toFixed(2) + " МБ");
      total += mb; done++;
    } catch (e) {
      console.log("— ошибка: " + e.message);
    }
  }

  console.log("\nготово " + done + " из " + FILES.length + ", всего " + total.toFixed(1) + " МБ в " + OUT);
  if (done < FILES.length) process.exit(1);
})();