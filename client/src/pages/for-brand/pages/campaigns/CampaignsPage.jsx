import React, { useState, useEffect } from 'react';
import './CampaignsPage.css';
import NotificationSidebar from '../../components/notification/NotificationSidebar';

/**
 * Campaigns Page Component
 * 
 * Displays all campaigns with their status, budget, and performance metrics.
 * Features filtering, search, and campaign management functionality.
 */
const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleNotificationClick = () => {
    console.log('Campaigns page notification clicked');
  };

  // Sample campaigns data
  const sampleCampaigns = [
    {
      id: 1,
      name: 'Summer Fashion Campaign',
      status: 'active',
      budget: 50000.00,
      spent: 32000.00,
      start_date: '2024-06-01',
      end_date: '2024-08-31',
      influencers_count: 8,
      engagement_rate: 6.8,
      revenue: 125000.00,
      description: 'Promoting summer fashion collection across multiple platforms'
    },
    {
      id: 2,
      name: 'Tech Product Launch',
      status: 'active',
      budget: 75000.00,
      spent: 45000.00,
      start_date: '2024-07-01',
      end_date: '2024-09-30',
      influencers_count: 12,
      engagement_rate: 8.2,
      revenue: 210000.00,
      description: 'Launch campaign for new tech product with influencer partnerships'
    },
    {
      id: 3,
      name: 'Food & Lifestyle',
      status: 'completed',
      budget: 30000.00,
      spent: 30000.00,
      start_date: '2024-06-15',
      end_date: '2024-08-15',
      influencers_count: 6,
      engagement_rate: 7.5,
      revenue: 85000.00,
      description: 'Food and lifestyle content campaign with cooking influencers'
    },
    {
      id: 4,
      name: 'Fitness Challenge',
      status: 'active',
      budget: 40000.00,
      spent: 28000.00,
      start_date: '2024-07-01',
      end_date: '2024-08-31',
      influencers_count: 10,
      engagement_rate: 9.1,
      revenue: 150000.00,
      description: '30-day fitness challenge with fitness influencers'
    },
    {
      id: 5,
      name: 'Beauty Products',
      status: 'draft',
      budget: 60000.00,
      spent: 0.00,
      start_date: '2024-06-01',
      end_date: '2024-09-30',
      influencers_count: 0,
      engagement_rate: 0,
      revenue: 0.00,
      description: 'Beauty product campaign targeting beauty and lifestyle influencers'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCampaigns(sampleCampaigns);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'completed':
        return '#3B82F6';
      case 'draft':
        return '#6B7280';
      case 'paused':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'draft':
        return 'Draft';
      case 'paused':
        return 'Paused';
      default:
        return status;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalRevenue = campaigns.reduce((sum, campaign) => sum + campaign.revenue, 0);
  const activeCampaigns = campaigns.filter(campaign => campaign.status === 'active').length;

  if (loading) {
    return (
      <div className="campaigns-page">
        {/* Floating Notification Button */}
        <div className="campaigns-notification-button">
          <NotificationSidebar 
            count={2} 
            onClick={handleNotificationClick}
            className="campaigns-notification"
          />
        </div>

        <div className="campaigns-header">
          <h1>Campaigns</h1>
        </div>
        
        {/* Loading Skeleton */}
        <div className="loading-skeleton">
          {/* Stats Cards Skeleton */}
          <div className="campaigns-stats">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card skeleton">
                <div className="stat-icon skeleton-icon"></div>
                <div className="stat-content">
                  <div className="skeleton-text skeleton-title"></div>
                  <div className="skeleton-text skeleton-subtitle"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Skeleton */}
          <div className="campaigns-filters skeleton">
            <div className="search-box">
              <div className="skeleton-search"></div>
            </div>
            <div className="filter-buttons">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-filter-btn"></div>
              ))}
            </div>
          </div>

          {/* Campaign Cards Skeleton */}
          <div className="campaigns-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="campaign-card skeleton">
                <div className="campaign-header">
                  <div className="campaign-title">
                    <div className="skeleton-text skeleton-title"></div>
                    <div className="skeleton-text skeleton-subtitle"></div>
                  </div>
                  <div className="skeleton-badge"></div>
                </div>
                <div className="campaign-description">
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text"></div>
                </div>
                <div className="campaign-metrics">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="metric skeleton">
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text"></div>
                    </div>
                  ))}
                </div>
                <div className="campaign-progress">
                  <div className="progress-bar">
                    <div className="skeleton-progress"></div>
                  </div>
                  <div className="skeleton-text"></div>
                </div>
                <div className="campaign-actions-bottom">
                  <div className="skeleton-btn"></div>
                  <div className="skeleton-btn"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="campaigns-page">
      {/* Floating Notification Button */}
      <div className="campaigns-notification-button">
        <NotificationSidebar 
          count={2} 
          onClick={handleNotificationClick}
          className="campaigns-notification"
        />
      </div>

      {/* Header */}
      <div className="campaigns-header">
        <div className="header-content">
          <h1>Campaigns</h1>
          <p>Manage and track your influencer marketing campaigns</p>
        </div>
        <button className="create-campaign-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Create Campaign
        </button>
      </div>

      {/* Stats Cards */}
      <div className="campaigns-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{campaigns.length}</h3>
            <p>Total Campaigns</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{activeCampaigns}</h3>
            <p>Active Campaigns</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>${totalBudget.toLocaleString()}</h3>
            <p>Total Budget</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>${totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="campaigns-filters">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${statusFilter === 'draft' ? 'active' : ''}`}
            onClick={() => setStatusFilter('draft')}
          >
            Draft
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="campaigns-grid">
        {filteredCampaigns.map(campaign => (
          <div key={campaign.id} className="campaign-card">
            <div className="campaign-header">
              <div className="campaign-title">
                <h3>{campaign.name}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(campaign.status) }}
                >
                  {getStatusLabel(campaign.status)}
                </span>
              </div>
              <div className="campaign-actions">
                <button className="action-btn" title="More options">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="19" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="5" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            </div>

            <p className="campaign-description">{campaign.description}</p>

            <div className="campaign-metrics">
              <div className="metric">
                <span className="metric-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Budget
                </span>
                <span className="metric-value">${campaign.budget.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="metric-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                    <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Spent
                </span>
                <span className="metric-value">${campaign.spent.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="metric-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Revenue
                </span>
                <span className="metric-value">${campaign.revenue.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="metric-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M23 21V19C23 18.1137 22.7312 17.2528 22.2312 16.5159C21.7311 15.7789 21.0215 15.2002 20.18 14.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11883 19.0078 7.005C19.0078 7.89117 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Influencers
                </span>
                <span className="metric-value">{campaign.influencers_count}</span>
              </div>
              <div className="metric">
                <span className="metric-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                    <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Engagement
                </span>
                <span className="metric-value">{campaign.engagement_rate}%</span>
              </div>
            </div>

            <div className="campaign-dates">
              <div className="date-range">
                <span className="date-label">Start Date</span>
                <span className="date-value">{new Date(campaign.start_date).toLocaleDateString()}</span>
              </div>
              <div className="date-range">
                <span className="date-label">End Date</span>
                <span className="date-value">{new Date(campaign.end_date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="campaign-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {((campaign.spent / campaign.budget) * 100).toFixed(1)}% spent
              </span>
            </div>

            <div className="campaign-actions-bottom">
              <button className="btn-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                View Details
              </button>
              <button className="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit Campaign
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>No campaigns found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default CampaignsPage; 