// src/pages/AddStudentByScan.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
// import './AddStudentByScan.css';

function AddStudentByScan() {
  const history = useNavigate();

  const handleScan = () => {
    alert('Quét mã thành công!');
    // Tích hợp thư viện quét mã như `react-qr-reader` hoặc `react-qr-scanner`
  };

  return (
    <DashboardLayout>
      <div className="add-student-by-scan">
        <h1>Thêm Sinh Viên Bằng Quét Mã</h1>
        <div className="scan-section">
          <button onClick={handleScan}>Quét Mã Sinh Viên</button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddStudentByScan;
