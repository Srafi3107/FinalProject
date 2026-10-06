import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockListings } from '../data/mockData';
import ListingCard from '../components/ListingCard';
import './ListingDetails.css';

const ListingDetails = () => {
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const listing = mockListings.find((item) => item.id === Number(id));

  // Similar listings from same area or other areas
  const similarListings = mockListings
    .filter((item) => item.id !== Number(id) && (item.area === listing?.area || item.bedrooms === listing?.bedrooms))
    .slice(0, 2);

  if (!listing) {
    return (
      <div className="container listing-not-found-container">
        <div className="card text-center" style={{ padding: '3.5rem 2rem', margin: '3rem auto', maxWidth: '600px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏚️</div>
          <h2>Dhaka Listing Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
            We couldn't locate listing #{id}. It may have been rented or removed by the property owner.
          </p>
          <Link to="/listings" className="btn btn-primary">
            &larr; Back to Dhaka Listings
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    area,
    address,
    rent,
    bedrooms,
    bathrooms,
    size,
    furnished,
    hasWifi,
    hasGas,
    hasLift,
    hasGenerator,
    tenantType = [],
    genderAllowed,
    description,
    owner,
    rating,
    reviewsCount,
    depositMonths,
    serviceCharge,
    images = []
  } = listing;

  const handleActionClick = (actionName) => {
    setActionNotice(`"${actionName}" will connect to live backend API on Week 2 (Day 14).`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="listing-details-page">
      {/* Breadcrumb Navigation */}
      <div className="container">
        <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="crumb-sep">/</span>
          <Link to="/listings">Dhaka Listings</Link>
          <span className="crumb-sep">/</span>
          <Link to={`/listings?area=${encodeURIComponent(area)}`}>{area}</Link>
          <span className="crumb-sep">/</span>
          <span className="current-crumb">{title}</span>
        </nav>
      </div>

      <div className="container details-container">
        {/* Main Details Column */}
        <main className="details-main-column">
          {/* Header */}
          <div className="details-header">
            <div className="details-badges-row">
              <span className="badge badge-primary">📍 {area}</span>
              <span className="badge badge-secondary">{furnished}</span>
              {owner?.isVerified && (
                <span className="badge badge-success">&#10003; Verified Owner</span>
              )}
            </div>

            <h1 className="details-title">{title}</h1>
            <p className="details-address">📍 {address}</p>
          </div>

          {/* Photo Showcase */}
          <div className="details-gallery">
            <div className="main-photo-wrapper">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={title}
                className="main-photo"
              />
            </div>

            {images.length > 1 && (
              <div className="thumbnail-row">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Key Specs Card */}
          <div className="details-specs-card card">
            <div className="spec-metric">
              <span className="spec-metric-icon">🛏️</span>
              <div className="spec-metric-info">
                <span className="spec-metric-val">{bedrooms} Bedrooms</span>
                <span className="spec-metric-lbl">Room Layout</span>
              </div>
            </div>

            <div className="spec-metric">
              <span className="spec-metric-icon">🚿</span>
              <div className="spec-metric-info">
                <span className="spec-metric-val">{bathrooms} Baths</span>
                <span className="spec-metric-lbl">Sanitary</span>
              </div>
            </div>

            <div className="spec-metric">
              <span className="spec-metric-icon">📐</span>
              <div className="spec-metric-info">
                <span className="spec-metric-val">{size} sqft</span>
                <span className="spec-metric-lbl">Total Area</span>
              </div>
            </div>

            <div className="spec-metric">
              <span className="spec-metric-icon">🛗</span>
              <div className="spec-metric-info">
                <span className="spec-metric-val">{hasLift ? 'Elevator Available' : 'No Lift'}</span>
                <span className="spec-metric-lbl">Building Access</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="details-section card">
            <h2 className="section-heading">About This Dhaka Home</h2>
            <p className="details-desc-text">{description}</p>
          </section>

          {/* Amenities & Utilities */}
          <section className="details-section card">
            <h2 className="section-heading">Facilities &amp; Amenities</h2>
            <div className="amenities-grid">
              <div className={`amenity-feature ${hasWifi ? 'enabled' : 'disabled'}`}>
                <span className="feature-icon">{hasWifi ? '✓' : '✗'}</span>
                <span>High-Speed WiFi Internet</span>
              </div>

              <div className={`amenity-feature ${hasGas ? 'enabled' : 'disabled'}`}>
                <span className="feature-icon">{hasGas ? '✓' : '✗'}</span>
                <span>Gas Supply (Titas/Cylinder)</span>
              </div>

              <div className={`amenity-feature ${hasLift ? 'enabled' : 'disabled'}`}>
                <span className="feature-icon">{hasLift ? '✓' : '✗'}</span>
                <span>Elevator / Lift</span>
              </div>

              <div className={`amenity-feature ${hasGenerator ? 'enabled' : 'disabled'}`}>
                <span className="feature-icon">{hasGenerator ? '✓' : '✗'}</span>
                <span>Generator Backup Power</span>
              </div>

              <div className="amenity-feature enabled">
                <span className="feature-icon">✓</span>
                <span>Water Supply 24/7</span>
              </div>

              <div className="amenity-feature enabled">
                <span className="feature-icon">✓</span>
                <span>CCTV &amp; Night Guard Security</span>
              </div>
            </div>
          </section>

          {/* Tenant Eligibility & Guidelines */}
          <section className="details-section card">
            <h2 className="section-heading">Tenant Eligibility &amp; Rules</h2>
            <div className="rules-grid">
              <div className="rule-item">
                <span className="rule-label">Allowed Tenants:</span>
                <div className="rule-tags">
                  {tenantType.map((type) => (
                    <span key={type} className="badge badge-primary">
                      {type.replace('_', ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rule-item">
                <span className="rule-label">Gender Allowed:</span>
                <span className="rule-value">
                  {genderAllowed === 'any' ? 'Open to All (Male / Female / Family)' : `${genderAllowed.toUpperCase()} Only`}
                </span>
              </div>

              <div className="rule-item">
                <span className="rule-label">Security Deposit:</span>
                <span className="rule-value">{depositMonths} Months Advanced Rent</span>
              </div>

              <div className="rule-item">
                <span className="rule-label">Service Charge:</span>
                <span className="rule-value">৳ {serviceCharge.toLocaleString()} / month</span>
              </div>
            </div>
          </section>
        </main>

        {/* Sidebar Sticky Actions Column */}
        <aside className="details-sidebar-column">
          <div className="pricing-action-card card">
            {actionNotice && (
              <div className="action-notice-box">
                {actionNotice}
              </div>
            )}

            <div className="sidebar-rent-row">
              <div className="sidebar-rent">
                <span className="currency">৳</span>
                <span className="amount">{rent.toLocaleString()}</span>
                <span className="period">/ month</span>
              </div>
              {rating && (
                <div className="sidebar-rating">
                  <span>★ {rating}</span>
                  <span className="reviews-sub">({reviewsCount} reviews)</span>
                </div>
              )}
            </div>

            <div className="sidebar-meta-list">
              <div className="meta-line">
                <span>Monthly Rent:</span>
                <strong>৳ {rent.toLocaleString()}</strong>
              </div>
              <div className="meta-line">
                <span>Service Charge:</span>
                <strong>৳ {serviceCharge.toLocaleString()}</strong>
              </div>
              <div className="meta-line">
                <span>Deposit (Refundable):</span>
                <strong>৳ {(rent * depositMonths).toLocaleString()}</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sidebar-buttons">
              <button
                type="button"
                className="btn btn-primary btn-lg full-width"
                onClick={() => handleActionClick('Schedule a Visit')}
              >
                📅 Schedule a Free Visit
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-lg full-width"
                onClick={() => handleActionClick('Send Rent Request')}
              >
                🏠 Send Rent Request
              </button>

              <button
                type="button"
                className={`btn btn-outline full-width save-btn ${isSaved ? 'saved' : ''}`}
                onClick={() => setIsSaved(!isSaved)}
              >
                {isSaved ? '❤️ Saved to Favorites' : '🤍 Save Property'}
              </button>
            </div>

            {/* Owner Info Box */}
            <div className="owner-profile-box">
              <div className="owner-avatar">
                {owner?.name?.charAt(0) || 'O'}
              </div>
              <div className="owner-info">
                <span className="owner-name">{owner?.name}</span>
                <span className="owner-role">Property Owner</span>
                {owner?.isVerified && (
                  <span className="owner-verified-tag">&#10003; NID Verified</span>
                )}
              </div>
            </div>
            <div className="owner-contact-row">
              <span>Contact:</span>
              <a href={`tel:${owner?.phone}`} className="owner-phone-link">
                📞 {owner?.phone}
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Similar Listings Carousel / Row */}
      {similarListings.length > 0 && (
        <section className="container similar-listings-section">
          <div className="similar-header">
            <h2>Similar Homes in {area}</h2>
            <Link to={`/listings?area=${encodeURIComponent(area)}`} className="view-more-link">
              View more in {area} &rarr;
            </Link>
          </div>
          <div className="similar-grid">
            {similarListings.map((sim) => (
              <ListingCard key={sim.id} listing={sim} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ListingDetails;
