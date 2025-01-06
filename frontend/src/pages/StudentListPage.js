import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './StudentsListpages.css'; // Import CSS file

function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Lấy danh sách sinh viên từ API
  useEffect(() => {
    axios.get('http://localhost:3000/api/students')
      .then((response) => setStudents(response.data))
      .catch((error) => console.error('Lỗi khi lấy danh sách sinh viên:', error));
  }, []);

  // Xử lý tải file
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      setMessage('Vui lòng chọn một file Excel!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:3000/api/students/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        setMessage(response.data.message);
        // Reload danh sách sinh viên
        axios.get('http://localhost:3000/api/students')
          .then((response) => setStudents(response.data));
      })
      .catch((error) => {
        console.error('Lỗi khi tải file:', error);
        setMessage('Không thể tải file. Vui lòng thử lại.');
      });
  };

  // Xử lý tìm kiếm sinh viên
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Lọc danh sách sinh viên theo tên hoặc mã sinh viên
  const filteredStudents = students.filter(student => 
    student.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportExcel = () => {
    if (students.length === 0) {
      alert('Danh sách sinh viên trống!');
      return;
    }

    // Lọc các trường cần thiết
    const studentsFiltered = students.map(student => ({
      'Mã Sinh Viên': student.student_id,
      'Họ và Tên': student.fullname,
      'Ngày Sinh': student.dob,
      'Ngành Học': student.major,
      'Số Buổi Có Mặt': student.presentCount,
      'Số Buổi Vắng': student.absentCount
    }));

    // Chuẩn bị dữ liệu cho file Excel
    const ws = XLSX.utils.json_to_sheet(studentsFiltered); 
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh Sách Sinh Viên');

    // Xuất file Excel
    XLSX.writeFile(wb, 'DanhSachSinhVien.xlsx');
  };

  return (
    <DashboardLayout>
      <div className="student-list-page">
        <h1>Danh Sách Sinh Viên</h1>

        {/* Thanh tìm kiếm */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm sinh viên..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Nút Xuất File Excel */}
        <div className="export-btn">
          <button onClick={handleExportExcel}>Xuất File Excel</button>
        </div>

        {/* Nút Thêm Sinh Viên */}
        <div className="add-student-btn">
          <Link to="/add-student">
            <button>Thêm Sinh Viên</button>
          </Link>
        </div>

        {/* Hiển thị danh sách sinh viên */}
        <div className="student-list">
          {filteredStudents.map((student) => (
            <div key={student.id} className="student-card">
              <h3>{student.fullname}</h3>
              <p>Mã sinh viên: {student.student_id}</p>
              <p>Ngành học: {student.major || 'N/A'}</p>
              <Link to={`/students/profile/${student.student_id}`}>
                <button className="view-profile-btn">Xem Hồ Sơ</button>
              </Link>
            </div>
          ))}
        </div>
        {message && <p className="message">{message}</p>}
      </div>
    </DashboardLayout>
  );
}

export default StudentListPage;