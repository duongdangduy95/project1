import React, { useState, useEffect } from "react";
import Select from "react-select"; // Thư viện tìm kiếm và chọn
import data from "./data.json"; // Dữ liệu tỉnh, huyện, xã
import './Register.css';


function Register() {
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

  // Khởi tạo danh sách Tỉnh/Thành phố
  useEffect(() => {
    const provincesArray = Object.keys(data).map((key) => ({
      value: key,
      label: data[key].name_with_type,
    }));
    setProvinces(provincesArray);
  }, []);

  // Xử lý thay đổi Tỉnh/Thành phố
  const handleProvinceChange = (selectedOption) => {
    setSelectedProvince(selectedOption);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setVillage("");

    const selectedProvinceData = data[selectedOption.value];
    if (selectedProvinceData) {
      const districtsArray = Object.keys(selectedProvinceData["quan-huyen"]).map(
        (key) => ({
          value: key,
          label: selectedProvinceData["quan-huyen"][key].name_with_type,
        })
      );
      setDistricts(districtsArray);
    } else {
      setDistricts([]);
    }
  };

  // Xử lý thay đổi Quận/Huyện
  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);
    setSelectedWard(null);
    setVillage("");

    const selectedDistrictData =
      data[selectedProvince.value]["quan-huyen"][selectedOption.value];
    if (selectedDistrictData) {
      const wardsArray = Object.keys(selectedDistrictData["xa-phuong"]).map(
        (key) => ({
          value: key,
          label: selectedDistrictData["xa-phuong"][key].name_with_type,
        })
      );
      setWards(wardsArray);
    } else {
      setWards([]);
    }
  };

  // Xử lý thay đổi Phường/Xã
  const handleWardChange = (selectedOption) => {
    setSelectedWard(selectedOption);
  };

  // Xử lý gửi dữ liệu
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      fullName,
      email,
      phone,
      dob,
      gender,
      address: {
        province: selectedProvince?.label,
        district: selectedDistrict?.label,
        ward: selectedWard?.label,
        village,
      },
    };

    console.log("Dữ liệu gửi đi:", formData);
    alert("Đăng ký thành công!");
  };

  // Render giao diện
  return (
    <div className="register-container">
      <h1>Form Đăng Ký</h1>
      <form onSubmit={handleSubmit} className="register-form">
        {/* Họ và Tên */}
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

        {/* Email */}
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

        {/* Số điện thoại */}
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

        {/* Ngày sinh */}
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

        {/* Giới tính */}
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


        {/* Tỉnh/Thành phố */}
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

        {/* Quận/Huyện */}
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

        {/* Phường/Xã */}
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

        {/* Thôn/xóm */}
        <div className="form-group">
          <label htmlFor="village">Thôn/xóm:</label>
          <input
            id="village"
            type="text"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="Nhập thôn/xóm"
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn-submit">
          Đăng Ký
        </button>
      </form>
    </div>
  );
}

export default Register;