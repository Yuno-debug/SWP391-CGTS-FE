import React, { useState, useEffect, useContext } from 'react';
import './Profile.css';
import EditProfile from './EditProfile';
import { AuthContext } from '../LoginPage/AuthContext';
import axios from 'axios';
import Header from '../../Component/HomePage/NavBar/NavBar';
import Footer from '../../Component/HomePage/Footer/Footer';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

const Profile = ({ isLoggedIn }) => {
  const { userId } = useContext(AuthContext);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    if (!userId) {
      console.error("User ID is missing from AuthContext");
      return;
    }
    try {
      const token = localStorage.getItem("token");
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

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true);
  };

  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  const handleProfileUpdate = (updatedData) => {
    setUserData(updatedData);
  };

  if (!userData) {
    return <div className="profile-loading-message">Không tìm thấy dữ liệu người dùng!</div>;
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <div className="profile-page-wrapper">
        <div className="profile-cover-section">
          <div className="profile-cover-gradient"></div>
        </div>
        <div className="profile-header-section">
          <img
            src={userData.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-user-avatar"
          />
          <div className="profile-user-details">
            <h2 className="profile-user-name">{userData.username}</h2>
          </div>
          <button className="profile-btn-edit" onClick={handleEditProfileClick}>
            ✎ Edit Profile
          </button>
        </div>

        <div className="profile-main-content">
          <div className="profile-info-section">
            <h2>Profile</h2>
            <div className="profile-details">
              <p>
                <FaUser className="profile-details-icon" />
                <strong>Username:</strong> {userData.username}
              </p>
              <p>
                <FaEnvelope className="profile-details-icon" />
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <FaPhone className="profile-details-icon" />
                <strong>Phone Number:</strong> {userData.phoneNumber || "Không có"}
              </p>
              <p>
                <FaMapMarkerAlt className="profile-details-icon" />
                <strong>Address:</strong> {userData.address || "Không xác định"}
              </p>
              <p>
                <FaCalendarAlt className="profile-details-icon" />
                <strong>Create:</strong> {new Date(userData.registrationDate).toLocaleDateString()}
              </p>
              <p>
                <FaClock className="profile-details-icon" />
                <strong>Last Login:</strong> {new Date(userData.lastLogin).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {isEditProfileOpen && (
          <EditProfile
            username={userData.username}
            address={userData.address || ""}
            phoneNumber={userData.phoneNumber || ""}
            profilePicture={userData.profilePicture || ""}
            onClose={handleCloseEditProfile}
            refetchUserData={fetchUserData}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;