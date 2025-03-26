import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./PaymentModal.css";
import vnpayLogo from "../../../assets/VNPAY_id-sVSMjm2_1.svg";

// ✅ Đường dẫn API từ biến môi trường hoặc mặc định localhost
const API_MEMBERSHIP_URL = import.meta.env.VITE_API_MEMBERSHIP_URL || "http://localhost:5200/api/UserMembership/create";
const API_PAYMENT_URL = import.meta.env.VITE_API_PAYMENT_URL || "http://localhost:5200/api/Payment/create";
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
  const paymentMethod = "vnpay"; // Hardcode to VNPay since dropdown is removed

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
        packageId: Number(packageInfo.packageId),
      };
      console.log("Payload gửi Membership API:", payload);

      const membershipResponse = await axios.post(API_MEMBERSHIP_URL, payload);
      console.log("✅ Membership response:", membershipResponse.data);

      const membershipId = membershipResponse.data?.data?.membershipid;
      if (!membershipId) throw new Error("Không thể tạo Membership.");

      // ✅ Bước 2: Tạo Payment
      const paymentResponse = await axios.post(`${API_PAYMENT_URL}?membershipId=${membershipId}`);
      console.log("✅ Payment response:", paymentResponse.data);

      const paymentId = paymentResponse.data?.paymentId;
      if (!paymentId) throw new Error("Không thể tạo Payment.");

      // ✅ Bước 3: Lấy VNPay URL
      const vnpayResponse = await axios.get(`${API_VNPAY_URL}?paymentId=${paymentId}&method=${paymentMethod}`);
      console.log("✅ VNPay response:", vnpayResponse.data);

      const paymentUrl = vnpayResponse.data;
      if (paymentUrl) {
        console.log("🔗 Chuyển hướng đến VNPay:", paymentUrl);
        window.location.href = paymentUrl;
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

  // Use durationMonths from packageInfo, default to 1 if not provided
  const duration = packageInfo.durationMonths || 1;
  const durationText = `${duration} month${duration > 1 ? "s" : ""}`; // Add "s" for plural
  const total = packageInfo.price; // Giả sử không có phí bổ sung

  return (
    <div className={`payment-modal-overlay ${isOpen ? "payment-modal-overlay-active" : ""}`} onClick={onClose}>
      <div className="payment-modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="payment-modal-heading">{packageInfo.packageName} Package</h2>
        <div className="payment-modal-info">
          <p>
            <strong>Payment details:</strong> {packageInfo.price.toLocaleString("en-US")} VND / {durationText}
          </p>
          <p>
            <strong>Total:</strong> {total.toLocaleString("en-US")} VND
          </p>
        </div>
        <div className="payment-modal-method-section">
          <label className="payment-modal-method-label"><strong>Payment method</strong></label>
          <div className="payment-modal-method-container">
            <img src={vnpayLogo} alt="VNPay Logo" className="payment-modal-method-logo" />
            <span>VNPay</span>
          </div>
        </div>
        {error && <p className="payment-modal-error-text">{error}</p>}
        <div className="payment-modal-actions">
          <button className="payment-modal-btn-cancel" onClick={onClose} disabled={loading}>
            CANCEL
          </button>
          <button className="payment-modal-btn-continue" onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "CONTINUE"}
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
    durationMonths: PropTypes.number, // Add durationMonths to PropTypes
  }).isRequired,
};

export default PaymentModal;