import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MyListingsTable = ({
  listings,
  onEditListing,
  onDeleteListing,
  onToggleRented,
  onAddNewClick
}) => {
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'available', 'rented'
  const [searchTerm, setSearchTerm] = useState('');

  const filteredListings = listings.filter((item) => {
    if (filterStatus === 'available' && !item.isAvailable) return false;
    if (filterStatus === 'rented' && item.isAvailable) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(term);
      const matchArea = item.area.toLowerCase().includes(term);
      if (!matchTitle && !matchArea) return false;
    }
    return true;
  });

  return (
    <div className="card dashboard-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-title">My Properties &amp; Listings</h2>
          <p className="card-desc">
            Manage your flats, bachelor sublets, and mark properties as rented or available across Dhaka.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onAddNewClick}
        >
          ➕ Post New Listing
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="table-controls-bar">
        <div className="table-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search my properties by area or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="table-search-input"
          />
        </div>

        <div className="table-filter-pills">
          <button
            type="button"
            className={`filter-pill-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({listings.length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${filterStatus === 'available' ? 'active' : ''}`}
            onClick={() => setFilterStatus('available')}
          >
            🟢 Available ({listings.filter((l) => l.isAvailable).length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${filterStatus === 'rented' ? 'active' : ''}`}
            onClick={() => setFilterStatus('rented')}
          >
            ⚪ Rented ({listings.filter((l) => !l.isAvailable).length})
          </button>
        </div>
      </div>

      {/* Listings Table */}
      {filteredListings.length > 0 ? (
        <div className="table-responsive-wrapper">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Area</th>
                <th>Monthly Rent</th>
                <th>Tenant Type</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map((listing) => (
                <tr key={listing.id} className={!listing.isAvailable ? 'row-rented' : ''}>
                  {/* Property Image & Title */}
                  <td className="cell-property">
                    <div className="property-cell-wrapper">
                      <img
                        src={listing.images[0] || 'https://via.placeholder.com/150'}
                        alt={listing.title}
                        className="table-thumb-img"
                      />
                      <div className="property-cell-info">
                        <Link
                          to={`/listings/${listing.id}`}
                          className="table-prop-title"
                          title={listing.title}
                        >
                          {listing.title}
                        </Link>
                        <span className="table-prop-specs">
                          {listing.bedrooms} Bed &bull; {listing.bathrooms} Bath &bull; {listing.size} sqft
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Area */}
                  <td>
                    <span className="badge-area-pill">📍 {listing.area}</span>
                  </td>

                  {/* Rent */}
                  <td>
                    <strong className="table-rent-val">৳ {listing.rent.toLocaleString()}</strong>
                    <span className="table-rent-sub">/mo</span>
                  </td>

                  {/* Tenant Type */}
                  <td>
                    <div className="tenant-type-tags">
                      {listing.tenantType.slice(0, 2).map((t) => (
                        <span key={t} className="badge badge-primary">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status & Mark as Rented Toggle (Task 7) */}
                  <td>
                    <button
                      type="button"
                      className={`status-toggle-btn ${listing.isAvailable ? 'status-avail' : 'status-rented'}`}
                      onClick={() => onToggleRented(listing.id)}
                      title="Click to toggle Available / Rented status"
                    >
                      <span className="status-dot"></span>
                      <span>{listing.isAvailable ? 'Available' : 'Rented Out'}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="cell-actions">
                    <div className="action-buttons-group">
                      <button
                        type="button"
                        className="btn-action btn-edit"
                        onClick={() => onEditListing(listing)}
                        title="Edit property details"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="btn-action btn-delete"
                        onClick={() => onDeleteListing(listing.id)}
                        title="Delete listing"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-table-state">
          <div className="empty-icon">🏠</div>
          <h3>No properties match your filter</h3>
          <p>
            {listings.length === 0
              ? "You haven't posted any properties yet. Click the button above to add your first Dhaka listing."
              : "Try changing your search keywords or switching status tabs."}
          </p>
          {listings.length === 0 && (
            <button
              type="button"
              className="btn btn-primary btn-md"
              onClick={onAddNewClick}
            >
              Post Your First Listing
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyListingsTable;
