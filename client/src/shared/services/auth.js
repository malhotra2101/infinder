/**
 * Authentication Service
 * 
 * Handles user authentication operations including login, signup,
 * and session management with backend API integration.
 */

import { API_CONFIG } from '../config/config.js';

const API_BASE_URL = `${API_CONFIG.BASE_URL}/api`;

/**
 * Authentication service with backend integration
 */
class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.token = localStorage.getItem('auth_token');
    this.refreshTokenTimer = null;
    
    // Check if user is already logged in
    if (this.token) {
      // Also try to get cached user data
      const cachedUser = localStorage.getItem('auth_user');
      if (cachedUser) {
        try {
          this.currentUser = JSON.parse(cachedUser);
          this.isAuthenticated = true;
        } catch (error) {
          console.error('Error parsing cached user data:', error);
          localStorage.removeItem('auth_user');
        }
      }
      this.initializeFromToken();
    }
  }

  /**
   * Initialize user from stored token
   */
  async initializeFromToken() {
    try {
      // First validate the stored session
      if (!this.validateStoredSession()) {
        return;
      }

      // If we have cached user data and session is valid, use it immediately
      if (this.currentUser && this.isAuthenticated) {
        this.setupTokenRefresh();
        console.log('✅ Restored authentication from cache');
        return;
      }

      // Otherwise, verify with API
      const user = await this.getCurrentUserFromAPI();
      if (user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        this.setupTokenRefresh();
        console.log('✅ Authentication verified with server');
      } else {
        this.logout(); // Clear invalid token
      }
    } catch (error) {
      console.error('Token initialization error:', error);
      this.logout(); // Clear invalid token
    }
  }

  /**
   * Get current user from API
   * @returns {Promise<Object|null>} User object or null
   */
  async getCurrentUserFromAPI() {
    try {
      if (!this.token) return null;
      
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get user profile');
      }

      const result = await response.json();
      return result.success ? result.user : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login result
   */
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          message: result.message || 'Login failed'
        };
      }

      // Store token and user data persistently
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('auth_user', JSON.stringify(result.user));
      localStorage.setItem('auth_login_timestamp', Date.now().toString());
      localStorage.setItem('auth_device_id', this.generateDeviceId());
      this.token = result.token;
      this.currentUser = result.user;
      this.isAuthenticated = true;
      
      // Set up token refresh (refresh token every 23 hours if auto-login is enabled)
      this.setupTokenRefresh();
      
      console.log('✅ User logged in and session persisted for 7 days');

      return {
        success: true,
        user: result.user,
        token: result.token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Signup new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Signup result
   */
  async signup(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          message: result.message || 'Signup failed'
        };
      }

      // Store token and user data persistently
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('auth_user', JSON.stringify(result.user));
      localStorage.setItem('auth_login_timestamp', Date.now().toString());
      localStorage.setItem('auth_device_id', this.generateDeviceId());
      this.token = result.token;
      this.currentUser = result.user;
      this.isAuthenticated = true;
      
      // Set up token refresh for signup as well
      this.setupTokenRefresh();
      
      console.log('✅ User signed up and session persisted for 7 days');

      return {
        success: true,
        user: result.user,
        token: result.token
      };
    } catch (error) {
      console.error('AuthService signup error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   * @returns {Promise<Object>} Logout result
   */
  async logout() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Clear all auth-related local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_login_timestamp');
      localStorage.removeItem('auth_device_id');
      
      // Clear token refresh timer
      if (this.refreshTokenTimer) {
        clearTimeout(this.refreshTokenTimer);
        this.refreshTokenTimer = null;
      }
      
      // Reset state
      this.token = null;
      this.currentUser = null;
      this.isAuthenticated = false;
      
      console.log('🔓 User logged out, session cleared');

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current user
   * @returns {Object|null} Current user object
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Get current user from API (force refresh)
   * @returns {Promise<Object|null>} Current user object
   */
  async refreshCurrentUser() {
    const user = await this.getCurrentUserFromAPI();
    if (user) {
      this.currentUser = user;
    }
    return user;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  /**
   * Get authentication token
   * @returns {string|null} Authentication token
   */
  getToken() {
    return this.token;
  }

  /**
   * Refresh token (mock implementation)
   * @returns {Promise<Object>} Refresh result
   */
  async refreshToken() {
    try {
      if (!this.currentUser) {
        throw new Error('No user logged in');
      }

      // Create new token
      const token = btoa(JSON.stringify({
        userId: this.currentUser.id,
        email: this.currentUser.email,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));

      // Update stored token
      localStorage.setItem('auth_token', token);
      this.token = token;

      return { success: true, token };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset result
   */
  async resetPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Password reset failed');
      }

      return {
        success: true,
        message: result.message || 'Password reset instructions sent to your email'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  /**
   * Social login (mock implementation)
   * @param {string} provider - Social login provider
   * @param {Object} credentials - Social login credentials
   * @returns {Promise<Object>} Social login result
   */
  async socialLogin(provider, credentials) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, this would handle OAuth flow
      throw new Error(`${provider} login not implemented yet`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set up automatic token refresh
   * Refreshes token every 23 hours to keep user logged in
   */
  setupTokenRefresh() {
    // Clear any existing timer
    if (this.refreshTokenTimer) {
      clearTimeout(this.refreshTokenTimer);
    }

    // Set up refresh timer for 23 hours (23 * 60 * 60 * 1000 ms)
    this.refreshTokenTimer = setTimeout(async () => {
      try {
        console.log('🔄 Auto-refreshing authentication token...');
        await this.refreshToken();
        this.setupTokenRefresh(); // Set up next refresh
      } catch (error) {
        console.error('❌ Auto-refresh failed:', error);
        // Token refresh failed, user needs to log in again
        this.logout();
      }
    }, 23 * 60 * 60 * 1000); // 23 hours
  }

  /**
   * Check if session is expired (more than 7 days old)
   * @returns {boolean} Whether session is expired
   */
  isSessionExpired() {
    const loginTimestamp = localStorage.getItem('auth_login_timestamp');
    if (!loginTimestamp) return true;

    const loginTime = parseInt(loginTimestamp);
    const currentTime = Date.now();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000; // 7 days

    return (currentTime - loginTime) > sevenDaysInMs;
  }

  /**
   * Validate stored session
   * @returns {boolean} Whether session is valid
   */
  validateStoredSession() {
    // Check if we have required data
    if (!this.token || !localStorage.getItem('auth_user')) {
      return false;
    }

    // Check if session is expired
    if (this.isSessionExpired()) {
      console.log('🕒 Session expired (>7 days), logging out...');
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Generate a unique device identifier
   * @returns {string} Device identifier
   */
  generateDeviceId() {
    // Check if device ID already exists
    const existingDeviceId = localStorage.getItem('auth_device_id');
    if (existingDeviceId) {
      return existingDeviceId;
    }

    // Generate new device ID based on browser characteristics
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    
    const deviceFingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');

    // Create a simple hash of the fingerprint
    let hash = 0;
    for (let i = 0; i < deviceFingerprint.length; i++) {
      const char = deviceFingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    const deviceId = 'device_' + Math.abs(hash).toString(36) + '_' + Date.now();
    return deviceId;
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService; 