import React from 'react';
import PropTypes from 'prop-types';
import './Pricing.css';

/**
 * Pricing Component - Pricing Plans Section
 * 
 * Displays pricing plans and packages with clear value propositions.
 * Features include:
 * - Multiple pricing tiers
 * - Feature comparisons
 * - Call-to-action buttons
 * - Responsive design
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.subtitle - Section subtitle
 * @param {Array} props.plans - Array of pricing plans
 * @param {Function} props.onPlanSelect - Callback for plan selection
 * @returns {JSX.Element} Pricing section component
 */
const Pricing = ({
  title = "Simple, Transparent Pricing",
  subtitle = "Choose the plan that's right for your business",
  plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$29',
      period: 'per month',
      description: 'Perfect for small businesses and startups',
      features: [
        'Up to 100 influencer searches',
        'Basic analytics',
        'Email support',
        'Standard integrations'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$99',
      period: 'per month',
      description: 'Ideal for growing businesses',
      features: [
        'Unlimited influencer searches',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'Campaign automation',
        'Team collaboration'
      ],
      popular: true,
      cta: 'Get Started'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large organizations with custom needs',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom reporting',
        'API access',
        'White-label options',
        'On-premise deployment'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ],
  onPlanSelect = () => {}
}) => {
  // Handle plan selection
  const handlePlanSelect = (plan, event) => {
    onPlanSelect(plan, event);
  };

  return (
    <section className="pricing" id="pricing">
      <div className="pricing__container">
        {/* Section Header */}
        <div className="pricing__header">
          <h2 className="pricing__title">{title}</h2>
          <p className="pricing__subtitle">{subtitle}</p>
        </div>

        {/* Pricing Plans */}
        <div className="pricing__plans">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`pricing__plan ${plan.popular ? 'pricing__plan--popular' : ''}`}
            >
              {plan.popular && (
                <div className="pricing__popular-badge">Most Popular</div>
              )}
              
              <div className="pricing__plan-header">
                <h3 className="pricing__plan-name">{plan.name}</h3>
                <div className="pricing__plan-price">
                  <span className="pricing__plan-amount">{plan.price}</span>
                  <span className="pricing__plan-period">/{plan.period}</span>
                </div>
                <p className="pricing__plan-description">{plan.description}</p>
              </div>

              <ul className="pricing__features">
                {plan.features.map((feature, index) => (
                  <li key={index} className="pricing__feature">
                    <span className="pricing__feature-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className="pricing__cta-button"
                onClick={(e) => handlePlanSelect(plan, e)}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="pricing__info">
          <p className="pricing__info-text">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

// PropTypes for type checking and documentation
Pricing.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      period: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      features: PropTypes.arrayOf(PropTypes.string).isRequired,
      popular: PropTypes.bool,
      cta: PropTypes.string.isRequired
    })
  ),
  onPlanSelect: PropTypes.func
};

export default Pricing; 