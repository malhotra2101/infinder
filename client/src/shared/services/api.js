/**
 * API Service
 * 
 * Centralized service for making HTTP requests to the backend API.
 * Provides consistent error handling, request/response interceptors,
 * and standardized API calls.
 */

import axios from 'axios';
import { ROUTES } from '../constants/routes.js';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5052';

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

/**
 * Request interceptor for adding auth tokens and logging
 */
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add authentication token if available
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling and logging
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // TODO: Handle unauthorized access
      // localStorage.removeItem('authToken');
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Health check API
 * @returns {Promise<Object>} Health check response
 */
export const healthCheck = async () => {
  try {
    const response = await apiClient.get(ROUTES.API.PING);
    return response.data;
  } catch (error) {
    throw new Error(`Health check failed: ${error.message}`);
  }
};

/**
 * Get system information
 * @returns {Promise<Object>} System info response
 */
export const getSystemInfo = async () => {
  try {
    const response = await apiClient.get(ROUTES.API.INFO);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get system info: ${error.message}`);
  }
};

/**
 * Generic API request wrapper
 * @param {string} method - HTTP method
 * @param {string} url - API endpoint
 * @param {Object} data - Request data
 * @param {Object} config - Additional axios config
 * @returns {Promise<Object>} API response
 */
export const apiRequest = async (method, url, data = null, config = {}) => {
  try {
    const response = await apiClient.request({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw new Error(`API request failed: ${error.message}`);
  }
};

/**
 * Contact form submission
 * @param {Object} formData - Contact form data
 * @returns {Promise<Object>} Submission response
 */
export const submitContactForm = async (formData) => {
  try {
    // TODO: Implement actual contact form submission
    // const response = await apiClient.post('/api/contact', formData);
    // return response.data;
    
    // Mock response for now
    return {
      success: true,
      message: 'Contact form submitted successfully',
      data: formData
    };
  } catch (error) {
    throw new Error(`Contact form submission failed: ${error.message}`);
  }
};

/**
 * Newsletter signup
 * @param {string} email - Email address
 * @returns {Promise<Object>} Signup response
 */
export const newsletterSignup = async (email) => {
  try {
    // TODO: Implement actual newsletter signup
    // const response = await apiClient.post('/api/newsletter', { email });
    // return response.data;
    
    // Mock response for now
    return {
      success: true,
      message: 'Newsletter signup successful',
      data: { email }
    };
  } catch (error) {
    throw new Error(`Newsletter signup failed: ${error.message}`);
  }
};

/**
 * Get influencers by list type (selected, rejected, suggested)
 * @param {string} listType - Type of list (selected, rejected, suggested)
 * @param {string} queryParams - Query parameters for pagination and filtering
 * @returns {Promise<Object>} Influencers response
 */
export const getInfluencersByListType = async (listType, queryParams = '') => {
  try {
    const url = `/api/influencers/lists/${listType}${queryParams ? `?${queryParams}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ${listType} influencers: ${error.message}`);
  }
};

/**
 * Get list counts for selected, rejected, and suggested influencers
 * @returns {Promise<Object>} List counts response
 */
export const getListCounts = async () => {
  try {
    const response = await apiClient.get('/api/influencers/lists/counts');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch list counts: ${error.message}`);
  }
};

/**
 * Add influencer to list
 * @param {Object} data - Data containing influencerId and listType
 * @returns {Promise<Object>} Add to list response
 */
export const addToList = async (data) => {
  try {
    const response = await apiClient.post('/api/influencers/lists/add', data);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to add influencer to list: ${error.message}`);
  }
};

/**
 * Remove influencer from list
 * @param {Object} data - Data containing influencerId and listType
 * @returns {Promise<Object>} Remove from list response
 */
export const removeFromList = async (data) => {
  try {
    const response = await apiClient.post('/api/influencers/lists/remove', data);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to remove influencer from list: ${error.message}`);
  }
};

export default apiClient; 