const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Đảm bảo đường dẫn tới file db.js chính xác

const Student = sequelize.define('Student', {
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  classCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,  // Ảnh có thể null
  },
});

module.exports = Student;
