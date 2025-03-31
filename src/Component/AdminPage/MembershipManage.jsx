import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MembershipManage.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

const API_URL = "http://localhost:5200"; // API URL configuration

const MembershipManage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPackage, setNewPackage] = useState({
    packageName: "",
    description: "",
    price: 0,
    durationMonths: 0,
    features: "",
    maxChildrenAllowed: 0,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/MembershipPackage`);
      if (response.data && Array.isArray(response.data.$values)) {
        setPlans(response.data.$values);
      } else {
        console.error("API did not return a valid array:", response.data);
      }
    } catch (err) {
      console.error("Error calling API:", err);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (newStatus === "Active") {
      const activeCount = plans.filter((plan) => plan.status === "Active").length;
      if (activeCount >= 3) {
        alert("Only a maximum of 3 Membership packages can be activated!");
        return;
      }
    }

    const apiUrl = newStatus === "Active"
      ? `${API_URL}/api/MembershipPackage/${id}/approve`
      : `${API_URL}/api/MembershipPackage/${id}/deactivate`;

    try {
      await axios.patch(apiUrl);
      alert(`Package ${id} has been updated to ${newStatus}!`);
      fetchMemberships();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status!");
    }
  };

  const openCreateModal = () => {
    setSelectedPlan(null);
    setModalIsOpen(true);
    setNewPackage({
      packageName: "",
      description: "",
      price: 0,
      durationMonths: 0,
      features: "",
      maxChildrenAllowed: 0,
    });
    setErrors({});
  };

  const openEditModal = (plan) => {
    setSelectedPlan(plan);
    setModalIsOpen(true);
    setNewPackage({ ...plan });
    setErrors({});
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPlan(null);
    setNewPackage({
      packageName: "",
      description: "",
      price: 0,
      durationMonths: 0,
      features: "",
      maxChildrenAllowed: 0,
    });
    setErrors({});
  };

  const validateForm = () => {
    let tempErrors = {};

    if (!newPackage.packageName.trim()) {
      tempErrors.packageName = "Package Name cannot be empty";
    } else if (newPackage.packageName.length < 3) {
      tempErrors.packageName = "Package Name must be at least 3 characters long";
    }

    if (!newPackage.description.trim()) {
      tempErrors.description = "Description cannot be empty";
    } else if (newPackage.description.length < 10) {
      tempErrors.description = "Description must be at least 10 characters long";
    }

    if (newPackage.price <= 0) {
      tempErrors.price = "Price must be greater than 0";
    }

    if (newPackage.durationMonths <= 0) {
      tempErrors.durationMonths = "Duration must be greater than 0";
    }

    if (newPackage.maxChildrenAllowed < 0) {
      tempErrors.maxChildrenAllowed = "Max Children Allowed cannot be less than 0";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Returns true if no errors
  };

  const handleCreatePackage = async () => {
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      await axios.post(`${API_URL}/api/MembershipPackage`, newPackage);
      alert("New membership package created successfully!");
      closeModal();
      fetchMemberships();
    } catch (error) {
      console.error("Error creating membership:", error);
      alert("Error creating membership!");
    }
  };

  const handleUpdatePackage = async () => {
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      await axios.put(`${API_URL}/api/MembershipPackage/${selectedPlan.packageId}`, newPackage);
      alert("Membership package updated successfully!");
      closeModal();
      fetchMemberships();
    } catch (error) {
      console.error("Error updating membership:", error);
      alert("Error updating membership!");
    }
  };

  // Format price with thousand separators
  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("en-US");
  };

  // Handle price input change (remove commas before setting state)
  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
    setNewPackage({ ...newPackage, price: rawValue ? Number(rawValue) : 0 });
  };

  return (
    <div className="membership-management">
      <h2 className="title-center">Membership Management</h2>
      <h3 className="subtitle-center">Admin Panel</h3>

      <button className="create-membership-btn" onClick={openCreateModal}>
        Create New Package
      </button>

      <table className="membership-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Package Name</th>
            <th>Description</th>
            <th>Price (VND)</th>
            <th>Duration (Months)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan, index) => (
            <tr key={plan.packageId}>
              <td>{index + 1}</td>
              <td>{plan.packageName}</td>
              <td>{plan.description}</td>
              <td>{formatPrice(plan.price)} VND</td>
              <td>{plan.durationMonths}</td>
              <td>{plan.status}</td>
              <td>
                <div className="membership-button-group">
                  {plan.status !== "Active" ? (
                    <button className="membership-btn membership-btn-active" onClick={() => handleStatusUpdate(plan.packageId, "Active")}>
                      Approve
                    </button>
                  ) : (
                    <>
                      <button className="membership-btn membership-btn-edit" onClick={() => openEditModal(plan)}>Edit</button>
                      <button className="membership-btn membership-btn-inactive" onClick={() => handleStatusUpdate(plan.packageId, "Inactive")}>
                        Deactivate
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal} 
        contentLabel="Manage Membership Package"
        className="ReactModal__Content form-container"
        overlayClassName="ReactModal__Overlay"
      >
        <h2 className="modal-title">{selectedPlan ? "Edit Membership Package" : "Create New Membership Package"}</h2>
        <div className="form-group">
          <label>Package Name:</label>
          <input 
            type="text" 
            value={newPackage.packageName} 
            onChange={(e) => setNewPackage({ ...newPackage, packageName: e.target.value })} 
          />
          {errors.packageName && <span className="error">{errors.packageName}</span>}
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input 
            type="text" 
            value={newPackage.description} 
            onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })} 
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>
        <div className="form-group">
          <label>Price (VND):</label>
          <input 
            type="text" 
            value={formatPrice(newPackage.price)} 
            onChange={handlePriceChange}
            placeholder="e.g., 1,000,000"
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>
        <div className="form-group">
          <label>Duration (Months):</label>
          <input 
            type="number" 
            value={newPackage.durationMonths} 
            onChange={(e) => setNewPackage({ ...newPackage, durationMonths: Number(e.target.value) })} 
          />
          {errors.durationMonths && <span className="error">{errors.durationMonths}</span>}
        </div>
        <div className="form-group">
          <label>Max Children Allowed:</label>
          <input
            type="number"
            value={newPackage.maxChildrenAllowed}
            onChange={(e) => setNewPackage({ ...newPackage, maxChildrenAllowed: Number(e.target.value) })}
          />
          {errors.maxChildrenAllowed && <span className="error">{errors.maxChildrenAllowed}</span>}
        </div>
        <div className="edit-button-group">
          {selectedPlan ? (
            <button className="btn-update" onClick={handleUpdatePackage}>Update</button>
          ) : (
            <button className="btn-create" onClick={handleCreatePackage}>Create</button>
          )}
          <button className="btn-cancel" onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default MembershipManage;