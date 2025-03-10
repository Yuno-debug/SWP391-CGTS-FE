import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GrowthData.css';

const GrowthData = () => {
  const [growthRecords, setGrowthRecords] = useState([]);

  useEffect(() => {
    const fetchGrowthRecords = async () => {
      try {
        const response = await axios.get('http://localhost:5200/api/GrowthRecord', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });

        console.log("Growth Records Response:", response.data);

        if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
          setGrowthRecords(response.data.data.$values);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error('Error fetching growth records:', error);
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
            <th>Child Name</th>
            <th>Date</th>
            <th>Height (cm)</th>
            <th>Weight (kg)</th>
          </tr>
        </thead>
        <tbody>
          {growthRecords.map(record => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.childName}</td>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>{record.height}</td>
              <td>{record.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GrowthData;