import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

function AddStudentByScan() {
  const history = useNavigate();
  const [file, setFile] = useState(null);
  const [base64Image, setBase64Image] = useState('');

  const handleScan = () => {
    alert('Quét thẻ thành công!');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Image(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadResponse = await fetch('http://localhost:3000/api/upload/student_card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });
      const uploadData = await uploadResponse.json();
      if (uploadResponse.ok) {
        alert('Upload ảnh thành công!');

        // Gọi API để xử lý ảnh
        const processResponse = await fetch('http://127.0.0.1:5001/process_image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image_base64: base64Image }),
        });
        const processData = await processResponse.json();
        console.log('processData:', processData);
        if (processResponse.ok) {
          alert('Xử lý ảnh thành công!');

          // Tạo FormData và thêm sinh viên vào hệ thống
          const formData = new FormData();
          formData.append('student_id', processData.id);
          formData.append('fullname', processData.name);

          //chuyển đầu vào dob từ string sang Date
          let inputDate = processData.dob;;
          const [day, month, year] = inputDate.split('/');  // Tách ngày, tháng, năm
          const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          formData.append('dob', formattedDate);
          formData.append('school', processData.university);
          formData.append('major', processData.faculty);
          formData.append('email', processData.email);

          //tạo các đối tượng File hợp lệ
          const profileImage = new File([""], "frontend/public/blank_avatar.jpg", { type: "image/jpeg" });
          const imageLeft = new File([""], "frontend/public/blank_avatar.jpg", { type: "image/jpeg" });
          const imageRight = new File([""], "frontend/public/blank_avatar.jpg", { type: "image/jpeg" });

          formData.append('profileImage', profileImage);
          formData.append('imageLeft', imageLeft);
          formData.append('imageRight', imageRight);
          formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
          });


          const registerResponse = await fetch('http://localhost:3000/api/students/register', {
            method: 'POST',
            body: formData,
          });
          const registerData = await registerResponse.json();
          if (registerResponse.ok) {
            alert('Thêm sinh viên thành công!');
          } else {
            alert(`Lỗi khi thêm sinh viên: ${registerData.message}`);
          }
        } else {
          alert(`Lỗi khi xử lý ảnh: ${processData.message}`);
        }
      } else {
        alert(`Lỗi: ${uploadData.message}`);
      }
    } catch (error) {
      console.error('Error uploading or processing image:', error);
      alert('Lỗi khi upload hoặc xử lý ảnh');
    }
  };

  return (
    <DashboardLayout>
      <div className="add-student-by-scan">
        <h1>Thêm Sinh Viên Bằng Ảnh Thẻ</h1>
        {/* <div className="scan-section">
          <button onClick={handleScan}>Quét Mã Sinh Viên</button>
        </div> */}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="student_card">Upload Ảnh Thẻ Sinh Viên:</label>
            <input type="file" id="student_card" name="student_card" onChange={handleFileChange} />
          </div>
          <button type="submit">Upload</button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default AddStudentByScan;