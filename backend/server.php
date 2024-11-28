<?php
header('Access-Control-Allow-Origin: *'); // Cho phép frontend gọi API
header('Content-Type: application/json'); // Định dạng trả về JSON

include('db.php');

if ($_GET['action'] == 'getStudents') {
    $query = "SELECT id, name FROM students";
    $result = $conn->query($query);

    $students = [];
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }

    echo json_encode($students);
}
?>
