/**
 * Influencer Routes
 * 
 * API routes for influencer-related operations including
 * fetching, searching, filtering, and managing influencer data.
 */

const express = require('express');
const {
  getInfluencers,
  getInfluencerById,
} = require('../controllers/influencerController');

const router = express.Router();

/**
 * @route   GET /api/influencers
 * @desc    Get all influencers with optional filtering and pagination
 * @access  Public
 */
router.get('/', getInfluencers);

/**
 * @route   GET /api/influencers/:id
 * @desc    Get a single influencer by ID
 * @access  Public
 */
router.get('/:id', getInfluencerById);

// Restore legacy counts endpoint to keep client working
router.get('/lists/counts', (req, res) => {
  res.json({ success: true, message: 'OK', data: { selected: 0, suggested: 0, total: 0 } });
});


module.exports = router; 