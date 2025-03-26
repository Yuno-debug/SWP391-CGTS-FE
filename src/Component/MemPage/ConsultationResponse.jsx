import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./ConsultationResponse.css";
import { AuthContext } from "../../Component/LoginPage/AuthContext";

const ConsultationResponse = () => {
  const { userId } = useContext(AuthContext); // Lấy userId từ AuthContext
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
        const response = await axios.get("http://localhost:5200/api/ConsultationResponse/get-all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Consultation Response Data:", response.data);

        if (Array.isArray(response.data)) {
          console.log("Current User ID:", userId);
          const filteredResponses = response.data.filter(res => res.userId === userId);
          console.log("Filtered Responses:", filteredResponses);
          setResponses(filteredResponses);
        } else {
          setError("Invalid API response format.");
        }
      } catch (err) {
        console.error("Error fetching consultation responses:", err);
        setError("Failed to load consultation responses.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultationResponses();
  }, [userId]);

  useEffect(() => {
    console.log("showAddModal state:", showAddModal);
  }, [showAddModal]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="consultation-container">
      <h2 className="consultation-title">Consultation Responses</h2>
      <p className="consultation-subtitle">Here are the responses to your consultation requests.</p>

      <button
        className="open-modal-btn"
        onClick={() => {
          console.log("Open Modal button clicked");
          setShowAddModal(true);
        }}
      >
        Open Modal
      </button>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">My Modal</h2>
            <button
              className="close-modal-btn"
              onClick={() => {
                console.log("Close Modal button clicked");
                setShowAddModal(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {responses.length === 0 ? (
        <div className="no-responses">No responses available.</div>
      ) : (
        <table className="response-table">
          <thead>
            <tr>
              <th>Consultation ID</th>
              <th>Doctor Name</th>
              <th>Response</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <tr key={response.consultationResponseId}>
                <td>{response.consultationId}</td>
                <td>{response.doctorName || "Unknown"}</td>
                <td>{response.responseText}</td>
                <td>
                  {response.responseDate
                    ? new Date(response.responseDate).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ConsultationResponse;