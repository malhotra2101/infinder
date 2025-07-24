import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './FilterSidebar.css';

/**
 * Enhanced FilterSidebar Component for Influencers
 * 
 * Provides comprehensive filtering options for campaign discovery with modern UI.
 * Includes platform selection, budget ranges, campaign types, industries, etc.
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

  // Available platforms for campaigns
  const platforms = [
    { id: 'instagram', label: 'Instagram', icon: '📷', avgBudget: '$500-2K' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵', avgBudget: '$300-1.5K' },
    { id: 'youtube', label: 'YouTube', icon: '📺', avgBudget: '$1K-5K' },
    { id: 'twitter', label: 'Twitter', icon: '🐦', avgBudget: '$200-1K' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼', avgBudget: '$800-3K' },
    { id: 'facebook', label: 'Facebook', icon: '📘', avgBudget: '$400-2K' }
  ];

  // Budget range options
  const budgetRanges = [
    { id: 'micro', label: 'Micro ($50-200)', min: 50, max: 200, icon: '💰' },
    { id: 'small', label: 'Small ($200-500)', min: 200, max: 500, icon: '💵' },
    { id: 'medium', label: 'Medium ($500-1K)', min: 500, max: 1000, icon: '💸' },
    { id: 'large', label: 'Large ($1K-5K)', min: 1000, max: 5000, icon: '🏦' },
    { id: 'premium', label: 'Premium ($5K+)', min: 5000, max: null, icon: '💎' }
  ];

  // Campaign types
  const campaignTypes = [
    { id: 'sponsored', label: 'Sponsored Post', icon: '📢', color: '#FF6B9D' },
    { id: 'affiliate', label: 'Affiliate Marketing', icon: '🔗', color: '#4ECDC4' },
    { id: 'product-review', label: 'Product Review', icon: '⭐', color: '#45B7D1' },
    { id: 'brand-ambassador', label: 'Brand Ambassador', icon: '👑', color: '#96CEB4' },
    { id: 'takeover', label: 'Account Takeover', icon: '📱', color: '#FFEAA7' },
    { id: 'event', label: 'Event Coverage', icon: '🎪', color: '#DDA0DD' },
    { id: 'giveaway', label: 'Giveaway', icon: '🎁', color: '#98D8C8' },
    { id: 'tutorial', label: 'Tutorial/How-to', icon: '📚', color: '#F7DC6F' },
    { id: 'lifestyle', label: 'Lifestyle Content', icon: '🏠', color: '#BB8FCE' },
    { id: 'behind-scenes', label: 'Behind the Scenes', icon: '🎬', color: '#85C1E9' }
  ];

  // Industry/Vertical options
  const industryOptions = [
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

  // Campaign status options
  const statusOptions = [
    { id: 'active', label: 'Active', icon: '🟢', color: '#10B981' },
    { id: 'draft', label: 'Draft', icon: '📝', color: '#6B7280' },
    { id: 'paused', label: 'Paused', icon: '⏸️', color: '#F59E0B' },
    { id: 'completed', label: 'Completed', icon: '✅', color: '#059669' }
  ];

  // Content requirements
  const contentRequirements = [
    { id: 'photo', label: 'Photo Content', icon: '📸' },
    { id: 'video', label: 'Video Content', icon: '🎥' },
    { id: 'story', label: 'Story Content', icon: '📱' },
    { id: 'reel', label: 'Reel Content', icon: '🎬' },
    { id: 'live', label: 'Live Stream', icon: '🔴' },
    { id: 'blog', label: 'Blog Post', icon: '✍️' }
  ];

  // Brand size options
  const brandSizes = [
    { id: 'startup', label: 'Startup', icon: '🚀' },
    { id: 'small-business', label: 'Small Business', icon: '🏪' },
    { id: 'medium-business', label: 'Medium Business', icon: '🏢' },
    { id: 'enterprise', label: 'Enterprise', icon: '🏭' },
    { id: 'well-known', label: 'Well-Known Brand', icon: '🌟' }
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

  // Campaign duration
  const campaignDuration = [
    { id: 'one-time', label: 'One-time', icon: '📅' },
    { id: 'ongoing', label: 'Ongoing', icon: '🔄' },
    { id: 'seasonal', label: 'Seasonal', icon: '🍂' },
    { id: 'long-term', label: 'Long-term', icon: '📈' }
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

  // Handle budget range selection
  const handleBudgetRangeToggle = (rangeId) => {
    const range = budgetRanges.find(r => r.id === rangeId);
    setLocalFilters(prev => ({
      ...prev,
      minBudget: range.min,
      maxBudget: range.max
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
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      (localFilters.platforms && localFilters.platforms.length > 0) ||
      (localFilters.campaignTypes && localFilters.campaignTypes.length > 0) ||
      (localFilters.industries && localFilters.industries.length > 0) ||
      (localFilters.status && localFilters.status !== 'all') ||
      (localFilters.contentRequirements && localFilters.contentRequirements.length > 0) ||
      (localFilters.brandSizes && localFilters.brandSizes.length > 0) ||
      (localFilters.countries && localFilters.countries.length > 0) ||
      (localFilters.campaignDuration && localFilters.campaignDuration !== 'all') ||
      localFilters.minBudget ||
      localFilters.maxBudget
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
                <span className="filter-sidebar__title-icon">🎯</span>
                Find Campaigns
              </h2>
              <p className="filter-sidebar__subtitle">Discover perfect opportunities</p>
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
                        <span className="filter-checkbox__meta">Avg: {platform.avgBudget}</span>
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div className="filter-section">
              <h3 className="filter-section__title">
                <span className="filter-section__icon">💰</span>
                Budget Range
              </h3>
              <div className="filter-section__content">
                {budgetRanges.map((range) => (
                  <label key={range.id} className="filter-checkbox">
                    <input
                      type="radio"
                      name="budgetRange"
                      checked={localFilters.minBudget === range.min && localFilters.maxBudget === range.max}
                      onChange={() => handleBudgetRangeToggle(range.id)}
                    />
                    <span className="filter-checkbox__label">
                      <span className="filter-checkbox__icon">{range.icon}</span>
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Campaign Types */}
            <div className="filter-section">
              <h3 className="filter-section__title">
                <span className="filter-section__icon">🎯</span>
                Campaign Types
              </h3>
              <div className="filter-section__content filter-section__content--grid">
                {campaignTypes.map((type) => (
                  <label key={type.id} className="filter-checkbox filter-checkbox--category">
                    <input
                      type="checkbox"
                      checked={(localFilters.campaignTypes || []).includes(type.id)}
                      onChange={() => handleMultiToggle('campaignTypes', type.id)}
                    />
                    <span className="filter-checkbox__label" style={{'--category-color': type.color}}>
                      <span className="filter-checkbox__icon">{type.icon}</span>
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Industries */}
            <div className="filter-section">
              <h3 className="filter-section__title">
                <span className="filter-section__icon">🏭</span>
                Industries
              </h3>
              <div className="filter-section__content filter-section__content--grid">
                {industryOptions.map((industry) => (
                  <label key={industry.id} className="filter-checkbox filter-checkbox--category">
                    <input
                      type="checkbox"
                      checked={(localFilters.industries || []).includes(industry.id)}
                      onChange={() => handleMultiToggle('industries', industry.id)}
                    />
                    <span className="filter-checkbox__label" style={{'--category-color': industry.color}}>
                      <span className="filter-checkbox__icon">{industry.icon}</span>
                      {industry.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Campaign Status */}
            <div className="filter-section">
              <h3 className="filter-section__title">
                <span className="filter-section__icon">📊</span>
                Campaign Status
              </h3>
              <div className="filter-section__content">
                {statusOptions.map((status) => (
                  <label key={status.id} className="filter-checkbox">
                    <input
                      type="radio"
                      name="status"
                      checked={localFilters.status === status.id}
                      onChange={() => handleSingleToggle('status', status.id)}
                    />
                    <span className="filter-checkbox__label" style={{'--status-color': status.color}}>
                      <span className="filter-checkbox__icon">{status.icon}</span>
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Requirements */}
            <div className="filter-section">
              <h3 className="filter-section__title">
                <span className="filter-section__icon">📝</span>
                Content Requirements
              </h3>
              <div className="filter-section__content filter-section__content--grid">
                {contentRequirements.map((requirement) => (
                  <label key={requirement.id} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={(localFilters.contentRequirements || []).includes(requirement.id)}
                      onChange={() => handleMultiToggle('contentRequirements', requirement.id)}
                    />
                    <span className="filter-checkbox__label">
                      <span className="filter-checkbox__icon">{requirement.icon}</span>
                      {requirement.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Size */}
            <div className="filter-section">
              <h3 className="filter-section__title">
                <span className="filter-section__icon">🏢</span>
                Brand Size
              </h3>
              <div className="filter-section__content">
                {brandSizes.map((size) => (
                  <label key={size.id} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={(localFilters.brandSizes || []).includes(size.id)}
                      onChange={() => handleMultiToggle('brandSizes', size.id)}
                    />
                    <span className="filter-checkbox__label">
                      <span className="filter-checkbox__icon">{size.icon}</span>
                      {size.label}
                    </span>
                  </label>
                ))}
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

            {/* Campaign Duration */}
            <div className="filter-section">
              <h3 className="filter-section__title">
                <span className="filter-section__icon">⏱️</span>
                Campaign Duration
              </h3>
              <div className="filter-section__content">
                {campaignDuration.map((duration) => (
                  <label key={duration.id} className="filter-checkbox">
                    <input
                      type="radio"
                      name="campaignDuration"
                      checked={localFilters.campaignDuration === duration.id}
                      onChange={() => handleSingleToggle('campaignDuration', duration.id)}
                    />
                    <span className="filter-checkbox__label">
                      <span className="filter-checkbox__icon">{duration.icon}</span>
                      {duration.label}
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
    budgetRanges: PropTypes.arrayOf(PropTypes.string),
    campaignTypes: PropTypes.arrayOf(PropTypes.string),
    industries: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
    contentRequirements: PropTypes.arrayOf(PropTypes.string),
    brandSizes: PropTypes.arrayOf(PropTypes.string),
    countries: PropTypes.arrayOf(PropTypes.string),
    campaignDuration: PropTypes.string,
    minBudget: PropTypes.number,
    maxBudget: PropTypes.number
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default FilterSidebar; 