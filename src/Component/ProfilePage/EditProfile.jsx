import React, { useState, useEffect } from 'react';
import './EditProfile.css'; // Import file CSS

const EditProfile = ({ username, onClose, refetchUserData }) => {
  const [userId, setUserId] = useState(null);
  const [newUsername, setNewUsername] = useState(username);
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [profileImageName, setProfileImageName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Base URL ảnh nếu chỉ lưu tên file
  const imageBaseUrl = 'https://yourserver.com/images/'; // 🔑 Update theo domain ảnh thực tế

  // Fetch user data khi load component
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    console.log('User ID:', storedUserId);

    if (!storedUserId) {
      setErrorMessage('User ID not found in localStorage');
      return;
    }

    setUserId(storedUserId);

    fetch(`/api/UserAccount/${storedUserId}`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch user data');
        return response.json();
      })
      .then((res) => {
        console.log('Fetched user data:', res);
        const data = res.data;
        setNewUsername(data.username || '');
        setNewAddress(data.address || '');
        setNewPhone(data.phoneNumber || '');
        setProfileImageName(data.profilePicture || '');
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Failed to fetch user data');
      });
  }, []);

  // ✅ Xử lý nút Save an toàn
  const handleSave = async () => {
    setErrorMessage('');

    if (!userId) {
      setErrorMessage('User ID not found in localStorage');
      return;
    }

    const jsonData = {
      id: parseInt(userId), // Nếu backend yêu cầu id
      username: newUsername,
      phoneNumber: newPhone,
      profilePicture: profileImageName || null,
      address: newAddress
    };

    console.log("Dữ liệu gửi lên:", jsonData);

    try {
      const response = await fetch(`/api/UserAccount/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const result = await response.json();
      console.log("API trả về:", result);

      alert('Cập nhật hồ sơ thành công!');
      onClose(); // Đóng form chỉnh sửa

      // ✅ Gọi lại fetchUserData từ Profile để cập nhật dữ liệu mới
      if (typeof refetchUserData === 'function') {
        refetchUserData();
      }

    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-content">
        <h2>Chỉnh sửa hồ sơ</h2>

        <label>
          Username:
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Nhập username"
          />
        </label>

        <label>
          Address:
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Nhập địa chỉ"
          />
        </label>

        <label>
          Phone Number:
          <input
            type="tel"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
          />
        </label>

        <label>
          Profile Image URL or File Name:
          <input
            type="text"
            value={profileImageName}
            onChange={(e) => setProfileImageName(e.target.value)}
            placeholder="URL hoặc tên file ảnh"
          />
        </label>

        {/* Hiển thị preview ảnh */}
        {profileImageName && (
          <div className="image-preview">
            <p>Preview:</p>
            <img
              src={profileImageName.startsWith('http') ? profileImageName : `${imageBaseUrl}${profileImageName}`}
              alt="Profile Preview"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #ccc',
                marginTop: '8px'
              }}
            />
          </div>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="edit-profile-buttons">
          <button onClick={handleSave} className="save-btn">Lưu</button>
          <button onClick={onClose} className="cancel-btn">Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
