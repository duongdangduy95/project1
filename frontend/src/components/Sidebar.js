import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './sidebar.css';

function Sidebar() {
  const [user, setUser] = useState(null);

  // Lấy thông tin người dùng từ localStorage hoặc API
  useEffect(() => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (token) {
      axios.get('http://localhost:3000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setUser(response.data); // Lưu thông tin người dùng vào state
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
    } else {
      // Nếu không có token thì có thể redirect về trang login hoặc hiển thị thông báo
      console.log('No token found, user is not logged in');
    }
  }, []);

  const avatarUrl = user?.profileImage ? `http://localhost:3000/uploads/profileImage/${user.profileImage}` : '/path/to/default-avatar.jpg';

  return (
    <div className="sidebar">
      {/* Hiển thị avatar và thông tin người dùng */}
      {user ? (
        <>
        <img
  src={`http://localhost:3000/${user.profileImage}`}
  alt="Profile"
  className="avatar"  // Sử dụng class avatar thay vì profile-img
/>

          <p className="username">{user?.fullname}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
      
      <ul>
        <li><Link to="/profile">Thông tin cá nhân</Link></li>
        <li><Link to="/student-list">Danh sách sinh viên</Link></li>
        <li><Link to="/attendance">Điểm danh</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
