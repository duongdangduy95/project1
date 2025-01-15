import React from 'react';
import FaceDetection from '../components/FaceDetection';
import './RollCall.css';

function AttendanceRealtimePage() {
    return (
        <div className="myapp">
            <h1>Điểm danh bằng khuôn mặt</h1>
            <FaceDetection />
        </div>
    );
}

export default AttendanceRealtimePage;