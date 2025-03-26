import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Component/LoginPage/AuthContext";
import "./RatingFeedback.css";

const RatingFeedback = () => {
  const { token: contextToken } = useContext(AuthContext);
  const [token, setToken] = useState(contextToken || localStorage.getItem("token"));
  const [feedbacks, setFeedbacks] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = {
    username: "Dr. John Doe",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!token) {
        console.log("Token is missing:", token);
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching feedbacks with token:", token);
        const response = await axios.get("http://localhost:5200/api/RatingFeedback", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response (Raw):", response.data);

        let feedbackData = [];
        if (response.data.$values && Array.isArray(response.data.$values)) {
          feedbackData = response.data.$values;
        } else if (response.data.feedbackId) {
          feedbackData = [response.data];
        } else if (Array.isArray(response.data)) {
          feedbackData = response.data;
        } else {
          console.warn("No valid feedback data structure found");
          feedbackData = [];
        }

        feedbackData.sort((a, b) => new Date(b.feedbackDate) - new Date(a.feedbackDate));
        setFeedbacks(feedbackData);

        const doctorIds = [...new Set(feedbackData.map(f => f.doctorId).filter(id => id))];
        const doctorPromises = doctorIds.map(async (doctorId) => {
          try {
            const doctorResponse = await axios.get(`http://localhost:5200/api/Doctor/${doctorId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return { doctorId, name: doctorResponse.data.name || "Unknown Doctor" };
          } catch (err) {
            console.error(`Failed to fetch doctor ${doctorId}:`, err.message);
            return { doctorId, name: "Unknown Doctor" };
          }
        });

        const doctorResults = await Promise.all(doctorPromises);
        const doctorMap = doctorResults.reduce((acc, { doctorId, name }) => {
          acc[doctorId] = name;
          return acc;
        }, {});
        setDoctors(doctorMap);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err.response?.data?.message || err.message);
        setError(`Failed to fetch feedbacks: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [token]);

  if (loading) return <div className="rating-feedback-loading">Loading...</div>;
  if (error) return <div className="rating-feedback-error">{error}</div>;

  return (
    <>
      {/* Navbar Section */}
      <nav className="rating-feedback-navbar">
        <div className="navbar-left-section">
          <button className="navbar-menu-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="navbar-brand-section">
            <h1>Child Growth Tracking System</h1>
          </div>
        </div>
        <div className="navbar-right-section">
          <div className="navbar-user-info">
            <span className="navbar-user-name">{user.username}</span>
            <button className="navbar-logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <button className="navbar-icon-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </button>
          <button className="navbar-icon-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 0 0-10 10c0 2.5 1 4.8 2.6 6.6L2 22l3.4-2.6A9.9 9.9 0 0 0 12 22a10 10 0 0 0 0-20z" />
            </svg>
          </button>
        </div>
      </nav>

      <div className="rating-feedback-content">
        <h2>Rating Feedback</h2>
        <table className="rating-feedback-table">
          <thead>
            <tr>
              <th>Feedback Date</th>
              <th>Doctor Name</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Type</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <tr key={feedback.feedbackId}>
                  <td>{new Date(feedback.feedbackDate).toLocaleString()}</td>
                  <td>{feedback.doctorId ? doctors[feedback.doctorId] || "Loading..." : "N/A"}</td>
                  <td>{feedback.rating}</td>
                  <td>{feedback.comment || "N/A"}</td>
                  <td>{feedback.feedbackType || "N/A"}</td>
                  <td>{feedback.feedbackId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="rating-feedback-no-data">
                  No feedback available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RatingFeedback;