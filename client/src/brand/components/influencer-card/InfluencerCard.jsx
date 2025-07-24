import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addToList } from '../../../shared/services/backendApi.js';
import './InfluencerCard.css';

/**
 * Compact InfluencerCard Component
 * 
 * Displays essential influencer information with minimal UI,
 * focusing on key metrics and actions.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.influencer - Influencer data object
 * @param {Function} props.onAction - Callback for card actions
 * @param {bool} props.isSelected - Indicates if the influencer is already selected
 * @param {string} props.activeTab - Indicates the active tab
 * @param {Object} props.collaborationStatus - Collaboration status information
 * @returns {JSX.Element} InfluencerCard component
 */
const InfluencerCard = ({ influencer, onAction, isSelected = false, activeTab = 'all', collaborationStatus = null, requestType = 'sent' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Platform icons mapping
  const platformIcons = {
    instagram: '📷',
    tiktok: '🎵',
    youtube: '📺',
    twitter: '🐦',
    linkedin: '💼',
    facebook: '📘'
  };

  // Get country flag emoji
  const getCountryFlag = (country) => {
    if (!country) return '';
    
    // Simple country code to flag emoji mapping
    const countryFlags = {
      'US': '🇺🇸',
      'UK': '🇬🇧',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'ES': '🇪🇸',
      'IT': '🇮🇹',
      'JP': '🇯🇵',
      'KR': '🇰🇷',
      'IN': '🇮🇳',
      'BR': '🇧🇷',
      'MX': '🇲🇽',
      'AR': '🇦🇷',
      'ZA': '🇿🇦',
      'NG': '🇳🇬',
      'EG': '🇪🇬',
      'KE': '🇰🇪',
      'MA': '🇲🇦',
      'TN': '🇹🇳'
    };
    
    return countryFlags[country.toUpperCase()] || '🌍';
  };

  // Get collaboration status for this influencer
  const getCollaborationStatus = () => {
    if (!collaborationStatus || !collaborationStatus[influencer.id]) {
      return null;
    }
    return collaborationStatus[influencer.id];
  };



  // Get all status indicators for this influencer
  const getStatusIndicators = () => {
    const indicators = [];
    
    // Only show indicators in 'all' tab
    if (activeTab !== 'all') {
      return indicators;
    }
    
    // Show green tick when influencer is selected
    if (isSelected) {
      indicators.push({
        type: 'selected',
        color: '#10B981',
        icon: '✓',
        tooltip: 'Selected for campaign'
      });
    }
    
    // Show pending indicator when there's a pending collaboration request
    const collabStatus = getCollaborationStatus();
    if (collabStatus && collabStatus.status === 'pending') {
      indicators.push({
        type: 'pending',
        color: '#F59E0B',
        icon: '⏳',
        tooltip: `Pending collaboration request: ${collabStatus.campaignName}`
      });
    }
    
    // Show accepted indicator when there's an accepted collaboration request
    if (collabStatus && collabStatus.status === 'accepted') {
      indicators.push({
        type: 'accepted',
        color: '#10B981',
        icon: '✓',
        tooltip: `Accepted collaboration: ${collabStatus.campaignName}`
      });
    }
    

    return indicators;
  };

  // Get engagement color class
  const getEngagementColor = (engagementRate) => {
    if (engagementRate >= 5) return 'high';
    if (engagementRate >= 2) return 'medium';
    return 'low';
  };

  // Format follower count
  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
  };

  // Handle add to list action
  const handleAddToList = async (listType) => {
    // If we're in the 'all' tab, trigger campaign selection
    if (activeTab === 'all') {
      onAction('showCampaignModal', { influencer });
      return;
    }

    try {
      setIsLoading(true);
      onAction('added', { influencer, listType });
    } catch (error) {
      console.error('Error adding to list:', error);
      onAction('error', { influencer, error: 'Failed to add to list' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="influencer-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status indicators at top-right corner - only show in 'all' tab */}
      {activeTab === 'all' && getStatusIndicators().length > 0 && (
        <div className="influencer-card__status-indicators">
          {getStatusIndicators().map((indicator, index) => (
            <div
              key={`${indicator.type}-${index}`}
              className={`influencer-card__status-indicator influencer-card__status-indicator--${indicator.type}`}
              style={{ backgroundColor: indicator.color }}
              title={indicator.tooltip}
            >
              {indicator.icon}
            </div>
          ))}
        </div>
      )}

      {/* Compact Profile Section */}
      <div className="influencer-card__profile">
        <div className="influencer-card__avatar">
          {influencer.avatar && influencer.avatar.trim() !== '' ? (
            <img 
              src={influencer.avatar} 
              alt={influencer.name}
              className="influencer-card__avatar-img"
              loading="lazy"
              onError={(e) => {
                // Use UI Avatars as fallback
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(influencer.name)}&background=6366f1&color=fff&size=48`;
                e.target.style.display = 'block';
                e.target.nextSibling.style.display = 'none';
              }}
            />
          ) : null}
          <div 
            className="influencer-card__avatar-placeholder"
            style={{ display: (influencer.avatar && influencer.avatar.trim() !== '') ? 'none' : 'flex' }}
          >
            {influencer.name.charAt(0)}
          </div>
        </div>
        
        <div className="influencer-card__info">
          <h3 className="influencer-card__name">
            {influencer.name}
            {influencer.country && (
              <span className="influencer-card__country">
                {getCountryFlag(influencer.country)}
              </span>
            )}
          </h3>
          <p className="influencer-card__category">{influencer.category}</p>
        </div>
      </div>

      {/* Compact Stats Row */}
      <div className="influencer-card__stats">
        <div className="influencer-card__stat">
          <span className="influencer-card__stat-label">Followers</span>
          <span className="influencer-card__stat-value">
            {formatFollowers(influencer.followers)}
          </span>
        </div>
        
        <div className="influencer-card__stat">
          <span className="influencer-card__stat-label">Engagement</span>
          <span className={`influencer-card__stat-value influencer-card__stat-value--${getEngagementColor(influencer.engagement_rate)}`}>
            {influencer.engagement_rate}%
          </span>
        </div>
        
        <div className="influencer-card__stat">
          <span className="influencer-card__stat-label">Platform</span>
          <span className="influencer-card__stat-value">
            {platformIcons[influencer.platform?.toLowerCase()] || '📱'} {influencer.platform}
          </span>
        </div>
      </div>

      {/* Campaign Information for Received Requests */}
      {activeTab === 'requests' && requestType === 'received' && influencer.campaign && (
        <div className="influencer-card__campaign-info">
          <div className="influencer-card__campaign-header">
            <span className="influencer-card__campaign-label">Campaign Request</span>
            <span className={`influencer-card__campaign-status influencer-card__campaign-status--${influencer.request_status}`}>
              {influencer.request_status}
            </span>
          </div>
          <div className="influencer-card__campaign-details">
            <h4 className="influencer-card__campaign-name">
              {influencer.campaign.campaign_name || 'Campaign Assignment'}
            </h4>
            {influencer.campaign.brand_name && (
              <p className="influencer-card__campaign-brand">
                Brand: {influencer.campaign.brand_name}
              </p>
            )}
            {influencer.campaign.platform && (
              <p className="influencer-card__campaign-platform">
                Platform: {influencer.campaign.platform}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Campaign Information for Sent Requests */}
      {activeTab === 'requests' && requestType === 'sent' && influencer.campaign && (
        <div className="influencer-card__campaign-info">
          <div className="influencer-card__campaign-header">
            <span className="influencer-card__campaign-label">
              {influencer.all_requests && influencer.all_requests.length > 1 
                ? `Campaign Requests (${influencer.all_requests.length})` 
                : 'Campaign Request'
              }
            </span>
            <span className={`influencer-card__campaign-status influencer-card__campaign-status--${influencer.request_status}`}>
              {influencer.request_status}
            </span>
          </div>
          <div className="influencer-card__campaign-details">
            <h4 className="influencer-card__campaign-name">
              {influencer.campaign.campaign_name || 'Campaign Assignment'}
              {influencer.all_requests && influencer.all_requests.length > 1 && (
                <span className="influencer-card__campaign-count">
                  +{influencer.all_requests.length - 1} more
                </span>
              )}
            </h4>
            {influencer.campaign.brand_name && (
              <p className="influencer-card__campaign-brand">
                Brand: {influencer.campaign.brand_name}
              </p>
            )}
            {influencer.campaign.platform && (
              <p className="influencer-card__campaign-platform">
                Platform: {influencer.campaign.platform}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={`influencer-card__actions ${activeTab === 'all' ? 'influencer-card__actions--single' : ''}`}>
        {activeTab === 'selected' ? (
          <>
            <button
              className="influencer-card__action influencer-card__action--view-details"
              onClick={() => onAction('viewDetails', { influencer })}
              disabled={isLoading}
              aria-label="View campaign details"
            >
              <svg className="influencer-card__action-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              View Details
            </button>

            <button
              className="influencer-card__action influencer-card__action--remove"
              onClick={() => onAction('remove', { influencer })}
              disabled={isLoading}
              aria-label="Remove from campaigns"
            >
              <svg className="influencer-card__action-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Remove
            </button>
          </>
        ) : activeTab === 'requests' && requestType === 'received' && influencer.request_status === 'pending' ? (
          <>
            <button
              className="influencer-card__action influencer-card__action--accept"
              onClick={() => onAction('acceptRequest', { 
                requestId: influencer.request_id, 
                influencer 
              })}
              disabled={isLoading}
              aria-label="Accept request"
            >
              <svg className="influencer-card__action-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Accept
            </button>
            
            <button
              className="influencer-card__action influencer-card__action--reject"
              onClick={() => onAction('rejectRequest', { 
                requestId: influencer.request_id, 
                influencer 
              })}
              disabled={isLoading}
              aria-label="Reject request"
            >
              <svg className="influencer-card__action-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
              Reject
            </button>
          </>
        ) : activeTab === 'requests' && requestType === 'sent' ? (
          <>
            <button
              className="influencer-card__action influencer-card__action--view-details"
              onClick={() => onAction('viewDetails', { influencer })}
              disabled={isLoading}
              aria-label="View campaign details"
            >
              <svg className="influencer-card__action-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              View Details
            </button>

            <button
              className="influencer-card__action influencer-card__action--withdraw"
              onClick={() => {
                // Check if influencer has multiple requests
                if (influencer.all_requests && influencer.all_requests.length > 1) {
                  onAction('showWithdrawModal', { influencer });
                } else {
                  onAction('withdrawRequest', { 
                    requestId: influencer.request_id, 
                    influencer 
                  });
                }
              }}
              disabled={isLoading}
              aria-label="Withdraw request"
            >
              <svg className="influencer-card__action-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
              Withdraw
            </button>
          </>
        ) : (
          <>
            <button
              className={`influencer-card__action influencer-card__action--select ${isSelected ? 'influencer-card__action--selected' : ''}`}
              onClick={() => handleAddToList('selected')}
              disabled={isLoading}
              aria-label="Add to selected list"
            >
              {isSelected ? (
                <>
                  <svg className="influencer-card__action-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Selected
                </>
              ) : (
                <>
                  <svg className="influencer-card__action-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Select
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="influencer-card__loading">
          <div className="influencer-card__loading-spinner"></div>
          <span className="influencer-card__loading-text">Processing...</span>
        </div>
      )}
    </div>
  );
};

// PropTypes for type checking and documentation
InfluencerCard.propTypes = {
  influencer: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    bio: PropTypes.string,
    category: PropTypes.string,
    platform: PropTypes.string,
    followers: PropTypes.number,
    engagement_rate: PropTypes.number,
    country: PropTypes.string,
    // Request-specific properties
    request_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    request_status: PropTypes.string,
    request_type: PropTypes.string,
    request_direction: PropTypes.string,
    campaign: PropTypes.object
  }).isRequired,
  onAction: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  activeTab: PropTypes.string,
  collaborationStatus: PropTypes.object,
  requestType: PropTypes.oneOf(['sent', 'received'])
};



export default InfluencerCard; 