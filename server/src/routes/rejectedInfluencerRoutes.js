/**
 * Rejected Influencer Routes
 * 
 * Defines API endpoints for managing rejected influencers
 */

const express = require('express');
const router = express.Router();
const {
  addRejectedInfluencer,
  getRejectedInfluencers,
  checkRejectionStatus,
  removeRejectedInfluencer
} = require('../controllers/rejectedInfluencerController');

// Add an influencer to the rejected list
router.post('/add', addRejectedInfluencer);

// Get rejected influencers for a brand
router.get('/', getRejectedInfluencers);

// Check if an influencer is rejected for a specific campaign
router.get('/check', checkRejectionStatus);

// Remove an influencer from the rejected list
router.delete('/:id', removeRejectedInfluencer);

module.exports = router; 