const express = require("express");
const db = require("../db.js")
const completedExamRouter = express.Router()

const {sql, connectionString} = db



completedExamRouter.post("/", async (req, res) => {
    const {userId} = req.body;

    if (!userId) {
        return res.status(400).json({ error: "userId là bắt buộc" });
    }
    
    const query = `
    SELECT EXAM.EXAM_ID, EXAM._NAME, EXAM._TYPE, EXAM.QUANITY, EXAM.TIME_TEST, STUDENT_SCORE.TOTAL
    FROM [STUDENT_SCORE]
    INNER JOIN EXAM ON STUDENT_SCORE.EXAM_ID = EXAM.EXAM_ID
    WHERE [STUDENT_SCORE].ACCOUNT_ID = '${userId}'
    `;
    
    sql.query(connectionString, query, (err, rows) => {
        if (err) {
            console.error("Error executing query", err);
            res.status(500).send("Error retrieving data from database");
        } else {
            console.log("Dữ liệu từ SQL:", rows);
            res.json(rows);
        }
      });


      
});

module.exports = completedExamRouter

