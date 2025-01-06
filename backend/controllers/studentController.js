const XLSX = require('xlsx');
const XLSXPopulate = require('xlsx-populate');
const  Student  = require('../models/student'); // Import model Student
const fs = require('fs');
const path = require('path');
//const xlsx = require('xlsx');
// Lấy danh sách sinh viên từ cơ sở dữ liệu
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json(students);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sinh viên:', error);
    res.status(500).json({ error: 'Không thể lấy danh sách sinh viên.' });
  }
};
exports.uploadStudents = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const students = sheetData.map((row) => ({
      student_id: row['Student ID'],
      fullname: row['Full Name'],
      dob: row['Date of Birth'],
      school: row['School'],
      major: row['Major'],
    }));

    await Student.bulkCreate(students);
    res.status(200).json({ message: 'Tải lên danh sách sinh viên thành công.' });
  } catch (error) {
    console.error('Lỗi khi tải lên danh sách sinh viên:', error);
    res.status(500).json({ error: 'Không thể tải lên danh sách sinh viên.' });
  }
};
exports.registerStudent = async (req, res) => {
    try {
        const { student_id, fullname, dob, school, major } = req.body;
    
        const newStudent = await Student.create({
        student_id,
        fullname,
        dob,
        school,
        major,
        profileImage: req.files.profileImage ? req.files.profileImage[0].filename : null,
        imageLeft: req.files.imageLeft ? req.files.imageLeft[0].filename : null,
        imageRight: req.files.imageRight ? req.files.imageRight[0].filename : null,
        });
    
        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Lỗi khi thêm sinh viên:', error);
        res.status(500).json({ message: 'Không thể thêm sinh viên. Vui lòng thử lại.' });
    }
    }
