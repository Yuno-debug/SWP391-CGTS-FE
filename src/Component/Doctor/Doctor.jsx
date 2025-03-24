import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faBars, faStethoscope, faChartLine, faStar, faSignOutAlt, faUser, faHome, faEnvelope, faComment, faChartPie } from '@fortawesome/free-solid-svg-icons';
import "./Doctor.css";
import logo from './../../assets/logo.png';
import DoctorDashboard from "./DoctorDashboard";
import ConsultationRequests from "./ConsultationRequests";
import ConsultationResponses from "./ConsultationResponses";
import GrowthData from "./GrowthData";
import RatingFeedback from "./RatingFeedback";
import { AuthContext } from "../../Component/LoginPage/AuthContext";

// Updated profile image with the provided URL
const profileImage = "https://lirp.cdn-website.com/md/dmip/dms3rep/multi/opt/medical-doctor-office-1920w.jpg";

const DoctorPage = () => {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [expandedSections, setExpandedSections] = useState({
    consultation: false,
    consultationResponses: false,
    growth: false,
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const navigate = useNavigate();
  const { handleLogout } = useContext(AuthContext);

  const handleLogoutAndRedirect = () => {
    handleLogout();
    navigate("/");
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const toggleSettingsDropdown = () => {
    setShowSettingsDropdown(prev => !prev);
  };

  const renderSection = () => {
    switch (selectedSection) {
      case "dashboard":
        return <DoctorDashboard />;
      case "consultation":
        return <ConsultationRequests />;
      case "consultationResponses":
        return <ConsultationResponses />;
      case "growth":
        return <GrowthData />;
      case "feedback":
        return <RatingFeedback />;
      case "profile":
        return <div><h1>Profile Page</h1></div>;
      default:
        return <DoctorDashboard />;
    }
  };

  return (
    <div className="doctor-container">
      <aside className={`doctor-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="logo" />
          {!sidebarCollapsed && <div className="logoDoctor">Doctor Management</div>}
        </div>
        <div className="sidebar-controls">
          <button className="sidebar-toggle-top" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <div className="profile-section">
          <div className="profile-button">
            <img
              src={profileImage}
              alt="Profile"
              className="profile-picture"
            />
            <div className="profile-info">
              <div className="profile-name">John Doe</div>
              <div className="profile-role">Doctor</div>
            </div>
          </div>
        </div>
        <nav>
          <ul>
            <li className="section-title">Main</li>
            <li>
              <button
                onClick={() => setSelectedSection("dashboard")}
                className={selectedSection === "dashboard" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faHome} className="menu-icon" />
                <span className="menu-text">Home</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => toggleSection("consultation")}
                aria-expanded={expandedSections["consultation"]}
              >
                <FontAwesomeIcon icon={faStethoscope} className="menu-icon" />
                <span className="menu-text">Consultation Requests</span>
                <FontAwesomeIcon
                  icon={expandedSections["consultation"] ? faChevronUp : faChevronDown}
                  className="chevron-icon"
                />
              </button>
              {expandedSections["consultation"] && (
                <ul className={`submenu ${expandedSections["consultation"] ? 'submenu-open' : ''}`}>
                  <li>
                    <button onClick={() => setSelectedSection("consultation")}>
                      <span className="menu-text">List</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => toggleSection("consultationResponses")}
                aria-expanded={expandedSections["consultationResponses"]}
              >
                <FontAwesomeIcon icon={faStethoscope} className="menu-icon" />
                <span className="menu-text">Consultation Responses</span>
                <FontAwesomeIcon
                  icon={expandedSections["consultationResponses"] ? faChevronUp : faChevronDown}
                  className="chevron-icon"
                />
              </button>
              {expandedSections["consultationResponses"] && (
                <ul className={`submenu ${expandedSections["consultationResponses"] ? 'submenu-open' : ''}`}>
                  <li>
                    <button onClick={() => setSelectedSection("consultationResponses")}>
                      <span className="menu-text">List</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={() => toggleSection("growth")} aria-expanded={expandedSections["growth"]}>
                <FontAwesomeIcon icon={faChartLine} className="menu-icon" />
                <span className="menu-text">Growth Data</span>
                <FontAwesomeIcon
                  icon={expandedSections["growth"] ? faChevronUp : faChevronDown}
                  className="chevron-icon"
                />
              </button>
              {expandedSections["growth"] && (
                <ul className={`submenu ${expandedSections["growth"] ? 'submenu-open' : ''}`}>
                  <li>
                    <button onClick={() => setSelectedSection("growth")}>
                      <span className="menu-text">Data</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => setSelectedSection("feedback")}
                className={selectedSection === "feedback" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faStar} className="menu-icon" />
                <span className="menu-text">Rating Feedback</span>
              </button>
            </li>
            <li className="section-title">Pages</li>
            <li>
              <button
                onClick={() => setSelectedSection("profile")}
                className={selectedSection === "profile" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faUser} className="menu-icon" />
                <span className="menu-text">Profile</span>
              </button>
            </li>
            <li>
              <button onClick={handleLogoutAndRedirect} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                <span className="menu-text">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="doctor-content">
        <header className="content-header">
          <div className="header-icons">
            <button className="header-icon" onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <button className="header-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </button>
            <button className="header-icon" onClick={toggleSettingsDropdown}>
              <FontAwesomeIcon icon={faChartPie} />
            </button>
            {showSettingsDropdown && (
              <div className="settings-dropdown">
                <button onClick={() => setSelectedSection("profile")}>
                  <FontAwesomeIcon icon={faUser} className="dropdown-icon" />
                  View Profile
                </button>
                <button onClick={() => navigate("/contact")}>
                  <FontAwesomeIcon icon={faComment} className="dropdown-icon" />
                  Contact
                </button>
                <button onClick={() => navigate("/analytics")}>
                  <FontAwesomeIcon icon={faChartPie} className="dropdown-icon" />
                  Analytics
                </button>
                <button onClick={handleLogoutAndRedirect}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="dropdown-icon" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>
        {renderSection()}
      </main>
    </div>
  );
};

export default DoctorPage;