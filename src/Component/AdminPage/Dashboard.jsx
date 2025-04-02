import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './Dashboard.css';

import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ totalChildren, totalDoctors }) => {
  const chartRef = useRef(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Daily Revenue',
        data: [],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75,192,192,1)',
      },
    ],
  });
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const usersPerPage = 5;
  const token = localStorage.getItem('authToken') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiWXVubyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFjdGl2ZSIsImV4cCI6MTc0MzQ5NTUxMSwiaXNzIjoiaHR0cHM6Ly90aXJlZC1sb29wcy1zaGFrZS5sb2NhLmx0IiwiYXVkIjoiaHR0cHM6Ly90aXJlZC1sb29wcy1zaGFrZS5sb2NhLmx0In0.GR2ApAFIGZocWEgBx_m8Ehc4jf09Vxe56TgmXtRdFms';

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const response = await axios.get('http://localhost:5200/api/Payment/total-revenue');
        setTotalRevenue(response.data.totalRevenue);
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    };

    const fetchMonthlyRevenue = async () => {
      try {
        const response = await axios.get(`http://localhost:5200/api/Payment/payments-for-month?month=${selectedMonth}`);
        const monthlyData = response.data.$values || [];
        const daysInMonth = new Date(2025, selectedMonth, 0).getDate();
        const labels = Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`);
        const data = Array(daysInMonth).fill(0);

        if (Array.isArray(monthlyData)) {
          monthlyData.forEach(payment => {
            const paymentDate = new Date(payment.paymentDate);
            const day = paymentDate.getDate();
            if (day >= 1 && day <= daysInMonth) {
              data[day - 1] += payment.paymentAmount || 0;
            }
          });
        }

        setMonthlyRevenueData({
          labels: labels,
          datasets: [
            {
              ...monthlyRevenueData.datasets[0],
              data: data,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching monthly revenue:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5200/api/UserAccount/get-all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('API Response:', response.data);
        const userData = response.data.data?.$values || response.data.data || [];
        // Lọc bỏ users có role = 1 (giả sử 1 là admin)
        const filteredUsers = Array.isArray(userData) ? userData.filter(user => user.role !== 1) : [];
        console.log('Filtered Users:', filteredUsers); // Log để kiểm tra
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error.response || error);
        setUsers([]);
      }
    };

    fetchTotalRevenue();
    fetchMonthlyRevenue();
    fetchUsers();
  }, [selectedMonth, token]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 14 } }
      },
      title: {
        display: true,
        text: `Revenue for ${new Date(2025, selectedMonth - 1).toLocaleString('default', { month: 'long' })} 2025`,
        font: { size: 18 }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context) => `${context.parsed.y.toLocaleString()} VND`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.1)' },
        ticks: {
          callback: (value) => `${value.toLocaleString()} VND`
        }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  const handleRowClick = (user) => {
    console.log('Clicked user:', user);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
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
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-info">
            <h2>Total Doctors</h2>
            <p>{totalDoctors} Doctors</p>
          </div>
        </div>
      </div>
      <div className="chart-container">
        <div className="chart-controls">
          <label>Select Month: </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={index + 1} value={index + 1}>{month}</option>
            ))}
          </select>
        </div>
        <div className="chart">
          <Line ref={chartRef} data={monthlyRevenueData} options={chartOptions} />
        </div>
      </div>
      <div className="doctor-dashboard-user-table-section doctor-dashboard-animate-slide-right" 
           style={{ animationDelay: '2.0s' }}>
        <h3>Recent Registrations</h3>
        <table className="doctor-dashboard-user-table">
          <thead>
            <tr>
              <th>STT</th> {/* Thêm cột STT */}
              <th>NAME</th>
              <th>EMAIL</th>
              <th>REGISTRATION DATE</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr
                  key={user.userId || index}
                  className="doctor-dashboard-user-table-row doctor-dashboard-animate-slide-up"
                  style={{ animationDelay: `${2.2 + index * 0.05}s` }}
                  onClick={() => handleRowClick(user)}
                >
                  <td>{indexOfFirstUser + index + 1}</td> {/* Hiển thị STT */}
                  <td>{user.username || 'N/A'}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No users found</td> {/* Cập nhật colSpan thành 4 */}
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;