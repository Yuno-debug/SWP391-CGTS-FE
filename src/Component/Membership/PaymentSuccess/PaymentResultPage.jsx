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
      const userId = localStorage.getItem("userId"); // Get userId from localStorage
      if (!userId) {
        console.error("UserId not found in LocalStorage!");
        navigate("/");
        return;
      }

      // 1. Get list of user memberships
      const userMembershipRes = await axios.get("/api/UserMembership/get-all");
      const userMemberships = userMembershipRes.data.data.$values; // Get $values array

      // 2. Find membership by userId
      const userMembership = userMemberships.find(um => um.userId === parseInt(userId));
      if (!userMembership) {
        console.error("No membership found for userId:", userId);
        navigate("/");
        return;
      }
      const membershipId = userMembership.membershipid;
      console.log("MembershipId:", membershipId);

      // 3. Get payment by membershipId
      const paymentRes = await axios.get(`/api/Payment/${membershipId}`);
      console.log("Payment API result:", paymentRes.data); // Check to ensure correct data

      const paymentIdFromAPI = paymentRes.data?.paymentId; // Get correct paymentId
      console.log("Retrieved Payment ID:", paymentIdFromAPI);

      if (!paymentIdFromAPI) {
        console.error("Could not retrieve paymentId from API!");
        return;
      }

      // 4. Call API to update payment
      await axios.put(`/api/Payment/update/${paymentIdFromAPI}`);
      console.log("Payment updated successfully!");

    } catch (error) {
      console.error("Error updating payment:", error);
    }

    navigate("/"); // Navigate to home page
  };

  const handleFailedPayment = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("UserId not found in LocalStorage!");
        navigate("/");
        return;
      }

      // 1. Get user membership
      const userMembershipRes = await axios.get("/api/UserMembership/get-all");
      const userMemberships = userMembershipRes.data.data.$values;
      const userMembership = userMemberships.find(um => um.userId === parseInt(userId));
      
      if (!userMembership) {
        console.error("No membership found for userId:", userId);
        navigate("/");
        return;
      }
      
      const membershipId = userMembership.membershipid;

      // 2. Get payment
      const paymentRes = await axios.get(`/api/Payment/${membershipId}`);
      const paymentId = paymentRes.data?.paymentId;

      if (!paymentId) {
        console.error("Could not retrieve paymentId from API!");
        navigate("/");
        return;
      }

      // 3. Delete payment
      await axios.delete(`/api/Payment/delete/${paymentId}`);
      console.log("Payment deleted successfully");

      // 4. Delete membership
      await axios.delete(`/api/UserMembership/delete/${membershipId}`);
      console.log("Membership deleted successfully");

    } catch (error) {
      console.error("Error handling failed payment:", error);
    }
    
    navigate("/"); // Always navigate to home, even if there's an error
  };

  return (
    <div className="payment-result-container">
      {status === "success" ? (
        <div className="payment-success">
          <h1>🎉 Payment Successful!</h1>
          <p>Amount: {amount.toLocaleString()} VND</p>
          <button className="btn-back-home" onClick={handleGoHome}>
            Back to Home
          </button>
        </div>
      ) : (
        <div className="payment-failed">
          <h1>❌ Payment Failed!</h1>
          <p>Please try again later.</p>
          <button className="btn-back-home" onClick={handleFailedPayment}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentResultPage;