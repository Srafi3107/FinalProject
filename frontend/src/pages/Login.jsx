import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '520px' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Sign in to your HomeMatch account
        </p>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. yourname@gmail.com"
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              disabled
            />
          </div>

          <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Sign In
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            Register here
          </Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
          Interactive form validation & JWT auth connecting on Day 2 & Week 2.
        </p>
      </div>
    </div>
  );
};

export default Login;
