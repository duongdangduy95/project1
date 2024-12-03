import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import './dashboard.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      axios.get('http://localhost:3000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const avatarUrl = user?.avatarPath
    ? user.avatarPath
    : 'https://via.placeholder.com/100';

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="header-title">Ứng dụng điểm danh</h1>
      </header>

      <div className="dashboard-sidebar">
        <img src={avatarUrl} alt="User Avatar" className="avatar" />
        <p className="username">{user?.fullname}</p>
        <ul>
          <li><a href="/profile">Thông tin cá nhân</a></li>
          <li><a href="/class-list">Danh sách lớp</a></li>
          <li><a href="/attendance">Điểm danh</a></li>
        </ul>
      </div>

      <main className="dashboard-main">
        <div className="profile-container">
          <h2>Thông tin người dùng</h2>
          <div className="profile-details">
            <div className="profile-header">
            <img src={`http://localhost:3000/${user.profileImage}`} alt="Profile" className="profile-img" />
              <div className="profile-info">
                <p><strong>Tên người dùng:</strong> {user?.fullname}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Số điện thoại:</strong> {user?.phone}</p>
                <p><strong>Ngày sinh:</strong> {user?.dob}</p>
                <p><strong>Giới tính:</strong> {user?.gender}</p>
                <p><strong>Địa chỉ:</strong></p>
                <div className="address-container">
                  <p><strong>Tỉnh:</strong> {user?.province}</p>
                  <p><strong>Huyện:</strong> {user?.district}</p>
                  <p><strong>Xã:</strong> {user?.commune}</p>
                  <p><strong>Thôn:</strong> {user?.village}</p>
                </div>
              </div>
            </div>
            <a href="/update-profile">
              <button className="update-button">Cập nhật thông tin</button>
            </a>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2024 Ứng dụng điểm danh</p>
      </footer>
    </div>
  );
}

export default Profile;
