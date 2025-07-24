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
  removeFromCampaigns,
  resetLists,
  getInfluencerCampaigns,
  sendCollaborationRequest,
  updateInfluencerListStatus
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
 * @route   POST /api/influencers/lists/remove-campaigns
 * @desc    Remove influencer from multiple campaigns
 * @access  Public
 */
router.post('/lists/remove-campaigns', removeFromCampaigns);

/**
 * @route   POST /api/influencers/lists/reset
 * @desc    Reset all influencer lists (clear selected and rejected)
 * @access  Public
 */
router.post('/lists/reset', resetLists);

/**
 * @route   GET /api/influencers/:influencerId/campaigns
 * @desc    Get campaigns for a specific influencer from influencer_lists
 * @access  Public
 */
router.get('/:influencerId/campaigns', getInfluencerCampaigns);

/**
 * @route   POST /api/influencers/send-request
 * @desc    Send collaboration request from influencer to brand
 * @access  Public
 */
router.post('/send-request', sendCollaborationRequest);

/**
 * @route   PUT /api/influencers/lists/:id/status
 * @desc    Update influencer list status and handle automatic removal for rejected status
 * @access  Public
 */
router.put('/lists/:id/status', updateInfluencerListStatus);

module.exports = router; 