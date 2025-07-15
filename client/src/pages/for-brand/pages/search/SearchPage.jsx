import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from '../../utils/useDebounce';
import { searchInfluencers, getInfluencersByListType, addToList, removeFromList } from '../../services/backendApi';
import Header from './components/header/Header';
import SearchBar from './components/search-bar/SearchBar';
import FilterSidebar from './components/filter-sidebar/FilterSidebar';
import InfluencerCard from './components/influencer-card/InfluencerCard';
import NotificationButton from '../../components/notification/NotificationButton';
import './SearchPage.css';

/**
 * Enhanced Search Page Component
 * 
 * Main search page with advanced filtering, infinite scroll, and real-time updates.
 * Features modern UI with smooth animations and responsive design.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.sidebarOpen - Whether sidebar is open
 * @returns {JSX.Element} Search page component
 */
const SearchPage = ({ sidebarOpen = false }) => {
  // State management
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    platforms: [],
    minFollowers: null,
    maxFollowers: null,
    minEngagement: null,
    maxEngagement: null,
    country: null,
    ageGroups: [],
    lastActive: null
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [rejectedIds, setRejectedIds] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [refreshCounts, setRefreshCounts] = useState(0);

  // Debounced search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch influencers function
  const fetchInfluencers = useCallback(async (isNewSearch = false, tabOverride = null) => {
    try {
      setLoading(true);
      setError(null);

      const tab = tabOverride || activeTab;
      if (tab === 'selected' || tab === 'rejected') {
        // Fetch accepted/rejected influencers
        const list = await getInfluencersByListType(tab === 'selected' ? 'selected' : 'rejected');
        setInfluencers(list);
        setHasMore(false);
        setPage(1);
      } else {
        // Normal search
        try {
          const currentPage = isNewSearch ? 1 : page;
          const result = await searchInfluencers({
            searchTerm: debouncedSearchTerm,
            filters,
            page: currentPage,
            limit: 20
          });
          if (isNewSearch) {
            setInfluencers(result.data);
            setPage(1);
          } else {
            setInfluencers(prev => [...prev, ...result.data]);
          }
          setHasMore(result.hasMore);
        } catch (apiError) {
          console.log('SearchPage: API error, no data available');
          setInfluencers([]);
          setHasMore(false);
        }
      }
      setIsInitialLoad(false);
    } catch (err) {
      console.error('Error fetching influencers:', err);
      setError('Failed to load influencers. Please try again.');
      setIsInitialLoad(false);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, filters, page, activeTab]);

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
    setInfluencers([]);
    setIsInitialLoad(true);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setInfluencers([]);
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
        case 'followers':
          newFilters.minFollowers = null;
          newFilters.maxFollowers = null;
          break;
        case 'engagement':
          newFilters.minEngagement = null;
          newFilters.maxEngagement = null;
          break;
        case 'country':
          newFilters.country = null;
          break;
        case 'ageGroup':
          newFilters.ageGroups = prev.ageGroups.filter(ag => ag !== filterValue);
          break;
        case 'lastActive':
          newFilters.lastActive = null;
          break;
        default:
          break;
      }
      
      return newFilters;
    });
    setPage(1);
    setInfluencers([]);
    setIsInitialLoad(true);
  }, []);

  // Handle clear all filters
  const handleClearAll = useCallback(() => {
    setFilters({
      platforms: [],
      minFollowers: null,
      maxFollowers: null,
      minEngagement: null,
      maxEngagement: null,
      country: null,
      ageGroups: [],
      lastActive: null
    });
    setPage(1);
    setInfluencers([]);
    setIsInitialLoad(true);
  }, []);

  // Handle card actions
  const handleCardAction = useCallback((action, data) => {
    console.log('SearchPage: Card action:', action, data);
    switch (action) {
      case 'added':
        // Backend now handles exclusivity automatically - just add to selected
        addToList(data.influencer, 'selected')
          .then(() => {
            // Update local state immediately
            setSelectedIds(prev => [...prev, data.influencer.id]);
            // Remove from rejected if it was there
            setRejectedIds(prev => prev.filter(id => id !== data.influencer.id));
            // If in rejected tab, remove from current view
            if (activeTab === 'rejected') {
              setInfluencers(prev => prev.filter(inf => inf.id !== data.influencer.id));
            }
            setRefreshCounts(prev => prev + 1);
          })
          .catch(error => {
            console.error('Failed to add to selected list:', error);
          });
        break;
      case 'rejected':
        // Backend now handles exclusivity automatically - just add to rejected
        addToList(data.influencer, 'rejected')
          .then(() => {
            // Update local state immediately
            setRejectedIds(prev => [...prev, data.influencer.id]);
            // Remove from selected if it was there
            setSelectedIds(prev => prev.filter(id => id !== data.influencer.id));
            // If in selected tab, remove from current view
            if (activeTab === 'selected') {
              setInfluencers(prev => prev.filter(inf => inf.id !== data.influencer.id));
            }
            setRefreshCounts(prev => prev + 1);
          })
          .catch(error => {
            console.error('Failed to add to rejected list:', error);
          });
        break;
      case 'contact':
        console.log('Contact:', data);
        // You can open contact modal here
        break;
      case 'error':
        console.error('Card action error:', data);
        // You can add error toast here
        break;
    }
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setPage(1);
    setInfluencers([]);
    setIsInitialLoad(true);
    if (tab === 'selected' || tab === 'rejected') {
      fetchInfluencers(true, tab);
    } else {
      fetchInfluencers(true, tab);
    }
  }, [fetchInfluencers]);

  // Fetch influencers when dependencies change
  useEffect(() => {
    if (activeTab === 'all') {
      fetchInfluencers(true, 'all');
    }
  }, [debouncedSearchTerm, filters]);

  // Load more when page changes (only for 'all' tab)
  useEffect(() => {
    if (activeTab === 'all' && page > 1) {
      fetchInfluencers(false, 'all');
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
    fetchInfluencers(true, 'all');
  }, []);

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.platforms.length > 0) count += filters.platforms.length;
    if (filters.minFollowers || filters.maxFollowers) count += 1;
    if (filters.minEngagement || filters.maxEngagement) count += 1;
    if (filters.country) count += 1;
    if (filters.ageGroups.length > 0) count += filters.ageGroups.length;
    if (filters.lastActive) count += 1;
    return count;
  };

  const handleNotificationClick = () => {
    console.log('Search page notification clicked');
  };

  return (
    <div className={`search-page ${sidebarOpen ? 'search-page--sidebar-open' : ''}`}>
      {/* Independent Notification Button */}
      <div className="search-notification-button">
        <NotificationButton 
          count={3} 
          onClick={handleNotificationClick}
          className="search-notification"
        />
      </div>

      <div className="search-page__main">
        <div className="search-page__container">
          {/* Enhanced Header */}
          <Header 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onRefreshCounts={() => setRefreshCounts(prev => prev + 1)}
          />

          {/* Enhanced Toolbar */}
          <div className="search-page__toolbar">
            <div className="search-page__toolbar-left">
              <button
                className="search-page__filter-toggle"
                onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
                aria-label="Toggle filters"
              >
                <svg className="search-page__filter-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
                </svg>
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="search-page__filter-badge">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
              
              {getActiveFiltersCount() > 0 && (
                <button
                  className="search-page__clear-filters"
                  onClick={handleClearAll}
                  aria-label="Clear all filters"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="search-page__toolbar-right">
              {!isInitialLoad && !loading && (
                <div className="search-page__results-count">
                  {influencers.length} {influencers.length === 1 ? 'influencer' : 'influencers'} found
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Error State */}
          {error && (
            <div className="search-page__error">
              <div className="search-page__error-icon">⚠️</div>
              <p>{error}</p>
              <button
                className="search-page__retry"
                onClick={() => fetchInfluencers(true)}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Enhanced Loading State */}
          {isInitialLoad && loading && (
            <div className="search-page__loading">
              <div className="search-page__loading-spinner"></div>
              <p>Discovering amazing influencers...</p>
            </div>
          )}

          {/* Enhanced Results Grid */}
          {!isInitialLoad && !loading && influencers.length > 0 && (
            <div className="search-page__grid">
              {influencers.map((influencer) => (
                <InfluencerCard
                  key={influencer.id}
                  influencer={influencer}
                  onAction={handleCardAction}
                  isSelected={selectedIds.includes(influencer.id)}
                  isRejected={rejectedIds.includes(influencer.id)}
                  activeTab={activeTab}
                />
              ))}
            </div>
          )}

          {/* Enhanced No Results */}
          {!isInitialLoad && !loading && influencers.length === 0 && !error && (
            <div className="search-page__no-results">
              <div className="search-page__no-results-icon">🔍</div>
              <h3>No influencers found</h3>
              <p>
                {searchTerm || getActiveFiltersCount() > 0 
                  ? 'Try adjusting your search terms or filters'
                  : 'Start by searching for influencers or adjusting your filters'
                }
              </p>
              {(searchTerm || getActiveFiltersCount() > 0) && (
                <button
                  className="search-page__clear-search"
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
          {!loading && hasMore && influencers.length > 0 && (
            <div className="search-page__load-more">
              <button
                className="search-page__load-more-button"
                onClick={loadMore}
                disabled={loading}
              >
                Load More Influencers
              </button>
            </div>
          )}

          {/* Enhanced Loading More */}
          {loading && !isInitialLoad && influencers.length > 0 && (
            <div className="search-page__loading-more">
              <div className="search-page__loading-spinner"></div>
              <p>Loading more influencers...</p>
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
SearchPage.propTypes = {
  sidebarOpen: PropTypes.bool
};

export default SearchPage; 