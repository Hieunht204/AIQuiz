const express = require("express");
const db = require("../db.js")
const examRouter = express.Router()

const {sql, connectionString} = db


// Truy vấn lấy dữ liệu từ bảng QUESTION theo EXAM_ID
const getQuery = `SELECT 
    Q.EXAM_ID, 
    Q.CONTENT, 
    Q.OPTION_A, 
    Q.OPTION_B, 
    Q.OPTION_C, 
    Q.OPTION_D, 
    Q.CORRECT_ANSWER, 
    E.TIME_TEST
FROM 
    QUESTION Q
INNER JOIN 
    EXAM E
ON 
    Q.EXAM_ID = E.EXAM_ID
WHERE 
    Q.EXAM_ID = ?`;

// Route để nhận POST request và trả về dữ liệu bài kiểm tra theo examId
examRouter.post("/questions", (req, res) => {
  const { examId } = req.body; // Lấy examId từ body của request
  
  if (!examId) {
    return res.status(400).send("Missing examId in request body");
  }

  sql.query(connectionString, getQuery, [examId], (err, rows) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(rows); // Trả về dữ liệu từ database
    }
  });
});

// Route để lấy điểm kiểm tra lưu vào database
examRouter.post("/submit", (req, res) => {
  const {userId, examId, total} = req.body;

  if (!userId || !examId || total === undefined) {
    return res.status(400).send("Missing userId, examId, or total in request body");
  }

  // Chuyển đổi `total` sang số thực (float)
  const numericTotal = parseFloat(total);
  if (isNaN(numericTotal)) {
    return res.status(400).send("Invalid total value, must be a number")
  }

  // Truy vấn kiểm tra nếu điểm kiểm tra đã tồn tại
  const checkQuery = `
    SELECT * FROM STUDENT_SCORE
    WHERE ACCOUNT_ID = ? AND EXAM_ID = ?`;

  sql.query(connectionString, checkQuery, [userId, examId], (err, rows) => {
    if (err) {
      console.error("Error checking existing result: ", err);
      return res.status(500).send("Error checking existing result in database");
    }

    if (rows.length > 0) {
      // Nếu dữ liệu đã tồn tại, cập nhật lại điểm kiểm tra
      const updateQuery =  `
        UPDATE STUDENT_SCORE
        SET TOTAL = ?
        WHERE ACCOUNT_ID = ? AND EXAM_ID = ?`;

      sql.query(connectionString, updateQuery, [numericTotal, userId, examId], (err) => {
        if (err) {
          console.error("Error updating result: ", err);
          return res.status(500).send("Error updating exam result in database");
        }

        res.status(200).json({ message: "Exam result updated  successfully"});
      });  
    } else {
      // Nếu dữ liệu chưa tồn tại, thêm dữ liệu mới
      const insertQuery = 'INSERT INTO STUDENT_SCORE ([ACCOUNT_ID], [EXAM_ID], [TOTAL]) VALUES (?, ?, ?)';

      sql.query(connectionString, insertQuery, [userId, examId, numericTotal], (err, results) => {
        if (err) {
          console.error("Error inserting result: ", err);
          return res.status(500).send("Error inserting exam result to database");
        }

        res.status(200).json({ message: 'Exam result saved successfully' });
      });
    }
  })

  
});

module.exports = examRouter
