import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addToList } from '../../../../services/backendApi';
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
 * @param {bool} props.isRejected - Indicates if the influencer is already rejected
 * @param {string} props.activeTab - Indicates the active tab
 * @returns {JSX.Element} InfluencerCard component
 */
const InfluencerCard = ({ influencer, onAction, isSelected, isRejected, activeTab }) => {
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

  // Handle reject action
  const handleReject = () => {
    onAction('rejected', { influencer });
  };

  // Get engagement rate color
  const getEngagementColor = (rate) => {
    if (rate >= 5) return 'high';
    if (rate >= 2) return 'medium';
    return 'low';
  };

  // Get country flag emoji
  const getCountryFlag = (country) => {
    const flagEmojis = {
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Spain': '🇪🇸',
      'Italy': '🇮🇹',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'Colombia': '🇨🇴',
      'Peru': '🇵🇪',
      'Venezuela': '🇻🇪',
      'Ecuador': '🇪🇨',
      'Bolivia': '🇧🇴',
      'Paraguay': '🇵🇾',
      'Uruguay': '🇺🇾',
      'Guyana': '🇬🇾',
      'Suriname': '🇸🇷',
      'French Guiana': '🇬🇫'
    };
    return flagEmojis[country] || '🌍';
  };

  return (
    <div 
      className={`influencer-card ${isSelected ? 'influencer-card--selected' : ''} ${isRejected ? 'influencer-card--rejected' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Compact Profile Section */}
      <div className="influencer-card__profile">
        <div className="influencer-card__avatar">
          {influencer.avatar ? (
            <img 
              src={influencer.avatar} 
              alt={influencer.name}
              className="influencer-card__avatar-img"
              loading="lazy"
            />
          ) : (
            <div className="influencer-card__avatar-placeholder">
              {influencer.name.charAt(0)}
            </div>
          )}
          {/* Status indicator */}
          {(isSelected || isRejected) && (
            <div className={`influencer-card__status influencer-card__status--${isSelected ? 'selected' : 'rejected'}`}>
              {isSelected ? '✓' : '✕'}
            </div>
          )}
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
      </div>

      {/* Compact Platform Section */}
      {influencer.platform && (
        <div className="influencer-card__platform">
          <span className="influencer-card__platform-icon">
            {platformIcons[influencer.platform.toLowerCase()] || '📱'}
          </span>
          <span className="influencer-card__platform-name">
            {influencer.platform}
          </span>
        </div>
      )}

      {/* Compact Action Buttons */}
      <div className="influencer-card__actions">
        <button
          className={`influencer-card__action influencer-card__action--select ${isSelected ? 'influencer-card__action--selected' : ''}`}
          onClick={() => handleAddToList('selected')}
          disabled={isLoading || isSelected}
          aria-label="Add to selected list"
        >
          <svg className="influencer-card__action-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          {isSelected ? 'Selected' : 'Select'}
        </button>

        <button
          className={`influencer-card__action influencer-card__action--reject ${isRejected ? 'influencer-card__action--rejected' : ''}`}
          onClick={handleReject}
          disabled={isLoading || isRejected}
          aria-label="Reject influencer"
        >
          <svg className="influencer-card__action-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
          {isRejected ? 'Rejected' : 'Reject'}
        </button>
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
    recent_posts: PropTypes.arrayOf(PropTypes.shape({
      thumbnail: PropTypes.string,
      image: PropTypes.string
    }))
  }).isRequired,
  onAction: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  isRejected: PropTypes.bool,
  activeTab: PropTypes.string
};

export default InfluencerCard; 