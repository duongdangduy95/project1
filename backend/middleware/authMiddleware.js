const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Lấy token từ header

  if (!token) {
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token hết hạn hoặc không hợp lệ' });
    }

    req.user = user;  // Lưu thông tin người dùng vào request
    next();
  });
};

module.exports = authenticateJWT;
