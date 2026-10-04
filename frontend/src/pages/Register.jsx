import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '560px' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create an Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Join Dhaka's premier housing & roommate network
        </p>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Tanvir Ahmed"
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. tanvir@gmail.com"
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Role</label>
            <select className="form-select" disabled>
              <option>Tenant (Looking for house or roommate)</option>
              <option>Property Owner (Posting houses/rooms)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Choose a strong password"
              disabled
            />
          </div>

          <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Create Account
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            Sign in
          </Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
          Interactive role selection & validations coming up on Day 2!
        </p>
      </div>
    </div>
  );
};

export default Register;
