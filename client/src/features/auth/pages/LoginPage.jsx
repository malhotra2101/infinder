import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowErrorPopup(false);

    console.log('🚀 Login form submitted with data:', formData);

    try {
      // Validate required fields
      if (!formData.email || !formData.password) {
        console.log('❌ Validation failed: missing email or password');
        setError('Please enter both email and password');
        setShowErrorPopup(true);
        setLoading(false);
        return;
      }

      console.log('✅ Form validation passed, attempting login...');

      // Attempt login using AuthContext
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      console.log('📥 Login API response:', result);

      if (result.success) {
        console.log('✅ Login successful, navigating to dashboard');
        // Show success message
        if (window.showToast) {
          window.showToast(
            `Welcome back to ${result.user.brandName}!`,
            'success',
            3000
          );
        }
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        console.log('❌ Login failed:', result.message);
        setError(result.message || 'Login failed. Please try again.');
        setShowErrorPopup(true);
      }
    } catch (err) {
      console.error('🚨 Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      
      {/* Animated Background */}
      <div className="login-background">
        <div className="login-shape login-shape--1" />
        <div className="login-shape login-shape--2" />
        <div className="login-shape login-shape--3" />
        <div className="login-shape login-shape--4" />
      </div>

      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="branding-content">
            <h1 className="branding-title">
              Welcome back to <span className="branding-accent">Infinder</span>
            </h1>
            <p className="branding-subtitle">
              Connect with the perfect influencers for your brand. Discover, analyze, and collaborate with top creators.
            </p>
            <div className="branding-features">
              <div className="feature-item">
                <div className="feature-icon">🔍</div>
                <span>Advanced Search</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <span>Lightning Fast</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🛡️</div>
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Sign In to Your Account</h2>
              <p>Enter your credentials to access your dashboard</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label">Email Address</label>
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

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  Remember me
                </label>
                
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
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
                disabled={loading || authLoading}
              >
                {(loading || authLoading) ? (
                  <>
                    <span className="spinner"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              <button
                type="button"
                className="demo-button"
                onClick={() => {
                  setFormData({
                    email: 'demo@example.com',
                    password: 'password123',
                    rememberMe: false
                  });
                }}
                disabled={loading || authLoading}
              >
                Try Demo Login
              </button>
              
              <div className="demo-accounts">
                <p className="demo-title">Demo Accounts:</p>
                <div className="demo-list">
                  <button
                    type="button"
                    className="demo-account-btn"
                    onClick={() => setFormData({
                      email: 'test@example.com',
                      password: 'test123',
                      rememberMe: false
                    })}
                    disabled={loading || authLoading}
                  >
                    Test Brand
                  </button>
                  <button
                    type="button"
                    className="demo-account-btn"
                    onClick={() => setFormData({
                      email: 'admin@test.com',
                      password: 'admin123',
                      rememberMe: false
                    })}
                    disabled={loading || authLoading}
                  >
                    Admin Brand
                  </button>
                </div>
              </div>
            </form>

            <div className="form-divider">
              <span>or continue with</span>
            </div>

            <div className="form-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="signup-link">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Popup Modal */}
      {showErrorPopup && (
        <div className="error-popup-overlay" onClick={() => setShowErrorPopup(false)}>
          <div className="error-popup" onClick={(e) => e.stopPropagation()}>
            <div className="error-popup-header">
              <div className="error-popup-icon">⚠️</div>
              <h3 className="error-popup-title">Login Failed</h3>
              <button 
                className="error-popup-close" 
                onClick={() => setShowErrorPopup(false)}
                aria-label="Close error popup"
              >
                ×
              </button>
            </div>
            <div className="error-popup-content">
              <p className="error-popup-message">{error}</p>
              <div className="error-popup-actions">
                <button 
                  className="error-popup-btn error-popup-btn-primary"
                  onClick={() => setShowErrorPopup(false)}
                >
                  Try Again
                </button>
                <button 
                  className="error-popup-btn error-popup-btn-secondary"
                  onClick={() => {
                    setShowErrorPopup(false);
                    setFormData({
                      email: '',
                      password: '',
                      rememberMe: false
                    });
                  }}
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage; 