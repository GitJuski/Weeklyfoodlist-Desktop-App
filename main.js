/*
    WeeklyFoodlist Desktop Version. Generate random foods to eat for a week.
    Copyright (C) 2025  Juuso Vainikka

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const { getContent, createItem, deleteItem, updateItem } = require("./database/database.js");

// Check environment
const isDev = process.env.NODE_ENV !== "development";

// Functions for using renderer data and database.js functions for crud operations
async function handleCreate(_, data) {
  console.log(data);
  try {
    await createItem(data);
  } catch (err) {
    console.error("An error occured when creating new item")
  }
}

async function handleDelete(_, id) {
  console.log(id);
  try {
    await deleteItem(id);
  } catch (err) {
    console.error(`Failed to delete item ${id}`, err);
  }
}

async function handleUpdate(_, data) {
  console.log(data);
  try {
    await updateItem(data); 
  } catch (err) {
    console.error("Error updating", err)
  }
}

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
    },
    {
      label: "Refresh",
      click: () => {mainWindow.reload()}
    }
  ]);
  Menu.setApplicationMenu(menu); // Use the menu

  // Open devtools if in dev environment
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, "renderer/index.html")); // Show index.html file

  // Send the food data from database to preload.js and on to renderer.js (backend to frontend)
  mainWindow.webContents.on("did-finish-load", async () => {
    try {
      const rows = await getContent();
      mainWindow.webContents.send("update-content", rows);
    } catch (err) {
      console.error(err);
    }
  })
}

// Initializes the main window
app.whenReady().then(() => {
  ipcMain.on("createOperations", handleCreate);
  ipcMain.on("deleteOperations", handleDelete);
  ipcMain.on("updateOperations", handleUpdate);
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
