/**
 * Email Sequence Routes
 * 
 * API routes for managing email sequences
 */

const express = require('express');
const {
  createEmailSequence,
  getEmailSequences,
  getEmailSequenceById,
  startEmailSequence,
  pauseEmailSequence,
  deleteEmailSequence,
  getSequenceAnalytics
} = require('../controllers/emailSequenceController');

const router = express.Router();

/**
 * @route   POST /api/email-sequences
 * @desc    Create a new email sequence
 * @access  Public
 */
router.post('/', createEmailSequence);

/**
 * @route   GET /api/email-sequences/brand/:brand_id
 * @desc    Get all email sequences for a brand
 * @query   status - Filter by sequence status
 * @query   campaign_id - Filter by campaign
 * @access  Public
 */
router.get('/brand/:brand_id', getEmailSequences);

/**
 * @route   GET /api/email-sequences/:id
 * @desc    Get a single email sequence by ID
 * @access  Public
 */
router.get('/:id', getEmailSequenceById);

/**
 * @route   POST /api/email-sequences/:id/start
 * @desc    Start an email sequence
 * @access  Public
 */
router.post('/:id/start', startEmailSequence);

/**
 * @route   POST /api/email-sequences/:id/pause
 * @desc    Pause an email sequence
 * @access  Public
 */
router.post('/:id/pause', pauseEmailSequence);

/**
 * @route   DELETE /api/email-sequences/:id
 * @desc    Delete an email sequence
 * @access  Public
 */
router.delete('/:id', deleteEmailSequence);

/**
 * @route   GET /api/email-sequences/:id/analytics
 * @desc    Get analytics for an email sequence
 * @access  Public
 */
router.get('/:id/analytics', getSequenceAnalytics);

module.exports = router;
