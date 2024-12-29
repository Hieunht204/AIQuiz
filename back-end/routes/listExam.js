const express = require("express");
const db = require("../db.js")
const listExamRouter = express.Router()

const {sql, connectionString} = db

const query = `SELECT * FROM EXAM`;

listExamRouter.get("/", (req, res) => {
  sql.query(connectionString, query, (err, rows) => {
    if (err) {
      console.error("Error executing query", err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(rows); // Trả dữ liệu về dưới dạng JSON
    }
  });
});

module.exports = listExamRouter

