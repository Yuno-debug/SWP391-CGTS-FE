import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faStethoscope, faEdit, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    hospital: '',
    specialization: ''
  });

  useEffect(() => {
    fetchDoctorData();
  }, [doctorId]);

  const fetchDoctorData = async () => {
    if (!doctorId) {
      setError("ID bác sĩ không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/Doctor/${doctorId}`);
      
      if (response.data) {
        setDoctor(response.data);
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || '',
          hospital: response.data.hospital || '',
          specialization: response.data.specialization || ''
        });
      } else {
        setError("Không tìm thấy thông tin bác sĩ");
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Đã xảy ra lỗi khi tải thông tin bác sĩ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await axios.put(`${API_URL}/api/Doctor/${doctorId}`, formData);
      
      // Refresh data after update
      await fetchDoctorData();
      setIsEditMode(false);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      setError("Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="doctor-profile-container loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin bác sĩ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-profile-container error">
        <div className="error-message">
          <h3>Lỗi</h3>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="btn-back">
            <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={doctor?.hospital || "https://via.placeholder.com/150"} 
            alt={doctor?.name || "Bác sĩ"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
        </div>
        <div className="profile-title">
          <h1>{doctor?.name || "Bác sĩ"}</h1>
          <p className="specialty">{doctor?.specialization || "Chưa xác định chuyên khoa"}</p>
        </div>
        <div className="profile-actions">
          {!isEditMode ? (
            <button 
              className="btn-edit"
              onClick={() => setIsEditMode(true)}
            >
              <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
            </button>
          ) : (
            <button 
              className="btn-cancel"
              onClick={() => {
                setIsEditMode(false);
                // Reset form data to original values
                if (doctor) {
                  setFormData({
                    name: doctor.name || '',
                    email: doctor.email || '',
                    phoneNumber: doctor.phoneNumber || '',
                    hospital: doctor.hospital || '',
                    specialization: doctor.specialization || ''
                  });
                }
              }}
            >
              Hủy
            </button>
          )}
        </div>
      </div>

      {!isEditMode ? (
        <div className="profile-details">
          <div className="detail-item">
            <FontAwesomeIcon icon={faUser} className="detail-icon" />
            <div className="detail-content">
              <h3>Họ tên</h3>
              <p>{doctor?.name || "Chưa cập nhật"}</p>
            </div>
          </div>
          
          <div className="detail-item">
            <FontAwesomeIcon icon={faEnvelope} className="detail-icon" />
            <div className="detail-content">
              <h3>Email</h3>
              <p>{doctor?.email || "Chưa cập nhật"}</p>
            </div>
          </div>
          
          <div className="detail-item">
            <FontAwesomeIcon icon={faPhone} className="detail-icon" />
            <div className="detail-content">
              <h3>Số điện thoại</h3>
              <p>{doctor?.phoneNumber || "Chưa cập nhật"}</p>
            </div>
          </div>
          
          <div className="detail-item">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="detail-icon" />
            <div className="detail-content">
              <h3>Bệnh viện/Phòng khám</h3>
              <p>{doctor?.hospital || "Chưa cập nhật"}</p>
            </div>
          </div>
          
          <div className="detail-item">
            <FontAwesomeIcon icon={faStethoscope} className="detail-icon" />
            <div className="detail-content">
              <h3>Chuyên khoa</h3>
              <p>{doctor?.specialization || "Chưa cập nhật"}</p>
            </div>
          </div>
        </div>
      ) : (
        <form className="profile-edit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Họ tên</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập họ tên"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Số điện thoại</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="hospital">Bệnh viện/Phòng khám</label>
            <input
              type="text"
              id="hospital"
              name="hospital"
              value={formData.hospital}
              onChange={handleInputChange}
              placeholder="Nhập tên bệnh viện hoặc phòng khám"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="specialization">Chuyên khoa</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              placeholder="Nhập chuyên khoa"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-save">Lưu thay đổi</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DoctorProfile;