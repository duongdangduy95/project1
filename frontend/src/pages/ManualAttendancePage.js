import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout'; // Đảm bảo import đúng đường dẫn
import './ManualAttendancePage.css'; // CSS file riêng cho trang điểm danh bằng tay

const ManualAttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');

  // Lấy danh sách sinh viên từ API
  useEffect(() => {
    axios.get('http://localhost:3000/api/students')
      .then((response) => setStudents(response.data))
      .catch((error) => console.error('Lỗi khi lấy danh sách sinh viên:', error));
  }, []);

  // Xử lý điểm danh sinh viên
  const handleAttendance = (student_id, status) => {
    axios.post('http://localhost:3000/api/students/attendance', { student_id, status })
      .then((response) => {
        setMessage(response.data.message);
        // Cập nhật danh sách sinh viên sau khi điểm danh
        axios.get('http://localhost:3000/api/students')
          .then((response) => setStudents(response.data));
      })
      .catch((error) => {
        console.error('Lỗi khi điểm danh sinh viên:', error);
        setMessage('Không thể điểm danh sinh viên. Vui lòng thử lại.');
      });
  };

  return (
    <DashboardLayout>
      <div className="manual-attendance-page">
        <h1>Điểm Danh Bằng Tay</h1>
        {message && <p>{message}</p>}
        <div className="student-list">
          {students.map((student) => (
            <div key={student.id} className="student-card">
              <h3>{student.fullname}</h3>
              <p>Mã sinh viên: {student.student_id}</p>
              <p>Ngành học: {student.major || 'N/A'}</p>
              <button onClick={() => handleAttendance(student.student_id, 'present')}>Có Mặt</button>
              <button onClick={() => handleAttendance(student.student_id, 'absent')}>Vắng Mặt</button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManualAttendancePage;