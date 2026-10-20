import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    const formErrors = validate();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    const result = await login({
      email: formData.email,
      password: formData.password
    });

    setIsSubmitting(false);

    if (result.success) {
      const userRole = result.user?.role;
      setStatusMessage({
        type: 'success',
        text: `Welcome back, ${result.user?.name || 'User'}!`
      });
      setTimeout(() => {
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'owner') {
          navigate('/owner-dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 700);
    } else {
      setStatusMessage({
        type: 'error',
        text: result.message || 'Login failed. Please check your credentials.'
      });
    }
  };

  // Quick helper for university viva test accounts
  const fillQuickAccount = (email, password) => {
    setFormData({
      email,
      password,
      rememberMe: true
    });
    setErrors({});
    setStatusMessage(null);
  };

  const handleQuickDemo = (role) => {
    const user = demoLogin(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'owner') navigate('/owner-dashboard');
    else navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-badge">Dhaka Housing &amp; Roommate Portal</div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Sign in to manage your property listings, view AI roommate matches, or schedule visits.
            </p>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`auth-alert alert-${statusMessage.type}`}>
              {statusMessage.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <Input
              label="Email Address"
              id="login-email"
              name="email"
              type="email"
              placeholder="e.g. student@univ.edu.bd"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
            />

            <div className="password-field-container">
              <div className="label-with-link">
                <span className="custom-input-label">
                  Password <span className="input-required-star">*</span>
                </span>
                <button
                  type="button"
                  className="link-btn forgot-link"
                  onClick={() => alert('Password reset will be available with Node mailer on Day 9!')}
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                autoComplete="current-password"
                rightElement={
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                }
              />
            </div>

            {/* Remember Me */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Viva Demo Accounts */}
          <div className="demo-accounts-box">
            <span className="demo-title">Viva Demo Test Accounts:</span>
            <div className="demo-pills">
              <button
                type="button"
                className="demo-pill"
                onClick={() => fillQuickAccount('tanvir@homematch.bd', 'password123')}
                title="Prefill Tanvir (Tenant)"
              >
                👤 Tenant (tanvir@)
              </button>
              <button
                type="button"
                className="demo-pill"
                onClick={() => fillQuickAccount('mofazzal@gmail.com', 'password123')}
                title="Prefill Mofazzal (Owner)"
              >
                🏠 Owner (mofazzal@)
              </button>
              <button
                type="button"
                className="demo-pill"
                onClick={() => fillQuickAccount('admin@homematch.bd', 'password123')}
                title="Prefill Admin"
              >
                🛡️ Admin (admin@)
              </button>
            </div>
            <div style={{ marginTop: '0.65rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Offline Fallback: <button type="button" onClick={() => handleQuickDemo('tenant')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.725rem' }}>1-Click Tenant</button> | <button type="button" onClick={() => handleQuickDemo('owner')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.725rem' }}>Owner</button> | <button type="button" onClick={() => handleQuickDemo('admin')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.725rem' }}>Admin</button>
              </span>
            </div>
          </div>

          {/* Footer Link */}
          <div className="auth-footer">
            <p>
              Don't have an account yet?{' '}
              <Link to="/register" className="auth-link">
                Register as Tenant or Owner
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
