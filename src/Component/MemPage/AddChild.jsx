import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaExclamationCircle, FaPlus } from "react-icons/fa";
import "./AddChild.css";
import axios from "axios";
import Navbar from "../HomePage/NavBar/NavBar";
import Footer from "../HomePage/Footer/Footer";

const AddChild = ({ isLoggedIn }) => {
  const [userId, setUserId] = useState("");
  const [childData, setChildData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    birthWeight: "",
    birthHeight: "",
    bloodType: "",
    allergies: "",
    relationship: "",
    avatar: "",
  });
  const [consultationData, setConsultationData] = useState({
    childId: "",
    description: "",
    urgency: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [consultationSuccess, setConsultationSuccess] = useState("");
  const [consultationError, setConsultationError] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      alert("User ID not found! Please log in.");
      return;
    }
    setUserId(Number(storedUserId));
    fetchChildren(storedUserId);
  }, []);

  const fetchChildren = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5200/api/Child/by-user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setChildren(response.data?.data?.$values || []);
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  const handleChange = (e) => {
    setChildData({ ...childData, [e.target.name]: e.target.value });
  };

  const handleConsultationChange = (e) => {
    setConsultationData({ ...consultationData, [e.target.name]: e.target.value });
  };

  const handleGenderSelect = (gender) => {
    setChildData({ ...childData, gender });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!childData.name) tempErrors.name = "Name is required";
    if (!childData.dateOfBirth) tempErrors.dateOfBirth = "Date of Birth is required";
    if (!childData.gender) tempErrors.gender = "Gender is required";
    if (!childData.relationship) tempErrors.relationship = "Relationship is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateConsultationForm = () => {
    if (!consultationData.childId) {
      setConsultationError("Please select a child.");
      return false;
    }
    if (!consultationData.description.trim()) {
      setConsultationError("Please enter a description.");
      return false;
    }
    if (!consultationData.urgency) {
      setConsultationError("Please select an urgency level.");
      return false;
    }
    if (!consultationData.category) {
      setConsultationError("Please select a category.");
      return false;
    }
    setConsultationError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const requestData = {
      ...childData,
      userId: userId,
      birthWeight: Number(childData.birthWeight),
      birthHeight: Number(childData.birthHeight),
    };
    console.log("Request Data:", requestData);
    try {
      await axios.post("http://localhost:5200/api/Child/create", requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchChildren(userId);
      setChildData({ name: "", dateOfBirth: "", gender: "", birthWeight: "", birthHeight: "", bloodType: "", allergies: "", relationship: "", avatar: "" });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
  };

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    if (!validateConsultationForm()) return;

    const requestData = {
      userId: userId,
      childId: Number(consultationData.childId),
      description: consultationData.description,
      urgency: consultationData.urgency,
      category: consultationData.category,
    };

    try {
      const response = await axios.post("http://localhost:5200/api/ConsultationRequest/create", requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setConsultationSuccess("Consultation request submitted successfully!");
      setConsultationData({ childId: "", description: "", urgency: "", category: "" });
      setTimeout(() => setConsultationSuccess(""), 3000);
    } catch (error) {
      setConsultationError("Failed to submit consultation request. Please try again.");
      console.error("Error submitting consultation:", error.response?.data || error.message);
    }
  };

  const handleSelectChild = (child) => {
    // If the clicked child is already selected, toggle it off (close details)
    if (selectedChild?.childId === child.childId) {
      setSelectedChild(null);
    } else {
      // Otherwise, select the new child (open details)
      setSelectedChild(child);
    }
  };

  const handleAddChildClick = (e) => {
    e.stopPropagation();
    console.log("Add Child button clicked, setting showAddModal to true");
    setShowAddModal(true);
  };

  useEffect(() => {
    console.log("showAddModal state:", showAddModal);
  }, [showAddModal]);

  return (
    <div className="addchild-page-container">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="addchild-page-content">
        <div className="addchild-page-wrapper">
          <h2 className="addchild-title">Child Information</h2>
          <div className="addchild-child-list">
            {Array.isArray(children) && children.length > 0 ? (
              children.map((child, index) => (
                <div
                  key={index}
                  className={`addchild-child-card ${selectedChild?.childId === child.childId ? "addchild-child-card-selected" : ""}`}
                  onClick={() => handleSelectChild(child)}
                >
                  <span>{child.name}</span>
                </div>
              ))
            ) : (
              <div className="addchild-empty-state">
                <img
                  src="https://via.placeholder.com/300x200?text=Add+Your+First+Child"
                  alt="No children illustration"
                  className="addchild-empty-illustration"
                />
                <p>No children added yet. Click below to get started!</p>
                <div className="addchild-add-child-btn" onClick={handleAddChildClick}>
                  <FaPlus size={40} />
                  <p>Add a Child</p>
                </div>
              </div>
            )}
            {children.length > 0 && (
              <div className="addchild-add-child-btn" onClick={handleAddChildClick}>
                <FaPlus size={40} />
                <p>Add a Child</p>
              </div>
            )}
          </div>

          {selectedChild && (
            <div className="addchild-child-details">
              <h3>Details for {selectedChild.name}</h3>
              <div className="addchild-child-details-content">
                <div className="addchild-child-avatar-wrapper">
                  <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(selectedChild.name + selectedChild.gender)}`}
                    alt="Avatar"
                    className="addchild-child-avatar"
                  />
                </div>
                <div className="addchild-child-details-text">
                  <p><strong>Date of Birth:</strong> {new Date(selectedChild.dateOfBirth).toLocaleDateString()}</p>
                  <p><strong>Gender:</strong> {selectedChild.gender}</p>
                  <p><strong>Birth Weight (kg):</strong> {selectedChild.birthWeight}</p>
                  <p><strong>Birth Height (cm):</strong> {selectedChild.birthHeight}</p>
                  <p><strong>Blood Type:</strong> {selectedChild.bloodType || "N/A"}</p>
                  <p><strong>Allergies:</strong> {selectedChild.allergies || "None"}</p>
                  <p><strong>Relationship:</strong> {selectedChild.relationship === "D" ? "Dad" : selectedChild.relationship === "M" ? "Mom" : selectedChild.relationship}</p>
                  <Link to={`/update-growth-metrics/${selectedChild.childId}`} className="addchild-update-growth-link">
                    Update Growth
                  </Link>
                </div>
              </div>
            </div>
          )}

          {children.length > 0 && (
            <div className="addchild-consultation-section">
              <h3 className="addchild-consultation-title">Consultation Request</h3>
              <p className="addchild-consultation-subtitle">
                Need advice? Submit a consultation request for your child.
              </p>
              <form onSubmit={handleConsultationSubmit} className="addchild-consultation-form">
                <div className="addchild-form-group">
                  <label>Select Child</label>
                  <select
                    name="childId"
                    value={consultationData.childId}
                    onChange={handleConsultationChange}
                    className="addchild-form-input"
                    required
                  >
                    <option value="">Select a child</option>
                    {children.map((child) => (
                      <option key={child.childId} value={child.childId}>
                        {child.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="addchild-form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={consultationData.description}
                    onChange={handleConsultationChange}
                    placeholder="Describe your request (e.g., concerns about growth, health advice, etc.)"
                    className="addchild-form-input addchild-textarea"
                    rows="4"
                    required
                  />
                </div>
                <div className="addchild-form-group">
                  <label>Urgency</label>
                  <select
                    name="urgency"
                    value={consultationData.urgency}
                    onChange={handleConsultationChange}
                    className="addchild-form-input"
                    required
                  >
                    <option value="">Select urgency level</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="addchild-form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={consultationData.category}
                    onChange={handleConsultationChange}
                    className="addchild-form-input"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Growth">Growth</option>
                    <option value="Health">Health</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Development">Development</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {consultationError && (
                  <span className="addchild-form-error">
                    <FaExclamationCircle /> {consultationError}
                  </span>
                )}
                {consultationSuccess && (
                  <span className="addchild-form-success">
                    {consultationSuccess}
                  </span>
                )}
                <div className="addchild-consultation-actions">
                  <button type="submit" className="addchild-btn-submit">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          )}

          {showAddModal && (
            <div className="addchild-modal-overlay">
              <div className="addchild-modal-box">
                <h2>Add Child</h2>
                {childData.name && childData.gender && (
                  <div className="addchild-avatar-preview">
                    <img
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(childData.name + childData.gender)}`}
                      alt="Avatar Preview"
                      className="addchild-avatar-preview-img"
                    />
                  </div>
                )}
                <form onSubmit={handleSubmit} className="addchild-form">
                  <div className="addchild-form-section">
                    <h3>Basic Info</h3>
                    <div className="addchild-form-row">
                      <div className="addchild-form-group">
                        <label>Child's Name</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter child's name"
                          value={childData.name}
                          onChange={handleChange}
                          required
                          className="addchild-form-input"
                        />
                        {errors.name && (
                          <span className="addchild-form-error">
                            <FaExclamationCircle /> {errors.name}
                          </span>
                        )}
                      </div>
                      <div className="addchild-form-group">
                        <label>Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={childData.dateOfBirth}
                          onChange={handleChange}
                          required
                          className="addchild-form-input"
                        />
                        {errors.dateOfBirth && (
                          <span className="addchild-form-error">
                            <FaExclamationCircle /> {errors.dateOfBirth}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="addchild-form-group">
                      <label>Gender</label>
                      <div className="addchild-gender-options">
                        <button
                          type="button"
                          className={`addchild-gender-option ${childData.gender === "Male" ? "addchild-gender-option-selected" : ""}`}
                          onClick={() => handleGenderSelect("Male")}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          className={`addchild-gender-option ${childData.gender === "Female" ? "addchild-gender-option-selected" : ""}`}
                          onClick={() => handleGenderSelect("Female")}
                        >
                          Female
                        </button>
                      </div>
                      {errors.gender && (
                        <span className="addchild-form-error">
                          <FaExclamationCircle /> {errors.gender}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="addchild-form-section">
                    <h3>Birth Info</h3>
                    <div className="addchild-form-row">
                      <div className="addchild-form-group">
                        <label>Birth Weight (kg)</label>
                        <input
                          type="number"
                          name="birthWeight"
                          placeholder="Birth Weight (kg)"
                          value={childData.birthWeight}
                          onChange={handleChange}
                          required
                          className="addchild-form-input"
                        />
                      </div>
                      <div className="addchild-form-group">
                        <label>Birth Height (cm)</label>
                        <input
                          type="number"
                          name="birthHeight"
                          placeholder="Birth Height (cm)"
                          value={childData.birthHeight}
                          onChange={handleChange}
                          required
                          className="addchild-form-input"
                        />
                      </div>
                      <div className="addchild-form-group">
                        <label>Blood Type</label>
                        <select
                          name="bloodType"
                          value={childData.bloodType}
                          onChange={handleChange}
                          className="addchild-form-input"
                        >
                          <option value="">Select Blood Type</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="addchild-form-section">
                    <h3>Extra Info</h3>
                    <div className="addchild-form-row">
                      <div className="addchild-form-group">
                        <label>Allergies</label>
                        <input
                          type="text"
                          name="allergies"
                          placeholder="Allergies (if any)"
                          value={childData.allergies}
                          onChange={handleChange}
                          className="addchild-form-input"
                        />
                      </div>
                      <div className="addchild-form-group">
                        <label>Relationship</label>
                        <select
                          name="relationship"
                          value={childData.relationship}
                          onChange={handleChange}
                          required
                          className="addchild-form-input"
                        >
                          <option value="">Select Relationship</option>
                          <option value="D">Dad</option>
                          <option value="M">Mom</option>
                        </select>
                        {errors.relationship && (
                          <span className="addchild-form-error">
                            <FaExclamationCircle /> {errors.relationship}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="addchild-modal-actions">
                    <button type="submit" className="addchild-btn-submit">Add Child</button>
                    <button type="button" className="addchild-btn-cancel" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddChild;