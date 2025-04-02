import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import "./Doctor.css";

const DoctorTable = () => {
  // State management
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State cho từ khóa tìm kiếm

  // Form states
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

  // Fetch doctors data
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5200/api/Doctor", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });

      if (response.data?.$values && Array.isArray(response.data.$values)) {
        setDoctors(response.data.$values);
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      setError("Error fetching doctors data");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = (formData) => {
    if (!formData.email || !formData.phoneNumber) {
      alert("Email and phone number are required");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      alert("Please enter a valid phone number (8-15 digits)");
      return false;
    }

    return true;
  };

  // Add doctor handler
  const handleAddSubmit = async () => {
    if (!validateForm(addFormData)) return;

    try {
      await axios.post(
        "http://localhost:5200/api/UserAccount/create-doctor",
        addFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("Doctor added successfully!");
      setIsAddModalOpen(false);
      setAddFormData({
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
      fetchDoctors();
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || "Failed to add doctor"}`);
    }
  };

  // Edit doctor handler
  const handleEdit = (doctor) => {
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

  const handleEditSubmit = async () => {
    if (!editingDoctorId) {
      alert("Error: Doctor ID not found!");
      return;
    }

    const emailTrimmed = editFormData.email.trim();
    const phoneNumberTrimmed = editFormData.phoneNumber.trim();

    if (!emailTrimmed || !phoneNumberTrimmed) {
      alert("Email and phone number are required!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5200/api/Doctor/${editingDoctorId}`,
        { ...editFormData, email: emailTrimmed, phoneNumber: phoneNumberTrimmed },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("Doctor updated successfully!");
      setIsEditModalOpen(false);
      fetchDoctors();
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || "Failed to update doctor"}`);
    }
  };

  // Delete doctor handler
  const handleDelete = async (doctorId) => {
    if (!doctorId) {
      console.error("doctorId is undefined");
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to delete this doctor?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5200/api/Doctor/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });

      alert("Doctor deleted successfully!");
      fetchDoctors();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete doctor");
    }
  };

  // Xử lý thay đổi từ khóa tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Lọc danh sách bác sĩ dựa trên từ khóa tìm kiếm
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modal components using Portal
  const AddDoctorModal = () => {
    return createPortal(
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title"> Add New Doctor</h2>
            <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>
              ×
            </button>
          </div>
          
          <div className="form-grid">
            <div className="input-wrapper">
              <label>Username</label>
              <input
                type="text"
                value={addFormData.username}
                onChange={(e) => setAddFormData({ ...addFormData, username: e.target.value })}
                required
              />
            </div>
            
            <div className="input-wrapper">
              <label>Password</label>
              <input
                type="password"
                value={addFormData.password}
                onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                required
              />
            </div>
            
            <div className="input-wrapper">
              <label>Email</label>
              <input
                type="email"
                value={addFormData.email}
                onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="input-wrapper">
              <label>Phone Number</label>
              <input
                type="text"
                value={addFormData.phoneNumber}
                onChange={(e) => setAddFormData({ ...addFormData, phoneNumber: e.target.value })}
                required
              />
            </div>
            
            <div className="input-wrapper">
              <label>Full Name</label>
              <input
                type="text"
                value={addFormData.fullname}
                onChange={(e) => setAddFormData({ ...addFormData, fullname: e.target.value })}
                required
              />
            </div>
            
            <div className="input-wrapper">
              <label>Address</label>
              <input
                type="text"
                value={addFormData.address}
                onChange={(e) => setAddFormData({ ...addFormData, address: e.target.value })}
              />
            </div>
            
            <div className="input-wrapper">
              <label>Specialization</label>
              <input
                type="text"
                value={addFormData.specialization}
                onChange={(e) => setAddFormData({ ...addFormData, specialization: e.target.value })}
              />
            </div>
            
            <div className="input-wrapper">
              <label>Degree</label>
              <input
                type="text"
                value={addFormData.degree}
                onChange={(e) => setAddFormData({ ...addFormData, degree: e.target.value })}
              />
            </div>
            
            <div className="input-wrapper">
              <label>Avatar URL</label>
              <input
                type="text"
                value={addFormData.hospital}
                onChange={(e) => setAddFormData({ ...addFormData, hospital: e.target.value })}
              />
            </div>
            
            <div className="input-wrapper">
              <label>License Number</label>
              <input
                type="text"
                value={addFormData.licenseNumber}
                onChange={(e) => setAddFormData({ ...addFormData, licenseNumber: e.target.value })}
              />
            </div>
            
            <div className="input-wrapper full-width">
              <label>Biography</label>
              <textarea
                value={addFormData.biography}
                onChange={(e) => setAddFormData({ ...addFormData, biography: e.target.value })}
              />
            </div>
          </div>
          
          <div className="form-buttons">
            <button className="submit-btn" onClick={handleAddSubmit}>
              Add Doctor
            </button>
            <button className="cancel-btn" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const EditDoctorModal = () => {
    return createPortal(
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Edit Doctor</h2>
            <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
              ×
            </button>
          </div>
          
          <div className="form-grid">
            <div className="input-wrapper">
              <label>Full Name</label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="input-wrapper">
              <label>Email</label>
              <input
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="input-wrapper">
              <label>Phone Number</label>
              <input
                type="text"
                value={editFormData.phoneNumber}
                onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                required
              />
            </div>
            
            <div className="input-wrapper">
              <label>Specialization</label>
              <input
                type="text"
                value={editFormData.specialization}
                onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })}
              />
            </div>
            
            <div className="input-wrapper">
              <label>Degree</label>
              <input
                type="text"
                value={editFormData.degree}
                onChange={(e) => setEditFormData({ ...editFormData, degree: e.target.value })}
              />
            </div>
            
            <div className="input-wrapper">
              <label>Avatar URL</label>
              <input
                type="text"
                value={editFormData.hospital}
                onChange={(e) => setEditFormData({ ...editFormData, hospital: e.target.value })}
              />
            </div>
            
            <div className="input-wrapper">
              <label>License Number</label>
              <input
                type="text"
                value={editFormData.licenseNumber}
                onChange={(e) => setEditFormData({ ...editFormData, licenseNumber: e.target.value })}
              />
            </div>
            
            <div className="input-wrapper full-width">
              <label>Biography</label>
              <textarea
                value={editFormData.biography}
                onChange={(e) => setEditFormData({ ...editFormData, biography: e.target.value })}
              />
            </div>
          </div>
          
          <div className="form-buttons">
            <button className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button className="submit-btn" onClick={handleEditSubmit}>
              Save Changes
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="doctor-table-container">
      <div className="doctor-header">
        <h2>Doctors Management</h2>
      </div>

      <div className="action-bar">
        <button className="Add-btn" onClick={() => setIsAddModalOpen(true)}>
          <span>+</span> Add New Doctor
        </button>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <div className="loading">Loading doctors data...</div>
      ) : (
        <div className="table-wrapper">
          <table className="doctor-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Image</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Specialization</th>
                <th>Degree</th>
                <th>License</th>
                <th>Biography</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor, index) => (
                <tr key={doctor.id}>
                  <td>{index + 1}</td>
                  <td>
                  <img
                    src={doctor.hospital}
                    alt={doctor.name}
                    className="doctor-table-image"
                  />
                  </td>
                  <td>{doctor.name}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.phoneNumber}</td>
                  <td className="truncate" title={doctor.specialization}>
                    {doctor.specialization}
                  </td>
                  <td>{doctor.degree}</td>
                  <td>{doctor.licenseNumber}</td>
                  <td className="truncate" title={doctor.biography}>
                    {doctor.biography}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(doctor)}
                      >
                        Edit
                      </button>
                      <button
                        className="del-btn"
                        onClick={() => handleDelete(doctor.doctorId)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isAddModalOpen && <AddDoctorModal />}
      {isEditModalOpen && <EditDoctorModal />}
    </div>
  );
};

export default DoctorTable;