require("dotenv").config(); // Using environment variables for sensitive information
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Student = require('../models/student');
const studentController = require('../controllers/studentController');
const authenticateToken = require('../middlewares/authMiddleware'); // Assuming you have a middleware for JWT authentication
const db = require('../db');  
const router = express.Router();

// Tạo thư mục upload nếu chưa tồn tại
const uploadDir = path.join(__dirname, '../uploads/profileImage');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
  }
});

const upload = multer({ storage: storage });

// Route lấy danh sách tất cả sinh viên
router.get('/students', authenticateToken, studentController.getAllStudents);

// Route tìm kiếm sinh viên theo mã sinh viên
router.get('/:student_id', authenticateToken, async (req, res) => {
  try {
    const { student_id } = req.params;
    const student = await Student.findOne({ where: { student_id } });

    if (!student) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên với mã này.' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Lỗi khi tìm sinh viên:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Route thêm sinh viên
router.post(
  '/',
  authenticateToken, // Ensure only authorized users can add students
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'imageLeft', maxCount: 1 },
    { name: 'imageRight', maxCount: 1 }
  ]),
  async (req, res) => {
    const { student_id, fullname, dob, school, major } = req.body;

    // Xử lý tên file ảnh nếu có
    const profileImage = req.files.profileImage ? req.files.profileImage[0].filename : null;
    const imageLeft = req.files.imageLeft ? req.files.imageLeft[0].filename : null;
    const imageRight = req.files.imageRight ? req.files.imageRight[0].filename : null;

    // Truy vấn SQL để thêm sinh viên
    const sql = `
      INSERT INTO students (student_id, fullname, dob, school, major, profileImage, imageLeft, imageRight)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [student_id, fullname, dob, school, major, profileImage, imageLeft, imageRight];

    try {
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Lỗi khi thêm sinh viên:', err);
          return res.status(500).json({ message: 'Không thể thêm sinh viên. Vui lòng thử lại.' });
        }
        res.status(201).json({ message: 'Sinh viên đã được thêm thành công!', studentId: result.insertId });
      });
    } catch (error) {
      console.error('Lỗi khi thêm sinh viên:', error);
      res.status(500).json({ message: 'Không thể thêm sinh viên. Vui lòng thử lại.' });
    }
  }
);


// Route upload danh sách sinh viên từ file
router.post('/students', authenticateToken, upload.single('file'), studentController.uploadStudents);

// Route cập nhật thông tin sinh viên (cập nhật ảnh đại diện và thông tin khác)
router.put('/update/:student_id', authenticateToken, upload.single('profileImage'), async (req, res) => {
  const { student_id } = req.params;
  const { fullname, dob, school, major } = req.body;

  try {
    // Tìm sinh viên cần cập nhật
    const student = await Student.findOne({ where: { student_id } });
    if (!student) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên với mã này.' });
    }

    // Xử lý ảnh cũ và ảnh mới
    const oldProfileImage = student.profileImage;
    const newProfileImage = req.file ? req.file.filename : oldProfileImage;

    // Cập nhật thông tin sinh viên trong cơ sở dữ liệu
    student.fullname = fullname || student.fullname;
    student.dob = dob || student.dob;
    student.school = school || student.school;
    student.major = major || student.major;
    student.profileImage = newProfileImage;

    await student.save();

    // Xóa ảnh cũ nếu có
    if (newProfileImage !== oldProfileImage && oldProfileImage) {
      const oldImagePath = path.join(uploadDir, oldProfileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Xóa ảnh cũ
      }
    }

    res.status(200).json({ message: 'Cập nhật thông tin sinh viên thành công!', student });
  } catch (error) {
    console.error('Lỗi khi cập nhật sinh viên:', error);
    res.status(500).json({ message: 'Không thể cập nhật thông tin sinh viên. Vui lòng thử lại.' });
  }
});

module.exports = router;
