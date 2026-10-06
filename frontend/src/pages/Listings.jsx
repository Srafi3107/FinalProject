import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockListings, DHAKA_AREAS } from '../data/mockData';
import ListingCard from '../components/ListingCard';
import FilterSidebar from '../components/FilterSidebar';
import './Listings.css';

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState('recommended');

  // Filter state
  const [filters, setFilters] = useState({
    area: '',
    maxRent: 60000,
    bedrooms: 'any',
    tenantType: 'any',
    furnished: 'any',
    genderAllowed: 'any',
    hasWifi: false,
    hasGas: false,
    hasLift: false,
    onlyVerifiedOwners: false
  });

  // Sync filters from URL query params (e.g. from Home hero search)
  useEffect(() => {
    const urlArea = searchParams.get('area') || '';
    const urlType = searchParams.get('type') || 'any';
    const urlBudget = searchParams.get('budget') || 'any';

    let maxRentFromBudget = 60000;
    if (urlBudget === 'under10k') maxRentFromBudget = 10000;
    else if (urlBudget === '10k-20k') maxRentFromBudget = 20000;
    else if (urlBudget === '20k-35k') maxRentFromBudget = 35000;

    setFilters((prev) => ({
      ...prev,
      area: urlArea,
      tenantType: urlType !== 'any' ? urlType : prev.tenantType,
      maxRent: urlBudget !== 'any' ? maxRentFromBudget : prev.maxRent
    }));
  }, [searchParams]);

  // Handle resetting all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      area: '',
      maxRent: 60000,
      bedrooms: 'any',
      tenantType: 'any',
      furnished: 'any',
      genderAllowed: 'any',
      hasWifi: false,
      hasGas: false,
      hasLift: false,
      onlyVerifiedOwners: false
    });
    setSearchParams({});
  };

  // Quick area selection pill
  const handleAreaPillClick = (area) => {
    const newArea = filters.area === area ? '' : area;
    setFilters((prev) => ({ ...prev, area: newArea }));
  };

  // Main Filtering Logic
  const filteredListings = useMemo(() => {
    return mockListings.filter((listing) => {
      // 1. Text Search (title, description, address, area)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = listing.title.toLowerCase().includes(query);
        const matchesDesc = listing.description.toLowerCase().includes(query);
        const matchesArea = listing.area.toLowerCase().includes(query);
        const matchesAddress = listing.address.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesArea && !matchesAddress) {
          return false;
        }
      }

      // 2. Area Filter
      if (filters.area && listing.area.toLowerCase() !== filters.area.toLowerCase()) {
        return false;
      }

      // 3. Rent Range Filter
      if (listing.rent > Number(filters.maxRent)) {
        return false;
      }

      // 4. Bedrooms Filter
      if (filters.bedrooms !== 'any') {
        if (filters.bedrooms === '4+' && listing.bedrooms < 4) return false;
        if (filters.bedrooms !== '4+' && listing.bedrooms !== Number(filters.bedrooms)) return false;
      }

      // 5. Tenant Type Filter
      if (filters.tenantType !== 'any') {
        if (!listing.tenantType.includes(filters.tenantType)) {
          return false;
        }
      }

      // 6. Furnished Status Filter
      if (filters.furnished !== 'any' && listing.furnished !== filters.furnished) {
        return false;
      }

      // 7. Gender Allowed Filter
      if (filters.genderAllowed !== 'any') {
        if (listing.genderAllowed !== 'any' && listing.genderAllowed !== filters.genderAllowed) {
          return false;
        }
      }

      // 8. Facilities (WiFi, Gas, Lift)
      if (filters.hasWifi && !listing.hasWifi) return false;
      if (filters.hasGas && !listing.hasGas) return false;
      if (filters.hasLift && !listing.hasLift) return false;

      // 9. Verified Owner Only
      if (filters.onlyVerifiedOwners && !listing.owner?.isVerified) return false;

      return true;
    });
  }, [searchQuery, filters]);

  // Sorting Logic
  const sortedListings = useMemo(() => {
    const list = [...filteredListings];
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.rent - b.rent);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.rent - a.rent);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [filteredListings, sortBy]);

  // Count active non-default filters for mobile badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.area) count++;
    if (filters.maxRent < 60000) count++;
    if (filters.bedrooms !== 'any') count++;
    if (filters.tenantType !== 'any') count++;
    if (filters.furnished !== 'any') count++;
    if (filters.genderAllowed !== 'any') count++;
    if (filters.hasWifi) count++;
    if (filters.hasGas) count++;
    if (filters.hasLift) count++;
    if (filters.onlyVerifiedOwners) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [filters, searchQuery]);

  return (
    <div className="listings-page">
      {/* Mobile Drawer Overlay */}
      {isMobileFilterOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsMobileFilterOpen(false)}
        />
      )}

      {/* Page Header */}
      <section className="listings-hero-header">
        <div className="container">
          <div className="header-meta">
            <span className="badge badge-primary">Dhaka Housing Directory</span>
            <h1 className="listings-main-title">Browse Homes, Sublets &amp; Rooms</h1>
            <p className="listings-subtitle">
              Verified apartments for university students, bachelors, and families across Dhaka.
            </p>
          </div>

          {/* Quick Area Filter Pills */}
          <div className="quick-area-chips">
            <button
              type="button"
              className={`area-chip ${!filters.area ? 'active' : ''}`}
              onClick={() => handleAreaPillClick('')}
            >
              All Dhaka
            </button>
            {DHAKA_AREAS.map((area) => (
              <button
                key={area}
                type="button"
                className={`area-chip ${filters.area === area ? 'active' : ''}`}
                onClick={() => handleAreaPillClick(area)}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container listings-content-container">
        {/* Left: Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          totalResults={sortedListings.length}
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
        />

        {/* Right: Listings Stream */}
        <main className="listings-stream">
          {/* Top Controls Bar */}
          <div className="stream-controls-bar">
            {/* Search Bar */}
            <div className="search-bar-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-bar-input"
                placeholder="Search by area, title, or keywords (e.g. Mirpur, WiFi, Lift)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              className="mobile-filter-btn btn btn-outline"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <span>⚙️ Filters</span>
              {activeFiltersCount > 0 && (
                <span className="active-count-badge">{activeFiltersCount}</span>
              )}
            </button>

            {/* Sorting Dropdown */}
            <div className="sort-box">
              <label htmlFor="sort-select" className="sort-label">Sort:</label>
              <select
                id="sort-select"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Rent: Low to High</option>
                <option value="price-high">Rent: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Listed</option>
              </select>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="results-summary">
            <span className="results-count">
              Showing <strong>{sortedListings.length}</strong> of {mockListings.length} homes in Dhaka
            </span>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                className="clear-filters-link"
                onClick={handleResetFilters}
              >
                Clear all filters ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Listings Grid */}
          {sortedListings.length > 0 ? (
            <div className="listings-grid">
              {sortedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="listings-empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No matching Dhaka listings found</h3>
              <p>
                We couldn't find any apartments matching your selected filters. Try broadening your budget range, clearing specific amenities, or selecting All Dhaka.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Listings;
