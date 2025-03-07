import React, { useState, useEffect } from 'react';
import './AddChild.css';
import Layout4MemP from './Layout4MemP';

const AddChild = () => {
  const [userId, setUserId] = useState(null);
  const [childData, setChildData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    birthWeight: '',
    birthHeight: '',
    bloodType: '',
    allergies: '',
    relationship: '',
  });

  const [children, setChildren] = useState([]);

  // ✅ Lấy userId từ localStorage khi component mount
  useEffect(() => {
  const storedUserId = localStorage.getItem("userId");
  console.log("Retrieved userId:", storedUserId); // 🔥 Debug xem userId có được lấy không?

  if (!storedUserId) {
    alert("User ID not found! Please log in.");
    return;
  }

  setUserId(storedUserId); // Cập nhật state userId
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

  // ✅ Chắc chắn userId được thêm vào requestData
  const requestData = {
    ...childData,
    userId: Number(userId), // Convert từ string về số nếu cần
    birthWeight: parseFloat(childData.birthWeight) || 0,
    birthHeight: parseFloat(childData.birthHeight) || 0,
  };

  console.log("📤 Submitting Data:", requestData); // 🔥 Debug kiểm tra requestData có userId chưa

  try {
    const response = await fetch("http://localhost:5200/api/Child/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // ✅ Thêm token nếu API yêu cầu
      },
      body: JSON.stringify(requestData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("❌ Server Error:", responseData);
      alert(`Error: ${responseData.title || "Unknown error"}`);
      return;
    }

    console.log("✅ Child Added:", responseData);
    setChildren([...children, responseData]); // Cập nhật danh sách trẻ

    // ✅ Reset form sau khi thêm thành công
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
    console.error("❌ Network or Server Error:", error);
    alert(`Network error: ${error.message}`);
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
              <input type="month" name="dateOfBirth" value={childData.dateOfBirth} onChange={handleChange} required />
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
              <select name="relationship" value={childData.relationship} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Dad">Dad</option>
                <option value="Mom">Mom</option>
              </select>
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
              </tr>
            </thead>
            <tbody>
              {children.map((child, index) => (
                <tr key={index}>
                  <td>{child.name}</td>
                  <td>{child.dateOfBirth}</td>
                  <td>{child.gender}</td>
                  <td>{child.birthWeight}</td>
                  <td>{child.birthHeight}</td>
                  <td>{child.bloodType}</td>
                  <td>{child.allergies}</td>
                  <td>{child.relationship}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout4MemP>
  );
};

export default AddChild;
