import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('tenant'); // 'tenant' or 'owner'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Bangladesh mobile regex: starts with 013-019 followed by 8 digits
    const bdPhoneRegex = /^01[3-9]\d{8}$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for Dhaka contact.';
    } else if (!bdPhoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Enter valid 11-digit Bangladeshi number (e.g. 01712345678).';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the HomeMatch Terms & Safe Housing Guidelines.';
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
    // Simulate user registration until connected with backend bcrypt + MySQL on Week 2
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage({
        type: 'success',
        text: `Account created for ${formData.name} as ${role === 'tenant' ? 'Tenant' : 'Property Owner'}! Connecting to MySQL backend on Day 9.`
      });
      setTimeout(() => navigate('/login'), 1500);
    }, 600);
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card auth-card-wide">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-badge">Dhaka Urban Housing</div>
            <h1 className="auth-title">Create Your Account</h1>
            <p className="auth-subtitle">
              Join students, bachelors, and property owners across Mirpur, Dhanmondi, Uttara &amp; Banani.
            </p>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`auth-alert alert-${statusMessage.type}`}>
              {statusMessage.text}
            </div>
          )}

          {/* Role Selection Tabs */}
          <div className="role-selection-section">
            <label className="role-selector-label">I want to join as a:</label>
            <div className="role-cards-grid">
              <button
                type="button"
                className={`role-card-btn ${role === 'tenant' ? 'selected' : ''}`}
                onClick={() => setRole('tenant')}
              >
                <span className="role-icon">👤</span>
                <span className="role-title">Tenant / Roommate</span>
                <span className="role-desc">
                  Find flats, sublets, or AI-matched roommates in Dhaka
                </span>
              </button>

              <button
                type="button"
                className={`role-card-btn ${role === 'owner' ? 'selected' : ''}`}
                onClick={() => setRole('owner')}
              >
                <span className="role-icon">🏠</span>
                <span className="role-title">Property Owner</span>
                <span className="role-desc">
                  Post apartments, manage visit requests, and find verified tenants
                </span>
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Full Name */}
            <Input
              label="Full Name"
              id="reg-name"
              name="name"
              type="text"
              placeholder="e.g. Tanvir Ahmed Chowdhury"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              autoComplete="name"
            />

            {/* Email and Phone in 2-column layout */}
            <div className="form-row">
              <Input
                label="Email Address"
                id="reg-email"
                name="email"
                type="email"
                placeholder="name@email.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                autoComplete="email"
              />

              <Input
                label="Phone Number (Bangladesh)"
                id="reg-phone"
                name="phone"
                type="tel"
                placeholder="01712345678"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
                autoComplete="tel"
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="form-row">
              <Input
                label="Password"
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 chars"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                autoComplete="new-password"
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

              <Input
                label="Confirm Password"
                id="reg-confirm-password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <span>
                  I agree to the HomeMatch Safe Community Rules (No illegal sublets, respectful roommate conduct).
                </span>
              </label>
              {errors.agreeTerms && <span className="field-error-text">{errors.agreeTerms}</span>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
            >
              {`Register as ${role === 'tenant' ? 'Tenant' : 'Property Owner'}`}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="auth-footer">
            <p>
              Already registered on HomeMatch?{' '}
              <Link to="/login" className="auth-link">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
