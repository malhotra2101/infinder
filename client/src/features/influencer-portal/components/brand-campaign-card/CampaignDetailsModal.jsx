import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './CampaignDetailsModal.css';

/**
 * CampaignDetailsModal Component
 * 
 * Displays campaign details in a modal overlay.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {Object} props.brand - Brand data object
 * @param {Array} props.campaigns - Array of campaign objects
 * @param {Object} props.selectedCampaign - Currently selected campaign
 * @param {Function} props.onCampaignSelect - Callback for campaign selection
 * @param {Function} props.onApply - Callback for apply action
 * @returns {JSX.Element} CampaignDetailsModal component
 */
const CampaignDetailsModal = ({ 
  isOpen, 
  onClose, 
  brand, 
  campaigns, 
  selectedCampaign, 
  onCampaignSelect, 
  onApply,
  isCampaignApplied,
  getCampaignStatus,
  getCooldownInfo,
  checkCooldownStatus
}) => {
  const [cooldownTimers, setCooldownTimers] = useState({});

  // Check cooldown status when modal opens
  useEffect(() => {
    if (isOpen) {
      campaigns.forEach(async (campaign) => {
        const cooldownInfo = getCooldownInfo(campaign.id, brand.id);
        if (!cooldownInfo) {
          // Check with backend if not in local state
          const backendCooldown = await checkCooldownStatus(campaign.id, brand.id);
          if (backendCooldown) {
            setCooldownTimers(prev => ({
              ...prev,
              [campaign.id]: backendCooldown
            }));
          }
        } else {
          setCooldownTimers(prev => ({
            ...prev,
            [campaign.id]: cooldownInfo
          }));
        }
      });
    }
  }, [isOpen, campaigns, brand.id, getCooldownInfo, checkCooldownStatus]);

  // Update countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldownTimers(prev => {
        const updated = {};
        let hasActiveTimers = false;
        
        Object.keys(prev).forEach(campaignId => {
          const timer = prev[campaignId];
          const timeLeft = Math.max(0, timer.timeLeftMs - 1000);
          
          if (timeLeft > 0) {
            hasActiveTimers = true;
            updated[campaignId] = {
              ...timer,
              timeLeftMs: timeLeft,
              secondsLeft: Math.ceil(timeLeft / 1000)
            };
          }
        });
        
        if (!hasActiveTimers) {
          clearInterval(interval);
        }
        
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time remaining
  const formatTimeRemaining = (timeLeftMs) => {
    const seconds = Math.ceil(timeLeftMs / 1000);
    return `${seconds}s`;
  };
  if (!isOpen) return null;

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

  // Get brand logo placeholder
  const getBrandLogo = (brandName) => {
    if (brand.logo_url) {
      return brand.logo_url;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(brandName)}&background=3b82f6&color=fff&size=64`;
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle apply
  const handleApply = () => {
    if (selectedCampaign) {
      onApply(selectedCampaign);
      onClose();
    }
  };

  return (
    <div className="campaign-details-modal__backdrop" onClick={handleBackdropClick}>
      <div className="campaign-details-modal">
        {/* Modal Header */}
        <div className="campaign-details-modal__header">
          <div className="campaign-details-modal__brand-info">
            <div className="campaign-details-modal__logo">
              <img 
                src={getBrandLogo(brand.name)} 
                alt={`${brand.name} logo`}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&background=3b82f6&color=fff&size=64`;
                }}
              />
            </div>
            <div className="campaign-details-modal__brand-details">
              <h2 className="campaign-details-modal__brand-name">{brand.name}</h2>
              <p className="campaign-details-modal__brand-industry">{brand.industry || 'General'}</p>
            </div>
          </div>
          <button
            className="campaign-details-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="campaign-details-modal__content">
          <div className="campaign-details-modal__campaigns">
            <h3 className="campaign-details-modal__section-title">
              Available Campaigns ({campaigns.length})
            </h3>
            
            {campaigns.map((campaign) => {
              const campaignStatus = getCampaignStatus(campaign.id);
              const isApplied = campaignStatus === 'selected' || campaignStatus === 'pending';
              const cooldownTimer = cooldownTimers[campaign.id];
              const isInCooldown = cooldownTimer && cooldownTimer.timeLeftMs > 0;
              const isDisabled = isApplied || isInCooldown;
              
              return (
                <div 
                  key={campaign.id} 
                  className={`campaign-details-modal__campaign ${selectedCampaign?.id === campaign.id ? 'campaign-details-modal__campaign--selected' : ''} ${isApplied ? 'campaign-details-modal__campaign--applied' : ''} ${isInCooldown ? 'campaign-details-modal__campaign--cooldown' : ''}`}
                  onClick={() => !isDisabled && onCampaignSelect(campaign)}
                >
                <div className="campaign-details-modal__campaign-header">
                  <h4 className="campaign-details-modal__campaign-name">{campaign.campaign_name}</h4>
                  <div className="campaign-details-modal__campaign-status-group">
                    <span 
                      className="campaign-details-modal__campaign-status"
                      style={{ backgroundColor: getStatusColor(campaign.status) }}
                    >
                      {campaign.status}
                    </span>
                    {campaignStatus === 'selected' && (
                      <span className="campaign-details-modal__campaign-selected-status">
                        ✅ Already Selected
                      </span>
                    )}
                    {campaignStatus === 'pending' && (
                      <span className="campaign-details-modal__campaign-pending-status">
                        📤 Request Pending
                      </span>
                    )}
                    {isInCooldown && (
                      <span className="campaign-details-modal__campaign-cooldown-status">
                        ⏰ Cooldown: {formatTimeRemaining(cooldownTimer.timeLeftMs)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="campaign-details-modal__campaign-details">
                  <div className="campaign-details-modal__campaign-meta">
                    <div className="campaign-details-modal__campaign-platform">
                      {platformIcons[campaign.platform?.toLowerCase()] || '📱'} {campaign.platform}
                    </div>
                    {campaign.vertical && (
                      <div className="campaign-details-modal__campaign-vertical">
                        📊 {campaign.vertical}
                      </div>
                    )}
                  </div>
                  
                  {campaign.offer_description && (
                    <p className="campaign-details-modal__campaign-description">
                      {campaign.offer_description}
                    </p>
                  )}
                  
                  <div className="campaign-details-modal__campaign-dates">
                    {campaign.start_date && (
                      <span className="campaign-details-modal__campaign-date">
                        📅 Start: {new Date(campaign.start_date).toLocaleDateString()}
                      </span>
                    )}
                    {campaign.end_date && (
                      <span className="campaign-details-modal__campaign-date">
                        📅 End: {new Date(campaign.end_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {campaign.kpi && (
                    <div className="campaign-details-modal__campaign-kpi">
                      🎯 KPI: {campaign.kpi}
                    </div>
                  )}

                  {campaign.restrictions && (
                    <div className="campaign-details-modal__campaign-restrictions">
                      ⚠️ Restrictions: {campaign.restrictions}
                    </div>
                  )}
                </div>
              </div>
            );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="campaign-details-modal__footer">
          <button
            className="campaign-details-modal__apply-btn"
            onClick={handleApply}
            disabled={!selectedCampaign || isCampaignApplied(selectedCampaign?.id) || (cooldownTimers[selectedCampaign?.id] && cooldownTimers[selectedCampaign.id].timeLeftMs > 0)}
          >
            {!selectedCampaign ? 'Select a campaign to apply' : 
             getCampaignStatus(selectedCampaign.id) === 'selected' ? 'Already Selected' : 
             getCampaignStatus(selectedCampaign.id) === 'pending' ? 'Request Already Sent' : 
             (cooldownTimers[selectedCampaign.id] && cooldownTimers[selectedCampaign.id].timeLeftMs > 0) ? 
             `Cooldown: ${formatTimeRemaining(cooldownTimers[selectedCampaign.id].timeLeftMs)}` :
             `Apply to ${selectedCampaign.campaign_name}`}
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking
CampaignDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
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
  selectedCampaign: PropTypes.object,
  onCampaignSelect: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  isCampaignApplied: PropTypes.func.isRequired,
  getCampaignStatus: PropTypes.func.isRequired,
  getCooldownInfo: PropTypes.func.isRequired,
  checkCooldownStatus: PropTypes.func.isRequired
};

export default CampaignDetailsModal; 