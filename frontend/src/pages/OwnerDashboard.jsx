import React, { useState } from 'react';
import { mockListings, mockRequests, defaultOwnerProfile } from '../data/mockData';
import MyListingsTable from '../components/owner/MyListingsTable';
import AddListingForm from '../components/owner/AddListingForm';
import EditListingModal from '../components/owner/EditListingModal';
import RequestsList from '../components/owner/RequestsList';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'add', 'requests', 'profile'
  // Owner's listings: filter by ownerId === 101 or default to first 3 mock listings
  const [ownerListings, setOwnerListings] = useState(
    mockListings.filter((l) => l.owner?.id === 101 || l.id <= 3)
  );
  const [requests, setRequests] = useState(mockRequests);
  const [editingListing, setEditingListing] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add listing
  const handleAddListing = (newListing) => {
    setOwnerListings((prev) => [newListing, ...prev]);
    setActiveTab('listings');
    showToast(`"${newListing.title}" posted successfully!`);
  };

  // Edit listing
  const handleSaveEdit = (updatedListing) => {
    setOwnerListings((prev) =>
      prev.map((l) => (l.id === updatedListing.id ? updatedListing : l))
    );
    showToast(`Listing #${updatedListing.id} updated successfully.`);
  };

  // Delete listing
  const handleDeleteListing = (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setOwnerListings((prev) => prev.filter((l) => l.id !== listingId));
      showToast(`Listing #${listingId} removed from HomeMatch.`);
    }
  };

  // Toggle Rented / Available (Task 7)
  const handleToggleRented = (listingId) => {
    setOwnerListings((prev) =>
      prev.map((l) => {
        if (l.id === listingId) {
          const nextState = !l.isAvailable;
          showToast(
            `Listing #${listingId} marked as ${nextState ? 'Available' : 'Rented Out'}.`
          );
          return { ...l, isAvailable: nextState };
        }
        return l;
      })
    );
  };

  // Update request status
  const handleUpdateRequestStatus = (requestId, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    );
  };

  // Calculations for Stats Bar
  const totalListings = ownerListings.length;
  const availableCount = ownerListings.filter((l) => l.isAvailable).length;
  const pendingVisits = requests.filter((r) => r.type === 'visit' && r.status === 'pending').length;
  const pendingRents = requests.filter((r) => r.type === 'rent' && r.status === 'pending').length;

  return (
    <div className="owner-dashboard-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="owner-floating-toast">
          <span>✓ {toastMessage}</span>
        </div>
      )}

      {/* Top Welcome Banner */}
      <section className="owner-banner">
        <div className="container owner-banner-container">
          <div className="owner-meta-block">
            <div className="owner-badge-pill">Dhaka Property Owner Portal</div>
            <h1 className="owner-title">Welcome, {defaultOwnerProfile.name}!</h1>
            <p className="owner-sub">
              Manage your residential listings, review student and bachelor visit requests, and toggle property availability.
            </p>
          </div>

          <div className="owner-stats-row">
            <div className="owner-stat-card">
              <span className="stat-num">{totalListings}</span>
              <span className="stat-lbl">Total Listings</span>
            </div>
            <div className="owner-stat-card">
              <span className="stat-num text-success">{availableCount}</span>
              <span className="stat-lbl">Available Now</span>
            </div>
            <div className="owner-stat-card">
              <span className="stat-num text-warning">{pendingVisits}</span>
              <span className="stat-lbl">Pending Visits</span>
            </div>
            <div className="owner-stat-card">
              <span className="stat-num text-primary">{pendingRents}</span>
              <span className="stat-lbl">Rent Inquiries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Layout */}
      <div className="container owner-layout">
        {/* Sidebar Nav */}
        <aside className="owner-sidebar">
          <div className="owner-sidebar-menu">
            <button
              type="button"
              className={`owner-nav-btn ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
            >
              <span className="nav-icon">🏠</span>
              <span className="nav-label">My Listings</span>
              <span className="nav-count">{totalListings}</span>
            </button>

            <button
              type="button"
              className={`owner-nav-btn ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => setActiveTab('add')}
            >
              <span className="nav-icon">➕</span>
              <span className="nav-label">Post New Listing</span>
            </button>

            <button
              type="button"
              className={`owner-nav-btn ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              <span className="nav-icon">📬</span>
              <span className="nav-label">Tenant Requests</span>
              {(pendingVisits + pendingRents) > 0 && (
                <span className="nav-pending-badge">{pendingVisits + pendingRents}</span>
              )}
            </button>

            <button
              type="button"
              className={`owner-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-label">Owner Profile</span>
            </button>
          </div>

          {/* Quick Viva Info Helper */}
          <div className="owner-sidebar-tip card">
            <span className="tip-title">Owner Controls (Viva Ready)</span>
            <ul className="tip-list">
              <li>&bull; Post new Dhaka flat / sublet</li>
              <li>&bull; Multi-image upload preview</li>
              <li>&bull; Mark Rented / Available toggle</li>
              <li>&bull; Accept or Decline visit requests</li>
            </ul>
          </div>
        </aside>

        {/* Dynamic Main Views */}
        <main className="owner-main-content">
          {activeTab === 'listings' && (
            <MyListingsTable
              listings={ownerListings}
              onEditListing={(listing) => setEditingListing(listing)}
              onDeleteListing={handleDeleteListing}
              onToggleRented={handleToggleRented}
              onAddNewClick={() => setActiveTab('add')}
            />
          )}

          {activeTab === 'add' && (
            <AddListingForm
              onAddListing={handleAddListing}
              onCancel={() => setActiveTab('listings')}
            />
          )}

          {activeTab === 'requests' && (
            <RequestsList
              requests={requests}
              onUpdateStatus={handleUpdateRequestStatus}
            />
          )}

          {activeTab === 'profile' && (
            <div className="card dashboard-card">
              <div className="card-header-row">
                <h2 className="card-title">Property Owner Profile</h2>
                <span className="badge badge-success">&#10003; NID Verified Landlord</span>
              </div>

              <div className="profile-view-stack">
                <div className="profile-avatar-row">
                  <div className="profile-avatar-wrapper">
                    <img
                      src={defaultOwnerProfile.avatar}
                      alt={defaultOwnerProfile.name}
                      className="profile-avatar-img"
                    />
                    <span className="avatar-check">✓</span>
                  </div>
                  <div className="profile-info-header">
                    <h3>{defaultOwnerProfile.name}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Registered Landlord &bull; Member since {defaultOwnerProfile.memberSince}</p>
                    <div className="profile-contacts">
                      <span>📧 {defaultOwnerProfile.email}</span>
                      <span>📞 {defaultOwnerProfile.phone}</span>
                      <span>📍 Dhaka, Bangladesh</span>
                    </div>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="card" style={{ padding: '1.25rem' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Verification Details</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                      Bangladesh NID verified on HomeMatch. Tenants see the green "Verified Owner" trust badge on all your listings.
                    </p>
                  </div>
                  <div className="card" style={{ padding: '1.25rem' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Direct Tenant Requests</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                      Zero broker commissions. Bachelor, student, and family tenants schedule property visits directly through the platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Listing Modal (Task 5) */}
      {editingListing && (
        <EditListingModal
          listing={editingListing}
          onSave={handleSaveEdit}
          onClose={() => setEditingListing(null)}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;
