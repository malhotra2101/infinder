import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/components/AuthContext';
import NotificationSidebar from '../../../shared/components/shared/notification/NotificationSidebar';
import './ProfilePage.css';

/**
 * Modern Brand Profile Page Component
 * 
 * Beautiful, responsive profile page with real user data integration
 * 
 * @returns {JSX.Element} Modern brand profile page component
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Initialize brand data with actual user information
  const [brandData, setBrandData] = useState({
    companyName: user?.brandName || 'Your Brand',
    industry: user?.industry || 'Technology',
    website: user?.website || '',
    email: user?.email || '',
    phone: '',
    employeeCount: user?.employeeCount || '',
    description: user?.description || '',
    contactName: user?.contactName || '',
    marketingEmails: user?.marketingEmails || false,
    joinedDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
    socialMedia: user?.socialMedia || {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
      tiktok: '',
      youtube: ''
    },
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      darkMode: false,
      marketingEmails: user?.marketingEmails || false,
      weeklyReports: true,
      collaborationAlerts: true
    }
  });

  const [formData, setFormData] = useState({ ...brandData });

  // Update brand data when user object changes
  useEffect(() => {
    if (user) {
      const updatedBrandData = {
        companyName: user.brandName || 'Your Brand',
        industry: user.industry || 'Technology',
        website: user.website || '',
        email: user.email || '',
        phone: '',
        employeeCount: user.employeeCount || '',
        description: user.description || '',
        contactName: user.contactName || '',
        marketingEmails: user.marketingEmails || false,
        joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        socialMedia: user.socialMedia || {
          linkedin: '',
          twitter: '',
          facebook: '',
          instagram: '',
          tiktok: '',
          youtube: ''
        },
        preferences: {
          emailNotifications: true,
          pushNotifications: false,
          darkMode: false,
          marketingEmails: user.marketingEmails || false,
          weeklyReports: true,
          collaborationAlerts: true
        }
      };
      setBrandData(updatedBrandData);
      setFormData(updatedBrandData);
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handlePreferenceChange = (preference, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  };

  // Handle edit mode
  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({ ...brandData });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({ ...brandData });
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBrandData({ ...formData });
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      if (window.showToast) {
        window.showToast('Successfully logged out', 'success', 3000);
      }
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      if (window.showToast) {
        window.showToast('Logout failed. Please try again.', 'error', 3000);
      }
    }
  };

  const handleNotificationClick = () => {
    // Handle notification click
  };

  // Render different field types
  const renderInfoCard = (title, value, icon, description = '') => (
    <div className="info-card">
      <div className="info-icon">{icon}</div>
      <div className="info-content">
        <h3 className="info-title">{title}</h3>
        <p className="info-value">{value || 'Not provided'}</p>
        {description && <p className="info-description">{description}</p>}
      </div>
    </div>
  );

  const renderEditableField = (label, field, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={formData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="form-textarea"
          placeholder={placeholder}
          rows="4"
          disabled={isLoading}
        />
      ) : (
        <input
          type={type}
          value={formData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="form-input"
          placeholder={placeholder}
          disabled={isLoading}
        />
      )}
    </div>
  );

  const renderSocialField = (platform, icon) => (
    <div className="social-field">
      <div className="social-icon">{icon}</div>
      <div className="social-content">
        <label className="social-label">{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
        {isEditing ? (
          <input
            type="url"
            value={formData.socialMedia[platform] || ''}
            onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
            className="form-input"
            placeholder={`https://${platform}.com/yourcompany`}
            disabled={isLoading}
          />
        ) : (
          <p className="social-value">
            {brandData.socialMedia[platform] ? (
              <a href={brandData.socialMedia[platform]} target="_blank" rel="noopener noreferrer">
                {brandData.socialMedia[platform]}
              </a>
            ) : (
              'Not connected'
            )}
          </p>
        )}
      </div>
    </div>
  );

  const renderPreferenceToggle = (preference, label, description) => (
    <div className="preference-item">
      <div className="preference-content">
        <h4 className="preference-label">{label}</h4>
        <p className="preference-description">{description}</p>
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={formData.preferences[preference]}
          onChange={(e) => handlePreferenceChange(preference, e.target.checked)}
          disabled={!isEditing}
        />
        <span className="toggle-slider"></span>
      </label>
    </div>
  );

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-panel">
            <div className="overview-grid">
              {renderInfoCard(
                'Company Name',
                brandData.companyName,
                '🏢',
                'Your brand identity on the platform'
              )}
              {renderInfoCard(
                'Industry',
                brandData.industry,
                '🏭',
                'Primary business category'
              )}
              {renderInfoCard(
                'Team Size',
                brandData.employeeCount,
                '👥',
                'Number of employees in your company'
              )}
              {renderInfoCard(
                'Website',
                brandData.website,
                '🌐',
                'Your company\'s main website'
              )}
              {renderInfoCard(
                'Email',
                brandData.email,
                '📧',
                'Primary contact email address'
              )}
              {renderInfoCard(
                'Contact Person',
                brandData.contactName,
                '👤',
                'Main point of contact'
              )}
            </div>
            {brandData.description && (
              <div className="description-section">
                <h3 className="section-title">About {brandData.companyName}</h3>
                <p className="description-text">{brandData.description}</p>
              </div>
            )}
          </div>
        );

      case 'details':
        return (
          <div className="tab-panel">
            <div className="form-section">
              <h3 className="section-title">Company Information</h3>
              <div className="form-grid">
                {renderEditableField('Company Name', 'companyName', 'text', 'Enter your company name')}
                {renderEditableField('Industry', 'industry', 'text', 'e.g., Technology, Fashion, Food')}
                {renderEditableField('Website', 'website', 'url', 'https://yourcompany.com')}
                {renderEditableField('Email', 'email', 'email', 'contact@yourcompany.com')}
                {renderEditableField('Phone', 'phone', 'tel', '+1 (555) 123-4567')}
                {renderEditableField('Employee Count', 'employeeCount', 'text', 'e.g., 1-10, 11-50, 50-100')}
                {renderEditableField('Contact Person', 'contactName', 'text', 'Primary contact name')}
              </div>
              {renderEditableField('Company Description', 'description', 'textarea', 'Tell us about your company...')}
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="tab-panel">
            <div className="social-section">
              <h3 className="section-title">Social Media Presence</h3>
              <p className="section-description">Connect your social media accounts to increase brand visibility</p>
              <div className="social-grid">
                {renderSocialField('linkedin', '💼')}
                {renderSocialField('twitter', '🐦')}
                {renderSocialField('facebook', '📘')}
                {renderSocialField('instagram', '📷')}
                {renderSocialField('tiktok', '🎵')}
                {renderSocialField('youtube', '📺')}
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="tab-panel">
            <div className="preferences-section">
              <h3 className="section-title">Notification Preferences</h3>
              <div className="preferences-list">
                {renderPreferenceToggle(
                  'emailNotifications',
                  'Email Notifications',
                  'Receive important updates via email'
                )}
                {renderPreferenceToggle(
                  'pushNotifications',
                  'Push Notifications',
                  'Get instant notifications in your browser'
                )}
                {renderPreferenceToggle(
                  'marketingEmails',
                  'Marketing Emails',
                  'Receive promotional content and updates'
                )}
                {renderPreferenceToggle(
                  'weeklyReports',
                  'Weekly Reports',
                  'Get weekly performance summaries'
                )}
                {renderPreferenceToggle(
                  'collaborationAlerts',
                  'Collaboration Alerts',
                  'Notifications for influencer responses'
                )}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="tab-panel">
            <div className="security-section">
              <h3 className="section-title">Account Security</h3>
              <div className="security-items">
                <div className="security-item">
                  <div className="security-content">
                    <h4>Password</h4>
                    <p>Last changed: Never</p>
                  </div>
                  <button className="btn btn-outline">Change Password</button>
                </div>
                <div className="security-item">
                  <div className="security-content">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security</p>
                  </div>
                  <button className="btn btn-outline">Enable 2FA</button>
                </div>
                <div className="security-item">
                  <div className="security-content">
                    <h4>Account Status</h4>
                    <p>Your account is active and secure</p>
                  </div>
                  <span className="status-badge active">Active</span>
                </div>
                <div className="security-item danger">
                  <div className="security-content">
                    <h4>Sign Out</h4>
                    <p>Sign out from your account</p>
                  </div>
                  <button className="btn btn-danger" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2"/>
                      <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2"/>
                      <path d="M21 12H9" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <div className="main-content">
        <div className="content-wrapper">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {brandData.companyName ? brandData.companyName.charAt(0).toUpperCase() : 'B'}
              </div>
              <div className="profile-status">
                <div className="status-dot"></div>
                Active
              </div>
            </div>
            <div className="profile-info">
              <h1 className="brand-name">{brandData.companyName}</h1>
              <p className="brand-industry">{brandData.industry}</p>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-label">Member since</span>
                  <span className="stat-value">{brandData.joinedDate}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Team size</span>
                  <span className="stat-value">{brandData.employeeCount || 'Not specified'}</span>
                </div>
              </div>
            </div>
            <div className="profile-actions-header">
              {!isEditing ? (
                <button className="btn btn-edit" onClick={handleEditClick}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="btn btn-cancel" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button className="btn btn-save" onClick={handleSaveClick} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="success-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
              Profile updated successfully!
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="profile-tabs">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <rect x="7" y="7" width="3" height="3" fill="currentColor"/>
                <rect x="14" y="7" width="3" height="3" fill="currentColor"/>
                <rect x="7" y="14" width="10" height="3" fill="currentColor"/>
              </svg>
              Overview
            </button>
            <button 
              className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Company Details
            </button>
            <button 
              className={`tab-button ${activeTab === 'social' ? 'active' : ''}`}
              onClick={() => setActiveTab('social')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Social Media
            </button>
            <button 
              className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="m12 1 2.09 6.26L22 9l-5.91 2.74L18 18l-6-3.26L6 18l1.91-6.26L2 9l7.91-1.74L12 1z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Preferences
            </button>
            <button 
              className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Security
            </button>
          </div>

          {/* Tab Content */}
          <div className="profile-content">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <NotificationSidebar onNotificationClick={handleNotificationClick} />
    </div>
  );
};

export default ProfilePage;