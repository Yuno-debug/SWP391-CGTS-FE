import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MembershipManage.css";
import Modal from "react-modal";

const MembershipManage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Fetch danh sách gói Membership từ API
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await axios.get("http://localhost:5200/api/MembershipPackage");
        if (response.data && Array.isArray(response.data.$values)) {
          setPlans(response.data.$values);
        } else {
          console.error("API không trả về mảng hợp lệ:", response.data);
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
      }
    };

    fetchMemberships();
  }, []);

  // Hàm cập nhật trạng thái (Active / Inactive)
  const handleStatusUpdate = async (id, newStatus) => {
    const apiUrl = newStatus === "Active"
      ? `http://localhost:5200/api/MembershipPackage/${id}/approve`
      : `http://localhost:5200/api/MembershipPackage/${id}/deactivate`;

    try {
      await axios.patch(apiUrl);
      alert(`Gói ${id} đã chuyển sang trạng thái ${newStatus}!`);
      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan.packageId === id ? { ...plan, status: newStatus } : plan
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Lỗi khi cập nhật trạng thái!");
    }
  };

  // Mở modal chỉnh sửa gói
  const openEditModal = (plan) => {
    setSelectedPlan({ ...plan });
    setModalIsOpen(true);
  };

  // Đóng modal
  const closeEditModal = () => {
    setModalIsOpen(false);
    setSelectedPlan(null);
  };

  // Cập nhật thông tin gói Membership
  const handleUpdate = async () => {
    if (!selectedPlan || !selectedPlan.packageId) {
      alert("Dữ liệu không hợp lệ!");
      return;
    }

    try {
      await axios.put(`http://localhost:5200/api/MembershipPackage/${selectedPlan.packageId}`, selectedPlan);
      alert(`Gói ${selectedPlan.packageId} đã được cập nhật thành công!`);
      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan.packageId === selectedPlan.packageId ? { ...selectedPlan } : plan
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật gói membership:", error);
      alert("Lỗi khi cập nhật gói membership!");
    }
  };

  return (
    <div className="membership-management">
      <h2>Membership Management</h2>
      <h3>Admin Panel</h3>
      <table>
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
                <div className="button-group">
                  {plan.status !== "Active" ? (
                    <button className="btn-active" onClick={() => handleStatusUpdate(plan.packageId, "Active")}>
                      Active
                    </button>
                  ) : (
                    <>
                      <button className="btn-edit" onClick={() => openEditModal(plan)}>Edit</button>
                      <button className="btn-inactive" onClick={() => handleStatusUpdate(plan.packageId, "Inactive")}>
                        Inactive
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal chỉnh sửa gói */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeEditModal} contentLabel="Edit Membership Plan">
        <h2>Edit Membership Plan</h2>
        {selectedPlan && (
          <div>
            <label>Package Name:</label>
            <input
              type="text"
              value={selectedPlan.packageName}
              onChange={(e) => setSelectedPlan({ ...selectedPlan, packageName: e.target.value })}
            />

            <label>Description:</label>
            <input
              type="text"
              value={selectedPlan.description}
              onChange={(e) => setSelectedPlan({ ...selectedPlan, description: e.target.value })}
            />

            <label>Price (VND):</label>
            <input
              type="number"
              value={selectedPlan.price}
              onChange={(e) => setSelectedPlan({ ...selectedPlan, price: e.target.value })}
            />

            <label>Duration (Months):</label>
            <input
              type="number"
              value={selectedPlan.durationMonths}
              onChange={(e) => setSelectedPlan({ ...selectedPlan, durationMonths: e.target.value })}
            />

            <div className="button-group">
              <button className="btn-update" onClick={handleUpdate}>Update</button>
              <button className="btn-cancel" onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MembershipManage;
