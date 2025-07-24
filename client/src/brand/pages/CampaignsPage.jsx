import React, { useState, useEffect } from 'react';
import './CampaignsPage.css';
import NotificationSidebar from '../../shared/components/shared/notification/NotificationSidebar';

/**
 * Campaigns Page Component
 * 
 * Displays all campaigns with their status, budget, and performance metrics.
 * Features filtering, search, and campaign management functionality.
 */
const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [totalUniqueInfluencers, setTotalUniqueInfluencers] = useState(0);
  const [formData, setFormData] = useState({
    brandName: '',
    campaignId: '',
    campaignName: '',
    leadflow: '',
    trackingUrl: '',
    previewUrl: '',
    creativeUrl: '',
    timezone: 'UTC',
    offerDescription: '',
    kpi: '',
    restrictions: '',
    vertical: '',
    countries: '',
    platform: '',
    status: '',
    startDate: '',
    endDate: '',
    isPrivate: true,
    requiresApproval: true
  });

  const handleNotificationClick = () => {
    console.log('Campaigns page notification clicked');
  };

  const handleCreateCampaign = () => {
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowDetailsModal(false);
    setEditingCampaign(null);
    setSelectedCampaign(null);
    setFormData({
      brandName: '',
      campaignId: '',
      campaignName: '',
      leadflow: '',
      trackingUrl: '',
      previewUrl: '',
      creativeUrl: '',
      timezone: 'UTC',
      offerDescription: '',
      kpi: '',
      restrictions: '',
      vertical: '',
      countries: '',
      platform: '',
      status: '',
      startDate: '',
      endDate: '',
      isPrivate: true,
      requiresApproval: true
    });
  };

  const handleViewDetails = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDetailsModal(true);
  };

  const handleEditCampaign = (campaign) => {
    console.log('Editing campaign:', campaign);
    setEditingCampaign(campaign);
    
    // Format dates for HTML date inputs (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    
    setFormData({
      brandName: campaign.brand_name || '',
      campaignId: campaign.campaign_id || '',
      campaignName: campaign.campaign_name || '',
      leadflow: campaign.leadflow || '',
      trackingUrl: campaign.tracking_url || '',
      previewUrl: campaign.preview_url || '',
      creativeUrl: campaign.creative_url || '',
      timezone: campaign.timezone || 'UTC',
      offerDescription: campaign.offer_description || '',
      kpi: campaign.kpi || '',
      restrictions: campaign.restrictions || '',
      vertical: campaign.vertical || '',
      countries: campaign.countries || '',
      platform: campaign.platform || '',
      status: campaign.status || '',
      startDate: formatDateForInput(campaign.start_date),
      endDate: formatDateForInput(campaign.end_date),
      isPrivate: campaign.is_private || false,
      requiresApproval: campaign.requires_approval || false
    });
    setShowEditForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingCampaign 
        ? `http://localhost:5052/api/campaigns/${editingCampaign.id}`
        : 'http://localhost:5052/api/campaigns';
      
      const method = editingCampaign ? 'PUT' : 'POST';
      
      console.log('Submitting form:', {
        url,
        method,
        formData,
        editingCampaign
      });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const result = await response.json();

      if (result.success) {
        console.log(editingCampaign ? 'Campaign updated successfully:' : 'Campaign created successfully:', result.data);
        // Refresh the campaigns list
        fetchCampaigns();
        handleCloseForm();
        // Show success toast
        if (window.showToast) {
          window.showToast(
            editingCampaign ? 'Campaign updated successfully!' : 'Campaign created successfully!',
            'success',
            4000
          );
        }
      } else {
        console.error(editingCampaign ? 'Failed to update campaign:' : 'Failed to create campaign:', result.message);
        console.error('Full error response:', result);
        if (window.showToast) {
          window.showToast(
            (editingCampaign ? 'Failed to update campaign: ' : 'Failed to create campaign: ') + result.message,
            'error',
            5000
          );
        }
      }
    } catch (error) {
      console.error(editingCampaign ? 'Error updating campaign:' : 'Error creating campaign:', error);
      console.error('Request details:', {
        url,
        method,
        formData,
        editingCampaign
      });
      if (window.showToast) {
        window.showToast(
          (editingCampaign ? 'Error updating campaign. ' : 'Error creating campaign. ') + 'Please try again.',
          'error',
          5000
        );
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign? This action will also remove all influencer assignments for this campaign and cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5052/api/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        console.log('Campaign deleted successfully:', result.message);
        // Refresh the campaigns list
        fetchCampaigns();
        handleCloseForm();
        // Show success toast
        if (window.showToast) {
          window.showToast('Campaign deleted successfully!', 'success', 4000);
        }
      } else {
        console.error('Failed to delete campaign:', result.message);
        if (window.showToast) {
          window.showToast('Failed to delete campaign: ' + result.message, 'error', 5000);
        }
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      if (window.showToast) {
        window.showToast('Error deleting campaign. Please try again.', 'error', 5000);
      }
    }
  };



  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5052/api/campaigns');
      const result = await response.json();
      
      if (result.success) {
        setCampaigns(result.data.campaigns || []);
        setTotalUniqueInfluencers(result.data.totalUniqueInfluencers || 0);
      } else {
        console.error('Failed to fetch campaigns:', result.message);
        setCampaigns([]);
        setTotalUniqueInfluencers(0);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'draft':
        return 'Draft';
      case 'paused':
        return 'Paused';
      default:
        return status;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.campaign_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.offer_description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCampaigns = campaigns.filter(campaign => campaign.status === 'active').length;
  const totalCampaigns = campaigns.length;

  if (loading) {
    return (
      <div className="campaigns-page">
        {/* Floating Notification Button */}
        <div className="campaigns-notification-button">
          <NotificationSidebar 
            count={2} 
            onClick={handleNotificationClick}
            className="campaigns-notification"
          />
        </div>

        <div className="campaigns-header">
          <h1>Campaigns</h1>
        </div>
        
        {/* Loading Skeleton */}
        <div className="loading-skeleton">
          {/* Stats Cards Skeleton */}
          <div className="campaigns-stats">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card skeleton">
                <div className="stat-icon skeleton-icon"></div>
                <div className="stat-content">
                  <div className="skeleton-text skeleton-title"></div>
                  <div className="skeleton-text skeleton-subtitle"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Skeleton */}
          <div className="campaigns-filters skeleton">
            <div className="search-box">
              <div className="skeleton-search"></div>
            </div>
            <div className="filter-buttons">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-filter-btn"></div>
              ))}
            </div>
          </div>

          {/* Campaign Cards Skeleton */}
          <div className="campaigns-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="campaign-card skeleton">
                <div className="campaign-header">
                  <div className="campaign-title">
                    <div className="skeleton-text skeleton-title"></div>
                    <div className="skeleton-text skeleton-subtitle"></div>
                  </div>
                  <div className="skeleton-badge"></div>
                </div>
                <div className="campaign-description">
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text"></div>
                </div>
                <div className="campaign-metrics">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="metric skeleton">
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text"></div>
                    </div>
                  ))}
                </div>
                <div className="campaign-progress">
                  <div className="progress-bar">
                    <div className="skeleton-progress"></div>
                  </div>
                  <div className="skeleton-text"></div>
                </div>
                <div className="campaign-actions-bottom">
                  <div className="skeleton-btn"></div>
                  <div className="skeleton-btn"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="campaigns-page">
      {/* Floating Notification Button */}
      <div className="campaigns-notification-button">
        <NotificationSidebar 
          count={2} 
          onClick={handleNotificationClick}
          className="campaigns-notification"
        />
      </div>

      {/* Header */}
      <div className="campaigns-header">
        <div className="header-content">
          <h1>Campaigns</h1>
          <p>Manage and track your influencer marketing campaigns</p>
        </div>
        <button className="create-campaign-btn" onClick={handleCreateCampaign}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Create Campaign
        </button>
      </div>

      {/* Stats Cards */}
      <div className="campaigns-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{totalCampaigns}</h3>
            <p>Total Campaigns</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{activeCampaigns}</h3>
            <p>Active Campaigns</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M23 21V19C23 18.1137 22.7312 17.2528 22.2312 16.5159C21.7311 15.7789 21.0215 15.2002 20.18 14.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11883 19.0078 7.005C19.0078 7.89117 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{totalUniqueInfluencers}</h3>
            <p>Influencers Onboard</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{campaigns.filter(c => c.vertical).length}</h3>
            <p>Verticals</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="campaigns-filters">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${statusFilter === 'paused' ? 'active' : ''}`}
            onClick={() => setStatusFilter('paused')}
          >
            Paused
          </button>
          <button
            className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${statusFilter === 'draft' ? 'active' : ''}`}
            onClick={() => setStatusFilter('draft')}
          >
            Draft
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="campaigns-grid">
        {filteredCampaigns.map(campaign => (
          <div key={campaign.id} className="campaign-card">
            <div className="campaign-header">
              <div className="campaign-title">
                <h3>{campaign.campaign_name}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(campaign.status) }}
                >
                  {getStatusLabel(campaign.status)}
                </span>
              </div>
              <div className="campaign-actions">
                <button 
                  className="action-btn edit-btn" 
                  title="Edit campaign"
                  onClick={() => handleEditCampaign(campaign)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="campaign-brand">
              <span className="brand-name">{campaign.brand_name}</span>
              {campaign.campaign_id && (
                <span className="campaign-id">ID: {campaign.campaign_id}</span>
              )}
            </div>

            <p className="campaign-description">
              {campaign.offer_description || 'No description available'}
            </p>

            <div className="campaign-metrics">
              <div className="metric">
                <span className="metric-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Platform
                </span>
                <span className="metric-value">{campaign.platform}</span>
              </div>
              <div className="metric">
                <span className="metric-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                    <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Leadflow
                </span>
                <span className="metric-value">{campaign.leadflow}</span>
              </div>
              <div className="metric">
                <span className="metric-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Vertical
                </span>
                <span className="metric-value">{campaign.vertical || 'N/A'}</span>
              </div>
              <div className="metric">
                <span className="metric-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M23 21V19C23 18.1137 22.7312 17.2528 22.2312 16.5159C21.7311 15.7789 21.0215 15.2002 20.18 14.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11883 19.0078 7.005C19.0078 7.89117 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Countries
                </span>
                <span className="metric-value">{campaign.countries || 'Global'}</span>
              </div>
            </div>

            <div className="campaign-dates">
              <div className="date-range">
                <span className="date-label">Start Date</span>
                <span className="date-value">{campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Not set'}</span>
              </div>
              <div className="date-range">
                <span className="date-label">End Date</span>
                <span className="date-value">{campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Not set'}</span>
              </div>
            </div>

            <div className="campaign-flags">
              {campaign.is_private && (
                <span className="flag private">Private</span>
              )}
              {campaign.requires_approval && (
                <span className="flag approval">Requires Approval</span>
              )}
            </div>

            <div className="campaign-actions-bottom">
              <button 
                className="btn-secondary"
                onClick={() => handleViewDetails(campaign)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && !loading && (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>No campaigns found</h3>
          <p>{campaigns.length === 0 ? 'Create your first campaign to get started!' : 'Try adjusting your search or filter criteria'}</p>
          {campaigns.length === 0 && (
            <button className="create-campaign-btn" onClick={handleCreateCampaign}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create Your First Campaign
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Campaign Modal */}
      {(showCreateForm || showEditForm) && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="modal-back-btn" onClick={handleCloseForm}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="create-campaign-form">
              <div className="form-columns">
                {/* Left Column */}
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="brandName">Brand Name *</label>
                    <input
                      type="text"
                      id="brandName"
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter brand name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="campaignId">Campaign ID</label>
                    <input
                      type="text"
                      id="campaignId"
                      name="campaignId"
                      value={formData.campaignId}
                      onChange={handleInputChange}
                      placeholder="Enter campaign ID"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="campaignName">Campaign Name *</label>
                    <input
                      type="text"
                      id="campaignName"
                      name="campaignName"
                      value={formData.campaignName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter campaign name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="leadflow">Leadflow *</label>
                    <select
                      id="leadflow"
                      name="leadflow"
                      value={formData.leadflow}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Leadflow...</option>
                      <option value="CPA">CPA</option>
                      <option value="CPL">CPL</option>
                      <option value="CPS">CPS</option>
                      <option value="CPI">CPI</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="trackingUrl">Tracking URL *</label>
                    <input
                      type="url"
                      id="trackingUrl"
                      name="trackingUrl"
                      value={formData.trackingUrl}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter tracking URL"
                    />
                    <small className="form-help">Add Macros</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="previewUrl">Preview URL</label>
                    <input
                      type="url"
                      id="previewUrl"
                      name="previewUrl"
                      value={formData.previewUrl}
                      onChange={handleInputChange}
                      placeholder="Enter preview URL"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="creativeUrl">Creative URL</label>
                    <input
                      type="url"
                      id="creativeUrl"
                      name="creativeUrl"
                      value={formData.creativeUrl}
                      onChange={handleInputChange}
                      placeholder="Upload file or enter URL..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="timezone">Timezone</label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="CST">CST (Central Standard Time)</option>
                      <option value="MST">MST (Mountain Standard Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                      <option value="AKST">AKST (Alaska Standard Time)</option>
                      <option value="HST">HST (Hawaii Standard Time)</option>
                      <option value="GMT">GMT (Greenwich Mean Time)</option>
                      <option value="CET">CET (Central European Time)</option>
                      <option value="EET">EET (Eastern European Time)</option>
                      <option value="MSK">MSK (Moscow Standard Time)</option>
                      <option value="IST">IST (India Standard Time)</option>
                      <option value="CST">CST (China Standard Time)</option>
                      <option value="JST">JST (Japan Standard Time)</option>
                      <option value="KST">KST (Korea Standard Time)</option>
                      <option value="SGT">SGT (Singapore Time)</option>
                      <option value="AWST">AWST (Australian Western Standard Time)</option>
                      <option value="ACST">ACST (Australian Central Standard Time)</option>
                      <option value="AEST">AEST (Australian Eastern Standard Time)</option>
                      <option value="NZST">NZST (New Zealand Standard Time)</option>
                      <option value="BRT">BRT (Brasília Time)</option>
                      <option value="ART">ART (Argentina Time)</option>
                      <option value="CLT">CLT (Chile Standard Time)</option>
                      <option value="WAT">WAT (West Africa Time)</option>
                      <option value="EAT">EAT (East Africa Time)</option>
                      <option value="SAST">SAST (South Africa Standard Time)</option>
                      <option value="GST">GST (Gulf Standard Time)</option>
                      <option value="IRST">IRST (Iran Standard Time)</option>
                      <option value="PKT">PKT (Pakistan Standard Time)</option>
                      <option value="BST">BST (Bangladesh Standard Time)</option>
                      <option value="ICT">ICT (Indochina Time)</option>
                      <option value="WIB">WIB (Western Indonesian Time)</option>
                      <option value="WITA">WITA (Central Indonesian Time)</option>
                      <option value="WIT">WIT (Eastern Indonesian Time)</option>
                      <option value="PHT">PHT (Philippine Time)</option>
                      <option value="MYT">MYT (Malaysia Time)</option>
                      <option value="THA">THA (Thailand Standard Time)</option>
                      <option value="VNT">VNT (Vietnam Time)</option>
                      <option value="MNT">MNT (Mongolia Standard Time)</option>
                      <option value="HKT">HKT (Hong Kong Time)</option>
                      <option value="TST">TST (Taiwan Standard Time)</option>
                    </select>
                    <small className="form-help">Timezone in which budgets and time targetings are evaluated</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="offerDescription">Offer Description</label>
                    <textarea
                      id="offerDescription"
                      name="offerDescription"
                      value={formData.offerDescription}
                      onChange={handleInputChange}
                      placeholder="Enter offer description"
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="kpi">KPI</label>
                    <textarea
                      id="kpi"
                      name="kpi"
                      value={formData.kpi}
                      onChange={handleInputChange}
                      placeholder="Enter KPI details"
                      rows="4"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="restrictions">Restrictions</label>
                    <textarea
                      id="restrictions"
                      name="restrictions"
                      value={formData.restrictions}
                      onChange={handleInputChange}
                      placeholder="Enter campaign restrictions"
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="vertical">Verticals</label>
                    <select
                      id="vertical"
                      name="vertical"
                      value={formData.vertical}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Vertical...</option>
                      <option value="fashion">Fashion & Apparel</option>
                      <option value="beauty">Beauty & Cosmetics</option>
                      <option value="fitness">Fitness & Health</option>
                      <option value="food">Food & Beverage</option>
                      <option value="tech">Technology & Gadgets</option>
                      <option value="lifestyle">Lifestyle & Wellness</option>
                      <option value="travel">Travel & Tourism</option>
                      <option value="automotive">Automotive</option>
                      <option value="finance">Finance & Banking</option>
                      <option value="education">Education & Learning</option>
                      <option value="gaming">Gaming & Entertainment</option>
                      <option value="home">Home & Garden</option>
                      <option value="pets">Pets & Animals</option>
                      <option value="sports">Sports & Athletics</option>
                      <option value="business">Business & Professional</option>
                      <option value="parenting">Parenting & Family</option>
                      <option value="art">Art & Creativity</option>
                      <option value="music">Music & Audio</option>
                      <option value="books">Books & Literature</option>
                      <option value="pharma">Pharmaceuticals</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="legal">Legal Services</option>
                      <option value="consulting">Consulting</option>
                      <option value="non-profit">Non-Profit & Charity</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="countries">Countries</label>
                    <select
                      id="countries"
                      name="countries"
                      value={formData.countries}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Countries...</option>
                      <option value="global">Global</option>
                      <option value="us">United States</option>
                      <option value="uk">United Kingdom</option>
                      <option value="ca">Canada</option>
                      <option value="au">Australia</option>
                      <option value="de">Germany</option>
                      <option value="fr">France</option>
                      <option value="it">Italy</option>
                      <option value="es">Spain</option>
                      <option value="nl">Netherlands</option>
                      <option value="be">Belgium</option>
                      <option value="ch">Switzerland</option>
                      <option value="at">Austria</option>
                      <option value="se">Sweden</option>
                      <option value="no">Norway</option>
                      <option value="dk">Denmark</option>
                      <option value="fi">Finland</option>
                      <option value="pl">Poland</option>
                      <option value="cz">Czech Republic</option>
                      <option value="hu">Hungary</option>
                      <option value="ro">Romania</option>
                      <option value="bg">Bulgaria</option>
                      <option value="hr">Croatia</option>
                      <option value="si">Slovenia</option>
                      <option value="sk">Slovakia</option>
                      <option value="lt">Lithuania</option>
                      <option value="lv">Latvia</option>
                      <option value="ee">Estonia</option>
                      <option value="ie">Ireland</option>
                      <option value="pt">Portugal</option>
                      <option value="gr">Greece</option>
                      <option value="cy">Cyprus</option>
                      <option value="mt">Malta</option>
                      <option value="lu">Luxembourg</option>
                      <option value="is">Iceland</option>
                      <option value="in">India</option>
                      <option value="cn">China</option>
                      <option value="jp">Japan</option>
                      <option value="kr">South Korea</option>
                      <option value="sg">Singapore</option>
                      <option value="my">Malaysia</option>
                      <option value="th">Thailand</option>
                      <option value="vn">Vietnam</option>
                      <option value="ph">Philippines</option>
                      <option value="id">Indonesia</option>
                      <option value="br">Brazil</option>
                      <option value="mx">Mexico</option>
                      <option value="ar">Argentina</option>
                      <option value="cl">Chile</option>
                      <option value="co">Colombia</option>
                      <option value="pe">Peru</option>
                      <option value="ve">Venezuela</option>
                      <option value="uy">Uruguay</option>
                      <option value="py">Paraguay</option>
                      <option value="bo">Bolivia</option>
                      <option value="ec">Ecuador</option>
                      <option value="nz">New Zealand</option>
                      <option value="za">South Africa</option>
                      <option value="ng">Nigeria</option>
                      <option value="ke">Kenya</option>
                      <option value="gh">Ghana</option>
                      <option value="ug">Uganda</option>
                      <option value="tz">Tanzania</option>
                      <option value="et">Ethiopia</option>
                      <option value="ma">Morocco</option>
                      <option value="eg">Egypt</option>
                      <option value="tn">Tunisia</option>
                      <option value="dz">Algeria</option>
                      <option value="sa">Saudi Arabia</option>
                      <option value="ae">United Arab Emirates</option>
                      <option value="qa">Qatar</option>
                      <option value="kw">Kuwait</option>
                      <option value="bh">Bahrain</option>
                      <option value="om">Oman</option>
                      <option value="jo">Jordan</option>
                      <option value="lb">Lebanon</option>
                      <option value="il">Israel</option>
                      <option value="tr">Turkey</option>
                      <option value="ru">Russia</option>
                      <option value="ua">Ukraine</option>
                      <option value="by">Belarus</option>
                      <option value="md">Moldova</option>
                      <option value="ge">Georgia</option>
                      <option value="am">Armenia</option>
                      <option value="az">Azerbaijan</option>
                      <option value="kz">Kazakhstan</option>
                      <option value="uz">Uzbekistan</option>
                      <option value="kg">Kyrgyzstan</option>
                      <option value="tj">Tajikistan</option>
                      <option value="tm">Turkmenistan</option>
                      <option value="af">Afghanistan</option>
                      <option value="pk">Pakistan</option>
                      <option value="bd">Bangladesh</option>
                      <option value="lk">Sri Lanka</option>
                      <option value="np">Nepal</option>
                      <option value="bt">Bhutan</option>
                      <option value="mv">Maldives</option>
                      <option value="mm">Myanmar</option>
                      <option value="la">Laos</option>
                      <option value="kh">Cambodia</option>
                      <option value="mn">Mongolia</option>
                      <option value="tw">Taiwan</option>
                      <option value="hk">Hong Kong</option>
                      <option value="mo">Macau</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="platform">Platform *</label>
                    <select
                      id="platform"
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Platform...</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="twitter">Twitter</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status *</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Status...</option>
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      placeholder="Select start date"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      placeholder="Select end date"
                    />
                  </div>

                  <div className="form-group">
                    <label>Campaign Settings</label>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isPrivate"
                          checked={formData.isPrivate}
                          onChange={handleInputChange}
                        />
                        <span className="checkmark"></span>
                        Private
                        <span className="checkbox-description">Only visible to your team</span>
                      </label>

                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="requiresApproval"
                          checked={formData.requiresApproval}
                          onChange={handleInputChange}
                        />
                        <span className="checkmark"></span>
                        Requires Approval
                        <span className="checkbox-description">Content must be approved before publishing</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseForm}>
                  Cancel
                </button>
                {editingCampaign && (
                  <button 
                    type="button"
                    className="btn-danger"
                    onClick={() => handleDeleteCampaign(editingCampaign.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Delete Campaign
                  </button>
                )}
                <button type="submit" className="btn-save">
                  {editingCampaign ? 'Update Campaign' : 'Save Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Details Modal */}
      {showDetailsModal && selectedCampaign && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header details-modal-header">
              <div className="details-modal-header-content">
                <div className="details-modal-header-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="details-modal-header-text">
                  <h2>Campaign Details</h2>
                  <p>View comprehensive information about this campaign</p>
                </div>
              </div>
              <button className="modal-close details-modal-close" onClick={handleCloseForm}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="campaign-details-content">
              {/* Campaign Header */}
              <div className="details-header">
                <div className="campaign-title-section">
                  <div className="campaign-title-content">
                    <h3>{selectedCampaign.campaign_name}</h3>
                    <div className="campaign-meta">
                      <span className="brand-name">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 7L10 17L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {selectedCampaign.brand_name}
                      </span>
                      {selectedCampaign.campaign_id && (
                        <span className="campaign-id">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 6H5C3.89543 6 3 6.89543 3 8V19C3 20.1046 3.89543 21 5 21H16C17.1046 21 18 20.1046 18 19V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 2H20C21.1046 2 22 2.89543 22 4V10C22 11.1046 21.1046 12 20 12H14C12.8954 12 12 11.1046 12 10V4C12 2.89543 12.8954 2 14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          ID: {selectedCampaign.campaign_id}
                        </span>
                      )}
                    </div>
                  </div>
                  <span 
                    className="status-badge details-status-badge"
                    style={{ backgroundColor: getStatusColor(selectedCampaign.status) }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {getStatusLabel(selectedCampaign.status)}
                  </span>
                </div>
              </div>

              {/* Campaign Flags */}
              <div className="details-flags">
                {selectedCampaign.is_private && (
                  <span className="flag private">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M21 20C21 19.5 20.6 19 20 19H4C3.4 19 3 19.5 3 20C3 20.5 3.4 21 4 21H20C20.6 21 21 20.5 21 20Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Private Campaign
                  </span>
                )}
                {selectedCampaign.requires_approval && (
                  <span className="flag approval">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Requires Approval
                  </span>
                )}
              </div>

              {/* Campaign Details Grid */}
              <div className="details-grid">
                <div className="details-section">
                  <div className="details-section-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h4>Campaign Information</h4>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                        <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Platform
                    </span>
                    <span className="detail-value">{selectedCampaign.platform}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Leadflow
                    </span>
                    <span className="detail-value">{selectedCampaign.leadflow}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Vertical
                    </span>
                    <span className="detail-value">{selectedCampaign.vertical || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 2C9.49872 4.73835 8.07725 8.29203 8 12C8.07725 15.708 9.49872 19.2616 12 22" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Countries
                    </span>
                    <span className="detail-value">{selectedCampaign.countries || 'Global'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Timezone
                    </span>
                    <span className="detail-value">{selectedCampaign.timezone}</span>
                  </div>
                </div>

                <div className="details-section">
                  <div className="details-section-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 13A5 5 0 0 0 20 13" stroke="currentColor" strokeWidth="2"/>
                      <path d="M10 13A5 5 0 0 1 20 13" stroke="currentColor" strokeWidth="2"/>
                      <path d="M10 13A5 5 0 0 0 20 13" stroke="currentColor" strokeWidth="2"/>
                      <path d="M10 13A5 5 0 0 1 20 13" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <h4>Tracking & URLs</h4>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 13A5 5 0 0 0 20 13" stroke="currentColor" strokeWidth="2"/>
                        <path d="M10 13A5 5 0 0 1 20 13" stroke="currentColor" strokeWidth="2"/>
                        <path d="M10 13A5 5 0 0 0 20 13" stroke="currentColor" strokeWidth="2"/>
                        <path d="M10 13A5 5 0 0 1 20 13" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Tracking URL
                    </span>
                    <span className="detail-value url">
                      <a href={selectedCampaign.tracking_url} target="_blank" rel="noopener noreferrer">
                        {selectedCampaign.tracking_url}
                      </a>
                    </span>
                  </div>
                  {selectedCampaign.preview_url && (
                    <div className="detail-item">
                      <span className="detail-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Preview URL
                      </span>
                      <span className="detail-value url">
                        <a href={selectedCampaign.preview_url} target="_blank" rel="noopener noreferrer">
                          {selectedCampaign.preview_url}
                        </a>
                      </span>
                    </div>
                  )}
                  {selectedCampaign.creative_url && (
                    <div className="detail-item">
                      <span className="detail-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Creative URL
                      </span>
                      <span className="detail-value url">
                        <a href={selectedCampaign.creative_url} target="_blank" rel="noopener noreferrer">
                          {selectedCampaign.creative_url}
                        </a>
                      </span>
                    </div>
                  )}
                </div>

                <div className="details-section">
                  <div className="details-section-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <h4>Campaign Details</h4>
                  </div>
                  {selectedCampaign.offer_description && (
                    <div className="detail-item full-width">
                      <span className="detail-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Offer Description
                      </span>
                      <span className="detail-value">{selectedCampaign.offer_description}</span>
                    </div>
                  )}
                  {selectedCampaign.kpi && (
                    <div className="detail-item full-width">
                      <span className="detail-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        KPI
                      </span>
                      <span className="detail-value">{selectedCampaign.kpi}</span>
                    </div>
                  )}
                  {selectedCampaign.restrictions && (
                    <div className="detail-item full-width">
                      <span className="detail-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                          <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Restrictions
                      </span>
                      <span className="detail-value">{selectedCampaign.restrictions}</span>
                    </div>
                  )}
                </div>

                <div className="details-section">
                  <div className="details-section-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <h4>Campaign Dates</h4>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Start Date
                    </span>
                    <span className="detail-value">
                      {selectedCampaign.start_date ? new Date(selectedCampaign.start_date).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      End Date
                    </span>
                    <span className="detail-value">
                      {selectedCampaign.end_date ? new Date(selectedCampaign.end_date).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsPage; 