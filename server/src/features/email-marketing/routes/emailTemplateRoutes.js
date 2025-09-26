/**
 * Email Template Routes
 * 
 * API routes for managing email templates
 */

const express = require('express');
const {
  getEmailTemplates,
  getEmailTemplateById,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  previewEmailTemplate
} = require('../controllers/emailTemplateController');

const router = express.Router();

/**
 * @route   GET /api/email-templates
 * @desc    Get all email templates, optionally filtered by category
 * @query   category - Filter by template category (initial, followup, reminder, final)
 * @access  Public
 */
router.get('/', getEmailTemplates);

/**
 * @route   GET /api/email-templates/:id
 * @desc    Get a single email template by ID
 * @access  Public
 */
router.get('/:id', getEmailTemplateById);

/**
 * @route   POST /api/email-templates
 * @desc    Create a new email template
 * @access  Public
 */
router.post('/', createEmailTemplate);

/**
 * @route   PUT /api/email-templates/:id
 * @desc    Update an email template
 * @access  Public
 */
router.put('/:id', updateEmailTemplate);

/**
 * @route   DELETE /api/email-templates/:id
 * @desc    Delete an email template (soft delete)
 * @access  Public
 */
router.delete('/:id', deleteEmailTemplate);

/**
 * @route   POST /api/email-templates/:id/preview
 * @desc    Preview email template with sample data
 * @access  Public
 */
router.post('/:id/preview', previewEmailTemplate);

module.exports = router;
