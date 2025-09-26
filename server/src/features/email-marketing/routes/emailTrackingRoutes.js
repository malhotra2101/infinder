/**
 * Email Tracking Routes
 * 
 * API routes for email tracking and analytics
 */

const express = require('express');
const {
  trackEmailOpen,
  trackEmailClick,
  recordInfluencerResponse,
  handleUnsubscribe,
  getTrackingAnalytics
} = require('../controllers/emailTrackingController');

const router = express.Router();

/**
 * @route   GET /api/email-tracking/:tracking_id/open
 * @desc    Track email open (returns 1x1 pixel)
 * @access  Public
 */
router.get('/:tracking_id/open', trackEmailOpen);

/**
 * @route   GET /api/email-tracking/:tracking_id/click
 * @desc    Track email click and redirect
 * @query   url - URL to redirect to after tracking
 * @access  Public
 */
router.get('/:tracking_id/click', trackEmailClick);

/**
 * @route   POST /api/email-tracking/response
 * @desc    Record influencer response
 * @access  Public
 */
router.post('/response', recordInfluencerResponse);

/**
 * @route   GET /api/email-tracking/unsubscribe
 * @desc    Handle unsubscribe request
 * @query   seq - Sequence ID
 * @query   inf - Influencer ID
 * @access  Public
 */
router.get('/unsubscribe', handleUnsubscribe);

/**
 * @route   GET /api/email-tracking/analytics/:sequence_id
 * @desc    Get tracking analytics for a sequence
 * @access  Public
 */
router.get('/analytics/:sequence_id', getTrackingAnalytics);

module.exports = router;
