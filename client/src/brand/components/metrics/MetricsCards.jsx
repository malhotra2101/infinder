import React, { useState, useEffect } from 'react';
import { getDashboardMetrics } from '../../../shared/services/dashboardApi.js';
import { getListCounts } from '../../../shared/services/api.js';
import './MetricsCards.css';

const MetricsCards = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalCampaigns: 0,
    activeInfluencers: 0,
    avgEngagement: 0,
    selectedInfluencers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dashboard metrics
        const dashboardData = await getDashboardMetrics();
        
        // Fetch list counts
        const listCountsData = await getListCounts();
        
        setMetrics({
          totalRevenue: dashboardData.total_revenue || 0,
          totalCampaigns: dashboardData.total_campaigns || 0,
          activeInfluencers: dashboardData.active_influencers || 0,
          avgEngagement: dashboardData.avg_engagement || 0,
          selectedInfluencers: listCountsData.data?.selected || 0
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num) => {
    return `${num}%`;
  };

  const metricsData = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      change: '+12.5%',
      changeType: 'positive',
      icon: '💰',
      color: 'revenue'
    },
    {
      title: 'Active Campaigns',
      value: metrics.totalCampaigns,
      change: '+3',
      changeType: 'positive',
      icon: '📊',
      color: 'campaigns'
    },
    {
      title: 'Selected Influencers',
      value: formatNumber(metrics.selectedInfluencers),
      change: '+2',
      changeType: 'positive',
      icon: '⭐',
      color: 'selected'
    },
    {
      title: 'Avg Engagement',
      value: formatPercentage(metrics.avgEngagement),
      change: '+0.3%',
      changeType: 'positive',
      icon: '📈',
      color: 'engagement'
    }
  ];

  if (loading) {
    return (
      <div className="metrics-cards">
        <div className="metric-card loading">
          <div className="loading-spinner"></div>
          <span>Loading metrics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="metrics-cards">
        <div className="metric-card error">
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="metrics-cards">
      {metricsData.map((metric, index) => (
        <div key={index} className={`metric-card metric-${metric.color}`}>
          <div className="metric-icon">
            <span role="img" aria-label={metric.title}>
              {metric.icon}
            </span>
          </div>
          
          <div className="metric-content">
            <h3 className="metric-title">{metric.title}</h3>
            <div className="metric-value">{metric.value}</div>
            <div className={`metric-change metric-change-${metric.changeType}`}>
              {metric.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards; 