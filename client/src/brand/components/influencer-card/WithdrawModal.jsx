import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './WithdrawModal.css';

/**
 * Withdraw Modal Component
 * 
 * Allows users to select and withdraw requests from specific campaigns.
 * Shows only the campaigns the influencer is requested for.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.onWithdraw - Callback when campaigns are selected for withdrawal
 * @param {Object} props.influencer - The influencer being withdrawn
 * @returns {JSX.Element} WithdrawModal component
 */
const WithdrawModal = ({ isOpen, onClose, onWithdraw, influencer }) => {
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
      
      // If influencer has all_requests (from sent requests tab), use those
      if (influencer.all_requests && influencer.all_requests.length > 0) {
        setCampaigns(influencer.all_requests);
        setLoading(false);
        return;
      }
      
      // Otherwise, fetch collaboration requests for this influencer
      const response = await fetch(`http://localhost:5052/api/collaboration-requests?userType=influencer&userId=${influencer.id}&filter=sent`);
      const result = await response.json();
      
      if (result.success) {
        const requests = result.data.requests || [];
        // Filter for pending and accepted requests (sent requests)
        const sentRequests = requests.filter(request => 
          (request.status === 'pending' || request.status === 'accepted') && 
          request.request_type === 'campaign_assignment'
        );
        setCampaigns(sentRequests);
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
      setSelectedCampaigns(campaigns.map(campaign => campaign.id));
    }
  };

  /**
   * Handle withdraw action
   */
  const handleWithdraw = () => {
    if (selectedCampaigns.length === 0) {
      setError('Please select at least one campaign to withdraw');
      return;
    }

    const campaignsToWithdraw = campaigns.filter(campaign => 
      selectedCampaigns.includes(campaign.id)
    );

    onWithdraw(campaignsToWithdraw);
    onClose();
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
    <div className="withdraw-modal-overlay" onClick={onClose}>
      <div className="withdraw-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="withdraw-modal__header">
          <h2 className="withdraw-modal__title">
            Withdraw Requests for {influencer?.name}
          </h2>
          <button 
            className="withdraw-modal__close"
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
        <div className="withdraw-modal__content">
          {loading ? (
            <div className="withdraw-modal__loading">
              <div className="withdraw-modal__loading-spinner"></div>
              <p>Loading campaign details...</p>
            </div>
          ) : error ? (
            <div className="withdraw-modal__error">
              <div className="withdraw-modal__error-icon">⚠️</div>
              <p>{error}</p>
              <button 
                className="withdraw-modal__retry"
                onClick={fetchInfluencerCampaigns}
              >
                Try Again
              </button>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="withdraw-modal__empty">
              <div className="withdraw-modal__empty-icon">📋</div>
              <h3>No Requests Found</h3>
              <p>This influencer has no pending or accepted requests to withdraw.</p>
            </div>
          ) : (
            <>
              {/* Select All Option */}
              <div className="withdraw-modal__select-all">
                <label className="withdraw-modal__select-all-label">
                  <input
                    type="checkbox"
                    checked={selectedCampaigns.length === campaigns.length && campaigns.length > 0}
                    onChange={handleSelectAll}
                    className="withdraw-modal__select-all-checkbox"
                  />
                  <span className="withdraw-modal__select-all-text">
                    Select All ({campaigns.length} campaigns)
                  </span>
                </label>
              </div>

              {/* Campaigns List */}
              <div className="withdraw-modal__campaigns">
                {campaigns.map((campaign) => (
                  <label 
                    key={campaign.id} 
                    className={`withdraw-modal__campaign ${
                      selectedCampaigns.includes(campaign.id) ? 'withdraw-modal__campaign--selected' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.includes(campaign.id)}
                      onChange={() => handleCampaignToggle(campaign.id)}
                      className="withdraw-modal__campaign-checkbox"
                    />
                    
                    <div className="withdraw-modal__campaign-content">
                      <div className="withdraw-modal__campaign-header">
                        <h4 className="withdraw-modal__campaign-name">
                          {campaign.campaign?.campaign_name || 'Campaign Assignment'}
                        </h4>
                        <span 
                          className="withdraw-modal__campaign-status"
                          style={{ backgroundColor: getStatusColor(campaign.status) }}
                        >
                          {campaign.status}
                        </span>
                      </div>
                      
                      <div className="withdraw-modal__campaign-details">
                        <div className="withdraw-modal__campaign-info">
                          <div className="withdraw-modal__campaign-date">
                            <strong>Request Date:</strong> {formatDate(campaign.created_at)}
                          </div>
                          
                          {campaign.message && (
                            <div className="withdraw-modal__campaign-message">
                              <strong>Message:</strong> {campaign.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="withdraw-modal__footer">
          <button 
            className="withdraw-modal__cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="withdraw-modal__withdraw-button"
            onClick={handleWithdraw}
            disabled={selectedCampaigns.length === 0}
          >
            Withdraw from {selectedCampaigns.length} Campaign{selectedCampaigns.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking and documentation
WithdrawModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onWithdraw: PropTypes.func.isRequired,
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
    all_requests: PropTypes.array
  }).isRequired
};

export default WithdrawModal; 