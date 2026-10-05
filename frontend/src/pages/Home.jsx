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

  const steps = [
    {
      number: '01',
      title: 'Set Habits & Budget',
      desc: 'Define your budget, preferred Dhaka neighborhood, and lifestyle habits (smoking, sleep hours, cleanliness 1-5, cooking).'
    },
    {
      number: '02',
      title: 'AI Matches You',
      desc: 'Our Weighted Cosine Similarity & KNN algorithms score compatible roommates and rank suitable apartments with clear reasons.'
    },
    {
      number: '03',
      title: 'Schedule Free Visits',
      desc: 'Connect with verified owners directly. Book in-person visits without paying any broker fees or middleman charges.'
    },
    {
      number: '04',
      title: 'Split Rent & Settle',
      desc: 'Pair up with matched roommates, use the built-in Rent Split Calculator for utilities, and find shared 2+ bedroom flats.'
    }
  ];

  const features = [
    {
      icon: '🧠',
      title: 'Weighted AI Roommate Matching',
      desc: 'Scientific lifestyle matching based on smoking (30%), cleanliness (25%), sleep time (20%), budget (15%), and cooking habits (10%).'
    },
    {
      icon: '📊',
      title: 'Scraped Dhaka Market Dashboard',
      desc: 'Real-time rent analytics scraped from Bikroy, bdHousing, and Rents.com.bd. Compare average rents by area and bedrooms.'
    },
    {
      icon: '🛡️',
      title: 'Overpriced Rent Warning',
      desc: 'Machine learning Random Forest model predicts fair market rent and alerts you if a listing is overpriced by over 25%.'
    },
    {
      icon: '👥',
      title: 'Shared Houses for Pairs',
      desc: 'Matched roommates can merge their budgets and common area preferences to find 2+ room apartments together automatically.'
    },
    {
      icon: '🧮',
      title: 'Smart Rent Split Calculator',
      desc: 'Easily divide base rent, gas, electricity, service charge, and WiFi costs between flatmates with complete transparency.'
    },
    {
      icon: '✅',
      title: 'NID & Student ID Verification',
      desc: 'Upload university student ID or NID to earn a Verified badge, boosting trust for bachelors, female students, and landlords.'
    }
  ];

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

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="section-padding how-it-works-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="badge badge-primary">Step-by-Step Flow</span>
            <h2 className="section-title">How HomeMatch Works</h2>
            <p className="section-subtitle">
              From finding compatible flatmates to verifying property owners, your Dhaka housing journey is simple and safe.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step, idx) => (
              <div key={idx} className="step-card">
                <div className="step-number-pill">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="section-padding features-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="badge badge-secondary">Built for Dhaka</span>
            <h2 className="section-title">AI-Powered Features for Urban Housing</h2>
            <p className="section-subtitle">
              Smart tools built to eliminate pain points faced by students, bachelors, and landlords across Dhaka.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon-wrapper">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION BANNER ================= */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready to Find Your Home or Roommate in Dhaka?</h2>
              <p>
                Join hundreds of university students, job holders, and property owners in Mirpur, Dhanmondi, Uttara, and across Dhaka.
              </p>
            </div>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-secondary btn-lg">
                Create Free Account
              </Link>
              <Link to="/listings" className="btn btn-outline-white btn-lg">
                Explore Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
