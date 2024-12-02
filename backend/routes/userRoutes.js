const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Import the Sequelize model
const multer = require('multer'); // For handling file uploads
const upload = multer({ dest: 'uploads/' }); // You can configure where to store images

const router = express.Router();

// Đăng ký người dùng
app.post("/api/register", async (req, res) => {
    const { fullname, email, phone, dob, gender, address, village, password, profileImage } = req.body;
  
    // Kiểm tra dữ liệu đầu vào (ví dụ, kiểm tra trường bắt buộc, định dạng email, ...)
    if (!fullname || !email || !phone || !dob || !gender || !address) {
      return res.status(400).json({ message: "Các trường bắt buộc không được để trống!" });
    }
  
    try {
      // Lưu người dùng vào cơ sở dữ liệu (giả sử bạn đang dùng MySQL hoặc MongoDB)
      const newUser = await User.create({ fullname, email, phone, dob, gender, address, village, password, profileImage });
  
      // Thành công, trả về thông báo thành công
      return res.status(200).json({ message: "Đăng ký thành công!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi khi xử lý yêu cầu!" });
    }
  });
  

module.exports = router;
