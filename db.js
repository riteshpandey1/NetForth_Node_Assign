const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud_operation",
});

db.connect((err) => {
  if (err) {
    console.log("error" + err);
  } else {
    console.log("connection created");
  }
});

module.exports = db;