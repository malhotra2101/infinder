import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ViewDetailsModal.css';

/**
 * View Details Modal Component
 * 
 * Displays detailed information about campaigns an influencer is selected for.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Object} props.influencer - The influencer being viewed
 * @returns {JSX.Element} ViewDetailsModal component
 */
const ViewDetailsModal = ({ isOpen, onClose, influencer }) => {
  const [campaigns, setCampaigns] = useState([]);
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
      
      // Fetch campaigns from influencer_lists for this influencer
      const response = await fetch(`http://localhost:5052/api/influencers/${influencer.id}/campaigns`);
      const result = await response.json();
      
      if (result.success) {
        // Filter out entries without campaign data (campaign_id is null)
        const validCampaigns = result.data.filter(item => item.campaign && item.campaign.id);
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
    <div className="view-details-modal-overlay" onClick={onClose}>
      <div className="view-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="view-details-modal__header">
          <h2 className="view-details-modal__title">
            {influencer?.all_requests ? 'Sent Requests for' : 'Campaign Details for'} {influencer?.name}
          </h2>
          <button 
            className="view-details-modal__close"
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
        <div className="view-details-modal__content">
          {loading ? (
            <div className="view-details-modal__loading">
              <div className="view-details-modal__loading-spinner"></div>
              <p>Loading campaign details...</p>
            </div>
          ) : error ? (
            <div className="view-details-modal__error">
              <div className="view-details-modal__error-icon">⚠️</div>
              <p>{error}</p>
              <button 
                className="view-details-modal__retry"
                onClick={fetchInfluencerCampaigns}
              >
                Try Again
              </button>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="view-details-modal__empty">
              <div className="view-details-modal__empty-icon">📋</div>
              <h3>No Requests Found</h3>
              <p>{influencer?.all_requests ? 'No requests have been sent to this influencer.' : 'This influencer is not currently assigned to any campaigns.'}</p>
            </div>
          ) : (
            <div className="view-details-modal__campaigns">
              <h3 className="view-details-modal__section-title">
                {influencer?.all_requests ? 'Sent Requests' : 'My Campaigns'} ({campaigns.length})
              </h3>
              
              {campaigns.map((campaign, index) => (
                <div key={campaign.id || `campaign-${index}`} className="view-details-modal__campaign">
                  <div className="view-details-modal__campaign-header">
                    <h4 className="view-details-modal__campaign-name">
                      {campaign.campaign?.campaign_name || 'Campaign Assignment'}
                    </h4>
                    <span 
                      className="view-details-modal__campaign-status"
                      style={{ backgroundColor: getStatusColor(campaign.status) }}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  
                  <div className="view-details-modal__campaign-details">
                    <div className="view-details-modal__campaign-info">
                      <div className="view-details-modal__campaign-brand">
                        <strong>Brand:</strong> {campaign.campaign?.brand_name || 'Unknown'}
                      </div>
                      
                      {campaign.campaign?.platform && (
                        <div className="view-details-modal__campaign-platform">
                          <strong>Platform:</strong> {campaign.campaign.platform}
                        </div>
                      )}
                      
                      {campaign.campaign?.vertical && (
                        <div className="view-details-modal__campaign-vertical">
                          <strong>Vertical:</strong> {campaign.campaign.vertical}
                        </div>
                      )}
                      
                      <div className="view-details-modal__campaign-dates">
                        <div>
                          <strong>Start:</strong> {formatDate(campaign.campaign?.start_date)}
                        </div>
                        <div>
                          <strong>End:</strong> {formatDate(campaign.campaign?.end_date)}
                        </div>
                      </div>
                      
                      {campaign.campaign?.offer_description && (
                        <div className="view-details-modal__campaign-description">
                          <strong>Description:</strong> {campaign.campaign.offer_description}
                        </div>
                      )}
                    </div>
                    
                    <div className="view-details-modal__request-info">
                      <div className="view-details-modal__request-date">
                        <strong>Request Date:</strong> {formatDate(campaign.created_at)}
                      </div>
                      
                      {campaign.message && (
                        <div className="view-details-modal__request-message">
                          <strong>Message:</strong> {campaign.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="view-details-modal__footer">
          <button 
            className="view-details-modal__close-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking and documentation
ViewDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
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

export default ViewDetailsModal; 