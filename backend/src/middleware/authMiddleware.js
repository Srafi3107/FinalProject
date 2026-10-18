const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

/**
 * verifyToken Middleware
 * Extracts Bearer JWT from Authorization header and verifies validity
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'homematch_dhaka_super_secret_jwt_key_2026'
    );

    // Verify user exists and is not blocked
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, role, is_verified, is_blocked FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. User account does not exist.'
      });
    }

    const user = rows[0];

    if (user.is_blocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by administration. Contact support.'
      });
    }

    // Attach user object to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.'
    });
  }
};

module.exports = {
  verifyToken
};
