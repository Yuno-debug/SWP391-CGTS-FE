import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./UpdateGrowthMetrics.css";

const UpdateGrowthMetrics = () => {
  const { childId } = useParams();
  const [growthData, setGrowthData] = useState({
    weight: "",
    height: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
  });

  const [growthRecords, setGrowthRecords] = useState([]);

  useEffect(() => {
    // Fetch existing growth records for the child
    const fetchGrowthRecords = async () => {
      try {
        const response = await axios.get(`http://localhost:5200/api/GrowthRecord/by-child/${childId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Fetched Growth Records:", response.data);
        setGrowthRecords(response.data.data.$values || []);
      } catch (error) {
        console.error("Error fetching growth records:", error);
      }
    };

    fetchGrowthRecords();
  }, [childId]);

  const handleChange = (e) => {
    setGrowthData({ ...growthData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      ...growthData,
      childId: childId,
      weight: parseFloat(growthData.weight) || 0,
      height: parseFloat(growthData.height) || 0,
    };

    console.log("📤 Submitting Growth Data:", JSON.stringify(requestData, null, 2));

    try {
      const response = await axios.post("http://localhost:5200/api/GrowthRecord/create", requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("✅ Growth Record Added:", response.data);
      setGrowthRecords([...growthRecords, response.data]);

      setGrowthData({
        weight: "",
        height: "",
        date: new Date().toISOString().split("T")[0],
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

  const calculateBMI = (weight, height) => {
    if (weight && height) {
      const heightInMeters = height / 100;
      return (weight / (heightInMeters * heightInMeters)).toFixed(2);
    }
    return "N/A";
  };

  return (
    <div className="update-growth-metrics-container">
      <h2>Update Growth Metrics</h2>
      <form onSubmit={handleSubmit} className="update-growth-metrics-form">
        <div className="form-group">
          <label>Date:</label>
          <input type="date" name="date" value={growthData.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Weight (kg):</label>
          <input type="number" name="weight" value={growthData.weight} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Height (cm):</label>
          <input type="number" name="height" value={growthData.height} onChange={handleChange} required />
        </div>
        <button type="submit" className="update-growth-metrics-button">Update</button>
      </form>

      <h2>Growth Records</h2>
      <table className="growth-records-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Weight (kg)</th>
            <th>Height (cm)</th>
            <th>BMI</th>
          </tr>
        </thead>
        <tbody>
          {growthRecords.map((record, index) => (
            <tr key={index}>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>{record.weight}</td>
              <td>{record.height}</td>
              <td>{calculateBMI(record.weight, record.height)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateGrowthMetrics;