import React, { useState, useEffect } from "react";
import axios from "axios";
import './Doctor.css';

const DoctorTable = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Trạng thái modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // New state for details modal
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Store selected doctor for details

  // Dữ liệu form thêm bác sĩ
  const [addFormData, setAddFormData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    address: "",
    fullname: "",
    specialization: "",
    degree: "",
    hospital: "",
    licenseNumber: "",
    biography: ""
  });

  // Dữ liệu form chỉnh sửa bác sĩ
  const [editFormData, setEditFormData] = useState({
    name: "",
    specialization: "",
    phoneNumber: "",
    email: "",
    degree: "",
    hospital: "",
    licenseNumber: "",
    biography: ""
  });

  const [editingDoctorId, setEditingDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5200/api/Doctor', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`
        }
      });

      if (response.data?.$values && Array.isArray(response.data.$values)) {
        setDoctors(response.data.$values);
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      setError('Error fetching doctors data');
    } finally {
      setLoading(false);
    }
  };

  // Validation dữ liệu email và số điện thoại
  const validateForm = (formData) => {
    if (!formData.email || !formData.phoneNumber) {
      alert("Email và số điện thoại không được để trống.");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      alert("Email không hợp lệ.");
      return false;
    }

    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      alert("Số điện thoại không hợp lệ.");
      return false;
    }

    return true;
  };

  // Xử lý thêm bác sĩ
  const handleAddSubmit = async () => {
    if (!validateForm(addFormData)) return;

    try {
      const response = await axios.post(`http://localhost:5200/api/UserAccount/create-doctor`, addFormData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
          'Content-Type': 'application/json'
        }
      });

      alert("Bác sĩ đã được thêm thành công!");
      setIsAddModalOpen(false);
      fetchDoctors();
    } catch (error) {
      alert(`Lỗi: ${error.response?.data?.message || "Không thể thêm bác sĩ"}`);
    }
  };

  // Xử lý mở modal chỉnh sửa
  const handleEdit = (doctor) => {
    console.log("Editing Doctor:", doctor);
    setEditingDoctorId(doctor.doctorId || doctor.id);
    setEditFormData({
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      phoneNumber: doctor.phoneNumber?.trim() || "",
      email: doctor.email?.trim() || "",
      degree: doctor.degree || "",
      hospital: doctor.hospital || "",
      licenseNumber: doctor.licenseNumber || "",
      biography: doctor.biography || ""
    });
    setIsEditModalOpen(true);
  };

  // Xử lý mở modal chi tiết
  const handleShowDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailsModalOpen(true);
  };

  // Xử lý cập nhật thông tin bác sĩ
  const handleEditSubmit = async () => {
    if (!editingDoctorId) {
      alert("Lỗi: Không tìm thấy ID bác sĩ!");
      return;
    }

    const emailTrimmed = editFormData.email.trim();
    const phoneNumberTrimmed = editFormData.phoneNumber.trim();

    if (!emailTrimmed || !phoneNumberTrimmed) {
      alert("Email và số điện thoại không được để trống!");
      return;
    }

    try {
      await axios.put(`http://localhost:5200/api/Doctor/${editingDoctorId}`, 
        { ...editFormData, email: emailTrimmed, phoneNumber: phoneNumberTrimmed },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert("Cập nhật thông tin bác sĩ thành công!");
      setIsEditModalOpen(false);
      fetchDoctors();
    } catch (error) {
      alert(`Lỗi: ${error.response?.data?.message || "Không thể cập nhật bác sĩ"}`);
    }
  };

  // Xử lý xóa bác sĩ
  const handleDelete = async (doctorId) => {
    if (!doctorId) {
      console.error("doctorId is undefined! Cannot delete.");
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to delete this doctor?");
    if (!isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:5200/api/Doctor/${doctorId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`
        }
      });

      if (!response.ok) {
        throw new Error(`Delete failed with status: ${response.status}`);
      }

      alert("Doctor deleted successfully!");
      fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  return (
    <div className="doctor-table-container">
      <h2>Doctors</h2>
      <button className="Add-btn" onClick={() => setIsAddModalOpen(true)}>Add More Doctor</button>
      
      {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Doctor</h2>
            <div className="form-grid">
              {/* ... Existing add form fields ... */}
              <div className="input-wrapper">
                <label>Username:</label>
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={addFormData.username} 
                  onChange={(e) => setAddFormData({ ...addFormData, username: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>Password:</label>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={addFormData.password} 
                  onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>Email:</label>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={addFormData.email} 
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>Phone Number:</label>
                <input 
                  type="text" 
                  placeholder="Phone Number" 
                  value={addFormData.phoneNumber} 
                  onChange={(e) => setAddFormData({ ...addFormData, phoneNumber: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>Address:</label>
                <input 
                  type="text" 
                  placeholder="Address" 
                  value={addFormData.address} 
                  onChange={(e) => setAddFormData({ ...addFormData, address: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>Full Name:</label>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={addFormData.fullname} 
                  onChange={(e) => setAddFormData({ ...addFormData, fullname: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>Specialization:</label>
                <input 
                  type="text" 
                  placeholder="Specialization" 
                  value={addFormData.specialization} 
                  onChange={(e) => setAddFormData({ ...addFormData, specialization: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>Degree:</label>
                <input 
                  type="text" 
                  placeholder="Degree" 
                  value={addFormData.degree} 
                  onChange={(e) => setAddFormData({ ...addFormData, degree: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>Hospital:</label>
                <input 
                  type="text" 
                  placeholder="Hospital" 
                  value={addFormData.hospital} 
                  onChange={(e) => setAddFormData({ ...addFormData, hospital: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>License Number:</label>
                <input 
                  type="text" 
                  placeholder="License Number" 
                  value={addFormData.licenseNumber} 
                  onChange={(e) => setAddFormData({ ...addFormData, licenseNumber: e.target.value })} 
                />
              </div>
              <div className="input-wrapper full-width">
                <label>Biography:</label>
                <textarea 
                  placeholder="Biography" 
                  value={addFormData.biography} 
                  onChange={(e) => setAddFormData({ ...addFormData, biography: e.target.value })} 
                />
              </div>
            </div>
            <button className="Update-modal" onClick={handleAddSubmit}>Add</button>
            <button onClick={() => setIsAddModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
      {loading ? <p>Loading...</p> : (
        <div className="table-wrapper">
          <table className="doctor-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Specialization</th>
                <th>Degree</th>
                <th>Hospital</th>
                <th>License Number</th>
                <th>Biography</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doctor => (
                <tr 
                  key={doctor.id} 
                  onClick={() => handleShowDetails(doctor)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{doctor.name}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.phoneNumber}</td>
                  <td className="truncate" title={doctor.specialization}>
                    {doctor.specialization}
                  </td>
                  <td>{doctor.degree}</td>
                  <td className="truncate" title={doctor.hospital}>
                    {doctor.hospital}
                  </td>
                  <td>{doctor.licenseNumber}</td>
                  <td className="truncate" title={doctor.biography}>
                    {doctor.biography}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}> {/* Prevent row click when clicking buttons */}
                    <button className="edit-btn" onClick={() => handleEdit(doctor)}>Edit</button>
                    <button className="del-btn" onClick={() => handleDelete(doctor.doctorId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            {/* ... Existing edit modal content ... */}
            <h2>Edit Doctor</h2>
            <div className="form-grid">
              <div className="input-wrapper">
                <label>Name:</label>
                <input 
                  type="text" 
                  name="name" 
                  value={editFormData.name} 
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>Email:</label>
                <input 
                  type="email" 
                  name="email" 
                  value={editFormData.email} 
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>Specialization:</label>
                <input 
                  type="text" 
                  name="specialization" 
                  value={editFormData.specialization} 
                  onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>Phone Number:</label>
                <input 
                  type="text" 
                  name="phoneNumber" 
                  value={editFormData.phoneNumber} 
                  onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>Degree:</label>
                <input 
                  type="text" 
                  name="degree" 
                  value={editFormData.degree} 
                  onChange={(e) => setEditFormData({ ...editFormData, degree: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>Hospital:</label>
                <input 
                  type="text" 
                  name="hospital" 
                  value={editFormData.hospital} 
                  onChange={(e) => setEditFormData({ ...editFormData, hospital: e.target.value })} 
                />
              </div>
              <div className="input-wrapper">
                <label>License Number:</label>
                <input 
                  type="text" 
                  name="licenseNumber" 
                  value={editFormData.licenseNumber} 
                  onChange={(e) => setEditFormData({ ...editFormData, licenseNumber: e.target.value })} 
                />
              </div>
              <div className="input-wrapper full-width">
                <label>Biography:</label>
                <textarea 
                  name="biography" 
                  value={editFormData.biography} 
                  onChange={(e) => setEditFormData({ ...editFormData, biography: e.target.value })} 
                />
              </div>
            </div>
            <button className="Update-modal" onClick={() => handleEditSubmit(editingDoctorId)}>Save</button>
            <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Details Doctor Modal */}
      {isDetailsModalOpen && selectedDoctor && (
        <div className="modal">
          <div className="modal-content">
            <h2>Doctor Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <strong>Full Name:</strong> {selectedDoctor.name}
              </div>
              <div className="detail-item">
                <strong>Email:</strong> {selectedDoctor.email}
              </div>
              <div className="detail-item">
                <strong>Phone Number:</strong> {selectedDoctor.phoneNumber}
              </div>
              <div className="detail-item">
                <strong>Specialization:</strong> {selectedDoctor.specialization}
              </div>
              <div className="detail-item">
                <strong>Degree:</strong> {selectedDoctor.degree}
              </div>
              <div className="detail-item">
                <strong>Hospital:</strong> {selectedDoctor.hospital}
              </div>
              <div className="detail-item">
                <strong>License Number:</strong> {selectedDoctor.licenseNumber}
              </div>
              <div className="detail-item full-width">
                <strong>Biography:</strong> {selectedDoctor.biography}
              </div>
            </div>
            <button onClick={() => setIsDetailsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorTable;