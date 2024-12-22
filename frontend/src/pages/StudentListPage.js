// src/pages/StudentListPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout'; // Đảm bảo import đúng đường dẫn
import { Link } from 'react-router-dom';  // Để sử dụng cho liên kết
import './StudentsListpages.css';

function StudentListPage() {
  const [students, setStudents] = useState([]);
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

  return (
    <DashboardLayout>
      <div className="student-list-page">
        <h1>Danh Sách Sinh Viên</h1>

        {/* Phần tải file */}
        {/* <div className="upload-section">
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          <button onClick={handleUpload}>Tải Lên</button>
          {message && <p>{message}</p>}
        </div> */}

        {/* Nút Thêm Sinh Viên */}
        <div className="add-student-btn">
          <Link to="/add-student">
            <button>Thêm Sinh Viên</button>
          </Link>
        </div>

        {/* Hiển thị danh sách sinh viên */}
        <div className="student-list">
          {students.map((student) => (
            <div key={student.id} className="student-card">
              <img
                src={student.profileImage || '/path/to/default-avatar.jpg'}
                alt={`${student.fullname}'s Avatar`}
                className="student-avatar"
              />
              <h3>{student.fullname}</h3>
              <p>Mã sinh viên: {student.student_id}</p>
              <p>Ngành học: {student.major || 'N/A'}</p>
              <Link to={`/students/profile/${student.student_id}`}>
  <button className="view-profile-btn">
    View Profile
  </button>
</Link>

            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentListPage;
