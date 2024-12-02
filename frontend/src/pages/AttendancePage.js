import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';
import './AttendancePage.css';

function AttendancePage() {
  const [classList, setClassList] = useState([]);
  const [attendanceEnabled, setAttendanceEnabled] = useState(false);
  const [user, setUser] = useState(null); // Thêm state để lưu thông tin người dùng
  const [file, setFile] = useState(null); // Thêm state để lưu file tải lên

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ localStorage
    setUser(savedUser); // Cập nhật state với thông tin người dùng
  }, []);

  // Hàm xử lý tải lên file CSV
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const fileType = uploadedFile.name.split('.').pop();
      if (fileType === 'csv') {
        // Nếu là file CSV
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result;
          const rows = content.split('\n');
          const classes = rows.map((row) => row.trim()).filter((row) => row); // Chia lớp từ mỗi dòng
          setClassList(classes);
        };
        reader.readAsText(uploadedFile);
      } else {
        // Nếu không phải CSV, hiển thị thông báo lỗi
        alert('Vui lòng tải lên file CSV.');
      }
    }
  };

  // Hàm hạn điểm danh
  const enableAttendance = () => {
    setAttendanceEnabled(true);
  };

  // Hàm bắt đầu điểm danh (mở camera)
  const startAttendance = () => {
    alert('Bắt đầu điểm danh! Mở camera để nhận diện khuôn mặt.');
    // Mở camera và nhận diện khuôn mặt

    // Truy cập video và canvas qua document.getElementById
    const videoElement = document.getElementById('video');
    const canvasElement = document.getElementById('canvas');
    const canvasContext = canvasElement.getContext('2d');

    // // Kiểm tra quyền truy cập camera
    // navigator.mediaDevices
    //   .getUserMedia({ video: true })
    //   .then((stream) => {
    //     videoElement.srcObject = stream;
    //     videoElement.play();
    //     detectFace(videoElement, canvasContext);
    //   })
    //   .catch((error) => {
    //     console.error('Không thể truy cập camera', error);
    //   });
  };

  // Hàm nhận diện khuôn mặt (Sử dụng thư viện như face-api.js hoặc OpenCV)
  // cd ..
  

  if (!user) {
    return <div>Loading...</div>; // Nếu chưa có thông tin người dùng, hiển thị Loading
  }

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Hệ Thống Điểm Danh</h1>
      </header>

      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <img src={user.avatar || '/path/to/default-avatar.jpg'} alt="User Avatar" className="avatar" />
        <p className="username">{user.username}</p> {/* Hiển thị tên người dùng */}
        <ul>
          <li><Link to="/profile">Thông tin cá nhân</Link></li>
          <li><Link to="/class-list">Danh sách lớp</Link></li>
          <li><Link to="/attendance">Điểm danh</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="attendance-main">
        <h2>Điểm Danh</h2>

        {/* Nút tải file CSV */}
        {!classList.length ? (
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              id="file-input"
            />
            <label htmlFor="file-input">
              <button>Tải Danh Sách Lớp</button>
            </label>
          </div>
        ) : (
          <div>
            <h3>Danh Sách Lớp:</h3>
            <ul>
              {classList.map((classItem, index) => (
                <li key={index}>{classItem}</li>
              ))}
            </ul>
            <button onClick={enableAttendance}>Hạn Điểm Danh</button>
          </div>
        )}

        {/* Mở camera khi điểm danh */}
        {attendanceEnabled && (
          <div>
            <button onClick={startAttendance}>Bắt đầu điểm danh</button>
            <div className="camera-container">
              <video id="video" width="640" height="480" autoPlay></video>
              <canvas id="canvas" width="640" height="480"></canvas>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; 2024 Hệ Thống Điểm Danh. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default AttendancePage;
