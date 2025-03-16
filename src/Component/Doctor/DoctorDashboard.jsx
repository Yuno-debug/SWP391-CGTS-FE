import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const chartRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [totalGrowthRecords, setTotalGrowthRecords] = useState(0);
  const [totalChildren, setTotalChildren] = useState(0);
  const [totalConsultationRequests, setTotalConsultationRequests] = useState(0);
  const [totalConsultationResponses, setTotalConsultationResponses] = useState(0);

  const getRoleName = (role) => {
    switch (role) {
      case 1: return "Admin";
      case 2: return "Customer";
      case 3: return "Doctor";
      default: return "Unknown";
    }
  };

  useEffect(() => {
    const fetchTotalGrowthRecords = async () => {
      try {
        const response = await axios.get("http://localhost:5200/api/growth-records/count", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        console.log("API Response (Growth Records):", response.data);

        if (typeof response.data === "number") {
          setTotalGrowthRecords(response.data);
        } else if (typeof response.data === "object" && response.data?.totalGrowthRecords !== undefined) {
          setTotalGrowthRecords(response.data.totalGrowthRecords);
        } else if (typeof response.data === "object" && response.data?.$values?.[0]?.count !== undefined) {
          setTotalGrowthRecords(response.data.$values[0].count);
        } else {
          console.error("Unexpected API response format for growth records:", response.data);
          setTotalGrowthRecords(0);
        }
      } catch (error) {
        console.error("Error fetching total growth records:", error);
        setTotalGrowthRecords(0);
      }
    };

    const fetchTotalChildren = async () => {
      try {
        const response = await axios.get('http://localhost:5200/api/Child/count', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        console.log("Total Children Response:", response.data);
        setTotalChildren(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching total children:", error);
      }
    };

    const fetchTotalConsultationRequests = async () => {
      try {
<<<<<<< Updated upstream
        const response = await axios.get('http://localhost:5200/api/ConsultationRequest/get-all', { // Changed to /get-all
=======
        const response = await axios.get('http://localhost:5200/api/ConsultationRequest/get-all', {
>>>>>>> Stashed changes
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        console.log("Total Consultation Requests Response:", response.data);
        if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
          setTotalConsultationRequests(response.data.data.$values.length);
        } else {
          console.error("Unexpected response format:", response.data);
          setTotalConsultationRequests(0);
        }
      } catch (error) {
        console.error("Error fetching total consultation requests:", error);
      }
    };

    const fetchTotalConsultationResponses = async () => {
      try {
<<<<<<< Updated upstream
        const response = await axios.get('http://localhost:5200/api/ConsultationResponse/count', {
=======
        const response = await axios.get('http://localhost:5200/api/ConsultationResponse/get-all', {
>>>>>>> Stashed changes
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        console.log("Total Consultation Responses Response:", response.data);
        if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
          setTotalConsultationResponses(response.data.data.$values.length);
        } else {
          console.error("Unexpected response format:", response.data);
          setTotalConsultationResponses(0);
        }
      } catch (error) {
        console.error("Error fetching total consultation responses:", error);
      }
    };

    fetchTotalGrowthRecords();
    fetchTotalChildren();
    fetchTotalConsultationRequests();
    fetchTotalConsultationResponses();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5200/api/UserAccount/get-all', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });

        console.log("API Response (Users):", response.data);

        if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
          setUsers(response.data.data.$values);
        } else {
          console.error("Unexpected response format for users:", response.data);
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
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h2>Total Growth Records</h2>
            <p>{totalGrowthRecords.toLocaleString()} Records</p>
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
            {users.map((user, index) => (
<<<<<<< Updated upstream
              <tr key={user.id || index}> {/* Fallback to index if user.id is missing */}
=======
              <tr key={user.id || index}>
>>>>>>> Stashed changes
                <td>{user.username || 'N/A'}</td>
                <td>{user.email || 'N/A'}</td>
                <td>{getRoleName(user.role) || 'N/A'}</td>
                <td>{user.status || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;