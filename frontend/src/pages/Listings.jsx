import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DHAKA_AREAS, mockListings } from '../data/mockData';
import listingService from '../services/listingService';
import ListingCard from '../components/ListingCard';
import FilterSidebar from '../components/FilterSidebar';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import './Listings.css';

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState('recommended');

  // Listings data & state
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });

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

  // Load listings from Backend Search API (with automatic fallback to mock data)
  const fetchListings = useCallback(async () => {
    setLoading(true);
    const queryParams = {
      search: searchQuery || undefined,
      area: filters.area || undefined,
      maxRent: filters.maxRent < 60000 ? filters.maxRent : undefined,
      bedrooms: filters.bedrooms !== 'any' ? filters.bedrooms : undefined,
      tenantType: filters.tenantType !== 'any' ? filters.tenantType : undefined,
      furnished: filters.furnished !== 'any' ? filters.furnished : undefined,
      genderAllowed: filters.genderAllowed !== 'any' ? filters.genderAllowed : undefined,
      hasWifi: filters.hasWifi || undefined,
      hasGas: filters.hasGas || undefined,
      hasLift: filters.hasLift || undefined,
      sortBy,
      page: pagination.page,
      limit: pagination.limit
    };

    const res = await listingService.getListings(queryParams);

    if (res.fromApi) {
      setListings(res.listings);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } else {
      // Fallback: client-side filter mock data
      let filtered = [...mockListings];

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          l => l.title.toLowerCase().includes(q) ||
               l.area.toLowerCase().includes(q) ||
               l.address.toLowerCase().includes(q)
        );
      }

      if (filters.area) {
        filtered = filtered.filter(l => l.area.toLowerCase() === filters.area.toLowerCase());
      }

      if (filters.maxRent < 60000) {
        filtered = filtered.filter(l => l.rent <= filters.maxRent);
      }

      if (filters.bedrooms !== 'any') {
        if (filters.bedrooms === '4+') filtered = filtered.filter(l => l.bedrooms >= 4);
        else filtered = filtered.filter(l => l.bedrooms === Number(filters.bedrooms));
      }

      if (filters.tenantType !== 'any') {
        filtered = filtered.filter(l => l.tenantType && l.tenantType.includes(filters.tenantType));
      }

      if (filters.furnished !== 'any') {
        filtered = filtered.filter(l => l.furnished === filters.furnished);
      }

      if (filters.genderAllowed !== 'any') {
        filtered = filtered.filter(l => l.genderAllowed === 'any' || l.genderAllowed === filters.genderAllowed);
      }

      if (filters.hasWifi) filtered = filtered.filter(l => l.hasWifi);
      if (filters.hasGas) filtered = filtered.filter(l => l.hasGas);
      if (filters.hasLift) filtered = filtered.filter(l => l.hasLift);
      if (filters.onlyVerifiedOwners) filtered = filtered.filter(l => l.owner?.isVerified);

      // Sorting
      if (sortBy === 'price-low') filtered.sort((a, b) => a.rent - b.rent);
      else if (sortBy === 'price-high') filtered.sort((a, b) => b.rent - a.rent);
      else if (sortBy === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      else if (sortBy === 'newest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setListings(filtered);
      setPagination({
        page: 1,
        limit: 12,
        total: filtered.length,
        totalPages: 1
      });
    }

    setLoading(false);
  }, [searchQuery, filters, sortBy, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

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

  // Handle area chip click from hero
  const handleAreaPillClick = (selectedArea) => {
    setFilters((prev) => ({
      ...prev,
      area: prev.area === selectedArea ? '' : selectedArea
    }));
  };

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
          totalResults={listings.length}
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
              Showing <strong>{listings.length}</strong> {pagination.total > 0 ? `of ${pagination.total}` : ''} homes in Dhaka
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

          {/* Listings Grid / Loading / Empty */}
          {loading ? (
            <LoadingState message="Fetching live Dhaka apartments & sublets..." size="lg" />
          ) : listings.length > 0 ? (
            <div className="listings-grid">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🏚️"
              title="No matching Dhaka listings found"
              description="We couldn't find any apartments matching your selected filters. Try broadening your budget range, clearing specific amenities, or selecting All Dhaka."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={pagination.page <= 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                &larr; Previous Page
              </button>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next Page &rarr;
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Listings;
