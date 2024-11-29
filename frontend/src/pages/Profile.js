import React from 'react';
import './profile.css';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const avatarUrl = user?.avatar || '/path/to/default-avatar.jpg';  // Đường dẫn ảnh mặc định nếu không có avatar

  return (
    <div className="profile-container">
      <h2>Thông tin người dùng</h2>
      <div className="profile-details">
        <div className="profile-header">
          {/* Ảnh đại diện */}
          <img src={avatarUrl} alt="User Avatar" className="profile-avatar" />
          <div className="profile-info">
            <p><strong>Tên người dùng:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Ngày sinh:</strong> {user?.dob}</p>
            <p><strong>Địa chỉ:</strong> {user?.address}</p>
            <p><strong>Tỉnh/Thành phố:</strong> {user?.province}</p>
            <p><strong>Huyện/Quận:</strong> {user?.district}</p>
            <p><strong>Xã/Phường:</strong> {user?.ward}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
