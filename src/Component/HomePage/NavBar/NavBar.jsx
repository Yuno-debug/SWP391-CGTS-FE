import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo2 from "../../../assets/logo.png";
import searchIcon from "../../../assets/searchIcon.png";
import userAvatar from "../../../assets/userAvatar.svg";
import { AuthContext } from "../../LoginPage/AuthContext";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const { isLoggedIn, userName, setIsLoggedIn, setUserName } = useContext(AuthContext);
  const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage

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

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5200/api/UserAccount/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setUserName(data.user.username);
          } else {
            setUserName("Guest");
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          setUserName("Guest");
        });
    }
  }, [userId, setUserName]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUserName("Guest");
    window.location.reload();
  };

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
        <div className="search-container" ref={searchRef}>
          <div className="search-toggle" onClick={() => setShowSearch(true)}>
            <img src={searchIcon} alt="Search" className="search-icon" />
            <span className="search-text">SEARCH</span>
          </div>
          {showSearch && (
            <input
              type="text"
              className="search-bar"
              placeholder="Type to search..."
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && setShowSearch(false)}
            />
          )}
        </div>
      </ul>
      <ul className="nav-right">
        {isLoggedIn ? (
          <li className="nav-user" ref={dropdownRef}>
            <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
              <img src={userAvatar} alt="User Avatar" className="user-avatar" />
              <span className="user-name">{userName !== "Loading..." ? userName : "Guest"}</span>
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
