import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters
import './StudentProfile.css'; // CSS file riêng cho trang profile

const StudentProfile = () => {
  const { studentId } = useParams(); // Retrieve studentId from the URL
  const [student, setStudent] = useState(null); // State to store student data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Check if studentId exists in the URL
    if (!studentId) {
      setError('Mã sinh viên không hợp lệ');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/api/students/profile/${studentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      
      
      .then((response) => {
        if (!response.ok) {
          throw new Error('Không tìm thấy sinh viên');
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.student_id) {
          setStudent(data); // Store student data in state
        } else {
          setError('Không tìm thấy thông tin sinh viên.');
        }
        setLoading(false); // Set loading to false once data is received or error occurs
      })
      .catch((error) => {
        setError(error.message); // Store error in state if any
        setLoading(false);
      });
  }, [studentId]); // Re-run the effect when studentId changes

  // If loading, show loading message
  if (loading) {
    return <p>Đang tải thông tin sinh viên...</p>;
  }

  // If error, show error message
  if (error) {
    return <p>{error}</p>;
  }

  // If student not found, show message
  if (!student) {
    return <p>Không tìm thấy thông tin sinh viên.</p>;
  }

  return (
    <div className="profile-container">
      <h1>Thông Tin Sinh Viên</h1>
      <div className="profile-card">
        <p><strong>Mã Sinh Viên:</strong> {student.student_id}</p>
        <p><strong>Họ và Tên:</strong> {student.fullname}</p>
        <p><strong>Ngày Sinh:</strong> {student.dob}</p>
        <p><strong>Trường:</strong> {student.school}</p>
        <p><strong>Ngành:</strong> {student.major}</p>
        <p><strong>Email:</strong> {student.email}</p>
        {student.profileImage && (
          <img src={student.profileImage} alt="Profile" className="profile-image" />
        )}
        {student.imageLeft && (
          <img src={student.imageLeft} alt="Left Image" className="profile-image" />
        )}
        {student.imageRight && (
          <img src={student.imageRight} alt="Right Image" className="profile-image" />
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
