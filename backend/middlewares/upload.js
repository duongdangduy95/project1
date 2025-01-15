const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình lưu ảnh vào thư mục uploads/profileImage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profileImage');
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = Date.now() + fileExtension;
    cb(null, fileName);
  }
});

// Khởi tạo multer với cấu hình trên
const upload = multer({ storage: storage });

module.exports = upload;