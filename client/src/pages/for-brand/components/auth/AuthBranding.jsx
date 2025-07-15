import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AUTH_FEATURES } from '../../../../utils/authConstants';

/**
 * Branding section component for auth pages
 * Memoized to prevent unnecessary re-renders
 */
const AuthBranding = memo(({ title, subtitle, features = AUTH_FEATURES }) => (
  <div className="auth-branding">
    <div className="auth-branding-content">
      <Link to="/" className="auth-logo">
        <img src="/logo.svg" alt="Infinder Logo" />
        <span>Infinder</span>
      </Link>
      
      <h1 className="auth-branding-title">
        {title}
      </h1>
      
      <p className="auth-branding-subtitle">
        {subtitle}
      </p>

      <div className="auth-features">
        {features.map((feature, index) => (
          <div 
            key={feature.text} 
            className="auth-feature"
            style={{ animationDelay: `${1 + index * 0.2}s` }}
          >
            <div className="auth-feature-icon">{feature.icon}</div>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
));

AuthBranding.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  )
};

AuthBranding.displayName = 'AuthBranding';

export default AuthBranding; 