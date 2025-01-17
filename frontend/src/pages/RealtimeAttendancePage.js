import React from 'react';
import AttendanceRealtime from '../components/AttendanceRealtime';
import Sidebar from '../components/Sidebar'; // Import Sidebar
import './RealtimeAttendancePage.css';

function AttendanceRealtimePage() {
    return (
        <div className="myapp">
            <Sidebar /> {/* Thêm Sidebar */}
            <AttendanceRealtime />
            <footer className="real-attenndance-footer">
                <p>&copy; 2024 - Ứng Dụng Điểm Danh. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default AttendanceRealtimePage;