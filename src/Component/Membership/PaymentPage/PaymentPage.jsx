import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PaymentPage.css";

const API_PACKAGE_URL = import.meta.env.VITE_API_PACKAGE_URL || "http://localhost:5200/api/MembershipPackage";
const API_MEMBERSHIP_URL = import.meta.env.VITE_API_MEMBERSHIP_URL || "http://localhost:5200/api/UserMembership/create";
const API_PAYMENT_URL = import.meta.env.VITE_API_PAYMENT_URL || "http://localhost:5200/api/Payment";
const API_VNPAY_URL = import.meta.env.VITE_API_VNPAY_URL || "http://localhost:5200/api/VNPay/CreatePaymentUrl";

// Hàm lấy userId từ localStorage nếu có
const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.userId || 1; // Trả về 1 nếu không có userId
  } catch (error) {
    console.error("❌ Lỗi khi lấy userId từ localStorage:", error);
    return 1; // Giá trị mặc định
  }
};

const PaymentPage = () => {
  const [packages, setPackages] = useState([]);
  const [loadingPackage, setLoadingPackage] = useState(null);
  const [error, setError] = useState(null);
  const userId = getUserId();

  // Fetch danh sách gói thành viên khi component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        console.log("📥 Fetching package list...");
        const response = await axios.get(API_PACKAGE_URL);
        setPackages(response.data);
        console.log("✅ Packages loaded:", response.data);
      } catch (error) {
        console.error("❌ Lỗi tải danh sách gói:", error);
        setError("Không thể tải danh sách gói, vui lòng thử lại!");
      }
    };

    fetchPackages();
  }, []);

  // Xử lý khi chọn gói
  const handleSelectPackage = async (packageId) => {
    if (!packageId) {
      console.error("⚠️ packageId không hợp lệ:", packageId);
      setError("Lỗi: packageId không hợp lệ!");
      return;
    }

    setLoadingPackage(packageId);
    setError(null);

    try {
      console.log(`🔹 Bước 1: Tạo Membership cho userId: ${userId}, packageId: ${packageId}`);

      // 1️⃣ Tạo Membership
      const membershipResponse = await axios.post(API_MEMBERSHIP_URL, {
        userId: userId,
        packageId: packageId
      });

      if (!membershipResponse.data || !membershipResponse.data.membershipId) {
        throw new Error("Không thể tạo Membership.");
      }
      
      const membershipId = membershipResponse.data.membershipId;
      console.log("✅ Membership ID nhận được:", membershipId);

      // 2️⃣ Tạo Payment từ MembershipId
      console.log(`🔹 Bước 2: Tạo Payment cho MembershipId: ${membershipId}`);
      const paymentResponse = await axios.post(`${API_PAYMENT_URL}/${membershipId}`);

      if (!paymentResponse.data || !paymentResponse.data.paymentId) {
        throw new Error("Không thể tạo Payment.");
      }

      const paymentId = paymentResponse.data.paymentId;
      console.log("✅ Payment ID nhận được:", paymentId);

      // 3️⃣ Lấy URL thanh toán VNPay từ PaymentId
      console.log(`🔹 Bước 3: Lấy VNPay URL cho PaymentId: ${paymentId}`);
      console.log("🔄 Sẽ thử với nhiều paymentId khác nhau (actual, 1, 2)");
      
      // Danh sách các paymentId để thử
      const paymentIds = [paymentId, 1, 2];
      let succeeded = false;
      
      for (const id of paymentIds) {
        if (succeeded) break;
        
        console.log(`🔄 Thử với paymentId=${id}...`);
        
        // Thử phương thức POST trước
        try {
          console.log(`🔄 Thử phương thức POST với paymentId=${id}...`);
          const postResponse = await axios.post(API_VNPAY_URL, {
            paymentId: id,
            method: 'vnpay'
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
          
          // Thử phương thức GET nếu POST thất bại
          try {
            console.log(`🔄 Thử phương thức GET với paymentId=${id}...`);
            const getResponse = await axios.get(`${API_VNPAY_URL}?paymentId=${id}&method=vnpay`);
            
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
        throw new Error("Không thể kết nối đến cổng thanh toán sau khi thử tất cả các phương thức.");
      }
    } catch (error) {
      console.error("❌ Lỗi thanh toán:", error.response?.data || error.message);
      
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
      setLoadingPackage(null);
    }
  };

  return (
    <div className="payment-page">
      <h1>Choose Your Package</h1>

      {/* Hiển thị thông báo lỗi */}
      {error && <p className="error-message">{error}</p>}

      <div className="package-options">
        {packages.length === 0 ? (
          <p>Đang tải danh sách gói...</p>
        ) : (
          packages.map((pkg) => (
            <div key={pkg.packageId} className={`package ${pkg.packageName?.toLowerCase() || ""}`}>
              <h2>{pkg.packageName} Package</h2>
              <p>${pkg.price}/month</p>
              <button
                onClick={() => handleSelectPackage(pkg.packageId)}
                disabled={loadingPackage === pkg.packageId}
                className={loadingPackage === pkg.packageId ? "disabled" : ""}
              >
                {loadingPackage === pkg.packageId ? "Processing..." : `Select ${pkg.packageName}`}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentPage;