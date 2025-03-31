import React, { useState, useEffect, useContext } from "react";
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
import DoctorProfile from "./DoctorProfile";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

const DoctorPage = () => {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [expandedSections, setExpandedSections] = useState({
    consultation: false,
    consultationResponses: false,
    growth: false,
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [doctorData, setDoctorData] = useState({
    name: "John Doe", // Giá trị mặc định
    hospital: "https://lirp.cdn-website.com/md/dmip/dms3rep/multi/opt/medical-doctor-office-1920w.jpg", // Ảnh mặc định
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { handleLogout } = useContext(AuthContext);

  // Hàm lấy dữ liệu bác sĩ từ API
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No userId found in localStorage");
          return;
        }

        const parsedUserId = Number(userId);
        const response = await axios.get(`${API_URL}/api/Doctor`);
        const doctors = response.data.$values;

        const matchedDoctor = doctors.find((d) => Number(d.userId) === parsedUserId);
        if (matchedDoctor) {
          setDoctorData({
            name: matchedDoctor.name || "Unknown Doctor",
            hospital: matchedDoctor.hospital || "https://via.placeholder.com/150", // hospital là URL avatar
          });
        }
      } catch (err) {
        console.error("Error fetching doctor data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

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
        return <DoctorProfile />;
      default:
        return <DoctorDashboard />;
    }
  };

  return (
    <div className="doctor-page">
      <aside className={`doctor-sidebar ${sidebarCollapsed ? 'doctor-sidebar--collapsed' : ''}`}>
        <div className="doctor-sidebar__header">
          <img src={logo} alt="Logo" className="doctor-sidebar__logo" />
          {!sidebarCollapsed && <div className="doctor-sidebar__title">Doctor Management</div>}
        </div>
        <div className="doctor-sidebar__controls">
          <button className="doctor-sidebar__toggle" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <div className="doctor-sidebar__profile">
          <div className="doctor-sidebar__profile-button">
            <img
              src={doctorData.hospital} // Sử dụng hospital làm URL avatar
              alt="Profile"
              className="doctor-sidebar__profile-picture"
            />
            {!sidebarCollapsed && (
              <div className="doctor-sidebar__profile-info">
                <div className="doctor-sidebar__profile-name">{doctorData.name}</div>
                <div className="doctor-sidebar__profile-role">Doctor</div>
              </div>
            )}
          </div>
        </div>
        <nav className="doctor-sidebar__nav">
          <ul>
            <li className="doctor-sidebar__section-title">Main</li>
            <li>
              <button
                onClick={() => setSelectedSection("dashboard")}
                className={selectedSection === "dashboard" ? "doctor-sidebar__nav-item--active" : "doctor-sidebar__nav-item"}
              >
                <FontAwesomeIcon icon={faHome} className="doctor-sidebar__menu-icon" />
                <span className="doctor-sidebar__menu-text">Home</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => toggleSection("consultation")}
                className="doctor-sidebar__nav-item"
                aria-expanded={expandedSections["consultation"]}
              >
                <FontAwesomeIcon icon={faStethoscope} className="doctor-sidebar__menu-icon" />
                <span className="doctor-sidebar__menu-text">Consultation Requests</span>
                <FontAwesomeIcon
                  icon={expandedSections["consultation"] ? faChevronUp : faChevronDown}
                  className="doctor-sidebar__chevron-icon"
                />
              </button>
              {expandedSections["consultation"] && (
                <ul className={`doctor-sidebar__submenu ${expandedSections["consultation"] ? 'doctor-sidebar__submenu--open' : ''}`}>
                  <li>
                    <button onClick={() => setSelectedSection("consultation")} className="doctor-sidebar__submenu-item">
                      <span className="doctor-sidebar__menu-text">List</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => toggleSection("consultationResponses")}
                className="doctor-sidebar__nav-item"
                aria-expanded={expandedSections["consultationResponses"]}
              >
                <FontAwesomeIcon icon={faStethoscope} className="doctor-sidebar__menu-icon" />
                <span className="doctor-sidebar__menu-text">Consultation Responses</span>
                <FontAwesomeIcon
                  icon={expandedSections["consultationResponses"] ? faChevronUp : faChevronDown}
                  className="doctor-sidebar__chevron-icon"
                />
              </button>
              {expandedSections["consultationResponses"] && (
                <ul className={`doctor-sidebar__submenu ${expandedSections["consultationResponses"] ? 'doctor-sidebar__submenu--open' : ''}`}>
                  <li>
                    <button onClick={() => setSelectedSection("consultationResponses")} className="doctor-sidebar__submenu-item">
                      <span className="doctor-sidebar__menu-text">List</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => toggleSection("growth")}
                className="doctor-sidebar__nav-item"
                aria-expanded={expandedSections["growth"]}
              >
                <FontAwesomeIcon icon={faChartLine} className="doctor-sidebar__menu-icon" />
                <span className="doctor-sidebar__menu-text">Growth Data</span>
                <FontAwesomeIcon
                  icon={expandedSections["growth"] ? faChevronUp : faChevronDown}
                  className="doctor-sidebar__chevron-icon"
                />
              </button>
              {expandedSections["growth"] && (
                <ul className={`doctor-sidebar__submenu ${expandedSections["growth"] ? 'doctor-sidebar__submenu--open' : ''}`}>
                  <li>
                    <button onClick={() => setSelectedSection("growth")} className="doctor-sidebar__submenu-item">
                      <span className="doctor-sidebar__menu-text">Data</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => setSelectedSection("feedback")}
                className={selectedSection === "feedback" ? "doctor-sidebar__nav-item--active" : "doctor-sidebar__nav-item"}
              >
                <FontAwesomeIcon icon={faStar} className="doctor-sidebar__menu-icon" />
                <span className="doctor-sidebar__menu-text">Rating Feedback</span>
              </button>
            </li>
            <li className="doctor-sidebar__section-title">Pages</li>
            <li>
              <button
                onClick={() => setSelectedSection("profile")}
                className={selectedSection === "profile" ? "doctor-sidebar__nav-item--active" : "doctor-sidebar__nav-item"}
              >
                <FontAwesomeIcon icon={faUser} className="doctor-sidebar__menu-icon" />
                <span className="doctor-sidebar__menu-text">Profile</span>
              </button>
            </li>
            <li>
              <button onClick={handleLogoutAndRedirect} className="doctor-sidebar__logout">
                <FontAwesomeIcon icon={faSignOutAlt} className="doctor-sidebar__menu-icon" />
                <span className="doctor-sidebar__menu-text">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="doctor-content">
        <header className="doctor-content__header">
          <div className="doctor-content__header-icons">
            <button className="doctor-content__header-icon" onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <button className="doctor-content__header-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </button>
            <button className="doctor-content__header-icon" onClick={toggleSettingsDropdown}>
              <FontAwesomeIcon icon={faChartPie} />
            </button>
            {showSettingsDropdown && (
              <div className="doctor-content__settings-dropdown">
                <button onClick={() => setSelectedSection("profile")}>
                  <FontAwesomeIcon icon={faUser} className="doctor-content__dropdown-icon" />
                  View Profile
                </button>
                <button onClick={() => navigate("/contact")}>
                  <FontAwesomeIcon icon={faComment} className="doctor-content__dropdown-icon" />
                  Contact
                </button>
                <button onClick={() => navigate("/analytics")}>
                  <FontAwesomeIcon icon={faChartPie} className="doctor-content__dropdown-icon" />
                  Analytics
                </button>
                <button onClick={handleLogoutAndRedirect}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="doctor-content__dropdown-icon" />
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