import os from "os";
import { join } from "path";
import { app, BrowserWindow, ipcMain } from "electron";
import { WindowAction, WindowState } from "../common/utils";

// disable warnings
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const isWin7 = os.release().startsWith("6.1");
if (isWin7) app.disableHardwareAcceleration();

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;

// @ts-ignore
ipcMain.on("toMain", (event, data) => {
  switch (data) {
    case WindowAction.Close:
      app.exit();
      return;
    case WindowAction.Maximize:
      win?.maximize();
      break;
    case WindowAction.Minimize:
      win?.minimize();
      break;
    case WindowAction.FullScreen:
      (win as BrowserWindow).fullScreen = true;
      break;
    case WindowAction.NormalScreen:
      (win as BrowserWindow).fullScreen = false;
      break;
    case WindowAction.Restore:
      win?.restore();
      break;
  }

  if (win?.isMaximized()) event.reply("fromMain", WindowState.Maximized);
  if (win?.isMinimized()) event.reply("fromMain", WindowState.Minimized);
  if (win?.isFullScreen()) event.reply("fromMain", WindowState.FullScreen);
  event.reply("fromMain", WindowState.Restored);
});

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "../preload/index.cjs"),
    },
    autoHideMenuBar: true,
    frame: false,
    show: false,
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  } else {
    const pkg = await import("../../package.json");
    const url = `http://${pkg.env.HOST || "127.0.0.1"}:${pkg.env.PORT}`;

    win.loadURL(url);
  }

  win.on("ready-to-show", () => {
    win?.show();
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("second-instance", () => {
  if (win) {
    // Someone tried to run a second instance, we should focus our window.
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
