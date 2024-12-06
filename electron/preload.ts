import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("nodeEnv", { process: process });

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  // ...
});

contextBridge.exposeInMainWorld("customAPI", {
  /**
   *  发布main窗口操作消息
   * @param info {type: 操作类型, data: 参数}
   */
  publishMainWindowOperateMessage: (info: { event: string; data: Recordable }) => {
    ipcRenderer.send("Main_Window_Operate", info);
  },
});

contextBridge.exposeInMainWorld("electronAPI", {
  getBrowserWindow: () => ipcRenderer.invoke("get-browser-window"),
});
