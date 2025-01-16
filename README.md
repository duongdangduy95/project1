# Mô tả cho dự án
## Đề tài 
Dự án này xây dựng một ứng dụng web sử dụng công nghệ nhận diện khuôn mặt để tự động hóa quá trình điểm danh. Ứng dụng mang lại giải pháp nhanh chóng, chính xác, và hiệu quả trong việc quản lý danh sách điểm danh.
---

## Người tham gia
- ** Dương Đăng Duy ** : thiết kế database, các chức năng cơ bản, chức năng thêm sinh viên bằng tay ,thêm sinh viên bằng file, xuất kết quả điểm danh.
- ** Nguyễn Nhật Huy ** : thiết kế frontend, tạo chức năng điểm danh kết hợp nhận diện khuôn mặt, chức năng thêm sinh viên bằng quét thẻ, kiểm thử.

---
## Thiết kế hệ thống
### Kiến trúc tổng quan
- Giao diện người dùng (Frontend):
   - HTML , CSS, JavaScript, reactjs.
   - sử dụng các thư viện reactjs.
- Máy chủ (Backend):
   - Ngôn ngữ :Nodejs, python.
   - Sử dụng các thư viện.
- Cơ sở dữ liệu:
   sử dụng MySQL lưu trữ thông tin sinh viên và thông tin điểm danh của sinh viên.
- Các thư viện AI đã sử dụng
   - nhận điện khuôn mặt deepface : link (https://github.com/serengil/deepface) và (https://github.com/justadudewhohacks/face-api.js)
   - quét thẻ sinh viên VietOCR : link (https://github.com/pbcquoc/vietocr) và (https://github.com/JaidedAI/EasyOCR)
## Danh sách API
### 1.API lấy danh sách sinh viên
- **Endpoint**: `GET /api/students`
- **Mô tả**: Trả về danh sách toàn bộ sinh viên trong hệ thống.
- **Đầu ra**:
  ```json
  [
    {
      "id": 1,
      "student_id":"20220000",
      "fullname": "Nguyễn Văn A",
       "major": "Kỹ thuật máy tính",
      
    },
  ]
### 2.API xem thông tin sinh viên
- **Endpoint**: `GET /api/students/profile/:student_id`
- **Mô tả**: Trả về thông tin chi tiết sinh viên.
- **Đầu ra**:
  ```json
  [
    {
      "student_id":"20220000",
      "fullname": "Nguyễn Văn A",
      "dob":"2004-1-1",
      "school":"Đại học Bách Khoa Hà Nội",
      "major": "Kỹ thuật máy tính",
      "email": "example@example.com"
      
    },
  ]  
### 3.API Đăng ký sinh viên
- **Endpoint**: `POST /api/students/register`
- **Mô tả**: Đăng ký sinh viên.
- **Đầu ra**:thông tin sinh viên dược thêm vào hệ thống
  
 ### 4.API cập nhật thông tin sinh viên
- **Endpoint**: `PUT /api/students/update/:student_id`
- **Mô tả**: sửa thông tin sinh viên.
- **Đầu ra**: thông tin sinh viên đã được sửa đổi
 
### 5.API tìm sinh viên
- **Endpoint**: `GET /api/students/:student_id`
- **Mô tả**: tìm sinh viên.
- **Đầu ra**:
  ```json
  [
    {
      "student_id":"20220000",
      "fullname": "Nguyễn Văn A",
  "major": "Kỹ thuật máy tính",
   },
  ]
### 6.API xuất kết quả điểm danh sinh viên
- **Endpoint**: `GET /api/students/export`
- **Mô tả**: xuất kết quả điểm danh của sinh viên.
- **Đầu ra**: file excel danh sách sinh viên và điểm danh các buổi.
### 7.API điểm danh sinh viên
- **Endpoint**: `POST /api/students/attendance`
- **Mô tả**: lưu kết quả điểm danh sinh viên.
- **Đầu ra**:
  ```json
  [
    {
      "student_id":"20220000",
      "Date": "2025-1-1",
  "time": "10:15:50",
  "status":"có mặt"
   },
  ]
### 8.API lấy thông tin điểm danh
- **Endpoint**: `GET /api/students/:student_id/attendance`
- **Mô tả**: lấy kết quả điểm danh sinh viên.
- **Đầu ra**:
  ```json
  [
    {
      "student_id":"20220000",
      "Date": "2025-1-1",
      "time": "10:15:50",
       "status":"có mặt"
   },
  ]
### 8.API lấy thông tin điểm danh
- **Endpoint**: `GET /api/students/:student_id/attendance`
- **Mô tả**: lấy kết quả điểm danh sinh viên.
- **Đầu ra**:
  ```json
  [
    {
      "student_id":"20220000",
      "Date": "2025-1-1",
      "time": "10:15:50",
       "status":"có mặt"
   },
  ]

### 9.API xóa thông tin sinh viên
- **Endpoint**: `DELETE /api/students/:student_id`
- **Mô tả**: lấy kết quả điểm danh sinh viên.
- **Đầu ra**: xóa sinh viên khỏi danh sách.
## Cách triển khai
### Cài đặt và chạy dự án
  - Bước 1: clone dự án
    ```bash
    git clone https://github.com/yourusername/face-recognition-attendance.git
    cd face-recognition-attendance
  - Bước 2 : Cài đặt các thư viện cần thiết
    ```bash
    npm install
  - Bước 3: Chạy dự án
    ```bash
    npm start
  


