import React from "react";
import "./Footer.css"; // Import without styles module for proper global styling
import fbIcon from "../../../assets/social.png";
import youtubeIcon from "../../../assets/video.png";
import instagramIcon from "../../../assets/instagram.png";
import logo from "../../../assets/logo.png"; // Update the path to your new logo

export default function Footer() {
  const socialIcons = [
    { src: fbIcon, alt: "Facebook" },
    { src: youtubeIcon, alt: "Youtube" },
    { src: instagramIcon, alt: "Instagram" },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section about">
          <h3>About CGTS</h3>
          <p>The Child Growth Tracking System (CGTS) is dedicated to helping parents and healthcare 
            providers monitor and support the healthy growth and development of children. Our mission 
            is to provide accurate 
            and accessible tools for tracking children's growth milestones.</p>
        </div>

        {/* Links Section */}
        <div className="footer-section quick-links">
          <h4>Quick Links</h4>
          <ul>
            <li>About us</li>
            <li>Our Products</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact">
          <h4>Contact</h4>
          <p>Email: cgts@gmail.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Address: Lưu Hữu Phước Tân Lập, Đông Hoà, Dĩ An, Bình Dương, Việt Nam</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div className="brand">
          <img src={logo} alt="Logo" className="logo" />
          <span>Child Growth Tracking System </span>
        </div>

        {/* Social Media Icons */}
        <div className="social-icons">
          <img src={fbIcon} alt="Facebook" className="social-icon" />
          <img src={youtubeIcon} alt="Youtube" className="social-icon" />
          <img src={instagramIcon} alt="Instagram" className="social-icon" />
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="footer-nav">
        <ul>
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
          <li>FAQ</li>
        </ul>
      </div>

      {/* Copyright */}
      <div className="copyright">
        &copy; 2025 Child Growth Tracking System. All rights reserved.
      </div>
    </footer>
  );
}
