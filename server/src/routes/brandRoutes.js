const express = require('express');
const router = express.Router();
const {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandStats,
  getBrandsByIndustry,
  getBrandsWithMostCampaigns,
  searchBrands,
  getBrandsWithCampaigns
} = require('../controllers/brandController');

/**
 * Brand Routes
 * 
 * GET /api/brands - Get all brands with filtering and pagination
 * GET /api/brands/:id - Get brand by ID
 * POST /api/brands - Create new brand
 * PUT /api/brands/:id - Update brand
 * DELETE /api/brands/:id - Delete brand
 * GET /api/brands/stats - Get brand statistics
 * GET /api/brands/industry/:industry - Get brands by industry
 * GET /api/brands/top - Get brands with most campaigns
 * GET /api/brands/search - Search brands
 * GET /api/brands/with-campaigns - Get brands with their campaigns (for influencers)
 */

// Get all brands with filtering and pagination
router.get('/', getAllBrands);

// Get brand statistics
router.get('/stats', getBrandStats);

// Get brands with most campaigns
router.get('/top', getBrandsWithMostCampaigns);

// Search brands
router.get('/search', searchBrands);

// Get brands with campaigns (for influencers)
router.get('/with-campaigns', getBrandsWithCampaigns);

// Get brands by industry
router.get('/industry/:industry', getBrandsByIndustry);

// Get brand by ID (must be last to avoid catching other routes)
router.get('/:id', getBrandById);

// Create new brand
router.post('/', createBrand);

// Update brand
router.put('/:id', updateBrand);

// Delete brand
router.delete('/:id', deleteBrand);

module.exports = router; 