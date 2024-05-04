var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();
const port = 3000;
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  database: "db",
  // 本番環境では環境変数を使うようにする
  password: "example",
  // SQLインジェクション対策
  stringifyObjects: true,
});

app.use(express.static("public"));

app.use(logger("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(function (req, res, next) {
//   next(createError(404));
// });

connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("success");
});

app.get("/memory", (req, res) => {
  connection.query(
    "SELECT * FROM memory WHERE deleted_at IS NULL",
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("error");
        return;
      }
      console.log(results);
      res.json(results);
    }
  );
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// module.exports = app;
