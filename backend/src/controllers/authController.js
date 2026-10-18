const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

/**
 * Generate signed JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'homematch_dhaka_super_secret_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new tenant or owner account with bcrypt password hashing
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if email already registered
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    // Hash password with bcrypt (10 rounds)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into MySQL
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, role]
    );

    const newUserId = result.insertId;

    // If tenant, initialize an empty tenant_profiles row
    if (role === 'tenant') {
      await pool.query(
        'INSERT INTO tenant_profiles (user_id, target_budget, preferred_areas) VALUES (?, ?, ?)',
        [newUserId, 15000, JSON.stringify(['Mirpur', 'Dhanmondi'])]
      );
    }

    const newUser = {
      id: newUserId,
      name,
      email,
      phone,
      role,
      is_verified: false,
      avatar: null
    };

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to HomeMatch.',
      token,
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fetch user by email
    const [rows] = await pool.query(
      'SELECT id, name, email, password, phone, role, avatar, is_verified, is_blocked FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Email not found.'
      });
    }

    const user = rows[0];

    // Check if user is blocked by admin
    if (user.is_blocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by administration. Please contact support.'
      });
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    // Exclude password hash from response
    const { password: _, is_blocked: __, ...userProfile } = user;

    const token = generateToken(userProfile);

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: userProfile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 * @access  Private (JWT required)
 */
const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
