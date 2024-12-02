const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes'); // Đảm bảo đường dẫn chính xác
const sequelize = require('./db'); // Đảm bảo kết nối DB đúng

const app = express();

// Cấu hình middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sử dụng các route
app.use('/api/students', studentRoutes);

// Khởi tạo cơ sở dữ liệu
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.error('Unable to sync database:', error);
  });

// Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
