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
  const [users, setUsers] = useState([]);
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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

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
        const response = await axios.get('http://localhost:5200/api/Payment/total-revenue');
        setTotalRevenue(response.data.totalRevenue);
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    };

    const fetchMonthlyRevenue = async () => {
      try {
        const response = await axios.get(`http://localhost:5200/api/Payment/payments-for-month?month=${selectedMonth}`);
        console.log("Monthly Revenue Response:", response.data);

        const monthlyData = response.data.$values || [];

        // Calculate days in the selected month for 2025
        const daysInMonth = new Date(2025, selectedMonth, 0).getDate();
        const labels = Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`);

        // Initialize data array with zeros
        const data = Array(daysInMonth).fill(0);

        // Aggregate payments by day
        if (Array.isArray(monthlyData)) {
          monthlyData.forEach(payment => {
            const paymentDate = new Date(payment.paymentDate);
            const day = paymentDate.getDate(); // Get day of the month (1-31)
            if (day >= 1 && day <= daysInMonth) {
              data[day - 1] += payment.paymentAmount || 0; // Add payment amount to the correct day
            }
          });
        } else {
          console.warn("Unexpected monthly data format:", monthlyData);
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
        // Fallback to empty chart
        const daysInMonth = new Date(2025, selectedMonth, 0).getDate();
        const labels = Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`);
        setMonthlyRevenueData({
          labels: labels,
          datasets: [
            {
              ...monthlyRevenueData.datasets[0],
              data: Array(daysInMonth).fill(0),
            },
          ],
        });
      }
    };

    fetchTotalRevenue();
    fetchMonthlyRevenue();
  }, [selectedMonth]);

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/UserAccount/get-all', {
          headers: {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
          }
        });

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

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
      if (key === 'role') {
        const roleA = getRoleName(a[key]);
        const roleB = getRoleName(b[key]);
        return direction === 'asc' ? roleA.localeCompare(roleB) : roleB.localeCompare(roleA);
      }
      const valueA = a[key] || '';
      const valueB = b[key] || '';
      return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
    setUsers(sortedUsers);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

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
      <div className="user-table-container">
        <h3>Recent Request</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th onClick={() => sortData('username')}>
                Name{getSortIndicator('username')}
              </th>
              <th onClick={() => sortData('email')}>
                Email{getSortIndicator('email')}
              </th>
              <th onClick={() => sortData('role')}>
                Role{getSortIndicator('role')}
              </th>
              <th onClick={() => sortData('status')}>
                Status{getSortIndicator('status')}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id || index}>
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

export default Dashboard;