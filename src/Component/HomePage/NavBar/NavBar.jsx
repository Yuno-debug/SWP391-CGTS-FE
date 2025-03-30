import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { Bell } from "react-feather";
import "./Navbar.css";
import logo2 from "../../../assets/logo.png";
import { AuthContext } from "../../LoginPage/AuthContext";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddChildDropdown, setShowAddChildDropdown] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false); // Thêm state cho Doctor dropdown
  const [alerts, setAlerts] = useState([]);
  const dropdownRef = useRef(null);
  const addChildDropdownRef = useRef(null);
  const alertsDropdownRef = useRef(null);
  const doctorDropdownRef = useRef(null); // Thêm ref cho Doctor dropdown
  const { isLoggedIn, userName, avatar, handleLogout } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/Alert")
        .then((res) => res.json())
        .then((data) => setAlerts(data))
        .catch((error) => console.error("Lỗi khi lấy dữ liệu cảnh báo:", error));
    }
  }, [isLoggedIn]);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
    if (addChildDropdownRef.current && !addChildDropdownRef.current.contains(event.target)) {
      setShowAddChildDropdown(false);
    }
    if (alertsDropdownRef.current && !alertsDropdownRef.current.contains(event.target)) {
      setShowAlertsDropdown(false);
    }
    if (doctorDropdownRef.current && !doctorDropdownRef.current.contains(event.target)) {
      setShowDoctorDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className="nav">
      <div className="nav-left">
        <img className="nav-logo2" src={logo2} alt="Logo" />
        <div className="nav-logo">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Children Growth Tracking System
          </NavLink>
        </div>
      </div>

      <ul className="nav-menu">
        <li>
          <NavLink
            to={isLoggedIn ? "/mempage" : "/"}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            HOME
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            ABOUT US
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/membership"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            MEMBERSHIP PLAN
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/blog"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            BLOG
          </NavLink>
        </li>
        {isLoggedIn && (
          <li className="nav-menu__item" ref={addChildDropdownRef}>
            <div
              className="nav-menu__item-label"
              onClick={() => setShowAddChildDropdown(!showAddChildDropdown)}
            >
              CHILDREN
              <span className="nav-menu__dropdown-arrow">
                {showAddChildDropdown ? "▲" : "▼"}
              </span>
            </div>
            {showAddChildDropdown && (
              <div className="nav-menu__dropdown">
                <NavLink
                  to="/add-child"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Add New Child
                </NavLink>
                <NavLink
                  to="/ConsultationResponse"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Consultation Request
                </NavLink>
                <NavLink
                  to="/ConsultationResponse"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Consultation Response
                </NavLink>
              </div>
            )}
          </li>
        )}
        
          <li className="nav-menu__item" ref={doctorDropdownRef}>
            <div
              className="nav-menu__item-label"
              onClick={() => setShowDoctorDropdown(!showDoctorDropdown)}
            >
              DOCTOR
              <span className="nav-menu__dropdown-arrow">
                {showDoctorDropdown ? "▲" : "▼"}
              </span>
            </div>
            {showDoctorDropdown && (
              <div className="nav-menu__dropdown">
                <NavLink
                  to="/doctors-list"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Doctor List
                </NavLink>
              </div>
            )}
          </li>
      </ul>

      <ul className="nav-right">
        {isLoggedIn ? (
          <li className="nav-user" ref={dropdownRef}>
            <div className="user-infor" onClick={() => setShowDropdown(!showDropdown)}>
              <img src={avatar || "/defaultAvatar.jpg"} alt="User Avatar" className="navbar-avatar" />
              <span className="user-name">{userName || "Guest"}</span>
              <span className="dropdown-arrow">{showDropdown ? "▲" : "▼"}</span>
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/"
                  onClick={handleLogout}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Logout
                </NavLink>
              </div>
            )}
          </li>
        ) : (
          <>
            <li className="nav-contact">
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Log In
              </NavLink>
            </li>
            <li className="nav-contact">
              <NavLink
                to="/signup"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Sign Up
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;