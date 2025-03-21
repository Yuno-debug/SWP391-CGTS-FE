import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout4MemP from "../MemPage/Layout4MemP";
import { useNavigate } from "react-router-dom";
import "./MemPage.css";

const MemPage = () => {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [consultationResponses, setConsultationResponses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ratings, setRatings] = useState({});
  const [childNames, setChildNames] = useState({});
  const [doctorNames, setDoctorNames] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Unified loading state for both child and doctor names
  const [consultationData, setConsultationData] = useState({
    childId: "",
    description: "",
    status: "",
    urgency: "",
    attachments: "",
    category: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
      alert("User ID not found! Please log in.");
      return;
    }

    const numericUserId = Number(storedUserId);

    if (isNaN(numericUserId) || numericUserId <= 0) {
      alert("Invalid User ID! Please log in again.");
      localStorage.removeItem("userId");
      navigate("/login");
      return;
    }

    setUserId(numericUserId);
    console.log("Retrieved userId:", numericUserId);

    const fetchChildren = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5200/api/Child/by-user/${numericUserId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Full API Response:", response.data);

        if (response.data && response.data.data) {
          setChildren(response.data.data.$values || []);
        } else {
          setChildren([]);
        }
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };

    const fetchConsultationResponses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5200/api/ConsultationResponse/get-all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Consultation Responses API Response:", response.data);

        if (response.data && response.data.data) {
          setConsultationResponses(response.data.data.$values || []);
        } else {
          setConsultationResponses([]);
        }
      } catch (error) {
        console.error("Error fetching consultation responses:", error);
      }
    };

    fetchChildren();
    fetchConsultationResponses();
  }, [navigate]);

  useEffect(() => {
    const fetchChildNames = async () => {
      const childIds = new Set(consultationResponses.map(response => response.requestId));
      const childNamesMap = {};

      for (const childId of childIds) {
        try {
          const response = await axios.get(`http://localhost:5200/api/Child/${childId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (response.data && response.data.data) {
            childNamesMap[childId] = response.data.data.name;
          }
        } catch (error) {
          console.error(`Error fetching child name for childId ${childId}:`, error);
        }
      }

      setChildNames(childNamesMap);
    };

    const fetchDoctorNames = async () => {
      const doctorIds = new Set(consultationResponses.map(response => response.doctorId));
      const doctorNamesMap = {};

      for (const doctorId of doctorIds) {
        try {
          const response = await axios.get(`http://localhost:5200/api/Doctor/${doctorId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log(`Doctor response for ID ${doctorId}:`, response.data); // Debug
          if (response.data) {
            // Access name directly from response.data (not response.data.data)
            doctorNamesMap[doctorId] = response.data.name || response.data.fullName || "Unknown Doctor";
          }
        } catch (error) {
          console.error(`Error fetching doctor name for doctorId ${doctorId}:`, error.response?.data || error.message);
        }
      }

      setDoctorNames(doctorNamesMap);
    };

    if (consultationResponses.length > 0) {
      setIsLoading(true); // Start loading
      Promise.all([fetchChildNames(), fetchDoctorNames()])
        .then(() => {
          setIsLoading(false); // Stop loading when both fetches complete
        })
        .catch(error => {
          console.error("Error fetching names:", error);
          setIsLoading(false);
        });
    }
  }, [consultationResponses]);

  const handleOpenModal = (childId) => {
    console.log("Opening modal for childId:", childId);
    setConsultationData((prev) => ({
      ...prev,
      childId,
    }));
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating field: ${name} = ${value}`);
    setConsultationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitConsultation = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        alert("User ID not found!");
        return;
      }

      const numericUserId = Number(storedUserId);

      if (isNaN(numericUserId) || numericUserId <= 0) {
        alert("Invalid User ID! Please log in again.");
        return;
      }

      const numericChildId = Number(consultationData.childId);

      if (isNaN(numericChildId) || numericChildId <= 0) {
        alert("Invalid Child ID!");
        return;
      }

      const dataToSend = {
        ...consultationData,
        userId: numericUserId,
        childId: numericChildId,
      };

      console.log("Final data being sent:", dataToSend);

      const response = await axios.post(
        "http://localhost:5200/api/ConsultationRequest/create",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Consultation request sent successfully!");
      console.log("Consultation Request Response:", response.data);
      setShowModal(false);
    } catch (error) {
      console.error("Error sending consultation request:", error);
      alert("Failed to send consultation request.");
    }
  };

  const handleRating = async (responseId, rating) => {
    try {
      await axios.post(
        "http://localhost:5200/api/RatingFeedback",
        { responseId, rating },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      
      setRatings((prev) => ({ ...prev, [responseId]: rating }));
      alert("Rating submitted successfully!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating.");
    }
  };

  return (
    <Layout4MemP>
      <div className="bmi-tool-container">
        <div className="bmi-content-wrapper">
          {/* Phần định nghĩa về BMI */}
          <div className="bmi-section bmi-info">
            <img 
              src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop" 
              alt="BMI Info" 
              style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} 
            />
            <h2>What is BMI?</h2>
            <p>
              BMI (Body Mass Index) is a measure that uses your height and weight
              to work out if your weight is healthy. The BMI calculation divides
              an adult's weight in kilograms by their height in meters squared.
            </p>
          </div>

          <div className="bmi-section bmi-tracking">
            <img 
              src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop" 
              alt="Tracking BMI" 
              style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} 
            />
            <h2>Tracking BMI</h2>
            <p>
              Tracking BMI over time can help you understand how your child's
              growth compares to other children of the same age and sex. It can
              also help identify potential health risks related to weight.
            </p>
          </div>

          <div className="bmi-section bmi-figures">
            <img 
              src="https://www.trs.texas.gov/PublishingImages/Pages/temp/healthcare-news-202311-healthy-weight/weight-management-1.png" 
              alt="BMI Figures" 
              style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} 
            />
            <h2>What Do the Figures Mean?</h2>
            <p>
              - Underweight: BMI is below 18.5.<br />
              - Healthy weight: BMI is between 18.5 and 24.9.<br />
              - Overweight: BMI is between 25 and 29.9.<br />
              - Obese: BMI is 30 or above.
            </p>
          </div>    
          <div className="bmi-section tool-definition">
            <h2>Add Your Child's Information</h2>
            <p>
              To start tracking your child's growth and health insights, you need to add their details. 
              Click the button below to add your child’s profile, including birth details, height, weight, and more.
            </p>
            <button onClick={() => navigate("/add-child")} className="use-tool-button">
              Add a Child
            </button>
          </div>

          <h2>Child Information</h2>
          <table className="child-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Birth Weight (kg)</th>
                <th>Birth Height (cm)</th>
                <th>Blood Type</th>
                <th>Allergies</th>
                <th>Relationship</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(children) && children.length > 0 ? (
                children.map((child, index) => (
                  <tr key={index}>
                    <td>
                      {/* Avatar từ DiceBear */}
                      <img
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(child.name)}`}
                        alt="Avatar"
                        className="child-avatar"
                      />
                    </td>
                    <td>{child.name}</td>
                    <td>{new Date(child.dateOfBirth).toLocaleDateString('en-GB')}</td>
                    <td>{child.gender}</td>
                    <td>{child.birthWeight}</td>
                    <td>{child.birthHeight}</td>
                    <td>{child.bloodType || "N/A"}</td>
                    <td>{child.allergies || "None"}</td>
                    <td>
                      {child.relationship === "D" ? "Dad" : child.relationship === "M" ? "Mom" : child.relationship}
                    </td>
                    <td>
                      <button 
                        className="request-button" 
                        onClick={() => handleOpenModal(child.childId)}
                      >
                        Request Consultation
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No children found.</td>
                </tr>
              )}
            </tbody>
          </table>

          <h2>Consultation Responses</h2>
          <table className="consultation-response-table">
            <thead>
              <tr>
                <th>Child Name</th>
                <th>Doctor Name</th>
                <th>Content</th>
                <th>Date</th>
                <th>Status</th>
                <th>Diagnosis</th>
              </tr>
            </thead>
            <tbody>
              {consultationResponses
                .filter(response => children.some(child => child.childId === response.requestId))
                .map((response, index) => (
                  <tr key={index}>
                    <td>{isLoading ? "Loading..." : (childNames[response.requestId] || "Unknown Child")}</td>
                    <td>{isLoading ? "Loading..." : (doctorNames[response.doctorId] || "Unknown Doctor")}</td>
                    <td>{response.content}</td>
                    <td>{new Date(response.responseDate).toLocaleDateString()}</td>
                    <td>{response.status}</td>
                    <td>{response.diagnosis}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h2>Feedback</h2>
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {consultationResponses
                .filter(response => children.some(child => child.childId === response.requestId))
                .map((response, index) => (
                  <tr key={index}>
                    <td>{isLoading ? "Loading..." : (doctorNames[response.doctorId] || "Unknown Doctor")}</td>
                    <td>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => handleRating(response.responseId, star)}
                          style={{ cursor: "pointer", color: ratings[response.responseId] >= star ? "gold" : "gray" }}
                        >
                          ★
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hộp thoại nhập thông tin */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowModal(false)}>✖</button>
            <img 
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" 
              alt="Consultation Icon" 
            />
            <h2>Consultation Request</h2>
            <label>Description:</label>
            <textarea name="description" onChange={handleInputChange} />

            <label>Status:</label>
            <input type="text" name="status" onChange={handleInputChange} />

            <label>Urgency:</label>
            <select name="urgency" onChange={handleInputChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <label>Attachments:</label>
            <input type="text" name="attachments" onChange={handleInputChange} />

            <label>Category:</label>
            <input type="text" name="category" onChange={handleInputChange} />

            <button onClick={handleSubmitConsultation} className="submit-button">
              Submit Request
            </button>
            <button onClick={() => setShowModal(false)} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </Layout4MemP>
  );
};

export default MemPage;