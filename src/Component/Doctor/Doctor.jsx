import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import "./Doctor.css";
import logo from './../../assets/logo.png';
import DoctorDashboard from "./DoctorDashboard";
import ConsultationRequests from "./ConsultationRequests";
import ConsultationResponses from "./ConsultationResponses";
import GrowthData from "./GrowthData";
import Alert from "./Alert"; // Import the Alert component
import { AuthContext } from "../../Component/LoginPage/AuthContext";
// import Advice from "./Advice";
// import MemberFeedback from "./MemberFeedback";

const DoctorPage = () => {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [expandedSections, setExpandedSections] = useState({
    consultation: false,
    consultationResponses: false,
    growth: false,
    alert: false, // Add state for Alert
  });

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
      case "alert":
        return <Alert />; // Render Alert component
      case "advice":
        return <Advice />;
      case "feedback":
        return <MemberFeedback />;
      default:
        return <DoctorDashboard />;
    }
  };

  return (
    <div className="doctor-container">
      <aside className="doctor-sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="logo" />
          <div className="logoDoctor">Doctor Manage</div>
        </div>
        <nav>
          <ul>
            <li>
              <button onClick={() => setSelectedSection("dashboard")}>
                Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => toggleSection("consultation")}>
                Consultation Requests
                <FontAwesomeIcon
                  icon={expandedSections["consultation"] ? faChevronUp : faChevronDown}
                  className="chevron-icon"
                />
              </button>
              {expandedSections["consultation"] && (
                <ul className="submenu">
                  <li>
                    <button onClick={() => setSelectedSection("consultation")}>
                      List
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={() => toggleSection("consultationResponses")}>
                Consultation Responses
                <FontAwesomeIcon
                  icon={expandedSections["consultationResponses"] ? faChevronUp : faChevronDown}
                  className="chevron-icon"
                />
              </button>
              {expandedSections["consultationResponses"] && (
                <ul className="submenu">
                  <li>
                    <button onClick={() => setSelectedSection("consultationResponses")}>
                      List
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={() => toggleSection("growth")}>
                Growth Data
                <FontAwesomeIcon
                  icon={expandedSections["growth"] ? faChevronUp : faChevronDown}
                  className="chevron-icon"
                />
              </button>
              {expandedSections["growth"] && (
                <ul className="submenu">
                  <li>
                    <button onClick={() => setSelectedSection("growth")}>
                      Data
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={() => toggleSection("alert")}>
                Alert
                <FontAwesomeIcon
                  icon={expandedSections["alert"] ? faChevronUp : faChevronDown}
                  className="chevron-icon"
                />
              </button>
              {expandedSections["alert"] && (
                <ul className="submenu">
                  <li>
                    <button onClick={() => setSelectedSection("alert")}>
                      List
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={() => setSelectedSection("advice")}>
                Feedback & Advice
              </button>
            </li>
            <li>
              <button onClick={() => setSelectedSection("feedback")}>
                Rating Feedback
              </button>
            </li>
            <li>
              <button onClick={handleLogoutAndRedirect} className="logout-button">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="doctor-content">
        {renderSection()}
      </main>
    </div>
  );
};

export default DoctorPage;