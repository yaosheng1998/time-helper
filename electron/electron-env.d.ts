/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    DIST: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

declare let nodeEnv: { process: NodeJS.Process };

declare let customAPI: {
  publishMainWindowOperateMessage: (info: { event: string; data: Recordable }) => void;
};

declare let electronAPI: {
  getBrowserWindow: () => BrowserWindow;
};

// Used in Renderer process, expose in `preload.ts`
interface Window {
  nodeEnv;
  ipcRenderer: import("electron").IpcRenderer;
  customAPI;
  electronAPI;
}
