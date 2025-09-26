import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../../auth/components/AuthContext';
import './CampaignSelectionModal.css';
import { API_CONFIG } from '../../../../shared/config/config.js';

/**
 * Campaign Selection Modal Component
 * 
 * Displays a modal with active campaigns for influencer assignment.
 * Shows campaign details and allows selection via radio buttons.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.onSelect - Callback when a campaign is selected
 * @param {Object} props.influencer - The influencer being assigned
 * @returns {JSX.Element} CampaignSelectionModal component
 */
const CampaignSelectionModal = ({ isOpen, onClose, onSelect, influencer, selectedInfluencerIds = [] }) => {
  const { user } = useAuth(); // Get current logged-in user/brand
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [error, setError] = useState(null);
  const [influencerRequests, setInfluencerRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Fetch active campaigns and influencer requests when modal opens
  useEffect(() => {
    if (isOpen && influencer) {
      fetchActiveCampaigns();
      fetchInfluencerRequests();
    }
  }, [isOpen, influencer]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCampaign(null);
      setError(null);
    }
  }, [isOpen]);

  /**
   * Fetch active campaigns from the API (only for current brand)
   */
  const fetchActiveCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current brand name from auth context
      const brandName = user?.brandName || user?.company_name || 'appraise media'; // fallback for testing
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/campaigns?status=active&brandName=${encodeURIComponent(brandName)}`);
      const result = await response.json();
      
      if (result.success) {
        setCampaigns(result.data || []);
        console.log(`📋 Active campaigns loaded for brand "${brandName}":`, result.data?.length || 0);
      } else {
        setError('Failed to fetch campaigns');
        console.error('Failed to fetch campaigns:', result.message);
      }
    } catch (error) {
      setError('Error loading campaigns');
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch influencer's existing collaboration requests
   */
  const fetchInfluencerRequests = async () => {
    try {
      setLoadingRequests(true);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/collaboration-requests?userType=influencer&userId=${influencer.id}&filter=received`);
      const result = await response.json();
      
      if (result.success) {
        setInfluencerRequests(result.data.requests || []);
      } else {
        console.error('Failed to fetch influencer requests:', result.message);
      }
    } catch (error) {
      console.error('Error fetching influencer requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  /**
   * Handle campaign selection
   * @param {Object} campaign - Selected campaign
   */
  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedCampaign) {
      setError('Please select a campaign');
      return;
    }

    // Call the onSelect callback with the selected campaign
    onSelect(selectedCampaign, influencer);
    onClose();
  };

  /**
   * Get status color for campaign
   * @param {string} status - Campaign status
   * @returns {string} Color hex code
   */
  const getStatusColor = (status) => {
    switch (status) {
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

  /**
   * Check if a campaign is disabled for this influencer
   * @param {Object} campaign - Campaign object
   * @returns {Object} Object with isDisabled and reason
   */
  const getCampaignStatus = (campaign) => {
    // Check for existing collaboration requests
    const existingRequest = influencerRequests.find(request => 
      request.campaign_id === campaign.id && 
      request.request_type === 'campaign_assignment'
    );

    if (existingRequest) {
      return {
        isDisabled: true,
        reason: existingRequest.status === 'pending' 
          ? 'Request already sent' 
          : existingRequest.status === 'accepted' 
            ? 'Already assigned to this campaign'
            : 'Request was rejected'
      };
    }

    // Check if influencer is already selected (in the selected list)
    if (selectedInfluencerIds.includes(influencer.id)) {
      return {
        isDisabled: true,
        reason: 'Influencer already selected'
      };
    }
    
    return { isDisabled: false, reason: null };
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
    <div className="campaign-selection-modal-overlay" onClick={onClose}>
      <div className="campaign-selection-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="campaign-selection-modal__header">
          <h2 className="campaign-selection-modal__title">
            Select Campaign for {influencer?.name}
          </h2>
          <button 
            className="campaign-selection-modal__close"
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
        <div className="campaign-selection-modal__content">
          {loading ? (
            <div className="campaign-selection-modal__loading">
              <div className="campaign-selection-modal__loading-spinner"></div>
              <p>Loading active campaigns...</p>
            </div>
          ) : error ? (
            <div className="campaign-selection-modal__error">
              <div className="campaign-selection-modal__error-icon">⚠️</div>
              <p>{error}</p>
              <button 
                className="campaign-selection-modal__retry"
                onClick={fetchActiveCampaigns}
              >
                Try Again
              </button>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="campaign-selection-modal__empty">
              <div className="campaign-selection-modal__empty-icon">📋</div>
              <h3>No Active Campaigns</h3>
              <p>You haven't created any active campaigns yet. Please create a campaign first to assign influencers.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="campaign-selection-modal__form">
              <div className="campaign-selection-modal__campaigns">
                {campaigns.map((campaign) => {
                  const { isDisabled, reason } = getCampaignStatus(campaign);
                  
                  return (
                    <label 
                      key={campaign.id} 
                      className={`campaign-selection-modal__campaign ${
                        selectedCampaign?.id === campaign.id ? 'campaign-selection-modal__campaign--selected' : ''
                      } ${isDisabled ? 'campaign-selection-modal__campaign--disabled' : ''}`}
                    >
                      <input
                        type="radio"
                        name="campaign"
                        value={campaign.id}
                        checked={selectedCampaign?.id === campaign.id}
                        onChange={() => !isDisabled && handleCampaignSelect(campaign)}
                        disabled={isDisabled}
                        className="campaign-selection-modal__radio"
                      />
                      <div className="campaign-selection-modal__campaign-content">
                        <div className="campaign-selection-modal__campaign-header">
                          <h3 className="campaign-selection-modal__campaign-name">
                            {campaign.campaign_name}
                          </h3>
                          <span 
                            className="campaign-selection-modal__campaign-status"
                            style={{ backgroundColor: getStatusColor(campaign.status) }}
                          >
                            {campaign.status}
                          </span>
                        </div>
                        
                        <div className="campaign-selection-modal__campaign-details">
                          <div className="campaign-selection-modal__campaign-brand">
                            <strong>Brand:</strong> {campaign.brand_name}
                          </div>
                          
                          {campaign.platform && (
                            <div className="campaign-selection-modal__campaign-platform">
                              <strong>Platform:</strong> {campaign.platform}
                            </div>
                          )}
                          
                          {campaign.vertical && (
                            <div className="campaign-selection-modal__campaign-vertical">
                              <strong>Vertical:</strong> {campaign.vertical}
                            </div>
                          )}
                          
                          <div className="campaign-selection-modal__campaign-dates">
                            <div>
                              <strong>Start:</strong> {formatDate(campaign.start_date)}
                            </div>
                            <div>
                              <strong>End:</strong> {formatDate(campaign.end_date)}
                            </div>
                          </div>
                          
                          {campaign.offer_description && (
                            <div className="campaign-selection-modal__campaign-description">
                              <strong>Description:</strong> {campaign.offer_description}
                            </div>
                          )}
                          
                          {/* Show disabled reason if campaign is disabled */}
                          {isDisabled && reason && (
                            <div className="campaign-selection-modal__campaign-disabled-reason">
                              <span className="campaign-selection-modal__disabled-icon">⚠️</span>
                              <span className="campaign-selection-modal__disabled-text">{reason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Error Message */}
              {error && (
                <div className="campaign-selection-modal__form-error">
                  {error}
                </div>
              )}

              {/* Form Actions */}
              <div className="campaign-selection-modal__actions">
                <button 
                  type="button" 
                  className="campaign-selection-modal__cancel"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="campaign-selection-modal__confirm"
                  disabled={!selectedCampaign}
                >
                  Assign & Create Email
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking and documentation
CampaignSelectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
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
  }).isRequired,
  selectedInfluencerIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
};

export default CampaignSelectionModal; 