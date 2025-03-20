import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConsultationResponseForm.css';

const ConsultationResponseForm = ({ requestId, onClose, onSuccess }) => {
  const [content, setContent] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorId, setDoctorId] = useState(null);

  // ✅ Lấy userId trực tiếp từ localStorage
  const userId = parseInt(localStorage.getItem('userId'));

  // Gọi API lấy doctorId theo userId
  useEffect(() => {
    if (!userId) {
      alert("User not logged in. Please login again.");
      return;
    }

    const fetchDoctorId = async () => {
      try {
        const response = await axios.get('http://localhost:5200/api/Doctor', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        });

        const doctorList = response.data?.$values || [];
        const doctor = doctorList.find(d => d.userId === userId);

        if (doctor) {
          setDoctorId(doctor.doctorId);
        } else {
          alert("Doctor information not found for the current user.");
        }

      } catch (error) {
        console.error("Error fetching doctor:", error);
        alert("Failed to fetch doctor data.");
      }
    };

    fetchDoctorId();
  }, [userId]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorId) {
      alert("Doctor ID not found. Cannot submit response.");
      return;
    }

    if (!content.trim() || !diagnosis.trim()) {
      alert("Please fill in both content and diagnosis.");
      return;
    }

    const responsePayload = {
      requestId: parseInt(requestId),
      doctorId: parseInt(doctorId),
      content: content.trim(),
      attachments: "", // Nếu có file đính kèm thì xử lý sau
      diagnosis: diagnosis.trim(),
      
    };

    try {
      const response = await axios.post('http://localhost:5200/api/ConsultationResponse/create', responsePayload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.success) {
        alert("Response submitted successfully!");
        onSuccess();
        onClose();
      } else {
        alert(response.data?.message || "Failed to submit response. Please try again.");
      }

    } catch (error) {
      console.error("Error submitting response:", error);
      alert("An error occurred while submitting the response.");
    }
  };

  return (
    <div className="consultation-response-modal">
      <h3 className="consultation-response-title">Submit Consultation Response</h3>
      <form onSubmit={handleSubmit}>
        <div className="consultation-response-field">
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="consultation-response-field">
          <label>Diagnosis:</label>
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            required
          />
        </div>
        <div className="consultation-response-actions">
          <button type="submit" className="btn-submit" disabled={!doctorId}>Submit</button>
          <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ConsultationResponseForm;
