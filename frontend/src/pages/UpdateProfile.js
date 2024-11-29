import React, { useState } from 'react';
import './updateProfile.css';

function UpdateProfile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [avatar, setAvatar] = useState(user?.avatar || '/path/to/default-avatar.jpg');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [address, setAddress] = useState(user?.address || '');
  const [province, setProvince] = useState(user?.province || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [ward, setWard] = useState(user?.ward || '');

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
    const updatedUser = {
      avatar,
      username,
      email,
      dob,
      address,
      province,
      district,
      ward,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));  // Lưu thông tin mới vào localStorage
  };

  return (
    <div className="update-profile-container">
      <h2>Cập nhật thông tin người dùng</h2>
      <form onSubmit={handleSubmit} className="update-profile-form">
        <div className="form-group">
          <label htmlFor="avatar">Ảnh đại diện</label>
          <input
            type="file"
            id="avatar"
            onChange={handleAvatarChange}
            accept="image/*"
            className="form-control"
          />
          <div className="avatar-preview">
            <img src={avatar} alt="Avatar Preview" className="avatar" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="username">Tên người dùng</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dob">Ngày sinh</label>
          <input
            type="date"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Địa chỉ</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="province">Tỉnh/Thành phố</label>
          <input
            type="text"
            id="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="district">Huyện/Quận</label>
          <input
            type="text"
            id="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ward">Xã/Phường</label>
          <input
            type="text"
            id="ward"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">Cập nhật</button>
      </form>
    </div>
  );
}

export default UpdateProfile;
