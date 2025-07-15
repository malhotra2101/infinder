import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './CallToAction.css';

/**
 * Enhanced CallToAction Component - Premium Conversion Section
 * 
 * A premium call-to-action section with advanced animations, micro-interactions,
 * and modern design patterns. Features include:
 * - Staggered entrance animations
 * - Interactive hover effects
 * - Loading states and feedback
 * - Accessibility enhancements
 * - Responsive design
 * - Particle effects and visual feedback
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Main headline
 * @param {string} props.subtitle - Supporting text
 * @param {Array} props.actions - Array of action buttons
 * @param {string} props.backgroundImage - Background image URL
 * @param {string} props.theme - Color theme ('primary', 'secondary', 'dark')
 * @param {Function} props.onActionClick - Callback for action clicks
 * @param {boolean} props.animateOnScroll - Whether to animate on scroll
 * @returns {JSX.Element} Enhanced call-to-action section component
 */
const CallToAction = ({
  title = "Ready to Transform Your Influencer Marketing?",
  subtitle = "Join thousands of brands that are already using Infinder to discover, connect, and collaborate with the perfect influencers.",
  actions = [
    { label: 'Start Free Trial', href: '/signup', variant: 'primary' },
    { label: 'Schedule Demo', href: '/demo', variant: 'secondary' }
  ],
  backgroundImage = null,
  theme = 'primary',
  onActionClick = () => {},
  animateOnScroll = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [hoveredAction, setHoveredAction] = useState(null);

  // Intersection Observer for scroll-based animations
  useEffect(() => {
    if (!animateOnScroll) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const element = document.querySelector('.cta');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [animateOnScroll]);

  // Handle action button clicks with loading states
  const handleActionClick = async (action, event) => {
    if (action.href && !action.href.startsWith('http')) {
      // Internal navigation
      setLoadingStates(prev => ({ ...prev, [action.label]: true }));
      
      // Simulate loading for internal links
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [action.label]: false }));
        onActionClick(action, event);
      }, 1000);
    } else {
      // External links or custom actions
      onActionClick(action, event);
    }
  };

  // Handle mouse enter for enhanced hover effects
  const handleMouseEnter = (actionLabel) => {
    setHoveredAction(actionLabel);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredAction(null);
  };

  return (
    <section className={`cta cta--${theme} ${isVisible ? 'cta--visible' : ''}`}>
      {/* Enhanced Background Elements */}
      {backgroundImage && (
        <div 
          className="cta__background"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      )}
      
      <div className="cta__background-overlay" aria-hidden="true"></div>

      {/* Floating Particles */}
      <div className="cta__particles" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="cta__particle"
            style={{
              '--delay': `${i * 0.5}s`,
              '--duration': `${8 + i * 2}s`,
              '--size': `${20 + i * 10}px`,
              '--left': `${10 + i * 15}%`,
              '--top': `${20 + i * 10}%`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="cta__container">
        <div className="cta__content">
          {/* Enhanced Icon with Ripple Effect */}
          <div className="cta__icon-container">
            <div className="cta__icon-ripple" aria-hidden="true"></div>
            <span className="cta__icon" role="img" aria-label="Sparkle">
              ✨
            </span>
          </div>

          {/* Enhanced Headline */}
          <h2 className="cta__title">
            {title}
          </h2>
          
          {/* Enhanced Subtitle */}
          <p className="cta__subtitle">{subtitle}</p>

          {/* Enhanced Action Buttons */}
          <div className="cta__actions">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`cta__action-btn cta__action-btn--${action.variant || 'primary'} ${
                  loadingStates[action.label] ? 'loading' : ''
                } ${hoveredAction === action.label ? 'hovered' : ''}`}
                onClick={(e) => handleActionClick(action, e)}
                onMouseEnter={() => handleMouseEnter(action.label)}
                onMouseLeave={handleMouseLeave}
                disabled={loadingStates[action.label]}
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <span className="cta__action-btn-text">{action.label}</span>
                {loadingStates[action.label] && (
                  <span className="cta__action-btn-loading" aria-label="Loading..."></span>
                )}
                <div className="cta__action-btn-glow" aria-hidden="true"></div>
              </button>
            ))}
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="cta__trust-indicators">
            <div className="cta__trust-item">
              <span className="cta__trust-icon">🔒</span>
              <span className="cta__trust-text">Free 14-day trial</span>
            </div>
            <div className="cta__trust-item">
              <span className="cta__trust-icon">💳</span>
              <span className="cta__trust-text">No credit card required</span>
            </div>
            <div className="cta__trust-item">
              <span className="cta__trust-icon">⚡</span>
              <span className="cta__trust-text">Setup in minutes</span>
            </div>
          </div>

          {/* Enhanced Social Proof */}
          <div className="cta__social-proof">
            <div className="cta__social-proof-avatars">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="cta__social-proof-avatar"
                  style={{ '--delay': `${i * 0.1}s` }}
                  aria-hidden="true"
                >
                  <div className="cta__social-proof-avatar-inner"></div>
                </div>
              ))}
            </div>
            <p className="cta__social-proof-text">
              Trusted by <strong>10,000+</strong> brands worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="cta__scroll-indicator" aria-hidden="true">
        <div className="cta__scroll-indicator-dot"></div>
        <div className="cta__scroll-indicator-dot"></div>
        <div className="cta__scroll-indicator-dot"></div>
      </div>
    </section>
  );
};

// PropTypes for type checking and documentation
CallToAction.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      variant: PropTypes.oneOf(['primary', 'secondary', 'outline'])
    })
  ),
  backgroundImage: PropTypes.string,
  theme: PropTypes.oneOf(['primary', 'secondary', 'dark']),
  onActionClick: PropTypes.func,
  animateOnScroll: PropTypes.bool
};

export default CallToAction; 