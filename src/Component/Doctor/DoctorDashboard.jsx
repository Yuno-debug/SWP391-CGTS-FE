import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './DoctorDashboard.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Weather Icon Component
const WeatherIcon = ({ condition }) => {
  const icons = {
    Sunny: '☀️',
    Cloudy: '☁️',
    Rainy: '🌧️',
    Stormy: '⛈️',
  };
  return (
    <span role="img" aria-label={condition} className="doctor-dashboard-weather-icon">
      {icons[condition] || '☀️'}
    </span>
  );
};

const DoctorDashboard = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [totalGrowthRecords, setTotalGrowthRecords] = useState(0);
  const [totalChildren, setTotalChildren] = useState(0);
  const [totalConsultationRequests, setTotalConsultationRequests] = useState(0);
  const [totalConsultationResponses, setTotalConsultationResponses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Pagination state for Recent Requests
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sorting state for Recent Requests
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Weather state
  const [weatherLocation, setWeatherLocation] = useState('Ho Chi Minh City');
  const [weatherData, setWeatherData] = useState({
    condition: 'Sunny',
    temperature: 24,
    location: 'Ho Chi Minh City',
  });

  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Chart state
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [requestsByMonth, setRequestsByMonth] = useState({});
  const [responsesByMonth, setResponsesByMonth] = useState({});

  // Mock weather data
  const mockWeatherData = {
    'Ho Chi Minh City': { condition: 'Sunny', temperature: 24 },
    'Hanoi': { condition: 'Cloudy', temperature: 20 },
    'Da Nang': { condition: 'Rainy', temperature: 22 },
    'Singapore': { condition: 'Stormy', temperature: 26 },
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 18,
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: 'Consultation Statistics by Month',
        font: {
          size: 24,
          weight: 'bold',
        },
        color: '#1e3a8a',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
          font: {
            size: 18,
            weight: 'bold',
          },
          color: '#1e3a8a',
        },
        ticks: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#1e3a8a',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month-Year',
          font: {
            size: 18,
            weight: 'bold',
          },
          color: '#1e3a8a',
        },
        ticks: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#1e3a8a',
        },
      },
    },
  };

  // Helper function to group data by month-year
  const groupByMonthYear = (items, dateKey) => {
    const grouped = {};
    if (!Array.isArray(items)) {
      console.error(`groupByMonthYear: items is not an array, received:`, items);
      return grouped;
    }
    items.forEach((item) => {
      const date = new Date(item[dateKey]);
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date for ${dateKey} in item:`, item);
        return;
      }
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      grouped[monthYear] = (grouped[monthYear] || 0) + 1;
    });
    return grouped;
  };

  // Generate all months for the current year
  const generateAllMonths = (year) => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(year, i, 1);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      months.push(monthYear);
    }
    return months;
  };

  // Update weather when location changes
  const handleWeatherLocationChange = (e) => {
    const newLocation = e.target.value;
    setWeatherLocation(newLocation);
    setWeatherData({
      condition: mockWeatherData[newLocation].condition,
      temperature: mockWeatherData[newLocation].temperature,
      location: newLocation,
    });
  };

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      if (
        now.getDate() !== currentDate.getDate() ||
        now.getMonth() !== currentDate.getMonth() ||
        now.getFullYear() !== currentDate.getFullYear()
      ) {
        setCurrentDate(new Date(now));
        setSelectedDate(new Date(now));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [currentDate]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authorization token found. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
      setLoading(false);
      return;
    }

    try {
      const [
        growthRecordsResponse,
        childrenResponse,
        consultationRequestsResponse,
        consultationResponsesResponse,
        usersResponse,
      ] = await Promise.all([
        axios.get("http://localhost:5200/api/ConsultationResponse/count-children", {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('http://localhost:5200/api/Child/count', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('http://localhost:5200/api/ConsultationRequest/get-all', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('http://localhost:5200/api/ConsultationResponse/get-all', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('http://localhost:5200/api/UserAccount/get-all', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
      ]);

      const requestsData = consultationRequestsResponse.data?.data?.$values || [];
      const responses = consultationResponsesResponse.data?.data?.$values || [];
      const usersData = usersResponse.data?.data?.$values || [];

      // Enrich requests with username and childName
      const enrichedRequests = await Promise.all(
        requestsData.map(async (request) => {
          try {
            const userResponse = await axios.get(`/api/UserAccount/${request.userId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const username = userResponse.data.success ? userResponse.data.data.username : 'Unknown';

            const childResponse = await axios.get(`/api/Child/${request.childId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const childName = childResponse.data.success ? childResponse.data.data.name : 'Unknown';

            return { ...request, username, childName };
          } catch (error) {
            console.error(`Error fetching details for request ${request.id}:`, error);
            return { ...request, username: 'Unknown', childName: 'Unknown' };
          }
        })
      );

      // Group data by month-year
      const requestsGrouped = groupByMonthYear(requestsData, 'requestDate');
      const responsesGrouped = groupByMonthYear(responses, 'responseDate');

      // Generate all months for the current year
      const currentYear = new Date().getFullYear();
      const allMonths = generateAllMonths(currentYear);

      setTotalGrowthRecords(growthRecordsResponse.data?.data || growthRecordsResponse.data || 0);
      setTotalChildren(childrenResponse.data.count || 0);
      setTotalConsultationRequests(requestsData.length);
      setTotalConsultationResponses(responses.length);
      setUsers(usersData);
      setRequests(enrichedRequests);
      setRequestsByMonth(requestsGrouped);
      setResponsesByMonth(responsesGrouped);

      // Update chart data with all months
      setChartData({
        labels: allMonths,
        datasets: [
          {
            label: 'Consultation Requests',
            data: allMonths.map(month => requestsGrouped[month] || 0),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Consultation Responses',
            data: allMonths.map(month => responsesGrouped[month] || 0),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [navigate]);

  // Calendar navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    if (selectedDate.getMonth() !== currentDate.getMonth() - 1) {
      setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    if (selectedDate.getMonth() !== currentDate.getMonth() + 1) {
      setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };

  const handleDayClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const handleStatCardClick = (title) => {
    console.log(`Clicked on ${title}`);
  };

  const handleRowClick = (request) => {
    console.log(`Clicked on request for: ${request.username || 'N/A'}`);
  };

  // Sorting logic for requests
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

  // Pagination logic for requests
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(requests.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Mock calendar events
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const calendarEvents = {
    [`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`]: [
      "Patient Appointment at 10 AM",
      "Follow-up Call at 2 PM",
    ],
    [`${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`]: [
      "Staff Meeting at 9 AM",
    ],
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<span key={`empty-${i}`} className="doctor-dashboard-calendar-day doctor-dashboard-calendar-day-empty"></span>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasEvent = calendarEvents[dateKey];
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      const isSelected =
        day === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear();
      days.push(
        <span
          key={day}
          className={`doctor-dashboard-calendar-day ${isToday ? 'doctor-dashboard-calendar-day-today' : ''} ${isSelected ? 'doctor-dashboard-calendar-day-selected' : ''} ${hasEvent ? 'doctor-dashboard-calendar-day-has-event' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          {day}
          {hasEvent && <span className="doctor-dashboard-event-dot"></span>}
        </span>
      );
    }
    return days;
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Updated progress data based on real API data
  const progressData = [
    { label: "Consultation Requests Handled", value: totalConsultationResponses, max: totalConsultationRequests || 1 },
    { label: "Children Examined", value: totalGrowthRecords, max: totalChildren || 1 },
  ];

  // Mock quotes
  const quotes = [
    "The art of medicine consists in amusing the patient while nature cures the disease. – Voltaire",
    "Wherever the art of medicine is loved, there is also a love of humanity. – Hippocrates",
    "The good physician treats the disease; the great physician treats the patient who has the disease. – William Osler",
    "Healing is a matter of time, but it is sometimes also a matter of opportunity. – Hippocrates",
    "The best way to find yourself is to lose yourself in the service of others. – Mahatma Gandhi",
  ];

  const getQuoteOfTheDay = () => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return quotes[dayOfYear % quotes.length];
  };

  // Mock tips/reminders
  const tips = [
    "Remember to review patient charts today!",
    "Schedule a follow-up with your patients this week.",
    "Stay hydrated and take breaks between appointments.",
  ];

  if (loading) {
    return (
      <div className="doctor-dashboard-loading">
        <div className="doctor-dashboard-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-container">
      {/* Header Section */}
      <div className="doctor-dashboard-header doctor-dashboard-animate-fade-in">
        <div className="doctor-dashboard-header-banner">
          <span role="img" aria-label="doctor" className="doctor-dashboard-header-icon">
            🩺
          </span>
          <div className="doctor-dashboard-header-text">
            <h1>Welcome back, Doctor!</h1>
            <p>You have {totalConsultationRequests} new consultation requests.</p>
            <p className="doctor-dashboard-motivational-quote">"Caring for patients is the heart of medicine." – Hippocrates</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="doctor-dashboard-main doctor-dashboard-animate-fade-in" style={{ animationDelay: '0.6s' }}>
        {/* Consultation Statistics Chart */}
        <div className="doctor-dashboard-consultation-chart-section doctor-dashboard-animate-slide-left" style={{ animationDelay: '0.8s' }}>
          <div className="doctor-dashboard-consultation-chart-container">
            <Bar data={chartData} options={chartOptions} height={300} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="doctor-dashboard-stats-grid">
          {[
            { title: "Number of examined children", value: totalGrowthRecords.toLocaleString() },
            { title: "Total Children", value: totalChildren },
            { title: "Consultation Requests", value: totalConsultationRequests },
            { title: "Consultation Responses", value: totalConsultationResponses },
          ].map((stat, index) => (
            <div
              key={stat.title}
              className="doctor-dashboard-stat-card doctor-dashboard-animate-slide-up"
              style={{ animationDelay: `${1.0 + index * 0.1}s` }}
              onClick={() => handleStatCardClick(stat.title)}
            >
              <h4>{stat.title}</h4>
              <div className="doctor-dashboard-stat-value">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Tracker Section */}
      <div className="doctor-dashboard-progress-section doctor-dashboard-animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <h3>Daily Progress</h3>
        <div className="doctor-dashboard-progress-grid">
          {progressData.map((progress, index) => (
            <div key={index} className="doctor-dashboard-progress-item doctor-dashboard-animate-slide-up" style={{ animationDelay: `${1.4 + index * 0.1}s` }}>
              <div className="doctor-dashboard-progress-label">{progress.label}</div>
              <div className="doctor-dashboard-progress-bar">
                <div
                  className="doctor-dashboard-progress-fill"
                  style={{ width: `${Math.min((progress.value / progress.max) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="doctor-dashboard-progress-value">{progress.value}/{progress.max}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="doctor-dashboard-bottom doctor-dashboard-animate-fade-in" style={{ animationDelay: '1.6s' }}>
        {/* Calendar */}
        <div className="doctor-dashboard-calendar-section doctor-dashboard-animate-slide-left" style={{ animationDelay: '1.8s' }}>
          <h3>Calendar</h3>
          <div className="doctor-dashboard-calendar">
            <div className="doctor-dashboard-calendar-header">
              <button className="doctor-dashboard-calendar-nav-button" onClick={handlePrevMonth}>{'<'}</button>
              <span>{formatMonthYear()}</span>
              <button className="doctor-dashboard-calendar-nav-button" onClick={handleNextMonth}>{'>'}</button>
            </div>
            <div className="doctor-dashboard-calendar-days">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div className="doctor-dashboard-calendar-grid">
              {generateCalendarDays()}
            </div>
          </div>
          {calendarEvents[`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`] && (
            <div className="doctor-dashboard-calendar-events">
              <h4>Events on {selectedDate.toLocaleDateString()}</h4>
              <ul>
                {calendarEvents[`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`].map((event, index) => (
                  <li key={index}>{event}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recent Requests Table */}
        <div className="doctor-dashboard-user-table-section doctor-dashboard-animate-slide-right" style={{ animationDelay: '2.0s' }}>
          <h3>Recent Requests</h3>
          <table className="doctor-dashboard-user-table">
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
                <tr
                  key={request.id || index}
                  className="doctor-dashboard-user-table-row doctor-dashboard-animate-slide-up"
                  style={{ animationDelay: `${2.2 + index * 0.05}s` }}
                  onClick={() => handleRowClick(request)}
                >
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{request.username}</td>
                  <td>{request.childName}</td>
                  <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="doctor-dashboard-pagination">
            <span className="doctor-dashboard-pagination-info">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, requests.length)} of {requests.length} entries
            </span>
            <div className="doctor-dashboard-pagination-buttons">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={currentPage === 1 ? 'doctor-dashboard-pagination-button-disabled' : ''}
              >
                Previous
              </button>
              <span className="doctor-dashboard-current-page">{currentPage}</span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={currentPage === totalPages ? 'doctor-dashboard-pagination-button-disabled' : ''}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="doctor-dashboard-sidebar-section doctor-dashboard-animate-slide-right" style={{ animationDelay: '2.4s' }}>
          <div className="doctor-dashboard-profile-card">
            <div className="doctor-dashboard-profile-photo">
              <span role="img" aria-label="doctor">👨‍⚕️</span>
            </div>
            <h4>Dr. John Doe</h4>
            <p>Pediatrician</p>
            <div className="doctor-dashboard-profile-stats">
              <div className="doctor-dashboard-profile-stat">
                <span className="doctor-dashboard-stat-label">Experience</span>
                <span className="doctor-dashboard-stat-value">15 Years</span>
              </div>
              <div className="doctor-dashboard-profile-stat">
                <span className="doctor-dashboard-stat-label">Patients</span>
                <span className="doctor-dashboard-stat-value">1,200</span>
              </div>
            </div>
          </div>

          <div className="doctor-dashboard-clock-widget">
            <h3>Current Time</h3>
            <p>{currentTime.toLocaleTimeString()}</p>
          </div>

          <div className="doctor-dashboard-weather-widget">
            <h3>Weather Today</h3>
            <div className="doctor-dashboard-weather-location">
              <select value={weatherLocation} onChange={handleWeatherLocationChange}>
                {Object.keys(mockWeatherData).map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            <div className="doctor-dashboard-weather-content">
              <WeatherIcon condition={weatherData.condition} />
              <div className="doctor-dashboard-weather-details">
                <p>{weatherData.condition}</p>
                <p>{weatherData.temperature}°C</p>
                <p>{weatherData.location}</p>
              </div>
            </div>
          </div>

          <div className="doctor-dashboard-quote-section">
            <h3>Quote of the Day</h3>
            <p className="doctor-dashboard-quote-text">{getQuoteOfTheDay()}</p>
          </div>

          <div className="doctor-dashboard-tips-section">
            <h3>Daily Tips</h3>
            <ul>
              {tips.map((tip, index) => (
                <li key={index} className="doctor-dashboard-animate-slide-up" style={{ animationDelay: `${2.6 + index * 0.1}s` }}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {error && (
        <div className="doctor-dashboard-error-message doctor-dashboard-animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p>{error}</p>
          <button onClick={fetchAllData} className="doctor-dashboard-retry-button">
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;