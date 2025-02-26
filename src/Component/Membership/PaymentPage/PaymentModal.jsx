import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('');

  return (
    <div className="premium-package-container">
      <div className="payment-modal">
        <h2>Premium Package</h2>
        <div className="payment-details">
          <div className="payment-row">
            <span>Payment details:</span>
            <span>RM 7 / month</span>
          </div>
          <div className="payment-row">
            <span>Total:</span>
            <span>RM 7</span>
          </div>
        </div>
        <div className="payment-method">
          <span>Payment method:</span>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select payment method</option>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
        <div className="button-group">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="continue-btn">Continue</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;