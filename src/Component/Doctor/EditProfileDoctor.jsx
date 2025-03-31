import React, { useState, useEffect } from 'react';
import './EditProfileDoctor.css'; 

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

const EditDoctorProfile = ({
  name,
  hospital,
  specialty,
  phoneNumber,
  profilePicture,
  onClose,
  refetchDoctorData,
}) => {
  const [userId, setUserId] = useState(null);
  const [newName, setNewName] = useState(name || '');
  const [newHospital, setNewHospital] = useState(hospital || '');
  const [newSpecialty, setNewSpecialty] = useState(specialty || '');
  const [newPhone, setNewPhone] = useState(phoneNumber || '');
  const [newProfilePicture, setNewProfilePicture] = useState(profilePicture || '');
  const [errorMessage, setErrorMessage] = useState('');

  // Base URL ảnh nếu chỉ lưu tên file (cập nhật theo server của bạn)
  const imageBaseUrl = 'https://yourserver.com/images/'; // 🔑 Thay đổi theo thực tế

  // Fetch dữ liệu bác sĩ khi component load
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    console.log('Doctor ID:', storedUserId);

    if (!storedUserId) {
      setErrorMessage('Doctor ID not found in localStorage');
      return;
    }

    setUserId(storedUserId);

    fetch(`${API_URL}/api/Doctor/${storedUserId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch doctor data');
        return response.json();
      })
      .then((res) => {
        console.log('Fetched doctor data:', res);
        if (res.success && res.data) {
          const data = res.data;
          setNewName(data.name || '');
          setNewHospital(data.hospital || '');
          setNewSpecialty(data.specialty || '');
          setNewPhone(data.phoneNumber || '');
          setNewProfilePicture(data.profilePicture || '');
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Failed to fetch doctor data');
      });
  }, []);

  // Xử lý lưu thông tin bác sĩ
  const handleSave = async () => {
    setErrorMessage('');

    if (!userId) {
      setErrorMessage('Doctor ID not found in localStorage');
      return;
    }

    const jsonData = {
      id: parseInt(userId), // Nếu backend yêu cầu id
      name: newName,
      hospital: newHospital,
      specialty: newSpecialty,
      phoneNumber: newPhone,
      profilePicture: newProfilePicture || null,
    };

    console.log("Dữ liệu gửi lên:", jsonData);

    try {
      const response = await fetch(`${API_URL}/api/Doctor/update/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) throw new Error('Failed to update doctor profile');

      const result = await response.json();
      console.log("API trả về:", result);

      alert('Cập nhật hồ sơ bác sĩ thành công!');
      onClose(); // Đóng form chỉnh sửa

      // Gọi lại refetchDoctorData để cập nhật dữ liệu trong DoctorProfile
      if (typeof refetchDoctorData === 'function') {
        refetchDoctorData();
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="edit-doctor-profile-overlay">
      <div className="edit-doctor-profile-content">
        <h2>Edit Doctor Profile</h2>

        <label>
          Name:
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nhập tên bác sĩ"
          />
        </label>

        <label>
          Hospital/Clinic:
          <input
            type="text"
            value={newHospital}
            onChange={(e) => setNewHospital(e.target.value)}
            placeholder="Nhập bệnh viện/phòng khám"
          />
        </label>

        <label>
          Specialty:
          <input
            type="text"
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            placeholder="Nhập chuyên khoa"
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
          Profile Picture URL or File Name:
          <input
            type="text"
            value={newProfilePicture}
            onChange={(e) => setNewProfilePicture(e.target.value)}
            placeholder="URL hoặc tên file ảnh"
          />
        </label>

        {/* Hiển thị preview ảnh */}
        {newProfilePicture && (
          <div className="image-preview">
            <p>Preview:</p>
            <img
              src={newProfilePicture.startsWith('http') ? newProfilePicture : `${imageBaseUrl}${newProfilePicture}`}
              alt="Doctor Profile Preview"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #ccc',
                marginTop: '8px',
              }}
            />
          </div>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="edit-doctor-profile-buttons">
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditDoctorProfile;