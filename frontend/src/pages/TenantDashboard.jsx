import React, { useState, useEffect } from 'react';
import { defaultTenantProfile } from '../data/mockData';
import { tenantService } from '../services/tenantService';
import requestService from '../services/requestService';
import TenantProfileView from '../components/dashboard/TenantProfileView';
import HousingPreferencesForm from '../components/dashboard/HousingPreferencesForm';
import LifestyleHabitsForm from '../components/dashboard/LifestyleHabitsForm';
import RecommendedHouses from '../components/dashboard/RecommendedHouses';
import TenantRequestsList from '../components/dashboard/TenantRequestsList';
import './TenantDashboard.css';

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'houses', 'housing', 'lifestyle', 'requests'
  const [profile, setProfile] = useState(defaultTenantProfile);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tenant profile & outgoing requests on mount from backend API or cached mock
  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        const [profileRes, requestsRes] = await Promise.all([
          tenantService.getProfile(),
          requestService.getMyRequests()
        ]);

        if (isMounted) {
          if (profileRes?.profile) {
            setProfile(profileRes.profile);
          }
          if (requestsRes?.requests) {
            setRequests(requestsRes.requests);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => { isMounted = false; };
  }, []);

  const handleUpdateHousing = async (newHousingPrefs) => {
    const res = await tenantService.updatePreferences(newHousingPrefs);
    if (res?.profile) {
      setProfile(res.profile);
    } else {
      setProfile((prev) => ({
        ...prev,
        housingPreferences: newHousingPrefs
      }));
    }
  };

  const handleUpdateLifestyle = async (newLifestyleHabits) => {
    const res = await tenantService.updateLifestyle(newLifestyleHabits);
    if (res?.profile) {
      setProfile(res.profile);
    } else {
      setProfile((prev) => ({
        ...prev,
        lifestyleHabits: newLifestyleHabits
      }));
    }
  };

  const handleCancelRequest = async (requestId) => {
    await requestService.updateStatus(requestId, 'rejected');
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );
  };

  const housingPrefs = profile.housingPreferences || defaultTenantProfile.housingPreferences;
  const lifestyleHabits = profile.lifestyleHabits || defaultTenantProfile.lifestyleHabits;
  const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="dashboard-page">
      {/* Top Welcome Banner */}
      <section className="dashboard-banner">
        <div className="container dashboard-banner-container">
          <div className="dashboard-user-meta">
            <h1 className="dashboard-greeting">
              Welcome, {profile.name || 'Tenant'}!
            </h1>
            <p className="dashboard-sub">
              Manage your housing needs, lifestyle habits, and discover AI-matched Dhaka homes and flatmates.
            </p>
          </div>

          <div className="dashboard-quick-stats">
            <div className="quick-stat-box">
              <span className="stat-value">৳ {Number(housingPrefs.targetBudget || 15000).toLocaleString()}</span>
              <span className="stat-caption">Target Rent Budget</span>
            </div>
            <div className="quick-stat-box">
              <span className="stat-value">
                {Array.isArray(housingPrefs.preferredAreas) && housingPrefs.preferredAreas.length > 0
                  ? housingPrefs.preferredAreas[0]
                  : 'Mirpur'}
              </span>
              <span className="stat-caption">Top Preferred Area</span>
            </div>
            <div className="quick-stat-box">
              <span className="stat-value">{requests.length} ({pendingRequestsCount} Pending)</span>
              <span className="stat-caption">Visits &amp; Inquiries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Layout with Sidebar */}
      <div className="container dashboard-layout">
        {/* Sidebar Nav */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-menu">
            <button
              type="button"
              className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-label">Profile Overview</span>
            </button>

            <button
              type="button"
              className={`sidebar-nav-item ${activeTab === 'houses' ? 'active' : ''}`}
              onClick={() => setActiveTab('houses')}
            >
              <span className="nav-icon">🏠</span>
              <span className="nav-label">Recommended Houses</span>
              <span className="sidebar-badge">AI</span>
            </button>

            <button
              type="button"
              className={`sidebar-nav-item ${activeTab === 'housing' ? 'active' : ''}`}
              onClick={() => setActiveTab('housing')}
            >
              <span className="nav-icon">📋</span>
              <span className="nav-label">Housing Preferences</span>
            </button>

            <button
              type="button"
              className={`sidebar-nav-item ${activeTab === 'lifestyle' ? 'active' : ''}`}
              onClick={() => setActiveTab('lifestyle')}
            >
              <span className="nav-icon">🧠</span>
              <span className="nav-label">Lifestyle Habits</span>
              <span className="sidebar-badge">Weights</span>
            </button>

            <button
              type="button"
              className={`sidebar-nav-item ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              <span className="nav-icon">📅</span>
              <span className="nav-label">My Visit Requests</span>
              {pendingRequestsCount > 0 && (
                <span className="sidebar-badge" style={{ backgroundColor: '#f59e0b' }}>
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          </div>

          <div className="sidebar-card-helper">
            <span className="helper-title">AI Matching Engine</span>
            <p className="helper-text">
              Preferences are weighted automatically to find like-minded flatmates across Dhaka.
            </p>
          </div>
        </aside>

        {/* Dynamic Content Main View */}
        <main className="dashboard-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
              <p className="text-muted">Loading your tenant profile &amp; inquiries...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <TenantProfileView
                  profile={profile}
                  onSwitchTab={setActiveTab}
                />
              )}

              {activeTab === 'houses' && (
                <RecommendedHouses
                  tenantPreferences={housingPrefs}
                />
              )}

              {activeTab === 'housing' && (
                <HousingPreferencesForm
                  initialPreferences={housingPrefs}
                  onSave={handleUpdateHousing}
                />
              )}

              {activeTab === 'lifestyle' && (
                <LifestyleHabitsForm
                  initialHabits={lifestyleHabits}
                  onSave={handleUpdateLifestyle}
                />
              )}

              {activeTab === 'requests' && (
                <TenantRequestsList
                  requests={requests}
                  onCancelRequest={handleCancelRequest}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default TenantDashboard;
