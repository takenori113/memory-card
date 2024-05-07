const express = require("express");
const logger = require("morgan");
const app = express();
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

app.post("/memory", (req, res) => {
  console.log(req.body);
  const newWord = {
    status: req.body.status,
    question: req.body.question,
    answer: req.body.answer,
  };
  connection.query(
    "INSERT INTO memory (status,question,answer) values(?,?,?)",
    [newWord.status, newWord.question, newWord.answer],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("error");
        return;
      }
      res.send("ok");
    }
  );
});

app.put("/memory/:memoryId", (req, res) => {
  console.log(req.params);
  const memoryId = req.params.memoryId;
  console.log(req.body);
  const word = {
    status: req.body.status,
    question: req.body.question,
    answer: req.body.answer,
  };
  connection.query(
    "update memory set question =?,answer= ? ,status=? where id = ? and deleted_at is Null",
    [word.question, word.answer, word.status, memoryId],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("error");
        return;
      }
      res.send("ok");
    }
  );
});

app.delete("/memory/:memoryId", (req, res) => {
  console.log(req.params);
  const memoryId = req.params.memoryId;
  console.log(req.body);
  connection.query(
    "update memory set deleted_at = ? where id = ?",
    [new Date(), memoryId],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("error");
        return;
      }
      res.send("ok");
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
