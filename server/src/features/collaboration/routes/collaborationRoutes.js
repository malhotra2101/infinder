/**
 * Collaboration Routes
 * 
 * Defines all collaboration-related API endpoints
 */

const express = require('express');
const {
  createCollaborationRequest,
  getCollaborationRequests,
  getCollaborationRequestById,
  updateCollaborationRequestStatus,
  deleteCollaborationRequest,
  getCollaborationRequestStats
} = require('../controllers/collaborationController');

const router = express.Router();

/**
 * @route   POST /api/collaboration-requests
 * @desc    Create a new collaboration request
 * @access  Public
 */
router.post('/', createCollaborationRequest);

/**
 * @route   GET /api/collaboration-requests
 * @desc    Get collaboration requests for a user
 * @access  Public
 */
router.get('/', getCollaborationRequests);

/**
 * @route   GET /api/collaboration-requests/stats
 * @desc    Get collaboration request statistics
 * @access  Public
 */
router.get('/stats', getCollaborationRequestStats);

/**
 * @route   GET /api/collaboration-requests/:id
 * @desc    Get a specific collaboration request by ID
 * @access  Public
 */
router.get('/:id', getCollaborationRequestById);

/**
 * @route   PUT /api/collaboration-requests/:id/status
 * @desc    Update collaboration request status
 * @access  Public
 */
router.put('/:id/status', updateCollaborationRequestStatus);

/**
 * @route   DELETE /api/collaboration-requests/:id
 * @desc    Delete a collaboration request
 * @access  Public
 */
router.delete('/:id', deleteCollaborationRequest);

module.exports = router; 