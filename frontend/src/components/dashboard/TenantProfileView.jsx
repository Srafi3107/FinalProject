import React from 'react';
import Button from '../common/Button';

const TenantProfileView = ({ profile, onSwitchTab }) => {
  const {
    name,
    email,
    phone,
    university,
    occupation,
    isVerified,
    avatar,
    bio,
    housingPreferences = {},
    lifestyleHabits = {}
  } = profile;

  // Calculate profile completeness
  const completenessScore = 90; // High score with all preferences filled

  return (
    <div className="profile-view-stack">
      {/* Main Profile Header Card */}
      <div className="card profile-header-card">
        <div className="profile-avatar-row">
          <div className="profile-avatar-wrapper">
            <img src={avatar} alt={name} className="profile-avatar-img" />
            {isVerified && <span className="avatar-check" title="Verified Badge">✓</span>}
          </div>

          <div className="profile-info-header">
            <div className="profile-name-row">
              <h2 className="profile-name">{name}</h2>
              {isVerified && (
                <span className="badge badge-success">✓ Student ID / NID Verified</span>
              )}
            </div>
            <p className="profile-headline">{occupation} &bull; {university}</p>
            <div className="profile-contacts">
              <span>📧 {email}</span>
              <span>📞 {phone}</span>
              <span>📍 Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>

        {/* Profile Completeness Bar */}
        <div className="completeness-wrapper">
          <div className="completeness-text-row">
            <span className="completeness-label">AI Profile Completeness</span>
            <span className="completeness-val">{completenessScore}%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${completenessScore}%` }}
            ></div>
          </div>
          <p className="completeness-tip">
            Your profile is fully configured to receive accurate AI roommate recommendations.
          </p>
        </div>

        {bio && (
          <div className="profile-bio-box">
            <span className="bio-label">About Me:</span>
            <p className="bio-text">"{bio}"</p>
          </div>
        )}
      </div>

      {/* 2-Column Summary Cards */}
      <div className="grid-2 profile-details-grid">
        {/* Housing Needs Card */}
        <div className="card summary-card">
          <div className="summary-card-header">
            <h3>🏠 Housing Needs Summary</h3>
            <button
              type="button"
              className="edit-tab-link"
              onClick={() => onSwitchTab('housing')}
            >
              Edit &rarr;
            </button>
          </div>

          <div className="summary-list">
            <div className="summary-row">
              <span className="summary-lbl">Target Monthly Budget:</span>
              <strong className="summary-val text-primary">৳ {Number(housingPreferences.targetBudget || 15000).toLocaleString()} / mo</strong>
            </div>

            <div className="summary-row">
              <span className="summary-lbl">Preferred Dhaka Areas:</span>
              <div className="summary-tags">
                {(housingPreferences.preferredAreas || ['Mirpur', 'Dhanmondi']).map((a) => (
                  <span key={a} className="area-tag">{a}</span>
                ))}
              </div>
            </div>

            <div className="summary-row">
              <span className="summary-lbl">Room / Flat Type:</span>
              <strong className="summary-val">
                {housingPreferences.roomType === 'bachelor' && 'Bachelor Sublet Room'}
                {housingPreferences.roomType === 'flat' && 'Entire Flat (Shared)'}
                {housingPreferences.roomType === 'seat' && 'Student Mess Seat'}
              </strong>
            </div>

            <div className="summary-row">
              <span className="summary-lbl">Furnished Status:</span>
              <strong className="summary-val">{housingPreferences.furnished || 'Furnished'}</strong>
            </div>

            <div className="summary-row">
              <span className="summary-lbl">Required Amenities:</span>
              <div className="summary-amenities-pills">
                {housingPreferences.wifiRequired && <span className="amenity-pill">WiFi</span>}
                {housingPreferences.gasRequired && <span className="amenity-pill">Gas Line</span>}
                {housingPreferences.liftRequired && <span className="amenity-pill">Lift</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Lifestyle Habits Card */}
        <div className="card summary-card">
          <div className="summary-card-header">
            <h3>🧠 Lifestyle &amp; Habits (AI)</h3>
            <button
              type="button"
              className="edit-tab-link"
              onClick={() => onSwitchTab('lifestyle')}
            >
              Edit &rarr;
            </button>
          </div>

          <div className="summary-list">
            <div className="summary-row">
              <span className="summary-lbl">Smoking Habit:</span>
              <strong className="summary-val">
                {lifestyleHabits.smoking === 'non_smoker' ? '🚭 Strict Non-Smoker' : 'Smoking Friendly'}
              </strong>
            </div>

            <div className="summary-row">
              <span className="summary-lbl">Cleanliness Level:</span>
              <div className="rating-stars-badge">
                <span className="stars-gold">{'★'.repeat(lifestyleHabits.cleanliness || 5)}</span>
                <span className="stars-num">({lifestyleHabits.cleanliness || 5}/5 - Spotless)</span>
              </div>
            </div>

            <div className="summary-row">
              <span className="summary-lbl">Sleep Hours:</span>
              <strong className="summary-val">
                {lifestyleHabits.sleepTime === 'early' && '🌅 Early Bird (Before 11 PM)'}
                {lifestyleHabits.sleepTime === 'normal' && '🌙 Normal (11 PM - 1 AM)'}
                {lifestyleHabits.sleepTime === 'night_owl' && '🦉 Night Owl (After 1 AM)'}
              </strong>
            </div>

            <div className="summary-row">
              <span className="summary-lbl">Cooking Routine:</span>
              <strong className="summary-val">
                {lifestyleHabits.cookingFrequency === 'daily' && '🍳 Daily Home Cooking'}
                {lifestyleHabits.cookingFrequency === 'occasional' && '🍳 Occasional Cooking'}
                {lifestyleHabits.cookingFrequency === 'none' && '🥡 Dine Out / No Cooking'}
              </strong>
            </div>

            <div className="summary-row">
              <span className="summary-lbl">Guest Policy:</span>
              <strong className="summary-val">
                {lifestyleHabits.guestsPolicy === 'weekends_only' && '👥 Weekends Friends Only'}
                {lifestyleHabits.guestsPolicy === 'no_guests' && '🚫 No Outside Guests'}
                {lifestyleHabits.guestsPolicy === 'flexible' && '🤝 Flexible'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantProfileView;
