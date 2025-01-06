import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout'; // Đảm bảo import đúng đường dẫn
import './StudentProfile.css'; // CSS file riêng cho trang hồ sơ sinh viên

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  useEffect(() => {
    // Lấy thông tin sinh viên từ API
    axios.get(`http://localhost:3000/api/students/${studentId}`)
      .then((response) => {
        setStudent(response.data);
      })
      .catch((error) => console.error('Lỗi khi lấy thông tin sinh viên:', error));

    // Lấy thông tin điểm danh của sinh viên từ API
    axios.get(`http://localhost:3000/api/students/${studentId}/attendance`)
      .then((response) => {
        setAttendanceRecords(response.data.attendanceRecords);
        setPresentCount(response.data.presentCount);
        setAbsentCount(response.data.absentCount);
      })
      .catch((error) => console.error('Lỗi khi lấy thông tin điểm danh sinh viên:', error));
  }, [studentId]);

  const handleUpdateProfile = () => {
    navigate(`/students/update/${studentId}`);
  };

  if (!student) {
    return <div>Loading...</div>;
  }
  
  const formattedDoB=student.dob.split('T')[0];
  return (
    <DashboardLayout>
      <div className="student-profile">
        <h1>Hồ Sơ Sinh Viên</h1>
        <div className="profile-header">
          <div className="profile-details">
            <h2>{student.fullname}</h2>
            <p>Mã sinh viên: {student.student_id}</p>
            <p>Ngày sinh: {formattedDoB}</p>
            <p>Ngành học: {student.major}</p>
            <p>Email: {student.email}</p>
            <p>Số buổi có mặt: {presentCount}</p>
            <p>Số buổi nghỉ học: {absentCount}</p>
          </div>
          <div className="image-container">
            <h3>Ảnh Đại Diện</h3>
            {student.profileImage && (
              <img src={`http://localhost:3000/${student.profileImage}`} alt="Profile Image" className="profile-image" />
            )}
          </div>
        </div>
        <button className="update-profile-button" onClick={handleUpdateProfile}>Cập Nhật Thông Tin</button>
        <div className="attendance-records">
          <h3>Thông Tin Điểm Danh</h3>
          <table>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Thời gian</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr key={record.date}>
                  <td>{record.date}</td>
                  <td>{record.time}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;