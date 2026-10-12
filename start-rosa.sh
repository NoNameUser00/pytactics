#!/bin/bash
# PyTactics на Rosa OS (и любом Linux).
# 1) Если собран Electron-десктоп — откроет его.
# 2) Иначе — просто откроет игру в браузере (интернет не нужен).
cd "$(dirname "$0")"
if [ -x "desktop/node_modules/.bin/electron" ]; then
  (cd desktop && ./node_modules/.bin/electron .)
else
  xdg-open index.html
fi
