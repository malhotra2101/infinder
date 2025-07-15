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
  getCountries,
  addToList,
  getInfluencersByListType,
  getListCounts,
  removeFromList,
  resetLists
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

/**
 * @route   GET /api/influencers/countries/list
 * @desc    Get available countries for filtering
 * @access  Public
 */
router.get('/countries/list', getCountries);

/**
 * @route   POST /api/influencers/lists/add
 * @desc    Add influencer to a list (selected, rejected, etc.)
 * @access  Public
 */
router.post('/lists/add', addToList);

/**
 * @route   GET /api/influencers/lists/counts
 * @desc    Get counts of selected and rejected influencers
 * @access  Public
 */
router.get('/lists/counts', getListCounts);

/**
 * @route   GET /api/influencers/lists/:type
 * @desc    Get influencers by list type (selected/rejected)
 * @access  Public
 */
router.get('/lists/:type', getInfluencersByListType);

/**
 * @route   POST /api/influencers/lists/remove
 * @desc    Remove influencer from a list (selected, rejected, etc.)
 * @access  Public
 */
router.post('/lists/remove', removeFromList);

/**
 * @route   POST /api/influencers/lists/reset
 * @desc    Reset all influencer lists (clear selected and rejected)
 * @access  Public
 */
router.post('/lists/reset', resetLists);

module.exports = router; 