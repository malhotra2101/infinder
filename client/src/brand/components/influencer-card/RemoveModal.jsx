import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './RemoveModal.css';

/**
 * Remove Modal Component
 * 
 * Allows users to select and remove influencers from specific campaigns.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.onRemove - Callback when campaigns are selected for removal
 * @param {Object} props.influencer - The influencer being removed
 * @returns {JSX.Element} RemoveModal component
 */
const RemoveModal = ({ isOpen, onClose, onRemove, influencer }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch campaigns for this influencer when modal opens
  useEffect(() => {
    if (isOpen && influencer) {
      fetchInfluencerCampaigns();
    }
  }, [isOpen, influencer]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCampaigns([]);
      setSelectedCampaigns([]);
      setError(null);
    }
  }, [isOpen]);

  /**
   * Fetch campaigns for this influencer
   */
  const fetchInfluencerCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch campaigns from influencer_lists for this influencer
      const response = await fetch(`http://localhost:5052/api/influencers/${influencer.id}/campaigns`);
      const result = await response.json();
      
      if (result.success) {
        // Filter out entries without campaign data (campaign_id is null)
        const validCampaigns = result.data.filter(item => item.campaign && item.campaignId);
        setCampaigns(validCampaigns);
        
        // If no valid campaigns found, show a message
        if (validCampaigns.length === 0) {
          setError('No campaign assignments found for this influencer');
        }
      } else {
        setError('Failed to fetch campaign details');
        console.error('Failed to fetch campaign details:', result.message);
      }
    } catch (error) {
      setError('Error loading campaign details');
      console.error('Error fetching campaign details:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle campaign selection
   * @param {string} campaignId - Campaign ID to toggle
   */
  const handleCampaignToggle = (campaignId) => {
    setSelectedCampaigns(prev => {
      if (prev.includes(campaignId)) {
        return prev.filter(id => id !== campaignId);
      } else {
        return [...prev, campaignId];
      }
    });
  };

  /**
   * Handle select all campaigns
   */
  const handleSelectAll = () => {
    if (selectedCampaigns.length === campaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(campaigns.map(campaign => campaign.campaignId));
    }
  };

  /**
   * Handle remove action
   */
  const handleRemove = async () => {
    if (selectedCampaigns.length === 0) {
      setError('Please select at least one campaign to remove');
      return;
    }

    try {
      setLoading(true);
      
      // Get the actual campaign IDs from the selected influencer_lists entries
      const selectedCampaignEntries = campaigns.filter(campaign => 
        selectedCampaigns.includes(campaign.campaignId)
      );
      const actualCampaignIds = selectedCampaignEntries.map(entry => entry.campaignId);
      
      // Use the new API endpoint for removing from multiple campaigns
      const response = await fetch('http://localhost:5052/api/influencers/lists/remove-campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          influencerId: influencer.id,
          campaignIds: actualCampaignIds // Send actual campaign IDs
        })
      });

      const result = await response.json();

      if (result.success) {
        // Call the parent's onRemove callback with the campaigns that were removed
        const campaignsToRemove = selectedCampaignEntries;
        
        onRemove(campaignsToRemove);
        onClose();
      } else {
        setError(result.message || 'Failed to remove influencer from campaigns');
      }
    } catch (error) {
      console.error('Error removing from campaigns:', error);
      setError('Error removing influencer from campaigns');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get status color for campaign
   * @param {string} status - Campaign status
   * @returns {string} Color hex code
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'accepted':
        return '#10B981';
      case 'rejected':
        return '#EF4444';
      case 'completed':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  /**
   * Format date for display
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="remove-modal-overlay" onClick={onClose}>
      <div className="remove-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="remove-modal__header">
          <h2 className="remove-modal__title">
            Remove {influencer?.name} from Campaigns
          </h2>
          <button 
            className="remove-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="remove-modal__content">
          {loading ? (
            <div className="remove-modal__loading">
              <div className="remove-modal__loading-spinner"></div>
              <p>Loading campaign details...</p>
            </div>
          ) : error ? (
            <div className="remove-modal__error">
              <div className="remove-modal__error-icon">⚠️</div>
              <p>{error}</p>
              <button 
                className="remove-modal__retry"
                onClick={fetchInfluencerCampaigns}
              >
                Try Again
              </button>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="remove-modal__empty">
              <div className="remove-modal__empty-icon">📋</div>
              <h3>No Campaigns Found</h3>
              <p>This influencer is not currently assigned to any campaigns.</p>
            </div>
          ) : (
            <>
              <div className="remove-modal__description">
                <p>Select the campaigns you want to remove this influencer from:</p>
              </div>

              {/* Select All Option */}
              <div className="remove-modal__select-all">
                <label className="remove-modal__select-all-label">
                  <input
                    type="checkbox"
                    checked={selectedCampaigns.length === campaigns.length && campaigns.length > 0}
                    onChange={handleSelectAll}
                    className="remove-modal__select-all-checkbox"
                  />
                  <span className="remove-modal__select-all-text">
                    Select All ({campaigns.length} campaigns)
                  </span>
                </label>
              </div>

              {/* Campaigns List */}
              <div className="remove-modal__campaigns">
                                {campaigns && campaigns.length > 0 && campaigns.map((campaign, index) => {
                  // Ensure campaign has required fields
                  if (!campaign || !campaign.campaignId) {
                    return null;
                  }
                  
                  return (
                    <label 
                      key={`${campaign.campaignId}-${campaign.listType}-${index}`} 
                      className={`remove-modal__campaign ${
                        selectedCampaigns.includes(campaign.campaignId) ? 'remove-modal__campaign--selected' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCampaigns.includes(campaign.campaignId)}
                        onChange={() => handleCampaignToggle(campaign.campaignId)}
                        className="remove-modal__campaign-checkbox"
                      />
                    
                    <div className="remove-modal__campaign-content">
                      <div className="remove-modal__campaign-header">
                        <h4 className="remove-modal__campaign-name">
                          {campaign.campaign?.campaign_name || 'Campaign Assignment'}
                        </h4>
                        <span 
                          className="remove-modal__campaign-status"
                          style={{ backgroundColor: getStatusColor(campaign.listType) }}
                        >
                          {campaign.listType}
                        </span>
                      </div>
                      
                      <div className="remove-modal__campaign-details">
                        <div className="remove-modal__campaign-brand">
                          <strong>Brand:</strong> {campaign.campaign?.brand_name || 'Unknown'}
                        </div>
                        
                        {campaign.campaign?.platform && (
                          <div className="remove-modal__campaign-platform">
                            <strong>Platform:</strong> {campaign.campaign.platform}
                          </div>
                        )}
                        
                        <div className="remove-modal__campaign-dates">
                          <div>
                            <strong>Start:</strong> {formatDate(campaign.campaign?.start_date)}
                          </div>
                          <div>
                            <strong>End:</strong> {formatDate(campaign.campaign?.end_date)}
                          </div>
                        </div>
                        
                        <div className="remove-modal__request-date">
                          <strong>Request Date:</strong> {formatDate(campaign.addedAt)}
                        </div>
                      </div>
                    </div>
                  </label>
                );
                })}
              </div>

              {/* Error Message */}
              {error && (
                <div className="remove-modal__form-error">
                  {error}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="remove-modal__footer">
          <button 
            className="remove-modal__cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="remove-modal__remove-button"
            onClick={handleRemove}
            disabled={selectedCampaigns.length === 0}
          >
            Remove from {selectedCampaigns.length} Campaign{selectedCampaigns.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking and documentation
RemoveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  influencer: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    bio: PropTypes.string,
    category: PropTypes.string,
    platform: PropTypes.string,
    followers: PropTypes.number,
    engagement_rate: PropTypes.number,
    country: PropTypes.string
  }).isRequired
};

export default RemoveModal; 