import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import './InfluencerDashboardPage.css';

/**
 * Influencer Dashboard Page Component
 * 
 * Dedicated dashboard for influencers to manage their campaigns, analytics, and profile.
 * Features influencer-specific metrics and functionality.
 * 
 * @param {Object} props - Component props
 * @param {string} props.pageTitle - Page title for SEO
 * @param {string} props.pageDescription - Page description for SEO
 * @returns {JSX.Element} Influencer dashboard page component
 */
const InfluencerDashboardPage = ({ 
  pageTitle = "Influencer Dashboard - Infinder", 
  pageDescription = "Manage your influencer campaigns, analytics, and profile with powerful tools and insights." 
}) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    profile: {
      name: 'Alex Johnson',
      username: '@alexjohnson',
      followers: 125000,
      engagement: 4.2,
      categories: ['Lifestyle', 'Fashion', 'Travel'],
      verified: true
    },
    metrics: {
      totalCampaigns: 24,
      activeCampaigns: 3,
      totalEarnings: 18500,
      avgEngagement: 4.2,
      responseRate: 98,
      monthlyGrowth: 12.5
    },
    recentActivity: [
      {
        id: 1,
        type: 'campaign_started',
        title: 'EcoStyle Campaign Started',
        description: 'You started the Sustainable Fashion Campaign',
        time: '2 hours ago',
        earnings: 2500
      },
      {
        id: 2,
        type: 'campaign_completed',
        title: 'TechFlow Campaign Completed',
        description: 'Smart Home Devices campaign was completed successfully',
        time: '1 day ago',
        earnings: 1800
      },
      {
        id: 3,
        type: 'new_message',
        title: 'New Message from FitLife',
        description: 'You received a new message about campaign details',
        time: '3 days ago'
      }
    ],
    upcomingCampaigns: [
      {
        id: 1,
        brand: 'FitLife',
        title: 'Fitness App Launch',
        startDate: '2024-02-01',
        endDate: '2024-03-01',
        earnings: 3200,
        status: 'pending'
      },
      {
        id: 2,
        brand: 'BeautyGlow',
        title: 'Skincare Product Review',
        startDate: '2024-02-15',
        endDate: '2024-03-15',
        earnings: 2800,
        status: 'confirmed'
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
      <div className="influencer-dashboard-page">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
        </Helmet>
        
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your influencer dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="influencer-dashboard-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome back, {dashboardData.profile.name}!</h1>
            <p className="subtitle">Here's what's happening with your influencer campaigns</p>
          </div>
          <div className="profile-summary">
            <div className="profile-avatar">
              <img src="/api/placeholder/60/60" alt={dashboardData.profile.name} />
              {dashboardData.profile.verified && (
                <div className="verified-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="profile-stats">
              <span className="followers">{dashboardData.profile.followers.toLocaleString()} followers</span>
              <span className="engagement">{dashboardData.profile.engagement}% engagement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="content-grid">
          {/* Key Metrics */}
          <div className="metrics-section">
            <h2>Key Metrics</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon campaigns-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="metric-details">
                  <span className="metric-value">{dashboardData.metrics.totalCampaigns}</span>
                  <span className="metric-label">Total Campaigns</span>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon active-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="metric-details">
                  <span className="metric-value">{dashboardData.metrics.activeCampaigns}</span>
                  <span className="metric-label">Active Campaigns</span>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon earnings-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="metric-details">
                  <span className="metric-value">${dashboardData.metrics.totalEarnings.toLocaleString()}</span>
                  <span className="metric-label">Total Earnings</span>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon growth-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="m9 9 3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="metric-details">
                  <span className="metric-value">+{dashboardData.metrics.monthlyGrowth}%</span>
                  <span className="metric-label">Monthly Growth</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {dashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className="activity-card">
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.type === 'campaign_started' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {activity.type === 'campaign_completed' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="m9 11 3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {activity.type === 'new_message' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="activity-content">
                    <h3>{activity.title}</h3>
                    <p>{activity.description}</p>
                    <div className="activity-meta">
                      <span className="time">{activity.time}</span>
                      {activity.earnings && (
                        <span className="earnings">+${activity.earnings}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Campaigns */}
          <div className="campaigns-section">
            <h2>Upcoming Campaigns</h2>
            <div className="campaigns-list">
              {dashboardData.upcomingCampaigns.map((campaign) => (
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
                    {campaign.status === 'confirmed' && (
                      <button className="btn-primary">Start Campaign</button>
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Update Profile
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

InfluencerDashboardPage.propTypes = {
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string
};

export default InfluencerDashboardPage; 