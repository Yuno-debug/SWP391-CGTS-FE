import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DoctorDashboard.css';

// Mock weather icon
const WeatherIcon = ({ condition }) => {
  const icons = {
    Sunny: '☀️',
    Cloudy: '☁️',
    Rainy: '🌧️',
    Stormy: '⛈️',
  };
  return (
    <span role="img" aria-label={condition} style={{ fontSize: '24px' }}>
      {icons[condition] || '☀️'}
    </span>
  );
};

const DoctorDashboard = () => {
  const [users, setUsers] = useState([]);
  const [totalGrowthRecords, setTotalGrowthRecords] = useState(0);
  const [totalChildren, setTotalChildren] = useState(0);
  const [totalConsultationRequests, setTotalConsultationRequests] = useState(0);
  const [totalConsultationResponses, setTotalConsultationResponses] = useState(0);
  const navigate = useNavigate();

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Pagination state for Recent Users
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Weather state
  const [weatherLocation, setWeatherLocation] = useState('Ho Chi Minh City');
  const [weatherData, setWeatherData] = useState({
    condition: 'Sunny',
    temperature: 24,
    location: 'Ho Chi Minh City',
  });

  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock weather data
  const mockWeatherData = {
    'Ho Chi Minh City': { condition: 'Sunny', temperature: 24 },
    'Hanoi': { condition: 'Cloudy', temperature: 20 },
    'Da Nang': { condition: 'Rainy', temperature: 22 },
    'Singapore': { condition: 'Stormy', temperature: 26 },
  };

  // Mock schedule data
  const doctorSchedule = [
    { id: 1, time: "9:00 AM", patient: "John Smith", type: "In-Person Visit" },
    { id: 2, time: "10:30 AM", patient: "Emma Johnson", type: "Online Consultation" },
    { id: 3, time: "1:00 PM", patient: "Michael Brown", type: "In-Person Visit" },
    { id: 4, time: "3:00 PM", patient: "Sarah Davis", type: "Follow-Up Call" },
    { id: 5, time: "4:30 PM", patient: "David Wilson", type: "Online Consultation" },
  ];

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
      if (now.getDate() !== currentDate.getDate() ||
          now.getMonth() !== currentDate.getMonth() ||
          now.getFullYear() !== currentDate.getFullYear()) {
        setCurrentDate(new Date(now));
        setSelectedDate(new Date(now));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [currentDate]);

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
      if (!token) {
        setErrorAndRedirect("No authorization token found. Redirecting to login...");
        return;
      }
      try {
        const response = await axios.get("http://localhost:5200/api/growth-records/count", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (typeof response.data === "number") {
          setTotalGrowthRecords(response.data);
        } else if (typeof response.data === "object" && response.data?.totalGrowthRecords !== undefined) {
          setTotalGrowthRecords(response.data.totalGrowthRecords);
        } else if (typeof response.data === "object" && response.data?.$values?.[0]?.count !== undefined) {
          setTotalGrowthRecords(response.data.$values[0].count);
        } else {
          setTotalGrowthRecords(0);
        }
      } catch (error) {
        console.error("Error fetching total growth records:", error);
        setTotalGrowthRecords(0);
      }
    };

    const fetchTotalChildren = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorAndRedirect("No authorization token found. Redirecting to login...");
        return;
      }
      try {
        const response = await axios.get('http://localhost:5200/api/Child/count', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setTotalChildren(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching total children:", error);
        setTotalChildren(0);
      }
    };

    const fetchTotalConsultationRequests = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorAndRedirect("No authorization token found. Redirecting to login...");
        return;
      }
      try {
        const response = await axios.get('http://localhost:5200/api/ConsultationRequest/get-all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
          setTotalConsultationRequests(response.data.data.$values.length);
        } else {
          setTotalConsultationRequests(0);
        }
      } catch (error) {
        console.error("Error fetching total consultation requests:", error);
        setTotalConsultationRequests(0);
      }
    };

    const fetchTotalConsultationResponses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorAndRedirect("No authorization token found. Redirecting to login...");
        return;
      }
      try {
        const response = await axios.get('http://localhost:5200/api/ConsultationResponse/get-all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
          setTotalConsultationResponses(response.data.data.$values.length);
        } else {
          setTotalConsultationResponses(0);
        }
      } catch (error) {
        console.error("Error fetching total consultation responses:", error);
        setTotalConsultationResponses(0);
      }
    };

    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorAndRedirect("No authorization token found. Redirecting to login...");
        return;
      }
      try {
        const response = await axios.get('http://localhost:5200/api/UserAccount/get-all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
          setUsers(response.data.data.$values);
        } else {
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
    fetchUsers();
  }, [navigate]);

  const [error, setError] = useState(null);

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

  const handleRowClick = (user) => {
    console.log(`Clicked on user: ${user.username || 'N/A'}`);
  };

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
      days.push(<span key={`empty-${i}`} className="calendar-day empty"></span>);
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
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEvent ? 'has-event' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          {day}
          {hasEvent && <span className="event-dot"></span>}
        </span>
      );
    }
    return days;
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Pagination logic for Recent Users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Mock quick actions
  const quickActions = [
    { label: "View Schedule", onClick: () => console.log("View Schedule clicked") },
    { label: "Send Message", onClick: () => console.log("Send Message clicked") },
    { label: "Generate Report", onClick: () => console.log("Generate Report clicked") },
  ];

  // Mock tips/reminders
  const tips = [
    "Remember to review patient charts today!",
    "Schedule a follow-up with your patients this week.",
    "Stay hydrated and take breaks between appointments.",
  ];

  // Mock quotes for Quote of the Day
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

  // Mock progress data
  const progressData = [
    { label: "Consultations Completed", value: 75, max: 100 },
    { label: "Reports Generated", value: 40, max: 50 },
  ];

  return (
    <div className="dashboard-container">
      {/* Enhanced Header Section */}
      <div className="dashboard-header animate-fade-in">
        <div className="header-banner">
          <span role="img" aria-label="doctor" className="header-icon">
            🩺
          </span>
          <div className="header-text">
            <h1>Welcome back, Doctor!</h1>
            <p>You have {totalConsultationRequests} new consultation requests.</p>
            <p className="motivational-quote">"Caring for patients is the heart of medicine." – Hippocrates</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-button animate-slide-up"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main animate-fade-in" style={{ animationDelay: '0.6s' }}>
        {/* Left: Doctor's Schedule Overview */}
        <div className="schedule-overview-section animate-slide-left" style={{ animationDelay: '0.8s' }}>
          <div className="schedule-overview-header">
            <h3>Today's Schedule</h3>
            <button
              className="view-all-button"
              onClick={() => navigate('/doctor/schedule')}
            >
              View Full Schedule
            </button>
          </div>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>TIME</th>
                <th>PATIENT</th>
                <th>APPOINTMENT TYPE</th>
              </tr>
            </thead>
            <tbody>
              {doctorSchedule.length > 0 ? (
                doctorSchedule.map((appointment, index) => (
                  <tr
                    key={appointment.id}
                    className="schedule-table-row animate-slide-up"
                    style={{ animationDelay: `${1.0 + index * 0.05}s` }}
                  >
                    <td>{appointment.time}</td>
                    <td>{appointment.patient}</td>
                    <td>{appointment.type}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    No appointments scheduled for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right: Stats Grid */}
        <div className="stats-grid">
          {[
            { title: "Number of examined children", value: totalGrowthRecords.toLocaleString() },
            { title: "Total Children", value: totalChildren },
            { title: "Consultation Requests", value: totalConsultationRequests },
            { title: "Consultation Responses", value: totalConsultationResponses },
          ].map((stat, index) => (
            <div
              key={stat.title}
              className="stat-card animate-slide-up"
              style={{ animationDelay: `${1.0 + index * 0.1}s` }}
              onClick={() => handleStatCardClick(stat.title)}
            >
              <h4>{stat.title}</h4>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Tracker Section */}
      <div className="progress-section animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <h3>Daily Progress</h3>
        <div className="progress-grid">
          {progressData.map((progress, index) => (
            <div key={index} className="progress-item animate-slide-up" style={{ animationDelay: `${1.4 + index * 0.1}s` }}>
              <div className="progress-label">{progress.label}</div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(progress.value / progress.max) * 100}%` }}
                ></div>
              </div>
              <div className="progress-value">{progress.value}/{progress.max}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="dashboard-bottom animate-fade-in" style={{ animationDelay: '1.6s' }}>
        {/* Left: Calendar */}
        <div className="calendar-section animate-slide-left" style={{ animationDelay: '1.8s' }}>
          <h3>Calendar</h3>
          <div className="calendar">
            <div className="calendar-header">
              <button className="calendar-nav-button" onClick={handlePrevMonth}>{'<'}</button>
              <span>{formatMonthYear()}</span>
              <button className="calendar-nav-button" onClick={handleNextMonth}>{'>'}</button>
            </div>
            <div className="calendar-days">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div className="calendar-grid">
              {generateCalendarDays()}
            </div>
          </div>
          {calendarEvents[`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`] && (
            <div className="calendar-events">
              <h4>Events on {selectedDate.toLocaleDateString()}</h4>
              <ul>
                {calendarEvents[`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`].map((event, index) => (
                  <li key={index}>{event}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Middle: Recent Users Table */}
        <div className="user-table-section animate-slide-right" style={{ animationDelay: '2.0s' }}>
          <h3>Recent Requests</h3>
          <table className="user-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => {
                const userStatus = user.status?.toLowerCase() === 'active' ? 'Active' : 'Inactive';
                return (
                  <tr
                    key={user.userId || index} // Sử dụng userId thay vì id
                    className="animate-slide-up user-table-row"
                    style={{ animationDelay: `${2.2 + index * 0.05}s` }}
                    onClick={() => handleRowClick(user)}
                  >
                    <td>{user.username || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{getRoleName(user.role) || 'N/A'}</td>
                    <td>
                      <span className={`status-badge status-${userStatus.toLowerCase()}`}>
                        {userStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination">
            <span className="pagination-info">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} entries
            </span>
            <div className="pagination-buttons">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={currentPage === 1 ? 'disabled' : ''}
              >
                Previous
              </button>
              <span className="current-page">{currentPage}</span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={currentPage === totalPages ? 'disabled' : ''}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right: Sidebar Section */}
        <div className="sidebar-section animate-slide-right" style={{ animationDelay: '2.4s' }}>
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-photo">
              <span role="img" aria-label="doctor">👨‍⚕️</span>
            </div>
            <h4>Dr. John Doe</h4>
            <p>Pediatrician</p>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-label">Experience</span>
                <span className="stat-value">15 Years</span>
              </div>
              <div className="profile-stat">
                <span className="stat-label">Patients</span>
                <span className="stat-value">1,200</span>
              </div>
            </div>
          </div>

          {/* Clock Widget */}
          <div className="clock-widget">
            <h3>Current Time</h3>
            <p>{currentTime.toLocaleTimeString()}</p>
          </div>

          {/* Weather Widget */}
          <div className="weather-widget">
            <h3>Weather Today</h3>
            <div className="weather-location">
              <select value={weatherLocation} onChange={handleWeatherLocationChange}>
                {Object.keys(mockWeatherData).map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            <div className="weather-content">
              <WeatherIcon condition={weatherData.condition} />
              <div className="weather-details">
                <p>{weatherData.condition}</p>
                <p>{weatherData.temperature}°C</p>
                <p>{weatherData.location}</p>
              </div>
            </div>
          </div>

          {/* Quote of the Day */}
          <div className="quote-section">
            <h3>Quote of the Day</h3>
            <p className="quote-text">{getQuoteOfTheDay()}</p>
          </div>

          {/* Tips/Reminders */}
          <div className="tips-section">
            <h3>Daily Tips</h3>
            <ul>
              {tips.map((tip, index) => (
                <li key={index} className="animate-slide-up" style={{ animationDelay: `${2.6 + index * 0.1}s` }}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;