import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

// Import components
import Contact from '../../components/contact/Contact';
import Footer from '../../components/footer/Footer';
import NotificationSidebar from '../../components/notification/NotificationSidebar';

// Import styles
import './ContactPage.css';

/**
 * Contact Page Component
 * 
 * A standalone contact page that includes the contact form and information.
 * This page is separate from the landing page and can be accessed via routing.
 * 
 * @param {Object} props - Component props
 * @param {string} props.pageTitle - Page title for SEO
 * @param {string} props.pageDescription - Page description for SEO
 * @param {Object} props.contactConfig - Configuration for contact section
 * @param {Object} props.footerConfig - Configuration for footer
 * @returns {JSX.Element} The contact page
 */
const ContactPage = ({
  pageTitle = "Contact Us - Infinder",
  pageDescription = "Get in touch with the Infinder team. We're here to help you transform your influencer marketing strategy.",
  contactConfig = {},
  footerConfig = {}
}) => {
  // Debug logging removed for production
  
  const handleNotificationClick = () => {
    console.log('Contact page notification clicked');
  };

  return (
    <div className="contact-page">
      {/* SEO and Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <link rel="canonical" href="https://infinder.com/contact" />
      </Helmet>

      {/* Floating Notification Button */}
      <div className="contact-notification-button">
        <NotificationSidebar 
          count={3} 
          onClick={handleNotificationClick}
          className="contact-notification"
        />
      </div>

      {/* Contact Section */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          borderRadius: '16px', 
          padding: '3rem 2rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          maxWidth: '1000px',
          width: '100%'
        }}>
          <Contact {...contactConfig} />
        </div>
      </div>

      {/* Footer */}
      <Footer {...footerConfig} />
    </div>
  );
};

// PropTypes for type checking and documentation
ContactPage.propTypes = {
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string,
  contactConfig: PropTypes.object,
  footerConfig: PropTypes.object
};

export default ContactPage; 