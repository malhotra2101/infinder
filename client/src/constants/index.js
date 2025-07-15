/**
 * Application Constants
 *
 * Centralized export of all application constants for better organization
 * and easier imports throughout the application.
 */

export { ROUTES, NAVIGATION_ITEMS, AUTH_ITEMS } from './routes';

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5052',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Application Configuration
export const APP_CONFIG = {
  NAME: 'Infinder',
  VERSION: '1.0.0',
  DESCRIPTION: 'Influencer Marketing Platform',
  ENVIRONMENT: import.meta.env.MODE || 'development'
};

// UI Constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  TRANSITION_DURATION: 200,
  SCROLL_THRESHOLD: 100,
  DEBOUNCE_DELAY: 300
};

// Color Palette
export const COLORS = {
  PRIMARY: '#667eea',
  SECONDARY: '#764ba2',
  SUCCESS: '#48bb78',
  ERROR: '#e53e3e',
  WARNING: '#f6ad55',
  INFO: '#3182ce',
  WHITE: '#ffffff',
  BLACK: '#000000',
  GRAY: {
    50: '#f7fafc',
    100: '#edf2f7',
    200: '#e2e8f0',
    300: '#cbd5e0',
    400: '#a0aec0',
    500: '#718096',
    600: '#4a5568',
    700: '#2d3748',
    800: '#1a202c',
    900: '#171923'
  }
};

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: '480px',
  TABLET: '768px',
  DESKTOP: '1024px',
  WIDE: '1200px'
};

// Z-Index Layers
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070
}; 