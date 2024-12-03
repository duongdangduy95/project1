const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const router = express.Router();

// API đăng ký người dùng
module.exports = (upload, db, bcrypt, jwt) => {
  router.post("/register", upload.single("profileImage"), async (req, res) => {
    const { id, fullname, email, phone, dob, gender, province, district, commune, village, password } = req.body;

    if (!fullname || !email || !phone || !province || !district || !commune || !password) {
      return res.status(400).json({ message: "Các trường bắt buộc không được để trống!" });
    }

    try {
      // Kiểm tra email trùng lặp
      const sqlCheck = "SELECT * FROM user WHERE email = ?";
      db.query(sqlCheck, [email], async (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi khi kiểm tra email" });
        }

        if (result.length > 0) {
          return res.status(400).json({ message: "Email đã được sử dụng!" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Lưu thông tin vào MySQL
        const sql = `
          INSERT INTO user (id, fullname, email, phone, dob, gender, province, district, commune, village, password, profileImage)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          sql,
          [
            id,
            fullname,
            email,
            phone,
            dob,
            gender,
            province,
            district,
            commune,
            village,
            hashedPassword,
            req.file ? req.file.filename : null,
          ],
          (err, result) => {
            if (err) {
              console.error("Lỗi khi đăng ký user:", err);
              return res.status(500).send("Lỗi khi đăng ký user");
            }
            console.log("Đăng ký thành công với ID:", result.insertId);
            res.status(201).send("Đăng ký thành công!");
          }
        );
      });
    } catch (err) {
      console.error("Lỗi trong quá trình xử lý đăng ký:", err);
      res.status(500).send("Đã xảy ra lỗi!");
    }
  });

  // API đăng nhập
  router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra email trong cơ sở dữ liệu
    const sql = "SELECT * FROM user WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
      if (err) {
        console.error("Lỗi kết nối cơ sở dữ liệu:", err);
        return res.status(500).json({ message: "Lỗi khi kết nối cơ sở dữ liệu!" });
      }

      if (result.length === 0) {
        return res.status(400).json({ message: "Email không tồn tại!" });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu không đúng!" });
      }

      // Tạo token
      const token = jwt.sign({ userId: user.id }, "secretKey", { expiresIn: "1h" });
      return res.json({ token });
    });
  });

  // Route để lấy thông tin người dùng (Cần middleware kiểm tra token)
  router.get("/profile", authenticate, (req, res) => {
    const userId = req.userId;

    // Truy vấn thông tin người dùng từ MySQL
    const sql = "SELECT id, fullname, email, phone, dob, gender, province, district, commune, village, profileImage FROM user WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      res.json(result[0]);
    });
  });

  // Route để cập nhật thông tin người dùng (Cần middleware kiểm tra token)
  router.put("/profile/update", authenticate, (req, res) => {
    const userId = req.userId;
    const { fullname, email, phone, dob, gender, province, district, commune, village } = req.body;

    const sql = `
      UPDATE user SET fullname = ?, email = ?, phone = ?, dob = ?, gender = ?, province = ?, district = ?, commune = ?, village = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [fullname, email, phone, dob, gender, province, district, commune, village, userId],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi khi cập nhật thông tin" });
        }

        res.status(200).json({ message: "Cập nhật thông tin thành công!" });
      }
    );
  });

  return router;
};

// Middleware để kiểm tra token (authenticate)
function authenticate(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Không có quyền truy cập!" });
  }

  try {
    const decoded = jwt.verify(token, "secretKey");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }
}
