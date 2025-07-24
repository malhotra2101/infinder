import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import './InfluencerProfilePage.css';

// Import shared components
import Button from '../../shared/ui/Button';

/**
 * Influencer Profile Page Component
 * 
 * Enhanced profile page for influencers with tab-based navigation,
 * improved UI/UX, and comprehensive profile management features.
 * 
 * @param {Object} props - Component props
 * @param {string} props.pageTitle - Page title for SEO
 * @param {string} props.pageDescription - Page description for SEO
 * @returns {JSX.Element} Influencer profile page component
 */
const InfluencerProfilePage = ({ 
  pageTitle = "Profile - Influencer Dashboard", 
  pageDescription = "Manage your influencer profile, social media accounts, and campaign preferences." 
}) => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    personal: {
      name: 'Alex Johnson',
      username: '@alexjohnson',
      email: 'alex.johnson@example.com',
      phone: '+1 (555) 123-4567',
      bio: 'Lifestyle and fashion influencer passionate about sustainable living and authentic content creation. I create engaging content that inspires my audience to live their best lives while staying true to their values.',
      location: 'Los Angeles, CA',
      website: 'https://alexjohnson.com',
      dateOfBirth: '1995-03-15',
      gender: 'Female',
      languages: ['English', 'Spanish'],
      experience: '5+ years'
    },
    social: {
      instagram: {
        handle: '@alexjohnson',
        followers: 125000,
        engagement: 4.2,
        verified: true,
        url: 'https://instagram.com/alexjohnson'
      },
      tiktok: {
        handle: '@alexjohnson',
        followers: 89000,
        engagement: 5.1,
        verified: false,
        url: 'https://tiktok.com/@alexjohnson'
      },
      youtube: {
        handle: '@alexjohnson',
        subscribers: 45000,
        engagement: 3.8,
        verified: true,
        url: 'https://youtube.com/@alexjohnson'
      },
      twitter: {
        handle: '@alexjohnson',
        followers: 32000,
        engagement: 2.9,
        verified: false,
        url: 'https://twitter.com/alexjohnson'
      }
    },
    categories: ['Lifestyle', 'Fashion', 'Travel', 'Beauty', 'Wellness'],
    interests: ['Sustainable Fashion', 'Wellness', 'Photography', 'Cooking', 'Fitness', 'Mental Health'],
    preferences: {
      minBudget: 1000,
      maxBudget: 10000,
      preferredCategories: ['Fashion', 'Lifestyle'],
      locationPreference: 'Remote',
      campaignDuration: '2-4 weeks',
      responseTime: '24 hours',
      availability: 'Part-time',
      collaborationTypes: ['Sponsored Posts', 'Product Reviews', 'Brand Ambassadorships']
    },
    stats: {
      totalCampaigns: 24,
      completedCampaigns: 22,
      totalEarnings: 18500,
      avgRating: 4.8,
      responseRate: 98,
      completionRate: 92,
      monthlyReach: 250000,
      avgEngagement: 4.5
    },
    portfolio: {
      featured: [
        {
          id: 1,
          title: 'Sustainable Fashion Campaign',
          brand: 'EcoStyle',
          platform: 'Instagram',
          engagement: 8500,
          reach: 45000,
          image: '/api/placeholder/300/200',
          date: '2024-01-15'
        },
        {
          id: 2,
          title: 'Wellness Product Launch',
          brand: 'HealthVibe',
          platform: 'TikTok',
          engagement: 12000,
          reach: 68000,
          image: '/api/placeholder/300/200',
          date: '2024-02-20'
        }
      ]
    },
    analytics: {
      monthlyGrowth: 12.5,
      topPerformingContent: 'Lifestyle Tips',
      audienceDemographics: {
        age: { '18-24': 35, '25-34': 45, '35-44': 15, '45+': 5 },
        gender: { 'Female': 78, 'Male': 20, 'Other': 2 },
        location: { 'US': 65, 'Canada': 15, 'UK': 10, 'Other': 10 }
      }
    }
  });

  const [formData, setFormData] = useState({});

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setFormData(profileData);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    setProfileData(formData);
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddCategory = () => {
    const newCategory = prompt('Enter new category:');
    if (newCategory && newCategory.trim()) {
      setFormData(prev => ({
        ...prev,
        categories: [...(prev.categories || []), newCategory.trim()]
      }));
    }
  };

  const handleRemoveCategory = (index) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const handleAddInterest = () => {
    const newInterest = prompt('Enter new interest:');
    if (newInterest && newInterest.trim()) {
      setFormData(prev => ({
        ...prev,
        interests: [...(prev.interests || []), newInterest.trim()]
      }));
    }
  };

  const handleRemoveInterest = (index) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="influencer-profile-page">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
        </Helmet>
        
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="influencer-profile-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      {/* Header Section */}
      <div className="profile-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Profile Settings</h1>
            <p>Manage your influencer profile, portfolio, and campaign preferences</p>
          </div>
          <div className="header-actions">
            {!isEditing ? (
              <div className="action-buttons">
                <Button 
                  variant="secondary" 
                  size="medium"
                  onClick={() => setShowAnalyticsModal(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Analytics
                </Button>
                <Button 
                  variant="secondary" 
                  size="medium"
                  onClick={() => setShowPortfolioModal(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Portfolio
                </Button>
                <Button 
                  variant="primary" 
                  size="medium"
                  onClick={() => setIsEditing(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit Profile
                </Button>
              </div>
            ) : (
              <div className="edit-actions">
                <Button 
                  variant="secondary" 
                  size="medium"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  size="medium"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs">
        <div className="tab-container">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => handleTabChange('personal')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Personal Info
          </button>
          <button 
            className={`tab-button ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => handleTabChange('social')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Social Media
          </button>
          <button 
            className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => handleTabChange('preferences')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Preferences
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <div className="content-grid">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Profile Overview */}
              <div className="profile-overview">
                <div className="overview-card">
                  <div className="profile-avatar-section">
                    <div className="profile-avatar">
                      <img src="/api/placeholder/120/120" alt={profileData.personal.name} />
                      <div className="avatar-overlay">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="profile-info">
                      <h2>{profileData.personal.name}</h2>
                      <p className="username">{profileData.personal.username}</p>
                      <div className="verification-status">
                        <span className="verified-badge">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Verified Influencer
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="profile-stats">
                    <div className="stat-item">
                      <span className="stat-value">{profileData.stats.totalCampaigns}</span>
                      <span className="stat-label">Campaigns</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">${profileData.stats.totalEarnings.toLocaleString()}</span>
                      <span className="stat-label">Earnings</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{profileData.stats.avgRating}</span>
                      <span className="stat-label">Rating</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{profileData.stats.monthlyReach.toLocaleString()}</span>
                      <span className="stat-label">Monthly Reach</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="profile-section">
                <div className="section-header">
                  <h3>Performance Overview</h3>
                  <p>Your key performance metrics</p>
                </div>
                <div className="section-content">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="stat-content">
                        <h4>Response Rate</h4>
                        <p className="stat-number">{profileData.stats.responseRate}%</p>
                        <p className="stat-description">Average response time to brand inquiries</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="stat-content">
                        <h4>Completion Rate</h4>
                        <p className="stat-number">{profileData.stats.completionRate}%</p>
                        <p className="stat-description">Successfully completed campaigns</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="stat-content">
                        <h4>Monthly Growth</h4>
                        <p className="stat-number">+{profileData.analytics.monthlyGrowth}%</p>
                        <p className="stat-description">Follower growth this month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Portfolio */}
              <div className="profile-section">
                <div className="section-header">
                  <h3>Featured Work</h3>
                  <p>Your best performing campaigns</p>
                </div>
                <div className="section-content">
                  <div className="portfolio-grid">
                    {profileData.portfolio.featured.map((item) => (
                      <div key={item.id} className="portfolio-card">
                        <div className="portfolio-image">
                          <img src={item.image} alt={item.title} />
                          <div className="portfolio-overlay">
                            <Button variant="secondary" size="small">View Details</Button>
                          </div>
                        </div>
                        <div className="portfolio-content">
                          <h4>{item.title}</h4>
                          <p className="brand-name">{item.brand}</p>
                          <div className="portfolio-stats">
                            <span className="platform">{item.platform}</span>
                            <span className="engagement">{item.engagement.toLocaleString()} engagements</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <>
              {/* Personal Information */}
              <div className="profile-section">
                <div className="section-header">
                  <h3>Personal Information</h3>
                  <p>Your basic profile details</p>
                </div>
                <div className="section-content">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        value={isEditing ? formData.personal?.name : profileData.personal.name}
                        onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        id="username"
                        value={isEditing ? formData.personal?.username : profileData.personal.username}
                        onChange={(e) => handleInputChange('personal', 'username', e.target.value)}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={isEditing ? formData.personal?.email : profileData.personal.email}
                        onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        value={isEditing ? formData.personal?.phone : profileData.personal.phone}
                        onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="location">Location</label>
                      <input
                        type="text"
                        id="location"
                        value={isEditing ? formData.personal?.location : profileData.personal.location}
                        onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="website">Website</label>
                      <input
                        type="url"
                        id="website"
                        value={isEditing ? formData.personal?.website : profileData.personal.website}
                        onChange={(e) => handleInputChange('personal', 'website', e.target.value)}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="experience">Experience</label>
                      <input
                        type="text"
                        id="experience"
                        value={isEditing ? formData.personal?.experience : profileData.personal.experience}
                        onChange={(e) => handleInputChange('personal', 'experience', e.target.value)}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="languages">Languages</label>
                      <input
                        type="text"
                        id="languages"
                        value={isEditing ? formData.personal?.languages?.join(', ') : profileData.personal.languages.join(', ')}
                        onChange={(e) => handleInputChange('personal', 'languages', e.target.value.split(', '))}
                        disabled={!isEditing}
                        className="form-input"
                        placeholder="English, Spanish, French"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group full-width">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      value={isEditing ? formData.personal?.bio : profileData.personal.bio}
                      onChange={(e) => handleInputChange('personal', 'bio', e.target.value)}
                      disabled={!isEditing}
                      className="form-textarea"
                      rows="4"
                    />
                  </div>
                </div>
              </div>

              {/* Categories & Interests */}
              <div className="profile-section">
                <div className="section-header">
                  <h3>Categories & Interests</h3>
                  <p>Help brands find you for relevant campaigns</p>
                </div>
                <div className="section-content">
                  <div className="categories-section">
                    <h4>Content Categories</h4>
                    <div className="tags-container">
                      {(isEditing ? formData.categories : profileData.categories).map((category, index) => (
                        <span key={index} className="tag">
                          {category}
                          {isEditing && (
                            <button 
                              className="tag-remove"
                              onClick={() => handleRemoveCategory(index)}
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                      {isEditing && (
                        <button className="add-tag-btn" onClick={handleAddCategory}>
                          + Add Category
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="interests-section">
                    <h4>Interests & Topics</h4>
                    <div className="tags-container">
                      {(isEditing ? formData.interests : profileData.interests).map((interest, index) => (
                        <span key={index} className="tag">
                          {interest}
                          {isEditing && (
                            <button 
                              className="tag-remove"
                              onClick={() => handleRemoveInterest(index)}
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                      {isEditing && (
                        <button className="add-tag-btn" onClick={handleAddInterest}>
                          + Add Interest
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <>
              {/* Social Media Accounts */}
              <div className="profile-section">
                <div className="section-header">
                  <h3>Social Media Accounts</h3>
                  <p>Connect your social media profiles</p>
                </div>
                <div className="section-content">
                  <div className="social-accounts">
                    {Object.entries(profileData.social).map(([platform, data]) => (
                      <div key={platform} className="social-account-card">
                        <div className="platform-info">
                          <div className="platform-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                              <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className="platform-details">
                            <h4>{platform.charAt(0).toUpperCase() + platform.slice(1)}</h4>
                            <p className="handle">{data.handle}</p>
                            <div className="platform-stats">
                              <span className="followers">
                                {platform === 'youtube' ? `${data.subscribers?.toLocaleString()} subscribers` : `${data.followers?.toLocaleString()} followers`}
                              </span>
                              <span className="engagement">{data.engagement}% engagement</span>
                            </div>
                          </div>
                          <div className="verification-status">
                            {data.verified ? (
                              <span className="verified-badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Verified
                              </span>
                            ) : (
                              <span className="unverified-badge">Unverified</span>
                            )}
                          </div>
                        </div>
                        {isEditing && (
                          <div className="account-actions">
                            <Button variant="secondary" size="small">Edit</Button>
                            <Button variant="danger" size="small">Disconnect</Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <>
              {/* Campaign Preferences */}
              <div className="profile-section">
                <div className="section-header">
                  <h3>Campaign Preferences</h3>
                  <p>Set your preferences for campaign opportunities</p>
                </div>
                <div className="section-content">
                  <div className="preferences-grid">
                    <div className="form-group">
                      <label htmlFor="min-budget">Minimum Budget</label>
                      <input
                        type="number"
                        id="min-budget"
                        value={isEditing ? formData.preferences?.minBudget : profileData.preferences.minBudget}
                        onChange={(e) => handleInputChange('preferences', 'minBudget', parseInt(e.target.value))}
                        disabled={!isEditing}
                        className="form-input"
                        min="0"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="max-budget">Maximum Budget</label>
                      <input
                        type="number"
                        id="max-budget"
                        value={isEditing ? formData.preferences?.maxBudget : profileData.preferences.maxBudget}
                        onChange={(e) => handleInputChange('preferences', 'maxBudget', parseInt(e.target.value))}
                        disabled={!isEditing}
                        className="form-input"
                        min="0"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="location-pref">Location Preference</label>
                      <select
                        id="location-pref"
                        value={isEditing ? formData.preferences?.locationPreference : profileData.preferences.locationPreference}
                        onChange={(e) => handleInputChange('preferences', 'locationPreference', e.target.value)}
                        disabled={!isEditing}
                        className="form-select"
                      >
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="duration">Preferred Duration</label>
                      <select
                        id="duration"
                        value={isEditing ? formData.preferences?.campaignDuration : profileData.preferences.campaignDuration}
                        onChange={(e) => handleInputChange('preferences', 'campaignDuration', e.target.value)}
                        disabled={!isEditing}
                        className="form-select"
                      >
                        <option value="1 week">1 week</option>
                        <option value="2-4 weeks">2-4 weeks</option>
                        <option value="1-2 months">1-2 months</option>
                        <option value="3+ months">3+ months</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="availability">Availability</label>
                      <select
                        id="availability"
                        value={isEditing ? formData.preferences?.availability : profileData.preferences.availability}
                        onChange={(e) => handleInputChange('preferences', 'availability', e.target.value)}
                        disabled={!isEditing}
                        className="form-select"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="response-time">Response Time</label>
                      <select
                        id="response-time"
                        value={isEditing ? formData.preferences?.responseTime : profileData.preferences.responseTime}
                        onChange={(e) => handleInputChange('preferences', 'responseTime', e.target.value)}
                        disabled={!isEditing}
                        className="form-select"
                      >
                        <option value="1 hour">1 hour</option>
                        <option value="24 hours">24 hours</option>
                        <option value="48 hours">48 hours</option>
                        <option value="1 week">1 week</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

InfluencerProfilePage.propTypes = {
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string
};

export default InfluencerProfilePage; 