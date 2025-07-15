import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SOCIAL_BUTTONS } from '../../../../utils/authConstants';

/**
 * Social login buttons component
 * Memoized to prevent unnecessary re-renders
 */
const AuthSocialButtons = memo(({ onSocialAuth, disabled = false }) => {
  const handleSocialClick = useCallback((provider) => {
    if (!disabled && onSocialAuth) {
      onSocialAuth(provider);
    }
  }, [onSocialAuth, disabled]);

  return (
    <div className="auth-social-buttons">
      {SOCIAL_BUTTONS.map((button) => (
        <button
          key={button.provider}
          type="button"
          className={`auth-social-button ${button.provider}`}
          onClick={() => handleSocialClick(button.provider)}
          disabled={disabled}
          style={{
            '--social-color': button.color,
            '--social-hover-color': button.hoverColor
          }}
        >
          <span className="auth-social-icon">{button.icon}</span>
          {button.label}
        </button>
      ))}
    </div>
  );
});

AuthSocialButtons.propTypes = {
  onSocialAuth: PropTypes.func,
  disabled: PropTypes.bool
};

AuthSocialButtons.displayName = 'AuthSocialButtons';

export default AuthSocialButtons; 