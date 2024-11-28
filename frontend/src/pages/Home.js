import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
  return (
    <div>
      {/* Header */}
      <header>
        <h1>Chào Mừng Đến Với Ứng Dụng Điểm Danh</h1>
      </header>

      {/* Nội dung chính */}
      <main>
        <h1>Trang Chủ</h1>
        <nav>
          <ul>
            <li><Link to="/attendance">Điểm danh</Link></li>
            <li><Link to="/students">Danh sách sinh viên</Link></li>
          </ul>
        </nav>
      </main>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 - Ứng Dụng Điểm Danh</p>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
