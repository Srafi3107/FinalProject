import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ListingDetails = () => {
  const { id } = useParams();

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="card" style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
        <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>Listing Details</span>
        <h2>Listing #{id || 'Preview'}</h2>
        <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
          Detailed property specs, photos, amenities (WiFi, Gas, Lift), visit booking, and rent prediction badge will be displayed here.
        </p>
        <Link to="/listings" className="btn btn-outline" style={{ marginTop: '1rem' }}>
          &larr; Back to Listings
        </Link>
      </div>
    </div>
  );
};

export default ListingDetails;
