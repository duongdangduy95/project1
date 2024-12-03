import React, { useState, useEffect } from "react";
import Select from "react-select";
import data from "./data.json"; // Dữ liệu tỉnh, huyện, xã
import { useNavigate } from "react-router-dom"; // Thêm useNavigate để điều hướng
import './updateProfile.css';
import axios from 'axios'; // Import axios để gửi yêu cầu HTTP

function UpdateProfile() {
  const navigate = useNavigate(); // Khai báo hook navigate

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [village, setVillage] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [avatar, setAvatar] = useState(""); // State for avatar image

  useEffect(() => {
    const provincesArray = Object.keys(data).map((key) => ({
      value: key,
      label: data[key].name_with_type,
    }));
    setProvinces(provincesArray);

    // Load user data from localStorage (if available)
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setDob(user.dob || "");
      setGender(user.gender || "");
      setAvatar(user.avatar || ""); // Set avatar from user data

      // Set address information (Province, District, Commune)
      const province = provincesArray.find(p => p.label === user.address?.province);
      setSelectedProvince(province || null);

      if (province) {
        const district = data[province.value]["quan-huyen"]
          ? Object.keys(data[province.value]["quan-huyen"]).map((key) => ({
              value: key,
              label: data[province.value]["quan-huyen"][key].name_with_type,
            })).find(d => d.label === user.address?.district) : null;
        setSelectedDistrict(district || null);

        if (district) {
          const commune = data[province.value]["quan-huyen"][district.value]["xa-phuong"]
            ? Object.keys(data[province.value]["quan-huyen"][district.value]["xa-phuong"]).map((key) => ({
                value: key,
                label: data[province.value]["quan-huyen"][district.value]["xa-phuong"][key].name_with_type,
              })).find(w => w.label === user.address?.commune) : null;
          setSelectedCommune(commune || null);
        }
      }
    }
  }, [data]);

  const handleProvinceChange = (selectedOption) => {
    setSelectedProvince(selectedOption);
    setSelectedDistrict(null);
    setSelectedCommune(null);
    setVillage("");

    const selectedProvinceData = data[selectedOption.value];
    if (selectedProvinceData) {
      const districtsArray = Object.keys(selectedProvinceData["quan-huyen"]).map((key) => ({
        value: key,
        label: selectedProvinceData["quan-huyen"][key].name_with_type,
      }));
      setDistricts(districtsArray);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);
    setSelectedCommune(null);
    setVillage("");

    const selectedDistrictData = data[selectedProvince.value]["quan-huyen"][selectedOption.value];
    if (selectedDistrictData) {
      const communesArray = Object.keys(selectedDistrictData["xa-phuong"]).map((key) => ({
        value: key,
        label: selectedDistrictData["xa-phuong"][key].name_with_type,
      }));
      setCommunes(communesArray);
    } else {
      setCommunes([]);
    }
  };

  const handleCommuneChange = (selectedOption) => {
    setSelectedCommune(selectedOption);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      fullName,
      email,
      phone,
      dob,
      gender,
      avatar,
      address: {
        province: selectedProvince?.label,
        district: selectedDistrict?.label,
        commune: selectedCommune?.label,
        village,
      },
    };

    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');

      // Gửi yêu cầu cập nhật thông tin người dùng lên server
      const response = await axios.put(
        'http://your-backend-api.com/updateUser', // URL API của bạn
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Dữ liệu gửi đi:", formData);
      alert("Cập nhật thành công!");

      // Cập nhật lại thông tin người dùng trong localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Chuyển hướng về trang profile sau khi cập nhật thành công
      navigate("/profile");
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      alert("Cập nhật thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div className="update-profile-container">
      <h1>Cập nhật thông tin cá nhân</h1>
      <form onSubmit={handleSubmit} className="update-profile-form">
        <div className="form-group">
          <label htmlFor="avatar">Ảnh đại diện:</label>
          <input
            type="file"
            id="avatar"
            onChange={handleAvatarChange}
            accept="image/*"
            className="form-control"
          />
          {avatar && <img src={avatar} alt="Avatar Preview" className="avatar-preview" />}
        </div>

        <div className="form-group">
          <label htmlFor="fullName">Họ và tên:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ và tên"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dob">Ngày sinh:</label>
          <input
            type="date"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Giới tính:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="province">Tỉnh/Thành phố:</label>
          <Select
            id="province"
            value={selectedProvince}
            onChange={handleProvinceChange}
            options={provinces}
            placeholder="Chọn Tỉnh/Thành phố"
          />
        </div>

        <div className="form-group">
          <label htmlFor="district">Quận/Huyện:</label>
          <Select
            id="district"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            options={districts}
            placeholder="Chọn Quận/Huyện"
            isDisabled={!selectedProvince}
          />
        </div>

        <div className="form-group">
          <label htmlFor="commune">Phường/Xã:</label>
          <Select
            id="commune"
            value={selectedCommune}
            onChange={handleCommuneChange}
            options={communes}
            placeholder="Chọn Phường/Xã"
            isDisabled={!selectedDistrict}
          />
        </div>

        <div className="form-group">
          <label htmlFor="village">Thôn/Xóm:</label>
          <input
            type="text"
            id="village"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="Nhập thôn/xóm"
          />
        </div>

        <button type="submit">Cập nhật thông tin</button>
      </form>
    </div>
  );
}

export default UpdateProfile;
