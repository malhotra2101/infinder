/**
 * Error Handling Utilities
 * 
 * Centralized error handling functions for consistent error responses
 * and logging across the application.
 */

/**
 * Custom error class for API errors
 */
class APIError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create a standardized error response
 * @param {Error} error - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleError = (error, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Log error details
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  // Determine status code
  const statusCode = error.statusCode || 500;
  
  // Create error response
  const errorResponse = {
    error: true,
    message: error.message || 'Internal server error',
    statusCode,
    timestamp: new Date().toISOString()
  };
  
  // Add stack trace in development
  if (isDevelopment && error.stack) {
    errorResponse.stack = error.stack;
  }
  
  res.status(statusCode).json(errorResponse);
};

/**
 * Create a 404 error handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleNotFound = (req, res) => {
  const error = new APIError(`Route ${req.method} ${req.path} not found`, 404);
  handleError(error, req, res);
};

/**
 * Async error wrapper for route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function with error handling
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validate required fields in request body
 * @param {Array} requiredFields - Array of required field names
 * @returns {Function} Validation middleware function
 */
const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      const error = new APIError(
        `Missing required fields: ${missingFields.join(', ')}`,
        400
      );
      return next(error);
    }
    
    next();
  };
};

/**
 * Create success response wrapper
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Standardized success response
 */
const createSuccessResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    message,
    data,
    statusCode,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  APIError,
  handleError,
  handleNotFound,
  asyncHandler,
  validateRequiredFields,
  createSuccessResponse
}; 