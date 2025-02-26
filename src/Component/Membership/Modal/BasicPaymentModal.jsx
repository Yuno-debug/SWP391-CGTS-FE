import React from 'react';
import { useState } from 'react';
import './PaymentModal.css';

const BasicPaymentModal = ({ isOpen, onClose }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('vnpay');
  const [showQR, setShowQR] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const paymentMethods = {
    vnpay: {
      name: 'VNPay',
      icon: 'https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg',
    },
    momo: {
      name: 'Momo',
      icon: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png',
    },
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setIsDropdownOpen(false);
  };

  const handleContinue = () => {
    setShowQR(true);
  };

  const handleBack = () => {
    setShowQR(false);
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {!showQR && !paymentSuccess ? (
          <>
            <h2>Basic Package</h2>

            <div className="payment-info">
              <div className="payment-row">
                <span>Payment details: 9999$ /1 month</span>
              </div>
              <div className="payment-row">
                <span>Total: 9999$</span>
              </div>
            </div>

            <div className="payment-method">
              <span>Payment method</span>
              <div 
                className="payment-select"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="selected-method">
                  <img 
                    src={paymentMethods[selectedMethod].icon} 
                    alt={paymentMethods[selectedMethod].name} 
                    width="24" 
                    height="24"
                  />
                  <span>{paymentMethods[selectedMethod].name}</span>
                </div>
                <span className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}>▾</span>
              </div>

              {isDropdownOpen && (
                <div className="payment-dropdown">
                  {Object.entries(paymentMethods).map(([key, method]) => (
                    <div 
                      key={key}
                      className={`payment-option ${selectedMethod === key ? 'selected' : ''}`}
                      onClick={() => handleMethodSelect(key)}
                    >
                      <img 
                        src={method.icon} 
                        alt={method.name} 
                        width="24" 
                        height="24"
                      />
                      <span>{method.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-buttons">
              <button className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button className="continue-btn" onClick={handleContinue}>
                Continue
              </button>
            </div>
          </>
        ) : showQR && !paymentSuccess ? (
          <div className="qr-screen">
            <div className="qr-container">
              <img 
                src="https://tiencuatoi.vn/wp-content/uploads/2019/07/t%E1%BA%A3i-xu%E1%BB%91ng.png"
                alt="QR Code"
                className="qr-code"
              />
            </div>
            
            <div className="payment-method">
              <p>Payment method</p>
              <div className="selected-method">
                <img 
                  src={paymentMethods[selectedMethod].icon}
                  alt={paymentMethods[selectedMethod].name}
                  className="payment-icon"
                />
                <span>{paymentMethods[selectedMethod].name}</span>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={handleBack}>
                Back
              </button>
              <button className="confirm-btn" onClick={handlePaymentSuccess}>
                Confirm Payment
              </button>
            </div>
          </div>
        ) : (
          <div className="payment-success">
            <h2>Pay Successfully</h2>
            
            <div className="success-details">
              <div className="payment-method">
                <p>Payment method</p>
                <div className="selected-method">
                  <img 
                    src={paymentMethods[selectedMethod].icon}
                    alt={paymentMethods[selectedMethod].name}
                    className="payment-icon"
                  />
                  <span>{paymentMethods[selectedMethod].name}</span>
                </div>
              </div>

              <div className="total-amount">
                <p>Total: 9999$</p>
              </div>
            </div>

            <button className="close-btn" onClick={onClose}>
              Close
            </button>
          </div>  
        )}
      </div>
    </div>  
  );
};

export default BasicPaymentModal; 