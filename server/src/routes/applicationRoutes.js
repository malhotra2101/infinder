/**
 * Application Routes
 * 
 * Defines all application-related API endpoints
 */

const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats
} = require('../controllers/applicationController');

/**
 * @route   POST /api/applications
 * @desc    Create a new application (campaign-influencer assignment)
 * @access  Public (for now, can be restricted later)
 */
router.post('/', createApplication);

/**
 * @route   GET /api/applications
 * @desc    Get all applications with optional filtering
 * @access  Public (for now, can be restricted later)
 */
router.get('/', getApplications);

/**
 * @route   GET /api/applications/stats
 * @desc    Get application statistics
 * @access  Public (for now, can be restricted later)
 */
router.get('/stats', getApplicationStats);

/**
 * @route   GET /api/applications/:id
 * @desc    Get a specific application by ID
 * @access  Public (for now, can be restricted later)
 */
router.get('/:id', getApplicationById);

/**
 * @route   PUT /api/applications/:id/status
 * @desc    Update an application status
 * @access  Public (for now, can be restricted later)
 */
router.put('/:id/status', updateApplicationStatus);

/**
 * @route   DELETE /api/applications/:id
 * @desc    Delete an application
 * @access  Public (for now, can be restricted later)
 */
router.delete('/:id', deleteApplication);

module.exports = router; 