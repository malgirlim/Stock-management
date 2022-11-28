const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
// const database = require("./database");
const { sql, pool } = require("./mssql");

app.use(bodyParser.json());

// 조회
app.get("/api/memos", async (req, res) => {
  res.send("사용하지 않는 함수");
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

// manual 수정
app.put("/api/memos/manual/:id", async (req, res) => {
  // await database.run(`UPDATE memos SET number = number +? WHERE id = ?`, [
  //   req.body.number,
  //   req.params.id,
  // ]);

  // const result = await database.run(
  //   "SELECT memos.*, items.name, items.size FROM memos INNER JOIN items ON memos.content = items.content"
  // );
  // res.send(result);
  try {
    const Pool = await pool;

    // insert
    await Pool.request()
      .input("id", sql.Int, req.params.id)
      .input("num", sql.Int, req.body.num)
      .query("UPDATE [mhp_test] SET number = @num WHERE id = @id");

    // select
    const result = await Pool.request().query(
      "SELECT mhp.*, item.ITEM_NAME AS name, item.ITEM_SIZE AS size FROM [mhp_test] AS mhp INNER JOIN [MASTER_ITEM_TB] AS item ON mhp.content = item.ITEM_SKU"
    );
    // console.log(result);
    res.send(result.recordset);
  } catch (err) {
    // console.log(err);
    res.status(500);
    res.send(err.message);
  }
});
// plus 수정
app.put("/api/memos/plus/:id", async (req, res) => {
  // await database.run(`UPDATE memos SET number = number +? WHERE id = ?`, [
  //   req.body.number,
  //   req.params.id,
  // ]);

  // const result = await database.run(
  //   "SELECT memos.*, items.name, items.size FROM memos INNER JOIN items ON memos.content = items.content"
  // );
  // res.send(result);
  try {
    const Pool = await pool;

    // insert
    await Pool.request()
      .input("id", sql.Int, req.params.id)
      .query("UPDATE [mhp_test] SET number = number + 1 WHERE id = @id");

    // select
    const result = await Pool.request().query(
      "SELECT mhp.*, item.ITEM_NAME AS name, item.ITEM_SIZE AS size FROM [mhp_test] AS mhp INNER JOIN [MASTER_ITEM_TB] AS item ON mhp.content = item.ITEM_SKU"
    );
    // console.log(result);
    res.send(result.recordset);
  } catch (err) {
    // console.log(err);
    res.status(500);
    res.send(err.message);
  }
});
// minus 수정
app.put("/api/memos/minus/:id", async (req, res) => {
  // await database.run(`UPDATE memos SET number = number +? WHERE id = ?`, [
  //   req.body.number,
  //   req.params.id,
  // ]);

  // const result = await database.run(
  //   "SELECT memos.*, items.name, items.size FROM memos INNER JOIN items ON memos.content = items.content"
  // );
  // res.send(result);
  try {
    const Pool = await pool;

    // insert
    await Pool.request()
      .input("id", sql.Int, req.params.id)
      .query("UPDATE [mhp_test] SET number = number - 1 WHERE id = @id");

    // select
    const result = await Pool.request().query(
      "SELECT mhp.*, item.ITEM_NAME AS name, item.ITEM_SIZE AS size FROM [mhp_test] AS mhp INNER JOIN [MASTER_ITEM_TB] AS item ON mhp.content = item.ITEM_SKU"
    );
    // console.log(result);
    res.send(result.recordset);
  } catch (err) {
    // console.log(err);
    res.status(500);
    res.send(err.message);
  }
});

app.delete("/api/memos/:id", async (req, res) => {
  // await database.run(`DELETE FROM memos WHERE id = ?`, [req.params.id]);

  // const result = await database.run(
  //   "SELECT memos.*, items.name, items.size FROM memos INNER JOIN items ON memos.content = items.content"
  // );
  // res.send(result);
  try {
    const Pool = await pool;

    // insert
    await Pool.request()
      .input("id", sql.Int, req.params.id)
      .query("DELETE FROM [mhp_test] WHERE id = @id");

    // select
    const result = await Pool.request().query(
      "SELECT mhp.*, item.ITEM_NAME AS name, item.ITEM_SIZE AS size FROM [mhp_test] AS mhp INNER JOIN [MASTER_ITEM_TB] AS item ON mhp.content = item.ITEM_SKU"
    );
    // console.log(result);
    res.send(result.recordset);
  } catch (err) {
    // console.log(err);
    res.status(500);
    res.send(err.message);
  }
});

// 입고 등록
app.post("/api/memos/receive", async (req, res) => {
  try {
    const Pool = await pool;
    // insert
    await Pool.request().query(`exec [MANAGE_ITEM_RECEIVE_MOBILE_INS_SP] 0`);

    // select
    const result = await Pool.request().query(
      "SELECT mhp.*, item.ITEM_NAME AS name, item.ITEM_SIZE AS size FROM [mhp_test] AS mhp INNER JOIN [MASTER_ITEM_TB] AS item ON mhp.content = item.ITEM_SKU"
    );
    // console.log(result);
    res.send(result.recordset);
  } catch (err) {
    // console.log(err);
    res.status(500);
    res.send(err.message);
  }
});
// 출고 등록
app.post("/api/memos/deliver", async (req, res) => {
  try {
    const Pool = await pool;
    // insert
    await Pool.request().query(`exec [MANAGE_ITEM_DELIVER_MOBILE_INS_SP] 0`);

    // select
    const result = await Pool.request().query(
      "SELECT mhp.*, item.ITEM_NAME AS name, item.ITEM_SIZE AS size FROM [mhp_test] AS mhp INNER JOIN [MASTER_ITEM_TB] AS item ON mhp.content = item.ITEM_SKU"
    );
    // console.log(result);
    res.send(result.recordset);
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
    // insert
    await Pool.request().query(`exec [MANAGE_ITEM_BAD_MOBILE_INS_SP] 0`);

    // select
    const result = await Pool.request().query(
      "SELECT mhp.*, item.ITEM_NAME AS name, item.ITEM_SIZE AS size FROM [mhp_test] AS mhp INNER JOIN [MASTER_ITEM_TB] AS item ON mhp.content = item.ITEM_SKU"
    );
    // console.log(result);
    res.send(result.recordset);
  } catch (err) {
    // console.log(err);
    res.status(500);
    res.send(err.message);
  }
});

// 목록 초기화
app.post("/api/memos/init", async (req, res) => {
  try {
    const Pool = await pool;
    // insert
    await Pool.request().query("DELETE FROM mhp_test");

    // select
    const result = await Pool.request().query(
      "SELECT mhp.*, item.ITEM_NAME AS name, item.ITEM_SIZE AS size FROM [mhp_test] AS mhp INNER JOIN [MASTER_ITEM_TB] AS item ON mhp.content = item.ITEM_SKU"
    );
    // console.log(result);
    res.send(result.recordset);
  } catch (err) {
    // console.log(err);
    res.status(500);
    res.send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
