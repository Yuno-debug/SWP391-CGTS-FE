import React, { useState, useEffect } from "react";
import './Admin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import logo from './../../assets/logo.png';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';
import User from './User';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState({
    'user-management': false,
    'child-profile': false,
    'doctor-management': false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [totalChildrenData, setTotalChildrenData] = useState([]);
  const [unresolvedNotificationsData, setUnresolvedNotificationsData] = useState([]);
  const [doctorResponsesData, setDoctorResponsesData] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  const username = 'Yuno';  // Replace with actual username
  const password = 'HungTran';  // Replace with actual password

  const getAuthHeader = () => {
    const credentials = btoa(`${username}:${password}`);
    return { Authorization: `Basic ${credentials}` };
  };

  useEffect(() => {
    // Fetch Total Children Added
    // axios.get('/api/Child/get-all', { headers: getAuthHeader() })
    //   .then(response => setTotalChildrenData(response.data))
    //   .catch(error => console.error('Error fetching total children data:', error));

    // Fetch Unresolved Notifications
    // axios.get('/api/notifications/unresolved', { headers: getAuthHeader() })
    //   .then(response => setUnresolvedNotificationsData(response.data))
    //   .catch(error => console.error('Error fetching unresolved notifications data:', error));

    // Fetch Doctor Responses
    // axios.get('/api/doctor/responses', { headers: getAuthHeader() })
    //   .then(response => setDoctorResponsesData(response.data))
    //   .catch(error => console.error('Error fetching doctor responses data:', error));

    // Fetch Active Users
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5200/api/UserAccount/get-all', {
          headers: getAuthHeader()
        });

        if (response.data && Array.isArray(response.data)) {
          setActiveUsers(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching active users:", error);
      }
    };

    fetchActiveUsers();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prevState => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const renderSection = () => {
    switch (selectedSection) {
      case 'dashboard':
        return (
          <section id="dashboard">
            <h1 className="section-title">Dashboard</h1>
            <div className="chart-container">
              <div className="chart">
                <h2>Total Children Added</h2>
                <Bar
                  data={{
                    labels: totalChildrenData.map(item => item.month),
                    datasets: [
                      {
                        label: 'Total Children',
                        data: totalChildrenData.map(item => item.count),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
              <div className="chart">
                <h2>Unresolved Notifications</h2>
                <Pie
                  data={{
                    labels: ['Resolved', 'Unresolved'],
                    datasets: [
                      {
                        label: 'Notifications',
                        data: [unresolvedNotificationsData.resolved, unresolvedNotificationsData.unresolved],
                        backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>
              <div className="chart">
                <h2>Doctor Responses</h2>
                <Bar
                  data={{
                    labels: doctorResponsesData.map(item => item.month),
                    datasets: [
                      {
                        label: 'Doctor Responses',
                        data: doctorResponsesData.map(item => item.count),
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="user-table-container">
              <h2>Active Users</h2>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Sex</th>
                    <th>Date of Birth</th>
                    <th>Status</th>
                    <th>Date of Joining</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(activeUsers) && activeUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.fullName}</td>
                      <td>{user.sex}</td>
                      <td>{user.dateOfBirth}</td>
                      <td>{user.status}</td>
                      <td>{user.dateOfJoining}</td>
                      <td>
                        <button onClick={() => handleEdit(user.id)}>Edit</button>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      case 'user-management':
        return (
          <User />
        );
      case 'child-profile':
        return (
          <section id="child-profile">
            <h1 className="section-title">Child Profile</h1>
            <p>Manage child profiles here.</p>
          </section>
        );
      case 'doctor-management':
        return (
          <section id="doctor-management">
            <h1 className="section-title">Doctor Management</h1>
            <p>Manage doctors here.</p>
          </section>
        );
      case 'membership-management':
        return (
          <section id="membership-management">
            <h1 className="section-title">Membership Management</h1>
            <p>Manage memberships here.</p>
          </section>
        );
      case 'alert-notification':
        return (
          <section id="alert-notification">
            <h1 className="section-title">Alert and Notification</h1>
            <p>Manage alerts and notifications here.</p>
          </section>
        );
      case 'settings':
        return (
          <section id="settings">
            <h1 className="section-title">Settings</h1>
            <p>Manage settings here.</p>
          </section>
        );
      default:
        return null;
    }
  };

  const handleEdit = (userId) => {
    // Handle edit user
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    // Handle delete user
    console.log(`Delete user with ID: ${userId}`);
  };

  return (
    <div className="admin-container">
      {/* Nút mở sidebar đặt ngoài sidebar */}
      {!sidebarOpen && (
        <button className="menu-toggle fixed-toggle" onClick={() => setSidebarOpen(true)}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}
      {/* Nội dung của sidebar và main content */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <div className="logoTitle"> <Link to="/">CGTS</Link></div>
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
          </button>
        </div>
        <nav>
          <ul>
            <li><button onClick={() => setSelectedSection('dashboard')}>Dashboard</button></li>
            <li>
              <button onClick={() => toggleSection('user-management')}>
                User Management
                <FontAwesomeIcon icon={expandedSections['user-management'] ? faChevronUp : faChevronDown} className="chevron-icon" />
              </button>
              {expandedSections['user-management'] && (
                <ul className="submenu">
                  <li><button onClick={() => setSelectedSection('user-management')}>Manage Users</button></li>
                  <li><button onClick={() => setSelectedSection('user-roles')}>User Roles</button></li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={() => toggleSection('child-profile')}>
                Child Profile
                <FontAwesomeIcon icon={expandedSections['child-profile'] ? faChevronUp : faChevronDown} className="chevron-icon" />
              </button>
              {expandedSections['child-profile'] && (
                <ul className="submenu">
                  <li><button onClick={() => setSelectedSection('child-profile')}>Manage Child Profiles</button></li>
                  <li><button onClick={() => setSelectedSection('child-health')}>Child Health</button></li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={() => toggleSection('doctor-management')}>
                Doctor Management
                <FontAwesomeIcon icon={expandedSections['doctor-management'] ? faChevronUp : faChevronDown} className="chevron-icon" />
              </button>
              {expandedSections['doctor-management'] && (
                <ul className="submenu">
                  <li><button onClick={() => setSelectedSection('doctor-management')}>Manage Doctors</button></li>
                  <li><button onClick={() => setSelectedSection('doctor-schedules')}>Doctor Schedules</button></li>
                </ul>
              )}
            </li>
            <li><button onClick={() => setSelectedSection('membership-management')}>Membership Management</button></li>
            <li><button onClick={() => setSelectedSection('alert-notification')}>Alert and Notification</button></li>
            <li><button onClick={() => setSelectedSection('settings')}>Settings</button></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashboard;
