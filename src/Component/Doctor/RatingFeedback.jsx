import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Component/LoginPage/AuthContext";
import "./RatingFeedback.css";

const RatingFeedback = () => {
  const { token: contextToken } = useContext(AuthContext);
  const [token, setToken] = useState(contextToken || localStorage.getItem("token"));
  const [feedbacks, setFeedbacks] = useState([]);
  const [doctors, setDoctors] = useState({}); // Store doctor names by doctorId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        // Fetch doctor names for each feedback
        const doctorIds = [...new Set(feedbackData.map(f => f.doctorId).filter(id => id))]; // Get unique doctor IDs
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="rating-feedback-container">
      <h2>Rating Feedback</h2>
      <table className="feedback-table">
        <thead>
          <tr>
            <th>Feedback Date</th>
            <th>Doctor Name</th> {/* Changed from Doctor ID to Doctor Name */}
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
                <td>{feedback.doctorId ? doctors[feedback.doctorId] || "Loading..." : "N/A"}</td> {/* Display doctor name */}
                <td>{feedback.rating}</td>
                <td>{feedback.comment || "N/A"}</td>
                <td>{feedback.feedbackType || "N/A"}</td>
                <td>{feedback.feedbackId}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No feedback available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RatingFeedback;