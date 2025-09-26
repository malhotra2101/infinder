import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from '../../../shared/utils/useDebounce.js';
import BrandCampaignCard from '../components/brand-campaign-card/BrandCampaignCard';
import SearchBar from '../components/search-bar/SearchBar';
import FilterSidebar from '../components/filter-sidebar/FilterSidebar';
import NotificationSidebar from '../../../shared/components/shared/notification/NotificationSidebar';
import { SentRequests, ReceivedRequests } from '../components/requests';
import './InfluencerSearchPage.css';
import { API_CONFIG } from '../../../shared/config/config.js';

/**
 * Influencer Search Page Component
 * 
 * Search page for influencers to discover brands and campaigns.
 * Displays campaign cards with brand information and apply functionality.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.sidebarOpen - Whether sidebar is open
 * @returns {JSX.Element} Influencer search page component
 */
const InfluencerSearchPage = ({ sidebarOpen = false }) => {
  // State management
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    platforms: [],
    budgetRanges: [],
    campaignTypes: [],
    industries: [],
    status: 'all',
    contentRequirements: [],
    brandSizes: [],
    countries: [],
    campaignDuration: 'all',
    minBudget: null,
    maxBudget: null
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns', 'sent', 'received'
  const [sentRequests, setSentRequests] = useState([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  // Debounced search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch sent requests
  const fetchSentRequests = useCallback(async () => {
    try {
      // For now, using hardcoded influencer ID 16 (for consistency with requests components)
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/collaboration-requests?userType=influencer&userId=16&filter=sent`);
      const result = await response.json();

      if (result.success) {
        setSentRequests(result.data.requests || []);
      } else {
        console.error('Failed to fetch sent requests:', result.message);
      }
    } catch (error) {
      console.error('Error fetching sent requests:', error);
    }
  }, []);

  // Fetch selected campaigns
  const fetchSelectedCampaigns = useCallback(async () => {
    try {
      // For now, using hardcoded influencer ID 1
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/influencers/16/campaigns`);
      const result = await response.json();

      if (result.success) {
        // Filter for selected campaigns only
        const selected = result.data.filter(item => 
          item.listType === 'selected' && item.campaignId
        ).map(item => item.campaignId);
        setSelectedCampaigns(selected);
      } else {
        console.error('Failed to fetch selected campaigns:', result.message);
      }
    } catch (error) {
      console.error('Error fetching selected campaigns:', error);
    }
  }, []);

  // Fetch campaigns
  const fetchCampaigns = useCallback(async (isNewSearch = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      
      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }
      
      // Add filters
      if (filters.platforms.length > 0) {
        params.append('platform', filters.platforms[0]);
      }
      if (filters.industries.length > 0) {
        params.append('vertical', filters.industries[0]); // Use vertical instead of industry for campaigns
      }
      if (filters.status !== 'all') {
        params.append('status', filters.status);
      }
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/campaigns?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        const newCampaigns = result.data.campaigns || [];

        if (isNewSearch) {
          setCampaigns(newCampaigns);
          setPage(1);
        } else {
          setCampaigns(prev => [...prev, ...newCampaigns]);
        }
        
        setHasMore(result.data.pagination?.hasMore || newCampaigns.length === 10);
      } else {
        throw new Error(result.message || 'Failed to fetch campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [debouncedSearchTerm, filters, page]);

  // Load more function
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Handle search
  const handleSearch = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setPage(1);
    setCampaigns([]);
    setIsInitialLoad(true);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setCampaigns([]);
    setIsInitialLoad(true);
  }, []);

  // Handle filter removal
  const handleFilterRemove = useCallback((filterType, filterValue) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      switch (filterType) {
        case 'platform':
          newFilters.platforms = prev.platforms.filter(p => p !== filterValue);
          break;
        case 'campaignType':
          newFilters.campaignTypes = prev.campaignTypes.filter(c => c !== filterValue);
          break;
        case 'industry':
          newFilters.industries = prev.industries.filter(i => i !== filterValue);
          break;
        case 'status':
          newFilters.status = 'all';
          break;
        case 'contentRequirement':
          newFilters.contentRequirements = prev.contentRequirements.filter(c => c !== filterValue);
          break;
        case 'brandSize':
          newFilters.brandSizes = prev.brandSizes.filter(b => b !== filterValue);
          break;
        case 'country':
          newFilters.countries = prev.countries.filter(c => c !== filterValue);
          break;
        case 'campaignDuration':
          newFilters.campaignDuration = 'all';
          break;
        case 'budget':
          newFilters.minBudget = null;
          newFilters.maxBudget = null;
          break;
        default:
          break;
      }
      
      return newFilters;
    });
    setPage(1);
    setCampaigns([]);
    setIsInitialLoad(true);
  }, []);

  // Handle clear all filters
  const handleClearAll = useCallback(() => {
    setFilters({
      platforms: [],
      budgetRanges: [],
      campaignTypes: [],
      industries: [],
      status: 'all',
      contentRequirements: [],
      brandSizes: [],
      countries: [],
      campaignDuration: 'all',
      minBudget: null,
      maxBudget: null
    });
    setPage(1);
    setCampaigns([]);
    setIsInitialLoad(true);
  }, []);

  // State for cooldown tracking
  const [cooldownInfo, setCooldownInfo] = useState({});

  // Handle apply to campaign
  const handleApply = useCallback(async (campaign) => {
    try {
      // Create collaboration request
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/collaboration-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderType: 'influencer',
          senderId: 16, // This should come from auth context
          receiverType: 'brand',
          receiverId: 1, // This should come from the campaign's brand info
          campaignId: campaign.id,
          requestType: 'collaboration',
          message: `I'm interested in applying for the ${campaign.campaign_name} campaign.`
        })
      });
      
      if (!response.ok) {
        const result = await response.json();
        if (response.status === 409) {
          // Handle duplicate request or already selected gracefully
          const message = result.message || 'You have already applied to this campaign!';
          window.showToast(message, 'info');
          // Refresh sent requests and selected campaigns to update UI state
          fetchSentRequests();
          fetchSelectedCampaigns();
          return;
        } else if (response.status === 429) {
          // Handle cooldown period
          const cooldownData = result.data;
          const campaignKey = `${campaign.id}_${1}`; // campaignId_brandId
          setCooldownInfo(prev => ({
            ...prev,
            [campaignKey]: cooldownData
          }));
          window.showToast(result.message, 'warning');
          return;
        }
        throw new Error(result.message || 'Failed to submit collaboration request');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Show success message
        window.showToast(`Collaboration request submitted successfully for ${campaign.campaign_name}!`, 'success');

        // Refresh the sent requests and selected campaigns to update the UI
        fetchSentRequests();
        fetchSelectedCampaigns();
      } else {
        throw new Error(result.message || 'Failed to submit collaboration request');
      }
    } catch (error) {
      console.error('Error submitting collaboration request:', error);
      window.showToast(`Failed to submit collaboration request: ${error.message}`, 'error');
    }
  }, [fetchSentRequests, fetchSelectedCampaigns]);

  // Check cooldown status for a campaign
  const checkCooldownStatus = useCallback(async (campaignId, brandId) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/rejected-influencers/check?influencerId=16&brandId=${brandId}&campaignId=${campaignId}`);
      const result = await response.json();
      
      if (result.success && result.data.cooldownInfo?.isInCooldown) {
        const campaignKey = `${campaignId}_${brandId}`;
        setCooldownInfo(prev => ({
          ...prev,
          [campaignKey]: result.data.cooldownInfo
        }));
        return result.data.cooldownInfo;
      }
      return null;
    } catch (error) {
      console.error('Error checking cooldown status:', error);
      return null;
    }
  }, []);

  // Get cooldown info for a campaign
  const getCooldownInfo = useCallback((campaignId, brandId) => {
    const campaignKey = `${campaignId}_${brandId}`;
    return cooldownInfo[campaignKey] || null;
  }, [cooldownInfo]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchCampaigns(true);
  }, [debouncedSearchTerm, filters]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchCampaigns(false);
    }
  }, [page]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  // Initial load
  useEffect(() => {
    fetchCampaigns(true);
  }, []);

  // Fetch sent requests and selected campaigns on mount
  useEffect(() => {
    fetchSentRequests();
    fetchSelectedCampaigns();
  }, [fetchSentRequests, fetchSelectedCampaigns]);

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.platforms.length > 0) count += filters.platforms.length;
    if (filters.campaignTypes.length > 0) count += filters.campaignTypes.length;
    if (filters.industries.length > 0) count += filters.industries.length;
    if (filters.status !== 'all') count += 1;
    if (filters.contentRequirements.length > 0) count += filters.contentRequirements.length;
    if (filters.brandSizes.length > 0) count += filters.brandSizes.length;
    if (filters.countries.length > 0) count += filters.countries.length;
    if (filters.campaignDuration !== 'all') count += 1;
    if (filters.minBudget || filters.maxBudget) count += 1;
    return count;
  };

  const handleNotificationClick = () => {
    // Handle notification click
  };

  // Group campaigns by brand for display
  const groupCampaignsByBrand = (campaigns) => {
    const brandGroups = {};
    
    campaigns.forEach(campaign => {
      const brandName = campaign.brand_name || 'Unknown Brand';
      if (!brandGroups[brandName]) {
        brandGroups[brandName] = {
          brand: {
            id: campaign.id, // Using campaign id as brand id for now
            name: brandName,
            industry: campaign.vertical || 'General',
            logo_url: null
          },
          campaigns: []
        };
      }
      brandGroups[brandName].campaigns.push(campaign);
    });
    
    return Object.values(brandGroups);
  };

  // Check campaign status for the influencer
  const getCampaignStatus = useCallback((campaignId) => {
    // Check if already selected for this campaign
    if (selectedCampaigns.includes(campaignId)) {
      return 'selected';
    }
    
    // Check if there's a pending request for this campaign
    const pendingRequest = sentRequests.find(request => 
      request.campaign_id === campaignId && 
      request.status === 'pending' && 
      (request.request_type === 'collaboration' || request.request_type === 'campaign_assignment')
    );
    
    if (pendingRequest) {
      return 'pending';
    }
    
    return 'available';
  }, [sentRequests, selectedCampaigns]);

  // Legacy function for backward compatibility
  const isCampaignApplied = useCallback((campaignId) => {
    const status = getCampaignStatus(campaignId);
    return status === 'selected' || status === 'pending';
  }, [getCampaignStatus]);

  const brandsWithCampaigns = groupCampaignsByBrand(campaigns);

  return (
    <div className={`influencer-search-page ${sidebarOpen ? 'influencer-search-page--sidebar-open' : ''}`}>
      {/* Independent Notification Button */}
      <div className="influencer-search-notification-button">
        <NotificationSidebar 
          count={3} 
          onClick={handleNotificationClick}
          className="influencer-search-notification"
        />
      </div>

      <div className="influencer-search-page__main">
        <div className="influencer-search-page__container">
          {/* Header */}
          <div className="influencer-search-page__header">
            <div className="influencer-search-page__header-content">
              <h1 className="influencer-search-page__title">Discover Campaigns</h1>
              <p className="influencer-search-page__subtitle">
                Find amazing brands and campaigns to collaborate with
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="influencer-search-page__tabs">
            <button
              className={`influencer-search-page__tab ${activeTab === 'campaigns' ? 'influencer-search-page__tab--active' : ''}`}
              onClick={() => setActiveTab('campaigns')}
            >
              <svg className="influencer-search-page__tab-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Discover Campaigns
            </button>
            <button
              className={`influencer-search-page__tab ${activeTab === 'sent' ? 'influencer-search-page__tab--active' : ''}`}
              onClick={() => setActiveTab('sent')}
            >
              <svg className="influencer-search-page__tab-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
              Sent Requests
            </button>
            <button
              className={`influencer-search-page__tab ${activeTab === 'received' ? 'influencer-search-page__tab--active' : ''}`}
              onClick={() => setActiveTab('received')}
            >
              <svg className="influencer-search-page__tab-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Received Requests
            </button>
          </div>

          {/* Campaigns Tab Content */}
          {activeTab === 'campaigns' && (
            <>
              {/* Enhanced Toolbar */}
              <div className="influencer-search-page__toolbar">
                <div className="influencer-search-page__toolbar-left">
                  <button
                    className="influencer-search-page__filter-toggle"
                    onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
                    aria-label="Toggle filters"
                  >
                    <svg className="influencer-search-page__filter-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
                    </svg>
                    Filters
                    {getActiveFiltersCount() > 0 && (
                      <span className="influencer-search-page__filter-badge">
                        {getActiveFiltersCount()}
                      </span>
                    )}
                  </button>
                  
                  {getActiveFiltersCount() > 0 && (
                    <button
                      className="influencer-search-page__clear-filters"
                      onClick={handleClearAll}
                      aria-label="Clear all filters"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="influencer-search-page__toolbar-center">
                  {/* Search Bar */}
                  <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filters={filters}
                    onFilterRemove={handleFilterRemove}
                    onClearAll={handleClearAll}
                  />
                </div>

                <div className="influencer-search-page__toolbar-right">
                  {!isInitialLoad && !loading && (
                    <div className="influencer-search-page__results-count">
                      {campaigns.length} {campaigns.length === 1 ? 'campaign' : 'campaigns'} found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Campaigns Tab Content */}
          {activeTab === 'campaigns' && (
            <>
              {/* Enhanced Error State */}
              {error && (
                <div className="influencer-search-page__error">
                  <div className="influencer-search-page__error-icon">⚠️</div>
                  <p>{error}</p>
                  <button
                    className="influencer-search-page__retry"
                    onClick={() => fetchCampaigns(true)}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Enhanced Loading State */}
              {isInitialLoad && loading && (
                <div className="influencer-search-page__loading">
                  <div className="influencer-search-page__loading-spinner"></div>
                  <p>Discovering amazing campaigns...</p>
                </div>
              )}

              {/* Enhanced Results Grid */}
              {!isInitialLoad && !loading && brandsWithCampaigns.length > 0 && (
                <div className="influencer-search-page__grid">
                  {brandsWithCampaigns.map((brandData) => (
                    <BrandCampaignCard
                      key={brandData.brand.id}
                      brand={brandData.brand}
                      campaigns={brandData.campaigns}
                      onApply={handleApply}
                      isCampaignApplied={isCampaignApplied}
                      getCampaignStatus={getCampaignStatus}
                      getCooldownInfo={getCooldownInfo}
                      checkCooldownStatus={checkCooldownStatus}
                    />
                  ))}
                </div>
              )}

              {/* Enhanced No Results */}
              {!isInitialLoad && !loading && brandsWithCampaigns.length === 0 && !error && (
                <div className="influencer-search-page__no-results">
                  <div className="influencer-search-page__no-results-icon">🔍</div>
                  <h3>No campaigns found</h3>
                  <p>
                    {searchTerm || getActiveFiltersCount() > 0 
                      ? 'Try adjusting your search terms or filters'
                      : 'Start by searching for campaigns or adjusting your filters'
                    }
                  </p>
                  {(searchTerm || getActiveFiltersCount() > 0) && (
                    <button
                      className="influencer-search-page__clear-search"
                      onClick={() => {
                        setSearchTerm('');
                        handleClearAll();
                      }}
                    >
                      Clear search & filters
                    </button>
                  )}
                </div>
              )}

              {/* Enhanced Load More */}
              {!loading && hasMore && brandsWithCampaigns.length > 0 && (
                <div className="influencer-search-page__load-more">
                  <button
                    className="influencer-search-page__load-more-button"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    Load More Campaigns
                  </button>
                </div>
              )}

              {/* Enhanced Loading More */}
              {loading && !isInitialLoad && brandsWithCampaigns.length > 0 && (
                <div className="influencer-search-page__loading-more">
                  <div className="influencer-search-page__loading-spinner"></div>
                  <p>Loading more campaigns...</p>
                </div>
              )}
            </>
          )}

          {/* Sent Requests Tab Content */}
          {activeTab === 'sent' && (
            <div className="influencer-search-page__tab-content">
              <SentRequests userId={16} />
            </div>
          )}

          {/* Received Requests Tab Content */}
          {activeTab === 'received' && (
            <div className="influencer-search-page__tab-content">
              <ReceivedRequests userId={16} />
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Filter Sidebar */}
      <FilterSidebar
        isOpen={filterSidebarOpen}
        onClose={() => setFilterSidebarOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onFilterRemove={handleFilterRemove}
        onClearAll={handleClearAll}
      />
    </div>
  );
};

// PropTypes for type checking and documentation
InfluencerSearchPage.propTypes = {
  sidebarOpen: PropTypes.bool
};

export default InfluencerSearchPage; 