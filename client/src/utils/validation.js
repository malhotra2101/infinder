/**
 * Validation Utilities
 * 
 * Centralized validation functions for form inputs and data validation.
 * Provides consistent validation across the application.
 */

/**
 * Email validation regex pattern
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone number validation regex pattern (basic)
 */
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone number is valid
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return PHONE_REGEX.test(cleanPhone);
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} Whether value is not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate minimum length
 * @param {string} value - String value to validate
 * @param {number} minLength - Minimum required length
 * @returns {boolean} Whether value meets minimum length
 */
export const hasMinLength = (value, minLength) => {
  if (!value || typeof value !== 'string') return false;
  return value.trim().length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value - String value to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} Whether value is within maximum length
 */
export const hasMaxLength = (value, maxLength) => {
  if (!value || typeof value !== 'string') return false;
  return value.trim().length <= maxLength;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with score and feedback
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      score: 0,
      feedback: 'Password is required'
    };
  }

  let score = 0;
  const feedback = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one special character');
  }

  return {
    isValid: score >= 4,
    score,
    feedback: feedback.length > 0 ? feedback : ['Strong password']
  };
};

/**
 * Validate form data object
 * @param {Object} formData - Form data to validate
 * @param {Object} rules - Validation rules for each field
 * @returns {Object} Validation result with errors
 */
export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];

    // Required validation
    if (fieldRules.required && !isRequired(value)) {
      errors[field] = `${field} is required`;
      return;
    }

    // Skip other validations if field is empty and not required
    if (!isRequired(value)) return;

    // Email validation
    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = 'Invalid email address';
      return;
    }

    // Phone validation
    if (fieldRules.phone && !isValidPhone(value)) {
      errors[field] = 'Invalid phone number';
      return;
    }

    // Min length validation
    if (fieldRules.minLength && !hasMinLength(value, fieldRules.minLength)) {
      errors[field] = `${field} must be at least ${fieldRules.minLength} characters`;
      return;
    }

    // Max length validation
    if (fieldRules.maxLength && !hasMaxLength(value, fieldRules.maxLength)) {
      errors[field] = `${field} must be no more than ${fieldRules.maxLength} characters`;
      return;
    }

    // Custom validation
    if (fieldRules.custom) {
      const customResult = fieldRules.custom(value, formData);
      if (customResult !== true) {
        errors[field] = customResult;
        return;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 