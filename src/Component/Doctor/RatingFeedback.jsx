import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Component/LoginPage/AuthContext";
import "./RatingFeedback.css";

const RatingFeedback = () => {
  const { token: contextToken } = useContext(AuthContext);
  const [token, setToken] = useState(contextToken || localStorage.getItem("token"));
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackTypeFilter, setFeedbackTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("feedbackDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5200/api/RatingFeedback", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let feedbackData = [];
        if (response.data.$values && Array.isArray(response.data.$values)) {
          feedbackData = response.data.$values;
        } else if (response.data.feedbackId) {
          feedbackData = [response.data];
        } else if (Array.isArray(response.data)) {
          feedbackData = response.data;
        } else {
          feedbackData = [];
        }

        feedbackData.sort((a, b) => new Date(b.feedbackDate) - new Date(a.feedbackDate));
        setFeedbacks(feedbackData);
        setFilteredFeedbacks(feedbackData);
      } catch (err) {
        setError(`Failed to fetch feedbacks: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [token]);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!token || feedbacks.length === 0) return;

      const doctorIds = [...new Set(feedbacks.map(f => f.doctorId).filter(id => id))];
      const doctorPromises = doctorIds.map(async (doctorId) => {
        try {
          const response = await axios.get(`http://localhost:5200/api/Doctor/${doctorId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return { doctorId, name: response.data.name || "Unknown Doctor" };
        } catch (err) {
          return { doctorId, name: "Unknown Doctor" };
        }
      });

      const doctorResults = await Promise.all(doctorPromises);
      const doctorMap = doctorResults.reduce((acc, { doctorId, name }) => {
        acc[doctorId] = name;
        return acc;
      }, {});

      setDoctors(doctorMap);
    };

    fetchDoctors();
  }, [feedbacks, token]);

  useEffect(() => {
    let filtered = [...feedbacks];

    if (feedbackTypeFilter !== "All") {
      filtered = filtered.filter(f => f.feedbackType === feedbackTypeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(feedback =>
        (doctors[feedback.doctorId]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.rating?.toString().includes(searchTerm) ||
        new Date(feedback.feedbackDate).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    filtered.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];

      if (sortField === "feedbackDate") {
        fieldA = new Date(a.feedbackDate);
        fieldB = new Date(b.feedbackDate);
        return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      if (sortField === "doctorId") {
        fieldA = doctors[a.doctorId] || "N/A";
        fieldB = doctors[b.doctorId] || "N/A";
        return sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
      }
      if (typeof fieldA === "string") {
        return sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
      }
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    });

    setFilteredFeedbacks(filtered);
    setCurrentPage(1);
  }, [feedbackTypeFilter, searchTerm, sortField, sortOrder, feedbacks, doctors]);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);
  const totalPages = Math.ceil(filteredFeedbacks.length / feedbacksPerPage);

  if (loading) return <div className="rating-feedback-loading">Loading...</div>;
  if (error) return <div className="rating-feedback-error">{error}</div>;

  return (
    <div className="rating-feedback-container">
      <header className="page-header">
        <div className="header-left">
          <h2>Rating Feedback</h2>
          <p>Track and monitor the feedback and ratings from users over time.</p>
        </div>
        <div className="header-right">
          <button className="refresh-button" onClick={handleRefresh}>
            Refresh
          </button>
        </div>
      </header>

      <div className="rating-feedback-content">
        <table className="rating-feedback-table">
          <thead>
            <tr>
              <th>Feedback Date</th>
              <th>Doctor Name</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {currentFeedbacks.length > 0 ? (
              currentFeedbacks.map((feedback) => (
                <tr key={feedback.feedbackId}>
                  <td>{new Date(feedback.feedbackDate).toLocaleString()}</td>
                  <td>{feedback.doctorId ? (doctors[feedback.doctorId] || "Fetching...") : "N/A"}</td>
                  <td>{feedback.rating}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="rating-feedback-no-data">
                  No feedback available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <span className="pagination-info">
            Showing {indexOfFirstFeedback + 1} to {Math.min(indexOfLastFeedback, filteredFeedbacks.length)} of {filteredFeedbacks.length} entries
          </span>
          <div className="pagination-buttons">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={currentPage === 1 ? "disabled" : ""}
            >
              Previous
            </button>
            <span className="current-page">{currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "disabled" : ""}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingFeedback;