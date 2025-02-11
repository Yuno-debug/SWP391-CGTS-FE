import React from "react";
import "./Footer.css"; // Import without styles module for proper global styling
import fbIcon from "../../../assets/social.png"
import youtubeIcon from "../../../assets/video.png";
import instagramIcon from "../../../assets/instagram.png";
// import linkedinIcon from "../../assets/linkedin.png";
export default function Footer() {
const socialIcons = [
  { src: fbIcon, alt: "Facebook" },
  { src: youtubeIcon, alt: "Youtube" },
  { src: instagramIcon, alt: "Instagram" },
  // { src: linkedinIcon, alt: "LinkedIn" }
];


  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section about">
          <h3>About CDC</h3>
          <p>
            CDC is the nation's leading science-based, data-driven, service
            organization that protects the public's health. CDC works 24/7 to
            protect America from health, safety, and security threats, both
            foreign and in the U.S.
          </p>
        </div>

        {/* Links Section */}
        <div className="footer-section links">
          <div>
            <h4>About CDC</h4>
            <ul>
              <li>Organization</li>
              <li>Leadership</li>
              <li>Lab Safety</li>
            </ul>
          </div>

          <div>
            <h4>Resources</h4>
            <ul>
              <li>Funding and Grants</li>
              <li>Careers at CDC</li>
              <li>Fellowships and Training</li>
              <li>CDC Museum</li>
            </ul>
          </div>
        </div>

        {/* Director Section */}
        <div className="footer-section director">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/09/DoMixi1989.jpg"
            alt="CDC Director"
            className="director-image"
          />
          <h4>CDC Director</h4>
          <p>Mandy K. Cohen, MD, MPH</p>
        </div>
      </div>

      {/* Footer Navigation */}
      <nav className="footer-nav">
        <ul>
          <li>Contact Us</li>
          <li>About CDC</li>
          <li>Policies</li>
          <li>Languages</li>
          <li>Archive</li>
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
              alt= {icon.alt}
              className="social-icon"
            />
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright">
        <span>HHS.gov</span>
        <span>USA.gov</span>
      </div>
    </footer>
  );
}
