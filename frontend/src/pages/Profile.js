import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        setLoading(false);
      });
    } else {
      console.log('Không tìm thấy token!');
      setLoading(false);
    }
  }, []);

  const avatarUrl = user?.profileImage || '/path/to/default-avatar.jpg'; 

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
          <li><Link to="/profile">Thông tin cá nhân</Link></li>
          <li><Link to="/class-list">Danh sách lớp</Link></li>
          <li><Link to="/attendance">Điểm danh</Link></li>
        </ul>
      </div>

      <main className="dashboard-main">
        <div className="profile-container">
          <h2>Thông tin người dùng</h2>
          <div className="profile-details">
            <div className="profile-header">
              <img src={avatarUrl} alt="User Avatar" className="profile-avatar" />
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
            <Link to="/update-profile">
              <button className="update-button">Cập nhật thông tin</button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2024 - Ứng dụng điểm danh</p>
      </footer>
    </div>
  );
}

export default Profile;
