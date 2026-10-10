import React, { useState } from 'react';
import { mockUsers, mockListings, mockReports } from '../data/mockData';
import UsersTable from '../components/admin/UsersTable';
import ListingApprovalTable from '../components/admin/ListingApprovalTable';
import ReportsTable from '../components/admin/ReportsTable';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'listings', 'reports'
  const [users, setUsers] = useState(mockUsers);
  const [listings, setListings] = useState(mockListings);
  const [reports, setReports] = useState(mockReports);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle user verification (Task 3)
  const handleToggleVerify = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newState = !u.isVerified;
          showToast(`User ${u.name} is now ${newState ? 'Verified with official badge' : 'marked Unverified'}.`);
          return { ...u, isVerified: newState };
        }
        return u;
      })
    );
  };

  // Toggle user block
  const handleToggleBlock = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'blocked' ? 'active' : 'blocked';
          showToast(`User ${u.name} has been ${nextStatus === 'blocked' ? 'Blocked' : 'Unblocked'}.`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Toggle listing approval (Task 4)
  const handleToggleApproval = (listingId) => {
    setListings((prev) =>
      prev.map((l) => {
        if (l.id === listingId) {
          const current = l.isApproved !== false;
          const next = !current;
          showToast(`Listing #${listingId} ${next ? 'Approved for public view' : 'Unapproved'}.`);
          return { ...l, isApproved: next };
        }
        return l;
      })
    );
  };

  // Remove listing
  const handleRemoveListing = (listingId) => {
    if (window.confirm('Remove this listing from the platform?')) {
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      showToast(`Listing #${listingId} removed by admin.`);
    }
  };

  // Update report status (Task 5)
  const handleUpdateReportStatus = (reportId, newStatus) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );
    showToast(`Report #${reportId} marked as ${newStatus}.`);
  };

  // Stats calculations (Task 2)
  const totalUsers = users.length;
  const verifiedUsersCount = users.filter((u) => u.isVerified).length;
  const pendingVerifications = users.filter((u) => !u.isVerified).length;
  const totalListings = listings.length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div className="admin-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="admin-floating-toast">
          <span>✓ {toastMessage}</span>
        </div>
      )}

      {/* Top Admin Banner */}
      <section className="admin-banner">
        <div className="container admin-banner-container">
          <div className="admin-header-meta">
            <span className="admin-shield-badge">🛡️ HomeMatch Admin Command Center</span>
            <h1 className="admin-main-title">Platform Administration &amp; Trust</h1>
            <p className="admin-subtitle">
              Verify NID/Student ID documents, moderate Dhaka apartments, and resolve community dispute reports.
            </p>
          </div>

          {/* Task 2: Stats Cards */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="stat-icon">👥</span>
              <div className="stat-data">
                <span className="stat-number">{totalUsers}</span>
                <span className="stat-label">Total Users ({verifiedUsersCount} Verified)</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <span className="stat-icon">🪪</span>
              <div className="stat-data">
                <span className="stat-number text-warning">{pendingVerifications}</span>
                <span className="stat-label">Pending Verifications</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <span className="stat-icon">🏠</span>
              <div className="stat-data">
                <span className="stat-number text-success">{totalListings}</span>
                <span className="stat-label">Active Listings</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <span className="stat-icon">🚨</span>
              <div className="stat-data">
                <span className="stat-number text-danger">{pendingReportsCount}</span>
                <span className="stat-label">Pending Reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Admin Layout */}
      <div className="container admin-layout">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-menu">
            <button
              type="button"
              className={`admin-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-label">Users &amp; ID Verification</span>
              {pendingVerifications > 0 && (
                <span className="admin-badge-count">{pendingVerifications}</span>
              )}
            </button>

            <button
              type="button"
              className={`admin-nav-btn ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
            >
              <span className="nav-icon">🏠</span>
              <span className="nav-label">Listing Moderation</span>
              <span className="admin-badge-sub">{totalListings}</span>
            </button>

            <button
              type="button"
              className={`admin-nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <span className="nav-icon">🚨</span>
              <span className="nav-label">Community Reports</span>
              {pendingReportsCount > 0 && (
                <span className="admin-badge-danger">{pendingReportsCount}</span>
              )}
            </button>
          </div>

          <div className="admin-quick-tip card">
            <span className="tip-title">Dhaka Safety Guidelines</span>
            <p className="tip-desc">
              All Bachelor and Student flats require verified caretaker or landlord identities to prevent fraud.
            </p>
          </div>
        </aside>

        {/* Dynamic Admin Views */}
        <main className="admin-content-main">
          {activeTab === 'users' && (
            <UsersTable
              users={users}
              onToggleVerify={handleToggleVerify}
              onToggleBlock={handleToggleBlock}
            />
          )}

          {activeTab === 'listings' && (
            <ListingApprovalTable
              listings={listings}
              onToggleApproval={handleToggleApproval}
              onRemoveListing={handleRemoveListing}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsTable
              reports={reports}
              onUpdateReportStatus={handleUpdateReportStatus}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
