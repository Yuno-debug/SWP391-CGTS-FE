import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <img src="/logo.svg" alt="Medicare Logo" />
          <span>Child Growth Tracking System</span>
        </div>
      </div>
      <nav className="header-center">
        <a href="/" className="nav-link">HOME</a>
        <a href="/features" className="nav-link">FEATURES</a>
        <a href="/about" className="nav-link">ABOUT US</a>
        <a href="/membership" className="nav-link">MEMBERSHIP PLAN</a>
        <a href="/faq" className="nav-link">FAQ</a>
        <a href="/blog" className="nav-link">BLOG</a>
      </nav>
      <div className="header-right">
        <div className="search">
          <input type="text" placeholder="SEARCH" />
          <button className="search-btn">🔍</button>
        </div>
        <div className="auth-buttons">
          <button className="login-btn">LOG IN</button>
          <button className="signup-btn">SIGN UP</button>
        </div>
      </div>
    </header>
  );
};

export default Header;