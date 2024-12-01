import React, { useState } from 'react'; // import useState from React
import axios from 'axios'; // import axios
import { useNavigate } from 'react-router-dom'; // import useNavigate
import '../App.css';

function Login() {
  // Khai báo các state cho username, password và thông báo (message)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State để lưu thông báo

  // Khai báo navigate từ useNavigate để điều hướng sau khi login thành công
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Mock dữ liệu người dùng
    const mockUser = {
      username: 'testuser',
      password: '123456',
      email: 'testuser@example.com',
      avatar: '/path/to/default-avatar.jpg',
    };
  
    // Kiểm tra thông tin đăng nhập
    if (username === mockUser.username && password === mockUser.password) {
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-token');
  
      // Hiển thị thông báo thành công và chuyển hướng
      setMessage('Đăng nhập thành công!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      // Thông báo lỗi
      setMessage('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };
  
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1>Đăng nhập vào ứng dụng</h1>
      </header>

      {/* Main Content */}
      <main className="home-main">
        <div className="content-wrapper">
          <h2 className="welcome-message">Hãy nhập thông tin đăng nhập của bạn</h2>
          {/* Hiển thị thông báo */}
          {message && <p className="login-message">{message}</p>}

          {/* Form đăng nhập */}
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Đăng nhập</button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2024 - Ứng Dụng Điểm Danh</p>
      </footer>
    </div>
  );
}

export default Login;
