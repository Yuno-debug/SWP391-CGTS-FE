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
    const response = await axios.get("http://localhost:5200/api/growth-records/count");
    
    console.log("API Response:", response.data); // Debug API response

    // Kiểm tra nếu API trả về số nguyên
    if (typeof response.data === "number") {
      setTotalGrowthRecords(response.data);
    } 
    // Kiểm tra nếu API trả về object có `data.totalGrowthRecords`
    else if (typeof response.data === "object" && response.data?.totalGrowthRecords !== undefined) {
      setTotalGrowthRecords(response.data.totalGrowthRecords);
    } 
    // API trả về object có `data.$values`
    else if (typeof response.data === "object" && response.data?.$values?.[0]?.count !== undefined) {
      setTotalGrowthRecords(response.data.$values[0].count);
    } 
    // API không có định dạng mong đợi
    else {
      console.error("Unexpected API response format:", response.data);
      setTotalGrowthRecords(0); // Đặt mặc định là 0 để tránh lỗi
    }

  } catch (error) {
    console.error("Error fetching total growth records:", error);
    setTotalGrowthRecords(0); // Đặt mặc định là 0 nếu có lỗi
  }
};



    const fetchTotalChildren = async () => {
      try {
        const response = await axios.get('http://localhost:5200/api/Child/count');
        console.log("Total Children Response:", response.data);
        setTotalChildren(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching total children:", error);
      }
    };

    const fetchTotalConsultationRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5200//api/ConsultationRequest/count');
        console.log("Total Consultation Requests Response:", response.data);
        setTotalConsultationRequests(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching total consultation requests:", error);
      }
    };

    const fetchTotalConsultationResponses = async () => {
      try {
        const response = await axios.get('http://localhost:5200/api/ConsultationResponse/count');
        console.log("Total Consultation Responses Response:", response.data);
        setTotalConsultationResponses(response.data.count || 0);
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
