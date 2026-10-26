import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockListings } from '../data/mockData';
import { useFavorites } from '../context/FavoritesContext';
import { favoriteService } from '../services/favoriteService';
import ListingCard from '../components/ListingCard';
import './Favorites.css';

const Favorites = () => {
  const { favoriteIds, clearAllFavorites } = useFavorites();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterArea, setFilterArea] = useState('all');

  useEffect(() => {
    let isMounted = true;
    const loadSaved = async () => {
      setLoading(true);
      try {
        const { favorites } = await favoriteService.getFavorites();
        if (isMounted) {
          if (favorites && favorites.length > 0) {
            setListings(favorites);
          } else {
            // Fallback to filtering mock listings
            setListings(mockListings.filter((item) => favoriteIds.includes(Number(item.id))));
          }
        }
      } catch (err) {
        if (isMounted) {
          setListings(mockListings.filter((item) => favoriteIds.includes(Number(item.id))));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSaved();
    return () => { isMounted = false; };
  }, [favoriteIds.length]);

  // Filter listings by currently saved IDs
  const savedListings = listings.filter((item) => favoriteIds.includes(Number(item.id)));

  // Area filter
  const displayedListings = savedListings.filter((item) => {
    if (filterArea === 'all') return true;
    return item.area === filterArea;
  });

  // Extract unique areas from saved listings
  const savedAreas = Array.from(new Set(savedListings.map((item) => item.area)));

  return (
    <div className="favorites-page">
      {/* Hero Banner */}
      <section className="favorites-hero">
        <div className="container">
          <div className="favorites-hero-inner">
            <span className="badge badge-primary">Tenant Saved Collection</span>
            <h1 className="favorites-title">❤️ My Saved Dhaka Homes</h1>
            <p className="favorites-subtitle">
              Shortlisted flats and rooms you've bookmarked for inspection, comparison, and roommate discussions.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container favorites-content-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p className="text-muted">Loading your saved properties...</p>
          </div>
        ) : savedListings.length > 0 ? (
          <>
            {/* Control & Filter Row */}
            <div className="favorites-controls-bar card">
              <div className="controls-left">
                <span className="saved-count-pill">
                  Saved: <strong>{savedListings.length}</strong> {savedListings.length === 1 ? 'property' : 'properties'}
                </span>

                {savedAreas.length > 1 && (
                  <div className="area-select-box">
                    <label className="filter-label">Filter by Area:</label>
                    <select
                      value={filterArea}
                      onChange={(e) => setFilterArea(e.target.value)}
                      className="area-select"
                    >
                      <option value="all">All Saved Neighborhoods ({savedListings.length})</option>
                      {savedAreas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="controls-right">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm clear-all-btn"
                  onClick={clearAllFavorites}
                  title="Remove all items from your saved list"
                >
                  🗑️ Clear All Saved
                </button>
              </div>
            </div>

            {/* Listings Grid */}
            <div className="favorites-grid">
              {displayedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="favorites-empty-card card">
            <div className="empty-heart-icon">💔</div>
            <h2 className="empty-heading">No Saved Dhaka Properties Yet</h2>
            <p className="empty-description">
              Browse verified flats, bachelor mess rooms, or sublet seats across Dhaka and click the heart icon (🤍) to bookmark properties you like.
            </p>
            <div className="empty-actions">
              <Link to="/listings" className="btn btn-primary btn-lg">
                🔍 Explore Available Listings
              </Link>
              <Link to="/roommates" className="btn btn-outline btn-lg">
                👥 Find Potential Roommates
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
