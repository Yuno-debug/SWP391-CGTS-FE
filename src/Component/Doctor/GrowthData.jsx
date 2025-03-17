import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GrowthData.css';

const GrowthData = () => {
  const [growthRecords, setGrowthRecords] = useState([]);

  useEffect(() => {
  const fetchGrowthRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5200/api/growth-records", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Full API Response:", response.data);

      // Kiểm tra nếu có $values và nó là mảng
      if (response.data?.$values && Array.isArray(response.data.$values)) {
        setGrowthRecords(response.data.$values);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching growth records:", error);
    }
  };

  fetchGrowthRecords();
}, []);



  return (
    <div className="growth-data-container">
      <h2>Growth Data</h2>
      <table className="growth-data-table">
        <thead>
          <tr>
            <th>Record ID</th>
            <th>Month</th>
            <th>Weight (kg)</th>
            <th>Height (cm)</th>
            <th>BMI</th>
            <th>Head Circumference (cm)</th>
            <th>Upper Arm Circumference (cm)</th>
            <th>Recorded By</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {growthRecords.map(record => (
            <tr key={record.recordId}>
              <td>{record.recordId}</td>
              <td>{new Date(record.month).toLocaleDateString()}</td>
              <td>{record.weight}</td>
              <td>{record.height}</td>
              <td>{record.bmi}</td>
              <td>{record.headCircumference}</td>
              <td>{record.upperArmCircumference}</td>
              <td>{record.recordedByUser}</td>
              <td>{record.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GrowthData;