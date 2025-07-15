import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { NAVIGATION_ITEMS, PROFILE_ITEM } from '../../routes';
import { 
  DashboardIcon, 
  CampaignsIcon,
  SearchIcon, 
  ContactIcon, 
  ProfileIcon
} from '../icons/index.jsx';
import './Sidebar.css';

/**
 * Sidebar Component
 * 
 * Main navigation sidebar with collapsible functionality.
 * Features animated toggle, navigation items, and profile section.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether sidebar is open/expanded
 * @param {boolean} props.isMobile - Whether on mobile device
 * @param {Function} props.onClose - Callback to close sidebar
 * @returns {JSX.Element} Sidebar component
 */
const Sidebar = ({ isOpen = false, isMobile = false, onClose = () => {} }) => {
  const location = useLocation();

  // Map navigation items with their corresponding icons
  const navigationItemsWithIcons = [
    { ...NAVIGATION_ITEMS[0], icon: DashboardIcon },
    { ...NAVIGATION_ITEMS[1], icon: CampaignsIcon },
    { ...NAVIGATION_ITEMS[2], icon: SearchIcon },
    { ...NAVIGATION_ITEMS[3], icon: ContactIcon }
  ];

  // Map profile item with its corresponding icon
  const profileItemWithIcon = [
    { ...PROFILE_ITEM[0], icon: ProfileIcon }
  ];

  // Use isOpen prop instead of internal state
  const isExpanded = isOpen;

  /**
   * Render navigation item
   * @param {Object} item - Navigation item with icon and path
   * @returns {JSX.Element} Navigation link
   */
  const renderNavigationItem = (item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
        title={!isExpanded ? item.label : undefined}
      >
        <Icon />
        {isExpanded && <span className="sidebar-nav-text">{item.label}</span>}
      </Link>
    );
  };



  /**
   * Render profile item
   * @param {Object} item - Profile item with icon and path
   * @returns {JSX.Element} Profile link
   */
  const renderProfileItem = (item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    
    return (
      <Link 
        key={item.path}
        to={item.path} 
        className={`sidebar-profile-btn ${isActive ? 'active' : ''}`} 
        title={!isExpanded ? item.label : undefined}
      >
        <Icon />
        {isExpanded && <span className="sidebar-profile-text">{item.label}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {/* Logo Section */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <img src="/logo.svg" alt="Infinder Logo" />
            {isExpanded && <span className="sidebar-logo-text">Infinder</span>}
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="sidebar-nav">
          {navigationItemsWithIcons.map(renderNavigationItem)}
        </nav>

        {/* Profile Section */}
        <div className="sidebar-profile">
          {profileItemWithIcon.map(renderProfileItem)}
        </div>
      </aside>
    </>
  );
};

// PropTypes for type checking
Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  isMobile: PropTypes.bool,
  onClose: PropTypes.func
};

export default Sidebar; 