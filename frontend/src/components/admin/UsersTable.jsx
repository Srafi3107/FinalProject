import React, { useState } from 'react';

const UsersTable = ({ users, onToggleVerify, onToggleBlock }) => {
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter === 'verified' && !u.isVerified) return false;
    if (statusFilter === 'unverified' && u.isVerified) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchId = u.idNumber?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchId) return false;
    }
    return true;
  });

  return (
    <div className="card dashboard-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-title">User Management &amp; ID Verification</h2>
          <p className="card-desc">
            Verify Bangladeshi NID or University Student IDs to grant the trusted Verified badge.
          </p>
        </div>
        <span className="badge badge-primary">NID &amp; Student ID Verification</span>
      </div>

      {/* Controls Bar */}
      <div className="table-controls-bar">
        <div className="table-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search users by name, email, or ID number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="table-search-input"
          />
        </div>

        <div className="table-filter-pills">
          <button
            type="button"
            className={`filter-pill-btn ${roleFilter === 'all' ? 'active' : ''}`}
            onClick={() => setRoleFilter('all')}
          >
            All Roles ({users.length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${roleFilter === 'tenant' ? 'active' : ''}`}
            onClick={() => setRoleFilter('tenant')}
          >
            👤 Tenants ({users.filter((u) => u.role === 'tenant').length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${roleFilter === 'owner' ? 'active' : ''}`}
            onClick={() => setRoleFilter('owner')}
          >
            🏠 Owners ({users.filter((u) => u.role === 'owner').length})
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-responsive-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>ID Type &amp; Number</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th style={{ textAlign: 'center' }}>Verification Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className={user.status === 'blocked' ? 'row-blocked' : ''}>
                {/* User Info */}
                <td>
                  <div className="user-table-cell">
                    <div className="user-table-avatar">
                      {user.name.charAt(0)}
                    </div>
                    <div className="user-table-info">
                      <strong className="user-name-text">{user.name}</strong>
                      <span className="user-email-text">{user.email}</span>
                      <span className="user-phone-text">📞 {user.phone}</span>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td>
                  <span className={`badge ${user.role === 'tenant' ? 'badge-primary' : 'badge-secondary'}`}>
                    {user.role === 'tenant' ? 'Tenant' : 'Property Owner'}
                  </span>
                </td>

                {/* Document details */}
                <td>
                  <div className="id-details-box">
                    <span className="id-type-badge">{user.idType}</span>
                    <span className="id-number-val"><code>{user.idNumber}</code></span>
                    {user.university && (
                      <span className="id-uni-sub">{user.university}</span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td>
                  {user.isVerified ? (
                    <span className="badge badge-success">✓ Verified</span>
                  ) : (
                    <span className="badge badge-warning">⏳ Pending ID</span>
                  )}
                  {user.status === 'blocked' && (
                    <span className="badge badge-danger" style={{ marginLeft: '4px' }}>Blocked</span>
                  )}
                </td>

                {/* Joined Date */}
                <td>
                  <span className="joined-date-text">{user.joinedAt}</span>
                </td>

                {/* Actions */}
                <td style={{ textAlign: 'center' }}>
                  <div className="admin-actions-cell">
                    <button
                      type="button"
                      className={`btn btn-sm ${user.isVerified ? 'btn-outline' : 'btn-primary'}`}
                      onClick={() => onToggleVerify(user.id)}
                      title={user.isVerified ? 'Revoke verification badge' : 'Approve ID document'}
                    >
                      {user.isVerified ? 'Revoke Badge' : '✓ Verify User'}
                    </button>

                    <button
                      type="button"
                      className="btn-text-danger"
                      onClick={() => onToggleBlock(user.id)}
                      title={user.status === 'blocked' ? 'Unblock user' : 'Block user'}
                    >
                      {user.status === 'blocked' ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
