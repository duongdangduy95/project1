import React from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css'; // Import CSS cho Dashboard

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));  // Lấy thông tin người dùng từ localStorage
  const avatarUrl = user?.avatar || '/path/to/default-avatar.jpg';  // Thay thế bằng ảnh đại diện thực tế của người dùng

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        {/* Ảnh đại diện và tên người dùng */}
        <div className="profile-section">
          <img src={avatarUrl} alt="User Avatar" className="avatar" />
          <div className="user-info">
            <p className="username">{user?.username}</p>
            <div className="profile-links">
              <Link to="/profile">Profile</Link>
              <Link to="/update-profile">Update Profile</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <h2>Chào mừng đến với bảng điều khiển của bạn!</h2>
        <div className="dashboard-buttons">
          <Link to="/add-student">
            <button className="btn btn-primary">Thêm Sinh viên</button>
          </Link>
          <Link to="/attendance">
            <button className="btn btn-secondary">Điểm danh Sinh viên</button>
          </Link>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2024 - Ứng Dụng Điểm Danh</p>
      </footer>
    </div>
  );
}

export default Dashboard;
