import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo2 from "../../../assets/logo.png";
import { AuthContext } from "../../LoginPage/AuthContext";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { isLoggedIn, userName, avatar, handleLogout } = useContext(AuthContext);

  // Đóng dropdown khi click ngoài
  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
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
            <div className="user-infor" onClick={() => setShowDropdown(!showDropdown)}>
              <img src={avatar || "/defaultAvatar.jpg"} alt="User Avatar" className="navbar-avatar" />
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