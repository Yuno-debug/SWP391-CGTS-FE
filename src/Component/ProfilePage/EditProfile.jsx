import React, { useState } from 'react';
import './EditProfile.css';

const EditProfile = ({ username, email, address, phone, onClose }) => {
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [newAddress, setNewAddress] = useState(address);
  const [newPhone, setNewPhone] = useState(phone);
  const [profileImageName, setProfileImageName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImageName(file.name);
    setErrorMessage('');
  };

  const handleSave = () => {
    // Handle save logic here
    onClose();
  };

  return (
    <div className="edit-profile-modal">
      <div className="edit-profile-content">
        <h2>Edit Profile</h2>
        <label>
          Username:
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
        </label>
        <label>
          Profile Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {profileImageName && <p className="file-name">Selected file: {profileImageName}</p>}
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditProfile;