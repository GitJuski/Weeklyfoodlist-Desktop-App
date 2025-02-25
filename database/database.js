const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "weeklyfoodlist"); // DB file path

// Connecting to the database and creating it if it does not exist
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
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
function getContent() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM food;", (err, rows) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Function for inserting new data into the database
function createItem(data) {
  return new Promise((resolve, reject) => {
    const statement = db.prepare("INSERT INTO food(ID, Title, Description, Rating, Category) VALUES(NULL,?,?,?,?);");
    statement.run(data.title, data.desc, data.rating, data.category, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Function for deleting items using ID
function deleteItem(id) {
  return new Promise((resolve, reject) => {
    const statement = db.prepare("DELETE FROM food where ID=?;")
    statement.run(id, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Function for updating item data
function updateItem(data) {
  return new Promise((resolve, reject) => {
    // Remove key:value pairs that have value ""
    for (const value in data) {
      if (data[value] === "") {
        delete data[value];
      }
    }
    const id = data.ID;
    delete data["ID"]; // Remove the ID from the data object -> We don't need to specify it in the SET clause
    let setToUpdate = Object.entries(data).map(([key, value]) => `${key}='${value}'`).toString(); // Create the clause -> for example [Title='Test', ...]
    const sql = `UPDATE food SET ${setToUpdate} WHERE ID=?;`; // Insert the clause
    const statement = db.prepare(sql); // Create the statement with the pieces put together
    statement.run(id, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = { getContent, createItem, deleteItem, updateItem }; // Export db and getContent for use in main.js file and main process
