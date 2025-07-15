import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Contact.css';

/**
 * Contact Component - Contact Form Section
 * 
 * A comprehensive contact form with multiple contact methods.
 * Features include:
 * - Contact form with validation
 * - Multiple contact methods
 * - Social media links
 * - Responsive design
 * - Form submission handling
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.subtitle - Section subtitle
 * @param {Object} props.contactInfo - Contact information
 * @param {Function} props.onSubmit - Form submission callback
 * @returns {JSX.Element} Contact section component
 */
const Contact = ({
  title = "Get in Touch",
  subtitle = "Ready to transform your influencer marketing? Let's talk.",
  contactInfo = {
    email: 'hello@infinder.com',
    phone: '+1 (555) 123-4567',
    address: '123 Innovation Drive, Tech City, TC 12345',
    social: {
      twitter: 'https://twitter.com/infinder',
      linkedin: 'https://linkedin.com/company/infinder',
      facebook: 'https://facebook.com/infinder'
    }
  },
  onSubmit = () => {}
}) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    budget: '',
    timeline: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
        budget: '',
        timeline: ''
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="contact__container">
        {/* Section Header */}
        <div className="contact__header">
          <h2 className="contact__title">{title}</h2>
          <p className="contact__subtitle">{subtitle}</p>
        </div>

        <div className="contact__content">
          {/* Contact Form */}
          <div className="contact__form-section">
            <h3 className="contact__form-title">Send us a message</h3>
            
            {isSubmitted ? (
              <div className="contact__success">
                <span className="contact__success-icon">✓</span>
                <h4 className="contact__success-title">Message Sent!</h4>
                <p className="contact__success-text">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="contact__form-row">
                  <div className="contact__form-group">
                    <label htmlFor="name" className="contact__label">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`contact__input ${errors.name ? 'contact__input--error' : ''}`}
                      placeholder="Your full name"
                      required
                    />
                    {errors.name && (
                      <span className="contact__error">{errors.name}</span>
                    )}
                  </div>

                  <div className="contact__form-group">
                    <label htmlFor="email" className="contact__label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`contact__input ${errors.email ? 'contact__input--error' : ''}`}
                      placeholder="your@email.com"
                      required
                    />
                    {errors.email && (
                      <span className="contact__error">{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className="contact__form-group">
                  <label htmlFor="company" className="contact__label">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="contact__input"
                    placeholder="Your company name"
                  />
                </div>

                <div className="contact__form-row">
                  <div className="contact__form-group">
                    <label htmlFor="budget" className="contact__label">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="contact__input"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-10k">Under $10,000</option>
                      <option value="10k-50k">$10,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="over-100k">Over $100,000</option>
                    </select>
                  </div>

                  <div className="contact__form-group">
                    <label htmlFor="timeline" className="contact__label">
                      Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="contact__input"
                    >
                      <option value="">Select timeline</option>
                      <option value="immediate">Immediate</option>
                      <option value="1-3-months">1-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="6-plus-months">6+ months</option>
                    </select>
                  </div>
                </div>

                <div className="contact__form-group">
                  <label htmlFor="message" className="contact__label">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`contact__textarea ${errors.message ? 'contact__textarea--error' : ''}`}
                    placeholder="Tell us about your influencer marketing needs..."
                    rows="5"
                    required
                  />
                  {errors.message && (
                    <span className="contact__error">{errors.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="contact__submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="contact__info-section">
            <h3 className="contact__info-title">Contact Information</h3>
            
            <div className="contact__info-list">
              <div className="contact__info-item">
                <span className="contact__info-icon">📧</span>
                <div className="contact__info-content">
                  <h4 className="contact__info-label">Email</h4>
                  <a href={`mailto:${contactInfo.email}`} className="contact__info-link">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              <div className="contact__info-item">
                <span className="contact__info-icon">📞</span>
                <div className="contact__info-content">
                  <h4 className="contact__info-label">Phone</h4>
                  <a href={`tel:${contactInfo.phone}`} className="contact__info-link">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              <div className="contact__info-item">
                <span className="contact__info-icon">📍</span>
                <div className="contact__info-content">
                  <h4 className="contact__info-label">Address</h4>
                  <address className="contact__info-address">
                    {contactInfo.address}
                  </address>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="contact__social">
              <h4 className="contact__social-title">Follow Us</h4>
              <div className="contact__social-links">
                {Object.entries(contactInfo.social).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`contact__social-link contact__social-link--${platform}`}
                    aria-label={`Follow us on ${platform}`}
                  >
                    <span className="contact__social-icon">
                      {platform === 'twitter' && '🐦'}
                      {platform === 'linkedin' && '💼'}
                      {platform === 'facebook' && '📘'}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// PropTypes for type checking and documentation
Contact.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  contactInfo: PropTypes.shape({
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    social: PropTypes.objectOf(PropTypes.string)
  }),
  onSubmit: PropTypes.func
};

export default Contact; 