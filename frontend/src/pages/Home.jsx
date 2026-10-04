import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DHAKA_AREAS } from '../data/mockData';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('');
  const [roomType, setRoomType] = useState('any');
  const [budgetRange, setBudgetRange] = useState('any');

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (selectedArea) queryParams.append('area', selectedArea);
    if (roomType !== 'any') queryParams.append('type', roomType);
    if (budgetRange !== 'any') queryParams.append('budget', budgetRange);

    const queryString = queryParams.toString();
    navigate(`/listings${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="home-page">
      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="sparkle-icon">&#10024;</span>
              <span>AI-Powered Housing & Roommate Matching for Dhaka</span>
            </div>

            <h1 className="hero-title">
              Find Your Ideal Home & <span className="highlight-text">Compatible Roommates</span> in Dhaka
            </h1>

            <p className="hero-subtitle">
              Say goodbye to dishonest broker fees and messy roommate conflicts. HomeMatch uses smart AI similarity algorithms to match university students and working bachelors with verified Dhaka apartments and like-minded roommates.
            </p>

            {/* Quick Search Card */}
            <div className="hero-search-card">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-field">
                  <label className="field-label">Preferred Area</label>
                  <select
                    className="field-input"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                  >
                    <option value="">All Dhaka Areas</option>
                    {DHAKA_AREAS.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div className="search-field">
                  <label className="field-label">Looking For</label>
                  <select
                    className="field-input"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                  >
                    <option value="any">Any Accommodation</option>
                    <option value="family">Full Flat (Family / Shared)</option>
                    <option value="bachelor">Bachelor Sublet Room</option>
                    <option value="student">Student Seat / Mess</option>
                  </select>
                </div>

                <div className="search-field">
                  <label className="field-label">Monthly Budget (BDT)</label>
                  <select
                    className="field-input"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                  >
                    <option value="any">Any Budget</option>
                    <option value="under10k">Under 10,000 BDT</option>
                    <option value="10k-20k">10,000 - 20,000 BDT</option>
                    <option value="20k-35k">20,000 - 35,000 BDT</option>
                    <option value="above35k">Above 35,000 BDT</option>
                  </select>
                </div>

                <div className="search-submit">
                  <button type="submit" className="btn btn-primary search-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Action CTAs */}
            <div className="hero-actions">
              <Link to="/listings" className="btn btn-primary btn-lg">
                Browse Dhaka Houses
              </Link>
              <Link to="/roommates" className="btn btn-outline btn-lg">
                Find Compatible Roommates
              </Link>
            </div>
          </div>

          {/* Hero Visual Preview Card */}
          <div className="hero-visual">
            <div className="preview-card">
              <div className="preview-badge-row">
                <span className="badge badge-success">&#10003; Verified Owner</span>
                <span className="ai-score-pill">&#9889; 94% Lifestyle Match</span>
              </div>

              <div className="preview-image-placeholder">
                <div className="mock-property-tag">Modern 3-Bed Flat &bull; Mirpur-DOHS</div>
              </div>

              <div className="preview-body">
                <div className="preview-rent-row">
                  <span className="preview-price">৳ 24,000 <small>/month</small></span>
                  <span className="badge badge-primary">Bachelor & Student Friendly</span>
                </div>
                <h4 className="preview-title">Sunny Furnished Flat with WiFi & Lift</h4>
                <div className="preview-tags">
                  <span className="spec-tag">3 Bed</span>
                  <span className="spec-tag">2 Bath</span>
                  <span className="spec-tag">1250 sqft</span>
                  <span className="spec-tag">Gas + Lift</span>
                </div>
                <div className="preview-reasons">
                  <div className="reason-item">&#127771; Both non-smokers (Quiet hours: 11 PM)</div>
                  <div className="reason-item">&#127828; Cleanliness preference aligns (Score: 5/5)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS / HIGHLIGHTS BAR ================= */}
      <section className="stats-bar">
        <div className="container stats-container">
          <div className="stat-card">
            <span className="stat-number">10+</span>
            <span className="stat-label">Dhaka Neighborhoods (Mirpur, Uttara, Banani...)</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <span className="stat-number">5-Factor</span>
            <span className="stat-label">Weighted AI Matching (Smoking, Cleanliness, Sleep)</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <span className="stat-number">100%</span>
            <span className="stat-label">Zero Hidden Broker Commission</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <span className="stat-number">Real-Time</span>
            <span className="stat-label">Scraped Dhaka Rent Market Intelligence</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
