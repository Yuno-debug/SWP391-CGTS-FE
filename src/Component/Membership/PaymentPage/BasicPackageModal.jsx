import React, { useState } from 'react';
import './PaymentModal.css';
const BasicPackageModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('9999$');
  const [period, setPeriod] = useState('1 month');

  const handlePayment = () => {
    // Logic for handling payment process
    alert('Payment processed for Basic Package');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Basic Package</h2>
        <p>Price: {amount}</p>
        <p>Access for: {period}</p>
        <button onClick={handlePayment} className="btn-pay">Pay Now</button>
        <button onClick={onClose} className="btn-close">Close</button>
          </div>
          </div>
  );
};

export default BasicPackageModal;