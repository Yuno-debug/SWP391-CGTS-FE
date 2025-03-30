import React, { useState, useEffect } from "react";
import Navbar from "../HomePage/NavBar/NavBar";  
import Footer from "../HomePage/Footer/Footer";  
import "./DoctorMem.css";

const DoctorMem = () => {
  const [doctors, setDoctors] = useState([]);
  const [feedbacks, setFeedbacks] = useState(() => {
    const savedFeedbacks = localStorage.getItem("doctorFeedbacks");
    return savedFeedbacks ? JSON.parse(savedFeedbacks) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 🔹 Trang hiện tại
  const doctorsPerPage = 3; // 🔹 Giới hạn hiển thị bác sĩ mỗi trang

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

  useEffect(() => {
    localStorage.setItem("doctorFeedbacks", JSON.stringify(feedbacks));
  }, [feedbacks]);

  const getDoctorRating = (doctorId) => {
    const doctorFeedbacks = feedbacks.filter(fb => fb.doctorId === doctorId);
    if (doctorFeedbacks.length === 0) return 0;
    const totalStars = doctorFeedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0);
    return Math.min(5, (totalStars / doctorFeedbacks.length).toFixed(1));
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctorId(e.target.value);
  };

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleSubmitFeedback = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setNotification("⚠️ Error: User not logged in");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (!selectedDoctorId) {
      setNotification("⚠️ Error: Please select a doctor");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (selectedRating === 0) {
      setNotification("⚠️ Error: Please select a rating");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const numericDoctorId = Number(selectedDoctorId);
    if (isNaN(numericDoctorId) || numericDoctorId <= 0) {
      setNotification("⚠️ Error: Invalid Doctor ID");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const feedbackToSend = {
      doctorId: numericDoctorId,
      rating: selectedRating,
      userId: parseInt(userId) || 0,
    };

    try {
      const res = await fetch("/api/RatingFeedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackToSend),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to submit feedback: ${errorText}`);
      }

      const data = await res.json();
      const newFeedbackEntry = {
        doctorId: data.dto?.doctorId ?? numericDoctorId,
        rating: data.dto?.rating ?? selectedRating,
        userId: data.dto?.userId ?? parseInt(userId),
        feedbackId: data.feedbackId,
        feedbackDate: data.feedbackDate,
      };

      setFeedbacks((prev) => [...prev, newFeedbackEntry]);

      setSelectedDoctorId("");
      setSelectedRating(0);
      setNotification("✅ Rating submitted successfully!");
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification(`❌ Failed to submit rating: ${error.message}`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const renderRatingStars = () => (
    <div className="rating-box">
      <h3>Your Rating</h3>
      <div className="star-rating-input">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${selectedRating >= star ? "full" : "empty"}`}
            onClick={() => handleStarClick(star)}
          >
            ★
          </span>
        ))}
      </div>
      <button onClick={handleSubmitFeedback} className="submit-rating-btn">
        Submit Rating
      </button>
    </div>
  );

  // 🔹 Tính toán danh sách bác sĩ trên trang hiện tại
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  // 🔹 Xử lý chuyển trang
  const nextPage = () => {
    if (currentPage < Math.ceil(doctors.length / doctorsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <div className="loading">Loading doctors...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div className="doctor-mem-container">
        <h1>Our Doctors</h1>
        {notification && <div className="notification">{notification}</div>}

        <div className="rating-section centralized">
          <h3>Rate a Doctor</h3>
          <select
            value={selectedDoctorId || ""}
            onChange={handleDoctorChange}
            className="rating-select"
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doctor) => {
              const doctorId = doctor.doctorId || doctor.licenseNumber;
              return (
                <option key={doctorId} value={doctorId}>
                  {doctor.name}
                </option>
              );
            })}
          </select>
          {renderRatingStars()}
        </div>

        <div className="doctor-list">
          {currentDoctors.map((doctor) => {
            const doctorId = doctor.doctorId || doctor.licenseNumber;
            return (
              <div key={doctorId} className="doctor-item">
                <div className="doctor-card">
                  <img 
                    src={doctor.hospital} 
                    alt={doctor.name} 
                    className="doctor-image" 
                    onError={(e) => (e.target.src = "/default-doctor.jpg")} 
                  />
                  <h2>{doctor.name}</h2>
                  <p><strong>Email:</strong> {doctor.email}</p>
                  <p><strong>Biography:</strong> {doctor.biography}</p>
                  <div className="rating-display">
                    <strong>Rating:</strong> {getDoctorRating(doctorId)} / 5 ⭐
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🔹 Nút phân trang */}
        <div className="paginationMem">
          <button onClick={prevPage} disabled={currentPage === 1}>
            ⬅️ Previous
          </button>
          <span>Page {currentPage} of {Math.ceil(doctors.length / doctorsPerPage)}</span>
          <button onClick={nextPage} disabled={currentPage >= Math.ceil(doctors.length / doctorsPerPage)}>
            Next ➡️
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DoctorMem;
