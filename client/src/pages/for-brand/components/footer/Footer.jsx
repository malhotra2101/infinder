import React from 'react';
import PropTypes from 'prop-types';
import './Footer.css';

/**
 * Footer Component - Site Footer
 * 
 * A comprehensive footer with navigation links, company information,
 * and social media links. Features include:
 * - Multiple navigation sections
 * - Company information
 * - Social media links
 * - Newsletter signup
 * - Responsive design
 * 
 * @param {Object} props - Component props
 * @param {Object} props.companyInfo - Company information
 * @param {Array} props.navigation - Footer navigation links
 * @param {Object} props.social - Social media links
 * @param {Function} props.onNewsletterSignup - Newsletter signup callback
 * @returns {JSX.Element} Footer component
 */
const Footer = ({
  companyInfo = {
    name: 'Infinder',
    description: 'Empowering brands to discover, connect, and collaborate with the perfect influencers.',
    logo: '/logo.svg',
    copyright: '© 2024 Infinder. All rights reserved.'
  },
  navigation = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'API', href: '/api' },
      { label: 'Integrations', href: '/integrations' }
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'New Design', href: '/' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact', href: '#contact' },
      { label: 'Status', href: '/status' },
      { label: 'Documentation', href: '/docs' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' }
    ]
  },
  social = {
    twitter: 'https://twitter.com/infinder',
    linkedin: 'https://linkedin.com/company/infinder',
    facebook: 'https://facebook.com/infinder',
    instagram: 'https://instagram.com/infinder'
  },
  onNewsletterSignup = () => {}
}) => {
  // Newsletter signup state
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // Handle newsletter signup
  const handleNewsletterSignup = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    try {
      await onNewsletterSignup(email);
      setIsSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Main Footer Content */}
        <div className="footer__main">
          {/* Company Info */}
          <div className="footer__company">
            <div className="footer__logo-container">
              {companyInfo.logo && (
                <img 
                  src={companyInfo.logo} 
                  alt={`${companyInfo.name} logo`}
                  className="footer__logo"
                  loading="lazy"
                />
              )}
              <span className="footer__company-name">{companyInfo.name}</span>
            </div>
            <p className="footer__company-description">
              {companyInfo.description}
            </p>
            
            {/* Social Media Links */}
            <div className="footer__social">
              {Object.entries(social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`footer__social-link footer__social-link--${platform}`}
                  aria-label={`Follow us on ${platform}`}
                >
                  <span className="footer__social-icon">
                    {platform === 'twitter' && '🐦'}
                    {platform === 'linkedin' && '💼'}
                    {platform === 'facebook' && '📘'}
                    {platform === 'instagram' && '📷'}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="footer__navigation">
            <div className="footer__nav-section">
              <h3 className="footer__nav-title">Product</h3>
              <ul className="footer__nav-list">
                {navigation.product.map((link, index) => (
                  <li key={index} className="footer__nav-item">
                    <a href={link.href} className="footer__nav-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__nav-section">
              <h3 className="footer__nav-title">Company</h3>
              <ul className="footer__nav-list">
                {navigation.company.map((link, index) => (
                  <li key={index} className="footer__nav-item">
                    <a href={link.href} className="footer__nav-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__nav-section">
              <h3 className="footer__nav-title">Support</h3>
              <ul className="footer__nav-list">
                {navigation.support.map((link, index) => (
                  <li key={index} className="footer__nav-item">
                    <a href={link.href} className="footer__nav-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__nav-section">
              <h3 className="footer__nav-title">Legal</h3>
              <ul className="footer__nav-list">
                {navigation.legal.map((link, index) => (
                  <li key={index} className="footer__nav-item">
                    <a href={link.href} className="footer__nav-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="footer__newsletter">
            <h3 className="footer__newsletter-title">Stay Updated</h3>
            <p className="footer__newsletter-description">
              Get the latest updates on influencer marketing trends and platform features.
            </p>
            
            {isSubmitted ? (
              <div className="footer__newsletter-success">
                <span className="footer__newsletter-success-icon">✓</span>
                <span className="footer__newsletter-success-text">
                  Thanks for subscribing!
                </span>
              </div>
            ) : (
              <form className="footer__newsletter-form" onSubmit={handleNewsletterSignup}>
                <div className="footer__newsletter-input-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="footer__newsletter-input"
                    required
                  />
                  <button
                    type="submit"
                    className="footer__newsletter-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright">{companyInfo.copyright}</p>
            
            <div className="footer__bottom-links">
              <a href="/privacy" className="footer__bottom-link">Privacy</a>
              <a href="/terms" className="footer__bottom-link">Terms</a>
              <a href="/cookies" className="footer__bottom-link">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// PropTypes for type checking and documentation
Footer.propTypes = {
  companyInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    logo: PropTypes.string,
    copyright: PropTypes.string.isRequired
  }),
  navigation: PropTypes.shape({
    product: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired
      })
    ),
    company: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired
      })
    ),
    support: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired
      })
    ),
    legal: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired
      })
    )
  }),
  social: PropTypes.objectOf(PropTypes.string),
  onNewsletterSignup: PropTypes.func
};

export default Footer; 