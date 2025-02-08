const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "weeklyfoodlist"); // DB file path

// Connecting to the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  }
  else {
    console.log("Connected to the database");
  }
});

// Getting all the content
const getContent = (callback) => {
  db.all("SELECT * FROM food;", [], (err, rows) => {
    if (err) {
      console.error("Error getting content " + err.message);
      callback(err, null);
    }
    else {
      callback(null, rows);
    }
  });
};

module.exports = { db, getContent }; // Export db and getContent for use in main.js file and main process
