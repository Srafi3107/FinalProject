import React from 'react';

const MarketDashboard = () => {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <span className="badge badge-info" style={{ marginBottom: '1rem' }}>Supervisor Requirement</span>
        <h2>Dhaka Rent Market Trends & Dashboard</h2>
        <p style={{ maxWidth: '640px', margin: '0.75rem auto 1.5rem', color: 'var(--text-muted)' }}>
          Real-time rent analytics aggregated from top rental portals across Dhaka. Compare prices across Mirpur, Dhanmondi, Uttara, Gulshan, and Banani.
        </p>
        <p style={{ fontStyle: 'italic', color: 'var(--text-light)' }}>
          Chart.js visual analytics and scraper integration coming up on Day 6 & Week 3!
        </p>
      </div>
    </div>
  );
};

export default MarketDashboard;
