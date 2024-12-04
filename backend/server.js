require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const authRouter = require('./routes/userRoutes'); // Ensure this path is correct

const app = express();

// Ensure 'uploads' directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use("/uploads", express.static("uploads"));

const db = mysql.createConnection({
  host: "localhost", // Đúng tên host
  user: "root",      // Đúng user
  password: "",      // Đúng password
  database: "project1", // Tên database tồn tại
});

db.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối MySQL:", err);
    return;
  }
  console.log("Đã kết nối MySQL");
});

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });
// Sample middleware to verify token
const authenticateMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;  // Attach user info to request
    next();
  });
};
// User Registration API
app.post("/api/register", upload.single("profileImage"), async (req, res) => {
  const { fullname, email, phone, dob, gender, village, province, district, commune, password } = req.body;

  if (!fullname || !email || !phone || !province || !district || !commune || !password) {
    return res.status(400).json({ message: "Các trường bắt buộc không được để trống!" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "File upload failed!" });
  }

  try {
    const sqlCheck = "SELECT * FROM user WHERE email = ?";
    db.query(sqlCheck, [email], (err, result) => {
      if (err) return res.status(500).json({ message: "Lỗi server!" });
      if (result.length > 0) return res.status(400).json({ message: "Email đã tồn tại!" });

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;

        const sqlInsert = "INSERT INTO user (fullname, email, phone, dob, gender, village, province, district, commune, password, profileImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sqlInsert, [fullname, email, phone, dob, gender, village, province, district, commune, hashedPassword, `uploads/${req.file.filename}`], (err, result) => {
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

// User Login API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM user WHERE email = ?";

  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server!" });
    if (result.length === 0) return res.status(400).json({ message: "Email không tồn tại!" });

    const user = result[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng!" });

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    });
  });
});
app.get('/api/user/profile', authenticateMiddleware, (req, res) => {
  try {
    const userId = req.user.id; // Get user id from decoded token
    const sql = "SELECT * FROM user WHERE id = ?";
    
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error('Error fetching user profile:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = result[0];  // Get the first (and only) user from the result
      res.json({
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        village: user.village,
        commune: user.commune,
        district: user.district,
        province: user.province,
        profileImage: user.profileImage,  // Add profile image if available
      });
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Use the userRoutes for authentication and authorization handling
app.use('/api/auth', authRouter);
//app.use("/user", authenticateMiddleware, userRouter);

// Start Server
const port = 3000;
app.listen(port, () => console.log(`Server chạy tại http://localhost:${port}`));
