/**
 * Error Handling Utilities
 *
 * Centralized error handling for consistent error management across the application.
 * Provides standardized error logging, user notifications, and error recovery.
 */

/**
 * Error types for categorization
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Standard error structure
 * @typedef {Object} AppError
 * @property {string} type - Error type from ERROR_TYPES
 * @property {string} message - Human-readable error message
 * @property {string} severity - Error severity from ERROR_SEVERITY
 * @property {string} code - Error code for programmatic handling
 * @property {Object} details - Additional error details
 * @property {Error} originalError - Original error object
 */

/**
 * Create a standardized error object
 * @param {string} type - Error type
 * @param {string} message - Error message
 * @param {string} severity - Error severity
 * @param {string} code - Error code
 * @param {Object} details - Additional details
 * @param {Error} originalError - Original error
 * @returns {AppError} Standardized error object
 */
export const createError = (type, message, severity = ERROR_SEVERITY.MEDIUM, code = '', details = {}, originalError = null) => ({
  type,
  message,
  severity,
  code,
  details,
  originalError,
  timestamp: new Date().toISOString()
});

/**
 * Log error with appropriate level based on severity
 * @param {AppError} error - Error object to log
 */
export const logError = (error) => {
  const { type, message, severity, details, timestamp } = error;

  const logData = {
    type,
    message,
    severity,
    details,
    timestamp,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Silently handle errors or implement custom logging
  switch (severity) {
    case ERROR_SEVERITY.LOW:
      // Handle low severity errors
      break;
    case ERROR_SEVERITY.MEDIUM:
      // Handle medium severity errors
      break;
    case ERROR_SEVERITY.HIGH:
    case ERROR_SEVERITY.CRITICAL:
      // Handle high/critical severity errors
      // TODO: Send to error reporting service (e.g., Sentry)
      break;
    default:
      // Handle unknown errors
  }
};

/**
 * Handle API errors and convert to standardized format
 * @param {Error} error - Axios or fetch error
 * @returns {AppError} Standardized error object
 */
export const handleApiError = (error) => {
  let type = ERROR_TYPES.UNKNOWN;
  let message = 'An unexpected error occurred';
  let severity = ERROR_SEVERITY.MEDIUM;
  let code = '';
  let details = {};

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    code = status.toString();

    switch (status) {
      case 400:
        type = ERROR_TYPES.VALIDATION;
        message = data?.message || 'Invalid request data';
        severity = ERROR_SEVERITY.LOW;
        details = data;
        break;
      case 401:
        type = ERROR_TYPES.AUTHENTICATION;
        message = 'Authentication required';
        severity = ERROR_SEVERITY.MEDIUM;
        break;
      case 403:
        type = ERROR_TYPES.AUTHORIZATION;
        message = 'Access denied';
        severity = ERROR_SEVERITY.MEDIUM;
        break;
      case 404:
        type = ERROR_TYPES.NOT_FOUND;
        message = 'Resource not found';
        severity = ERROR_SEVERITY.LOW;
        break;
      case 500:
        type = ERROR_TYPES.SERVER;
        message = 'Server error occurred';
        severity = ERROR_SEVERITY.HIGH;
        break;
      default:
        type = ERROR_TYPES.SERVER;
        message = data?.message || `Server error (${status})`;
        severity = ERROR_SEVERITY.MEDIUM;
    }
  } else if (error.request) {
    // Network error
    type = ERROR_TYPES.NETWORK;
    message = 'Network error - please check your connection';
    severity = ERROR_SEVERITY.HIGH;
  } else {
    // Other error
    message = error.message || 'An unexpected error occurred';
  }

  return createError(type, message, severity, code, details, error);
};

/**
 * Show user-friendly error notification
 * @param {AppError} error - Error object
 * @param {Function} showNotification - Notification function (optional)
 */
export const showErrorNotification = (error, showNotification = null) => {
  const { message, severity } = error;

  // Use provided notification function or fallback to alert
  if (showNotification && typeof showNotification === 'function') {
    showNotification({
      type: severity === ERROR_SEVERITY.CRITICAL ? 'error' : 'warning',
      message,
      duration: severity === ERROR_SEVERITY.CRITICAL ? 0 : 5000
    });
  } else {
    // Fallback to browser alert for critical errors
    if (severity === ERROR_SEVERITY.CRITICAL) {
      alert(`Critical Error: ${message}`);
    }
  }
};

/**
 * Handle errors with logging and user notification
 * @param {Error|AppError} error - Error to handle
 * @param {Function} showNotification - Notification function (optional)
 * @returns {AppError} Standardized error object
 */
export const handleError = (error, showNotification = null) => {
  // Convert to standardized error if it's not already
  const standardizedError = error.type ? error : handleApiError(error);

  // Log the error
  logError(standardizedError);

  // Show user notification
  showErrorNotification(standardizedError, showNotification);

  return standardizedError;
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise that resolves with function result
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}; 