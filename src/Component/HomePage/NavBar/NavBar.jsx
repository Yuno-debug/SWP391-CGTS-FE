import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo2 from "../../../assets/logo.png";
import searchIcon from "../../../assets/searchIcon.png";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  // Đóng ô tìm kiếm khi bấm ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="nav">
      <div className="nav-left">
        <img className="nav-logo2" src={logo2} alt="" />
        <div className="nav-logo"> <Link to = "/">Children Growth Tracking System</Link></div>
      </div>
      <ul className="nav-menu">
        <li><Link to="/">HOME</Link></li>
        <li><Link to="/features">FEATURES</Link></li>
        <li><Link to="/membership">MEMBERSHIP PLAN</Link></li>

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
      <li className="nav-contact"><Link to="/login">Log In</Link></li>
      <li className="nav-contact"><Link to="/signup">Sign Up</Link></li>
      </ul>
    </div>
  );
};

export default Navbar;
