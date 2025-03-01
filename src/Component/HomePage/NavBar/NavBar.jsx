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
  const [username, setUsername] = useState(""); // State lưu username
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const { isLoggedIn } = useContext(AuthContext);

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

  // Gọi API để lấy thông tin người dùng đang đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    console.log("isLoggedIn:", isLoggedIn);
    console.log("token:", token);

    if (isLoggedIn && token) {
      fetch("http://localhost:5200/api/UserAccount/get-all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log("API response status:", response.status);
          return response.json();
        })
        .then((data) => {
          console.log("API response data:", data);
          if (data.success && data.user) {
            setUsername(data.user.username);
            console.log("Username set to:", data.user.username);
          } else {
            console.error("API response error:", data);
          }
        })
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, [isLoggedIn]);

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
        {/* Ô tìm kiếm */}
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
              <span className="user-name">{username}</span>
              <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile">Profile</Link>
                <Link to="/logout" onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}>Logout</Link>
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
