import React, { useState, useEffect, useContext } from 'react';
import './Profile.css';
import EditProfile from './EditProfile';
import { AuthContext } from '../LoginPage/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

const Profile = () => {
  const { userId } = useContext(AuthContext);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing from AuthContext");
      return;
    }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching user data for ID:", userId);

        const response = await axios.get(`${API_URL}/api/UserAccount/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data && response.data.success && response.data.data) {
          setUserData(response.data.data);
        } else {
          console.error("Dữ liệu API không hợp lệ:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true);
  };

  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  if (!userData) {
    return <div className="loading">Không tìm thấy dữ liệu người dùng!</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-cover">
        <div className="cover-gradient"></div>
      </div>
      <div className="profile-header">
        <img 
          src={userData.profilePicture || "https://via.placeholder.com/100"} 
          alt="Profile" 
          className="profile-photo" 
        />
        <div className="user-info">
          <h2 className="username">{userData.username}</h2>
        </div>
        <button className="edit-profile" onClick={handleEditProfileClick}>✎ Chỉnh sửa hồ sơ</button>
      </div>
      <div className="profile-content">
        <div className="profile-section">
          <h2>Thông tin cá nhân</h2>
          <p><strong>Tên:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Số điện thoại:</strong> {userData.phoneNumber || "Không có"}</p>
          <p><strong>Địa điểm:</strong> {userData.address || "Không xác định"}</p>
          <p><strong>Ngày đăng ký:</strong> {new Date(userData.registrationDate).toLocaleDateString()}</p>
          <p><strong>Lần đăng nhập cuối:</strong> {new Date(userData.lastLogin).toLocaleString()}</p>
        </div>
      </div>
      {isEditProfileOpen && (
        <EditProfile
        username={userData.username}
        email={userData.email}  // ❌ Bỏ email
        location={userData.address || "Không xác định"} // ❌ Sai prop name
        onClose={handleCloseEditProfile}
      />
      
      )}
    </div>
  );
};

export default Profile;