import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './Dashboard.css'; // Import the CSS file for styling

const Dashboard = ({ totalRevenue = 5000000, totalChildren, totalDoctors }) => {
  const chartRef = useRef(null);

  // Mock data for Monthly Revenue chart
  const monthlyRevenueData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: [12000, 15000, 10000, 20000, 25000, 22000, 30000, 28000, 32000, 35000, 37000, 40000],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  useEffect(() => {
    const chartInstance = chartRef.current;

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h2>Total Revenue</h2>
            <p>VND{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">👶</div>
          <div className="stat-info">
            <h2>Total Children</h2>
            <p>{totalChildren}</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-info">
            <h2>Total Doctors</h2>
            <p>{totalDoctors}</p>
          </div>
        </div>
      </div>
      <div className="chart-container">
        <div className="chart">
          <h3>Monthly Revenue</h3>
          <Line ref={chartRef} data={monthlyRevenueData} />
        </div>
        <div className="chart">
          <h3>Children Growth Rate</h3>
          {/* Add your chart component here */}
        </div>
      </div>
      <div className="user-table-container">
        <h3>Recent Users</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td>Admin</td>
              <td>Active</td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>jane@example.com</td>
              <td>User</td>
              <td>Inactive</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;