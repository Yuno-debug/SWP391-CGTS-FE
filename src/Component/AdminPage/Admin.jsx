import React, { useState } from "react";
import './Admin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import logo from './../../assets/logo.png';

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState({
    'user-management': false,
    'child-profile': false,
    'doctor-management': false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
            <p>Welcome to the Admin Dashboard.</p>
          </section>
        );
      case 'user-management':
        return (
          <section id="user-management">
            <h1 className="section-title">User Management</h1>
            <p>Manage users here.</p>
          </section>
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
          <div className="logoTitle"> <Link to="/">Children Growth Tracking System</Link></div>
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
