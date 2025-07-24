import React from 'react';
import PropTypes from 'prop-types';
import './SidebarToggle.css';

/**
 * SidebarToggle Component
 * 
 * Animated toggle button for expanding/collapsing the sidebar.
 * Features smooth hamburger menu animation with accessibility support.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isExpanded - Current sidebar expansion state
 * @param {Function} props.onToggle - Toggle callback function
 * @returns {JSX.Element} Toggle button component
 */
const SidebarToggle = ({ isExpanded, onToggle }) => {
  /**
   * Handle button click
   */
  const handleClick = () => {
    onToggle();
  };

  /**
   * Handle keyboard events for accessibility
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      className={`sidebar-toggle ${isExpanded ? 'expanded' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} sidebar navigation`}
      aria-expanded={isExpanded}
      type="button"
    >
      <div className="toggle-container">
        <span className="line line-1" aria-hidden="true"></span>
        <span className="line line-2" aria-hidden="true"></span>
        <span className="line line-3" aria-hidden="true"></span>
      </div>
    </button>
  );
};

// PropTypes for type checking
SidebarToggle.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default SidebarToggle; 