import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Component/LoginPage/AuthContext";
import "./RatingFeedback.css";

const RatingFeedback = () => {
  const { token, doctorId } = useContext(AuthContext); // Lấy doctorId từ AuthContext
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ rating: "", comment: "" });
  const [editFeedback, setEditFeedback] = useState(null);
  const [editedFeedback, setEditedFeedback] = useState({ id: "", rating: "", comment: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch feedback chỉ của bác sĩ hiện tại
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`http://localhost:5200/api/RatingFeedback/doctor/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(response.data.$values || response.data);
      } catch (err) {
        setError("Failed to fetch feedbacks: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchFeedbacks();
  }, [token, doctorId]);

  // Handle thêm feedback
  const handleAddFeedback = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5200/api/RatingFeedback",
        { rating: newFeedback.rating, comment: newFeedback.comment, doctorId },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setFeedbacks([...feedbacks, response.data]);
      setNewFeedback({ rating: "", comment: "" });
    } catch (err) {
      setError("Failed to add feedback: " + err.message);
    }
  };

  // Handle chỉnh sửa feedback
  const handleEdit = (feedback) => {
    setEditFeedback(feedback.id);
    setEditedFeedback({ id: feedback.id, rating: feedback.rating, comment: feedback.comment });
  };

  const handleUpdateFeedback = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5200/api/RatingFeedback/${editedFeedback.id}`,
        { rating: editedFeedback.rating, comment: editedFeedback.comment },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setFeedbacks(feedbacks.map((fb) => (fb.id === editedFeedback.id ? response.data : fb)));
      setEditFeedback(null);
      setEditedFeedback({ id: "", rating: "", comment: "" });
    } catch (err) {
      setError("Failed to update feedback: " + err.message);
    }
  };

  // Handle xóa feedback
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`http://localhost:5200/api/RatingFeedback/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(feedbacks.filter((fb) => fb.id !== id));
      } catch (err) {
        setError("Failed to delete feedback: " + err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="rating-feedback-container">
      <h2>Rating Feedback</h2>
      <form onSubmit={handleAddFeedback} className="feedback-form">
        <input
          type="number"
          value={newFeedback.rating}
          onChange={(e) => setNewFeedback({ ...newFeedback, rating: e.target.value })}
          placeholder="Rating (1-5)"
          min="1"
          max="5"
          required
        />
        <input
          type="text"
          value={newFeedback.comment}
          onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
          placeholder="Comment"
          required
        />
        <button type="submit">Add Feedback</button>
      </form>

      <table className="feedback-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <tr key={feedback.id}>
              <td>{feedback.id}</td>
              <td>
                {editFeedback === feedback.id ? (
                  <input
                    type="number"
                    value={editedFeedback.rating}
                    onChange={(e) => setEditedFeedback({ ...editedFeedback, rating: e.target.value })}
                    min="1"
                    max="5"
                  />
                ) : (
                  feedback.rating
                )}
              </td>
              <td>
                {editFeedback === feedback.id ? (
                  <input
                    type="text"
                    value={editedFeedback.comment}
                    onChange={(e) => setEditedFeedback({ ...editedFeedback, comment: e.target.value })}
                  />
                ) : (
                  feedback.comment
                )}
              </td>
              <td>
                {editFeedback === feedback.id ? (
                  <button onClick={handleUpdateFeedback}>Save</button>
                ) : (
                  <button onClick={() => handleEdit(feedback)}>Edit</button>
                )}
                <button onClick={() => handleDelete(feedback.id)} style={{ marginLeft: "10px" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RatingFeedback;
