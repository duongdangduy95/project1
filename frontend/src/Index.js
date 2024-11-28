import React from 'react';
import ReactDOM from 'react-dom/client'; // Sử dụng React 18 API
import App from './App'; // Import file App.js
import './index.css'; // (Tùy chọn) Import file CSS để thêm kiểu dáng

const root = ReactDOM.createRoot(document.getElementById('root')); // Kết nối với thẻ <div id="root"> trong index.html
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
