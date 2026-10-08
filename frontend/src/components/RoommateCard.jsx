import React, { useState } from 'react';
import './RoommateCard.css';

const RoommateCard = ({ roommate, onSendRequest }) => {
  const [requestSent, setRequestSent] = useState(false);
  const [showBio, setShowBio] = useState(false);

  if (!roommate) return null;

  const {
    id,
    name,
    age,
    gender,
    occupation,
    institution,
    avatar,
    preferredAreas = [],
    budget,
    isVerified,
    bio,
    smoking,
    cleanliness,
    sleepTime,
    cookingFrequency,
    matchScore = 85,
    reasons = []
  } = roommate;

  const handleRequestClick = () => {
    setRequestSent(!requestSent);
    if (onSendRequest) onSendRequest(id, !requestSent);
  };

  return (
    <div className="roommate-card">
      {/* Top Banner & Avatar Header */}
      <div className="roommate-header">
        <div className="roommate-avatar-box">
          <img src={avatar} alt={name} className="roommate-avatar" />
          {isVerified && <span className="roommate-verify-badge" title="Student ID / NID Verified">✓</span>}
        </div>

        <div className="roommate-title-meta">
          <div className="name-age-row">
            <h3 className="roommate-name">{name}</h3>
            <span className="roommate-age">({age})</span>
            <span className={`gender-badge ${gender}`}>
              {gender === 'female' ? '♀ Female' : '♂ Male'}
            </span>
          </div>
          <p className="roommate-occupation">{occupation}</p>
          <span className="roommate-institution">{institution}</span>
        </div>

        {/* AI Score Badge */}
        <div className="roommate-ai-badge" title="Weighted Cosine Similarity + KNN Score">
          <span className="score-percent">{matchScore}%</span>
          <span className="score-label">AI Match</span>
        </div>
      </div>

      {/* Areas & Budget Row */}
      <div className="roommate-location-budget">
        <div className="meta-item">
          <span className="meta-label">Preferred Areas:</span>
          <div className="areas-pill-list">
            {preferredAreas.map((area) => (
              <span key={area} className="area-badge-chip">📍 {area}</span>
            ))}
          </div>
        </div>

        <div className="meta-item budget-item">
          <span className="meta-label">Target Budget:</span>
          <span className="budget-value">৳ {Number(budget).toLocaleString()} <small>/mo</small></span>
        </div>
      </div>

      {/* Lifestyle Traits Pill Icons */}
      <div className="roommate-lifestyle-chips">
        <span className="trait-chip">
          {smoking === 'non_smoker' ? '🚭 Non-Smoker' : '🚬 Smoker'}
        </span>
        <span className="trait-chip">
          🧼 Cleanliness {cleanliness}/5
        </span>
        <span className="trait-chip">
          {sleepTime === 'early' && '🌅 Early Sleeper'}
          {sleepTime === 'normal' && '🌙 Normal Hours'}
          {sleepTime === 'night_owl' && '🦉 Night Owl'}
        </span>
        <span className="trait-chip">
          {cookingFrequency === 'daily' && '🍳 Cooks Daily'}
          {cookingFrequency === 'occasional' && '🍳 Occasional'}
          {cookingFrequency === 'none' && '🥡 Dine Out'}
        </span>
      </div>

      {/* AI Plain-English Reasons Box */}
      {reasons && reasons.length > 0 && (
        <div className="roommate-reasons-container">
          <span className="reasons-title">Why AI Matched You:</span>
          <ul className="reasons-bullet-list">
            {reasons.map((reason, idx) => (
              <li key={idx} className="reason-bullet">
                <span className="bullet-check">✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Optional Bio Toggle */}
      {showBio && bio && (
        <div className="roommate-bio-drawer">
          <p className="bio-drawer-text">"{bio}"</p>
        </div>
      )}

      {/* Action Footer */}
      <div className="roommate-card-footer">
        <button
          type="button"
          className="btn-bio-toggle"
          onClick={() => setShowBio(!showBio)}
        >
          {showBio ? 'Hide Bio' : 'Read Bio'}
        </button>

        <button
          type="button"
          className={`btn ${requestSent ? 'btn-success' : 'btn-primary'} btn-sm roommate-request-btn`}
          onClick={handleRequestClick}
        >
          {requestSent ? '✓ Request Sent' : 'Connect as Roommate'}
        </button>
      </div>
    </div>
  );
};

export default RoommateCard;
