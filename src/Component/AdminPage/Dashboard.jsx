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
  const [requests, setRequests] = useState([]);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

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
    const fetchRequests = async () => {
      try {
        const requestsResponse = await axios.get('/api/ConsultationRequest/get-all', {
          headers: {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
          }
        });

        if (requestsResponse.data?.success && Array.isArray(requestsResponse.data?.data?.$values)) {
          const requestData = requestsResponse.data.data.$values;

          const enrichedRequests = await Promise.all(
            requestData.map(async (request) => {
              try {
                const userResponse = await axios.get(`/api/UserAccount/${request.userId}`, {
                  headers: {
                    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
                  }
                });
                const username = userResponse.data.success ? userResponse.data.data.username : 'Unknown';

                const childResponse = await axios.get(`/api/Child/${request.childId}`, {
                  headers: {
                    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
                  }
                });
                const childName = childResponse.data.success ? childResponse.data.data.name : 'Unknown';

                return {
                  ...request,
                  username,
                  childName
                };
              } catch (error) {
                console.error(`Error fetching details for request ${request.id}:`, error);
                return {
                  ...request,
                  username: 'Unknown',
                  childName: 'Unknown'
                };
              }
            })
          );

          setRequests(enrichedRequests);
        } else {
          console.error("Unexpected requests response format:", requestsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching consultation requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedRequests = [...requests].sort((a, b) => {
      const valueA = a[key] || '';
      const valueB = b[key] || '';
      if (key === 'requestDate') {
        return direction === 'asc' 
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      }
      return direction === 'asc' 
        ? valueA.toString().localeCompare(valueB.toString())
        : valueB.toString().localeCompare(valueA.toString());
    });
    setRequests(sortedRequests);
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(requests.length / itemsPerPage);

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
      <div className="user-table-container">
        <h3>Recent Requests</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>STT</th>
              <th onClick={() => sortData('username')}>
                Username{getSortIndicator('username')}
              </th>
              <th onClick={() => sortData('childName')}>
                Child Name{getSortIndicator('childName')}
              </th>
              <th onClick={() => sortData('requestDate')}>
                Request Date{getSortIndicator('requestDate')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((request, index) => (
              <tr key={request.id || index}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{request.username}</td>
                <td>{request.childName}</td>
                <td>{new Date(request.requestDate).toLocaleDateString()}</td>
              </tr>
            ))}
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