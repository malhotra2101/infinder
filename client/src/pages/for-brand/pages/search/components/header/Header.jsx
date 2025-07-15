import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getListCounts } from '../../../../services/backendApi';
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
 * @returns {JSX.Element} Header component
 */
const Header = ({ activeTab = 'all', onTabChange, onRefreshCounts }) => {
  const [listCounts, setListCounts] = useState({
    selected: 0,
    rejected: 0,
    suggested: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch list counts on component mount and when refresh is requested
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const counts = await getListCounts();
        setListCounts({
          selected: counts.selected || 0,
          rejected: counts.rejected || 0,
          suggested: 0 // We can add this later if needed
        });
      } catch (error) {
        console.error('Error fetching list counts:', error);
        // Use fallback counts
        setListCounts({
          selected: 0,
          rejected: 0,
          suggested: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [onRefreshCounts]);

  const tabs = [
    { id: 'all', label: 'All Influencers', count: null },
    { id: 'selected', label: 'Selected', count: listCounts.selected },
    { id: 'rejected', label: 'Rejected', count: listCounts.rejected },
    { id: 'suggested', label: 'Suggested', count: listCounts.suggested }
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
                disabled={loading}
              >
                <span className="search-header__tab-label">{tab.label}</span>
                {tab.count !== null && (
                  <span className="search-header__tab-count">
                    {loading ? '...' : tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Enhanced Actions Section */}
        <div className="search-header__actions">
          {/* Actions can be added here in the future */}
        </div>
      </div>
    </header>
  );
};

// PropTypes for type checking and documentation
Header.propTypes = {
  activeTab: PropTypes.oneOf(['all', 'selected', 'rejected', 'suggested']),
  onTabChange: PropTypes.func.isRequired,
  onRefreshCounts: PropTypes.func
};

export default Header; 