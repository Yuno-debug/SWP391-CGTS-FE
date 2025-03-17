import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
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
  const [totalAlerts, setTotalAlerts] = useState(0);
  const navigate = useNavigate();

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
      const token = localStorage.getItem("token");
      console.log("Token (Growth Records):", token);

      if (!token) {
        setErrorAndRedirect("No authorization token found. Redirecting to login...");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5200/api/growth-records/count", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("API Response (Growth Records, Stringified):", JSON.stringify(response.data, null, 2));
        if (typeof response.data === "number") {
          setTotalGrowthRecords(response.data);
        } else if (typeof response.data === "object" && response.data?.totalGrowthRecords !== undefined) {
          setTotalGrowthRecords(response.data.totalGrowthRecords);
        } else if (typeof response.data === "object" && response.data?.$values?.[0]?.count !== undefined) {
          setTotalGrowthRecords(response.data.$values[0].count);
        } else {
          console.error("Unexpected API response format for growth records:", JSON.stringify(response.data, null, 2));
          setTotalGrowthRecords(0);
        }
      } catch (error) {
        console.error("Error fetching total growth records:", error);
        setTotalGrowthRecords(0);
      }
    };

    const fetchTotalChildren = async () => {
      const token = localStorage.getItem("token");
      console.log("Token (Children):", token);

      if (!token) {
        setErrorAndRedirect("No authorization token found. Redirecting to login...");
        return;
      }

      try {
        const response = await axios.get('http://localhost:5200/api/Child/count', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("Total Children Response (Stringified):", JSON.stringify(response.data, null, 2));
        setTotalChildren(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching total children:", error);
        setTotalChildren(0);
      }
    };

    const fetchTotalConsultationRequests = async () => {
      const token = localStorage.getItem("token");
      console.log("Token (Consultation Requests):", token);

      if (!token) {
        setErrorAndRedirect("No authorization token found. Redirecting to login...");
        return;
      }

      try {
        const response = await axios.get('http://localhost:5200/api/ConsultationRequest/get-all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("Total Consultation Requests Response (Stringified):", JSON.stringify(response.data, null, 2));
        if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
          setTotalConsultationRequests(response.data.data.$values.length);
        } else {
          console.error("Unexpected response format:", JSON.stringify(response.data, null, 2));
          setTotalConsultationRequests(0);
        }
      } catch (error) {
        console.error("Error fetching total consultation requests:", error);
        setTotalConsultationRequests(0);
      }
    };

    const fetchTotalConsultationResponses = async () => {
      const token = localStorage.getItem("token");
      console.log("Token (Consultation Responses):", token);

      if (!token) {
        setErrorAndRedirect("No authorization token found. Redirecting to login...");
        return;
      }

      try {
        const response = await axios.get('http://localhost:5200/api/ConsultationResponse/get-all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("Total Consultation Responses Response (Stringified):", JSON.stringify(response.data, null, 2));
        if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
          setTotalConsultationResponses(response.data.data.$values.length);
        } else {
          console.error("Unexpected response format:", JSON.stringify(response.data, null, 2));
          setTotalConsultationResponses(0);
        }
      } catch (error) {
        console.error("Error fetching total consultation responses:", error);
        setTotalConsultationResponses(0);
      }
    };

    const fetchTotalAlerts = async () => {
      const token = localStorage.getItem("token");
      console.log("Token (Alerts):", token);

      if (!token) {
        setErrorAndRedirect("No authorization token found. Redirecting to login...");
        return;
      }

      try {
        const response = await axios.get('http://localhost:5200/api/Alert/count', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("Total Alerts Response (Stringified):", JSON.stringify(response.data, null, 2));
        if (typeof response.data === "number") {
          setTotalAlerts(response.data); // Directly use the number if it's 1
        } else if (response.data?.count !== undefined) {
          setTotalAlerts(response.data.count); // Handle { count: 1 }
        } else if (response.data?.total !== undefined) {
          setTotalAlerts(response.data.total); // Handle { total: 1 } as a fallback
        } else {
          console.error("Unexpected API response format for alerts count:", JSON.stringify(response.data, null, 2));
          setTotalAlerts(0);
        }
      } catch (error) {
        console.error("Error fetching total alerts:", error);
        setTotalAlerts(0);
      }
    };

    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      console.log("Token (Users):", token);

      if (!token) {
        setErrorAndRedirect("No authorization token found. Redirecting to login...");
        return;
      }

      try {
        const response = await axios.get('http://localhost:5200/api/UserAccount/get-all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("API Response (Users, Stringified):", JSON.stringify(response.data, null, 2));
        if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
          setUsers(response.data.data.$values);
        } else {
          console.error("Unexpected response format for users:", JSON.stringify(response.data, null, 2));
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users data:', error);
        setUsers([]);
      }
    };

    const setErrorAndRedirect = (message) => {
      setError(message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    };

    fetchTotalGrowthRecords();
    fetchTotalChildren();
    fetchTotalConsultationRequests();
    fetchTotalConsultationResponses();
    fetchTotalAlerts();
    fetchUsers();
  }, [navigate]);

  const [error, setError] = useState(null);

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
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <p>{error}</p>
        </div>
      )}
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
        <div className="stat-item">
          <div className="stat-icon">🔔</div>
          <div className="stat-info">
            <h2>Total Alerts</h2>
            <p>{totalAlerts} Alerts</p> {/* Ensure this reflects the state */}
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
              <tr key={user.id || index}>
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