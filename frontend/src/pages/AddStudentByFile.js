import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import './AddStudentByFile.css';

const AddStudentByFile = () => {
  const [file, setFile] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Lưu dữ liệu vào state để hiển thị hoặc xử lý sau này
        setStudentsData(jsonData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setMessage('Vui lòng chọn một file Excel!');
      return;
    }

    // Kiểm tra dữ liệu từ file Excel trước khi gửi lên server
    if (studentsData.length === 0) {
      setMessage('Không có dữ liệu từ file Excel!');
      return;
    }

    // Gửi dữ liệu lên server
    axios.post('http://localhost:3000/api/students/upload', { students: studentsData })
      .then((response) => {
        setMessage('Dữ liệu sinh viên đã được tải lên thành công!');
      })
      .catch((error) => {
        console.error('Lỗi khi tải file:', error);
        setMessage('Không thể tải file. Vui lòng thử lại.');
      });
  };

  return (
    <div className="add-student-by-file">
      <h1>Thêm Sinh Viên Từ File Excel</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Tải Lên</button>
      {message && <p>{message}</p>}

      {/* Hiển thị dữ liệu từ file Excel */}
      {studentsData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Mã Sinh Viên</th>
              <th>Họ và Tên</th>
              <th>Ngày Sinh</th>
              <th>Trường</th>
              <th>Ngành</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.map((student, index) => (
              <tr key={index}>
                <td>{student['student_id']}</td>
                <td>{student['fullname']}</td>
                <td>{student['dob']}</td>
                <td>{student['school']}</td>
                <td>{student['major']}</td>
                <td>{student['email']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AddStudentByFile;