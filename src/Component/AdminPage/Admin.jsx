import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faChevronUp,
  faTachometerAlt,
  faUsers,
  faUserMd,
  faDollarSign,
  faBlog,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
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
  const navigate = useNavigate();
  const { handleLogout } = useContext(AuthContext);

  const handleLogoutAndRedirect = () => {
    handleLogout();
    navigate("/");
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
        const childrenResponse = await axios.get('http://localhost:5200/api/Child/count')
          .then(res => res.data)
          .catch(err => {
            console.error("Error fetching child count:", err.response?.data || err.message);
            return { count: 0 };
          });

        const doctorsResponse = await axios.get('http://localhost:5200/api/Doctor/count')
          .then(res => res.data)
          .catch(err => {
            console.error("Error fetching doctor count:", err.response?.data || err.message);
            return 0;
          });

        console.log("Children Response:", childrenResponse);
        console.log("Doctors Response:", doctorsResponse);

        setData(prevData => ({
          ...prevData,
          totalChildren: childrenResponse.count || 0,
          totalDoctors: typeof doctorsResponse === 'number' ? doctorsResponse : (doctorsResponse.count || 0),
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
          <div className="logoTitle">Admin CGTS</div>
        </div>
        <nav>
          <ul>
            <li>
              <button 
                onClick={() => setSelectedSection('dashboard')}
                className={selectedSection === 'dashboard' ? 'active' : ''}
              >
                <FontAwesomeIcon icon={faTachometerAlt} className="menu-icon" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => toggleSection('user-management')}
                className={selectedSection === 'user-management' ? 'active' : ''}
              >
                <FontAwesomeIcon icon={faUsers} className="menu-icon" />
                <span>User Management</span>
                <FontAwesomeIcon 
                  icon={expandedSections['user-management'] ? faChevronUp : faChevronDown} 
                  className="chevron-icon" 
                />
              </button>
              {expandedSections['user-management'] && (
                <ul className="submenu">
                  <li>
                    <button onClick={() => setSelectedSection('user-management')}>
                      Manage Users
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button 
                onClick={() => toggleSection('doctor-management')}
                className={selectedSection === 'doctor-management' ? 'active' : ''}
              >
                <FontAwesomeIcon icon={faUserMd} className="menu-icon" />
                <span>Doctor Manage</span>
                <FontAwesomeIcon 
                  icon={expandedSections['doctor-management'] ? faChevronUp : faChevronDown} 
                  className="chevron-icon" 
                />
              </button>
              {expandedSections['doctor-management'] && (
                <ul className="submenu">
                  <li>
                    <button onClick={() => setSelectedSection('doctor-management')}>
                      Manage Doctors
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button 
                onClick={() => setSelectedSection('membership-management')}
                className={selectedSection === 'membership-management' ? 'active' : ''}
              >
                <FontAwesomeIcon icon={faDollarSign} className="menu-icon" />
                <span>Manage Membership</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedSection('blog-management')}
                className={selectedSection === 'blog-management' ? 'active' : ''}
              >
                <FontAwesomeIcon icon={faBlog} className="menu-icon" />
                <span>Blog Manage</span>
              </button>
            </li>
            <li>
              <button onClick={handleLogoutAndRedirect}>
                <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                <span>Logout</span>
              </button>
            </li>
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