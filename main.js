const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const { db, getContent } = require("./database/database.js");

// Check environment
const isDev = process.env.NODE_ENV !== "development";

// Main window function
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Weekly foodlist",
    width: isDev ? 1000 : 500, // If environment is dev -> Width is 1000 else 500
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      // Context isolation, node integration, process sandboxing, websecurity, allowRunningInsecureContent, exprerimental features, enableBlinkFeatures, allowpopups
      // The above settings should be set according to best practices by default in this version of Electron. More on this can be found in the official documentation: https://electronjs.org/docs/latest/tutorial/security
    }
  });

  // Menu (in progress)
  const menu = Menu.buildFromTemplate([
    {
      label: "Options",
      submenu: [
        {
          label: "Main",
          click: () => {mainWindow.loadFile(path.join("renderer/index.html"))}
        },
        {
          label: "Administration",
          click: () => {mainWindow.loadFile(path.join("renderer/admin.html"))}
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu); // Use the menu

  // Open devtools if in dev environment
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, "renderer/index.html")); // Show index.html file

  // Send the food data from database to preload.js and on to renderer.js (backend to frontend)
  mainWindow.webContents.on("did-finish-load", () => { // This caused some trouble. Does not work without this check
    const foods = getContent((err, rows) => {
      if (err) {
        console.error("Failed to get content: ", err);
      }
      else {
        mainWindow.webContents.send("update-content", rows);
      }
    });
  });
}

// Initializes the main window
app.whenReady().then(() => {
  createMainWindow();

// If no windows -> create main window
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// If windows closed but is running on Mac -> terminate process
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
});
