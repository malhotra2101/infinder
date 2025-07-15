import React from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

/**
 * SearchBar Component
 * 
 * Provides search functionality with debounced input and filter pills display.
 * 
 * @param {Object} props - Component props
 * @param {string} props.searchTerm - Current search term
 * @param {Function} props.onSearchChange - Callback for search term changes
 * @param {Object} props.filters - Current active filters
 * @param {Function} props.onFilterRemove - Callback to remove individual filters
 * @param {Function} props.onClearAll - Callback to clear all filters
 * @returns {JSX.Element} SearchBar component
 */
const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterRemove, 
  onClearAll 
}) => {
  // Get active filter pills
  const getActiveFilters = () => {
    const activeFilters = [];

    // Platform filters
    if (filters.platforms && filters.platforms.length > 0) {
      filters.platforms.forEach(platform => {
        activeFilters.push({
          key: `platform-${platform}`,
          label: platform,
          type: 'platform',
          value: platform
        });
      });
    }

    // Follower range
    if (filters.minFollowers || filters.maxFollowers) {
      const min = filters.minFollowers ? `${filters.minFollowers.toLocaleString()}+` : '';
      const max = filters.maxFollowers ? `-${filters.maxFollowers.toLocaleString()}` : '';
      if (min || max) {
        activeFilters.push({
          key: 'followers',
          label: `Followers: ${min}${max}`,
          type: 'followers',
          value: 'followers'
        });
      }
    }

    // Engagement range
    if (filters.minEngagement || filters.maxEngagement) {
      const min = filters.minEngagement ? `${filters.minEngagement}%+` : '';
      const max = filters.maxEngagement ? `-${filters.maxEngagement}%` : '';
      if (min || max) {
        activeFilters.push({
          key: 'engagement',
          label: `Engagement: ${min}${max}`,
          type: 'engagement',
          value: 'engagement'
        });
      }
    }

    // Country
    if (filters.country) {
      activeFilters.push({
        key: 'country',
        label: filters.country,
        type: 'country',
        value: filters.country
      });
    }

    // Age groups
    if (filters.ageGroups && filters.ageGroups.length > 0) {
      filters.ageGroups.forEach(ageGroup => {
        activeFilters.push({
          key: `age-${ageGroup}`,
          label: ageGroup,
          type: 'ageGroup',
          value: ageGroup
        });
      });
    }

    // Last active
    if (filters.lastActive) {
      const labels = {
        '1w': 'Last Week',
        '1m': 'Last Month',
        '3m': 'Last 3 Months',
        '1y': 'Last Year'
      };
      activeFilters.push({
        key: 'lastActive',
        label: labels[filters.lastActive] || filters.lastActive,
        type: 'lastActive',
        value: filters.lastActive
      });
    }

    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="search-bar">
      <div className="search-bar__container">
        {/* Search Input */}
        <div className="search-bar__input-group">
          <div className="search-bar__input-wrapper">
            <svg className="search-bar__search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              className="search-bar__input"
              placeholder="Search influencers by name, category, or location..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search influencers"
            />
            {searchTerm && (
              <button
                className="search-bar__clear-button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Pills */}
        {activeFilters.length > 0 && (
          <div className="search-bar__filters">
            <div className="search-bar__filters-list">
              {activeFilters.map((filter) => (
                <div key={filter.key} className="search-bar__filter-pill">
                  <span className="search-bar__filter-label">{filter.label}</span>
                  <button
                    className="search-bar__filter-remove"
                    onClick={() => onFilterRemove(filter.type, filter.value)}
                    aria-label={`Remove ${filter.label} filter`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              className="search-bar__clear-all"
              onClick={onClearAll}
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// PropTypes for type checking and documentation
SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    platforms: PropTypes.arrayOf(PropTypes.string),
    minFollowers: PropTypes.number,
    maxFollowers: PropTypes.number,
    minEngagement: PropTypes.number,
    maxEngagement: PropTypes.number,
    country: PropTypes.string,
    ageGroups: PropTypes.arrayOf(PropTypes.string),
    lastActive: PropTypes.string
  }).isRequired,
  onFilterRemove: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired
};

export default SearchBar; 