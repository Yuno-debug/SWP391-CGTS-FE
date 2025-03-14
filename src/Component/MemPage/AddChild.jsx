import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AddChild.css";
import Layout4MemP from "./Layout4MemP";
import axios from "axios";

const AddChild = () => {
  const [userId, setUserId] = useState("");
  const [childData, setChildData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    birthWeight: "",
    birthHeight: "",
    bloodType: "",
    allergies: "",
    relationship: "",
  });

  const [children, setChildren] = useState([]);

  // Get userId from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("Retrieved userId:", storedUserId);

    if (!storedUserId) {
      alert("User ID not found! Please log in.");
      return;
    }

    setUserId(Number(storedUserId)); // Convert to number if needed

    // Fetch existing child information for the user
    const fetchChildren = async () => {
      try {
        const response = await axios.get(`http://localhost:5200/api/Child/by-user/${storedUserId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const childrenData = response.data?.data?.$values || []; 
        console.log("Fetched Children:", childrenData);
        setChildren(childrenData);
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };

    fetchChildren();
  }, []);

  const handleChange = (e) => {
    setChildData({ ...childData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!userId) {
    alert("User ID is missing. Please log in again.");
    return;
  }

  if (!childData.name || !childData.dateOfBirth || !childData.gender || !childData.relationship) {
    alert("Please fill all required fields!");
    return;
  }

  const requestData = {
    ...childData,
    userId: userId,
    birthWeight: parseFloat(childData.birthWeight) || 0,
    birthHeight: parseFloat(childData.birthHeight) || 0,
  };

  console.log("📤 Submitting Data:", JSON.stringify(requestData, null, 2));

  try {
    await axios.post("http://localhost:5200/api/Child/create", requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("✅ Child Added Successfully!");

    // Gọi lại API để lấy danh sách mới
    fetchChildren();

    // Reset form
    setChildData({
      name: "",
      dateOfBirth: "",
      gender: "",
      birthWeight: "",
      birthHeight: "",
      bloodType: "",
      allergies: "",
      relationship: "",
    });

  } catch (error) {
    console.error("❌ Error:", error.response ? error.response.data : error.message);
    if (error.response) {
      console.error("Server Response:", error.response.data);
      alert(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      alert(`Error: ${error.message}`);
    }
  }
};


  return (
    <Layout4MemP>
      <div className="add-child-container">
        <div className="add-child-content">
          <h2>Add Child</h2>
          <form onSubmit={handleSubmit} className="add-child-form">
            <div className="form-group">
              <label>Name:</label>
              <input type="text" name="name" value={childData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Date of Birth:</label>
              <input type="date" name="dateOfBirth" value={childData.dateOfBirth} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Gender:</label>
              <select name="gender" value={childData.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>Birth Weight (kg):</label>
              <input type="number" name="birthWeight" value={childData.birthWeight} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Birth Height (cm):</label>
              <input type="number" name="birthHeight" value={childData.birthHeight} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Blood Type:</label>
              <input type="text" name="bloodType" value={childData.bloodType} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Allergies:</label>
              <input type="text" name="allergies" value={childData.allergies} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Relationship:</label>
              <input type="text" name="relationship" value={childData.relationship} onChange={handleChange} required />
            </div>
            <button type="submit" className="add-child-button">Add Child</button>
          </form>

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
          {/* Chuyển đổi D => Dad, M => Mom */}
          {child.relationship === "D" ? "Dad" : child.relationship === "M" ? "Mom" : child.relationship}
        </td>
        <td>
          <Link to={`/update-growth-metrics/${child.childId}`}>Update Growth</Link>
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
    </Layout4MemP>
  );
};

export default AddChild;
