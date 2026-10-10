// Десктоп-обёртка PyTactics: открывает локальный index.html (всё уже офлайн-готово).
const { app, BrowserWindow } = require("electron");
const path = require("path");

function create() {
  const w = new BrowserWindow({
    width: 1280,
    height: 900,
    title: "PyTactics — Алгоритмы Грида",
    icon: path.join(__dirname, "..", "icons", "icon-192.png"),
    autoHideMenuBar: true,
    backgroundColor: "#020409"
  });
  w.loadFile(path.join(__dirname, "..", "index.html"));
}

app.whenReady().then(create);
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
