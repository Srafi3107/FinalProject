const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validateAuth');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new tenant or owner account
 * @access  Public
 */
router.post('/register', validateRegister, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user with email & password, returns JWT token
 * @access  Public
 */
router.post('/login', validateLogin, login);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user's profile
 * @access  Private (JWT required)
 */
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;
