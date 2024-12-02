const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
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

app.post("/api/Register", upload.single("profileImage"), async (req, res) => {
  const {
    fullName,
    email,
    phone,
    dob,
    gender,
    address,  // Đảm bảo địa chỉ là một đối tượng JSON
    village,
    password,
  } = req.body;

  try {
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu thông tin vào MySQL
    const sql = `
      INSERT INTO user (fullname, email, phone, dob, gender, address, village, password, profileImage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        fullName,
        email,
        phone,
        dob,
        gender,
        JSON.stringify(address),  // Lưu địa chỉ dưới dạng JSON
        village,
        hashedPassword,
        req.file ? req.file.filename : null,  // Lưu tên file ảnh nếu có
      ],
      (err, result) => {
        if (err) {
          console.error("Lỗi khi đăng ký user:", err); // Log lỗi vào terminal
          return res.status(500).send("Lỗi khi đăng ký user");
        }
        console.log("Đăng ký thành công với ID:", result.insertId);  // Log thành công vào terminal
        res.status(201).send("Đăng ký thành công!");
      }
    );
  } catch (err) {
    console.error("Lỗi trong quá trình xử lý đăng ký:", err);  // Log lỗi trong catch
    res.status(500).send("Đã xảy ra lỗi!");
  }
});
