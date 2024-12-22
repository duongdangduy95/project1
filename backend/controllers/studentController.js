const XLSX = require('xlsx');
const  Student  = require('../models/student'); // Import model Student
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
exports.uploadStudents = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Lọc và chuẩn hóa dữ liệu từ Excel
    const students = sheetData.map((row) => ({
      student_id: row['student_id'],  // Đảm bảo đúng tên cột là 'student_id'
      fullname: row['fullname'],       // Đảm bảo đúng tên cột là 'fullname'
      dob: row['dob'],                 // Đảm bảo đúng tên cột là 'dob'
      school: row['school'],           // Đảm bảo đúng tên cột là 'school'
      major: row['major'],             // Đảm bảo đúng tên cột là 'major'
    }));

    // Lưu vào database
    await Student.bulkCreate(students);

    res.status(200).json({ message: 'Danh sách sinh viên đã được tải lên thành công!' });
  } catch (error) {
    console.error('Lỗi khi tải file Excel:', error);
    res.status(500).json({ error: 'Không thể tải danh sách sinh viên.' });
  }
};
