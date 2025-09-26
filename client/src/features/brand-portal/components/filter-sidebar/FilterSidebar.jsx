import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './FilterSidebar.css';

/**
 * Enhanced FilterSidebar Component for Brands
 * 
 * Provides comprehensive filtering options for influencer search with modern UI.
 * Includes platform selection, follower ranges, engagement rates, demographics, etc.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.onFilterChange - Callback for filter changes
 * @param {boolean} props.isOpen - Whether sidebar is open
 * @param {Function} props.onClose - Callback to close sidebar
 * @returns {JSX.Element} FilterSidebar component
 */
const FilterSidebar = ({ filters, onFilterChange, isOpen, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Available platforms with engagement rates
  const platforms = [
    { id: 'instagram', label: 'Instagram', icon: '📷', avgEngagement: '2.4%' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵', avgEngagement: '4.2%' },
    { id: 'youtube', label: 'YouTube', icon: '📺', avgEngagement: '1.8%' },
    { id: 'twitter', label: 'Twitter', icon: '🐦', avgEngagement: '1.2%' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼', avgEngagement: '1.5%' },
    { id: 'facebook', label: 'Facebook', icon: '📘', avgEngagement: '1.1%' }
  ];

  // Follower range options
  const followerRanges = [
    { id: 'nano', label: 'Nano (1K-10K)', min: 1000, max: 10000, icon: '🌟' },
    { id: 'micro', label: 'Micro (10K-50K)', min: 10000, max: 50000, icon: '⭐' },
    { id: 'mid', label: 'Mid (50K-500K)', min: 50000, max: 500000, icon: '💫' },
    { id: 'macro', label: 'Macro (500K-1M)', min: 500000, max: 1000000, icon: '✨' },
    { id: 'mega', label: 'Mega (1M+)', min: 1000000, max: null, icon: '🔥' }
  ];

  // Engagement rate ranges
  const engagementRanges = [
    { id: 'low', label: 'Low (< 2%)', min: 0, max: 2, icon: '📉' },
    { id: 'medium', label: 'Medium (2-5%)', min: 2, max: 5, icon: '📊' },
    { id: 'high', label: 'High (5-10%)', min: 5, max: 10, icon: '📈' },
    { id: 'very-high', label: 'Very High (10%+)', min: 10, max: null, icon: '🚀' }
  ];

  // Content categories
  const contentCategories = [
    { id: 'fashion', label: 'Fashion & Beauty', icon: '👗', color: '#FF6B9D' },
    { id: 'technology', label: 'Technology', icon: '💻', color: '#4ECDC4' },
    { id: 'health', label: 'Health & Fitness', icon: '💪', color: '#45B7D1' },
    { id: 'food', label: 'Food & Beverage', icon: '🍕', color: '#96CEB4' },
    { id: 'travel', label: 'Travel', icon: '✈️', color: '#FFEAA7' },
    { id: 'gaming', label: 'Gaming', icon: '🎮', color: '#DDA0DD' },
    { id: 'education', label: 'Education', icon: '📚', color: '#98D8C8' },
    { id: 'finance', label: 'Finance', icon: '💰', color: '#F7DC6F' },
    { id: 'automotive', label: 'Automotive', icon: '🚗', color: '#BB8FCE' },
    { id: 'sports', label: 'Sports', icon: '⚽', color: '#85C1E9' },
    { id: 'lifestyle', label: 'Lifestyle', icon: '🏠', color: '#F8C471' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#EC7063' }
  ];

  // Demographics
  const ageGroups = [
    { id: '13-17', label: 'Teens (13-17)', icon: '👶' },
    { id: '18-24', label: 'Young Adults (18-24)', icon: '🎓' },
    { id: '25-34', label: 'Millennials (25-34)', icon: '💼' },
    { id: '35-44', label: 'Gen X (35-44)', icon: '👨‍👩‍👧‍👦' },
    { id: '45-54', label: 'Gen X (45-54)', icon: '🏠' },
    { id: '55+', label: 'Boomers (55+)', icon: '👴' }
  ];

  const genders = [
    { id: 'male', label: 'Male', icon: '👨' },
    { id: 'female', label: 'Female', icon: '👩' },
    { id: 'non-binary', label: 'Non-binary', icon: '🌈' }
  ];

  // Location options
  const countries = [
    { id: 'us', label: 'United States', icon: '🇺🇸' },
    { id: 'uk', label: 'United Kingdom', icon: '🇬🇧' },
    { id: 'ca', label: 'Canada', icon: '🇨🇦' },
    { id: 'au', label: 'Australia', icon: '🇦🇺' },
    { id: 'de', label: 'Germany', icon: '🇩🇪' },
    { id: 'fr', label: 'France', icon: '🇫🇷' },
    { id: 'in', label: 'India', icon: '🇮🇳' },
    { id: 'br', label: 'Brazil', icon: '🇧🇷' },
    { id: 'mx', label: 'Mexico', icon: '🇲🇽' },
    { id: 'jp', label: 'Japan', icon: '🇯🇵' }
  ];

  // Collaboration status
  const collaborationStatus = [
    { id: 'none', label: 'No Collaboration', icon: '⚪', color: '#E5E7EB' },
    { id: 'pending', label: 'Request Pending', icon: '🟡', color: '#FCD34D' },
    { id: 'accepted', label: 'Collaborating', icon: '🟢', color: '#10B981' },
    { id: 'rejected', label: 'Request Rejected', icon: '🔴', color: '#EF4444' }
  ];

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Handle multi-select toggles
  const handleMultiToggle = (field, value) => {
    const currentValues = localFilters[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setLocalFilters(prev => ({
      ...prev,
      [field]: newValues
    }));
  };

  // Handle single select
  const handleSingleToggle = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle range inputs
  const handleRangeChange = (field, value) => {
    const numValue = value === '' ? null : Number(value);
    setLocalFilters(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  // Handle follower range selection
  const handleFollowerRangeToggle = (rangeId) => {
    const range = followerRanges.find(r => r.id === rangeId);
    setLocalFilters(prev => ({
      ...prev,
      minFollowers: range.min,
      maxFollowers: range.max
    }));
  };

  // Handle engagement range selection
  const handleEngagementRangeToggle = (rangeId) => {
    const range = engagementRanges.find(r => r.id === rangeId);
    setLocalFilters(prev => ({
      ...prev,
      minEngagement: range.min,
      maxEngagement: range.max
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
      followerRanges: [],
      engagementRanges: [],
      contentCategories: [],
      ageGroups: [],
      genders: [],
      countries: [],
      collaborationStatus: 'none',
      minFollowers: null,
      maxFollowers: null,
      minEngagement: null,
      maxEngagement: null,
      lastActive: null
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      (localFilters.platforms && localFilters.platforms.length > 0) ||
      (localFilters.contentCategories && localFilters.contentCategories.length > 0) ||
      (localFilters.ageGroups && localFilters.ageGroups.length > 0) ||
      (localFilters.genders && localFilters.genders.length > 0) ||
      (localFilters.countries && localFilters.countries.length > 0) ||
      (localFilters.collaborationStatus && localFilters.collaborationStatus !== 'none') ||
      localFilters.minFollowers ||
      localFilters.maxFollowers ||
      localFilters.minEngagement ||
      localFilters.maxEngagement ||
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
            <div className="filter-sidebar__header-content">
              <h2 className="filter-sidebar__title">
                <span className="filter-sidebar__title-icon">🔍</span>
                Find Influencers
              </h2>
              <p className="filter-sidebar__subtitle">Refine your search</p>
            </div>
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
              <h3 className="filter-section__title">
                <span className="filter-section__icon">📱</span>
                Social Platforms
              </h3>
              <div className="filter-section__content">
                {platforms.map((platform) => (
                  <label key={platform.id} className="filter-checkbox filter-checkbox--platform">
                    <input
                      type="checkbox"
                      checked={(localFilters.platforms || []).includes(platform.id)}
                      onChange={() => handleMultiToggle('platforms', platform.id)}
                    />
                    <span className="filter-checkbox__label">
                      <span className="filter-checkbox__icon">{platform.icon}</span>
                      <span className="filter-checkbox__text">
                        <span className="filter-checkbox__name">{platform.label}</span>
                        <span className="filter-checkbox__meta">Avg: {platform.avgEngagement}</span>
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Follower Range */}
            <div className="filter-section">
              <h3 className="filter-section__title">
                <span className="filter-section__icon">👥</span>
                Follower Range
              </h3>
              <div className="filter-section__content">
                {followerRanges.map((range) => (
                  <label key={range.id} className="filter-checkbox">
                    <input
                      type="radio"
                      name="followerRange"
                      checked={localFilters.minFollowers === range.min && localFilters.maxFollowers === range.max}
                      onChange={() => handleFollowerRangeToggle(range.id)}
                    />
                    <span className="filter-checkbox__label">
                      <span className="filter-checkbox__icon">{range.icon}</span>
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="filter-section">
              <h3 className="filter-section__title">
                <span className="filter-section__icon">📊</span>
                Engagement Rate
              </h3>
              <div className="filter-section__content">
                {engagementRanges.map((range) => (
                  <label key={range.id} className="filter-checkbox">
                    <input
                      type="radio"
                      name="engagementRange"
                      checked={localFilters.minEngagement === range.min && localFilters.maxEngagement === range.max}
                      onChange={() => handleEngagementRangeToggle(range.id)}
                    />
                    <span className="filter-checkbox__label">
                      <span className="filter-checkbox__icon">{range.icon}</span>
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Categories */}
            <div className="filter-section">
              <h3 className="filter-section__title">
                <span className="filter-section__icon">🎯</span>
                Content Categories
              </h3>
              <div className="filter-section__content filter-section__content--grid">
                {contentCategories.map((category) => (
                  <label key={category.id} className="filter-checkbox filter-checkbox--category">
                    <input
                      type="checkbox"
                      checked={(localFilters.contentCategories || []).includes(category.id)}
                      onChange={() => handleMultiToggle('contentCategories', category.id)}
                    />
                    <span className="filter-checkbox__label" style={{'--category-color': category.color}}>
                      <span className="filter-checkbox__icon">{category.icon}</span>
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Demographics */}
            <div className="filter-section">
              <h3 className="filter-section__title">
                <span className="filter-section__icon">👤</span>
                Demographics
              </h3>
              
              {/* Age Groups */}
              <div className="filter-subsection">
                <h4 className="filter-subsection__title">Age Groups</h4>
                <div className="filter-section__content filter-section__content--grid">
                  {ageGroups.map((age) => (
                    <label key={age.id} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={(localFilters.ageGroups || []).includes(age.id)}
                        onChange={() => handleMultiToggle('ageGroups', age.id)}
                      />
                      <span className="filter-checkbox__label">
                        <span className="filter-checkbox__icon">{age.icon}</span>
                        {age.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="filter-subsection">
                <h4 className="filter-subsection__title">Gender</h4>
                <div className="filter-section__content">
                  {genders.map((gender) => (
                    <label key={gender.id} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={(localFilters.genders || []).includes(gender.id)}
                        onChange={() => handleMultiToggle('genders', gender.id)}
                      />
                      <span className="filter-checkbox__label">
                        <span className="filter-checkbox__icon">{gender.icon}</span>
                        {gender.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="filter-section">
              <h3 className="filter-section__title">
                <span className="filter-section__icon">🌍</span>
                Location
              </h3>
              <div className="filter-section__content filter-section__content--grid">
                {countries.map((country) => (
                  <label key={country.id} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={(localFilters.countries || []).includes(country.id)}
                      onChange={() => handleMultiToggle('countries', country.id)}
                    />
                    <span className="filter-checkbox__label">
                      <span className="filter-checkbox__icon">{country.icon}</span>
                      {country.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Collaboration Status */}
            <div className="filter-section">
              <h3 className="filter-section__title">
                <span className="filter-section__icon">🤝</span>
                Collaboration Status
              </h3>
              <div className="filter-section__content">
                {collaborationStatus.map((status) => (
                  <label key={status.id} className="filter-checkbox">
                    <input
                      type="radio"
                      name="collaborationStatus"
                      checked={localFilters.collaborationStatus === status.id}
                      onChange={() => handleSingleToggle('collaborationStatus', status.id)}
                    />
                    <span className="filter-checkbox__label" style={{'--status-color': status.color}}>
                      <span className="filter-checkbox__icon">{status.icon}</span>
                      {status.label}
                    </span>
                  </label>
                ))}
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
              <span className="filter-sidebar__clear-icon">🗑️</span>
              Clear All
            </button>
            <button
              className="filter-sidebar__apply"
              onClick={handleApplyFilters}
            >
              <span className="filter-sidebar__apply-icon">✅</span>
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
    followerRanges: PropTypes.arrayOf(PropTypes.string),
    engagementRanges: PropTypes.arrayOf(PropTypes.string),
    contentCategories: PropTypes.arrayOf(PropTypes.string),
    ageGroups: PropTypes.arrayOf(PropTypes.string),
    genders: PropTypes.arrayOf(PropTypes.string),
    countries: PropTypes.arrayOf(PropTypes.string),
    collaborationStatus: PropTypes.string,
    minFollowers: PropTypes.number,
    maxFollowers: PropTypes.number,
    minEngagement: PropTypes.number,
    maxEngagement: PropTypes.number,
    lastActive: PropTypes.string
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default FilterSidebar; 