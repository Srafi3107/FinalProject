import React from 'react';
import { Link } from 'react-router-dom';
import { mockListings } from '../../data/mockData';

const RecommendedHouses = ({ tenantPreferences }) => {
  // Mock AI Content-Based Filtering calculation
  const targetBudget = tenantPreferences?.targetBudget || 15000;
  const preferredAreas = tenantPreferences?.preferredAreas || ['Mirpur', 'Dhanmondi'];

  // Select top 3 relevant listings
  const recommendedListings = mockListings
    .map((listing) => {
      let score = 70;
      const reasons = [];

      // Budget scoring
      if (listing.rent <= targetBudget + 7000) {
        score += 12;
        reasons.push(`Within budget range (৳ ${listing.rent.toLocaleString()}/mo)`);
      }

      // Area scoring
      if (preferredAreas.includes(listing.area)) {
        score += 15;
        reasons.push(`Matches preferred Dhaka area (${listing.area})`);
      }

      // Bachelor / Student allowed
      if (listing.tenantType.includes('bachelor') || listing.tenantType.includes('student')) {
        score += 5;
        reasons.push('Bachelor & student friendly building');
      }

      // Facilities
      if (listing.hasWifi && tenantPreferences?.wifiRequired) {
        reasons.push('High-speed WiFi included');
      }
      if (listing.hasLift && tenantPreferences?.liftRequired) {
        reasons.push('Elevator access');
      }

      const finalScore = Math.min(score, 98);
      return {
        ...listing,
        aiScore: finalScore,
        aiReasons: reasons.slice(0, 3)
      };
    })
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 3);

  return (
    <div className="card dashboard-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-title">AI House Recommendations</h2>
          <p className="card-desc">
            Personalized content-based filtering ranked according to your housing budget, preferred Dhaka areas, and essential amenities.
          </p>
        </div>
        <span className="badge badge-primary">&#9889; Content-Based Filtering</span>
      </div>

      <div className="recommended-listings-grid">
        {recommendedListings.map((house) => (
          <div key={house.id} className="recommended-house-card">
            <div className="rec-img-wrapper">
              <img src={house.images[0]} alt={house.title} className="rec-img" />
              <div className="rec-score-pill">
                &#9889; {house.aiScore}% Match
              </div>
            </div>

            <div className="rec-body">
              <div className="rec-top-meta">
                <span className="badge-area-sm">📍 {house.area}</span>
                <span className="rec-price">৳ {house.rent.toLocaleString()} <small>/mo</small></span>
              </div>

              <h4 className="rec-title">
                <Link to={`/listings/${house.id}`}>{house.title}</Link>
              </h4>

              <div className="rec-specs">
                <span>🛏️ {house.bedrooms} Bed</span>
                <span>&bull;</span>
                <span>🚿 {house.bathrooms} Bath</span>
                <span>&bull;</span>
                <span>📐 {house.size} sqft</span>
              </div>

              {/* AI Reasons */}
              <div className="rec-reasons-box">
                <span className="reasons-heading">AI Match Factors:</span>
                <ul className="reasons-list">
                  {house.aiReasons.map((reason, idx) => (
                    <li key={idx} className="reason-item">
                      ✓ {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rec-action-row">
                <Link to={`/listings/${house.id}`} className="btn btn-outline btn-sm full-width">
                  View Full Details &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedHouses;
