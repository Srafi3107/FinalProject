import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage(null);
    const formErrors = validate();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate auth response until backend JWT endpoint connected on Week 2
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage({
        type: 'success',
        text: 'Login validated! Backend JWT authentication connects on Day 9.'
      });
      setTimeout(() => navigate('/'), 1500);
    }, 600);
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
                onClick={() => fillQuickAccount('tenant@homematch.bd', 'tenant123')}
              >
                👤 Tenant
              </button>
              <button
                type="button"
                className="demo-pill"
                onClick={() => fillQuickAccount('owner@homematch.bd', 'owner123')}
              >
                🏠 Owner
              </button>
              <button
                type="button"
                className="demo-pill"
                onClick={() => fillQuickAccount('admin@homematch.bd', 'admin123')}
              >
                🛡️ Admin
              </button>
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
