import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import './InfluencerPage.css';

/**
 * Influencer Page Component
 * 
 * Main page for influencers to manage their profile, campaigns, and collaborations.
 * Features a clean, modern interface with influencer-specific functionality.
 * 
 * @param {Object} props - Component props
 * @param {string} props.pageTitle - Page title for SEO
 * @param {string} props.pageDescription - Page description for SEO
 * @returns {JSX.Element} Influencer page component
 */
const InfluencerPage = ({ 
  pageTitle = "Influencer Dashboard - Infinder", 
  pageDescription = "Manage your influencer profile, campaigns, and collaborations with powerful tools and analytics." 
}) => {
  const [loading, setLoading] = useState(true);
  const [influencerData, setInfluencerData] = useState({
    profile: {
      name: 'Alex Johnson',
      username: '@alexjohnson',
      followers: 125000,
      engagement: 4.2,
      categories: ['Lifestyle', 'Fashion', 'Travel'],
      verified: true
    },
    stats: {
      totalCampaigns: 24,
      activeCampaigns: 3,
      totalEarnings: 18500,
      avgEngagement: 4.2,
      responseRate: 98
    },
    recentCampaigns: [
      {
        id: 1,
        brand: 'EcoStyle',
        title: 'Sustainable Fashion Campaign',
        status: 'active',
        earnings: 2500,
        startDate: '2024-01-15',
        endDate: '2024-02-15'
      },
      {
        id: 2,
        brand: 'TechFlow',
        title: 'Smart Home Devices',
        status: 'completed',
        earnings: 1800,
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      },
      {
        id: 3,
        brand: 'FitLife',
        title: 'Fitness App Launch',
        status: 'pending',
        earnings: 3200,
        startDate: '2024-02-01',
        endDate: '2024-03-01'
      }
    ]
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="influencer-page">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
        </Helmet>
        
        <div className="influencer-loading">
          <div className="loading-spinner"></div>
          <p>Loading your influencer dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="influencer-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      {/* Header Section */}
      <div className="influencer-header">
        <div className="header-content">
          <div className="profile-section">
            <div className="profile-avatar">
              <img src="/api/placeholder/100/100" alt={influencerData.profile.name} />
              {influencerData.profile.verified && (
                <div className="verified-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="profile-info">
              <h1>{influencerData.profile.name}</h1>
              <p className="username">{influencerData.profile.username}</p>
              <div className="categories">
                {influencerData.profile.categories.map((category, index) => (
                  <span key={index} className="category-tag">{category}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="stats-overview">
            <div className="stat-item">
              <span className="stat-value">{influencerData.profile.followers.toLocaleString()}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{influencerData.profile.engagement}%</span>
              <span className="stat-label">Engagement</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">${influencerData.stats.totalEarnings.toLocaleString()}</span>
              <span className="stat-label">Total Earnings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="influencer-content">
        <div className="content-grid">
          {/* Quick Stats */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon campaigns-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-details">
                <span className="stat-number">{influencerData.stats.totalCampaigns}</span>
                <span className="stat-text">Total Campaigns</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon active-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-details">
                <span className="stat-number">{influencerData.stats.activeCampaigns}</span>
                <span className="stat-text">Active Campaigns</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon engagement-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-details">
                <span className="stat-number">{influencerData.stats.avgEngagement}%</span>
                <span className="stat-text">Avg Engagement</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon response-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m9 11 3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-details">
                <span className="stat-number">{influencerData.stats.responseRate}%</span>
                <span className="stat-text">Response Rate</span>
              </div>
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="campaigns-section">
            <div className="section-header">
              <h2>Recent Campaigns</h2>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="campaigns-list">
              {influencerData.recentCampaigns.map((campaign) => (
                <div key={campaign.id} className="campaign-card">
                  <div className="campaign-header">
                    <h3>{campaign.title}</h3>
                    <span className={`status-badge ${campaign.status}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="campaign-details">
                    <p className="brand-name">{campaign.brand}</p>
                    <div className="campaign-meta">
                      <span className="earnings">${campaign.earnings.toLocaleString()}</span>
                      <span className="dates">{campaign.startDate} - {campaign.endDate}</span>
                    </div>
                  </div>
                  <div className="campaign-actions">
                    <button className="btn-secondary">View Details</button>
                    {campaign.status === 'active' && (
                      <button className="btn-primary">Continue</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m22 21-2-2m0 0V9a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Update Profile
              </button>
              <button className="action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Browse Campaigns
              </button>
              <button className="action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                View Messages
              </button>
              <button className="action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

InfluencerPage.propTypes = {
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string
};

export default InfluencerPage; 