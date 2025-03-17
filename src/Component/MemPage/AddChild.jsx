import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaExclamationCircle } from "react-icons/fa";
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
    avatar: "",
  });
  const [errors, setErrors] = useState({});
  const [children, setChildren] = useState([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      alert("User ID not found! Please log in.");
      return;
    }
    setUserId(Number(storedUserId));
    fetchChildren(storedUserId);
  }, []);

  const fetchChildren = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5200/api/Child/by-user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setChildren(response.data?.data?.$values || []);
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  const handleChange = (e) => {
    setChildData({ ...childData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!childData.name) tempErrors.name = "Name is required";
    if (!childData.dateOfBirth) tempErrors.dateOfBirth = "Date of Birth is required";
    if (!childData.gender) tempErrors.gender = "Gender is required";
    if (!childData.relationship) tempErrors.relationship = "Relationship is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const requestData = { ...childData, userId: userId };
    try {
      await axios.post("http://localhost:5200/api/Child/create", requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchChildren(userId);
      setChildData({ name: "", dateOfBirth: "", gender: "", birthWeight: "", birthHeight: "", bloodType: "", allergies: "", relationship: "", avatar: "" });
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <Layout4MemP>
      <div className="add-child-container">
        <h2>Add Child</h2>
        <form onSubmit={handleSubmit} className="add-child-form">
          <fieldset>
            <legend>Basic Info</legend>
            <input type="text" name="name" placeholder="Enter child's name" value={childData.name} onChange={handleChange} required />
            {errors.name && <span className="error"><FaExclamationCircle /> {errors.name}</span>}
            <input type="date" name="dateOfBirth" value={childData.dateOfBirth} onChange={handleChange} required />
            {errors.dateOfBirth && <span className="error"><FaExclamationCircle /> {errors.dateOfBirth}</span>}
            <label>
              <input type="radio" name="gender" value="Male" onChange={handleChange} /> Male
            </label>
            <label>
              <input type="radio" name="gender" value="Female" onChange={handleChange} /> Female
            </label>
            {errors.gender && <span className="error"><FaExclamationCircle /> {errors.gender}</span>}
          </fieldset>
          <fieldset>
            <legend>Birth Info</legend>
            <input type="number" name="birthWeight" placeholder="Birth Weight (kg)" value={childData.birthWeight} onChange={handleChange} required />
            <input type="number" name="birthHeight" placeholder="Birth Height (cm)" value={childData.birthHeight} onChange={handleChange} required />
            <input type="text" name="bloodType" placeholder="Blood Type" value={childData.bloodType} onChange={handleChange} />
          </fieldset>
          <fieldset>
            <legend>Extra Info</legend>
            <input type="text" name="allergies" placeholder="Allergies (if any)" value={childData.allergies} onChange={handleChange} />
            <input type="text" name="relationship" placeholder="Relationship (Dad, Mom, etc.)" value={childData.relationship} onChange={handleChange} required />
          </fieldset>
          <button type="submit" className="add-child-button">Add Child</button>
        </form>

        <h2>Child Information</h2>
        <table className="child-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Age</th>
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
    </Layout4MemP>
  );
};

export default AddChild;