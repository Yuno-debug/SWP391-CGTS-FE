import React, { useState } from "react";
import PropTypes from "prop-types";
import "./PaymentModal.css";

const PaymentModal = ({ isOpen, onClose, packageInfo }) => {
  const [paymentMethod, setPaymentMethod] = useState("");

  if (!isOpen || !packageInfo) return null; // Nếu modal chưa mở, không render

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h2>{packageInfo.packageName} Package</h2>
        <div className="payment-details">
          <div className="payment-row">
            <span>Package Name:</span>
            <span>{packageInfo.packageName}</span>
          </div>
          <div className="payment-row">
            <span>Price:</span>
            <span>{packageInfo.price} VND</span>
          </div>
          <div className="payment-row">
            <span>Description:</span>
            <span>{packageInfo.description}</span>
          </div>
        </div>
        <div className="payment-method">
          <span>Payment method:</span>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="">Select payment method</option>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
        <div className="button-group">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="continue-btn" disabled={!paymentMethod}>Continue</button>
        </div>
      </div>
    </div>
  );
};

// Kiểm tra kiểu dữ liệu props
PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  packageInfo: PropTypes.shape({
    packageName: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string,
  }),
};

export default PaymentModal;
