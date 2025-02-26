import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import logo from './../../assets/logo.png';
import Dashboard from './Dashboard';
import User from './User';
import AdminPanel from './AdminPanel';
import './Admin.css';

const Admin = () => {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState({
    'user-management': false,
    'child-profile': false,
    'doctor-management': false,
  });
  const [data, setData] = useState({
    totalRevenue: 0,
    totalChildren: 0,
    totalDoctors: 0,
    users: [],
    doctors: [],
    memberships: [],
    settings: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const childrenResponse = await axios.get('http://localhost:5200/api/Child/count');
        const doctorsResponse = await axios.get('API_URL/doctors');
        const usersResponse = await axios.get('API_URL/users');
        const membershipsResponse = await axios.get('API_URL/memberships');
        const settingsResponse = await axios.get('API_URL/settings');

        console.log("Children Response:", childrenResponse.data);
        console.log("Doctors Response:", doctorsResponse.data);
        console.log("Users Response:", usersResponse.data);
        console.log("Memberships Response:", membershipsResponse.data);
        console.log("Settings Response:", settingsResponse.data);

        setData({
          totalChildren: childrenResponse.data.count,
          totalDoctors: doctorsResponse.data.total,
          users: usersResponse.data,
          doctors: doctorsResponse.data,
          memberships: membershipsResponse.data,
          settings: settingsResponse.data
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error response:", error.response);
      }
    };

    fetchData();
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
        return <Dashboard totalRevenue={data.totalRevenue} totalChildren={data.totalChildren} totalDoctors={data.totalDoctors} />;
      case 'user-management':
        return <User users={data.users} />;
      case 'doctor-management':
        return (
          <section id="doctor-management">
            <h1 className="section-title">Doctor Management</h1>
            <ul>
              {data.doctors.map(doctor => (
                <li key={doctor.id}>{doctor.name}</li>
              ))}
            </ul>
          </section>
        );
      case 'membership-management':
        return (
          <section id="membership-management">
            <h1 className="section-title">Membership Management</h1>
            <AdminPanel memberships={data.memberships} />
          </section>
        );
      case 'settings':
        return (
          <section id="settings">
            <h1 className="section-title">Settings</h1>
            <pre>{JSON.stringify(data.settings, null, 2)}</pre>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <div className="logoTitle"> <Link to="/">Admin CGTS</Link></div>
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
                </ul>
              )}
            </li>
            <li><button onClick={() => setSelectedSection('membership-management')}>Manage Membership</button></li>
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

export default Admin;
