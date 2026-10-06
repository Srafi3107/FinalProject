import React from 'react';
import { DHAKA_AREAS } from '../data/mockData';
import './FilterSidebar.css';

const FilterSidebar = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
  isOpen,
  onClose
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <aside className={`filter-sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="filter-header">
        <div className="filter-title-box">
          <span className="filter-icon">🔍</span>
          <h3 className="filter-heading">Filters</h3>
        </div>
        <div className="filter-header-actions">
          <button
            type="button"
            className="reset-filters-btn"
            onClick={onResetFilters}
            title="Reset all filters"
          >
            Reset
          </button>
          <button
            type="button"
            className="close-drawer-btn"
            onClick={onClose}
            aria-label="Close filters drawer"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="filter-body">
        {/* Dhaka Neighborhood Area */}
        <div className="filter-group">
          <label className="filter-label">Dhaka Area</label>
          <select
            name="area"
            value={filters.area}
            onChange={handleInputChange}
            className="filter-select"
          >
            <option value="">All Dhaka Neighborhoods</option>
            {DHAKA_AREAS.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        {/* Rent Range (BDT) */}
        <div className="filter-group">
          <div className="filter-label-row">
            <label className="filter-label">Max Rent (BDT/month)</label>
            <span className="filter-val-badge">৳ {Number(filters.maxRent).toLocaleString()}</span>
          </div>
          <input
            type="range"
            name="maxRent"
            min="5000"
            max="60000"
            step="1000"
            value={filters.maxRent}
            onChange={handleInputChange}
            className="filter-range"
          />
          <div className="range-bounds">
            <span>৳ 5,000</span>
            <span>৳ 60,000+</span>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="filter-group">
          <label className="filter-label">Bedrooms</label>
          <div className="pill-selector">
            {['any', '1', '2', '3', '4+'].map((bed) => (
              <button
                key={bed}
                type="button"
                className={`filter-pill-btn ${filters.bedrooms === bed ? 'active' : ''}`}
                onClick={() => onFilterChange({ ...filters, bedrooms: bed })}
              >
                {bed === 'any' ? 'Any' : `${bed} Bed`}
              </button>
            ))}
          </div>
        </div>

        {/* Tenant Type Allowed */}
        <div className="filter-group">
          <label className="filter-label">Tenant Type</label>
          <select
            name="tenantType"
            value={filters.tenantType}
            onChange={handleInputChange}
            className="filter-select"
          >
            <option value="any">Any (Bachelor, Student, Family)</option>
            <option value="bachelor">Bachelor Friendly</option>
            <option value="student">Student Seat / Mess</option>
            <option value="family">Family Only</option>
            <option value="job_holder">Job Holder Preferred</option>
          </select>
        </div>

        {/* Furnished Status */}
        <div className="filter-group">
          <label className="filter-label">Furnishing Status</label>
          <select
            name="furnished"
            value={filters.furnished}
            onChange={handleInputChange}
            className="filter-select"
          >
            <option value="any">Any Furnishing</option>
            <option value="Furnished">Fully Furnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>
        </div>

        {/* Gender Allowed */}
        <div className="filter-group">
          <label className="filter-label">Gender Preference</label>
          <div className="pill-selector">
            {[
              { val: 'any', label: 'Any' },
              { val: 'male', label: 'Male Only' },
              { val: 'female', label: 'Female Only' }
            ].map((g) => (
              <button
                key={g.val}
                type="button"
                className={`filter-pill-btn ${filters.genderAllowed === g.val ? 'active' : ''}`}
                onClick={() => onFilterChange({ ...filters, genderAllowed: g.val })}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities Checkboxes */}
        <div className="filter-group">
          <label className="filter-label">Required Facilities</label>
          <div className="checkboxes-stack">
            <label className="filter-checkbox-item">
              <input
                type="checkbox"
                name="hasWifi"
                checked={filters.hasWifi}
                onChange={handleInputChange}
              />
              <span>High-speed WiFi</span>
            </label>

            <label className="filter-checkbox-item">
              <input
                type="checkbox"
                name="hasGas"
                checked={filters.hasGas}
                onChange={handleInputChange}
              />
              <span>Line / Cylinder Gas</span>
            </label>

            <label className="filter-checkbox-item">
              <input
                type="checkbox"
                name="hasLift"
                checked={filters.hasLift}
                onChange={handleInputChange}
              />
              <span>Elevator / Lift</span>
            </label>

            <label className="filter-checkbox-item">
              <input
                type="checkbox"
                name="onlyVerifiedOwners"
                checked={filters.onlyVerifiedOwners}
                onChange={handleInputChange}
              />
              <span>Verified Owners Only</span>
            </label>
          </div>
        </div>

        {/* Results indicator on mobile */}
        <div className="filter-apply-mobile">
          <button type="button" className="btn btn-primary btn-md full-width" onClick={onClose}>
            Show {totalResults} Properties
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
