import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./PaymentModal.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5200/api";
const API_MEMBERSHIP_URL = `${API_BASE_URL}/UserMembership/create`;
const API_PAYMENT_URL = `${API_BASE_URL}/Payment/create`;
const API_VNPAY_URL = `${API_BASE_URL}/VNPay/CreatePaymentUrl`;

const getUserId = () => {
  const userId = localStorage.getItem("userId");
  return userId ? Number(userId) : 1;
};

const PaymentModal = ({ isOpen, onClose, packageInfo }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !packageInfo) return null;

  const processPayment = async () => {
    setLoading(true);
    setError(null);
    const userId = getUserId();
  
    try {
      // 🛒 Bước 1: Tạo Membership
      const { data: membershipData } = await axios.post(API_MEMBERSHIP_URL, { userId, packageId: packageInfo.packageId });
      if (!membershipData?.success) throw new Error("Không thể tạo Membership.");
      const membershipId = membershipData?.data?.membershipid;
      if (!membershipId) throw new Error("Không nhận được Membership ID.");
  
      // 💰 Bước 2: Tạo Payment (membershipId gửi qua query)
      const { data: paymentData } = await axios.post(`${API_PAYMENT_URL}?membershipId=${membershipId}`);
      if (!paymentData?.paymentId) throw new Error("Không nhận được Payment ID.");
      const paymentId = paymentData.paymentId;
  
      // 🔗 Bước 3: Lấy URL thanh toán VNPay
      const { data: paymentUrl } = await axios.get(`${API_VNPAY_URL}?paymentId=${paymentId}`);
if (!paymentUrl) throw new Error("Không nhận được URL thanh toán.");

console.log("🔗 Redirecting to:", paymentUrl);
window.location.href = paymentUrl;

    } catch (error) {
      console.error("❌ Lỗi thanh toán:", error);
      setError(error.response?.data?.message || "Thanh toán thất bại!");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h2>{packageInfo.packageName} Package</h2>
        <div className="payment-details">
          <div className="payment-row"><span>Package Name:</span><span>{packageInfo.packageName}</span></div>
          <div className="payment-row"><span>Price:</span><span>{packageInfo.price} VND</span></div>
          <div className="payment-row"><span>Description:</span><span>{packageInfo.description}</span></div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="button-group">
          <button className="cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="continue-btn" onClick={processPayment} disabled={loading}>
            {loading ? "Processing..." : "Thanh toán VNPay"}
          </button>
        </div>
      </div>
    </div>
  );
};

PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  packageInfo: PropTypes.shape({
    packageName: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    packageId: PropTypes.number.isRequired,
  }).isRequired,
};

export default PaymentModal;
