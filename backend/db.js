const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Không thể kết nối MySQL:', err.message);
        process.exit(1);
    }
    console.log('Đã kết nối tới MySQL!');
});

module.exports = db;
