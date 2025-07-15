import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MenuToggle from '../landing-page/components/MenuToggle';
import './AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password
      if (formData.email && formData.password) {
        console.log('Login successful:', formData);
        navigate('/');
      } else {
        setError('Please enter both email and password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <MenuToggle />
      
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
                disabled={loading}
              >
                {loading ? (
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
                disabled={loading}
              >
                Try Demo Login
              </button>
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
    </div>
  );
};

export default LoginPage; 