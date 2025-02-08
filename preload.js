const { contextBridge, ipcRenderer } = require("electron");

// Expose API for main process to renderer process data flow
contextBridge.exposeInMainWorld("electronAPI", {
  onContentUpdate: (callback) => ipcRenderer.on("update-content", (_event, data) => callback(data))
});

