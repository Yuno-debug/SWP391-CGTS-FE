import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./ConsultationResponse.css";
import { AuthContext } from "../../Component/LoginPage/AuthContext";
import Navbar from "../HomePage/NavBar/NavBar";
import Footer from "../HomePage/Footer/Footer";

const ConsultationResponse = ({ isLoggedIn }) => {
  const { userId } = useContext(AuthContext);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchConsultationResponses = async () => {
      setLoading(true);
      setError(null);

      console.log("Fetching consultation responses...");
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        setError("No authorization token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5200/api/ConsultationRequest/get-all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Consultation Response Data:", response.data);

        if (response.data.success && response.data.data && Array.isArray(response.data.data.values)) {
          console.log("Current User ID:", userId);
          const filteredResponses = response.data.data.values.filter(res => res.userId === String(userId));
          console.log("Filtered Responses:", filteredResponses);
          setResponses(filteredResponses);
        } else {
          setError("Invalid API response format.");
        }
      } catch (err) {
        console.error("Error fetching consultation responses:", err);
        if (err.response && err.response.status === 401) {
          setError("Invalid or expired token. Please log in again.");
          localStorage.removeItem("token");
        } else {
          setError("Failed to load consultation responses.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConsultationResponses();
  }, [userId]);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="consultation-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <h2 className="consultation-title">Consultation Responses</h2>
            <p className="consultation-subtitle">Here are the responses to your consultation requests.</p>

            {responses.length === 0 ? (
              <div className="no-responses">No responses available.</div>
            ) : (
              <table className="response-table">
                <thead>
                  <tr>
                    <th>Consultation ID</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Urgency</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response) => (
                    <tr key={response.id}>
                      <td>{response.requestId}</td>
                      <td>{response.description}</td>
                      <td>{response.status}</td>
                      <td>{response.urgency}</td>
                      <td>{response.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ConsultationResponse;
