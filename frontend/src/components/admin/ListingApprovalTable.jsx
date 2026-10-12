import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ListingApprovalTable = ({ listings, onToggleApproval, onRemoveListing }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'approved', 'pending'

  const filteredListings = listings.filter((l) => {
    // If isApproved is undefined, treat as approved for existing listings
    const isApproved = l.isApproved !== false;
    if (filter === 'approved' && !isApproved) return false;
    if (filter === 'pending' && isApproved) return false;
    return true;
  });

  return (
    <div className="card dashboard-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-title">Listing Moderation &amp; Approvals</h2>
          <p className="card-desc">
            Approve verified apartments or remove fraudulent listings across Dhaka neighborhoods.
          </p>
        </div>
        <div className="table-filter-pills">
          <button
            type="button"
            className={`filter-pill-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({listings.length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            🟢 Approved ({listings.filter((l) => l.isApproved !== false).length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            ⏳ Pending ({listings.filter((l) => l.isApproved === false).length})
          </button>
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Listing</th>
              <th>Area</th>
              <th>Owner</th>
              <th>Rent</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Moderation Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.map((listing) => {
              const isApproved = listing.isApproved !== false;
              return (
                <tr key={listing.id}>
                  <td>
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
                        >
                          {listing.title}
                        </Link>
                        <span className="table-prop-specs">
                          {listing.bedrooms} Bed &bull; {listing.size} sqft
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="badge-area-pill">📍 {listing.area}</span>
                  </td>

                  <td>
                    <div className="owner-compact-cell">
                      <strong>{listing.owner?.name || 'Owner'}</strong>
                      <span className="owner-phone-sub">{listing.owner?.phone || '017XXXXXXXX'}</span>
                    </div>
                  </td>

                  <td>
                    <strong className="table-rent-val">৳ {listing.rent.toLocaleString()}</strong>
                  </td>

                  <td>
                    {isApproved ? (
                      <span className="badge badge-success">✓ Approved</span>
                    ) : (
                      <span className="badge badge-warning">⏳ Under Review</span>
                    )}
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <div className="admin-actions-cell">
                      <button
                        type="button"
                        className={`btn btn-sm ${isApproved ? 'btn-outline' : 'btn-primary'}`}
                        onClick={() => onToggleApproval(listing.id)}
                      >
                        {isApproved ? 'Unapprove' : '✓ Approve'}
                      </button>

                      <button
                        type="button"
                        className="btn-text-danger"
                        onClick={() => onRemoveListing(listing.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListingApprovalTable;
