import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ListingCard.css';

const ListingCard = ({ listing }) => {
  const [imageError, setImageError] = useState(false);

  if (!listing) return null;

  const {
    id,
    title,
    area,
    rent,
    bedrooms,
    bathrooms,
    size,
    furnished,
    hasWifi,
    hasGas,
    hasLift,
    tenantType = [],
    genderAllowed,
    images = [],
    owner,
    rating
  } = listing;

  const displayImage = images && images.length > 0 && !imageError
    ? images[0]
    : null;

  const isBachelor = tenantType.includes('bachelor') || tenantType.includes('student');

  return (
    <div className="listing-card">
      {/* Property Image Container */}
      <div className="listing-img-box">
        {displayImage ? (
          <img
            src={displayImage}
            alt={title}
            className="listing-img"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="listing-img-placeholder">
            <span className="placeholder-icon">🏠</span>
            <span className="placeholder-text">{area} Apartment</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="listing-badges-top">
          <span className="badge-area">📍 {area}</span>
          {isBachelor ? (
            <span className="badge-type badge-bachelor">Bachelor / Student</span>
          ) : (
            <span className="badge-type badge-family">Family Only</span>
          )}
        </div>

        {/* Verified Owner Badge */}
        {owner?.isVerified && (
          <div className="verified-badge-pill" title="Owner NID/ID Verified by HomeMatch">
            <span className="check-icon">✓</span> Verified Owner
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="listing-body">
        {/* Price & Rating Row */}
        <div className="listing-price-row">
          <div className="price-tag">
            <span className="currency">৳</span>
            <span className="amount">{rent.toLocaleString()}</span>
            <span className="period">/mo</span>
          </div>
          {rating && (
            <div className="listing-rating" title={`${rating} rating`}>
              <span className="star">★</span>
              <span className="rating-num">{rating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="listing-title">
          <Link to={`/listings/${id}`} title={title}>
            {title}
          </Link>
        </h3>

        {/* Specs Row */}
        <div className="listing-specs">
          <span className="spec-item" title="Bedrooms">
            <span className="spec-icon">🛏️</span>
            <span>{bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </span>
          <span className="spec-dot">&bull;</span>
          <span className="spec-item" title="Bathrooms">
            <span className="spec-icon">🚿</span>
            <span>{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </span>
          <span className="spec-dot">&bull;</span>
          <span className="spec-item" title="Size in square feet">
            <span className="spec-icon">📐</span>
            <span>{size} sqft</span>
          </span>
        </div>

        {/* Features & Amenities Pills */}
        <div className="listing-amenities">
          <span className="amenity-pill">{furnished}</span>
          {hasWifi && <span className="amenity-pill">WiFi</span>}
          {hasGas && <span className="amenity-pill">Gas</span>}
          {hasLift && <span className="amenity-pill">Lift</span>}
          {genderAllowed !== 'any' && (
            <span className="amenity-pill pill-gender">
              {genderAllowed === 'female' ? 'Female Only' : 'Male Only'}
            </span>
          )}
        </div>

        {/* Card Footer / Action */}
        <div className="listing-footer">
          <Link to={`/listings/${id}`} className="btn btn-outline btn-sm view-details-btn">
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
