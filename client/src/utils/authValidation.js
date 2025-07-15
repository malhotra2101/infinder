/**
 * Authentication validation utilities
 * Centralized validation logic for login and signup forms
 */

/**
 * Email validation regex pattern
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password strength requirements
 */
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  MIN_LENGTH_LOGIN: 6,
  PATTERN: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Validation result
 */
export const validateEmail = (email) => {
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {boolean} isLogin - Whether this is for login (less strict)
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password, isLogin = false) => {
  const minLength = isLogin ? PASSWORD_REQUIREMENTS.MIN_LENGTH_LOGIN : PASSWORD_REQUIREMENTS.MIN_LENGTH;
  
  if (!password.trim()) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < minLength) {
    return { 
      isValid: false, 
      message: `Password must be at least ${minLength} characters` 
    };
  }
  
  if (!isLogin && !PASSWORD_REQUIREMENTS.PATTERN.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain uppercase, lowercase, and number' 
    };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate name fields
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result
 */
export const validateName = (name, fieldName) => {
  if (!name.trim()) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (name.length < 2) {
    return { isValid: false, message: `${fieldName} must be at least 2 characters` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} Validation result
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword.trim()) {
    return { isValid: false, message: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate terms agreement
 * @param {boolean} agreed - Whether user agreed to terms
 * @returns {Object} Validation result
 */
export const validateTermsAgreement = (agreed) => {
  if (!agreed) {
    return { isValid: false, message: 'You must agree to the terms and conditions' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Get real-time validation for a field
 * @param {string} fieldName - Name of the field
 * @param {string} value - Field value
 * @param {Object} formData - Complete form data for cross-field validation
 * @param {boolean} isLogin - Whether this is for login form
 * @returns {string} Error message or empty string
 */
export const getRealTimeValidation = (fieldName, value, formData = {}, isLogin = false) => {
  if (!value) return '';
  
  switch (fieldName) {
    case 'email':
      return validateEmail(value) ? '' : 'Please enter a valid email address';
    
    case 'password':
      return validatePassword(value, isLogin).message;
    
    case 'confirmPassword':
      return validatePasswordConfirmation(formData.password || '', value).message;
    
    case 'firstName':
    case 'lastName':
      return validateName(value, fieldName === 'firstName' ? 'First name' : 'Last name').message;
    
    default:
      return '';
  }
}; 