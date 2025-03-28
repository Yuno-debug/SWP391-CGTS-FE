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

  const user = {
    username: "Dr. John Doe",
  };

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

    const fetchDoctors = async () => {
      if (!token || !feedbacks.length) return;

      const doctorIds = [...new Set(feedbacks.map(f => f.doctorId).filter(id => id))];
      const doctorPromises = doctorIds.map(async (doctorId) => {
        try {
          const doctorResponse = await axios.get(`http://localhost:5200/api/Doctor/${doctorId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return { doctorId, name: doctorResponse.data.name || "Unknown Doctor" };
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

    fetchFeedbacks().then(fetchDoctors);
  }, [token]);

  useEffect(() => {
    let filtered = [...feedbacks];

    if (feedbackTypeFilter !== "All") {
      filtered = filtered.filter(f => f.feedbackType === feedbackTypeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(feedback =>
        (feedback.feedbackId?.toString().includes(searchTerm) ||
        doctors[feedback.doctorId]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.rating?.toString().includes(searchTerm) ||
        feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.feedbackType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);
  const totalPages = Math.ceil(filteredFeedbacks.length / feedbacksPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (loading) return <div className="rating-feedback-loading">Loading...</div>;
  if (error) return <div className="rating-feedback-error">{error}</div>;

  const feedbackTypes = ["All", ...new Set(feedbacks.map(f => f.feedbackType).filter(type => type))];

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
        <div className="filter-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by doctor, comment, rating..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="type-filter">
            <label htmlFor="feedback-type-filter">Filter by Type:</label>
            <select
              id="feedback-type-filter"
              value={feedbackTypeFilter}
              onChange={(e) => setFeedbackTypeFilter(e.target.value)}
              className="feedback-type-filter"
            >
              {feedbackTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
        <table className="rating-feedback-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("feedbackDate")}>
                Feedback Date {sortField === "feedbackDate" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("doctorId")}>
                Doctor Name {sortField === "doctorId" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("rating")}>
                Rating {sortField === "rating" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("comment")}>
                Comment {sortField === "comment" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("feedbackType")}>
                Type {sortField === "feedbackType" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("feedbackId")}>
                ID {sortField === "feedbackId" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentFeedbacks.length > 0 ? (
              currentFeedbacks.map((feedback) => (
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