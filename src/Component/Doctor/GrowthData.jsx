import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GrowthData.css'; // Đảm bảo rằng bạn đã nhập CSS vào đây.

const GrowthData = () => {
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrowthData = async () => {
      try {
        const response = await axios.get('/api/growth-records');
        
        if (response && response.data && response.data.$values) {
          setGrowthData(response.data.$values);  // Lưu dữ liệu vào state
        } else {
          setError('Không có dữ liệu phát triển nào.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Đã xảy ra lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchGrowthData();
  }, []);

  if (loading) {
    return <div>Loading growth data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="growth-data-container">
      <div className="page-header">
        <h2>Growth Records</h2>
        <p>All growth data for children</p>
      </div>
      
      <div className="growth-data-table-container">
        <table className="growth-data-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Weight (kg)</th>
              <th>Height (cm)</th>
              <th>BMI</th>
              <th>Recorded By</th>
            </tr>
          </thead>
          <tbody>
            {growthData.map((record) => (
              <tr
                key={record.recordId}
                className={record.bmi > 18.5 ? 'bmi-high' : 'bmi-low'}
              >
                <td>{record.month}</td>
                <td>{record.weight}</td>
                <td>{record.height}</td>
                <td>{record.bmi}</td>
                <td>{record.recordedByUser}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GrowthData;
