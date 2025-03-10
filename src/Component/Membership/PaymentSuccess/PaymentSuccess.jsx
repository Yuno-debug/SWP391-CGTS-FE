import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_PAYMENT_UPDATE_URL = import.meta.env.VITE_API_PAYMENT_URL || "http://localhost:5200/api/Payment/update"; // ✅ Dùng chung URL như bạn đã dùng

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Đang xử lý thanh toán...");
  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    const updatePayment = async () => {
      try {
        if (paymentId) {
          console.log("👉 Gọi API cập nhật thanh toán với ID:", paymentId);
          const response = await axios.put(`${API_PAYMENT_UPDATE_URL}/${paymentId}`);
          console.log("✅ Cập nhật thành công:", response.data);
          setMessage("Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.");
        } else {
          setMessage("Không tìm thấy mã thanh toán hợp lệ.");
        }
      } catch (error) {
        console.error("❌ Lỗi khi cập nhật thanh toán:", error);
        setMessage("Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng liên hệ hỗ trợ.");
      }
    };

    updatePayment();
  }, [paymentId]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>{message}</h2>
    </div>
  );
};

export default PaymentSuccess;
