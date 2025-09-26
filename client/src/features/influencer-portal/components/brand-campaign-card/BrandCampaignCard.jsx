import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CampaignDetailsModal from './CampaignDetailsModal';
import './BrandCampaignCard.css';

/**
 * BrandCampaignCard Component
 * 
 * Displays a brand with its campaigns in a card format.
 * When clicked, it opens a modal to show detailed campaign information.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.brand - Brand data object
 * @param {Array} props.campaigns - Array of campaign objects
 * @param {Function} props.onApply - Callback for apply action
 * @returns {JSX.Element} BrandCampaignCard component
 */
const BrandCampaignCard = ({ brand, campaigns, onApply, isCampaignApplied, getCampaignStatus, getCooldownInfo, checkCooldownStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Platform icons mapping
  const platformIcons = {
    instagram: '📷',
    tiktok: '🎵',
    youtube: '📺',
    twitter: '🐦',
    linkedin: '💼',
    facebook: '📘'
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  // Handle card click
  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  // Handle campaign selection
  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
  };

  // Handle apply
  const handleApply = (campaign) => {
    onApply(campaign);
  };

  // Get brand logo placeholder
  const getBrandLogo = (brandName) => {
    if (brand.logo_url) {
      return brand.logo_url;
    }
    // Generate a placeholder based on brand name
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(brandName)}&background=3b82f6&color=fff&size=64`;
  };

  return (
    <>
      <div className="brand-campaign-card" onClick={handleCardClick}>
        {/* Card Header */}
        <div className="brand-campaign-card__header">
          <div className="brand-campaign-card__brand-info">
            <div className="brand-campaign-card__logo">
              <img 
                src={getBrandLogo(brand.name)} 
                alt={`${brand.name} logo`}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&background=3b82f6&color=fff&size=64`;
                }}
              />
            </div>
            <div className="brand-campaign-card__brand-details">
              <h3 className="brand-campaign-card__brand-name">{brand.name}</h3>
              <p className="brand-campaign-card__brand-industry">{brand.industry || 'General'}</p>
              <div className="brand-campaign-card__campaign-count">
                {campaigns.length} {campaigns.length === 1 ? 'campaign' : 'campaigns'} available
              </div>
            </div>
          </div>
          <div className="brand-campaign-card__view-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Campaign Preview */}
        <div className="brand-campaign-card__preview">
          <div className="brand-campaign-card__campaign-preview">
            {campaigns.slice(0, 2).map((campaign) => {
              const campaignStatus = getCampaignStatus(campaign.id);
              return (
                <div key={campaign.id} className="brand-campaign-card__preview-item">
                  <div className="brand-campaign-card__preview-header">
                    <span className="brand-campaign-card__preview-name">{campaign.campaign_name}</span>
                    <div className="brand-campaign-card__preview-status-group">
                      <span 
                        className="brand-campaign-card__preview-status"
                        style={{ backgroundColor: getStatusColor(campaign.status) }}
                      >
                        {campaign.status}
                      </span>
                      {campaignStatus === 'selected' && (
                        <span className="brand-campaign-card__preview-selected-status">
                          ✅ Selected
                        </span>
                      )}
                      {campaignStatus === 'pending' && (
                        <span className="brand-campaign-card__preview-pending-status">
                          📤 Pending
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="brand-campaign-card__preview-meta">
                    <span className="brand-campaign-card__preview-platform">
                      {platformIcons[campaign.platform?.toLowerCase()] || '📱'} {campaign.platform}
                    </span>
                    {campaign.vertical && (
                      <span className="brand-campaign-card__preview-vertical">
                        📊 {campaign.vertical}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {campaigns.length > 2 && (
              <div className="brand-campaign-card__preview-more">
                +{campaigns.length - 2} more campaigns
              </div>
            )}
          </div>
        </div>

        {/* View Details Button */}
        <div className="brand-campaign-card__actions">
          <button className="brand-campaign-card__view-btn">
            View Details
          </button>
        </div>
      </div>

      {/* Campaign Details Modal */}
      <CampaignDetailsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        brand={brand}
        campaigns={campaigns}
        selectedCampaign={selectedCampaign}
        onCampaignSelect={handleCampaignSelect}
        onApply={handleApply}
        isCampaignApplied={isCampaignApplied}
        getCampaignStatus={getCampaignStatus}
        getCooldownInfo={getCooldownInfo}
        checkCooldownStatus={checkCooldownStatus}
      />
    </>
  );
};

// PropTypes for type checking
BrandCampaignCard.propTypes = {
  brand: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    industry: PropTypes.string,
    logo_url: PropTypes.string,
    description: PropTypes.string
  }).isRequired,
  campaigns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      campaign_name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      platform: PropTypes.string,
      vertical: PropTypes.string,
      offer_description: PropTypes.string,
      kpi: PropTypes.string,
      restrictions: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string
    })
  ).isRequired,
  onApply: PropTypes.func.isRequired,
  isCampaignApplied: PropTypes.func.isRequired,
  getCampaignStatus: PropTypes.func.isRequired,
  getCooldownInfo: PropTypes.func.isRequired,
  checkCooldownStatus: PropTypes.func.isRequired
};

export default BrandCampaignCard; 