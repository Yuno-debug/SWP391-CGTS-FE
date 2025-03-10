import React, { useState, useEffect } from "react";
import axios from "axios";
import './Doctor.css';

const DoctorTable = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5200/api/Doctor', {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiT251eSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFjdGl2ZSIsImV4cCI6MTc0MTA3NDcxMywiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTIwMCIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUyMDAifQ.yVt-rG_xw25x9akaikY2DZCJg_OapQ7FwXlJTsnA6c`,
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

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData(doctor);
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({
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
    setIsAddModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    if (!selectedDoctor) return;

    try {
      await axios.put(`http://localhost:5200/api/Doctor/${selectedDoctor.doctorId}`, formData, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiT251eSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFjdGl2ZSIsImV4cCI6MTc0MTA3NDcxMywiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTIwMCIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUyMDAifQ.yVt-rG_xw25x9akaikY2DZCJg_OapQ7FwXlJTsnA6c`,
          'Content-Type': 'application/json'
        }
      });

      alert("Doctor updated successfully!");
      setIsEditModalOpen(false);
      fetchDoctors();
    } catch (error) {
      alert("Failed to update doctor.");
    }
  };

  const handleAddSubmit = async () => {
    try {
      await axios.post(`http://localhost:5200/api/UserAccount/create-doctor`, formData, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiT251eSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFjdGl2ZSIsImV4cCI6MTc0MTA3NDcxMywiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTIwMCIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUyMDAifQ.yVt-rG_xw25x9akaikY2DZCJg_OapQ7FwXlJTsnA6c`,
          'Content-Type': 'application/json'
        }
      });

      alert("Doctor added successfully!");
      setIsAddModalOpen(false);
      fetchDoctors();
    } catch (error) {
      alert("Failed to add doctor.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await axios.delete(`/api/Doctor/${id}`, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiT251eSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFjdGl2ZSIsImV4cCI6MTc0MTA3NDcxMywiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTIwMCIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUyMDAifQ.yVt-rG_xw25x9akaikY2DZCJg_OapQ7FwXlJTsnA6c`
        }
      });

      alert("Doctor deleted successfully!");
      setDoctors(doctors.filter(doctor => doctor.doctorId !== id));
    } catch (error) {
      alert("Failed to delete doctor.");
    }
  };

  return (
    <div className="doctor-table-container">
      <h2>Doctors</h2>
      <button className="Add-btn" onClick={openAddModal}>Add More Doctor</button>
      {error && <p className="error-message">{error}</p>}
      {loading ? <p>Loading...</p> : (
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
              <tr key={doctor.doctorId}>
                <td>{doctor.name}</td>
                <td>{doctor.email}</td>
                <td>{doctor.phoneNumber}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.degree}</td>
                <td>{doctor.hospital}</td>
                <td>{doctor.licenseNumber}</td>
                <td>{doctor.biography}</td>
                <td>
                  <button className="Edit-btn" onClick={() => openEditModal(doctor)}>Edit</button>
                  <button className="Delete-btn" onClick={() => handleDelete(doctor.doctorId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Doctor</h2>
            <label>Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} />

            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />

            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />

            <label>Phone Number:</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />

            <label>Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />

            <label>Full Name:</label>
            <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} />

            <label>Specialization:</label>
            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} />

            <label>Degree:</label>
            <input type="text" name="degree" value={formData.degree} onChange={handleChange} />

            <label>Hospital:</label>
            <input type="text" name="hospital" value={formData.hospital} onChange={handleChange} />

            <label>License Number:</label>
            <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} />

            <label>Biography:</label>
            <textarea name="biography" value={formData.biography} onChange={handleChange} />

            <button onClick={handleAddSubmit}>Add</button>
            <button onClick={() => setIsAddModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorTable;
