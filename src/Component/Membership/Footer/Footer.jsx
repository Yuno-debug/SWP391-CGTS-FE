import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About CDC</h3>
          <p>CDC is the nation's leading science-based, data-driven, service organization that protects the public's health. CDC works 24/7 to protect America from health, safety and security threats, both foreign and in the U.S. </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About CDC</a></li>
            <li><a href="/organization">Organization</a></li>
            <li><a href="/leadership">Leadership</a></li>
            <li><a href="/lab-safety">Lab Safety</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Resources</h3>
          <ul>
            <li><a href="/funding">Funding and Grants</a></li>
            <li><a href="/careers">Careers at CDC</a></li>
            <li><a href="/fellowships">Fellowships and Training</a></li>
            <li><a href="/museum">CDC Museum</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 