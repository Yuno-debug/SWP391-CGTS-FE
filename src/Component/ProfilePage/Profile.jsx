import React, { useState, useEffect, useContext } from 'react';
import './Profile.css';
import EditProfile from './EditProfile';
import { AuthContext } from '../LoginPage/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

const Profile = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const { userName } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/UserAccount/get-all`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true);
  };

  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-cover">
        <div className="cover-gradient"></div>
      </div>
      <div className="profile-header">
        <img 
          src="https://via.placeholder.com/100" 
          alt="Profile" 
          className="profile-photo" 
        />
        <div className="user-info">
          <h2 className="username">{userData.username}</h2>
        </div>
        <button className="edit-profile" onClick={handleEditProfileClick}>✎ Edit Profile</button>
      </div>
      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <p><strong>Name:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Location:</strong> {userData.location || "Unknown"}</p>
        </div>
      </div>
      {isEditProfileOpen && (
        <EditProfile
          username={userData.username}
          email={userData.email}
          location={userData.location || "Unknown"}
          onClose={handleCloseEditProfile}
        />
      )}
    </div>
  );
};

export default Profile;
