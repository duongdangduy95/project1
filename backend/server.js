require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
//const multer = require('multer');
const authRouter = require('./routes/userRoutes'); // Ensure this path is correct

const app = express();

// Ensure 'uploads' directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
// Increase the limit for incoming requests
app.use(bodyParser.json({ limit: '50mb' })); // Adjust limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use("/uploads", express.static("uploads"));
const saveBase64Image = (base64Data, filePath) => {
  const base64String = base64Data.replace(/^data:image\/jpeg;base64,/, ''); // Loại bỏ phần tiền tố
  const buffer = Buffer.from(base64String, 'base64');
  fs.writeFileSync(filePath, buffer);
};
const db = mysql.createConnection({
  host: "localhost", // Đúng tên host
  user: "root",      // Đúng user
  password: "",      // Đúng password
  database: "project1", // Tên database tồn tại
});

db.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối MySQL:", err);
    return;
  }
  console.log("Đã kết nối MySQL");
});

// Define the storage for profile images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Directory to store the uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
  }
});
// Filter for allowed image types (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only jpeg, jpg, and png are allowed'), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: fileFilter });
// Sample middleware to verify token
const authenticateMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;  // Attach user info to request
    next();
  });
};
// User Registration API
app.post("/api/register", upload.single("profileImage"), async (req, res) => {
  const { fullname, email, phone, dob, gender, village, province, district, commune, password } = req.body;

  if (!fullname || !email || !phone || !province || !district || !commune || !password) {
    return res.status(400).json({ message: "Các trường bắt buộc không được để trống!" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "File upload failed!" });
  }

  try {
    const sqlCheck = "SELECT * FROM user WHERE email = ?";
    db.query(sqlCheck, [email], (err, result) => {
      if (err) return res.status(500).json({ message: "Lỗi server!" });
      if (result.length > 0) return res.status(400).json({ message: "Email đã tồn tại!" });

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;

        const sqlInsert = "INSERT INTO user (fullname, email, phone, dob, gender, village, province, district, commune, password, profileImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sqlInsert, [fullname, email, phone, dob, gender, village, province, district, commune, hashedPassword, `uploads/${req.file.filename}`], (err, result) => {
          if (err) throw err;
          res.status(201).json({ message: "Đăng ký thành công!" });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// User Login API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM user WHERE email = ?";

  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server!" });
    if (result.length === 0) return res.status(400).json({ message: "Email không tồn tại!" });

    const user = result[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng!" });

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    });
  });
});
app.get('/api/user/profile', authenticateMiddleware, (req, res) => {
  try {
    const userId = req.user.id; // Get user id from decoded token
    const sql = "SELECT * FROM user WHERE id = ?";
    
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error('Error fetching user profile:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = result[0];  // Get the first (and only) user from the result
      res.json({
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        village: user.village,
        commune: user.commune,
        district: user.district,
        province: user.province,
        profileImage: user.profileImage,  // Add profile image if available
      });
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Add the middleware for uploading files
app.put('/api/user/update', authenticateMiddleware, upload.single('profileImage'), async (req, res) => {
  try {
    const { fullname, phone, province, district, commune, village, gender, dob, email } = req.body;
    const userId = req.user.id; // Get user ID from token
    
    // Check if the user exists in the database
    const sqlCheck = "SELECT * FROM user WHERE id = ?";
    db.query(sqlCheck, [userId], (err, result) => {
      if (err) return res.status(500).json({ message: "Lỗi server!" });
      if (result.length === 0) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      const user = result[0]; // Get the user from the result

      // Update user data with the new fields, keeping the existing ones if not provided
      const updatedFullname = fullname || user.fullname;
      const updatedPhone = phone || user.phone;
      const updatedProvince = province || user.province;
      const updatedDistrict = district || user.district;
      const updatedCommune = commune || user.commune;
      const updatedVillage = village || user.village;
      const updatedGender = gender || user.gender;
      const updatedDob = dob || user.dob;
      const updatedEmail = email || user.email;
      let updatedProfileImage = user.profileImage; // Retain the old image if no new image is provided

      // If a new image is uploaded, delete the old image before saving the new one
      if (req.file) {
        const oldImagePath = path.join(__dirname, 'uploads', user.profileImage); // Path to the old image

        // Delete old image if it exists and is valid
        if (user.profileImage && fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete old image
          console.log(`Deleted old profile image: ${oldImagePath}`);
        }

        updatedProfileImage = `uploads/${req.file.filename}`; // Update the image path
      }

      // SQL query to update user information
      const sqlUpdate = `
        UPDATE user
        SET fullname = ?, phone = ?, province = ?, district = ?, commune = ?, village = ?, gender = ?, dob = ?, email = ?, profileImage = ?
        WHERE id = ?
      `;

      // Log the update data
      // console.log('Updating user with:', {
      //   updatedFullname,
      //   updatedPhone,
      //   updatedProvince,
      //   updatedDistrict,
      //   updatedCommune,
      //   updatedVillage,
      //   updatedGender,
      //   updatedDob,
      //   updatedEmail,
      //   updatedProfileImage,
      // });
      console.log('Old image path:', user.profileImage);
console.log('New image path:', updatedProfileImage);

      // Execute the update SQL query
      db.query(sqlUpdate, [updatedFullname, updatedPhone, updatedProvince, updatedDistrict, updatedCommune, updatedVillage, updatedGender, updatedDob, updatedEmail, updatedProfileImage, userId], (err, result) => {
        if (err) {
          console.error('Error updating user profile:', err);
          return res.status(500).json({ message: 'Lỗi khi cập nhật thông tin', error: err });
        }
        res.status(200).json({
          message: 'Cập nhật thông tin thành công',
          user: {
            id: userId,
            fullname: updatedFullname,
            email: updatedEmail,
            profileImage: `http://localhost:3000/${updatedProfileImage}` // Return the full URL for the profile image
          }
        });
      });
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin', error });
  }
});


app.use('/api/user', authRouter);

// Use the userRoutes for authentication and authorization handling
//app.use('/api/auth', authRouter);
//app.use("/user", authenticateMiddleware, userRouter);

// Start Server
const port = 3000;
app.listen(port, () => console.log(`Server chạy tại http://localhost:${port}`));
