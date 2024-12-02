const express = require('express');
const { getUserProfile, updateUserProfile, addStudentsFromCSV, getAllStudents, addStudent, deleteStudent, markAttendance } = require('../controllers/userController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/profileImages/' });
const authenticateJWT = require('../middleware/authMiddleware');  // Middleware xác thực JWT

const router = express.Router();

// Route lấy thông tin người dùng
router.get('/profile', authenticateJWT, getUserProfile);

// Route cập nhật thông tin người dùng
router.put('/profile', authenticateJWT, updateUserProfile);

// Route tải lên file CSV và thêm sinh viên từ CSV
router.post('/upload-csv', authenticateJWT, upload.single('file'), addStudentsFromCSV);

// Route lấy danh sách sinh viên
router.get('/students', authenticateJWT, getAllStudents);

// Route thêm sinh viên
router.post('/students', authenticateJWT, upload.single('profileImage'), addStudent);

// Route xóa sinh viên
router.delete('/students/:id', authenticateJWT, deleteStudent);

// Route điểm danh
router.post('/attendance', authenticateJWT, markAttendance);

module.exports = router;
