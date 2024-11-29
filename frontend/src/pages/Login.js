import React, { useState } from 'react'; // import useState from React
import axios from 'axios'; // import axios
import { useNavigate } from 'react-router-dom'; // import useNavigate
import '../App.css';


function Login() {
     // Khai báo các state cho username và password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Khai báo navigate từ useNavigate để điều hướng sau khi login thành công
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Gửi yêu cầu đăng nhập
      const response = await axios.post('/api/login', { username, password });
      // Lưu thông tin người dùng và token vào localStorage (hoặc Context, Redux)
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      // Chuyển hướng đến trang dashboard sau khi đăng nhập thành công
      navigate('/dashboard');
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
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
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input type="text" id="username" placeholder="Nhập tên đăng nhập" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input type="password" id="password" placeholder="Nhập mật khẩu" required />
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
