import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingState from './common/LoadingState';

/**
 * ProtectedRoute Component
 * Guards private routes and verifies role permission
 *
 * @param {React.ReactNode} children - The component to render if allowed
 * @param {string[]} allowedRoles - Optional array of authorized roles e.g. ['admin', 'owner', 'tenant']
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingState message="Verifying authentication session..." size="md" />
      </div>
    );
  }

  // Not logged in -> redirect to login with return path
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If unauthorized, redirect to their role's natural dashboard or home
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'owner') {
      return <Navigate to="/owner-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
