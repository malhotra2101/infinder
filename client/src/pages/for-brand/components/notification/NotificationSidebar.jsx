import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './NotificationSidebar.css';

/**
 * NotificationSidebar Component
 * 
 * A full-width sidebar that slides in from the right with blurred background overlay.
 * Button is positioned at the rightmost edge and moves with the sidebar.
 * 
 * @param {Object} props - Component props
 * @param {number} props.count - Number of notifications to display in badge
 * @param {Function} props.onClick - Click handler for the button
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Notification sidebar component
 */
const NotificationSidebar = ({ 
  count = 0, 
  onClick = () => {}, 
  className = '' 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      // Restore body scroll when sidebar closes
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const handleButtonClick = (e) => {
    e.preventDefault();
    setIsSidebarOpen(!isSidebarOpen);
    onClick();
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Backdrop Overlay */}
      {isSidebarOpen && (
        <div className="notification-backdrop" onClick={handleCloseSidebar} />
      )}

      {/* Sidebar Container */}
      <div 
        className={`notification-sidebar ${isSidebarOpen ? 'notification-sidebar--open' : ''}`}
        ref={sidebarRef}
      >
        {/* Notification Button - Fixed to sidebar */}
        <div className={`notification-button-container ${className}`} ref={buttonRef}>
          <button 
            className="notification-button"
            onClick={handleButtonClick}
            aria-label="Notifications"
            title="Notifications"
            aria-expanded={isSidebarOpen}
          >
            <svg className="notification-button__icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            {count > 0 && (
              <span className="notification-button__badge">
                {count > 99 ? '99+' : count}
              </span>
            )}
            {/* Arrow Icon */}
            <svg 
              className={`notification-button__arrow ${isSidebarOpen ? 'notification-button__arrow--open' : ''}`} 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
        </div>

        <div className="notification-sidebar__header">
          <h2>Notifications</h2>
          <button 
            className="notification-sidebar__close"
            onClick={handleCloseSidebar}
            aria-label="Close notifications"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="notification-sidebar__content">
          {count > 0 && (
            <div className="notification-sidebar__actions">
              <button className="notification-sidebar__mark-all">
                Mark all as read
              </button>
            </div>
          )}
          
          {count > 0 ? (
            <div className="notification-sidebar__list">
              <div className="notification-sidebar-item">
                <div className="notification-sidebar-item__icon">🔔</div>
                <div className="notification-sidebar-item__content">
                  <h4 className="notification-sidebar-item__title">New influencer match found</h4>
                  <p className="notification-sidebar-item__description">
                    Sarah Johnson matches your campaign criteria with 95% relevance score.
                  </p>
                  <p className="notification-sidebar-item__time">2 minutes ago</p>
                </div>
                <button className="notification-sidebar-item__mark-read">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </button>
              </div>

              <div className="notification-sidebar-item">
                <div className="notification-sidebar-item__icon">📊</div>
                <div className="notification-sidebar-item__content">
                  <h4 className="notification-sidebar-item__title">Campaign performance update</h4>
                  <p className="notification-sidebar-item__description">
                    Your "Summer Collection" campaign has reached 150% of its engagement target.
                  </p>
                  <p className="notification-sidebar-item__time">1 hour ago</p>
                </div>
                <button className="notification-sidebar-item__mark-read">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </button>
              </div>

              <div className="notification-sidebar-item">
                <div className="notification-sidebar-item__icon">💬</div>
                <div className="notification-sidebar-item__content">
                  <h4 className="notification-sidebar-item__title">New message from Sarah</h4>
                  <p className="notification-sidebar-item__description">
                    "Hi! I'm interested in your campaign. Can we discuss the details?"
                  </p>
                  <p className="notification-sidebar-item__time">3 hours ago</p>
                </div>
                <button className="notification-sidebar-item__mark-read">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </button>
              </div>

              <div className="notification-sidebar-item">
                <div className="notification-sidebar-item__icon">🎯</div>
                <div className="notification-sidebar-item__content">
                  <h4 className="notification-sidebar-item__title">Campaign milestone reached</h4>
                  <p className="notification-sidebar-item__description">
                    Your "Fitness Challenge" campaign has achieved 10,000 impressions.
                  </p>
                  <p className="notification-sidebar-item__time">5 hours ago</p>
                </div>
                <button className="notification-sidebar-item__mark-read">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="notification-sidebar__empty">
              <div className="notification-sidebar__empty-icon">🔕</div>
              <h3>No new notifications</h3>
              <p>You're all caught up! Check back later for updates.</p>
            </div>
          )}
        </div>

        <div className="notification-sidebar__footer">
          <button className="notification-sidebar__view-all">
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
};

NotificationSidebar.propTypes = {
  count: PropTypes.number,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default NotificationSidebar; 