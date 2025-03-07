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
import Doctor from "./Doctor";
import MembershipManage from "./MembershipManage";
import Blog from "./BlogManage";

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

  const [siteTitle, setSiteTitle] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const childrenResponse = await axios.get('http://localhost:5200/api/Child/count');
        const doctorsResponse = await axios.get('http://localhost:5200/api/Doctor/count');
        const usersResponse = await axios.get('');
        const membershipsResponse = await axios.get('');
        const settingsResponse = await axios.get('');

        console.log("Children Response:", childrenResponse.data);
        console.log("Doctors Response:", doctorsResponse.data);
        console.log("Users Response:", usersResponse.data);
        console.log("Memberships Response:", membershipsResponse.data);
        console.log("Settings Response:", settingsResponse.data);

        setData({
          totalChildren: childrenResponse.data.count,
          totalDoctors: doctorsResponse.data,  // Ensure this matches the API response
          users: usersResponse.data,
          doctors: doctorsResponse.data,
          memberships: membershipsResponse.data,
          settings: settingsResponse.data
        });

        setSiteTitle(settingsResponse.data.siteTitle || '');
        setMaintenanceMode(settingsResponse.data.maintenanceMode || false);
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

  const handleSiteTitleChange = (e) => {
    setSiteTitle(e.target.value);
  };

  const handleMaintenanceModeToggle = () => {
    setMaintenanceMode(prevState => !prevState);
  };

  const saveSettings = async () => {
    try {
      await axios.post('http://localhost:5200/api/settings', {
        siteTitle,
        maintenanceMode
      });
      alert('Settings saved successfully');
    } catch (error) {
      console.error("Error saving settings:", error);
      alert('Failed to save settings');
    }
  };

  const renderSection = () => {
    switch (selectedSection) {
      case 'dashboard':
        return <Dashboard totalRevenue={data.totalRevenue} totalChildren={data.totalChildren} totalDoctors={data.totalDoctors} />;
      case 'user-management':
        return <User users={data.users} />;
      case 'doctor-management':
        return <Doctor doctors={data.doctors} />;
      case 'membership-management':
        return <MembershipManage />;
      case 'blog-management':
        return <Blog />;
      case 'settings':
        return (
          <section id="settings">
            <h1 className="section-title">Settings</h1>
            <div>
              <label>
                Site Title:
                <input type="text" value={siteTitle} onChange={handleSiteTitleChange} />
              </label>
            </div>
            <div>
              <label>
                Maintenance Mode:
                <input type="checkbox" checked={maintenanceMode} onChange={handleMaintenanceModeToggle} />
              </label>
            </div>
            <button onClick={saveSettings}>Save Settings</button>
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
            <li><button onClick={() => setSelectedSection('blog-management')}>Blog Manage</button></li>
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