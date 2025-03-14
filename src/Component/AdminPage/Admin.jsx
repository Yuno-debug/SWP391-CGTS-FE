import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../../Component/LoginPage/AuthContext";
import { useNavigate } from "react-router-dom"; 

const Admin = () => {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState({
    'user-management': false,
    'child-profile': false,
    'doctor-management': false,
  });
  const navigate = useNavigate(); // Khởi tạo điều hướng
  const { handleLogout } = useContext(AuthContext);

  const handleLogoutAndRedirect = () => {
    handleLogout();  // Gọi hàm logout
    navigate("/");   // Điều hướng về trang chủ
  };
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
      // Gọi API lấy số lượng Child
      const childrenResponse = await axios.get('http://localhost:5200/api/Child/count')
        .then(res => res.data)
        .catch(err => {
          console.error("Error fetching child count:", err.response?.data || err.message);
          return { count: 0 };
        });

      // Gọi API lấy số lượng Doctor
      const doctorsResponse = await axios.get('http://localhost:5200/api/Doctor/count')
        .then(res => res.data)
        .catch(err => {
          console.error("Error fetching doctor count:", err.response?.data || err.message);
          return 0; // Nếu API trả về số thay vì object, trả về 0 nếu lỗi
        });

      console.log("Children Response:", childrenResponse);
      console.log("Doctors Response:", doctorsResponse);

      setData(prevData => ({
        ...prevData,
        totalChildren: childrenResponse.count || 0,
        totalDoctors: typeof doctorsResponse === 'number' ? doctorsResponse : (doctorsResponse.count || 0), // Kiểm tra nếu là số nguyên
      }));

    } catch (error) {
      console.error("Error fetching data:", error);
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
      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-header">
            <img src={logo} alt="Logo" className="logo" />
          <div className="logoTitle"> Admin CGTS</div>
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
                Doctor Manage
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
            <li><button onClick={handleLogoutAndRedirect}>Logout</button></li>
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