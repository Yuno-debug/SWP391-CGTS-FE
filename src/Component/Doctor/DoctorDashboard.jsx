import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './DoctorDashboard.css';

const DoctorDashboard = ({ totalChildren, totalConsultationResponses, totalConsultationRequests }) => {
  const chartRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0); // State for total revenue

  const getRoleName = (role) => {
    switch (role) {
      case 1: return "Admin";
      case 2: return "Customer";
      case 3: return "Doctor";
      default: return "Unknown";
    }
  };

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const response = await axios.get('http://localhost:5200/api/Payment/total-revenue'); // Replace with your actual API endpoint
        console.log("Total Revenue Response:", response.data);
        setTotalRevenue(response.data.totalRevenue); // Adjust based on actual API response format
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    };

    fetchTotalRevenue();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/UserAccount/get-all', {
          headers: {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Replace with actual token
          }
        });

        console.log("API Response:", response.data);

        if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
          setUsers(response.data.data.$values);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };

    fetchUsers();
  }, []);

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

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Doctor Dashboard</h1>
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h2>Total Revenue</h2>
            <p>{totalRevenue.toLocaleString()} VND</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">👶</div>
          <div className="stat-info">
            <h2>Total Children</h2>
            <p>{totalChildren} Children</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h2>Total Consultation Requests</h2>
            <p>{totalConsultationRequests} Requests</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h2>Total Consultation Responses</h2>
            <p>{totalConsultationResponses} Responses</p>
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
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{getRoleName(user.role)}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;
