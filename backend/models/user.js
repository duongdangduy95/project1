const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Đảm bảo bạn đã có kết nối MySQL

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
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
  },
  address: {
    type: DataTypes.JSONB, // Lưu dưới dạng JSON để chứa tỉnh, huyện, xã
    allowNull: true,
  },
  profileImage: {
    type: DataTypes.STRING, // Lưu trữ đường dẫn hoặc tên file ảnh
    allowNull: true,
  }
});

module.exports = User;