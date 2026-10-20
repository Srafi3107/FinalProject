import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { favoritesCount } = useFavorites();
  const navigate = useNavigate();

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/');
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">Home<span className="brand-accent">Match</span></span>
            <span className="brand-subtitle">Dhaka</span>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {/* Navigation Links & Action Buttons */}
        <nav className={`navbar-nav ${mobileMenuOpen ? 'is-open' : ''}`}>
          <div className="nav-links">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/listings"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Browse Houses
            </NavLink>
            <NavLink
              to="/roommates"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Find Roommates
            </NavLink>
            <NavLink
              to="/market"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Market Trends
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Saved ❤️{favoritesCount > 0 && <span className="nav-badge-count">{favoritesCount}</span>}
            </NavLink>

            {/* Role-Specific Portal Links */}
            {isAuthenticated && (user?.role === 'tenant' || user?.role === 'admin') && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
            )}

            {isAuthenticated && (user?.role === 'owner' || user?.role === 'admin') && (
              <NavLink
                to="/owner-dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Owner Portal
              </NavLink>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Admin Portal
              </NavLink>
            )}
          </div>

          <div className="nav-actions">
            {isAuthenticated && user ? (
              /* Authenticated User Menu */
              <div className="nav-user-profile">
                <div className="user-info-chip" title={`${user.name} (${user.email})`}>
                  <div className="user-avatar-badge">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="user-details">
                    <span className="user-display-name">{user.name.split(' ')[0]}</span>
                    <span className={`user-role-tag role-${user.role}`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-outline btn-sm logout-btn"
                  onClick={handleLogout}
                  title="Logout from session"
                >
                  Logout
                </button>
              </div>
            ) : (
              /* Guest Actions */
              <>
                <Link to="/login" className="btn btn-ghost btn-sm" onClick={closeMenu}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
