import { ipcMain, app, BrowserWindow } from "electron";
import path from "node:path";
import { CustomWindowMove } from "./CustomWindowMove";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const customWindowMove = new CustomWindowMove();

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 200,
    height: 200,
    center: true,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });
  // win.webContents.openDevTools(); // 开启控制台
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools();
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }

  customWindowMove.init(win);

  ipcMain.on("Main_Window_Operate", (_event, info) => {
    const operateEvent = info.event || "";
    switch (operateEvent) {
      // 拖拽窗口-开始
      case "homeDragWindowStart":
        {
          // 如果别的窗口也想复用这个自定义拖拽方法可以这么用;
          // const webContents = event.sender;
          // const win = BrowserWindow.fromWebContents(webContents);
          // CustomWindowMove.init(win);
          // CustomWindowMove.start();
          customWindowMove.start();
        }
        break;
      // 拖拽窗口-结束
      case "homeDragWindowEnd":
        {
          customWindowMove.end();
        }
        break;
      default:
        break;
    }
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
