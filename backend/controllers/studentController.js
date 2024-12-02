const fs = require('fs');
const csv = require('csv-parser');
const Student = require('../models/student');
const multer = require('multer');
const path = require('path');

// Cấu hình multer để tải ảnh đại diện
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profileImages/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Thêm sinh viên từ file CSV
exports.addStudentsFromCSV = (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (let studentData of results) {
          await Student.create({
            fullname: studentData.fullname,
            dob: studentData.dob,
            studentId: studentData.studentId,
            classCode: studentData.classCode,
            profileImage: studentData.profileImage || null,
          });
        }
        res.status(200).json({ message: 'Thêm sinh viên thành công từ CSV' });
      } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm sinh viên từ CSV', error });
      }
    });
};

// Thêm sinh viên từ form nhập liệu
exports.addStudent = [upload.single('profileImage'), async (req, res) => {
  try {
    const { fullname, dob, studentId, classCode } = req.body;
    const profileImage = req.file ? req.file.path : null;

    const newStudent = await Student.create({
      fullname,
      dob,
      studentId,
      classCode,
      profileImage
    });

    res.status(200).json({ message: 'Sinh viên đã được thêm thành công', student: newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm sinh viên', error });
  }
}];
