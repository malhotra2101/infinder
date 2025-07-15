import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCountries } from '../../../../services/backendApi';
import './FilterSidebar.css';

/**
 * FilterSidebar Component
 * 
 * Provides comprehensive filtering options for influencer search.
 * Includes platform selection, follower ranges, engagement rates, countries, etc.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.onFilterChange - Callback for filter changes
 * @param {boolean} props.isOpen - Whether sidebar is open
 * @param {Function} props.onClose - Callback to close sidebar
 * @returns {JSX.Element} FilterSidebar component
 */
const FilterSidebar = ({ filters, onFilterChange, isOpen, onClose }) => {
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Available platforms
  const platforms = [
    { id: 'instagram', label: 'Instagram', icon: '📷' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵' },
    { id: 'youtube', label: 'YouTube', icon: '📺' },
    { id: 'twitter', label: 'Twitter', icon: '🐦' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { id: 'facebook', label: 'Facebook', icon: '📘' }
  ];

  // Age groups
  const ageGroups = [
    { id: '13-17', label: '13-17 years' },
    { id: '18-24', label: '18-24 years' },
    { id: '25-34', label: '25-34 years' },
    { id: '35-44', label: '35-44 years' },
    { id: '45-54', label: '45-54 years' },
    { id: '55+', label: '55+ years' }
  ];

  // Last active options
  const lastActiveOptions = [
    { id: '1w', label: 'Last Week' },
    { id: '1m', label: 'Last Month' },
    { id: '3m', label: 'Last 3 Months' },
    { id: '1y', label: 'Last Year' }
  ];

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        // For now, use mock countries to avoid Supabase connection issues
        // In production, replace with: const countriesData = await getCountries();
        const countriesData = [
          { name: 'United States', code: 'USA' },
          { name: 'Canada', code: 'CAN' },
          { name: 'United Kingdom', code: 'GBR' },
          { name: 'Australia', code: 'AUS' },
          { name: 'Germany', code: 'DEU' },
          { name: 'France', code: 'FRA' },
          { name: 'Spain', code: 'ESP' },
          { name: 'Italy', code: 'ITA' },
          { name: 'Japan', code: 'JPN' },
          { name: 'South Korea', code: 'KOR' },
          { name: 'India', code: 'IND' },
          { name: 'Brazil', code: 'BRA' },
          { name: 'Mexico', code: 'MEX' },
          { name: 'Argentina', code: 'ARG' },
          { name: 'Chile', code: 'CHL' },
          { name: 'Colombia', code: 'COL' },
          { name: 'Peru', code: 'PER' },
          { name: 'Venezuela', code: 'VEN' },
          { name: 'Ecuador', code: 'ECU' },
          { name: 'Bolivia', code: 'BOL' },
          { name: 'Paraguay', code: 'PRY' },
          { name: 'Uruguay', code: 'URY' },
          { name: 'Guyana', code: 'GUY' },
          { name: 'Suriname', code: 'SUR' },
          { name: 'French Guiana', code: 'GUF' }
        ];
        setCountries(countriesData);
      } catch (error) {
        console.error('Error fetching countries:', error);
        // Use mock countries as fallback
        setCountries([
          { name: 'United States', code: 'USA' },
          { name: 'Canada', code: 'CAN' },
          { name: 'United Kingdom', code: 'GBR' },
          { name: 'Australia', code: 'AUS' },
          { name: 'Germany', code: 'DEU' },
          { name: 'France', code: 'FRA' },
          { name: 'Spain', code: 'ESP' },
          { name: 'Italy', code: 'ITA' },
          { name: 'Japan', code: 'JPN' },
          { name: 'South Korea', code: 'KOR' },
          { name: 'India', code: 'IND' },
          { name: 'Brazil', code: 'BRA' },
          { name: 'Mexico', code: 'MEX' },
          { name: 'Argentina', code: 'ARG' },
          { name: 'Chile', code: 'CHL' },
          { name: 'Colombia', code: 'COL' },
          { name: 'Peru', code: 'PER' },
          { name: 'Venezuela', code: 'VEN' },
          { name: 'Ecuador', code: 'ECU' },
          { name: 'Bolivia', code: 'BOL' },
          { name: 'Paraguay', code: 'PRY' },
          { name: 'Uruguay', code: 'URY' },
          { name: 'Guyana', code: 'GUY' },
          { name: 'Suriname', code: 'SUR' },
          { name: 'French Guiana', code: 'GUF' }
        ]);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Handle platform toggle
  const handlePlatformToggle = (platformId) => {
    const currentPlatforms = localFilters.platforms || [];
    const newPlatforms = currentPlatforms.includes(platformId)
      ? currentPlatforms.filter(p => p !== platformId)
      : [...currentPlatforms, platformId];
    
    setLocalFilters(prev => ({
      ...prev,
      platforms: newPlatforms
    }));
  };

  // Handle age group toggle
  const handleAgeGroupToggle = (ageGroupId) => {
    const currentAgeGroups = localFilters.ageGroups || [];
    const newAgeGroups = currentAgeGroups.includes(ageGroupId)
      ? currentAgeGroups.filter(ag => ag !== ageGroupId)
      : [...currentAgeGroups, ageGroupId];
    
    setLocalFilters(prev => ({
      ...prev,
      ageGroups: newAgeGroups
    }));
  };

  // Handle number input changes
  const handleNumberChange = (field, value) => {
    const numValue = value === '' ? null : Number(value);
    setLocalFilters(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  // Handle country change
  const handleCountryChange = (country) => {
    setLocalFilters(prev => ({
      ...prev,
      country: country || null
    }));
  };

  // Handle last active change
  const handleLastActiveChange = (lastActive) => {
    setLocalFilters(prev => ({
      ...prev,
      lastActive: lastActive || null
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    onClose();
  };

  // Clear all filters
  const handleClearAll = () => {
    const clearedFilters = {
      platforms: [],
      minFollowers: null,
      maxFollowers: null,
      minEngagement: null,
      maxEngagement: null,
      country: null,
      ageGroups: [],
      lastActive: null
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      (localFilters.platforms && localFilters.platforms.length > 0) ||
      localFilters.minFollowers ||
      localFilters.maxFollowers ||
      localFilters.minEngagement ||
      localFilters.maxEngagement ||
      localFilters.country ||
      (localFilters.ageGroups && localFilters.ageGroups.length > 0) ||
      localFilters.lastActive
    );
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="filter-sidebar__backdrop" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div className={`filter-sidebar ${isOpen ? 'filter-sidebar--open' : ''}`}>
        <div className="filter-sidebar__content">
          {/* Header */}
          <div className="filter-sidebar__header">
            <h2 className="filter-sidebar__title">Filters</h2>
            <button
              className="filter-sidebar__close"
              onClick={onClose}
              aria-label="Close filters"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          {/* Filter Sections */}
          <div className="filter-sidebar__body">
            {/* Platforms */}
            <div className="filter-section">
              <h3 className="filter-section__title"><span role="img" aria-label="platforms">🔗</span> Platforms</h3>
              <div className="filter-section__content">
                {platforms.map((platform) => (
                  <label key={platform.id} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={(localFilters.platforms || []).includes(platform.id)}
                      onChange={() => handlePlatformToggle(platform.id)}
                    />
                    <span className="filter-checkbox__label">
                      <span className="filter-checkbox__icon">{platform.icon}</span>
                      {platform.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Followers Range */}
            <div className="filter-section">
              <h3 className="filter-section__title"><span role="img" aria-label="followers">👥</span> Followers</h3>
              <div className="filter-section__content">
                <div className="filter-range">
                  <div className="filter-range__input-group">
                    <label className="filter-range__label">Min</label>
                    <input
                      type="number"
                      className="filter-range__input"
                      placeholder="0"
                      value={localFilters.minFollowers || ''}
                      onChange={(e) => handleNumberChange('minFollowers', e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="filter-range__separator">to</div>
                  <div className="filter-range__input-group">
                    <label className="filter-range__label">Max</label>
                    <input
                      type="number"
                      className="filter-range__input"
                      placeholder="∞"
                      value={localFilters.maxFollowers || ''}
                      onChange={(e) => handleNumberChange('maxFollowers', e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="filter-section">
              <h3 className="filter-section__title"><span role="img" aria-label="engagement">💬</span> Engagement Rate (%)</h3>
              <div className="filter-section__content">
                <div className="filter-range">
                  <div className="filter-range__input-group">
                    <label className="filter-range__label">Min</label>
                    <input
                      type="number"
                      className="filter-range__input"
                      placeholder="0"
                      value={localFilters.minEngagement || ''}
                      onChange={(e) => handleNumberChange('minEngagement', e.target.value)}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <div className="filter-range__separator">to</div>
                  <div className="filter-range__input-group">
                    <label className="filter-range__label">Max</label>
                    <input
                      type="number"
                      className="filter-range__input"
                      placeholder="100"
                      value={localFilters.maxEngagement || ''}
                      onChange={(e) => handleNumberChange('maxEngagement', e.target.value)}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Country */}
            <div className="filter-section">
              <h3 className="filter-section__title"><span role="img" aria-label="country">🌍</span> Country</h3>
              <div className="filter-section__content">
                <div style={{ position: 'relative' }}>
                  <select
                    className="filter-select"
                    value={localFilters.country || ''}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    disabled={loadingCountries}
                  >
                    <option value="">All Countries</option>
                    {loadingCountries ? (
                      <option value="" disabled>Loading countries...</option>
                    ) : (
                      countries.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))
                    )}
                  </select>
                  {loadingCountries && (
                    <span className="filter-spinner" style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)'}}>
                      <svg width="18" height="18" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#6366f1" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/></circle></svg>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Age Groups */}
            <div className="filter-section">
              <h3 className="filter-section__title"><span role="img" aria-label="age">🎂</span> Age Groups</h3>
              <div className="filter-section__content">
                {ageGroups.map((ageGroup) => (
                  <label key={ageGroup.id} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={(localFilters.ageGroups || []).includes(ageGroup.id)}
                      onChange={() => handleAgeGroupToggle(ageGroup.id)}
                    />
                    <span className="filter-checkbox__label">
                      {ageGroup.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Last Active */}
            <div className="filter-section">
              <h3 className="filter-section__title"><span role="img" aria-label="last active">⏰</span> Last Active</h3>
              <div className="filter-section__content">
                <select
                  className="filter-select"
                  value={localFilters.lastActive || ''}
                  onChange={(e) => handleLastActiveChange(e.target.value)}
                >
                  <option value="">Anytime</option>
                  {lastActiveOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="filter-sidebar__footer">
            <button
              className="filter-sidebar__clear"
              onClick={handleClearAll}
              disabled={!hasActiveFilters()}
            >
              Clear All
            </button>
            <button
              className="filter-sidebar__apply"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// PropTypes for type checking and documentation
FilterSidebar.propTypes = {
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
  onFilterChange: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default FilterSidebar; 