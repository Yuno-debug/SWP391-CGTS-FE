import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MembershipManage.css";
import Modal from "react-modal";

Modal.setAppElement("#root");


const API_URL = "http://localhost:5200"; // Cấu hình API URL

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

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/MembershipPackage`);
      if (response.data && Array.isArray(response.data.$values)) {
        setPlans(response.data.$values);
      } else {
        console.error("API không trả về mảng hợp lệ:", response.data);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (newStatus === "Active") {
      const activeCount = plans.filter((plan) => plan.status === "Active").length;
      if (activeCount >= 3) {
        alert("Chỉ được kích hoạt tối đa 3 gói Membership!");
        return;
      }
    }

    const apiUrl = newStatus === "Active"
      ? `${API_URL}/api/MembershipPackage/${id}/approve`
      : `${API_URL}/api/MembershipPackage/${id}/deactivate`;

    try {
      await axios.patch(apiUrl);
      alert(`Gói ${id} đã chuyển sang trạng thái ${newStatus}!`);
      fetchMemberships(); // Load lại danh sách
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Lỗi khi cập nhật trạng thái!");
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
  };

  const openEditModal = (plan) => {
    setSelectedPlan(plan);
    setModalIsOpen(true);
    setNewPackage({ ...plan });
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
  };

  const handleCreatePackage = async () => {
    try {
      await axios.post(`${API_URL}/api/MembershipPackage`, newPackage);
      alert("Tạo mới gói membership thành công!");
      closeModal();
      fetchMemberships();
    } catch (error) {
      console.error("Lỗi khi tạo mới membership:", error);
      alert("Lỗi khi tạo mới membership!");
    }
  };

  const handleUpdatePackage = async () => {
    try {
      await axios.put(`${API_URL}/api/MembershipPackage/${selectedPlan.packageId}`, newPackage);
      alert("Cập nhật gói membership thành công!");
      closeModal();
      fetchMemberships();
    } catch (error) {
      console.error("Lỗi khi cập nhật membership:", error);
      alert("Lỗi khi cập nhật membership!");
    }
  };

  return (
    <div className="membership-management">
      <h2 className="title-center">Membership Management</h2>
      <h3 className="subtitle-center">Admin Panel</h3>

      <button className="create-membership-btn" onClick={openCreateModal}>
        Tạo Mới Package
      </button>

      <table className="membership-table">
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Description</th>
            <th>Price (VND)</th>
            <th>Duration (Months)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.packageId}>
              <td>{plan.packageName}</td>
              <td>{plan.description}</td>
              <td>{plan.price}</td>
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
        <h2 className="modal-title">{selectedPlan ? "Chỉnh Sửa Membership Package" : "Tạo Mới Membership Package"}</h2>
        <div className="form-group">
          <label>Package Name:</label>
          <input type="text" value={newPackage.packageName} onChange={(e) => setNewPackage({ ...newPackage, packageName: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input type="text" value={newPackage.description} onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Price (VND):</label>
          <input type="number" value={newPackage.price} onChange={(e) => setNewPackage({ ...newPackage, price: Number(e.target.value) })} />
        </div>
        <div className="form-group">
          <label>Duration (Months):</label>
          <input type="number" value={newPackage.durationMonths} onChange={(e) => setNewPackage({ ...newPackage, durationMonths: Number(e.target.value) })} />
        </div>
        <div className="form-group">
  <label>Max Children Allowed:</label>
  <input
    type="number"
    value={newPackage.maxChildrenAllowed}
    onChange={(e) =>
      setNewPackage({ ...newPackage, maxChildrenAllowed: Number(e.target.value) })
    }
  />
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
