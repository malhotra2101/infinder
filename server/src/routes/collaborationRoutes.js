/**
 * Collaboration Routes
 * 
 * Defines all collaboration-related API endpoints
 */

const express = require('express');
const router = express.Router();
const {
  createCollaborationRequest,
  getUserRequests,
  getCollaborationRequestById,
  updateCollaborationRequestStatus,
  deleteCollaborationRequest,
  getCollaborationStats
} = require('../controllers/collaborationController');

/**
 * @route   POST /api/collaboration-requests
 * @desc    Create a new collaboration request
 * @access  Public (for now, can be restricted later)
 */
router.post('/', createCollaborationRequest);

/**
 * @route   GET /api/collaboration-requests
 * @desc    Get collaboration requests for a user
 * @access  Public (for now, can be restricted later)
 */
router.get('/', getUserRequests);

/**
 * @route   GET /api/collaboration-requests/stats
 * @desc    Get collaboration request statistics
 * @access  Public (for now, can be restricted later)
 */
router.get('/stats', getCollaborationStats);

/**
 * @route   GET /api/collaboration-requests/:id
 * @desc    Get a specific collaboration request by ID
 * @access  Public (for now, can be restricted later)
 */
router.get('/:id', getCollaborationRequestById);

/**
 * @route   PUT /api/collaboration-requests/:id/status
 * @desc    Update collaboration request status
 * @access  Public (for now, can be restricted later)
 */
router.put('/:id/status', updateCollaborationRequestStatus);

/**
 * @route   DELETE /api/collaboration-requests/:id
 * @desc    Delete a collaboration request
 * @access  Public (for now, can be restricted later)
 */
router.delete('/:id', deleteCollaborationRequest);

module.exports = router; 