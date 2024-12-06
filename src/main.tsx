// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/styles/common.less";
import "@/styles/reset.less";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>,
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
