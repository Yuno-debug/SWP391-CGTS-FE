import React from "react";
import "./Footer.css"; // Import CSS file
import fbIcon from '../../assets/social.png';
import youtubeIcon from "../../assets/video.png";
import instagramIcon from "../../assets/instagram.png";

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
          <h3>About Child Growth Tracking System</h3>
          <p>
            The Child Growth Tracking System (CGTS) is dedicated to helping parents and healthcare providers monitor and support the healthy growth and development of children. Our mission is to provide accurate and accessible tools for tracking children's growth milestones.
          </p>
        </div>

        {/* Links Section */}
        <div className="footer-section links">
          <div>
            <h4>About CGTS</h4>
            <ul>
              <li>Our Mission</li>
              <li>Leadership</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <h4>Resources</h4>
            <ul>
              <li>Growth Charts</li>
              <li>Health Tips</li>
              <li>Parenting Guides</li>
              <li>Support Groups</li>
            </ul>
          </div>
        </div>

        {/* Director Section */}
        <div className="footer-section director">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/09/DoMixi1989.jpg"
            alt="CGTS Director"
            className="director-image"
          />
          <h4>CGTS Director</h4>
          <p>John Doe, MD, MPH</p>
        </div>
      </div>

      {/* Footer Navigation */}
      <nav className="footer-nav">
        <ul>
          <li>Contact Us</li>
          <li>About CGTS</li>
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
          <li>FAQ</li>
        </ul>
      </nav>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div className="brand">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/72006acf20ef1dd61788144592394e398a450b65b4ade10d33d1bee26d1fc770?placeholderIfAbsent=true&apiKey=4b2823083f6443d6bf7b2e849ae2d3e3"
            alt="Child Growth Tracking System Logo"
            className="logo"
          />
          <span>Child Growth Tracking System</span>
        </div>

        {/* Social Media Icons */}
        <div className="social-icons">
          {socialIcons.map((icon, index) => (
            <img
              key={index}
              src={icon.src}
              alt={icon.alt}
              className="social-icon"
            />
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright">
        <span>&copy; 2025 Child Growth Tracking System</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
}
