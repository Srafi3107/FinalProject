const express = require('express');
const { pool } = require('../config/db');

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Check backend server & database connectivity status
 * @access  Public
 */
router.get('/health', async (req, res, next) => {
  let dbStatus = 'disconnected';
  let dbMessage = 'Database offline or not yet initialized';

  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    if (rows && rows[0]?.result === 2) {
      dbStatus = 'connected';
      dbMessage = 'MySQL database connection active';
    }
  } catch (error) {
    dbStatus = 'error';
    dbMessage = error.message;
  }

  res.status(200).json({
    success: true,
    status: 'healthy',
    service: 'HomeMatch Backend REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbStatus,
      message: dbMessage
    }
  });
});

module.exports = router;
