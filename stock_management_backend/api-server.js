const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
// const database = require("./database");
const { sql, pool } = require("./mssql");

app.use(bodyParser.json());

// 조회
app.get("/api/memos", async (req, res) => {
  res.send("GET 조회");
});

// 추가
app.post("/api/memos", async (req, res) => {
  // try
  try {
    const Pool = await pool;
    // select
    const result = await Pool.request()
      .input("content", sql.NVarChar, req.body.content)
      .query(
        "SELECT ITEM_SKU AS content, ITEM_NAME AS name, ITEM_SIZE AS size, 1 AS number FROM MASTER_ITEM_TB WHERE ITEM_SKU = @content"
      );
    // console.log(result.recordset);
    res.send(result.recordset);
  } catch (err) {
    // console.log(err);
    res.status(500);
    res.send(err.message);
  }
});

//입고 등록
app.post("/api/memos/receive", async (req, res) => {
  // console.log(req.body.length);
  try {
    const Pool = await pool;

    for (var i = 0; i < req.body.length; i++) {
      console.log(req.body[i].content);
      // insert
      await Pool.request()
        .input("content", sql.NVarChar, req.body[i].content)
        .input("number", sql.Int, req.body[i].number)
        .query(`exec [MANAGE_ITEM_RECEIVE_MOBILE2_INS_SP] '@content', @number`);
    }
    res.send("POST 입고");
  } catch (err) {
    // 오류
    res.status(500);
    res.send(err.message);
  }
});
// 출고 등록
app.post("/api/memos/deliver", async (req, res) => {
  try {
    const Pool = await pool;

    for (var i = 0; i < req.body.length; i++) {
      // insert
      await Pool.request()
        .input("content", sql.NVarChar, req.body[i].content)
        .input("number", sql.Int, req.body[i].number)
        .query(`exec [MANAGE_ITEM_DELIVER_MOBILE2_INS_SP] '@content', @number`);
    }
    res.send("POST 출고");
  } catch (err) {
    // console.log(err);
    res.status(500);
    res.send(err.message);
  }
});
// 불량 등록
app.post("/api/memos/bad", async (req, res) => {
  try {
    const Pool = await pool;

    for (var i = 0; i < req.body.length; i++) {
      // insert
      await Pool.request()
        .input("content", sql.NVarChar, req.body[i].content)
        .input("number", sql.Int, req.body[i].number)
        .query(`exec [MANAGE_ITEM_BAD_MOBILE2_INS_SP] '@content', @number`);
    }
    res.send("POST 불량");
  } catch (err) {
    // console.log(err);
    res.status(500);
    res.send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
