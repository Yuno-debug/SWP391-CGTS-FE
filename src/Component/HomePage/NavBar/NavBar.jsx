import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo2 from "../../../assets/logo.png";
import searchIcon from "../../../assets/searchIcon.png";
import userAvatar from "../../../assets/userAvatar.svg";
import { AuthContext } from "../../LoginPage/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const { isLoggedIn, userName, setUserName, userId, handleLogout } = useContext(AuthContext);

  // Xử lý click ngoài Search & Dropdown
  const handleClickOutside = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearch(false);
    }
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`${API_URL}/api/UserAccount/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.ok ? res.json() : Promise.reject(`HTTP error! Status: ${res.status}`))
        .then((data) => {
          if (data.success && data.user) {
            setUserName(data.user.username);
        
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          setUserName("Guest");
        });
    }
  }, [userId, setUserName]);

  return (
    <div className="nav">
      <div className="nav-left">
        <img className="nav-logo2" src={logo2} alt="Logo" />
        <div className="nav-logo">
          <Link to="/">Children Growth Tracking System</Link>
        </div>
      </div>
      <ul className="nav-menu">
        <li><Link to="/">HOME</Link></li>
        <li><Link to="/about">ABOUT US</Link></li>
        <li><Link to="/membership">MEMBERSHIP PLAN</Link></li>
        <li><Link to="/blog">BLOG</Link></li>
      </ul>
      <ul className="nav-right">
        {isLoggedIn ? (
          <li className="nav-user" ref={dropdownRef}>
            <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
              <img src={userAvatar} alt="User Avatar" className="user-avatar" />
              <span className="user-name">{userName || "Guest"}</span>
              <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile">Profile</Link>
                <Link to="/" onClick={handleLogout}>Logout</Link>
              </div>
            )}
          </li>
        ) : (
          <>
            <li className="nav-contact"><Link to="/login">Log In</Link></li>
            <li className="nav-contact"><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;