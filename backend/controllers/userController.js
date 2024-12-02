const User = require('../models/user');  // Model người dùng
const Student = require('../models/student');  // Model sinh viên
const fs = require('fs');
const csv = require('csv-parser');

// Lấy thông tin người dùng
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error });
  }
};

// Cập nhật thông tin người dùng
exports.updateUserProfile = async (req, res) => {
  try {
    const { fullname, phone, address, gender, dob } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Cập nhật thông tin
    user.fullname = fullname || user.fullname;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.gender = gender || user.gender;
    user.dob = dob || user.dob;

    await user.save();
    res.status(200).json({ message: 'Cập nhật thông tin thành công', user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin', error });
  }
};

// Tải file CSV và thêm sinh viên từ CSV
exports.addStudentsFromCSV = async (req, res) => {
  const filePath = `uploads/csv/${req.file.filename}`;
  const students = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      students.push(row);
    })
    .on('end', async () => {
      try {
        // Lưu danh sách sinh viên vào cơ sở dữ liệu
        for (const student of students) {
          await Student.create({
            name: student.name,
            dob: student.dob,
            studentId: student.studentId,
            classCode: student.classCode,
            profileImage: student.profileImage || null
          });
        }
        res.status(200).json({ message: 'Thêm sinh viên thành công từ CSV' });
      } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm sinh viên từ CSV', error });
      }
    });
};

// Lấy danh sách sinh viên
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sinh viên', error });
  }
};

// Thêm sinh viên
exports.addStudent = async (req, res) => {
  const { name, dob, studentId, classCode } = req.body;
  try {
    const newStudent = await Student.create({
      name,
      dob,
      studentId,
      classCode,
      profileImage: req.file ? req.file.filename : null
    });
    res.status(201).json({ message: 'Thêm sinh viên thành công', student: newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm sinh viên', error });
  }
};

// Xóa sinh viên
exports.deleteStudent = async (req, res) => {
  const studentId = req.params.id;
  try {
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Sinh viên không tồn tại' });
    }

    await student.destroy();
    res.status(200).json({ message: 'Sinh viên đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa sinh viên', error });
  }
};

// Điểm danh sinh viên
exports.markAttendance = async (req, res) => {
  const { studentIds, date } = req.body;
  try {
    // Thực hiện lưu điểm danh ở đây, ví dụ với model Attendance
    // Lưu thông tin điểm danh cho các sinh viên
    res.status(200).json({ message: 'Điểm danh thành công', studentIds, date });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi điểm danh', error });
  }
};
