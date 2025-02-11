const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "weeklyfoodlist"); // DB file path

// Connecting to the database and creating it if it does not exist
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  }
  else {
    // Creating table food if it does not exist
    db.run(`CREATE TABLE IF NOT EXISTS food(
      ID integer primary key autoincrement,
      Title text,
      Description text,
      Rating integer check(Rating >= 0 and Rating <= 5),
      Category text check(Category in ('Fish', 'Soup', 'Other'))
    );`, (err) => {
      if (err) {
        console.error("Error creating a database or table " + err);
      }
    });
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
