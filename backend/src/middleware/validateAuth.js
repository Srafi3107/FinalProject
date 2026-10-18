/**
 * Validation Middleware for Register & Login Request Bodies
 */

// Bangladeshi Mobile Number Pattern (013 to 019, followed by 8 digits)
const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

// Standard Email Pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegister = (req, res, next) => {
  const { name, email, password, phone, role } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Full name is required (minimum 2 characters).');
  }

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (!phone || !BD_PHONE_REGEX.test(phone.trim())) {
    errors.push('A valid Bangladeshi phone number is required (e.g., 01712345678).');
  }

  if (!role || !['tenant', 'owner'].includes(role)) {
    errors.push("Role must be either 'tenant' or 'owner'.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors
    });
  }

  // Clean strings
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.phone = phone.trim();

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.push('Please provide a valid email address.');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

module.exports = {
  validateRegister,
  validateLogin
};
