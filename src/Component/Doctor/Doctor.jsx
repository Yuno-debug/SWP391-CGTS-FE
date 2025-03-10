import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import "./Doctor.css";
import logo from './../../assets/logo.png';
import DoctorDashboard from "./DoctorDashboard";           
import ConsultationRequests from "./ConsultationRequests"; 
import GrowthData from "./GrowthData";                     
// import Advice from "./Advice";                             
// import MemberFeedback from "./MemberFeedback";             

const DoctorPage = () => {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [expandedSections, setExpandedSections] = useState({
    consultation: false, 
    growth: false,
  });

  // Toggle submenu
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Render nội dung theo phần đã chọn
  const renderSection = () => {
    switch (selectedSection) {
      case "dashboard":
        return <DoctorDashboard />;
      case "consultation":
        return <ConsultationRequests />;
      case "growth":
        return <GrowthData />;
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
          <Link to="/">
                      <img src={logo} alt="Logo" className="logo" />
                    </Link>
          <div className="logoDoctor"> <Link to="/">Doctor Manage</Link></div>
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
                Tư Vấn List
                <FontAwesomeIcon icon={expandedSections["consultation"] ? faChevronUp : faChevronDown} className="chevron-icon" />
              </button>
              {expandedSections["consultation"] && (
                <ul className="submenu">
                  <li><button onClick={() => setSelectedSection("consultation")}>Danh sách yêu cầu</button></li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={() => toggleSection("growth")}>
                Hồ sơ & dữ liệu tăng trưởng
                <FontAwesomeIcon icon={expandedSections["growth"] ? faChevronUp : faChevronDown} className="chevron-icon" />
              </button>
              {expandedSections["growth"] && (
                <ul className="submenu">
                  <li><button onClick={() => setSelectedSection("growth")}>Xem hồ sơ</button></li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={() => setSelectedSection("advice")}>
                Đánh giá &amp; Lời khuyên
              </button>
            </li>
            <li>
              <button onClick={() => setSelectedSection("feedback")}>
                Phản hồi từ Member
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
