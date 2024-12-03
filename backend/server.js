const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

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

// API đăng ký người dùng
app.post("/api/register", upload.single("profileImage"), async (req, res) => {
  const { id, fullname, email, phone, dob, gender, village, province, district, commune, password } = req.body;

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

        // Thêm người dùng vào cơ sở dữ liệu
        const sqlInsert = "INSERT INTO user (id, fullname, email, phone, dob, gender, village, province, district, commune, password, profileImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sqlInsert, [id, fullname, email, phone, dob, gender, village, province, district, commune, hashedPassword, req.file.path], (err, result) => {
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
app.post("/api/login", (req, res) => {
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
app.get("/api/user/profile", (req, res) => {
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

      // Trả về thông tin người dùng
      res.json(result[0]);
    });
  });
});

// Khởi động server
const port = 3000; // Backend chạy trên cổng 3000
app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
