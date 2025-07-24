/**
 * Campaign Influencer Routes
 * 
 * Defines all routes for managing campaign-influencer relationships
 */

const express = require('express');
const router = express.Router();
const {
  assignInfluencerToCampaign,
  getInfluencersByCampaignAndStatus,
  updateInfluencerStatus,
  removeInfluencerFromCampaign,
  getCampaignInfluencersSummary,
  getAllCampaignInfluencers
} = require('../controllers/campaignInfluencerController');

/**
 * @route   POST /api/campaign-influencers/assign
 * @desc    Assign influencer to a campaign
 * @access  Public (for now, can be made private later)
 */
router.post('/assign', assignInfluencerToCampaign);

/**
 * @route   GET /api/campaign-influencers/:campaignId
 * @desc    Get all influencers for a campaign (all statuses)
 * @access  Public
 */
router.get('/:campaignId', getAllCampaignInfluencers);

/**
 * @route   GET /api/campaign-influencers/:campaignId/:status
 * @desc    Get influencers by campaign and status
 * @access  Public
 */
router.get('/:campaignId/:status', getInfluencersByCampaignAndStatus);

/**
 * @route   GET /api/campaign-influencers/:campaignId/summary
 * @desc    Get campaign influencers summary
 * @access  Public
 */
router.get('/:campaignId/summary', getCampaignInfluencersSummary);

/**
 * @route   PUT /api/campaign-influencers/:id/status
 * @desc    Update influencer status for a campaign
 * @access  Public
 */
router.put('/:id/status', updateInfluencerStatus);

/**
 * @route   DELETE /api/campaign-influencers/:id
 * @desc    Remove influencer from campaign
 * @access  Public
 */
router.delete('/:id', removeInfluencerFromCampaign);

module.exports = router; 