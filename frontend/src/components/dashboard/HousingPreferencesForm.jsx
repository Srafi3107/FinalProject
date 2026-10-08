import React, { useState } from 'react';
import { DHAKA_AREAS } from '../../data/mockData';
import Button from '../common/Button';

const HousingPreferencesForm = ({ initialPreferences, onSave }) => {
  const [formData, setFormData] = useState(initialPreferences || {
    targetBudget: 15000,
    preferredAreas: ['Mirpur', 'Dhanmondi'],
    roomType: 'bachelor',
    furnished: 'Furnished',
    wifiRequired: true,
    gasRequired: true,
    liftRequired: true,
    moveInDate: '2026-11-01'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleArea = (area) => {
    setFormData((prev) => {
      const exists = prev.preferredAreas.includes(area);
      const newAreas = exists
        ? prev.preferredAreas.filter((a) => a !== area)
        : [...prev.preferredAreas, area];
      return { ...prev, preferredAreas: newAreas };
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="card dashboard-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-title">Housing Preferences</h2>
          <p className="card-desc">
            Define your budget and desired home amenities for AI content-based filtering.
          </p>
        </div>
        <span className="badge badge-primary">AI Recommender Input</span>
      </div>

      {savedSuccess && (
        <div className="alert-success" style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
          ✓ Housing preferences saved successfully! AI house recommendations updated.
        </div>
      )}

      <form onSubmit={handleSubmit} className="dashboard-form">
        {/* Monthly Budget */}
        <div className="form-group">
          <div className="label-row-between">
            <label className="form-label">Target Monthly Budget (BDT)</label>
            <span className="badge badge-primary">৳ {Number(formData.targetBudget).toLocaleString()} / mo</span>
          </div>
          <input
            type="range"
            name="targetBudget"
            min="5000"
            max="50000"
            step="1000"
            value={formData.targetBudget}
            onChange={handleInputChange}
            className="form-range-slider"
          />
          <div className="range-bounds-text">
            <span>Min: ৳ 5,000</span>
            <span>Max: ৳ 50,000+</span>
          </div>
        </div>

        {/* Preferred Dhaka Areas Multi-Select */}
        <div className="form-group">
          <label className="form-label">
            Preferred Dhaka Neighborhoods <span className="helper-hint">(Select all that apply)</span>
          </label>
          <div className="tags-select-grid">
            {DHAKA_AREAS.map((area) => {
              const isSelected = formData.preferredAreas.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  className={`tag-toggle-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleArea(area)}
                >
                  {isSelected ? '✓ ' : '+ '} {area}
                </button>
              );
            })}
          </div>
        </div>

        {/* Room / Flat Type & Furnishing */}
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Accommodation Type</label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="bachelor">Bachelor Sublet Room</option>
              <option value="flat">Entire Flat (Shared/Family)</option>
              <option value="seat">Student Mess Seat</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Furnishing Status</label>
            <select
              name="furnished"
              value={formData.furnished}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="Furnished">Fully Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
              <option value="Any">Any / No Preference</option>
            </select>
          </div>
        </div>

        {/* Desired Facilities Checkboxes */}
        <div className="form-group">
          <label className="form-label">Essential Facilities Required</label>
          <div className="checkbox-pills-row">
            <label className={`checkbox-pill ${formData.wifiRequired ? 'checked' : ''}`}>
              <input
                type="checkbox"
                name="wifiRequired"
                checked={formData.wifiRequired}
                onChange={handleInputChange}
              />
              <span>📶 WiFi Required</span>
            </label>

            <label className={`checkbox-pill ${formData.gasRequired ? 'checked' : ''}`}>
              <input
                type="checkbox"
                name="gasRequired"
                checked={formData.gasRequired}
                onChange={handleInputChange}
              />
              <span>🔥 Gas Line/Supply</span>
            </label>

            <label className={`checkbox-pill ${formData.liftRequired ? 'checked' : ''}`}>
              <input
                type="checkbox"
                name="liftRequired"
                checked={formData.liftRequired}
                onChange={handleInputChange}
              />
              <span>🛗 Lift / Elevator</span>
            </label>
          </div>
        </div>

        {/* Move-in Date */}
        <div className="form-group" style={{ maxWidth: '300px' }}>
          <label className="form-label">Expected Move-in Date</label>
          <input
            type="date"
            name="moveInDate"
            value={formData.moveInDate}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        <div className="form-submit-row">
          <Button type="submit" variant="primary" size="md">
            Save Housing Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HousingPreferencesForm;
