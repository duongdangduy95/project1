import React, { useState, useEffect } from "react";
import Select from "react-select";
import data from "./data.json"; // Dữ liệu tỉnh, huyện, xã
import { useNavigate } from "react-router-dom"; // Thêm useNavigate để điều hướng
import './updateProfile.css';

function UpdateProfile() {
  const navigate = useNavigate(); // Khai báo hook navigate

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
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

      // Set address information (Province, District, Ward)
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
          const ward = data[province.value]["quan-huyen"][district.value]["xa-phuong"]
            ? Object.keys(data[province.value]["quan-huyen"][district.value]["xa-phuong"]).map((key) => ({
                value: key,
                label: data[province.value]["quan-huyen"][district.value]["xa-phuong"][key].name_with_type,
              })).find(w => w.label === user.address?.ward) : null;
          setSelectedWard(ward || null);
        }
      }
    }
  }, [data]);

  const handleProvinceChange = (selectedOption) => {
    setSelectedProvince(selectedOption);
    setSelectedDistrict(null);
    setSelectedWard(null);
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
    setSelectedWard(null);
    setVillage("");

    const selectedDistrictData = data[selectedProvince.value]["quan-huyen"][selectedOption.value];
    if (selectedDistrictData) {
      const wardsArray = Object.keys(selectedDistrictData["xa-phuong"]).map((key) => ({
        value: key,
        label: selectedDistrictData["xa-phuong"][key].name_with_type,
      }));
      setWards(wardsArray);
    } else {
      setWards([]);
    }
  };

  const handleWardChange = (selectedOption) => {
    setSelectedWard(selectedOption);
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

  const handleSubmit = (e) => {
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
        ward: selectedWard?.label,
        village,
      },
    };

    console.log("Dữ liệu gửi đi:", formData);
    alert("Cập nhật thành công!");

    // Cập nhật lại thông tin vào localStorage
    localStorage.setItem('user', JSON.stringify(formData));

    // Chuyển hướng về trang profile sau khi cập nhật thành công
    navigate("/profile");
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
            type="tel"
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
            required
          />
        </div>

        <div className="form-group">
          <label>Giới tính:</label>
          <select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="province">Tỉnh/Thành phố:</label>
          <Select
            id="province"
            options={provinces}
            value={selectedProvince}
            onChange={handleProvinceChange}
            placeholder="Chọn Tỉnh/Thành phố"
          />
        </div>

        <div className="form-group">
          <label htmlFor="district">Quận/Huyện:</label>
          <Select
            id="district"
            options={districts}
            value={selectedDistrict}
            onChange={handleDistrictChange}
            placeholder="Chọn Quận/Huyện"
            isDisabled={!selectedProvince}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ward">Phường/Xã:</label>
          <Select
            id="ward"
            options={wards}
            value={selectedWard}
            onChange={handleWardChange}
            placeholder="Chọn Phường/Xã"
            isDisabled={!selectedDistrict}
          />
        </div>

        <div className="form-group">
          <label htmlFor="village">Thôn/xóm:</label>
          <input
            type="text"
            id="village"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="Nhập Thôn/Xóm"
          />
        </div>

        <div className="form-group">
          <button type="submit" className="update-btn">Cập nhật</button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;
