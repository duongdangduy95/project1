const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const authRouter = require('./routes/auth');  // Đưa router vào tệp riêng

const app = express();

// Serve images from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cấu hình middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3001", credentials: true }));

// Kết nối MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project1",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Đã kết nối MySQL");
});

// Routes
app.use('/api', authRouter);  // Sử dụng các route từ auth.js

// Khởi động server
const port = 3000;
app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
