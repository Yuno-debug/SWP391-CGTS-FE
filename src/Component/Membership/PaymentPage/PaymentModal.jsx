import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./PaymentModal.css";

// ✅ Đường dẫn API từ biến môi trường hoặc mặc định localhost
const API_MEMBERSHIP_URL = import.meta.env.VITE_API_MEMBERSHIP_URL || "http://localhost:5200/api/UserMembership/create";
const API_PAYMENT_URL = import.meta.env.VITE_API_PAYMENT_URL || "http://localhost:5200/api/Payment/create"; // sửa lại endpoint
const API_VNPAY_URL = import.meta.env.VITE_API_VNPAY_URL || "http://localhost:5200/api/VNPay/CreatePaymentUrl";

// ✅ Lấy userId từ localStorage và ép kiểu số
const getUserId = () => {
  const userId = Number(localStorage.getItem("userId"));
  console.log("UserId từ localStorage (Number):", userId);
  return userId || null;
};

const PaymentModal = ({ isOpen, onClose, packageInfo }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    console.log("👉 handlePayment được gọi");
    setLoading(true);
    setError(null);
    const userId = getUserId();

    if (!userId) {
      setError("User ID không hợp lệ. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    try {
      // ✅ Bước 1: Tạo Membership
      const payload = {
        userId: userId,
        packageId: Number(packageInfo.packageId), // ép kiểu số
      };
      console.log("Payload gửi Membership API:", payload);

      const membershipResponse = await axios.post(API_MEMBERSHIP_URL, payload);
      console.log("✅ Membership response:", membershipResponse.data);

      const membershipId = membershipResponse.data?.data?.membershipid;
      if (!membershipId) throw new Error("Không thể tạo Membership.");

      // ✅ Bước 2: Tạo Payment (dùng query param đúng với API)
      const paymentResponse = await axios.post(`${API_PAYMENT_URL}?membershipId=${membershipId}`);
      console.log("✅ Payment response:", paymentResponse.data);

      const paymentId = paymentResponse.data?.paymentId;
      if (!paymentId) throw new Error("Không thể tạo Payment.");

      // ✅ Bước 3: Lấy VNPay URL
      const vnpayResponse = await axios.get(`${API_VNPAY_URL}?paymentId=${paymentId}&method=vnpay`);
      console.log("✅ VNPay response:", vnpayResponse.data);

      const paymentUrl = vnpayResponse.data; // lấy nguyên chuỗi URL
if (paymentUrl) {
  console.log("🔗 Chuyển hướng đến VNPay:", paymentUrl);
  window.location.href = paymentUrl; // chuyển hướng
} else {
  throw new Error("Không nhận được URL thanh toán.");
}


    } catch (error) {
      console.error("❌ Lỗi xử lý thanh toán:", error);
      console.log("❗ Chi tiết lỗi backend:", error.response?.data);
      setError(error.response?.data?.message || "Thanh toán thất bại. Vui lòng thử lại!");
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
          <button className="cancel-btn" onClick={onClose}>Hủy</button>
          <button className="continue-btn" onClick={handlePayment} disabled={loading}>
            {loading ? "Đang xử lý..." : "Thanh toán VNPay"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Định nghĩa PropTypes
PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  packageInfo: PropTypes.shape({
    packageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    packageName: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default PaymentModal;
