import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useAuth } from '../../auth/components/AuthContext';
import './InfluencerSelectedCampaignsPage.css';

/**
 * Influencer My Campaigns Page Component
 * 
 * Displays campaigns that the influencer is working on.
 * Shows campaign details, status, and provides actions for managing campaigns.
 * 
 * @param {Object} props - Component props
 * @param {string} props.pageTitle - Page title for SEO
 * @param {string} props.pageDescription - Page description for SEO
 * @returns {JSX.Element} Influencer my campaigns page component
 */
const InfluencerSelectedCampaignsPage = ({ 
  pageTitle = "My Campaigns - Infinder", 
  pageDescription = "View and manage your campaigns. Track your progress and collaborate with brands." 
}) => {
  const { user } = useAuth();
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed', 'pending'

  // Fetch campaigns
  const fetchSelectedCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use authenticated user ID or fallback to 16 for development
      const influencerId = user?.id || 16;
      // Fetch campaigns from influencer_lists table for this specific influencer
      const response = await fetch(`http://16.171.200.185:5051/api/influencers/${influencerId}/campaigns`);
      const result = await response.json();

      if (result.success) {
        // Filter for selected campaigns only and transform the data
        const selectedCampaigns = result.data
          .filter(item => item.listType === 'selected' && item.campaign)
          .map(item => ({
            id: item.id,
            campaign_id: item.campaignId,
            list_type: item.listType,
            added_at: item.addedAt,
            status: item.campaign.status || 'pending',
            // Flatten campaign data for easier access
            campaign_name: item.campaign.campaign_name,
            brand_name: item.campaign.brand_name,
            platform: item.campaign.platform,
            vertical: item.campaign.vertical,
            offer_description: item.campaign.offer_description
          }));
        
        setSelectedCampaigns(selectedCampaigns);
      } else {
        throw new Error(result.message || 'Failed to fetch campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSelectedCampaigns();
  }, [fetchSelectedCampaigns]);

  // Filter campaigns based on active tab
  const filteredCampaigns = selectedCampaigns.filter(campaign => {
    if (activeTab === 'all') return true;
    return campaign.status === activeTab;
  });

  // Get status color for styling
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'draft':
        return 'status-draft';
      default:
        return 'status-pending';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'draft':
        return 'Draft';
      default:
        return 'Unknown';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle campaign action
  const handleCampaignAction = async (campaignId, action) => {
    try {
      // Here you would implement the specific action logic
      console.log(`Performing ${action} on campaign ${campaignId}`);
      window.showToast(`${action} action performed successfully!`, 'success');
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      window.showToast(`Failed to perform ${action}`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="influencer-selected-campaigns-page">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
        </Helmet>
        
        <div className="influencer-selected-campaigns-page__loading">
          <div className="influencer-selected-campaigns-page__loading-spinner"></div>
          <p>Loading your campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="influencer-selected-campaigns-page">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
        </Helmet>
        
        <div className="influencer-selected-campaigns-page__error">
          <div className="influencer-selected-campaigns-page__error-icon">⚠️</div>
          <p>{error}</p>
          <button 
            onClick={fetchSelectedCampaigns} 
            className="influencer-selected-campaigns-page__retry"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="influencer-selected-campaigns-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      {/* Header */}
      <div className="influencer-selected-campaigns-page__header">
        <div className="influencer-selected-campaigns-page__header-content">
          <h1 className="influencer-selected-campaigns-page__title">My Campaigns</h1>
          <p className="influencer-selected-campaigns-page__subtitle">
            Campaigns you're working on and managing
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="influencer-selected-campaigns-page__tabs">
        <button
          className={`influencer-selected-campaigns-page__tab ${activeTab === 'all' ? 'influencer-selected-campaigns-page__tab--active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Campaigns ({selectedCampaigns.length})
        </button>
        <button
          className={`influencer-selected-campaigns-page__tab ${activeTab === 'active' ? 'influencer-selected-campaigns-page__tab--active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active ({selectedCampaigns.filter(c => c.status === 'active').length})
        </button>
        <button
          className={`influencer-selected-campaigns-page__tab ${activeTab === 'pending' ? 'influencer-selected-campaigns-page__tab--active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({selectedCampaigns.filter(c => c.status === 'pending').length})
        </button>
        <button
          className={`influencer-selected-campaigns-page__tab ${activeTab === 'completed' ? 'influencer-selected-campaigns-page__tab--active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({selectedCampaigns.filter(c => c.status === 'completed').length})
        </button>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="influencer-selected-campaigns-page__empty">
          <div className="influencer-selected-campaigns-page__empty-icon">🎯</div>
          <h3>No campaigns found</h3>
          <p>
            {activeTab === 'all' 
              ? "You don't have any campaigns yet. Keep applying to campaigns to get started!"
              : `No ${activeTab} campaigns found.`
            }
          </p>
          {activeTab === 'all' && (
            <button 
              onClick={() => window.location.href = '/influencer/search'}
              className="influencer-selected-campaigns-page__browse-btn"
            >
              Browse Campaigns
            </button>
          )}
        </div>
      ) : (
        <div className="influencer-selected-campaigns-page__grid">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="influencer-selected-campaigns-page__card">
              <div className="influencer-selected-campaigns-page__card-header">
                <div className="influencer-selected-campaigns-page__card-brand">
                  <h3>{campaign.brand_name || 'Unknown Brand'}</h3>
                  <p className="influencer-selected-campaigns-page__card-campaign-name">
                    {campaign.campaign_name || 'Unknown Campaign'}
                  </p>
                </div>
                <div className={`influencer-selected-campaigns-page__card-status ${getStatusColor(campaign.status)}`}>
                  {getStatusText(campaign.status)}
                </div>
              </div>

              <div className="influencer-selected-campaigns-page__card-details">
                <div className="influencer-selected-campaigns-page__card-detail">
                  <span className="influencer-selected-campaigns-page__card-label">Platform:</span>
                  <span className="influencer-selected-campaigns-page__card-value">{campaign.platform || 'N/A'}</span>
                </div>
                <div className="influencer-selected-campaigns-page__card-detail">
                  <span className="influencer-selected-campaigns-page__card-label">Industry:</span>
                  <span className="influencer-selected-campaigns-page__card-value">{campaign.vertical || 'N/A'}</span>
                </div>
                <div className="influencer-selected-campaigns-page__card-detail">
                  <span className="influencer-selected-campaigns-page__card-label">Selected Date:</span>
                  <span className="influencer-selected-campaigns-page__card-value">
                    {formatDate(campaign.added_at)}
                  </span>
                </div>
                {campaign.offer_description && (
                  <div className="influencer-selected-campaigns-page__card-description">
                    <span className="influencer-selected-campaigns-page__card-label">Description:</span>
                    <p>{campaign.offer_description}</p>
                  </div>
                )}
              </div>

              <div className="influencer-selected-campaigns-page__card-actions">
                {campaign.status === 'active' && (
                  <div className="influencer-selected-campaigns-page__card-action-buttons">
                    <button
                      onClick={() => handleCampaignAction(campaign.id, 'start')}
                      className="influencer-selected-campaigns-page__card-action-btn influencer-selected-campaigns-page__card-action-btn--primary"
                    >
                      Start Campaign
                    </button>
                    <button
                      onClick={() => handleCampaignAction(campaign.id, 'contact')}
                      className="influencer-selected-campaigns-page__card-action-btn"
                    >
                      Contact Brand
                    </button>
                  </div>
                )}
                {campaign.status === 'pending' && (
                  <div className="influencer-selected-campaigns-page__card-action-buttons">
                    <button
                      onClick={() => handleCampaignAction(campaign.id, 'accept')}
                      className="influencer-selected-campaigns-page__card-action-btn influencer-selected-campaigns-page__card-action-btn--primary"
                    >
                      Accept Selection
                    </button>
                    <button
                      onClick={() => handleCampaignAction(campaign.id, 'decline')}
                      className="influencer-selected-campaigns-page__card-action-btn influencer-selected-campaigns-page__card-action-btn--secondary"
                    >
                      Decline
                    </button>
                  </div>
                )}
                {campaign.status === 'completed' && (
                  <div className="influencer-selected-campaigns-page__card-completed">
                    <span className="influencer-selected-campaigns-page__card-completed-icon">✅</span>
                    <span>Campaign completed successfully!</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

InfluencerSelectedCampaignsPage.propTypes = {
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string
};

export default InfluencerSelectedCampaignsPage; 