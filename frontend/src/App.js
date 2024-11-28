import React, { useEffect, useState } from 'react';

function App() {
  const [students, setStudents] = useState([]); // State lưu danh sách sinh viên

  // Hàm gọi API backend để lấy danh sách sinh viên
  useEffect(() => {
    fetch('http://localhost:8000/server.php?action=getStudents')
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error('Lỗi khi tải danh sách sinh viên:', error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Attendance App</h1>
      <h2>Danh sách sinh viên</h2>
      {students.length > 0 ? (
        <ul>
          {students.map((student, index) => (
            <li key={index}>
              {student.name} - {student.id}
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có sinh viên nào trong danh sách.</p>
      )}
    </div>
  );
}

export default App;
