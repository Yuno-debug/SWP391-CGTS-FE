import React, { useState } from "react";
import "./PaymentModal.css";

const PaymentModal = ({ isOpen, onClose, packageInfo }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("vnpay");
  const [showQR, setShowQR] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen || !packageInfo) return null;

  const paymentMethods = {
    vnpay: {
      name: "VNPay",
      icon: "https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg",
    },
    momo: {
      name: "Momo",
      icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
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
            <h2>{packageInfo.packageName} Package</h2>
            <div className="payment-info">
              <p>Giá: {packageInfo.price} VND</p>
              <p>Thời gian: {packageInfo.durationMonths} tháng</p>
            </div>
            <div className="payment-method">
              <span>Chọn phương thức thanh toán:</span>
              <div className="payment-select" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div className="selected-method">
                  <img src={paymentMethods[selectedMethod].icon} alt={paymentMethods[selectedMethod].name} width="24" height="24" />
                  <span>{paymentMethods[selectedMethod].name}</span>
                </div>
                <span className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`}>▾</span>
              </div>
              {isDropdownOpen && (
                <div className="payment-dropdown">
                  {Object.entries(paymentMethods).map(([key, method]) => (
                    <div key={key} className={`payment-option ${selectedMethod === key ? "selected" : ""}`} onClick={() => handleMethodSelect(key)}>
                      <img src={method.icon} alt={method.name} width="24" height="24" />
                      <span>{method.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={onClose}>Hủy</button>
              <button className="continue-btn" onClick={handleContinue}>Tiếp tục</button>
            </div>
          </>
        ) : showQR && !paymentSuccess ? (
          <div className="qr-screen">
            <h2>Quét mã để thanh toán</h2>
            <img src="https://tiencuatoi.vn/wp-content/uploads/2019/07/t%E1%BA%A3i-xu%E1%BB%91ng.png" alt="QR Code" className="qr-code" />
            <div className="modal-buttons">
              <button className="back-btn" onClick={handleBack}>Quay lại</button>
              <button className="confirm-btn" onClick={handlePaymentSuccess}>Xác nhận thanh toán</button>
            </div>
          </div>
        ) : (
          <div className="payment-success">
            <h2>Thanh toán thành công</h2>
            <p>Bạn đã thanh toán {packageInfo.price} VND qua {paymentMethods[selectedMethod].name}.</p>
            <button className="close-btn" onClick={onClose}>Đóng</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
