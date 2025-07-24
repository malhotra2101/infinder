import React from 'react';
import PropTypes from 'prop-types';
import { useListCounts } from '../../../shared/hooks/useListCounts.js';
import './Header.css';

/**
 * Enhanced Header Component for Search Page
 * 
 * Displays the search page header with modern UI, tabs for different list categories.
 * 
 * @param {Object} props - Component props
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.onTabChange - Callback for tab changes
 * @param {Function} props.onRefreshCounts - Callback to refresh counts
 * @param {string} props.requestType - Type of requests to show ('sent' or 'received')
 * @param {Function} props.onRequestTypeChange - Callback for request type changes
 * @returns {JSX.Element} Header component
 */
const Header = ({ activeTab = 'all', onTabChange, onRefreshCounts, requestType = 'sent', onRequestTypeChange }) => {
  const { listCounts, loading, error } = useListCounts(onRefreshCounts);

  const tabs = [
    { id: 'all', label: 'All Influencers', count: null },
    { id: 'selected', label: 'Selected', count: listCounts.selected },
    { id: 'requests', label: 'Requests', count: null }
  ];

  return (
    <header className="search-header">
      <div className="search-header__container">
        {/* Enhanced Title Section */}
        <div className="search-header__title">
          <div className="search-header__title-content">
            <h1 className="search-header__heading">
              <span className="search-header__heading-icon">🎯</span>
              Find Influencers
            </h1>
            <p className="search-header__subtitle">
              Discover the perfect influencers for your brand
            </p>
          </div>
          

        </div>

        {/* Enhanced Tabs Section */}
        <div className="search-header__tabs">
          <nav className="search-header__nav" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`search-header__tab ${activeTab === tab.id ? 'search-header__tab--active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
              >
                <span className="search-header__tab-label">{tab.label}</span>
                {tab.count !== null && (
                  <span className="search-header__tab-count">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Enhanced Actions Section */}
        <div className="search-header__actions">
          {/* Request Type Toggle for Requests Tab */}
          {activeTab === 'requests' && onRequestTypeChange && (
            <div className="search-header__request-toggle">
              <button
                className={`search-header__toggle-btn ${requestType === 'sent' ? 'search-header__toggle-btn--active' : ''}`}
                onClick={() => onRequestTypeChange('sent')}
              >
                Sent
              </button>
              <button
                className={`search-header__toggle-btn ${requestType === 'received' ? 'search-header__toggle-btn--active' : ''}`}
                onClick={() => onRequestTypeChange('received')}
              >
                Received
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// PropTypes for type checking and documentation
Header.propTypes = {
  activeTab: PropTypes.oneOf(['all', 'selected', 'requests']),
  onTabChange: PropTypes.func.isRequired,
  onRefreshCounts: PropTypes.func,
  requestType: PropTypes.oneOf(['sent', 'received']),
  onRequestTypeChange: PropTypes.func
};

export default Header; 