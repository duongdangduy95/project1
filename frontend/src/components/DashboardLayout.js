// src/components/DashboardLayout.js
import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardLayout.css';  // Tạo file CSS riêng cho layout này

function DashboardLayout({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const avatarUrl = user?.avatar || '/path/to/default-avatar.jpg';

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="header-title">Hệ Thống Điểm Danh</h1>
      </header>

      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <img src={avatarUrl} alt="User Avatar" className="avatar" />
          <p className="username">{user?.fullname}</p>
          <ul>
            <li><Link to="/profile">Thông tin cá nhân</Link></li>
            <li><Link to="/student-list">Danh sách sinh viên</Link></li>
            <li><Link to="/attendance">Điểm danh</Link></li>
          </ul>
        </div>

        {/* Main content */}
        <div className="dashboard-main">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; 2024 Hệ Thống Điểm Danh. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default DashboardLayout;
