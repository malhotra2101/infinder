const BaseService = require('./baseService');
const { ApiError } = require('../utils/errorHandler');

/**
 * Service for influencer-related operations
 */
class InfluencerService extends BaseService {
  constructor() {
    super();
    this.table = 'influencers';
  }

  /**
   * Create a new influencer
   * @param {Object} influencerData - Influencer data
   * @returns {Promise<Object>} Created influencer
   */
  async createInfluencer(influencerData) {
    // TODO: Add validation for required fields
    // TODO: Add business logic for influencer creation
    
    return await this.create(this.table, influencerData);
  }

  /**
   * Get influencer by ID
   * @param {string|number} id - Influencer ID
   * @returns {Promise<Object>} Influencer data
   */
  async getInfluencerById(id) {
    return await this.findById(this.table, id);
  }

  /**
   * Get all influencers with optional filters
   * @param {Object} filters - Filter conditions
   * @returns {Promise<Array>} List of influencers
   */
  async getAllInfluencers(filters = {}) {
    return await this.findAll(this.table, filters);
  }

  /**
   * Update influencer by ID
   * @param {string|number} id - Influencer ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated influencer
   */
  async updateInfluencer(id, updateData) {
    // TODO: Add validation for update data
    return await this.updateById(this.table, id, updateData);
  }

  /**
   * Delete influencer by ID
   * @param {string|number} id - Influencer ID
   * @returns {Promise<Object>} Deleted influencer
   */
  async deleteInfluencer(id) {
    // TODO: Add business logic for deletion (e.g., check for active campaigns)
    return await this.deleteById(this.table, id);
  }

  /**
   * Search influencers by name or description
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching influencers
   */
  async searchInfluencers(searchTerm) {
    try {
      const { data: result, error } = await this.supabase
        .from(this.table)
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('name');

      if (error) {
        throw new ApiError(`Failed to search influencers: ${error.message}`, 400);
      }

      return result || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to search influencers', 500);
    }
  }

  /**
   * Get influencers by platform
   * @param {string} platform - Platform name
   * @returns {Promise<Array>} Influencers on the platform
   */
  async getInfluencersByPlatform(platform) {
    try {
      const { data: result, error } = await this.supabase
        .from(this.table)
        .select('*')
        .eq('platform', platform)
        .order('followers_count', { ascending: false });

      if (error) {
        throw new ApiError(`Failed to get influencers by platform: ${error.message}`, 400);
      }

      return result || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to get influencers by platform', 500);
    }
  }

  /**
   * Get top influencers by follower count
   * @param {number} limit - Number of influencers to return
   * @returns {Promise<Array>} Top influencers
   */
  async getTopInfluencers(limit = 10) {
    try {
      const { data: result, error } = await this.supabase
        .from(this.table)
        .select('*')
        .order('followers_count', { ascending: false })
        .limit(limit);

      if (error) {
        throw new ApiError(`Failed to get top influencers: ${error.message}`, 400);
      }

      return result || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to get top influencers', 500);
    }
  }
}

module.exports = new InfluencerService(); 