// Controller: Lấy thông tin chi tiết của sinh viên theo student_id
exports.getStudentById = async (req, res) => {
  const { student_id } = req.params;  // Lấy student_id từ URL

  try {
    // Tìm sinh viên theo student_id trong cơ sở dữ liệu
    const student = await Student.findOne({ where: { student_id } });

    if (!student) {
      console.log('Không tìm thấy sinh viên với student_id:', student_id);  // Log lỗi để debug
      return res.status(404).json({ message: 'Không tìm thấy sinh viên với mã này.' });
    }

    res.status(200).json({
      student_id: student.student_id,
      fullname: student.fullname,
      dob: student.dob,
      school: student.school,
      major: student.major,
      profileImage: student.profileImage,
      imageLeft: student.imageLeft,
      imageRight: student.imageRight,
      email: student.email,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sinh viên:', error);
    res.status(500).json({ error: 'Không thể lấy thông tin sinh viên.' });
  }
};


// API tải file Excel và thêm dữ liệu vào cơ sở dữ liệu
// Tải file Excel và lưu danh sách sinh viên vào cơ sở dữ liệu
// Controller: Thêm sinh viên từ file Excel
exports.uploadStudentsFromFile = async (req, res) => {
  const studentsData = req.body.students; // Dữ liệu sinh viên từ frontend

  if (!Array.isArray(studentsData) || studentsData.length === 0) {
    return res.status(400).json({ message: 'Không có dữ liệu sinh viên' });
  }

  try {
    // Kiểm tra mã số sinh viên trước khi thêm vào cơ sở dữ liệu
    for (let student of studentsData) {
      const studentExists = await Student.findOne({ where: { student_id: student.student_id } });
      if (studentExists) {
        return res.status(400).json({ message: `Mã sinh viên ${student.student_id} đã tồn tại!` });
      }
    }

    // Thêm dữ liệu sinh viên vào cơ sở dữ liệu
    for (let student of studentsData) {
      await Student.create({
        student_id: student.student_id,
        fullname: student.fullname,
        dob: student.dob,
        school: student.school,
        major: student.major,
        email: student.email,
        profileImage: student.profileImage,
        imageLeft: student.imageLeft,
        imageRight: student.imageRight,
      });
    }
    res.status(200).json({ message: 'Dữ liệu sinh viên đã được tải lên thành công!' });
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu sinh viên:', error);
    res.status(500).json({ message: 'Lỗi server, không thể thêm dữ liệu sinh viên' });
  }
};
// const XLSXPopulate = require('xlsx-populate');
// const { Student } = require('../models/student'); // Đảm bảo import đúng model Student

// Controller: Xuất danh sách sinh viên ra file Excel
exports.exportStudentsToExcel = async (req, res) => {
  try {
    // Lấy danh sách sinh viên từ cơ sở dữ liệu
    const students = await Student.findAll();

    // Tạo workbook và worksheet
    const workbook = await XLSXPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    // Thiết lập tiêu đề cột
    const headers = ['Mã Sinh Viên', 'Họ và Tên', 'Ngày Sinh', 'Ngành Học', 'Số Buổi Có Mặt', 'Số Buổi Vắng'];
    headers.forEach((header, index) => {
      sheet.cell(1, index + 1).value(header);
    });

    // Thêm dữ liệu sinh viên vào worksheet
    students.forEach((student, rowIndex) => {
      sheet.cell(rowIndex + 2, 1).value(student.student_id);
      sheet.cell(rowIndex + 2, 2).value(student.fullname);
      sheet.cell(rowIndex + 2, 3).value(student.dob);
      sheet.cell(rowIndex + 2, 4).value(student.major);
      sheet.cell(rowIndex + 2, 5).value(student.presentCount);
      sheet.cell(rowIndex + 2, 6).value(student.absentCount);
    });

    // Tạo buffer từ workbook
    const buffer = await workbook.outputAsync();

    // Thiết lập header để tải file
    res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Gửi buffer về client
    res.send(buffer);
  } catch (error) {
    console.error('Lỗi khi xuất danh sách sinh viên ra file Excel:', error);
    res.status(500).json({ message: 'Không thể xuất danh sách sinh viên. Vui lòng thử lại.' });
  }
};
//const { Student } = require('../models/student'); // Đảm bảo import đúng model Student

// Controller: Ghi nhận điểm danh sinh viên
exports.recordAttendance = async (req, res) => {
  try {
    const { student_id, status } = req.body;

    // Tìm sinh viên theo student_id
    const student = await Student.findOne({ where: { student_id } });
    if (!student) return res.status(404).json({ error: "Sinh viên không tồn tại" });

    // Tạo bản ghi điểm danh
    const timestamp = new Date().toISOString(); // Lấy thời gian hiện tại
    const date = timestamp.split('T')[0]; // Lấy ngày hiện tại
    const attendanceRecord = {
      [timestamp]: status === 'present' ? 'có mặt' : 'không có mặt',
    };


    // Cập nhật thông tin điểm danh
    let attendanceRecords = student.attendanceRecords;
    if (!Array.isArray(attendanceRecords)) {
      attendanceRecords = [];
    }
    attendanceRecords.push(attendanceRecord);

    // Cập nhật số buổi có mặt và số buổi vắng mặt
    if (status === 'present') {
      student.presentCount += 1;
    } else if (status === 'absent') {
      student.absentCount += 1;
    }

    student.attendanceRecords = attendanceRecords;
    await student.save();

    res.status(200).json({ message: "Điểm danh thành công", student });
  } catch (error) {
    console.error('Lỗi khi ghi nhận điểm danh:', error);
    res.status(500).json({ error: "Lỗi khi ghi nhận điểm danh" });
  }
};

// Controller: Lấy thông tin điểm danh của sinh viên
exports.getAttendanceRecords = async (req, res) => {
  const { student_id } = req.params;  // Lấy student_id từ URL

  try {
    // Tìm sinh viên theo student_id trong cơ sở dữ liệu
    const student = await Student.findOne({ where: { student_id } });

    if (!student) {
      console.log('Không tìm thấy sinh viên với student_id:', student_id);  // Log lỗi để debug
      return res.status(404).json({ message: 'Không tìm thấy sinh viên với mã này.' });
    }

    res.status(200).json({
      student_id: student.student_id,
      fullname: student.fullname,
      attendanceRecords: student.attendanceRecords,
      presentCount: student.presentCount,
      absentCount: student.absentCount,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin điểm danh sinh viên:', error);
    res.status(500).json({ error: 'Không thể lấy thông tin điểm danh sinh viên.' });
  }
};