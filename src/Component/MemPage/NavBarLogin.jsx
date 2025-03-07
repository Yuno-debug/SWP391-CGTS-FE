import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavbarLogin.css";
import logo2 from "../../assets/logo.png";
import searchIcon from "../../assets/searchIcon.png";
import userAvatar from "../../assets/userAvatar.svg"; // Add your user avatar image

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Đóng ô tìm kiếm khi bấm ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="nav">
      <div className="nav-left">
        <img className="nav-logo2" src={logo2} alt="" />
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
        <li className="nav-user" ref={dropdownRef}>
          <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
            <img src={userAvatar} alt="User Avatar" className="user-avatar" />
            <span className="user-name">User Name</span>
            <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/profile">Profile</Link>
              <Link to="/logout">Logout</Link>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
