import React from 'react';

const Listings = () => {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>Housing Listings</span>
        <h2>Browse Homes & Sublets in Dhaka</h2>
        <p style={{ maxWidth: '600px', margin: '0.75rem auto 1.5rem', color: 'var(--text-muted)' }}>
          Search bachelor, student, and family houses across Mirpur, Dhanmondi, Uttara, Banani, and more. Filter by rent, furnished status, and amenities.
        </p>
        <p style={{ fontStyle: 'italic', color: 'var(--text-light)' }}>
          Interactive search filters and Dhaka listings grid coming up on Day 3!
        </p>
      </div>
    </div>
  );
};

export default Listings;
