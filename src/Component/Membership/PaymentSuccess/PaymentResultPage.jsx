import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Membership/PaymentSuccess/PaymentSuccess.css";

const PaymentResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const amountParam = searchParams.get("vnp_Amount");
    const statusParam = searchParams.get("vnp_ResponseCode") === "00" ? "success" : "failed";

    setAmount(Number(amountParam) / 100);
    setStatus(statusParam);
  }, [location.search]);

  const handleGoHome = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
      if (!userId) {
        console.error("Không tìm thấy userId trong LocalStorage!");
        navigate("/");
        return;
      }
  
      // 1. Lấy danh sách userMembership
      const userMembershipRes = await axios.get("/api/UserMembership/get-all");
      const userMemberships = userMembershipRes.data.data.$values; // Lấy mảng $values
  
      // 2. Tìm membership theo userId
      const userMembership = userMemberships.find(um => um.userId === parseInt(userId));
      if (!userMembership) {
        console.error("Không tìm thấy membership cho userId:", userId);
        navigate("/");
        return;
      }
      const membershipId = userMembership.membershipid;
      console.log("MembershipId:", membershipId);
  
      // 3. Lấy payment theo membershipId
      const paymentRes = await axios.get(`/api/Payment/${membershipId}`);
      console.log("Kết quả payment API:", paymentRes.data); // Kiểm tra để chắc chắn đúng dữ liệu
  
      const paymentIdFromAPI = paymentRes.data?.paymentId; // Lấy paymentId đúng
      console.log("Payment ID lấy được:", paymentIdFromAPI);
  
      if (!paymentIdFromAPI) {
        console.error("Không lấy được paymentId từ API!");
        return;
      }
  
      // 4. Gọi API cập nhật payment
      await axios.put(`/api/Payment/update/${paymentIdFromAPI}`);
      console.log("Cập nhật thanh toán thành công!");
  
    } catch (error) {
      console.error("Lỗi khi cập nhật thanh toán:", error);
    }
  
    navigate("/"); // Điều hướng về trang chủ
  };
  
  
  

  return (
    <div className="payment-result-container">
      {status === "success" ? (
        <div className="payment-success">
          <h1>🎉 Thanh toán thành công!</h1>
          <p>Số tiền: {amount.toLocaleString()} VNĐ</p>
          <button className="btn-back-home" onClick={handleGoHome}>
            Về trang chủ
          </button>
        </div>
      ) : (
        <div className="payment-failed">
          <h1>❌ Thanh toán thất bại!</h1>
          <p>Vui lòng thử lại sau.</p>
          <button className="btn-back-home" onClick={handleGoHome}>
            Về trang chủ
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentResultPage;
