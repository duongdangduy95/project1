const {  Sequelize,DataTypes } = require('sequelize');
const sequelize = require('../db'); // Đảm bảo bạn đã có kết nối MySQL
//const sequelize = new Sequelize('mysql://user:password@localhost:3306/database');
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: true,
  },
  province: {
    type: DataTypes.STRING, // Trường tỉnh
    allowNull: false,
  },
  district: {
    type: DataTypes.STRING, // Trường huyện
    allowNull: false,
  },
  commune: {
    type: DataTypes.STRING, // Trường xã
    allowNull: false,
  },

  village:{
    type: DataTypes.STRING, 
    allowNull: true,
  },
  profileImage: {
    type: DataTypes.STRING, // Lưu trữ đường dẫn hoặc tên file ảnh
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING, // Lưu trữ mật khẩu đã được mã hóa (hashed)
    allowNull: false,
  },
});

module.exports = User;
