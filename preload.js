const { contextBridge, ipcRenderer } = require("electron");

// Expose API for main process to renderer process data flow and other way around
contextBridge.exposeInMainWorld("electronAPI", {
  onContentUpdate: (callback) => ipcRenderer.on("update-content", (_event, data) => callback(data)), // Main to Renderer
  createOperations: (data) => ipcRenderer.send("createOperations", data), // Renderer to Main
  deleteOperations: (id) => ipcRenderer.send("deleteOperations", id),
  updateOperations: data => ipcRenderer.send("updateOperations", data)
});

