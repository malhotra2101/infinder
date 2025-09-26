/**
 * Backend API Service
 * 
 * Handles all API calls to the backend server for influencer data.
 * This replaces the mock data with real database queries.
 */

import { API_CONFIG } from '../config/config.js';
const API_BASE_URL = `${API_CONFIG.BASE_URL}/api`;

/**
 * Make API request with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response
 */
const apiRequest = async (endpoint, options = {}) => {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
        }
        
        // Retry on server errors (5xx)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      lastError = error;
      console.error(`API request failed (attempt ${attempt}/${maxRetries}):`, error);
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Only retry on network errors or server errors
      if (error.name === 'TypeError' && error.message.includes('fetch failed')) {
        console.log(`Network error detected, retrying in ${attempt * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      } else if (error.message && error.message.includes('HTTP error! status: 5')) {
        console.log(`Server error detected, retrying in ${attempt * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      } else {
        // Don't retry on other errors
        break;
      }
    }
  }
  
  throw lastError;
};

/**
 * Fetch influencers with search and filters
 * @param {Object} params - Search parameters
 * @param {string} params.searchTerm - Search term
 * @param {Object} params.filters - Filter object
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of results per page
 * @returns {Promise<Object>} Search results
 */
export const searchInfluencers = async ({ searchTerm = '', filters = {}, page = 1, limit = 20 }) => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add search term
    if (searchTerm.trim()) {
      queryParams.append('search', searchTerm);
    }

    // Add filters
    if (filters.platforms && filters.platforms.length > 0) {
      queryParams.append('platform', filters.platforms[0]); // For now, use first platform
    }

    if (filters.minFollowers) {
      queryParams.append('minFollowers', filters.minFollowers.toString());
    }

    if (filters.maxFollowers) {
      queryParams.append('maxFollowers', filters.maxFollowers.toString());
    }

    if (filters.minEngagement) {
      queryParams.append('minEngagement', filters.minEngagement.toString());
    }

    if (filters.maxEngagement) {
      queryParams.append('maxEngagement', filters.maxEngagement.toString());
    }

    if (filters.country) {
      queryParams.append('country', filters.country);
    }

    if (filters.ageGroups && filters.ageGroups.length > 0) {
      queryParams.append('ageGroup', filters.ageGroups[0]); // For now, use first age group
    }

    if (filters.lastActive) {
      queryParams.append('lastActive', filters.lastActive);
    }

    const response = await apiRequest(`/influencers?${queryParams.toString()}`);

    return {
      data: response.data || [],
      count: response.pagination?.total || 0,
      hasMore: response.pagination?.hasMore || false,
      page: response.pagination?.page || page,
      totalPages: response.pagination?.totalPages || 1
    };
  } catch (error) {
    console.error('Error searching influencers:', error);
    throw error;
  }
};

/**
 * Get a single influencer by ID
 * @param {string|number} id - Influencer ID
 * @returns {Promise<Object>} Influencer data
 */
