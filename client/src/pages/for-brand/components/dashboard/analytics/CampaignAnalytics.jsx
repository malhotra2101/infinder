import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './CampaignAnalytics.css';

const CampaignAnalytics = ({ data }) => {
  const [selectedCampaigns, setSelectedCampaigns] = useState(data.slice(0, 2).map(campaign => campaign.name));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#10b981';
      case 'completed':
        return '#3b82f6';
      case 'planning':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'rgba(16, 185, 129, 0.1)';
      case 'completed':
        return 'rgba(59, 130, 246, 0.1)';
      case 'planning':
        return 'rgba(245, 158, 11, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const handleCampaignToggle = (campaignName) => {
    setSelectedCampaigns(prev => {
      if (prev.includes(campaignName)) {
        // Remove campaign
        return prev.filter(name => name !== campaignName);
      } else {
        // Add campaign (max 2)
        if (prev.length < 2) {
          return [...prev, campaignName];
        }
        return prev;
      }
    });
  };

  const filteredData = data.filter(campaign => selectedCampaigns.includes(campaign.name));

  return (
    <div className="campaign-analytics-card">
      {/* Header Section with Dropdown */}
      <div className="campaign-header-section">
        <div className="campaign-title-section">
          <h3 className="campaign-title">Campaign Performance</h3>
        </div>
        
        <div className="campaign-selector-section">
          <label className="selector-label">Select Campaigns (Max 2):</label>
          <div className="campaign-dropdown-container">
            <div className="dropdown-trigger">
              <span className="selected-count">
                {selectedCampaigns.length === 0 
                  ? 'Select Campaigns' 
                  : `${selectedCampaigns.length}/2 selected`
                }
              </span>
              <span className="dropdown-arrow">▼</span>
            </div>
            <div className="dropdown-menu-overlay">
              <div className="dropdown-menu">
                {data.map((campaign) => (
                  <label key={campaign.name} className="dropdown-item">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.includes(campaign.name)}
                      onChange={() => handleCampaignToggle(campaign.name)}
                      disabled={!selectedCampaigns.includes(campaign.name) && selectedCampaigns.length >= 2}
                    />
                    <span className="campaign-option">
                      <span className="campaign-name">{campaign.name}</span>
                      <span className="campaign-status" style={{ backgroundColor: getStatusColor(campaign.status) }}>
                        {campaign.status}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Campaign List Section */}
      <div className="campaign-content-section">
        <div className="campaign-list">
          {filteredData.map((campaign, index) => (
            <div key={index} className="campaign-item">
              <div className="campaign-item-header">
                <div className="campaign-item-info">
                  <h4 className="campaign-item-name">{campaign.name}</h4>
                  <div className="campaign-item-status">
                    <span 
                      className="status-dot" 
                      style={{ backgroundColor: getStatusColor(campaign.status) }}
                    ></span>
                    <span className="status-text">{campaign.status}</span>
                  </div>
                </div>
                <div className="campaign-item-roi">
                  <span className="roi-label">ROI</span>
                  <span className="roi-value">{campaign.roi}x</span>
                </div>
              </div>
              
              <div className="campaign-progress-section">
                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Budget</span>
                    <span className="progress-value">{formatCurrency(campaign.budget)}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill budget-fill"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
                
                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Spent</span>
                    <span className="progress-value">{formatCurrency(campaign.spent)}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill spent-fill"
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="campaign-summary-section">
        <div className="summary-item">
          <span className="summary-label">Total Budget</span>
          <span className="summary-value">
            {formatCurrency(filteredData.reduce((sum, d) => sum + d.budget, 0))}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Spent</span>
          <span className="summary-value">
            {formatCurrency(filteredData.reduce((sum, d) => sum + d.spent, 0))}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Avg ROI</span>
          <span className="summary-value">
            {filteredData.length > 0 ? (filteredData.reduce((sum, d) => sum + d.roi, 0) / filteredData.length).toFixed(1) : '0.0'}x
          </span>
        </div>
      </div>
    </div>
  );
};

CampaignAnalytics.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    budget: PropTypes.number.isRequired,
    spent: PropTypes.number.isRequired,
    roi: PropTypes.number.isRequired
  })).isRequired
};

export default CampaignAnalytics; 