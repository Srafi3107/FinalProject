import React, { useState } from 'react';
import { defaultTenantProfile } from '../data/mockData';
import TenantProfileView from '../components/dashboard/TenantProfileView';
import HousingPreferencesForm from '../components/dashboard/HousingPreferencesForm';
import LifestyleHabitsForm from '../components/dashboard/LifestyleHabitsForm';
import RecommendedHouses from '../components/dashboard/RecommendedHouses';
import './TenantDashboard.css';

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'houses', 'housing', 'lifestyle'
  const [profile, setProfile] = useState(defaultTenantProfile);

  const handleUpdateHousing = (newHousingPrefs) => {
    setProfile((prev) => ({
      ...prev,
      housingPreferences: newHousingPrefs
    }));
  };

  const handleUpdateLifestyle = (newLifestyleHabits) => {
    setProfile((prev) => ({
      ...prev,
      lifestyleHabits: newLifestyleHabits
    }));
  };

  return (
    <div className="dashboard-page">
      {/* Top Welcome Banner */}
      <section className="dashboard-banner">
        <div className="container dashboard-banner-container">
          <div className="dashboard-user-meta">
            <h1 className="dashboard-greeting">
              Welcome, {profile.name}!
            </h1>
            <p className="dashboard-sub">
              Manage your housing needs, lifestyle habits, and discover AI-matched Dhaka homes and flatmates.
            </p>
          </div>

          <div className="dashboard-quick-stats">
            <div className="quick-stat-box">
              <span className="stat-value">৳ {Number(profile.housingPreferences.targetBudget).toLocaleString()}</span>
              <span className="stat-caption">Target Rent Budget</span>
            </div>
            <div className="quick-stat-box">
              <span className="stat-value">{profile.housingPreferences.preferredAreas[0] || 'Mirpur'}</span>
              <span className="stat-caption">Top Preferred Area</span>
            </div>
            <div className="quick-stat-box">
              <span className="stat-value">{profile.lifestyleHabits.cleanliness}/5 ★</span>
              <span className="stat-caption">Cleanliness Level</span>
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
          {activeTab === 'overview' && (
            <TenantProfileView
              profile={profile}
              onSwitchTab={setActiveTab}
            />
          )}

          {activeTab === 'houses' && (
            <RecommendedHouses
              tenantPreferences={profile.housingPreferences}
            />
          )}

          {activeTab === 'housing' && (
            <HousingPreferencesForm
              initialPreferences={profile.housingPreferences}
              onSave={handleUpdateHousing}
            />
          )}

          {activeTab === 'lifestyle' && (
            <LifestyleHabitsForm
              initialHabits={profile.lifestyleHabits}
              onSave={handleUpdateLifestyle}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default TenantDashboard;
