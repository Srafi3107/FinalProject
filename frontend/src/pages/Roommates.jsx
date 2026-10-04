import React from 'react';

const Roommates = () => {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <span className="badge badge-secondary" style={{ marginBottom: '1rem' }}>AI Roommate Matching</span>
        <h2>Find Compatible Roommates in Dhaka</h2>
        <p style={{ maxWidth: '620px', margin: '0.75rem auto 1.5rem', color: 'var(--text-muted)' }}>
          Match with university students and working bachelors based on cleanliness, sleep schedule, smoking habits, budget, and cooking preferences.
        </p>
        <p style={{ fontStyle: 'italic', color: 'var(--text-light)' }}>
          AI roommate cards and profile views coming up on Day 4!
        </p>
      </div>
    </div>
  );
};

export default Roommates;
