/**
 * Application Constants
 *
 * Centralized export of all application constants for better organization
 * and easier imports throughout the application.
 */

// Application constants
export const APP_CONFIG = {
  name: 'Infinder',
  version: '1.0.0',
  description: 'Influencer Marketing Platform',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5052/api',
  environment: import.meta.env.MODE || 'development',
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  
  // Influencers
  influencers: {
    list: '/influencers',
    detail: (id) => `/influencers/${id}`,
    search: '/influencers/search',
    addToList: '/influencers/add-to-list',
    removeFromList: '/influencers/remove-from-list',
    getListCounts: '/influencers/list-counts',
    getByListType: (type) => `/influencers/list/${type}`,
    getCampaigns: (id) => `/influencers/${id}/campaigns`,
    resetLists: '/influencers/reset-lists',
    updateListStatus: (id) => `/influencers/list-status/${id}`,
  },
  
  // Campaigns
  campaigns: {
    list: '/campaigns',
    detail: (id) => `/campaigns/${id}`,
    create: '/campaigns',
    update: (id) => `/campaigns/${id}`,
    delete: (id) => `/campaigns/${id}`,
    assignInfluencer: (id) => `/campaigns/${id}/assign-influencer`,
    removeInfluencer: (id) => `/campaigns/${id}/remove-influencer`,
  },
  
  // Health
  health: {
    ping: '/ping',
    info: '/info',
  },
};

// Routes
export const ROUTES = {
  // Public routes
  home: '/',
  login: '/login',
  signup: '/signup',
  
  // Protected routes
  dashboard: '/dashboard',
  search: '/search',
  campaigns: '/campaigns',
  profile: '/profile',
  contact: '/contact',
  
  // API routes
  api: API_ENDPOINTS,
};

// Influencer platforms
export const PLATFORMS = {
  INSTAGRAM: 'instagram',
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  FACEBOOK: 'facebook',
  TWITCH: 'twitch',
  SNAPCHAT: 'snapchat',
};

// Platform display names
export const PLATFORM_NAMES = {
  [PLATFORMS.INSTAGRAM]: 'Instagram',
  [PLATFORMS.TIKTOK]: 'TikTok',
  [PLATFORMS.YOUTUBE]: 'YouTube',
  [PLATFORMS.TWITTER]: 'Twitter',
  [PLATFORMS.LINKEDIN]: 'LinkedIn',
  [PLATFORMS.FACEBOOK]: 'Facebook',
  [PLATFORMS.TWITCH]: 'Twitch',
  [PLATFORMS.SNAPCHAT]: 'Snapchat',
};

// Platform colors
export const PLATFORM_COLORS = {
  [PLATFORMS.INSTAGRAM]: '#E4405F',
  [PLATFORMS.TIKTOK]: '#000000',
  [PLATFORMS.YOUTUBE]: '#FF0000',
  [PLATFORMS.TWITTER]: '#1DA1F2',
  [PLATFORMS.LINKEDIN]: '#0077B5',
  [PLATFORMS.FACEBOOK]: '#1877F2',
  [PLATFORMS.TWITCH]: '#9146FF',
  [PLATFORMS.SNAPCHAT]: '#FFFC00',
};

// List types
export const LIST_TYPES = {
  SELECTED: 'selected',
  REJECTED: 'rejected',
  PENDING: 'pending',
};

// Campaign statuses
export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Campaign status display names
export const CAMPAIGN_STATUS_NAMES = {
  [CAMPAIGN_STATUS.DRAFT]: 'Draft',
  [CAMPAIGN_STATUS.ACTIVE]: 'Active',
  [CAMPAIGN_STATUS.PAUSED]: 'Paused',
  [CAMPAIGN_STATUS.COMPLETED]: 'Completed',
  [CAMPAIGN_STATUS.CANCELLED]: 'Cancelled',
};

// Campaign status colors
export const CAMPAIGN_STATUS_COLORS = {
  [CAMPAIGN_STATUS.DRAFT]: '#6B7280',
  [CAMPAIGN_STATUS.ACTIVE]: '#10B981',
  [CAMPAIGN_STATUS.PAUSED]: '#F59E0B',
  [CAMPAIGN_STATUS.COMPLETED]: '#3B82F6',
  [CAMPAIGN_STATUS.CANCELLED]: '#EF4444',
};

// Follower count ranges
export const FOLLOWER_RANGES = {
  MICRO: { min: 1000, max: 10000, label: '1K - 10K' },
  SMALL: { min: 10000, max: 50000, label: '10K - 50K' },
  MEDIUM: { min: 50000, max: 200000, label: '50K - 200K' },
  LARGE: { min: 200000, max: 1000000, label: '200K - 1M' },
  MEGA: { min: 1000000, max: null, label: '1M+' },
};

// Engagement rate ranges
export const ENGAGEMENT_RANGES = {
  LOW: { min: 0, max: 1, label: '0% - 1%' },
  MEDIUM: { min: 1, max: 3, label: '1% - 3%' },
  HIGH: { min: 3, max: 6, label: '3% - 6%' },
  VERY_HIGH: { min: 6, max: null, label: '6%+' },
};

// Age groups
export const AGE_GROUPS = {
  TEEN: '13-17',
  YOUNG_ADULT: '18-24',
  ADULT: '25-34',
  MIDDLE_AGE: '35-44',
  SENIOR: '45+',
};

// Countries (top countries for influencer marketing)
export const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Switzerland',
  'Austria',
  'Belgium',
  'Ireland',
  'New Zealand',
  'Japan',
  'South Korea',
  'Singapore',
  'India',
  'Brazil',
  'Mexico',
  'Argentina',
  'Chile',
  'Colombia',
  'Peru',
  'South Africa',
  'Nigeria',
  'Kenya',
  'Egypt',
  'Morocco',
  'Turkey',
  'Israel',
  'UAE',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
];

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
};

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in.',
  LOGOUT_SUCCESS: 'Successfully logged out.',
  REGISTER_SUCCESS: 'Account created successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  CAMPAIGN_CREATED: 'Campaign created successfully.',
  CAMPAIGN_UPDATED: 'Campaign updated successfully.',
  CAMPAIGN_DELETED: 'Campaign deleted successfully.',
  INFLUENCER_ADDED: 'Influencer added to list successfully.',
  INFLUENCER_REMOVED: 'Influencer removed from list successfully.',
  LISTS_RESET: 'All lists have been reset.',
};

// Validation rules
export const VALIDATION = {
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address.',
  },
  PASSWORD: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
  },
  PHONE: {
    pattern: /^\+?[\d\s\-\(\)]+$/,
    message: 'Please enter a valid phone number.',
  },
  URL: {
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL starting with http:// or https://',
  },
};

// Animation durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

// Breakpoints
export const BREAKPOINTS = {
  XS: 480,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
};

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
}; 