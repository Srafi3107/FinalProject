import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Listings from './pages/Listings';
import ListingDetails from './pages/ListingDetails';
import Roommates from './pages/Roommates';
import MarketDashboard from './pages/MarketDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TenantDashboard from './pages/TenantDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
          <Route path="/roommates" element={<Roommates />} />
          <Route path="/market" element={<MarketDashboard />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Tenant Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['tenant', 'admin']}>
                <TenantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['tenant', 'admin']}>
                <TenantDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Property Owner Routes */}
          <Route
            path="/owner-dashboard"
            element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
