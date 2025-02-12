# Weeklyfoodlist Desktop Application version

This is my Desktop app version of the Weeklyfoodlist Web app I made a while back.

This personal hobbyproject is in progress.

## The app

The app is done with Electron, so the whole thing is done with JavaScript/HTML/CSS. The reason I did this is because I had just found out about something like Electron and I though that building a Desktop app with Web app tools should be pretty easy when it's something this small and simple. I am not by any means a web app programmer or even a programmer at all. I just like to write code when it's something manageable and something I want to write. I'm more of a scripter when it comes to code, so the main goal is to write working code without thinking too much about other things like optimization. After all, these miniprojects are for personal use and for the fun of creating.

As database, I'm using SQLITE. This is because it's fast and easy to setup with a single file database. I named it weeklyfoodlist and I added it to .gitignore. I setup this small test db for fast prototyping like this:
1. I downloaded sqlite3 with `sudo dnf install sqlite3`. The machine I'm working with on this project is using Fedora which is why I used dnf to install it.
2. `sqlite3 weeklyfoodlist`
3. `CREATE TABLE food(Title text, Description text, Rating int, Category text);`
4. Then I added some test data: `INSERT INTO food VALUES("something", "something", something, "something");`

This is what the treeview looks like without the node_modules/ directory and without the LICENSE and README.md files:
```
.
├── database
│   ├── database.js
│   └── weeklyfoodlist
├── main.js
├── package.json
├── package-lock.json
├── preload.js
└── renderer
    ├── index.html
    ├── renderer.js
    └── style.css

3 directories, 9 files
```
Electron uses a main process and a renderer process. I like to think of these as Backend (main process) and Frontend (Renderer process). To transfer data between these two, we use IPC (Inter-Process Communication). At the time of writing this, I've created a one way flow from main to renderer. Since I'm using context-isolation, I need to use the preload.js file to expose the API to the renderer.
This is how I've understood the process, but this is my first time using Electron and I'm bad at JavaScript so my explanation and my implementation could be flawed. I did rely heavily on the official Electron documentation though.

## What's next?

I will add:
~~1. a programmatic creation of the database if not created~~
2. Way to manage the data inside the database from the app ui (CRUD)

I will tackle these when I find the time and I'm not focusing on other projects.

## DISCLAIMER

I'm not to be held accountable in events of any harm in any way caused directly or indirectly by this application. Use the content at your own risk.
