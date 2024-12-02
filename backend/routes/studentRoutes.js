const express = require('express');
const { addStudentsFromCSV, addStudent } = require('../controllers/studentController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/csv/' }); // Lưu file CSV tạm thời

const router = express.Router();

// Route thêm sinh viên từ file CSV
router.post('/add-from-csv', upload.single('file'), addStudentsFromCSV);

// Route thêm sinh viên từ form nhập liệu
router.post('/', addStudent);  // Sử dụng form-data để gửi dữ liệu sinh viên và ảnh

module.exports = router;
