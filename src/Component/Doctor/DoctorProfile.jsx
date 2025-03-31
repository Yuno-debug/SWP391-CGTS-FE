import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faStethoscope,
  faEdit,
  faArrowLeft,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import "./DoctorProfile.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    phoneNumber: "",
    degree: "",
    hospital: "", // URL avatar
    licenseNumber: "",
    biography: "",
  });

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      console.log("UserID from localStorage:", userId);

      if (!userId) {
        setError("User information not found. Please log in again.");
        navigate("/login");
        return;
      }

      const parsedUserId = Number(userId);
      const response = await axios.get(`${API_URL}/api/Doctor`);
      const doctors = response.data.$values;

      const matchedDoctor = doctors.find((d) => Number(d.userId) === parsedUserId);

      if (matchedDoctor) {
        setDoctor(matchedDoctor);
        setFormData({
          name: matchedDoctor.name || "",
          specialization: matchedDoctor.specialization || "",
          phoneNumber: matchedDoctor.phoneNumber || "",
          degree: matchedDoctor.degree || "",
          hospital: matchedDoctor.hospital || "", // URL avatar
          licenseNumber: matchedDoctor.licenseNumber || "",
          biography: matchedDoctor.biography || "",
        });
      } else {
        setError("Doctor information not found.");
      }
    } catch (err) {
      console.error("Error fetching doctor data:", err);
      setError("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        specialization: formData.specialization,
        phoneNumber: formData.phoneNumber,
        degree: formData.degree,
        hospital: formData.hospital, // URL avatar
        licenseNumber: formData.licenseNumber,
        biography: formData.biography,
      };
      console.log("Data being sent:", payload); // Log to check

      const response = await axios.put(`${API_URL}/api/Doctor/${doctor.doctorId}`, payload);
      console.log("Update successful:", response.data);
      await fetchDoctorData(); // Refresh data
      setIsEditMode(false);
    } catch (err) {
      console.error("Error updating doctor information:", err);
      const errorMessage = err.response?.data?.message || "An error occurred while updating information. Please try again later.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">Loading doctor information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="profile-header">
          <img
            src={doctor?.hospital || "https://via.placeholder.com/150"}
            alt="Doctor Avatar"
            className="avatar"
          />
          <h1 className="profile-title">
            <FontAwesomeIcon icon={faUser} /> {doctor?.name}
          </h1>
        </div>

        <div className="profile-details">
          <p className="detail-item">
            <FontAwesomeIcon icon={faEnvelope} /> <span>Email:</span> {doctor?.email}
          </p>
          <p className="detail-item">
            <FontAwesomeIcon icon={faPhone} /> <span>Phone:</span> {doctor?.phoneNumber}
          </p>
          <p className="detail-item">
            <FontAwesomeIcon icon={faStethoscope} /> <span>Specialization:</span> {doctor?.specialization}
          </p>
          <p className="detail-item">
            <FontAwesomeIcon icon={faUser} /> <span>Degree:</span> {doctor?.degree}
          </p>
          <p className="detail-item">
            <FontAwesomeIcon icon={faUser} /> <span>License Number:</span> {doctor?.licenseNumber}
          </p>
          <p className="detail-item">
            <FontAwesomeIcon icon={faUser} /> <span>Biography:</span> {doctor?.biography}
          </p>
        </div>

        {isEditMode ? (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter specialization"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter degree"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Avatar URL</label>
              <input
                type="text"
                name="hospital"
                value={formData.hospital}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter avatar URL"
              />
            </div>
            <div className="form-group">
              <label className="form-label">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter license number"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Biography</label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter biography"
                rows="4"
              />
            </div>
            <button type="submit" className="save-button">
              <FontAwesomeIcon icon={faSave} /> Save
            </button>
          </form>
        ) : (
          <button onClick={() => setIsEditMode(true)} className="edit-button">
            <FontAwesomeIcon icon={faEdit} /> Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;