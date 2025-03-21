import React, { useState, useEffect, useContext } from 'react';
import './Profile.css';
import EditProfile from './EditProfile';
import { AuthContext } from '../LoginPage/AuthContext';
import axios from 'axios';
import Header from '../../Component/HomePage/NavBar/NavBar'; // ✅ Import Header
import Footer from '../../Component/HomePage/Footer/Footer'; // ✅ Import Footer

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

const Profile = (isLoggedIn) => {
  const { userId } = useContext(AuthContext);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  // Hàm fetch dữ liệu user
  const fetchUserData = async () => {
    if (!userId) {
      console.error("User ID is missing from AuthContext");
      return;
    }
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

  // Fetch khi load component
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Mở form EditProfile
  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true);
  };

  // Đóng form EditProfile
  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  // ✅ Cập nhật lại dữ liệu khi chỉnh sửa xong
  const handleProfileUpdate = (updatedData) => {
    setUserData(updatedData); // Cập nhật dữ liệu mới vào state
  };

  if (!userData) {
    return <div className="loading">Không tìm thấy dữ liệu người dùng!</div>;
  }

  return (
    <>
      {/* ✅ Thêm Header */}
      <Header isLoggedIn={isLoggedIn} />

      <div className="profile-container">
        <div className="profile-cover">
          <div className="cover-gradient"></div>
        </div>
        <div className="profile-header">
        <img
  src={userData.profilePicture || "https://via.placeholder.com/150"}
  alt="Profile"
  className="profile-avatar" // ✅ Đã đổi class mới
/>

          <div className="user-info">
            <h2 className="username">{userData.username}</h2>
          </div>
          <button className="edit-profile" onClick={handleEditProfileClick}>
            ✎ Edit Profile
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Profile</h2>
            <p><strong>Name:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone Number:</strong> {userData.phoneNumber || "Không có"}</p>
            <p><strong>Address:</strong> {userData.address || "Không xác định"}</p>
            <p><strong>Register Date:</strong> {new Date(userData.registrationDate).toLocaleDateString()}</p>
            <p><strong>Last Login:</strong> {new Date(userData.lastLogin).toLocaleString()}</p>
          </div>
        </div>

        {isEditProfileOpen && (
          <EditProfile
            username={userData.username}
            address={userData.address || ""}
            phoneNumber={userData.phoneNumber || ""}
            profilePicture={userData.profilePicture || ""}
            onClose={handleCloseEditProfile}
            refetchUserData={fetchUserData} // ✅ Truyền lại fetch khi cập nhật
          />
        )}
      </div>

      {/* ✅ Thêm Footer */}
      
    </>
  );
};

export default Profile;