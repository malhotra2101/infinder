/**
 * Application Routes Constants
 * 
 * Centralized route definitions for consistent navigation across the application.
 * Makes it easier to maintain and update routes in one place.
 */

export const ROUTES = {
  // Main pages (Brand)
  HOME: '/dashboard',
  CAMPAIGNS: '/campaigns',
  SEARCH: '/search',
  EMAIL_COMPOSER: '/email-composer',
  COLLABORATION: '/collaboration',
  CONTACT: '/contact',
  PROFILE: '/profile',
  
  // Influencer pages
  INFLUENCER: '/influencer',
  INFLUENCER_DASHBOARD: '/influencer/dashboard',
  INFLUENCER_SEARCH: '/influencer/search',
  INFLUENCER_SELECTED_CAMPAIGNS: '/influencer/selected-campaigns',
  INFLUENCER_PROFILE: '/influencer/profile',
  
  // Authentication
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // API endpoints
  API: {
    PING: '/api/ping',
    HEALTH: '/api/health',
    INFO: '/api/info'
  }
};

/**
 * Navigation items for sidebar and navbar (Brand)
 */
export const NAVIGATION_ITEMS = [
  { path: ROUTES.HOME, label: 'Dashboard', icon: 'dashboard' },
  { path: ROUTES.CAMPAIGNS, label: 'Campaigns', icon: 'campaigns' },
  { path: ROUTES.SEARCH, label: 'Search', icon: 'search' },
  { path: ROUTES.COLLABORATION, label: 'Collaboration', icon: 'collaboration' },
  { path: ROUTES.CONTACT, label: 'Contact', icon: 'contact' }
];

/**
 * Navigation items for influencer sidebar
 */
export const INFLUENCER_NAVIGATION_ITEMS = [
  { path: ROUTES.INFLUENCER_DASHBOARD, label: 'Dashboard', icon: 'dashboard' },
  { path: ROUTES.INFLUENCER_SEARCH, label: 'Search', icon: 'search' },
  { path: ROUTES.INFLUENCER_SELECTED_CAMPAIGNS, label: 'My Campaigns', icon: 'campaigns' }
];

/**
 * Authentication navigation items
 */
export const AUTH_ITEMS = [
  { path: ROUTES.LOGIN, label: 'Login', icon: 'login', variant: 'secondary' },
  { path: ROUTES.SIGNUP, label: 'Get Started', icon: 'get-started', variant: 'primary' }
];

/**
 * Profile navigation item (Brand)
 */
export const PROFILE_ITEM = [
  { path: ROUTES.PROFILE, label: 'Profile', icon: 'profile', variant: 'profile' }
];

/**
 * Profile navigation item (Influencer)
 */
export const INFLUENCER_PROFILE_ITEM = [
  { path: ROUTES.INFLUENCER_PROFILE, label: 'Profile', icon: 'profile', variant: 'profile' }
]; 