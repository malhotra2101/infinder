import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Features.css';

/**
 * Features Component - Platform Capabilities Showcase
 * 
 * Displays the key features and capabilities of the platform in an
 * engaging and interactive format. Features include:
 * - Interactive feature cards with hover effects
 * - Animated icons and illustrations
 * - Responsive grid layout
 * - Accessibility features
 * - Performance optimized animations
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.subtitle - Section subtitle
 * @param {Array} props.features - Array of feature objects
 * @param {string} props.layout - Layout type ('grid', 'list', 'cards')
 * @param {boolean} props.showAnimation - Whether to show animations
 * @param {Function} props.onFeatureClick - Callback for feature clicks
 * @returns {JSX.Element} Features section component
 */
const Features = ({
  title = "Powerful Features for Influencer Marketing",
  subtitle = "Everything you need to discover, connect, and collaborate with influencers effectively",
  features = [
    {
      id: 1,
      icon: '🎯',
      title: 'AI-Powered Matching',
      description: 'Find the perfect influencers for your brand using our advanced AI algorithms that analyze audience demographics, engagement rates, and content quality.',
      benefits: ['Smart filtering', 'Audience analysis', 'Engagement scoring'],
      color: '#667eea'
    },
    {
      id: 2,
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Track campaign performance with detailed analytics and insights. Monitor ROI, engagement rates, and audience growth in real-time.',
      benefits: ['Real-time tracking', 'ROI measurement', 'Performance insights'],
      color: '#764ba2'
    },
    {
      id: 3,
      icon: '🤝',
      title: 'Relationship Management',
      description: 'Build and maintain authentic relationships with influencers through our comprehensive CRM tools and communication features.',
      benefits: ['CRM integration', 'Communication tools', 'Partnership tracking'],
      color: '#f093fb'
    },
    {
      id: 4,
      icon: '📱',
      title: 'Campaign Automation',
      description: 'Automate your influencer campaigns from discovery to reporting. Save time and scale your marketing efforts efficiently.',
      benefits: ['Workflow automation', 'Scheduled posts', 'Auto-reporting'],
      color: '#4facfe'
    },
    {
      id: 5,
      icon: '🔍',
      title: 'Influencer Discovery',
      description: 'Discover new influencers across multiple platforms with our comprehensive search and filtering capabilities.',
      benefits: ['Multi-platform search', 'Advanced filters', 'Trend analysis'],
      color: '#43e97b'
    },
    {
      id: 6,
      icon: '📈',
      title: 'Performance Tracking',
      description: 'Monitor and optimize your influencer campaigns with detailed performance metrics and actionable insights.',
      benefits: ['KPI tracking', 'A/B testing', 'Optimization tips'],
      color: '#fa709a'
    }
  ],
  layout = 'grid',
  showAnimation = true,
  onFeatureClick = () => {}
}) => {
  // State for animation triggers
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for animation triggers
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const featuresElement = document.querySelector('.features');
    if (featuresElement) {
      observer.observe(featuresElement);
    }

    return () => {
      if (featuresElement) {
        observer.unobserve(featuresElement);
      }
    };
  }, []);

  // Animate features when component becomes visible
  useEffect(() => {
    if (isVisible && showAnimation) {
      const animateFeatures = () => {
        features.forEach((feature, index) => {
          setTimeout(() => {
            setVisibleFeatures(prev => [...prev, feature.id]);
          }, index * 200);
        });
      };

      const timer = setTimeout(animateFeatures, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, showAnimation, features]);

  // Handle feature click
  const handleFeatureClick = (feature, event) => {
    onFeatureClick(feature, event);
  };

  // Render feature card
  const renderFeatureCard = (feature) => {
    const isVisible = visibleFeatures.includes(feature.id);
    
    return (
      <div
        key={feature.id}
        className={`features__card ${isVisible ? 'features__card--visible' : ''}`}
        onClick={(e) => handleFeatureClick(feature, e)}
        style={{ '--feature-color': feature.color }}
      >
        <div className="features__card-header">
          <div className="features__icon-container">
            <span 
              className="features__icon" 
              role="img" 
              aria-label={feature.title}
            >
              {feature.icon}
            </span>
          </div>
          <h3 className="features__card-title">{feature.title}</h3>
        </div>
        
        <p className="features__card-description">
          {feature.description}
        </p>
        
        {feature.benefits && (
          <ul className="features__benefits-list">
            {feature.benefits.map((benefit, index) => (
              <li key={index} className="features__benefit-item">
                <span className="features__benefit-icon">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        )}
        
        <div className="features__card-overlay"></div>
      </div>
    );
  };

  return (
    <section className={`features ${isVisible ? 'features--visible' : ''}`} id="features">
      <div className="features__container">
        {/* Section Header */}
        <div className="features__header">
          <h2 className="features__title">{title}</h2>
          <p className="features__subtitle">{subtitle}</p>
        </div>

        {/* Features Grid */}
        <div className={`features__grid features__grid--${layout}`}>
          {features.map(renderFeatureCard)}
        </div>

        {/* Call to Action */}
        <div className="features__cta">
          <p className="features__cta-text">
            Ready to transform your influencer marketing?
          </p>
          <a href="/signup" className="features__cta-button">
            Get Started Free
          </a>
        </div>
      </div>
    </section>
  );
};

// PropTypes for type checking and documentation
Features.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      benefits: PropTypes.arrayOf(PropTypes.string),
      color: PropTypes.string
    })
  ),
  layout: PropTypes.oneOf(['grid', 'list', 'cards']),
  showAnimation: PropTypes.bool,
  onFeatureClick: PropTypes.func
};

export default Features; 