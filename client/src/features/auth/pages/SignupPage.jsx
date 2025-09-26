import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './AuthPages.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    // Personal Information
    email: '',
    password: '',
    confirmPassword: '',
    
    // Brand Information
    companyName: '',
    industry: '',
    website: '',
    employeeCount: '',
    description: '',
    
    // Contact Information (optional)
    contactName: '',
    
    // Preferences
    agreeToTerms: false,
    marketingEmails: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    // Check required personal fields
    if (!formData.email || !formData.password) {
      setError('Please fill in all required personal information fields');
      return false;
    }
    
    // Check required brand fields
    if (!formData.companyName || !formData.industry) {
      setError('Please fill in required brand information (Company Name and Industry)');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Validate website format if provided (optional field)
    if (formData.website && formData.website.trim() !== '') {
      // Auto-add https:// if no protocol is provided
      if (!formData.website.match(/^https?:\/\//)) {
        formData.website = 'https://' + formData.website;
      }
    }
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🚀 Signup form submitted with data:', formData);

    if (!validateForm()) {
      console.log('❌ Form validation failed');
      setLoading(false);
      return;
    }

    console.log('✅ Form validation passed');



    try {
      // Prepare signup data
      const signupData = {
        // Personal info
        email: formData.email,
        password: formData.password,
        
        // Brand info
        brandName: formData.companyName,
        industry: formData.industry,
        website: formData.website,
        employeeCount: formData.employeeCount,
        description: formData.description,
        contactName: formData.contactName || 'Brand Contact',
        
        // Preferences
        marketingEmails: formData.marketingEmails
      };

      console.log('📤 Sending signup data to API:', signupData);
      const result = await signup(signupData);
      console.log('📥 Signup API response:', result);

      if (result.success) {
        console.log('✅ Signup successful, navigating to dashboard');
        // Show success message
        if (window.showToast) {
          window.showToast(
            `Welcome to Infinder!`,
            'success',
            3000
          );
        }
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        console.log('❌ Signup failed:', result.message);
        setError(result.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('🚨 Signup error:', err);
      setError(err.message || 'Signup failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      
      {/* Animated Background */}
      <div className="signup-background">
        <div className="signup-shape signup-shape--1" />
        <div className="signup-shape signup-shape--2" />
        <div className="signup-shape signup-shape--3" />
        <div className="signup-shape signup-shape--4" />
      </div>

      <div className="signup-container">
        {/* Left Side - Branding */}
        <div className="signup-branding">
          <div className="branding-content">
            <h1 className="branding-title">
              Join <span className="branding-accent">Infinder</span> Today
            </h1>
            <p className="branding-subtitle">
              Start your journey to discover and connect with the perfect influencers for your brand.
            </p>
            <div className="branding-features">
              <div className="feature-item">
                <div className="feature-icon">🚀</div>
                <span>Get Started Fast</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <span>Find Perfect Matches</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📈</div>
                <span>Grow Your Brand</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="signup-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Create Your Brand Account</h2>
              <p>Set up your brand profile and start finding perfect influencers</p>
            </div>

            <form className="signup-form" onSubmit={handleSubmit} noValidate>
              {/* Personal Information Section */}
              <div className="form-section">
                <h3 className="form-section-title">Account Information</h3>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      name="password"
                      className="form-input"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-input"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>

              {/* Brand Information Section */}
              <div className="form-section">
                <h3 className="form-section-title">Brand Information</h3>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    className="form-input"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    autoComplete="organization"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Industry *</label>
                    <select
                      name="industry"
                      className="form-input"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select your industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Beauty">Beauty & Cosmetics</option>
                      <option value="Health">Health & Wellness</option>
                      <option value="Food">Food & Beverage</option>
                      <option value="Travel">Travel & Tourism</option>
                      <option value="Fitness">Fitness & Sports</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Employee Count</label>
                    <select
                      name="employeeCount"
                      className="form-input"
                      value={formData.employeeCount}
                      onChange={handleInputChange}
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="50-100">50-100 employees</option>
                      <option value="100-500">100-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input
                    type="url"
                    name="website"
                    className="form-input"
                    placeholder="https://yourcompany.com"
                    value={formData.website}
                    onChange={handleInputChange}
                    autoComplete="url"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Description</label>
                  <textarea
                    name="description"
                    className="form-input form-textarea"
                    placeholder="Brief description of your company and what you do..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Contact Name</label>
                  <input
                    type="text"
                    name="contactName"
                    className="form-input"
                    placeholder="Leave blank to use your name"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  I agree to the{' '}
                  <Link to="/terms" className="terms-link">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="terms-link">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="marketingEmails"
                    checked={formData.marketingEmails}
                    onChange={handleInputChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  I want to receive marketing emails and updates
                </label>
              </div>

              {error && (
                <div className="error-message" role="alert">
                  <span className="error-icon">⚠️</span>
                  <span className="error-text">{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="form-divider">
              <span>or continue with</span>
            </div>

            <div className="form-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="login-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 