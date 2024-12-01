import React from 'react';
import { Link } from 'react-router-dom';
import './profile.css';
import './dashboard.css';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const avatarUrl = user?.avatar || '/path/to/default-avatar.jpg'; // Đường dẫn ảnh mặc định

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="header-title">Ứng dụng điểm danh</h1>
      </header>

      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <img src={avatarUrl} alt="User Avatar" className="avatar" />
        <p className="username">{user?.username}</p>
        <ul>
          <li><Link to="/profile">Thông tin cá nhân</Link></li>
          <li><Link to="/class-list">Danh sách lớp</Link></li>
          <li><Link to="/attendance">Điểm danh</Link></li>
        </ul>
      </div>

      {/* Nội dung chính */}
      <main className="dashboard-main">
        <div className="profile-container">
          <h2>Thông tin người dùng</h2>
          <div className="profile-details">
            <div className="profile-header">
              {/* Ảnh đại diện */}
              <img src={avatarUrl} alt="User Avatar" className="profile-avatar" />
              <div className="profile-info">
                <p><strong>Tên người dùng:</strong> {user?.username}</p>
               

                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Số điện thoại:</strong> {user?.phone}</p> {/* Thêm trường Số điện thoại */}
                <p><strong>Ngày sinh:</strong> {user?.dob}</p>
                <p><strong>Giới tính:</strong> {user?.gender}</p> {/* Thêm trường Giới tính */}
                <p><strong>Địa chỉ:</strong> {user?.address}</p>
                <p><strong>Tỉnh/Thành phố:</strong> {user?.province}</p>
                <p><strong>Huyện/Quận:</strong> {user?.district}</p>
                <p><strong>Xã/Phường:</strong> {user?.ward}</p>
              
             
              </div>
            </div>
            {/* Nút cập nhật thông tin */}
            <Link to="/update-profile">
              <button className="update-button">Cập nhật thông tin</button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; 2024 - Ứng dụng điểm danh</p>
      </footer>
    </div>
  );
}

export default Profile;
