import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const dhakaAreas = [
    'Mirpur', 'Dhanmondi', 'Uttara', 'Mohammadpur',
    'Banani', 'Gulshan', 'Bashundhara', 'Badda', 'Rampura'
  ];

  return (
    <footer className="footer-root">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Column 1: Brand & Mission */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <div className="footer-brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="footer-brand-title">Home<span className="text-secondary">Match</span></span>
            </div>
            <p className="footer-desc">
              AI-powered housing and compatible roommate matching designed specifically for urban Bangladesh. Helping students, bachelors, and families find reliable homes in Dhaka without unfair broker fees.
            </p>
            <div className="footer-badge">
              <span className="pulse-dot"></span>
              Built for Dhaka, Bangladesh
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/listings">Browse Houses & Flats</Link></li>
              <li><Link to="/roommates">Find Compatible Roommates</Link></li>
              <li><Link to="/market">Rent Market Dashboard</Link></li>
              <li><Link to="/register">Post a Property</Link></li>
              <li><Link to="/login">Sign In</Link></li>
            </ul>
          </div>

          {/* Column 3: Dhaka Neighborhoods */}
          <div className="footer-col">
            <h4 className="footer-heading">Popular Dhaka Areas</h4>
            <div className="footer-area-tags">
              {dhakaAreas.map((area) => (
                <Link
                  key={area}
                  to={`/listings?area=${encodeURIComponent(area)}`}
                  className="area-tag"
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Trust & Safety */}
          <div className="footer-col">
            <h4 className="footer-heading">Trust & Safety</h4>
            <ul className="footer-links">
              <li><span className="safety-item">&#10003; Student / NID Verified Users</span></li>
              <li><span className="safety-item">&#10003; AI Overpriced Rent Detection</span></li>
              <li><span className="safety-item">&#10003; Bachelor & Student Friendly</span></li>
              <li><span className="safety-item">&#10003; Direct Visit Scheduling</span></li>
              <li><span className="safety-item">&#10003; No Hidden Broker Charges</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} HomeMatch. Final Year University Project (Dhaka, Bangladesh).
          </p>
          <div className="footer-tech-stack">
            <span>React + Vite</span>
            <span className="divider">&bull;</span>
            <span>Express</span>
            <span className="divider">&bull;</span>
            <span>MySQL</span>
            <span className="divider">&bull;</span>
            <span>FastAPI AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
