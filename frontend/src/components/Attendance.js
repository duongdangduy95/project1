import React, { useState } from 'react';
import '../App.css';
function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [studentId, setStudentId] = useState('');

  const handleSubmit = () => {
    // Gửi yêu cầu điểm danh
    fetch('http://localhost:8000/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    })
    .then(response => response.json())
    .then(data => setAttendance(data));
  };

  return (
    <div>
      <h1>Điểm Danh Sinh Viên</h1>
      <input 
        type="text" 
        value={studentId} 
        onChange={e => setStudentId(e.target.value)} 
        placeholder="Nhập ID sinh viên"
      />
      <button onClick={handleSubmit}>Điểm danh</button>
    </div>
  );
}

export default Attendance;
