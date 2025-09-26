/**
 * Authentication Routes
 * 
 * API routes for user authentication including login, signup, and profile management.
 */

const express = require('express');
const {
  signup,
  login,
  getProfile
} = require('../controllers/authController');
const { authenticateToken } = require('../../../shared/middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user with brand information
 * @access  Public
 */
router.post('/signup', signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user with email and password
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private (requires JWT token)
 */
router.get('/me', authenticateToken, getProfile);

module.exports = router;
