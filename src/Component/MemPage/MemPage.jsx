import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout4MemP from "../MemPage/Layout4MemP";
import { useNavigate } from "react-router-dom";
import "./MemPage.css";

const MemPage = () => {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
    navigate("/login"); // Điều hướng về trang đăng nhập nếu userId không hợp lệ
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

  fetchChildren();
}, [navigate]);

  const handleOpenModal = (childId) => {
  console.log("Opening modal for childId:", childId); // ✅ Debug
  setConsultationData((prev) => ({
    ...prev,
    childId,  // Cập nhật childId
  }));
  setShowModal(true);
};

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  console.log(`Updating field: ${name} = ${value}`); // ✅ Debug

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

    // Đảm bảo childId cũng là số
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

    console.log("Final data being sent:", dataToSend); // ✅ Debug

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
  return (
    <Layout4MemP>
      <div className="bmi-tool-container">
        <div className="bmi-content-wrapper">
          
          {/* Phần định nghĩa về BMI */}
          <div className="bmi-section bmi-info">
            <h2>What is BMI?</h2>
            <p>
              BMI (Body Mass Index) is a measure that uses your height and weight
              to work out if your weight is healthy. The BMI calculation divides
              an adult's weight in kilograms by their height in metres squared.
            </p>
          </div>

          <div className="bmi-section bmi-tracking">
            <h2>Tracking BMI</h2>
            <p>
              Tracking BMI over time can help you understand how your child's
              growth compares to other children of the same age and sex. It can
              also help identify potential health risks related to weight.
            </p>
          </div>

          <div className="bmi-section bmi-figures">
            <h2>What Do the Figures Mean?</h2>
            <p>
              - Underweight: BMI is below 18.5.<br />
              - Healthy weight: BMI is between 18.5 and 24.9.<br />
              - Overweight: BMI is between 25 and 29.9.<br />
              - Obese: BMI is 30 or above.
            </p>
          </div>
          
          <div className="bmi-section tool-definition">
            <h2>Tool Definition</h2>
            <p>
              This tool allows users to track and analyze BMI (Body Mass Index) for children.
              It provides insights into whether a child is underweight, has a healthy weight,
              is overweight, or obese based on their height and weight.
            </p>
            <button onClick={() => navigate("/add-child")} className="use-tool-button">
              Use the Tool
            </button>
          </div>

          <h2>Child Information</h2>
          <table className="child-table">
            <thead>
              <tr>
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
                    <td>{child.name}</td>
                    <td>{new Date(child.dateOfBirth).toLocaleDateString()}</td>
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
                  <td colSpan="9">No children found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hộp thoại nhập thông tin */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
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
