import React, { useState, useEffect } from 'react';
import { getTopInfluencers } from '../../../shared/services/dashboardApi.js';
import './TopInfluencers.css';

const TopInfluencers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopInfluencers = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getTopInfluencers(5);
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching top influencers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopInfluencers();
  }, []);
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (num) => {
    return `${num}%`;
  };

  if (loading) {
    return (
      <div className="chart-card top-influencers">
        <div className="chart-header">
          <h3 className="chart-title">Top Performing Influencers</h3>
        </div>
        <div className="chart-content">
          <div className="loading-spinner"></div>
          <span>Loading top influencers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-card top-influencers">
        <div className="chart-header">
          <h3 className="chart-title">Top Performing Influencers</h3>
        </div>
        <div className="chart-content">
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card top-influencers">
      <div className="chart-header">
        <h3 className="chart-title">Top Performing Influencers</h3>
      </div>
      
      <div className="chart-content">
        <div className="influencers-table">
          <div className="table-header">
            <div className="header-cell">Influencer</div>
            <div className="header-cell">Followers</div>
            <div className="header-cell">Engagement</div>
            <div className="header-cell">Revenue</div>
          </div>
          
          <div className="table-body">
            {data.length === 0 ? (
              <div className="empty-state">
                <span>No top influencers found</span>
              </div>
            ) : (
              data.map((influencer, index) => (
              <div key={index} className="table-row">
                <div className="table-cell influencer-cell">
                  <div className="influencer-avatar">
                    <span className="avatar-text">
                      {influencer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="influencer-info">
                    <div className="influencer-name">{influencer.name}</div>
                    <div className="influencer-rank">#{index + 1}</div>
                  </div>
                </div>
                
                <div className="table-cell followers-cell">
                  <div className="followers-value">{formatNumber(influencer.followers)}</div>
                  <div className="followers-label">followers</div>
                </div>
                
                <div className="table-cell engagement-cell">
                  <div className="engagement-value">{formatPercentage(influencer.engagement)}</div>
                  <div className="engagement-bar">
                    <div 
                      className="engagement-fill"
                      style={{ width: `${(influencer.engagement / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="table-cell revenue-cell">
                  <div className="revenue-value">{formatCurrency(influencer.revenue)}</div>
                  <div className="revenue-label">generated</div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>
      </div>
      
      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">Total Followers</span>
          <span className="summary-value">
            {formatNumber(data.reduce((sum, d) => sum + d.followers, 0))}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Avg Engagement</span>
          <span className="summary-value">
            {(data.reduce((sum, d) => sum + d.engagement, 0) / data.length).toFixed(1)}%
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Revenue</span>
          <span className="summary-value">
            {formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};



export default TopInfluencers; 