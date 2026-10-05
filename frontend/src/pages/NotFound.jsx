import React from 'react';
import { Link } from 'react-router-dom';
import { DHAKA_AREAS } from '../data/mockData';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container not-found-container">
        <div className="not-found-card">
          <div className="not-found-visual">
            <span className="not-found-error-code">404</span>
            <div className="not-found-icon">🏚️</div>
          </div>

          <span className="badge badge-secondary">Location Unavailable</span>
          <h1 className="not-found-title">Lost in Dhaka? Page Not Found</h1>
          <p className="not-found-desc">
            The house listing, roommate profile, or URL you're searching for might have been relocated, rented out, or never existed in Dhaka.
          </p>

          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary btn-lg">
              &larr; Return to Home
            </Link>
            <Link to="/listings" className="btn btn-outline btn-lg">
              Browse Dhaka Listings
            </Link>
          </div>

          <div className="popular-dhaka-areas">
            <span className="areas-heading">Or explore popular neighborhoods:</span>
            <div className="areas-pills">
              {DHAKA_AREAS.slice(0, 6).map((area) => (
                <Link
                  key={area}
                  to={`/listings?area=${encodeURIComponent(area)}`}
                  className="area-pill"
                >
                  📍 {area}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
