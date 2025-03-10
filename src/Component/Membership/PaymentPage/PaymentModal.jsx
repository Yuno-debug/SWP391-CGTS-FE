import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./PaymentModal.css";

const API_MEMBERSHIP_URL = import.meta.env.VITE_API_MEMBERSHIP_URL || "http://localhost:5200/api/UserMembership/create";
const API_PAYMENT_URL = import.meta.env.VITE_API_PAYMENT_URL || "http://localhost:5200/api/Payment";
const API_VNPAY_URL = import.meta.env.VITE_API_VNPAY_URL || "http://localhost:5200/api/VNPay/CreatePaymentUrl";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User object from localStorage:", user);
    return user?.userId || user?.id || null; // Handle different possible structures
  } catch (error) {
    console.error("❌ Lỗi khi lấy userId từ localStorage:", error);
    return null;
  }
};

const PaymentModal = ({ isOpen, onClose, packageInfo }) => {
  const [paymentMethod, setPaymentMethod] = useState("vnpay"); // Set default payment method to VNPay
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !packageInfo) return null;

  const handlePayment = async () => {
    console.log("handlePayment called"); // Add logging to check if the function is called
    if (!paymentMethod) {
      console.error("No payment method selected");
      return;
    }
    setLoading(true);
    setError(null);
    const userId = getUserId();

    if (!userId) {
      setError("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      console.log("🔹 Bước 1: Gửi dữ liệu tạo Membership", {
        userId,
        packageId: packageInfo.packageId,
        price: packageInfo.price,
        packageName: packageInfo.packageName,
      });

      const membershipResponse = await axios.post(API_MEMBERSHIP_URL, {
        userId: userId,
        packageId: packageInfo.packageId,
        price: packageInfo.price, // Đảm bảo truyền giá tiền đúng
        packageName: packageInfo.packageName, // Đảm bảo truyền tên gói
      });

      const membershipId = membershipResponse.data?.membershipId;
      if (!membershipId) throw new Error("Không thể tạo Membership.");

      console.log("✅ Membership created:", membershipResponse.data);

      console.log(`🔹 Bước 2: Tạo Payment cho MembershipId: ${membershipId}`);
      const paymentResponse = await axios.post(`${API_PAYMENT_URL}/${membershipId}`, {
        amount: packageInfo.price, // Đảm bảo truyền đúng giá tiền
      });

      const paymentId = paymentResponse.data?.paymentId;
      if (!paymentId) throw new Error("Không thể tạo Payment.");

      console.log("✅ Payment created:", paymentResponse.data);

      console.log(`🔹 Bước 3: Lấy URL thanh toán VNPay cho PaymentId: ${paymentId}`);
      
      // Đổi sang GET nếu API không hỗ trợ POST
      const vnpayResponse = await axios.get(`${API_VNPAY_URL}?paymentId=${paymentId}&method=vnpay`);
      
      const paymentUrl = vnpayResponse.data?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error("Không nhận được URL thanh toán.");
      }
    } catch (error) {
      console.error("❌ Lỗi thanh toán:", error);
      setError(error.response?.data?.message || "Thanh toán thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`payment-modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{packageInfo.packageName} Package</h2>
        <div className="payment-details">
          <p><strong>Package Name:</strong> {packageInfo.packageName}</p>
          <p><strong>Price:</strong> {packageInfo.price} VND</p>
          <p><strong>Description:</strong> {packageInfo.description}</p>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="button-group">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="continue-btn" onClick={handlePayment} disabled={loading}>
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
  packageInfo: PropTypes.object.isRequired,
};

export default PaymentModal;
