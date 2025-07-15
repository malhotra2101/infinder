import { useState, useCallback, useMemo } from 'react';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validatePasswordConfirmation, 
  validateTermsAgreement,
  getRealTimeValidation 
} from '../utils/authValidation';

/**
 * Custom hook for managing auth form state and validation
 * @param {Object} initialData - Initial form data
 * @param {boolean} isLogin - Whether this is for login form
 * @returns {Object} Form state and handlers
 */
export const useAuthForm = (initialData, isLogin = false) => {
  const [formData, setFormData] = useState(initialData);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input changes with real-time validation
   */
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time validation
    if (value) {
      const error = getRealTimeValidation(name, value, formData, isLogin);
      if (error) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: error
        }));
      }
    }
  }, [validationErrors, formData, isLogin]);

  /**
   * Validate entire form
   */
  const validateForm = useCallback(() => {
    const errors = {};

    // Email validation
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password, isLogin);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }

    // Additional validations for signup
    if (!isLogin) {
      // Name validations
      const firstNameValidation = validateName(formData.firstName, 'First name');
      if (!firstNameValidation.isValid) {
        errors.firstName = firstNameValidation.message;
      }

      const lastNameValidation = validateName(formData.lastName, 'Last name');
      if (!lastNameValidation.isValid) {
        errors.lastName = lastNameValidation.message;
      }

      // Confirm password validation
      const confirmPasswordValidation = validatePasswordConfirmation(
        formData.password, 
        formData.confirmPassword
      );
      if (!confirmPasswordValidation.isValid) {
        errors.confirmPassword = confirmPasswordValidation.message;
      }

      // Terms agreement validation
      const termsValidation = validateTermsAgreement(formData.agreeToTerms);
      if (!termsValidation.isValid) {
        errors.agreeToTerms = termsValidation.message;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, isLogin]);

  /**
   * Set form data (useful for demo login)
   */
  const setFormDataDirectly = useCallback((newData) => {
    setFormData(newData);
    setValidationErrors({});
  }, []);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setValidationErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  /**
   * Check if form is valid
   */
  const isFormValid = useMemo(() => {
    return Object.keys(validationErrors).length === 0 && 
           Object.values(formData).some(value => value !== '' && value !== false);
  }, [validationErrors, formData]);

  /**
   * Get field error
   */
  const getFieldError = useCallback((fieldName) => {
    return validationErrors[fieldName] || '';
  }, [validationErrors]);

  return {
    formData,
    validationErrors,
    isSubmitting,
    isFormValid,
    handleInputChange,
    validateForm,
    setFormDataDirectly,
    resetForm,
    getFieldError,
    setIsSubmitting,
    setValidationErrors
  };
}; 