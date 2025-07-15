/**
 * API Service
 *
 * Centralized service for making HTTP requests to the backend API.
 * Provides consistent error handling, request/response interceptors,
 * and standardized API calls.
 */

import axios from 'axios';
import { ROUTES } from '../constants/routes';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5052';

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Include cookies in requests
});

/**
 * Request interceptor for adding auth tokens
 */
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add authentication token if available
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // Log requests only in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Request interceptor error:', error);
    }
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log responses only in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url
      });
    }

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
      ...config
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

export default apiClient; 