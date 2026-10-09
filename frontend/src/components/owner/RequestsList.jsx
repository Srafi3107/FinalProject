import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RequestsList = ({ requests, onUpdateStatus }) => {
  const [filterType, setFilterType] = useState('all'); // 'all', 'visit', 'rent'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'accepted', 'rejected'
  const [toastMessage, setToastMessage] = useState(null);

  const filteredRequests = requests.filter((r) => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = (requestId, newStatus) => {
    onUpdateStatus(requestId, newStatus);
    const label = newStatus === 'accepted' ? 'accepted' : 'declined';
    setToastMessage(`Request #${requestId} has been marked as ${label}. Live backend syncs on Day 14.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="card dashboard-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-title">Tenant Inquiries &amp; Visit Requests</h2>
          <p className="card-desc">
            Review visit schedules and rent applications from prospective bachelor and student tenants.
          </p>
        </div>
        <span className="badge badge-primary">Dhaka Tenant Inquiries</span>
      </div>

      {toastMessage && (
        <div className="alert-success" style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
          ✓ {toastMessage}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="requests-filters-bar">
        <div className="filter-pill-group">
          <button
            type="button"
            className={`filter-pill-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Inquiries ({requests.length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${filterType === 'visit' ? 'active' : ''}`}
            onClick={() => setFilterType('visit')}
          >
            📅 Visit Requests ({requests.filter((r) => r.type === 'visit').length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${filterType === 'rent' ? 'active' : ''}`}
            onClick={() => setFilterType('rent')}
          >
            🏠 Rent Requests ({requests.filter((r) => r.type === 'rent').length})
          </button>
        </div>

        <div className="status-dropdown-box">
          <label className="status-filter-lbl">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Declined</option>
          </select>
        </div>
      </div>

      {/* Requests Stream */}
      {filteredRequests.length > 0 ? (
        <div className="requests-cards-stack">
          {filteredRequests.map((req) => (
            <div key={req.id} className={`request-card status-${req.status}`}>
              <div className="request-card-header">
                <div className="req-type-row">
                  <span className={`badge ${req.type === 'visit' ? 'badge-primary' : 'badge-secondary'}`}>
                    {req.type === 'visit' ? '📅 Property Visit Request' : '🏠 Rent Application'}
                  </span>
                  <span className="req-date-meta">Received: {req.createdAt}</span>
                </div>

                <div className="req-status-pill">
                  {req.status === 'pending' && <span className="status-badge pending">⏳ Pending Review</span>}
                  {req.status === 'accepted' && <span className="status-badge accepted">✓ Accepted</span>}
                  {req.status === 'rejected' && <span className="status-badge rejected">✕ Declined</span>}
                </div>
              </div>

              {/* Target Property */}
              <div className="req-property-meta">
                <span className="req-prop-lbl">Property:</span>
                <Link to={`/listings/${req.listingId}`} className="req-prop-link">
                  {req.listingTitle} (📍 {req.listingArea})
                </Link>
              </div>

              {/* Tenant Profile Snippet */}
              <div className="req-tenant-snippet">
                <div className="tenant-avatar-circle">
                  {req.tenantName.charAt(0)}
                </div>
                <div className="tenant-snippet-info">
                  <div className="tenant-name-row">
                    <strong>{req.tenantName}</strong>
                    {req.isTenantVerified && (
                      <span className="badge badge-success badge-sm">✓ Verified ID</span>
                    )}
                  </div>
                  <span className="tenant-occ">{req.tenantOccupation}</span>
                  <div className="tenant-contacts-line">
                    <span>📞 {req.tenantPhone}</span>
                    <span>&bull;</span>
                    <span>📧 {req.tenantEmail}</span>
                  </div>
                </div>
              </div>

              {/* Specific Visit or Rent Details */}
              <div className="req-details-box">
                {req.type === 'visit' ? (
                  <div className="visit-schedule-line">
                    <span>Target Visit Date: <strong>{req.targetDate}</strong></span>
                    <span>Time Slot: <strong>{req.preferredSlot}</strong></span>
                  </div>
                ) : (
                  <div className="rent-offer-line">
                    <span>Proposed Monthly Rent: <strong>৳ {req.offerRent?.toLocaleString()} / month</strong></span>
                  </div>
                )}
                <p className="req-message-quote">"{req.message}"</p>
              </div>

              {/* Action Buttons */}
              <div className="req-actions-footer">
                {req.status === 'pending' ? (
                  <div className="pending-actions-group">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleStatusChange(req.id, 'accepted')}
                    >
                      ✓ Accept Request
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm decline-btn"
                      onClick={() => handleStatusChange(req.id, 'rejected')}
                    >
                      ✕ Decline
                    </button>
                  </div>
                ) : (
                  <div className="resolved-status-note">
                    <span>
                      This request has been <strong>{req.status}</strong>.
                    </span>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => handleStatusChange(req.id, 'pending')}
                      style={{ marginLeft: '0.75rem', fontSize: '0.8rem' }}
                    >
                      Reset to Pending
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-requests-state">
          <div className="empty-icon">📬</div>
          <h3>No requests match your filter</h3>
          <p>
            When tenants in Dhaka send visit schedules or rent applications for your apartments, they will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default RequestsList;
