import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import './Dashboard.css';
import DashboardHeader from '../components/header/DashboardHeader';
import MetricsCards from '../components/metrics/MetricsCards';
import RevenueChart from '../components/revenue/RevenueChart';
import EngagementByPlatform from '../components/performance/EngagementByPlatform';
import CampaignAnalytics from '../components/analytics/CampaignAnalytics';
import TopInfluencers from '../components/top-influencers/TopInfluencers';
import InfluencersTable from '../components/table/InfluencersTable';
import NotificationSidebar from '../../shared/components/shared/notification/NotificationSidebar';

/**
 * CRM Dashboard Component
 * 
 * A comprehensive dashboard for influencer marketing management
 * featuring analytics, charts, and business insights.
 */
const Dashboard = ({
  pageTitle = "CRM Dashboard - Influencer Marketing Analytics",
  pageDescription = "Comprehensive CRM dashboard for influencer marketing campaigns with real-time analytics and insights."
}) => {
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalRevenue: 0,
      totalCampaigns: 0,
      activeInfluencers: 0,
      avgEngagement: 0
    },
    revenueData: [],
    influencerData: [],
    campaignData: [],
    topInfluencers: [],
    engagementData: []
  });

  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Default to 30 days ago
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]; // Default to today
  });

  const handleNotificationClick = () => {
    console.log('Dashboard notification clicked');
  };

  useEffect(() => {
    // Load dashboard data from API
    const loadDashboardData = async () => {
      setLoading(true);
      
      try {
        // TODO: Replace with actual API calls
        // For now, set empty data structures
        const dashboardData = {
          metrics: {
            totalRevenue: 0,
            totalCampaigns: 0,
            activeInfluencers: 0,
            avgEngagement: 0
          },
          revenueData: [],
          influencerData: [],
          campaignData: [],
          topInfluencers: [],
          engagementData: []
        };
        
        setDashboardData(dashboardData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set empty data on error
        setDashboardData({
          metrics: {
            totalRevenue: 0,
            totalCampaigns: 0,
            activeInfluencers: 0,
            avgEngagement: 0
          },
          revenueData: [],
          influencerData: [],
          campaignData: [],
          topInfluencers: [],
          engagementData: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="crm-dashboard">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
        </Helmet>

        {/* Floating Notification Button */}
        <div className="dashboard-notification-button">
          <NotificationSidebar 
            count={5} 
            onClick={handleNotificationClick}
            className="dashboard-notification"
          />
        </div>

        {/* Dashboard Loading Skeleton */}
        <div className="dashboard-loading-skeleton">
          {/* Header Skeleton */}
          <div className="dashboard-header skeleton">
            <div className="header-content">
              <div className="header-left">
                <div className="skeleton-text skeleton-title"></div>
                <div className="skeleton-text skeleton-subtitle"></div>
              </div>
              <div className="header-right">
                <div className="skeleton-controls">
                  <div className="skeleton-dropdown"></div>
                  <div className="skeleton-buttons">
                    <div className="skeleton-btn"></div>
                    <div className="skeleton-btn"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            {/* Metrics Cards Skeleton */}
            <div className="metrics-cards skeleton">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="metric-card skeleton">
                  <div className="metric-icon skeleton-icon"></div>
                  <div className="metric-content">
                    <div className="skeleton-text skeleton-title"></div>
                    <div className="skeleton-text skeleton-value"></div>
                    <div className="skeleton-text skeleton-change"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dashboard Grid Skeleton */}
            <div className="dashboard-grid">
              {/* First Row - Revenue Chart and Engagement by Platform */}
              <div className="dashboard-row">
                <div className="chart-card skeleton">
                  <div className="chart-header">
                    <div className="skeleton-text skeleton-title"></div>
                    <div className="skeleton-controls">
                      <div className="skeleton-dropdown"></div>
                    </div>
                  </div>
                  <div className="chart-content">
                    <div className="skeleton-chart"></div>
                  </div>
                  <div className="chart-summary">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="summary-item skeleton">
                        <div className="skeleton-text"></div>
                        <div className="skeleton-text"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="chart-card skeleton">
                  <div className="chart-header">
                    <div className="skeleton-text skeleton-title"></div>
                  </div>
                  <div className="chart-content">
                    <div className="skeleton-donut"></div>
                  </div>
                  <div className="chart-summary">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="summary-item skeleton">
                        <div className="skeleton-text"></div>
                        <div className="skeleton-text"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Second Row - Campaign Analytics and Top Influencers */}
              <div className="dashboard-row">
                <div className="chart-card skeleton">
                  <div className="chart-header">
                    <div className="skeleton-text skeleton-title"></div>
                  </div>
                  <div className="chart-content">
                    <div className="skeleton-table">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="skeleton-table-row">
                          <div className="skeleton-text"></div>
                          <div className="skeleton-text"></div>
                          <div className="skeleton-text"></div>
                          <div className="skeleton-text"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="chart-card skeleton">
                  <div className="chart-header">
                    <div className="skeleton-text skeleton-title"></div>
                  </div>
                  <div className="chart-content">
                    <div className="skeleton-list">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="skeleton-list-item">
                          <div className="skeleton-avatar"></div>
                          <div className="skeleton-content">
                            <div className="skeleton-text"></div>
                            <div className="skeleton-text"></div>
                          </div>
                          <div className="skeleton-stats">
                            <div className="skeleton-text"></div>
                            <div className="skeleton-text"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Third Row - Influencers Table */}
              <div className="dashboard-row">
                <div className="chart-card skeleton">
                  <div className="chart-header">
                    <div className="skeleton-text skeleton-title"></div>
                    <div className="skeleton-controls">
                      <div className="skeleton-search"></div>
                      <div className="skeleton-btn"></div>
                    </div>
                  </div>
                  <div className="chart-content">
                    <div className="skeleton-table-large">
                      <div className="skeleton-table-header">
                        {[1, 2, 3, 4, 5, 6].map((j) => (
                          <div key={j} className="skeleton-text"></div>
                        ))}
                      </div>
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="skeleton-table-row">
                          {[1, 2, 3, 4, 5, 6].map((k) => (
                            <div key={k} className="skeleton-text"></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crm-dashboard">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      {/* Floating Notification Button */}
      <div className="dashboard-notification-button">
        <NotificationSidebar 
          count={5} 
          onClick={handleNotificationClick}
          className="dashboard-notification"
        />
      </div>

      <DashboardHeader 
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <div className="dashboard-content">
        <MetricsCards metrics={dashboardData.metrics} />
        
        <div className="dashboard-grid">
          <div className="dashboard-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <div style={{ flex: 1, minWidth: 0, maxWidth: 'calc(100% - 280px)' }}>
              <RevenueChart data={dashboardData.revenueData} />
            </div>
            <div style={{ width: 260 }}>
              <EngagementByPlatform data={dashboardData.engagementData} />
            </div>
          </div>
          
          <div className="dashboard-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <CampaignAnalytics data={dashboardData.campaignData} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <TopInfluencers data={dashboardData.topInfluencers} />
            </div>
          </div>
          
          <div className="dashboard-row">
            <InfluencersTable />
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string
};

export default Dashboard; 