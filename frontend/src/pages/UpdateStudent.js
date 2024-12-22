import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateStudent.css'; // CSS file riêng cho trang cập nhật thông tin

const UpdateStudent = () => {
  const { studentId } = useParams(); // Retrieve studentId from the URL
  const [student, setStudent] = useState({
    student_id: '',
    fullname: '',
    dob: '',
    school: '',
    major: '',
    email: '',
    profileImage: '',
    imageLeft: '',
    imageRight: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch student data from the API using the studentId
    axios.get(`http://localhost:3000/api/students/profile/${studentId}`)
      .then((response) => {
        setStudent(response.data);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy thông tin sinh viên:', error);
      });
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullname', student.fullname);
    formData.append('dob', student.dob);
    formData.append('school', student.school);
    formData.append('major', student.major);
    formData.append('email', student.email);
    if (student.profileImage) {
      formData.append('profileImage', student.profileImage);
    }
    if (student.imageLeft) {
      formData.append('imageLeft', student.imageLeft);
    }
    if (student.imageRight) {
      formData.append('imageRight', student.imageRight);
    }

    axios.put(`http://localhost:3000/api/students/update/${studentId}`, formData)
      .then((response) => {
        setMessage('Cập nhật thông tin thành công!');
        navigate(`/students/profile/${studentId}`);
      })
      .catch((error) => {
        console.error('Lỗi khi cập nhật thông tin sinh viên:', error);
        setMessage('Không thể cập nhật thông tin. Vui lòng thử lại.');
      });
  };

  return (
    <div className="update-student-container">
      <h1>Cập nhật thông tin sinh viên</h1>
      <form onSubmit={handleSubmit} className="update-student-form">
        <div className="form-group">
          <label>Mã Sinh Viên:</label>
          <input
            type="text"
            name="student_id"
            value={student.student_id}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Họ và Tên:</label>
          <input
            type="text"
            name="fullname"
            value={student.fullname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Ngày Sinh:</label>
          <input
            type="date"
            name="dob"
            value={student.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Trường:</label>
          <input
            type="text"
            name="school"
            value={student.school}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Ngành:</label>
          <input
            type="text"
            name="major"
            value={student.major}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Ảnh Đại Diện:</label>
          <input
            type="file"
            name="profileImage"
            onChange={(e) => setStudent({ ...student, profileImage: e.target.files[0] })}
          />
        </div>
        <div className="form-group">
          <label>Ảnh Bên Trái:</label>
          <input
            type="file"
            name="imageLeft"
            onChange={(e) => setStudent({ ...student, imageLeft: e.target.files[0] })}
          />
        </div>
        <div className="form-group">
          <label>Ảnh Bên Phải:</label>
          <input
            type="file"
            name="imageRight"
            onChange={(e) => setStudent({ ...student, imageRight: e.target.files[0] })}
          />
        </div>
        <button type="submit">Cập nhật</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateStudent;