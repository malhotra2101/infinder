import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Animated background component for auth pages
 * Memoized to prevent unnecessary re-renders
 */
const AuthBackground = memo(({ className = '' }) => (
  <div className={`auth-background ${className}`}>
    <div className="auth-shape auth-shape--1" />
    <div className="auth-shape auth-shape--2" />
    <div className="auth-shape auth-shape--3" />
    <div className="auth-shape auth-shape--4" />
  </div>
));

AuthBackground.propTypes = {
  className: PropTypes.string
};

AuthBackground.displayName = 'AuthBackground';

export default AuthBackground; 