export const getInfluencerById = async (id) => {
  try {
    const response = await apiRequest(`/influencers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching influencer:', error);
    throw error;
  }
};

/**
 * Get available countries for filtering
 * @returns {Promise<Array>} List of countries
 */
export const getCountries = async () => {
  try {
    const response = await apiRequest('/influencers/countries/list');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

/**
 * Add influencer to a list
 * @param {Object} influencer - Influencer data
 * @param {string} listType - Type of list (selected, rejected)
 * @returns {Promise<Object>} Operation result
 */
export const addToList = async (influencer, listType) => {
  try {
    const response = await apiRequest('/influencers/lists/add', {
      method: 'POST',
      body: JSON.stringify({
        influencerId: influencer.id,
        listType
      })
    });

    return response;
  } catch (error) {
    console.error('Error adding to list:', error);
    throw error;
  }
};

/**
 * Remove influencer from a list
 * @param {Object} influencer - Influencer data
 * @param {string} listType - Type of list (selected, rejected)
 * @returns {Promise<Object>} Operation result
 */
export const removeFromList = async (influencer, listType) => {
  try {
    const response = await apiRequest('/influencers/lists/remove', {
      method: 'POST',
      body: JSON.stringify({
        influencerId: influencer.id,
        listType
      })
    });
    return response;
  } catch (error) {
    console.error('Error removing from list:', error);
    throw error;
  }
};

/**
 * Test API connection
 * @returns {Promise<boolean>} Connection status
 */
export const testApiConnection = async () => {
  try {
    await apiRequest('/ping');
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

/**
 * Fetch influencers by list type (selected/rejected)
 * @param {string} type - List type ('selected' or 'rejected')
 * @returns {Promise<Array>} List of influencers
 */
export const getInfluencersByListType = async (type, params = '') => {
  try {
    // For now, return mock response with proper structure
    // Mock response - can be replaced with real API when endpoints are available
    return {
      success: true,
      message: 'OK',
      data: {
        data: [], // Empty list of influencers
        pagination: {
          total: 0,
          totalPages: 0,
          currentPage: 1,
          limit: 20
        }
      }
    };
  } catch (error) {
    console.error('Error fetching influencers by list type:', error);
    throw error;
  }
};

/**
 * Fetch counts of selected and rejected influencers
 * @returns {Promise<Object>} Object with selected and rejected counts
 */
export const getListCounts = async () => {
  try {
    // Dead endpoint disabled for now
    return { selected: 0, rejected: 0 };
  } catch (error) {
    console.error('Error fetching list counts:', error);
    throw error;
  }
};

/**
 * Reset all influencer lists (clear selected and rejected)
 * @returns {Promise<Object>} Reset operation result
 */
export const resetLists = async () => {
  try {
    // Dead endpoint disabled for now
    return { success: true };
  } catch (error) {
    console.error('Error resetting lists:', error);
    throw error;
  }
};

/**
 * Fetch collaboration requests for a user
 * @param {string} userType - User type ('brand' or 'influencer')
 * @param {number} userId - User ID
 * @param {string} filter - Filter type ('all', 'sent', 'received')
 * @returns {Promise<Array>} List of collaboration requests
 */
export const getCollaborationRequests = async (userType = 'brand', userId = 1, filter = 'all') => {
  try {
    // Dead endpoint disabled for now
    return [];
  } catch (error) {
    console.error('Error fetching collaboration requests:', error);
    throw error;
  }
};

/**
 * Campaigns API Functions
 */

/**
 * Fetch all campaigns with optional filtering
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response with campaigns data
 */
export const getCampaigns = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const endpoint = `/campaigns${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await apiRequest(endpoint, {
      method: 'GET',
    });
    
    return response;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

/**
 * Fetch a single campaign by ID
 * @param {number} id - Campaign ID
 * @returns {Promise<Object>} API response with campaign data
 */
export const getCampaignById = async (id) => {
  try {
    const response = await apiRequest(`/campaigns/${id}`, {
      method: 'GET',
    });
    
    return response;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    throw error;
  }
};

/**
 * Create a new campaign
 * @param {Object} campaignData - Campaign data
 * @returns {Promise<Object>} API response with created campaign
 */
export const createCampaign = async (campaignData) => {
  try {
    const response = await apiRequest(`/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaignData),
    });
    
    return response;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

/**
 * Update an existing campaign
 * @param {number} id - Campaign ID
 * @param {Object} campaignData - Updated campaign data
 * @returns {Promise<Object>} API response with updated campaign
 */
export const updateCampaign = async (id, campaignData) => {
  try {
    const response = await apiRequest(`/campaigns/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaignData),
    });
    
    return response;
  } catch (error) {
    console.error('Error updating campaign:', error);
    throw error;
  }
};

/**
 * Delete a campaign
 * @param {number} id - Campaign ID
 * @returns {Promise<Object>} API response
 */
export const deleteCampaign = async (id) => {
  try {
    const response = await apiRequest(`/campaigns/${id}`, {
      method: 'DELETE',
    });
    
    return response;
  } catch (error) {
    console.error('Error deleting campaign:', error);
    throw error;
  }
};

/**
 * Get campaign statistics
 * @returns {Promise<Object>} API response with campaign stats
 */
export const getCampaignStats = async () => {
  try {
    const response = await apiRequest(`/campaigns/stats`, {
      method: 'GET',
    });
    
    return response;
  } catch (error) {
    console.error('Error fetching campaign stats:', error);
    throw error;
  }
}; 