import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import './PaymentModal.css';

// API endpoints
const API_PAYMENT_URL = "http://localhost:5200/api/VNPay/CreatePaymentUrl";

const PaymentModal = ({ isOpen, onClose, packageId = 2 }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('vnpay');
  const [showQR, setShowQR] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleContinue = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔹 Đang tạo thanh toán: ${selectedMethod} cho gói ${packageId || 2}`);
      console.log("🔄 Sẽ thử với nhiều paymentId khác nhau (packageId, 1, 2)");

      // Try with multiple payment IDs
      const paymentIds = [packageId || 2, 1, 2]; // Try packageId first, then 1, then 2
      let succeeded = false;

      for (const id of paymentIds) {
        if (succeeded) break;
        
        console.log(`🔄 Thử với paymentId=${id}...`);
        
        // Try POST method first
        try {
          console.log(`🔄 Thử phương thức POST với paymentId=${id}...`);
          const postResponse = await axios.post(API_PAYMENT_URL, {
            paymentId: id,
            method: selectedMethod
          });
          
          if (postResponse.data) {
            const paymentUrl = postResponse.data.paymentUrl || postResponse.data;
            console.log(`✅ URL thanh toán nhận được (POST, paymentId=${id}):`, paymentUrl);
            
            if (typeof paymentUrl === 'string' && (paymentUrl.startsWith('http://') || paymentUrl.startsWith('https://'))) {
              window.location.href = paymentUrl;
              succeeded = true;
              break;
            } else {
              console.warn("⚠️ Received payment URL is not valid:", paymentUrl);
            }
          }
        } catch (postError) {
          console.error(`❌ POST method failed with paymentId=${id}:`, postError);
          
          // Try GET method as fallback
          try {
            console.log(`🔄 Thử phương thức GET với paymentId=${id}...`);
            const getResponse = await axios.get(`${API_PAYMENT_URL}?paymentId=${id}&method=${selectedMethod}`);
            
            if (getResponse.data) {
              const paymentUrl = getResponse.data.paymentUrl || getResponse.data;
              console.log(`✅ URL thanh toán nhận được (GET, paymentId=${id}):`, paymentUrl);
              
              if (typeof paymentUrl === 'string' && (paymentUrl.startsWith('http://') || paymentUrl.startsWith('https://'))) {
                window.location.href = paymentUrl;
                succeeded = true;
                break;
              } else {
                console.warn("⚠️ Received payment URL is not valid:", paymentUrl);
              }
            }
          } catch (getError) {
            console.error(`❌ GET method failed with paymentId=${id}:`, getError);
          }
        }
      }
      
      if (!succeeded) {
        setError("Không thể kết nối đến cổng thanh toán. Vui lòng thử lại sau.");
        console.error("❌ Không thể kết nối đến cổng thanh toán sau khi thử tất cả các phương thức.");
      } else {
        // For demo only - normally we'd redirect to payment gateway
        setShowQR(true);
      }
    } catch (error) {
      console.error("❌ Lỗi khi thanh toán:", error);
      
      // Chi tiết lỗi
      if (error.response) {
        console.error("❌ Response data:", error.response.data);
        console.error("❌ Response status:", error.response.status);
        console.error("❌ Response headers:", error.response.headers);
        setError(error.response.data?.message || `Lỗi ${error.response.status}: Thanh toán thất bại!`);
      } else if (error.request) {
        console.error("❌ Request made but no response:", error.request);
        setError("Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.");
      } else {
        console.error("❌ Error message:", error.message);
        setError(error.message || "Thanh toán thất bại! Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowQR(false);
    setError(null);
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setError(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {!showQR && !paymentSuccess ? (
          <>
            <h2>Premium Package</h2>

            <div className="payment-info">
              <div className="payment-row">
                <span>Payment details: 1M$ /1 month</span>
              </div>
              <div className="payment-row">
                <span>Total: 1M$</span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

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
              <button className="cancel-btn" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button className="continue-btn" onClick={handleContinue} disabled={loading}>
                {loading ? "Processing..." : "Continue"}
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

            {error && <div className="error-message">{error}</div>}

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
                <p>Total: 1M$</p>
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

export default PaymentModal;