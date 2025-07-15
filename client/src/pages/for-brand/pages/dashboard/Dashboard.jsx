import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import './Dashboard.css';
import DashboardHeader from '../../components/dashboard/header/DashboardHeader';
import MetricsCards from '../../components/dashboard/metrics/MetricsCards';
import RevenueChart from '../../components/dashboard/revenue/RevenueChart';
import InfluencerPerformance from '../../components/dashboard/performance/InfluencerPerformance';
import CampaignAnalytics from '../../components/dashboard/analytics/CampaignAnalytics';
import TopInfluencers from '../../components/dashboard/top-influencers/TopInfluencers';
import InfluencersTable from '../../components/dashboard/table/InfluencersTable';
import NotificationSidebar from '../../components/notification/NotificationSidebar';

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
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app, this would come from API
      const mockData = {
        metrics: {
          totalRevenue: 125000,
          totalCampaigns: 24,
          activeInfluencers: 156,
          avgEngagement: 4.8
        },
        revenueData: generateRevenueData(),
        influencerData: generateInfluencerData(),
        campaignData: generateCampaignData(),
        topInfluencers: generateTopInfluencers(),
        engagementData: generateEngagementData()
      };
      
      setDashboardData(mockData);
      setLoading(false);
    };

    loadDashboardData();
  }, [startDate, endDate]);

  const generateRevenueData = () => {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 5000) + 2000,
        campaigns: Math.floor(Math.random() * 5) + 1,
        views: Math.floor(Math.random() * 10000) + 5000,
        engagement: Math.floor(Math.random() * 1000) + 200
      });
    }
    return data;
  };

  const generateInfluencerData = () => {
    return [
      { category: 'Fashion', count: 45, engagement: 5.2 },
      { category: 'Technology', count: 32, engagement: 4.8 },
      { category: 'Lifestyle', count: 38, engagement: 6.1 },
      { category: 'Fitness', count: 28, engagement: 7.3 },
      { category: 'Food', count: 22, engagement: 4.5 },
      { category: 'Travel', count: 18, engagement: 5.9 }
    ];
  };

  const generateCampaignData = () => {
    return [
      { name: 'Summer Collection', status: 'Active', budget: 15000, spent: 12000, roi: 2.4 },
      { name: 'Tech Launch', status: 'Completed', budget: 25000, spent: 25000, roi: 3.1 },
      { name: 'Fitness Challenge', status: 'Active', budget: 8000, spent: 4500, roi: 1.8 },
      { name: 'Food Festival', status: 'Planning', budget: 12000, spent: 0, roi: 0 },
      { name: 'Travel Guide', status: 'Completed', budget: 18000, spent: 18000, roi: 2.7 }
    ];
  };

  const generateTopInfluencers = () => {
    return [
      { name: 'Sarah Johnson', followers: 234000, engagement: 4.2, revenue: 8500 },
      { name: 'Alex Chen', followers: 456000, engagement: 6.8, revenue: 12000 },
      { name: 'Maria Rodriguez', followers: 789000, engagement: 8.3, revenue: 18500 },
      { name: 'David Kim', followers: 345000, engagement: 5.1, revenue: 9200 },
      { name: 'Emma Wilson', followers: 567000, engagement: 7.2, revenue: 14300 }
    ];
  };

  const generateEngagementData = () => {
    return [
      { platform: 'Instagram', rate: 4.2, change: 0.3 },
      { platform: 'YouTube', rate: 6.8, change: -0.1 },
      { platform: 'TikTok', rate: 8.3, change: 0.8 },
      { platform: 'Twitter', rate: 3.1, change: 0.2 },
      { platform: 'LinkedIn', rate: 4.9, change: 0.5 }
    ];
  };

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
              {/* First Row - Revenue Chart and Influencer Performance */}
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
              <InfluencerPerformance data={dashboardData.engagementData} />
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