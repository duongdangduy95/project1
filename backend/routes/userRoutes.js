const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");  // Cấu hình kết nối MySQL

const router = express.Router();

// Cấu hình Multer để upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'profileImages');

    // Kiểm tra xem thư mục đã tồn tại chưa, nếu chưa thì tạo thư mục
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Lấy phần mở rộng của tệp ảnh
    cb(null, Date.now() + fileExtension);  // Đặt tên tệp ảnh duy nhất
  },
});
const upload = multer({ storage });

// API đăng ký người dùng
router.post("/register", upload.single("profileImage"), async (req, res) => {
  const { fullname, email, phone, dob, gender, village, province, district, commune, password } = req.body;

  if (!fullname || !email || !phone || !province || !district || !commune || !password) {
    return res.status(400).json({ message: "Các trường bắt buộc không được để trống!" });
  }

  try {
    // Kiểm tra email trùng lặp
    const sqlCheck = "SELECT * FROM user WHERE email = ?";
    db.query(sqlCheck, [email], (err, result) => {
      if (result.length > 0) {
        return res.status(400).json({ message: "Email đã tồn tại!" });
      }

      // Mã hóa mật khẩu
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;

        // Lưu đường dẫn ảnh vào cơ sở dữ liệu
        const profileImage = req.file ? path.join('uploads', 'profileImages', req.file.filename) : null;

        // Thêm người dùng vào cơ sở dữ liệu
        const sqlInsert = "INSERT INTO user (fullname, email, phone, dob, gender, village, province, district, commune, password, profileImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sqlInsert, [fullname, email, phone, dob, gender, village, province, district, commune, hashedPassword, profileImage], (err, result) => {
          if (err) throw err;
          res.status(201).json({ message: "Đăng ký thành công!" });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// API đăng nhập người dùng
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM user WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(400).json({ message: "Email không tồn tại!" });
    }

    const user = result[0];

    // So sánh mật khẩu
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu không đúng!" });
      }

      // Tạo JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, "secretkey", { expiresIn: "1h" });
      res.json({ token });
    });
  });
});

// Route để lấy thông tin người dùng
router.get("/user/profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header
  if (!token) {
    return res.status(401).json({ message: "Không tìm thấy token!" });
  }

  // Xác thực JWT token
  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token không hợp lệ!" });
    }

    const userId = decoded.id;
    const sql = "SELECT * FROM user WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(404).json({ message: "Người dùng không tồn tại!" });
      }

      res.json(result[0]);
    });
  });
});

module.exports = router;
