import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable form field component for auth forms
 * Memoized to prevent unnecessary re-renders
 */
const AuthFormField = memo(({
  name,
  type = 'text',
  label,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
  required = false,
  autoComplete,
  className = ''
}) => (
  <div className={`auth-form-group ${className}`}>
    <label htmlFor={name} className="auth-label">
      {label}
      {required && <span className="required">*</span>}
    </label>
    
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={`auth-input ${error ? 'auth-input--error' : ''}`}
      aria-describedby={error ? `${name}-error` : undefined}
      aria-invalid={!!error}
    />
    
    {error && (
      <div id={`${name}-error`} className="auth-error" role="alert">
        <span className="auth-error-icon">⚠️</span>
        <span className="auth-error-text">{error}</span>
      </div>
    )}
  </div>
));

AuthFormField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  required: PropTypes.bool,
  autoComplete: PropTypes.string,
  className: PropTypes.string
};

AuthFormField.displayName = 'AuthFormField';

export default AuthFormField; 