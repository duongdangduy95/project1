// userRoutes.js
require("dotenv").config(); // Sử dụng biến môi trường
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");

const router = express.Router();

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads", "profileImages");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, Date.now() + fileExtension);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Chỉ được upload file ảnh (jpeg, png)"));
    }
    cb(null, true);
  },
});

// Đăng ký
router.post("/register", upload.single("profileImage"), async (req, res) => {
  const { fullname, email, phone, dob, gender, village, province, district, commune, password } = req.body;

  if (!fullname || !email || !phone || !province || !district || !commune || !password) {
    return res.status(400).json({ message: "Các trường bắt buộc không được để trống!" });
  }

  try {
    // Kiểm tra email tồn tại
    const sqlCheck = "SELECT * FROM user WHERE email = ?";
    db.query(sqlCheck, [email], async (err, result) => {
      if (err) return res.status(500).json({ message: "Lỗi server khi kiểm tra email" });
      if (result.length > 0) return res.status(400).json({ message: "Email đã tồn tại!" });

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Lưu đường dẫn ảnh (nếu có)
      const profileImage = req.file ? path.join("uploads", "profileImages", req.file.filename) : null;

      // Thêm người dùng vào cơ sở dữ liệu
      const sqlInsert = `
        INSERT INTO user 
        (fullname, email, phone, dob, gender, village, province, district, commune, password, profileImage) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(sqlInsert, [fullname, email, phone, dob, gender, village, province, district, commune, hashedPassword, profileImage], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi server khi thêm người dùng" });
        res.status(201).json({ message: "Đăng ký thành công!" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// Đăng nhập
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM user WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server!" });
    if (result.length === 0) return res.status(400).json({ message: "Email không tồn tại!" });

    const user = result[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: "Lỗi server khi kiểm tra mật khẩu!" });
      if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng!" });

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    });
  });
});

// Lấy thông tin user
router.get("/api/user/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const sql = "SELECT * FROM user WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
      if (err) return res.status(500).json({ message: "Lỗi server khi truy vấn thông tin người dùng!" });
      if (result.length === 0) return res.status(404).json({ message: "Người dùng không tồn tại!" });

      res.json(result[0]);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Lỗi xác thực token!" });
  }
});

module.exports = router;
