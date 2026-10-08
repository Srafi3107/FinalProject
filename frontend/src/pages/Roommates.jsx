import React, { useState, useMemo } from 'react';
import { mockRoommates, DHAKA_AREAS } from '../data/mockData';
import RoommateCard from '../components/RoommateCard';
import './Roommates.css';

const Roommates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedGender, setSelectedGender] = useState('any');
  const [smokingFilter, setSmokingFilter] = useState('any');
  const [requestCount, setRequestCount] = useState(0);

  const handleRequestChange = (id, isSent) => {
    setRequestCount((prev) => (isSent ? prev + 1 : Math.max(0, prev - 1)));
  };

  // Filter roommates based on search and selected traits
  const filteredRoommates = useMemo(() => {
    return mockRoommates.filter((candidate) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = candidate.name.toLowerCase().includes(query);
        const matchesOccupation = candidate.occupation.toLowerCase().includes(query);
        const matchesInst = candidate.institution.toLowerCase().includes(query);
        if (!matchesName && !matchesOccupation && !matchesInst) return false;
      }

      // 2. Area Filter
      if (selectedArea && !candidate.preferredAreas.includes(selectedArea)) {
        return false;
      }

      // 3. Gender Filter
      if (selectedGender !== 'any' && candidate.gender !== selectedGender) {
        return false;
      }

      // 4. Smoking Filter
      if (smokingFilter === 'non_smoker' && candidate.smoking !== 'non_smoker') {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedArea, selectedGender, smokingFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedArea('');
    setSelectedGender('any');
    setSmokingFilter('any');
  };

  return (
    <div className="roommates-page">
      {/* Hero Banner */}
      <section className="roommates-hero">
        <div className="container">
          <div className="roommates-hero-content">
            <span className="badge badge-secondary">&#9889; AI Weighted Matching Engine</span>
            <h1 className="roommates-title">Find Compatible Roommates in Dhaka</h1>
            <p className="roommates-sub">
              Match with university students and job holders based on lifestyle habits: smoking (30%), cleanliness (25%), sleep routine (20%), budget (15%), and cooking (10%).
            </p>

            {/* Quick Algorithm Insight Banner */}
            <div className="algorithm-weights-badge">
              <span className="weight-item">🚭 Smoking: 30%</span>
              <span className="weight-item">🧼 Cleanliness: 25%</span>
              <span className="weight-item">🌙 Sleep Time: 20%</span>
              <span className="weight-item">💰 Budget: 15%</span>
              <span className="weight-item">🍳 Cooking: 10%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container roommates-content-layout">
        {/* Filter Controls Bar */}
        <div className="roommates-filters-bar card">
          {/* Search Query */}
          <div className="filter-item-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, university (NSU, BRACU, DU)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="roommate-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Area Filter */}
          <div className="filter-item">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="filter-select-input"
            >
              <option value="">All Dhaka Areas</option>
              {DHAKA_AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div className="filter-item">
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="filter-select-input"
            >
              <option value="any">Any Gender</option>
              <option value="male">Male Roommates Only</option>
              <option value="female">Female Roommates Only</option>
            </select>
          </div>

          {/* Smoking Filter */}
          <div className="filter-item">
            <select
              value={smokingFilter}
              onChange={(e) => setSmokingFilter(e.target.value)}
              className="filter-select-input"
            >
              <option value="any">Smoking: Any</option>
              <option value="non_smoker">Strict Non-Smoker Only</option>
            </select>
          </div>

          {/* Reset Action */}
          <button
            type="button"
            className="btn btn-ghost btn-sm reset-all-btn"
            onClick={handleResetFilters}
          >
            Reset Filters
          </button>
        </div>

        {/* Results Header */}
        <div className="roommates-meta-row">
          <span className="results-count-text">
            Showing <strong>{filteredRoommates.length}</strong> compatible candidates in Dhaka
          </span>
          {requestCount > 0 && (
            <span className="badge badge-success">
              ✓ {requestCount} Roommate {requestCount === 1 ? 'Request' : 'Requests'} Sent
            </span>
          )}
        </div>

        {/* Roommates Grid */}
        {filteredRoommates.length > 0 ? (
          <div className="roommates-grid">
            {filteredRoommates.map((candidate) => (
              <RoommateCard
                key={candidate.id}
                roommate={candidate}
                onSendRequest={handleRequestChange}
              />
            ))}
          </div>
        ) : (
          <div className="roommates-empty-card card">
            <div className="empty-emoji">👥</div>
            <h3>No compatible roommates found</h3>
            <p>
              Try clearing specific neighborhood or smoking filters to explore more candidates across Dhaka.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleResetFilters}
            >
              Reset Roommate Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roommates;
