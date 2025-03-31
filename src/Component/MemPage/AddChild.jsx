import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaExclamationCircle, FaPlus, FaBell, FaCheck } from "react-icons/fa";
import "./AddChild.css";
import axios from "axios";
import Navbar from "../HomePage/NavBar/NavBar";
import Footer from "../HomePage/Footer/Footer";
import bgrAddChild from '../../assets/bgraddchild.png'; // Import the background image

const AddChild = ({ isLoggedIn }) => {
    const [userId, setUserId] = useState("");
    const [childData, setChildData] = useState({
        name: "", dateOfBirth: "", gender: "", birthWeight: "",
        birthHeight: "", bloodType: "", allergies: "", relationship: "", avatar: "",
    });
    const [errors, setErrors] = useState({});
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [childToShowAlerts, setChildToShowAlerts] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
            alert("User ID not found! Please log in.");
            return;
        }
        const id = Number(storedUserId);
        setUserId(id);
        fetchChildren(id);
        fetchAlerts();
    }, []);

    const fetchChildren = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5200/api/Child/by-user/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setChildren(Array.isArray(response.data?.data?.$values) ? response.data.data.$values : []);
        } catch (error) {
            console.error("Error fetching children:", error);
            setChildren([]);
        }
    };

    const fetchAlerts = async () => {
        try {
            const response = await axios.get(`http://localhost:5200/api/Alert`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setAlerts(Array.isArray(response.data?.$values) ? response.data.$values : []);
        } catch (error) {
            console.error("Error fetching alerts:", error);
            setAlerts([]);
        }
    };

    const handleChange = (e) => {
        setChildData({ ...childData, [e.target.name]: e.target.value });
    };

    const handleGenderSelect = (gender) => {
        setChildData({ ...childData, gender });
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!childData.name) tempErrors.name = "Name is required";
        if (!childData.dateOfBirth) tempErrors.dateOfBirth = "Date of Birth is required";
        if (!childData.gender) tempErrors.gender = "Gender is required";
        if (!childData.birthWeight) tempErrors.birthWeight = "Birth Weight is required";
        if (!childData.birthHeight) tempErrors.birthHeight = "Birth Height is required";
        if (!childData.relationship) tempErrors.relationship = "Relationship is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const birthWeightNum = Number(childData.birthWeight);
        const birthHeightNum = Number(childData.birthHeight);

        if (isNaN(birthWeightNum)) {
            setErrors(prev => ({ ...prev, birthWeight: "Birth Weight must be a number" }));
            return;
        }
        if (isNaN(birthHeightNum)) {
            setErrors(prev => ({ ...prev, birthHeight: "Birth Height must be a number" }));
            return;
        }

        const requestData = {
            name: childData.name,
            dateOfBirth: childData.dateOfBirth,
            gender: childData.gender,
            birthWeight: birthWeightNum,
            birthHeight: birthHeightNum,
            bloodType: childData.bloodType || null,
            allergies: childData.allergies || "",
            relationship: childData.relationship,
            userId: userId,
        };

        const tempChildId = `temp-${Date.now()}`;
        const tempChild = { ...requestData, childId: tempChildId, status: "Pending" };

        setChildren((prevChildren) => [...prevChildren, tempChild]);
        setShowAddModal(false);

        try {
            await axios.post("http://localhost:5200/api/Child/create", requestData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            await fetchChildren(userId);
            await fetchAlerts();
            setChildData({ name: "", dateOfBirth: "", gender: "", birthWeight: "", birthHeight: "", bloodType: "", allergies: "", relationship: "", avatar: "" });
            setErrors({});
        } catch (error) {
            console.error("Error Details:", error.response || error);
            alert(`Error adding child: ${error.response?.data?.message || error.message}`);
            setChildren((prevChildren) => prevChildren.filter((child) => child.childId !== tempChildId));
            setShowAddModal(true);
        }
    };

    const handleSelectChild = (child) => {
        setSelectedChild(child);
        setChildToShowAlerts(null);
    };

    const handleShowAlerts = (e, child) => {
        e.stopPropagation();
        if (childToShowAlerts?.childId === child.childId) {
            setChildToShowAlerts(null);
        } else {
            setChildToShowAlerts(child);
            setSelectedChild(null);
        }
    };

    const handleMarkAsRead = async (alertId) => {
        try {
            await axios.put(
                `http://localhost:5200/api/Alert/${alertId}`,
                { isRead: true },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setAlerts((prevAlerts) =>
                prevAlerts.map((alert) =>
                    alert.alertId === alertId ? { ...alert, isRead: true } : alert
                )
            );
            await fetchAlerts();
        } catch (error) {
            console.error("Error marking alert as read:", error);
            alert(`Error marking alert as read: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleAddChildClick = (e) => {
        e.stopPropagation();
        setChildData({ name: "", dateOfBirth: "", gender: "", birthWeight: "", birthHeight: "", bloodType: "", allergies: "", relationship: "", avatar: "" });
        setErrors({});
        setShowAddModal(true);
        setSelectedChild(null);
        setChildToShowAlerts(null);
    };

    const getAvatarUrl = (child) => {
        if (child && typeof child.allergies === 'string' && child.allergies.startsWith('http')) {
            return child.allergies;
        }
        const placeholderText = child?.name ? `Avatar ${child.name}` : 'No Image';
        return `https://placehold.co/50x50?text=${encodeURIComponent(placeholderText)}`;
    };

    const getDetailAvatarUrl = (child) => {
        if (child && typeof child.allergies === 'string' && child.allergies.startsWith('http')) {
            return child.allergies;
        }
        const placeholderText = child?.name ? `Avatar ${child.name}` : 'No Image';
        return `https://placehold.co/100x100?text=${encodeURIComponent(placeholderText)}`;
    };

    const getAlertsForChild = (childId) => {
        if (!childId || !Array.isArray(alerts)) {
            return [];
        }
        return alerts.filter(alert => String(alert.childId) === String(childId));
    };

    return (
        <div
            className="addchild-page-container"
            style={{
                background: `url(${bgrAddChild}) no-repeat center center fixed`,
                backgroundSize: 'cover',
            }}
        >
            <Navbar isLoggedIn={isLoggedIn} />
            <main className="addchild-page-content">
                <div className="addchild-page-wrapper">
                    <h2 className="addchild-title">Child Information</h2>
                    <p className="addchild-welcome-message">
                        Welcome! Select a child to view details/alerts or add a new child.
                    </p>
                    <div className="addchild-child-list">
                        {Array.isArray(children) && children.map((child, index) => {
                            const childAlerts = getAlertsForChild(child.childId);
                            const hasAlerts = childAlerts.length > 0;
                            const hasUnreadAlerts = childAlerts.some(a => !a.isRead);
                            const isSelectedForDetails = String(selectedChild?.childId) === String(child.childId);
                            const isSelectedForAlerts = String(childToShowAlerts?.childId) === String(child.childId);

                            return (
                                <div
                                    key={child.childId || `child-${index}`}
                                    className={`add-child-unique-card ${isSelectedForDetails || isSelectedForAlerts ? "add-child-unique-card-selected" : ""}`}
                                >
                                    <div
                                        className="addchild-child-card-clickable-area"
                                        onClick={() => handleSelectChild(child)}
                                    >
                                        <img
                                            src={getAvatarUrl(child)}
                                            alt={`${child.name}'s Avatar`}
                                            className="addchild-child-card-avatar"
                                        />
                                        <span className="addchild-child-card-name">{child.name}</span>
                                    </div>
                                    {hasAlerts && (
                                        <div
                                            className="addchild-alert-icon-wrapper"
                                            onClick={(e) => handleShowAlerts(e, child)}
                                            title={isSelectedForAlerts ? "Hide Alerts" : "View Alerts"}
                                        >
                                            <FaBell
                                                color={isSelectedForDetails || isSelectedForAlerts ? "white" : undefined}
                                                size={20}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <div className="addchild-add-child-btn" onClick={handleAddChildClick}>
                            <FaPlus size={50} />
                            <p>Add a Child</p>
                        </div>
                    </div>

                    <div className="addchild-display-area">
                        {selectedChild && (
                            <div className="addchild-child-details">
                                <h3>Details for {selectedChild.name}</h3>
                                <div className="addchild-child-details-content">
                                    <div className="addchild-child-avatar-wrapper">
                                        <img src={getDetailAvatarUrl(selectedChild)} alt="Avatar" className="addchild-child-avatar" />
                                    </div>
                                    <div className="addchild-child-details-text">
                                        <p><strong>Date of Birth:</strong> {selectedChild.dateOfBirth ? new Date(selectedChild.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                                        <p><strong>Gender:</strong> {selectedChild.gender || "N/A"}</p>
                                        <p><strong>Birth Weight (kg):</strong> {selectedChild.birthWeight ?? "N/A"}</p>
                                        <p><strong>Birth Height (cm):</strong> {selectedChild.birthHeight ?? "N/A"}</p>
                                        <p><strong>Blood Type:</strong> {selectedChild.bloodType || "N/A"}</p>
                                        <p><strong>Relationship:</strong> {selectedChild.relationship === "D" ? "Dad" : selectedChild.relationship === "M" ? "Mom" : selectedChild.relationship || "N/A"}</p>
                                        {typeof selectedChild.childId === 'number' && (
                                            <Link to={`/update-growth-metrics/${selectedChild.childId}`} className="addchild-update-growth-link">
                                                Growth Data
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {childToShowAlerts && (
                            <div className="addchild-child-alerts-display">
                                <h3>Alerts for {childToShowAlerts.name}</h3>
                                {(() => {
                                    const filteredAlerts = getAlertsForChild(childToShowAlerts.childId);
                                    return filteredAlerts.length > 0 ? (
                                        <ul>
                                            {filteredAlerts.map(alert => (
                                                <li
                                                    key={alert.alertId}
                                                    className={`addchild-alert-item ${!alert.isRead ? 'addchild-alert-unread' : ''}`}
                                                >
                                                    <div className="addchild-alert-content">
                                                        <strong>{alert.alertType}:</strong> {alert.message}
                                                        <br />
                                                        <small>Date: {new Date(alert.alertDate).toLocaleString()}</small>
                                                        {!alert.isRead && <span className="addchild-unread-indicator"> (New)</span>}
                                                    </div>
                                                    <div
                                                        className="addchild-mark-read-btn"
                                                        onClick={() => handleMarkAsRead(alert.alertId)}
                                                        title="Mark as Read"
                                                    >
                                                        <FaCheck
                                                            color={alert.isRead ? "gray" : "green"}
                                                            size={16}
                                                        />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No alerts for this child.</p>
                                    );
                                })()}
                            </div>
                        )}
                    </div>

                    {showAddModal && (
                        <div className="addchild-modal-overlay">
                            <div className="addchild-modal-box">
                                <h2>Add Child</h2>
                                {childData.allergies && childData.allergies.startsWith('http') && (
                                    <div className="addchild-avatar-preview">
                                        <img src={childData.allergies} alt="Avatar Preview" className="addchild-avatar-preview-img" onError={(e) => (e.target.style.display = 'none')} />
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} className="addchild-form" noValidate>
                                    <div className="addchild-form-section">
                                        <h3>Basic Info</h3>
                                        <div className="addchild-form-row">
                                            <div className="addchild-form-group">
                                                <label>Child's Name*</label>
                                                <input type="text" name="name" placeholder="Enter child's name" value={childData.name} onChange={handleChange} required className="addchild-form-input" />
                                                {errors.name && <span className="addchild-form-error"><FaExclamationCircle /> {errors.name}</span>}
                                            </div>
                                            <div className="addchild-form-group">
                                                <label>Date of Birth*</label>
                                                <input type="date" name="dateOfBirth" value={childData.dateOfBirth} onChange={handleChange} required className="addchild-form-input" max={new Date().toISOString().split("T")[0]} />
                                                {errors.dateOfBirth && <span className="addchild-form-error"><FaExclamationCircle /> {errors.dateOfBirth}</span>}
                                            </div>
                                        </div>
                                        <div className="addchild-form-group">
                                            <label>Gender*</label>
                                            <div className="addchild-gender-options">
                                                <button type="button" className={`addchild-gender-option ${childData.gender === "Male" ? "addchild-gender-option-selected" : ""}`} onClick={() => handleGenderSelect("Male")}>Male</button>
                                                <button type="button" className={`addchild-gender-option ${childData.gender === "Female" ? "addchild-gender-option-selected" : ""}`} onClick={() => handleGenderSelect("Female")}>Female</button>
                                            </div>
                                            {errors.gender && <span className="addchild-form-error"><FaExclamationCircle /> {errors.gender}</span>}
                                        </div>
                                    </div>
                                    <div className="addchild-form-section">
                                        <h3>Birth Info</h3>
                                        <div className="addchild-form-row">
                                            <div className="addchild-form-group">
                                                <label>Birth Weight (kg)*</label>
                                                <input type="number" step="0.1" min="0" name="birthWeight" placeholder="e.g., 3.5" value={childData.birthWeight} onChange={handleChange} required className="addchild-form-input" />
                                                {errors.birthWeight && <span className="addchild-form-error"><FaExclamationCircle /> {errors.birthWeight}</span>}
                                            </div>
                                            <div className="addchild-form-group">
                                                <label>Birth Height (cm)*</label>
                                                <input type="number" step="0.1" min="0" name="birthHeight" placeholder="e.g., 50" value={childData.birthHeight} onChange={handleChange} required className="addchild-form-input" />
                                                {errors.birthHeight && <span className="addchild-form-error"><FaExclamationCircle /> {errors.birthHeight}</span>}
                                            </div>
                                            <div className="addchild-form-group">
                                                <label>Blood Type</label>
                                                <select name="bloodType" value={childData.bloodType} onChange={handleChange} className="addchild-form-input">
                                                    <option value="">Select Blood Type</option>
                                                    <option value="A+">A+</option><option value="A-">A-</option>
                                                    <option value="B+">B+</option><option value="B-">B-</option>
                                                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                                    <option value="O+">O+</option><option value="O-">O-</option>
                                                    <option value="Unknown">Unknown</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="addchild-form-section">
                                        <h3>Extra Info</h3>
                                        <div className="addchild-form-row">
                                            <div className="addchild-form-group">
                                                <label>Avatar URL</label>
                                                <input type="url" name="allergies" placeholder="https://example.com/avatar.jpg" value={childData.allergies} onChange={handleChange} className="addchild-form-input" />
                                            </div>
                                            <div className="addchild-form-group">
                                                <label>Relationship*</label>
                                                <select name="relationship" value={childData.relationship} onChange={handleChange} required className="addchild-form-input">
                                                    <option value="">Select Relationship</option>
                                                    <option value="D">Dad</option> <option value="M">Mom</option>
                                                    <option value="Guardian">Guardian</option> <option value="Other">Other</option>
                                                </select>
                                                {errors.relationship && <span className="addchild-form-error"><FaExclamationCircle /> {errors.relationship}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="addchild-modal-actions">
                                        <button type="submit" className="addchild-btn-submit">Add Child</button>
                                        <button type="button" className="addchild-btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
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