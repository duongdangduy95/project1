// src/pages/AddStudentByFile.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
// import './AddStudentByFile.css';

function AddStudentByFile() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const history = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      setMessage('Vui lòng chọn một file Excel!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:3000/api/students/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        setMessage('Tải lên file thành công!');
        history.push('/student-list');  // Quay lại danh sách sinh viên
      })
      .catch((error) => {
        setMessage('Lỗi khi tải file.');
        console.error('Lỗi khi tải file:', error);
      });
  };

  return (
    <DashboardLayout>
      <div className="add-student-by-file">
        <h1>Thêm Sinh Viên Từ File Excel</h1>
        <div className="upload-section">
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            onChange={handleFileChange} 
          />
          <button onClick={handleUpload}>Tải Lên</button>
        </div>

        {message && <p>{message}</p>}
      </div>
    </DashboardLayout>
  );
}

export default AddStudentByFile;
