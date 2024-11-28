// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';

// Import các trang và component
import Home from './pages/Home';
import AttendancePage from './pages/AttendancePage';
import StudentListPage from './pages/StudentListPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/student-list" element={<StudentListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
