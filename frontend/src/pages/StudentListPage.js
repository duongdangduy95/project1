import React from 'react';
import StudentList from '../components/StudentList';
import '../App.css';
function StudentListPage() {
  return (
    
    <div>
       {/* Header */}
       <header>
        <h1>Chào Mừng Đến Với Ứng Dụng Điểm Danh</h1>
      </header>
      <h1>Danh Sách Sinh Viên</h1>
      <StudentList />
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

export default StudentListPage;
