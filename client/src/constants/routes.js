/**
 * Application Routes Constants
 * 
 * Centralized route definitions for consistent navigation across the application.
 * Makes it easier to maintain and update routes in one place.
 */

export const ROUTES = {
  // Main pages
  HOME: '/',
  SEARCH: '/search',
  CONTACT: '/contact',
  PROFILE: '/profile',
  
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
 * Navigation items for sidebar and navbar
 */
export const NAVIGATION_ITEMS = [
  { path: ROUTES.HOME, label: 'Home', icon: 'home' },
  { path: ROUTES.SEARCH, label: 'Search', icon: 'search' },
  { path: ROUTES.CONTACT, label: 'Contact', icon: 'contact' }
];

/**
 * Authentication navigation items
 */
export const AUTH_ITEMS = [
  { path: ROUTES.LOGIN, label: 'Login', icon: 'login', variant: 'secondary' },
  { path: ROUTES.SIGNUP, label: 'Get Started', icon: 'get-started', variant: 'primary' }
]; 