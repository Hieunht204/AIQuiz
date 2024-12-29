const express = require("express");
const cors = require("cors"); // Import CORS
require('dotenv').config();  // Tải các biến môi trường từ tệp .env

const authRouter = require("./routes/auth.js")
const examRouter = require("./routes/exam.js")
const listExamRouter = require("./routes/listExam.js")
const createQuestionRouter = require("./routes/createQuestion.js")
const completedExamRouter = require("./routes/completedExam.js")

const app = express();

// Kích hoạt CORS để cho phép yêu cầu từ các nguồn khác
app.use(cors());

// Middleware để xử lý dữ liệu JSON trong body
app.use(express.json());
app.use("/", authRouter)
app.use("/exam", examRouter)
app.use("/listExam", listExamRouter)
app.use("/createQuestion", createQuestionRouter)
app.use("/completedExam", completedExamRouter)

// Lắng nghe trên cổng 8000
const port = 8000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

