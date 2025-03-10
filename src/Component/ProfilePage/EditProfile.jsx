import React, { useState, useEffect } from 'react';

const EditProfile = ({ username, onClose }) => {
  const [newUsername, setNewUsername] = useState(username);
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageName, setProfileImageName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setErrorMessage('User ID not found in localStorage');
      return;
    }

    // Gọi API để lấy thông tin user
    fetch(`/api/UserAccount/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setNewAddress(data.address || '');
        setNewPhone(data.phoneNumber || '');
      })
      .catch((error) => {
        setErrorMessage('Failed to fetch user data');
      });
  }, []);

  const handleSave = async () => {
    setErrorMessage('');
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setErrorMessage('User ID not found in localStorage');
      return;
    }

    const formData = new FormData();
    formData.append('username', newUsername);
    formData.append('phoneNumber', newPhone);
    formData.append('address', newAddress);
    if (profileImage) {
      formData.append('profilePicture', profileImage);
    }

    try {
      const response = await fetch(`/api/UserAccount/update/${userId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update profile');

      alert('Profile updated successfully!');
      onClose();
    } catch (error) {
      setErrorMessage(error.message);
    }
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
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setProfileImage(file);
                setProfileImageName(file.name);
              }
            }}
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