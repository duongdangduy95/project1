const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const multer = require("multer");
const bcrypt = require("bcryptjs");

const app = express();
app.use(bodyParser.json());

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

// Cấu hình Multer để upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// API đăng ký user
app.post("/api/register", upload.single("profileImage"), async (req, res) => {
  const {
    fullName,
    email,
    phone,
    dob,
    gender,
    address,
    password,
  } = req.body;

  try {
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu thông tin vào MySQL
    const sql = `
      INSERT INTO user (fullname, email, phone, dob, gender, address, password, profileImage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        fullName,
        email,
        phone,
        dob,
        gender,
        JSON.stringify(address),
        village,
        hashedPassword,
        req.file ? req.file.filename : null,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Lỗi khi đăng ký user");
        }
        res.status(201).send("Đăng ký thành công!");
      }
    );
  } catch (err) {
    res.status(500).send("Đã xảy ra lỗi!");
  }
});

// Khởi động server
app.listen(3000, () => {
  console.log("Server đang chạy trên cổng 3000");
});
