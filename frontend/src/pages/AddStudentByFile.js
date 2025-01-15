import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import DashboardLayout from '../components/DashboardLayout'; // Đảm bảo import đúng đường dẫn
import './AddStudentByFile.css'; // Import CSS file

const AddStudentByFile = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [existingStudentIds, setExistingStudentIds] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Lấy danh sách mã số sinh viên hiện tại từ server
    axios.get('http://localhost:3000/api/students')
      .then((response) => {
        const studentIds = response.data.map(student => student.student_id);
        setExistingStudentIds(studentIds);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy danh sách sinh viên:', error);
        setMessage('Không thể lấy danh sách sinh viên. Vui lòng thử lại.');
      });
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const students = worksheet.map((row) => ({
        student_id: row['Mã Sinh Viên'],
        fullname: row['Họ và Tên'],
        dob: row['Ngày Sinh'],
        school: row['Trường'],
        major: row['Ngành Học'],
        email: row['Email'],
        profileImage: row['Ảnh Đại Diện'],
      }));

      setStudentsData(students);
    };
    reader.readAsArrayBuffer(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      setMessage('Vui lòng chọn một file Excel!');
      return;
    }

    // Kiểm tra trùng mã số sinh viên với danh sách hiện tại
    const duplicateIds = studentsData.filter(student => existingStudentIds.includes(student.student_id));

    if (duplicateIds.length > 0) {
      setMessage(`Mã số sinh viên đã có trong danh sách: ${duplicateIds.map(student => student.student_id).join(', ')}`);
      return;
    }

    axios.post('http://localhost:3000/api/students/upload', { students: studentsData })
      .then((response) => {
        setMessage(response.data.message);
        navigate('/student-list'); // Điều hướng về trang danh sách sinh viên sau khi tải lên thành công
      })
      .catch((error) => {
        console.error('Lỗi khi tải file:', error);
        setMessage('Không thể tải file. Vui lòng thử lại.');
      });
  };

  return (
    <DashboardLayout>
      <div className="add-student-by-file-page">
        <h1>Thêm Sinh Viên Từ File Excel</h1>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        {studentsData.length > 0 && (
          <>
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã Sinh Viên</th>
                  <th>Họ và Tên</th>
                  <th>Ngày Sinh</th>
                  <th>Email</th>
                  <th>Ngành</th>
                  <th>Trường</th>
                </tr>
              </thead>
              <tbody>
                {studentsData.map((student, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{student.student_id}</td>
                    <td>{student.fullname}</td>
                    <td>{student.dob}</td>
                    <td>{student.email}</td>
                    <td>{student.major}</td>
                    <td>{student.school}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleUpload}>Tải Lên</button>
          </>
        )}
        {message && <p>{message}</p>}
      </div>
    </DashboardLayout>
  );
};

export default AddStudentByFile;