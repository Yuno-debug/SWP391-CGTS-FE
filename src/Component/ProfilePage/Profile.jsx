import React, { useState } from 'react';
import './Profile.css';
import EditProfile from './EditProfile';

const Profile = ({ username }) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

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
          <h2 className="username">{username}</h2>
        </div>
        <button className="edit-profile" onClick={handleEditProfileClick}>✎ Edit Profile</button>
      </div>
      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <p><strong>Name:</strong> {username}</p>
          <p><strong>Email:</strong> user1@example.com</p>
          <p><strong>Location:</strong> Unknown</p>
        </div>
      </div>
      {isEditProfileOpen && (
        <EditProfile
          username={username}
          email="user1@example.com"
          location="Unknown"
          onClose={handleCloseEditProfile}
        />
      )}
    </div>
  );
};

export default Profile;
