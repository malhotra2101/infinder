import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Hero.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Hero Component - Main Landing Page Hero Section (Performance Optimized)
 * 
 * A compelling hero section that captures attention and communicates
 * the primary value proposition. Features include:
 * - Simplified animations for better performance
 * - Modern gradient overlays
 * - Interactive call-to-action buttons
 * - Responsive design with mobile optimization
 * - Performance optimized animations
 * - Accessibility features
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Main headline text
 * @param {string} props.subtitle - Supporting text below title
 * @param {Array} props.actions - Array of call-to-action buttons
 * @param {string} props.backgroundImage - Background image URL
 * @param {Array} props.features - Array of key features to highlight
 * @param {Object} props.stats - Statistics to display
 * @param {boolean} props.showAnimation - Whether to show animations
 * @param {Function} props.onActionClick - Callback for action button clicks
 * @returns {JSX.Element} Hero section component
 */
const Hero = ({
  title = "Transform Your Influencer Marketing",
  subtitle = "Discover, connect, and collaborate with the perfect influencers using AI-powered matching. Build authentic partnerships that drive real results and scale your brand presence.",
  actions = [
    { label: 'Start Free Trial', href: '/signup', variant: 'primary' },
    { label: 'Watch Demo', href: '#demo', variant: 'secondary' }
  ],
  backgroundImage = null,
  features = [
    { icon: '🚀', text: 'AI-Powered Matching' },
    { icon: '📈', text: 'Real-time Analytics' },
    { icon: '💎', text: 'Premium Influencers' }
  ],
  stats = {
    users: '15,000+',
    influencers: '75,000+',
    campaigns: '150,000+'
  },
  showAnimation = true,
  onActionClick = () => {}
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  const handleActionClick = (action, e) => {
    if (action.href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(action.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onActionClick(action, e);
  };

  // Chart.js data for the dashboard preview
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Performance',
        data: [60, 80, 45, 90, 70],
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: '#667eea',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      bar: {
        borderRadius: 2,
      },
    },
  };

  // Parse stats once to avoid repeated parsing
  const parsedStats = {
    users: parseInt(stats.users.replace(/\D/g, '')) || 0,
    influencers: parseInt(stats.influencers.replace(/\D/g, '')) || 0,
    campaigns: parseInt(stats.campaigns.replace(/\D/g, '')) || 0
  };

  return (
    <section className={`hero ${isVisible ? 'hero--visible' : ''}`} ref={heroRef}>
      {/* Background Elements */}
      {backgroundImage && (
        <div 
          className="hero__background"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      )}
      
      <div className="hero__background-overlay" aria-hidden="true"></div>
      
      {/* Simplified animated background shapes - only 2 shapes for better performance */}
      {showAnimation && (
        <div className="hero__animated-shapes" aria-hidden="true">
          <div className="hero__shape hero__shape--1"></div>
          <div className="hero__shape hero__shape--2"></div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="hero__container">
        <div className="hero__content">
          {/* Badge */}
          <div className="hero__badge">
            <span className="hero__badge-icon">✨</span>
            <span className="hero__badge-text">Trusted by 15,000+ brands</span>
          </div>

          {/* Main Headline - simplified animation */}
          <div className="hero__headline">
            <h1 className="hero__title">
              {title}
            </h1>
            <p className="hero__subtitle">
              {subtitle}
            </p>
          </div>

          {/* Feature Highlights */}
          {features.length > 0 && (
            <div className="hero__features">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="hero__feature"
                >
                  <span className="hero__feature-icon" role="img" aria-label="">
                    {feature.icon}
                  </span>
                  <span className="hero__feature-text">{feature.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Call-to-Action Buttons */}
          <div className="hero__actions">
            {actions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className={`hero__action-btn hero__action-btn--${action.variant || 'primary'}`}
                onClick={(e) => handleActionClick(action, e)}
              >
                <span className="hero__action-btn-text">{action.label}</span>
                {action.variant === 'primary' && (
                  <span className="hero__action-btn-icon">→</span>
                )}
              </a>
            ))}
          </div>

          {/* Statistics Section - simplified */}
          {stats && (
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-number">
                  {parsedStats.users.toLocaleString()}+
                </span>
                <span className="hero__stat-label">Active Brands</span>
              </div>
              <div className="hero__stat-divider"></div>
              <div className="hero__stat">
                <span className="hero__stat-number">
                  {parsedStats.influencers.toLocaleString()}+
                </span>
                <span className="hero__stat-label">Verified Influencers</span>
              </div>
              <div className="hero__stat-divider"></div>
              <div className="hero__stat">
                <span className="hero__stat-number">
                  {parsedStats.campaigns.toLocaleString()}+
                </span>
                <span className="hero__stat-label">Successful Campaigns</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Visual Elements - simplified */}
        <div className="hero__visual">
          <div className="hero__image-container">
            <div className="hero__image-wrapper">
              <div className="hero__dashboard-preview">
                <div className="hero__dashboard-header">
                  <div className="hero__dashboard-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="hero__dashboard-title">Infinder Dashboard</div>
                </div>
                <div className="hero__dashboard-content">
                  <div className="hero__dashboard-chart">
                    <div style={{ width: '100%', height: '60px' }}>
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </div>
                  <div className="hero__dashboard-stats">
                    <div className="hero__dashboard-stat">
                      <span className="hero__dashboard-stat-value">+247%</span>
                      <span className="hero__dashboard-stat-label">Engagement</span>
                    </div>
                    <div className="hero__dashboard-stat">
                      <span className="hero__dashboard-stat-value">$2.4M</span>
                      <span className="hero__dashboard-stat-label">Revenue</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hero__floating-card hero__floating-card--1">
                <div className="hero__card-icon">📈</div>
                <div className="hero__card-content">
                  <div className="hero__card-title">Campaign Performance</div>
                  <div className="hero__card-value">+89% ROI</div>
                </div>
              </div>
              <div className="hero__floating-card hero__floating-card--2">
                <div className="hero__card-icon">🎯</div>
                <div className="hero__card-content">
                  <div className="hero__card-title">AI Match Score</div>
                  <div className="hero__card-value">98%</div>
                </div>
              </div>
            </div>
            <div className="hero__image-overlay"></div>
          </div>
        </div>
      </div>

      {/* Simplified Scroll Indicator */}
      <div className="hero__scroll-indicator" aria-hidden="true">
        <div className="hero__scroll-arrow"></div>
        <span className="hero__scroll-text">Discover more</span>
      </div>
    </section>
  );
};

// PropTypes for type checking and documentation
Hero.propTypes = {
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
  features: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  ),
  stats: PropTypes.shape({
    users: PropTypes.string,
    influencers: PropTypes.string,
    campaigns: PropTypes.string
  }),
  showAnimation: PropTypes.bool,
  onActionClick: PropTypes.func
};

export default Hero; 