import unidecode
import cv2
import os
import easyocr
import json
import base64
from flask import Flask, request, jsonify
from vietocr.tool.predictor import Predictor
from vietocr.tool.config import Cfg 
from PIL import Image
import numpy as np
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})  # Cấu hình CORS


input_dir = './cropped_images_custom'
output_dir = "./cropped_lines"
os.makedirs(output_dir, exist_ok=True)

# Khởi tạo EasyOCR
reader = easyocr.Reader(['vi', 'en'])

# Khởi tạo VietOCR
config = Cfg.load_config_from_name('vgg_transformer')
config['device'] = 'cpu'  # Chuyển sang 'cuda' nếu sử dụng GPU
detector = Predictor(config)

# Hàm mở rộng bounding box theo từng hướng với thông số riêng
def expand_bbox_custom(bbox, expand_pixels, image_shape):
    x_min, y_min = int(bbox[0][0]), int(bbox[0][1])
    x_max, y_max = int(bbox[2][0]), int(bbox[2][1])
    x_min = max(0, x_min - expand_pixels.get('left', 0))
    x_max = min(image_shape[1], x_max + expand_pixels.get('right', 0))
    y_min = max(0, y_min - expand_pixels.get('top', 0))
    y_max = min(image_shape[0], y_max + expand_pixels.get('bottom', 0))
    return x_min, y_min, x_max, y_max

# Định nghĩa các vùng cần thiết với từ khóa
fields = {
    "Họ tên": {"keywords": ["Họ tên", "Name"], "expand_pixels": {'left': 50, 'right': 700, 'top': 20, 'bottom': 110}},
    "MSSV": {"keywords": ["MSSV", "ID No."], "expand_pixels": {'left': 20, 'right': 130, 'top': 10, 'bottom': 100}},
    "Ngày sinh": {"keywords": ["Ngày sinh", "D.O.B"], "expand_pixels": {'left': 10, 'right': 120, 'top': 30, 'bottom': 60}},
}

# Tạo thư mục lưu ảnh crop
os.makedirs(output_dir, exist_ok=True)

# Hàm chuyển tên file thành ASCII an toàn
def sanitize_filename(filename):
    sanitized = unidecode.unidecode(filename)
    return sanitized.replace(" ", "_")

# Hàm crop ảnh từ bounding box
def crop_image(image, bbox, output_path):
    x_min, y_min, x_max, y_max = bbox
    cropped_image = image[y_min:y_max, x_min:x_max]
    cv2.imwrite(output_path, cropped_image)
    return cropped_image



# Hàm xử lý nhận diện văn bản và lưu kết quả vào thư mục cropped_lines
def process_image(file_path):
    image = cv2.imread(file_path)
    results = reader.readtext(file_path)

    if results:
        bbox, text, confidence = results[-1]  # Lấy bounding box cuối cùng
        (x_min, y_min), (x_max, y_max) = bbox[0], bbox[2]
        x_min, y_min, x_max, y_max = int(x_min), int(y_min), int(x_max), int(y_max)
        cropped_image = image[y_min:y_max, x_min:x_max]

        output_path = os.path.join(output_dir, os.path.basename(file_path))
        cv2.imwrite(output_path, cropped_image)

        # Nhận diện văn bản với VietOCR
        cropped_image_pil = Image.open(output_path)
        recognized_text = detector.predict(cropped_image_pil)
        return recognized_text
    else:
        return "No text found"

def base64_to_image(base64_data):
    base64_data = base64_data.split(",")[1]
    image_data = BytesIO(base64.b64decode(base64_data))
    img = Image.open(image_data)
    return img

# Hàm tạo email từ tên và id
def generate_email(name, id):
     # Tách tên và lấy phần tên cuối cùng
    normalized_name = unidecode.unidecode(name).strip()
    parts = normalized_name.split()
    if len(parts) < 2:
        return ""
    
    last_name = parts[-1].lower()
    initials = ''.join(part[0].lower() for part in parts[:-1])  # Chữ cái đầu của mỗi phần tên trừ tên cuối cùng

    # Lấy 5 số cuối của ID
    short_id = id[-6:]

    # Tạo email
    email = f"{last_name}.{initials}{short_id}@sis.hust.edu.vn"
    return email

@app.route('/process_image', methods=['POST'])
def process_image_route():
    # Danh sách các trường đã được xử lý
    processed_fields = set()

    data = request.get_json()
    image_base64 = data.get('image_base64')



    # Decode base64 image
    try:
        image = base64_to_image(image_base64)
        image = np.array(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    except Exception as e:
        return jsonify({"error": "Invalid image data"}), 400

    if image is None:
        return jsonify({"error": "Invalid image data"}), 400

    # Debug print to check the image type and shape
    print(f"Image type: {type(image)}, Image shape: {image.shape if image is not None else 'None'}")

    # Save the image to a temporary file
    image_path = 'temp_image.jpg'
    cv2.imwrite(image_path, image)

    # Lọc, crop và nhận diện văn bản
    ocr_results = {}
    results = reader.readtext(image)

    for bbox, text, confidence in results:
        for field, params in fields.items():
            if field in processed_fields:
                continue

            # Kiểm tra từ khóa
            if any(keyword in text for keyword in params["keywords"]):
                # Thêm trường vào danh sách đã xử lý
                processed_fields.add(field)

                # Mở rộng bounding box và crop ảnh
                expanded_bbox = expand_bbox_custom(bbox, params["expand_pixels"], image.shape)
                sanitized_field = sanitize_filename(field)
                output_path = os.path.join(output_dir, f"{sanitized_field}.jpg")
                cropped_image = crop_image(image, expanded_bbox, output_path)

                # Nhận diện văn bản với VietOCR
                cropped_image_pil = Image.open(output_path)
                recognized_text = detector.predict(cropped_image_pil)

                # Dừng xử lý các từ khóa khác trong trường hợp đã quét được field này
                break

    # Lưu kết quả OCR vào JSON
    for filename in os.listdir(output_dir):
        file_path = os.path.join(output_dir, filename)
        if os.path.isfile(file_path):
            key = filename.split('.')[0].lower()
            result = process_image(file_path)
            ocr_results[key] = result


    

    # Lưu kết quả vào tệp JSON
    output_data = {
        "name": ocr_results.get("ho_ten", ""),
        "id": ocr_results.get("mssv", ""),
        "dob": ocr_results.get("ngay_sinh", ""),
        "university": "Đại học Bách Khoa Hà Nội",
        "faculty": "Kỹ thuật máy tính",
        "email": generate_email(ocr_results.get("ho_ten", ""), ocr_results.get("mssv", ""))
    }

    # Xóa tất cả các ảnh trong thư mục cropped_images_custom sau khi hoàn thành
    for filename in os.listdir(input_dir):
        file_path = os.path.join(input_dir, filename)
        if os.path.isfile(file_path):
            os.remove(file_path)

    # Xóa tất cả các ảnh trong thư mục cropped_lines sau khi hoàn thành
    for filename in os.listdir(output_dir):
        file_path = os.path.join(output_dir, filename)
        if os.path.isfile(file_path):
            os.remove(file_path)

    print(output_data)
    return jsonify(output_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)