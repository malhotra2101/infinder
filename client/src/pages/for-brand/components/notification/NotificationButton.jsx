import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './NotificationButton.css';

/**
 * NotificationButton Component
 * 
 * A reusable notification button with badge and dropdown functionality.
 * 
 * @param {Object} props - Component props
 * @param {number} props.count - Number of notifications to display in badge
 * @param {Function} props.onClick - Click handler for the button
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Notification button component
 */
const NotificationButton = ({ 
  count = 0, 
  onClick = () => {}, 
  className = '' 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          setIsDropdownOpen(false);
        }
      });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
    onClick();
  };

  return (
    <div className={`notification-button-container ${className}`} ref={dropdownRef}>
      <button 
        className="notification-button"
        onClick={handleClick}
        aria-label="Notifications"
        title="Notifications"
        aria-expanded={isDropdownOpen}
      >
        <svg className="notification-button__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
        {count > 0 && (
          <span className="notification-button__badge">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown__header">
            <h3>Notifications</h3>
            {count > 0 && (
              <button className="notification-dropdown__mark-all">
                Mark all as read
              </button>
            )}
          </div>
          
          {count > 0 ? (
            <div className="notification-dropdown__list">
              <div className="notification-item">
                <div className="notification-item__icon">🔔</div>
                <div className="notification-item__content">
                  <p className="notification-item__title">New influencer match found</p>
                  <p className="notification-item__time">2 minutes ago</p>
                </div>
              </div>
              <div className="notification-item">
                <div className="notification-item__icon">📊</div>
                <div className="notification-item__content">
                  <p className="notification-item__title">Campaign performance update</p>
                  <p className="notification-item__time">1 hour ago</p>
                </div>
              </div>
              <div className="notification-item">
                <div className="notification-item__icon">💬</div>
                <div className="notification-item__content">
                  <p className="notification-item__title">New message from Sarah</p>
                  <p className="notification-item__time">3 hours ago</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="notification-dropdown__empty">
              <div className="notification-dropdown__empty-icon">🔕</div>
              <p>No new notifications</p>
            </div>
          )}
          
          <div className="notification-dropdown__footer">
            <button className="notification-dropdown__view-all">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

NotificationButton.propTypes = {
  count: PropTypes.number,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default NotificationButton; 