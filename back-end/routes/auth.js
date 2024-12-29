const express = require("express");
const db = require("../db.js")
const authRouter = express.Router()

const {sql, connectionString} = db

// Endpoint để kiểm tra thông tin đăng nhập
authRouter.post("/login", (req, res) => {
  const { username, password } = req.body;  // Lấy thông tin từ request body

  const userQuery = `
    SELECT ACCOUNT_ID, ROLE, USERNAME, PASS_WORD 
    FROM [USER]
    WHERE USERNAME = ? AND PASS_WORD = ?
  `;

  // Kiểm tra trong bảng user
  sql.query(connectionString, userQuery, [username, password], (err, userRows) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Error executing query" });
    } else {
      // Nếu tìm thấy trong bảng USER
        if (userRows.length > 0) {
          const user = {
            id: userRows[0].ACCOUNT_ID,  
            username: userRows[0].USERNAME,
            role: userRows[0].ROLE,
          };
          return res.json({ success: true, message: "Đăng nhập thành công", user });
        } 
        
        // Nếu không tìm thấy 
        return res.status(401).json({ success: false, message: "Sai tên người dùng hoặc mật khẩu" });
    }
  });
});

// Endpoint để kiểm tra thông tin đăng ký
authRouter.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Tên người dùng và mật khẩu là bắt buộc" });
  } 

  const getMaxIdQuery = `
    SELECT MAX(CAST(SUBSTRING(ACCOUNT_ID, 4, LEN(ACCOUNT_ID) - 3) AS INT)) AS MaxId
    FROM [USER]
    WHERE ACCOUNT_ID LIKE 'stu%';
  `;

  sql.query(connectionString, getMaxIdQuery, (err, rows) => {
    if (err) {
      console.error("Error fetching max account ID: ", err);
      return res.status(500).json({message: 'Error fetching max account ID' });
    }

    const maxId = rows[0]?.MaxId || 0;
    const newAccountId = `stu${maxId + 1}`;

    const insertQuery = `INSERT INTO [USER] (ACCOUNT_ID, USERNAME, PASS_WORD) VALUES (?, ?, ?)`;

  sql.query(connectionString, insertQuery, [newAccountId, username, password], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false, message: "Không thể đăng ký người dùng" });
    }

    res.status(201).json({ success: true, message: "Người dùng đã được đăng ký thành công" });
  });
  })

  
});

module.exports = authRouter


