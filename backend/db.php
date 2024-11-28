echo "<?php
// Kết nối MySQL
$servername = 'localhost';
$username = 'root';
$password = '';
$dbname = 'attendance';

// Tạo kết nối
$conn = new mysqli(\$servername, \$username, \$password, \$dbname);

// Kiểm tra kết nối
if (\$conn->connect_error) {
    die('Kết nối thất bại: ' . \$conn->connect_error);
}
?>" > db.php
