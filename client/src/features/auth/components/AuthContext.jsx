import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { authService } from '@shared/services/index.js';

/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 * Manages user login, logout, and authentication status.
 */

const AuthContext = createContext();

/**
 * Authentication Provider Component
 * 
 * Wraps the application to provide authentication context.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} AuthProvider component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize authentication state
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // AuthService handles initialization from stored tokens
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for initialization
        
        const currentUser = authService.getCurrentUser();
        const authenticated = authService.isUserAuthenticated();
        
        console.log('🔐 Auth initialization:', { authenticated, user: currentUser?.email });
        
        setUser(currentUser);
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear any invalid tokens
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} Login result
   */
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const result = await authService.login(credentials);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signup user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Signup result
   */
  const signup = async (userData) => {
    try {
      setIsLoading(true);
      const result = await authService.signup(userData);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Signup failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   * @returns {Promise<Object>} Logout result
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} Refresh result
   */
  const refreshToken = async () => {
    try {
      const result = await authService.refreshToken();
      return result;
    } catch (error) {
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  /**
   * Reset password
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset result
   */
  const resetPassword = async (email) => {
    try {
      return await authService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Social login
   * @param {string} provider - Social login provider
   * @param {Object} credentials - Social login credentials
   * @returns {Promise<Object>} Social login result
   */
  const socialLogin = async (provider, credentials) => {
    try {
      setIsLoading(true);
      const result = await authService.socialLogin(provider, credentials);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get current user
   * @returns {Object|null} Current user object
   */
  const getCurrentUser = () => {
    return user;
  };

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  const checkAuth = () => {
    return isAuthenticated;
  };

  /**
   * Get authentication token
   * @returns {string|null} Authentication token
   */
  const getToken = () => {
    return authService.getToken();
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    refreshToken,
    resetPassword,
    socialLogin,
    getCurrentUser,
    checkAuth,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// PropTypes for type checking
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Custom hook to use authentication context
 * 
 * @returns {Object} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 