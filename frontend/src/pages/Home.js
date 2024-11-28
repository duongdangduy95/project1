import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Trang Chủ</h1>
      <nav>
        <ul>
          <li><Link to="/attendance">Điểm danh</Link></li>
          <li><Link to="/students">Danh sách sinh viên</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
