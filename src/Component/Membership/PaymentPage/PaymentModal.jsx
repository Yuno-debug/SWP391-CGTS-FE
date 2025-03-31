import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./PaymentModal.css";
import VNPayLogo from "../assets/vnpay.svg"; // Import the VNPay logo

// ✅ API endpoints from environment variables or default to localhost
const API_MEMBERSHIP_URL = import.meta.env.VITE_API_MEMBERSHIP_URL || "http://localhost:5200/api/UserMembership/create";
const API_PAYMENT_URL = import.meta.env.VITE_API_PAYMENT_URL || "http://localhost:5200/api/Payment/create";
const API_VNPAY_URL = import.meta.env.VITE_API_VNPAY_URL || "http://localhost:5200/api/VNPay/CreatePaymentUrl";

// ✅ Retrieve userId from localStorage and cast to number
const getUserId = () => {
  const userId = Number(localStorage.getItem("userId"));
  console.log("UserId from localStorage (Number):", userId);
  return userId || null;
};

const PaymentModal = ({ isOpen, onClose, packageInfo }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    console.log("👉 handlePayment called");
    setLoading(true);
    setError(null);
    const userId = getUserId();

    if (!userId) {
      setError("Invalid User ID. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      // ✅ Step 1: Create Membership
      const payload = {
        userId: userId,
        packageId: Number(packageInfo.packageId), // Cast to number
      };
      console.log("Payload sent to Membership API:", payload);

      const membershipResponse = await axios.post(API_MEMBERSHIP_URL, payload);
      console.log("✅ Membership response:", membershipResponse.data);

      const membershipId = membershipResponse.data?.data?.membershipid;
      if (!membershipId) throw new Error("Failed to create Membership.");

      // ✅ Step 2: Create Payment (using query param as per API)
      const paymentResponse = await axios.post(`${API_PAYMENT_URL}?membershipId=${membershipId}`);
      console.log("✅ Payment response:", paymentResponse.data);

      const paymentId = paymentResponse.data?.paymentId;
      if (!paymentId) throw new Error("Failed to create Payment.");

      // ✅ Step 3: Get VNPay URL
      const vnpayResponse = await axios.get(`${API_VNPAY_URL}?paymentId=${paymentId}&method=vnpay`);
      console.log("✅ VNPay response:", vnpayResponse.data);

      const paymentUrl = vnpayResponse.data; // Retrieve the full URL string
      if (paymentUrl) {
        console.log("🔗 Redirecting to VNPay:", paymentUrl);
        window.location.href = paymentUrl; // Redirect
      } else {
        throw new Error("Payment URL not received.");
      }
    } catch (error) {
      console.error("❌ Payment processing error:", error);
      console.log("❗ Backend error details:", error.response?.data);
      setError(error.response?.data?.message || "Payment failed. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`payment-modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{packageInfo.packageName}</h2> {/* Display package name as title */}
        <div className="payment-details">
          <p><strong>Package Name</strong> : {packageInfo.packageName}</p>
          <p><strong>Price</strong> : {packageInfo.price.toLocaleString('vi-VN')} VND</p>
          <p><strong>Duration</strong> : {packageInfo.durationMonths} months</p>
          <p><strong>Description</strong> : {packageInfo.description}</p>
          <p>
            <strong>Method</strong> : <img src={VNPayLogo} alt="VNPay Logo" style={{ height: '20px', marginLeft: '5px', verticalAlign: 'middle' }} />
          </p>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="button-group">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="continue-btn" onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Pay with VNPay"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Define PropTypes
PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  packageInfo: PropTypes.shape({
    packageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    packageName: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    durationMonths: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default PaymentModal;