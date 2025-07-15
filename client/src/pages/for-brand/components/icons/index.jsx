/**
 * Icons Component Library
 * 
 * Centralized collection of SVG icons used throughout the application.
 * Provides consistent icon styling and reduces code duplication.
 */

import React from 'react';

/**
 * Dashboard icon component
 * @param {Object} props - Icon props
 * @returns {JSX.Element} Dashboard icon
 */
export const DashboardIcon = ({ width = 24, height = 24, ...props }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect 
      x="3" 
      y="3" 
      width="7" 
      height="7" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <rect 
      x="14" 
      y="3" 
      width="7" 
      height="7" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <rect 
      x="14" 
      y="14" 
      width="7" 
      height="7" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <rect 
      x="3" 
      y="14" 
      width="7" 
      height="7" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Campaigns icon component
 * @param {Object} props - Icon props
 * @returns {JSX.Element} Campaigns icon
 */
export const CampaignsIcon = ({ width = 24, height = 24, ...props }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      d="M12 2L2 7L12 12L22 7L12 2Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M2 17L12 22L22 17" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M2 12L12 17L22 12" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Home icon component
 * @param {Object} props - Icon props
 * @returns {JSX.Element} Home icon
 */
export const HomeIcon = ({ width = 24, height = 24, ...props }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M9 22V12H15V22" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Search icon component
 * @param {Object} props - Icon props
 * @returns {JSX.Element} Search icon
 */
export const SearchIcon = ({ width = 24, height = 24, ...props }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path 
      d="M21 21L16.65 16.65" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Contact icon component
 * @param {Object} props - Icon props
 * @returns {JSX.Element} Contact icon
 */
export const ContactIcon = ({ width = 24, height = 24, ...props }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <polyline 
      points="22,6 12,13 2,6" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Profile icon component
 * @param {Object} props - Icon props
 * @returns {JSX.Element} Profile icon
 */
export const ProfileIcon = ({ width = 24, height = 24, ...props }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <circle 
      cx="12" 
      cy="7" 
      r="4" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Login icon component
 * @param {Object} props - Icon props
 * @returns {JSX.Element} Login icon
 */
export const LoginIcon = ({ width = 20, height = 20, ...props }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <polyline 
      points="10,17 15,12 10,7" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <line 
      x1="15" y1="12" x2="3" y2="12" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Get Started icon component
 * @param {Object} props - Icon props
 * @returns {JSX.Element} Get Started icon
 */
export const GetStartedIcon = ({ width = 20, height = 20, ...props }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Menu/Hamburger icon component
 * @param {Object} props - Icon props
 * @returns {JSX.Element} Menu icon
 */
export const MenuIcon = ({ width = 24, height = 24, ...props }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      d="M3 12H21" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M3 6H21" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M3 18H21" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Close/X icon component
 * @param {Object} props - Icon props
 * @returns {JSX.Element} Close icon
 */
export const CloseIcon = ({ width = 24, height = 24, ...props }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      d="M18 6L6 18" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M6 6L18 18" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
); 