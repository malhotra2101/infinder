/**
 * Campaign Routes
 * 
 * API routes for campaign-related operations including
 * creating, reading, updating, and deleting campaigns.
 */

const express = require('express');
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getCampaignStats
} = require('../controllers/campaignController');

const router = express.Router();

/**
 * @route   POST /api/campaigns
 * @desc    Create a new campaign
 * @access  Public
 */
router.post('/', createCampaign);

/**
 * @route   GET /api/campaigns
 * @desc    Get all campaigns with optional filtering and pagination
 * @access  Public
 */
router.get('/', getCampaigns);

/**
 * @route   GET /api/campaigns/stats
 * @desc    Get campaign statistics
 * @access  Public
 */
router.get('/stats', getCampaignStats);

/**
 * @route   GET /api/campaigns/:id
 * @desc    Get a single campaign by ID
 * @access  Public
 */
router.get('/:id', getCampaignById);

/**
 * @route   PUT /api/campaigns/:id
 * @desc    Update a campaign
 * @access  Public
 */
router.put('/:id', updateCampaign);

/**
 * @route   DELETE /api/campaigns/:id
 * @desc    Delete a campaign
 * @access  Public
 */
router.delete('/:id', deleteCampaign);

module.exports = router; 