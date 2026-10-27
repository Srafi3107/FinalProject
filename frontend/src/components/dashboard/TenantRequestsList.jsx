import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TenantRequestsList = ({ requests = [], onCancelRequest }) => {
  const [filterType, setFilterType] = useState('all'); // 'all', 'visit', 'rent'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'accepted', 'rejected'

  const filteredRequests = requests.filter((r) => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="card dashboard-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-title">My Visit Schedules &amp; Rent Inquiries</h2>
          <p className="card-desc">
            Track flat inspection appointments and rent application statuses with Dhaka landlords.
          </p>
        </div>
        <span className="badge badge-primary">Direct Applications</span>
      </div>

      {/* Filter Tabs */}
      <div className="requests-filters-bar" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div className="filter-pill-group" style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterType('all')}
          >
            All Requests ({requests.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'visit' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterType('visit')}
          >
            📅 Visits ({requests.filter((r) => r.type === 'visit').length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'rent' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterType('rent')}
          >
            🏠 Rent Offers ({requests.filter((r) => r.type === 'rent').length})
          </button>
        </div>

        <div className="status-dropdown-box" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', borderRadius: '6px' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Declined</option>
          </select>
        </div>
      </div>

      {filteredRequests.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1.25rem',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <span
                    className={`badge ${req.type === 'visit' ? 'badge-primary' : 'badge-secondary'}`}
                    style={{ marginRight: '0.5rem' }}
                  >
                    {req.type === 'visit' ? '📅 Physical Visit Schedule' : '🏠 Rent Application'}
                  </span>
                  <Link
                    to={`/listings/${req.listingId}`}
                    style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b', textDecoration: 'none' }}
                  >
                    {req.listingTitle || 'Dhaka Property'}
                  </Link>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                    📍 {req.listingArea || 'Dhaka'} {req.listingRent ? `• ৳${Number(req.listingRent).toLocaleString()}/mo` : ''}
                  </div>
                </div>

                <div>
                  {req.status === 'pending' && (
                    <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.3rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                      ⏳ Awaiting Owner Review
                    </span>
                  )}
                  {req.status === 'accepted' && (
                    <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.3rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                      ✓ Accepted by Owner
                    </span>
                  )}
                  {req.status === 'rejected' && (
                    <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.3rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                      ✕ Declined
                    </span>
                  )}
                </div>
              </div>

              {/* Details Box */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                {req.type === 'visit' ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>📅 <strong>Visit Date:</strong> {req.targetDate ? req.targetDate.split('T')[0] : 'Scheduled'}</div>
                    <div>⏰ <strong>Time Slot:</strong> {req.preferredSlot || 'Flexible'}</div>
                    <div>👥 <strong>Visitors:</strong> {req.numberOfVisitors || 1} person(s)</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>💰 <strong>Offered Rent:</strong> ৳{Number(req.offerRent || req.listingRent || 0).toLocaleString()}/mo</div>
                    <div>👥 <strong>Tenants:</strong> {req.numberOfVisitors || 1} person(s)</div>
                  </div>
                )}

                {req.message && (
                  <div style={{ marginTop: '0.5rem', color: '#475569', fontStyle: 'italic' }}>
                    "{req.message}"
                  </div>
                )}
              </div>

              {/* Owner Contact */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                <div>
                  <span>Property Owner: <strong>{req.ownerName || 'Landlord'}</strong></span>
                  {req.ownerPhone && (
                    <span style={{ marginLeft: '0.75rem' }}>📞 <a href={`tel:${req.ownerPhone}`} style={{ color: '#0d9488', textDecoration: 'none' }}>{req.ownerPhone}</a></span>
                  )}
                </div>

                {req.status === 'pending' && onCancelRequest && (
                  <button
                    type="button"
                    onClick={() => onCancelRequest(req.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textDecoration: 'underline'
                    }}
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
          <h4>No Requests Found</h4>
          <p style={{ maxWidth: '400px', margin: '0.5rem auto 1rem', fontSize: '0.9rem' }}>
            You haven't scheduled any flat visits or sent rent applications yet. Explore available flats to book inspection visits.
          </p>
          <Link to="/listings" className="btn btn-primary btn-sm">
            Explore Dhaka Listings
          </Link>
        </div>
      )}
    </div>
  );
};

export default TenantRequestsList;
