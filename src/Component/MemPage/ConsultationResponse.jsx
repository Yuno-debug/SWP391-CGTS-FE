import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./ConsultationResponse.css";
import { AuthContext } from "../../Component/LoginPage/AuthContext";
import Navbar from "../HomePage/NavBar/NavBar";
import Footer from "../HomePage/Footer/Footer";

const ConsultationResponse = ({ isLoggedIn }) => {
  const { userId } = useContext(AuthContext);
  const [responses, setResponses] = useState([]);
  const [consultationResponses, setConsultationResponses] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    childId: "",
    description: "",
    status: "Pending",
    urgency: "Normal",
    attachments: "",
    category: "",
  });

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await axios.get(`http://localhost:5200/api/Child/by-user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setChildren(response.data?.data?.$values || []);
      } catch (error) {
        console.error("❌ Error fetching children:", error);
      }
    };

    if (userId) {
      fetchChildren();
    }
  }, [userId]);

  useEffect(() => {
    const fetchConsultationRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:5200/api/ConsultationRequest/get-all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const storedUserId = Number(localStorage.getItem("userId"));

        const userRequests = response.data.data.$values.filter(req =>
          req.userId === storedUserId || 
          (req.userId === null && req.childId && children.some(child => child.childId === req.childId))
        );

        setResponses(userRequests);
      } catch (err) {
        console.error("❌ Error fetching consultation requests:", err);
        setError("Failed to load consultation requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultationRequests();
  }, [userId, children]);

  useEffect(() => {
    const fetchConsultationResponses = async () => {
      if (responses.length === 0) return; 

      try {
        const response = await axios.get("http://localhost:5200/api/ConsultationResponse/get-all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data?.success && response.data?.data?.$values) {
          setConsultationResponses(response.data.data.$values);
        } else {
          setError("Invalid ConsultationResponse API format.");
        }
      } catch (error) {
        console.error("❌ Error fetching consultation responses:", error);
        setError("Failed to load consultation responses.");
      }
    };

    fetchConsultationResponses();
  }, [responses]); 

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="consultation-container">
        <div className="consultation-form">
          <h3>Create Consultation Request</h3>
          <form>
            <label>
              Child:
              <select name="childId" value={formData.childId} required>
                <option value="">-- Select a child --</option>
                {children.map((child) => (
                  <option key={child.childId} value={child.childId}>
                    {child.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Description:
              <textarea name="description" value={formData.description} required />
            </label>
            <label>
              Urgency:
              <select name="urgency" value={formData.urgency}>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </label>
            <label>
              Category:
              <input type="text" name="category" value={formData.category} required />
            </label>
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>

        <h2 className="consultation-title">Consultation Responses</h2>
        <p className="consultation-subtitle">Here are the responses to your consultation requests.</p>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : responses.length === 0 ? (
          <div className="no-responses">No consultation requests found.</div>
        ) : (
          <table className="response-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Description</th>
                <th>Status</th>
                <th>Urgency</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((request) => {
                const relatedResponses = consultationResponses.filter((res) => res.requestId === request.requestId);

                return (
                  <tr key={request.requestId}>
                    <td>{request.requestId}</td>
                    <td>{request.description}</td>
                    <td className={`status-${request.status.toLowerCase()}`}>{request.status}</td>
                    <td>{request.urgency}</td>
                    <td>{request.category}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ConsultationResponse;
