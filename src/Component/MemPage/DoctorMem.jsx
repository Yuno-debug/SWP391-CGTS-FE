import React, { useState, useEffect } from "react";
import Navbar from "../HomePage/NavBar/NavBar";  
import Footer from "../HomePage/Footer/Footer";  
import "./DoctorMem.css";

const DoctorMem = () => {
  const [doctors, setDoctors] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFeedback, setNewFeedback] = useState({ licenseNumber: "", rating: 5, comment: "" });

  // Fetch Doctors
  useEffect(() => {
    fetch("/api/Doctor")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch doctors");
        return res.json();
      })
      .then((data) => {
        setDoctors(data?.$values || []);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Fetch Feedbacks
  useEffect(() => {
    fetch("/api/RatingFeedback")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch feedback");
        return res.json();
      })
      .then((data) => setFeedbacks(data?.$values || []))
      .catch((error) => console.error("Error fetching feedback:", error));
  }, []);

  // Tính điểm trung bình sao của bác sĩ
  const getDoctorRating = (licenseNumber) => {
    const doctorFeedbacks = feedbacks.filter(fb => fb.licenseNumber === licenseNumber);
    if (doctorFeedbacks.length === 0) return 0;

    const totalStars = doctorFeedbacks.reduce((sum, fb) => sum + fb.rating, 0);
    return (totalStars / doctorFeedbacks.length).toFixed(1);
  };

  // Xử lý người dùng nhập đánh giá
  const handleFeedbackChange = (e) => {
    setNewFeedback({ ...newFeedback, [e.target.name]: e.target.value });
  };

  // Gửi đánh giá lên API
  const handleSubmitFeedback = (licenseNumber) => {
    if (!newFeedback.comment.trim()) {
      alert("Please enter a comment!");
      return;
    }

    const feedbackToSend = {
      licenseNumber,
      rating: parseInt(newFeedback.rating),
      comment: newFeedback.comment,
      user: "Anonymous" // Hoặc có thể lấy từ tài khoản đăng nhập
    };

    fetch("/api/RatingFeedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedbackToSend)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit feedback");
        return res.json();
      })
      .then((data) => {
        setFeedbacks([...feedbacks, data]); // Cập nhật danh sách đánh giá
        setNewFeedback({ licenseNumber: "", rating: 5, comment: "" }); // Reset form
      })
      .catch((error) => console.error("Error submitting feedback:", error));
  };

  if (loading) return <div className="loading">Loading doctors...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <Navbar />  
      <div className="doctor-mem-container">
        <h1>Our Doctors</h1>
        <div className="doctor-list">
          {doctors.length > 0 ? (
            doctors.map((doctor) => {
              const rating = getDoctorRating(doctor.licenseNumber);
              return (
                <div key={doctor.licenseNumber} className="doctor-card">
                  <img 
                    src={`/images/doctors/${doctor.licenseNumber}.jpg`} 
                    alt={doctor.name} 
                    className="doctor-image" 
                    onError={(e) => e.target.src = "/default-doctor.jpg"} 
                  />
                  <h2>{doctor.name}</h2>
                  <div className="doctor-info">
                    <p><strong>Specialization:</strong> {doctor.specialization}</p>
                    <p><strong>Email:</strong> {doctor.email}</p>
                    <p><strong>Phone:</strong> {doctor.phoneNumber}</p>
                    <p><strong>Degree:</strong> {doctor.degree}</p>
                    <p><strong>Hospital:</strong> {doctor.hospital}</p>
                    <p><strong>License Number:</strong> {doctor.licenseNumber}</p>
                    <p><strong>Biography:</strong> {doctor.biography}</p>
                    <p><strong>Rating:</strong> ⭐ {rating} / 5</p>
                  </div>
                  
                  {/* Hiển thị feedback */}
                  <div className="feedback-section">
                    <h3>Feedback</h3>
                    {feedbacks.filter(fb => fb.licenseNumber === doctor.licenseNumber).length > 0 ? (
                      feedbacks
                        .filter(fb => fb.licenseNumber === doctor.licenseNumber)
                        .map((fb, index) => (
                          <div key={index} className="feedback">
                            <p><strong>{fb.user}:</strong> ⭐ {fb.rating} - {fb.comment}</p>
                          </div>
                        ))
                    ) : (
                      <p>No feedback available.</p>
                    )}
                  </div>

                  {/* Form đánh giá */}
                  <div className="feedback-form">
                    <h3>Leave a Review</h3>
                    <select name="rating" value={newFeedback.rating} onChange={handleFeedbackChange}>
                      <option value="5">⭐⭐⭐⭐⭐</option>
                      <option value="4">⭐⭐⭐⭐</option>
                      <option value="3">⭐⭐⭐</option>
                      <option value="2">⭐⭐</option>
                      <option value="1">⭐</option>
                    </select>
                    <textarea
                      name="comment"
                      placeholder="Write your feedback..."
                      value={newFeedback.comment}
                      onChange={handleFeedbackChange}
                    />
                    <button onClick={() => handleSubmitFeedback(doctor.licenseNumber)}>Submit</button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No doctors found.</p>
          )}
        </div>
      </div>
      <Footer />  
    </>
  );
};

export default DoctorMem;
