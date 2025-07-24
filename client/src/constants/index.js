/**
 * Centralized application constants
 * All application-wide constants should be defined here
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  CAMPAIGNS: '/campaigns',
  SEARCH: '/search',
  COLLABORATION: '/collaboration',
  CONTACT: '/contact',
  PROFILE: '/profile',
};

// Authentication
export const AUTH = {
  TOKEN_KEY: 'infinder_auth_token',
  REFRESH_TOKEN_KEY: 'infinder_refresh_token',
  USER_KEY: 'infinder_user',
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  BRAND: 'brand',
  INFLUENCER: 'influencer',
  MODERATOR: 'moderator',
};

// Campaign Status
export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Application Status
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
};

// Collaboration Status
export const COLLABORATION_STATUS = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Platform Types
export const PLATFORM_TYPES = {
  INSTAGRAM: 'instagram',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  LINKEDIN: 'linkedin',
  TWITCH: 'twitch',
  SNAPCHAT: 'snapchat',
  PINTEREST: 'pinterest',
  BLOG: 'blog',
  PODCAST: 'podcast',
  OTHER: 'other',
};

// Content Categories
export const CONTENT_CATEGORIES = {
  FASHION: 'fashion',
  BEAUTY: 'beauty',
  FITNESS: 'fitness',
  FOOD: 'food',
  TRAVEL: 'travel',
  TECHNOLOGY: 'technology',
  GAMING: 'gaming',
  EDUCATION: 'education',
  BUSINESS: 'business',
  LIFESTYLE: 'lifestyle',
  ENTERTAINMENT: 'entertainment',
  SPORTS: 'sports',
  HEALTH: 'health',
  PARENTING: 'parenting',
  PETS: 'pets',
  OTHER: 'other',
};

// Audience Demographics
export const AUDIENCE_DEMOGRAPHICS = {
  AGE_RANGES: {
    '13-17': '13-17',
    '18-24': '18-24',
    '25-34': '25-34',
    '35-44': '35-44',
    '45-54': '45-54',
    '55+': '55+',
  },
  GENDERS: {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
  },
  LOCATIONS: {
    NORTH_AMERICA: 'north_america',
    EUROPE: 'europe',
    ASIA: 'asia',
    AFRICA: 'africa',
    SOUTH_AMERICA: 'south_america',
    AUSTRALIA: 'australia',
  },
};

// Engagement Metrics
export const ENGAGEMENT_METRICS = {
  LIKES: 'likes',
  COMMENTS: 'comments',
  SHARES: 'shares',
  SAVES: 'saves',
  CLICKS: 'clicks',
  VIEWS: 'views',
  SUBSCRIBERS: 'subscribers',
  FOLLOWERS: 'followers',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  CRYPTO: 'crypto',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  APPLICATION_RECEIVED: 'application_received',
  APPLICATION_APPROVED: 'application_approved',
  APPLICATION_REJECTED: 'application_rejected',
  COLLABORATION_REQUEST: 'collaboration_request',
  COLLABORATION_ACCEPTED: 'collaboration_accepted',
  COLLABORATION_DECLINED: 'collaboration_declined',
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_SENT: 'payment_sent',
  CAMPAIGN_UPDATE: 'campaign_update',
  SYSTEM_MESSAGE: 'system_message',
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    VIDEO: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  MAX_FILES: 10,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Search Filters
export const SEARCH_FILTERS = {
  SORT_OPTIONS: {
    RELEVANCE: 'relevance',
    FOLLOWERS_HIGH_TO_LOW: 'followers_high_to_low',
    FOLLOWERS_LOW_TO_HIGH: 'followers_low_to_high',
    ENGAGEMENT_HIGH_TO_LOW: 'engagement_high_to_low',
    ENGAGEMENT_LOW_TO_HIGH: 'engagement_low_to_high',
    PRICE_HIGH_TO_LOW: 'price_high_to_low',
    PRICE_LOW_TO_HIGH: 'price_low_to_high',
    NEWEST: 'newest',
    OLDEST: 'oldest',
  },
  PRICE_RANGES: {
    UNDER_100: 'under_100',
    '100-500': '100-500',
    '500-1000': '500-1000',
    '1000-5000': '1000-5000',
    '5000-10000': '5000-10000',
    OVER_10000: 'over_10000',
  },
  FOLLOWER_RANGES: {
    UNDER_1K: 'under_1k',
    '1K-10K': '1k-10k',
    '10K-50K': '10k-50k',
    '50K-100K': '50k-100k',
    '100K-500K': '100k-500k',
    '500K-1M': '500k-1m',
    OVER_1M: 'over_1m',
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'File type is not supported.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
  APPLICATION_SUBMITTED: 'Application submitted successfully.',
  APPLICATION_UPDATED: 'Application updated successfully.',
  CAMPAIGN_CREATED: 'Campaign created successfully.',
  CAMPAIGN_UPDATED: 'Campaign updated successfully.',
  COLLABORATION_REQUESTED: 'Collaboration request sent successfully.',
  PAYMENT_PROCESSED: 'Payment processed successfully.',
  FILE_UPLOADED: 'File uploaded successfully.',
  SETTINGS_SAVED: 'Settings saved successfully.',
};

// UI Constants
export const UI = {
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
  },
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  Z_INDEX: {
    DROPDOWN: 1000,
    MODAL: 1050,
    TOOLTIP: 1100,
    TOAST: 1150,
  },
  COLORS: {
    PRIMARY: '#667eea',
    SECONDARY: '#764ba2',
    SUCCESS: '#28a745',
    WARNING: '#ffc107',
    ERROR: '#dc3545',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40',
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'infinder_theme',
  LANGUAGE: 'infinder_language',
  SIDEBAR_STATE: 'infinder_sidebar_state',
  SEARCH_FILTERS: 'infinder_search_filters',
  DASHBOARD_LAYOUT: 'infinder_dashboard_layout',
  NOTIFICATIONS_SETTINGS: 'infinder_notifications_settings',
};

// Feature Flags
export const FEATURE_FLAGS = {
  ADVANCED_SEARCH: true,
  ANALYTICS_DASHBOARD: true,
  COLLABORATION_SYSTEM: true,
  PAYMENT_INTEGRATION: false,
  NOTIFICATION_SYSTEM: true,
  MULTI_LANGUAGE: false,
  DARK_MODE: true,
  MOBILE_APP: false,
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  SEARCH: 'search',
  FILTER_APPLY: 'filter_apply',
  APPLICATION_SUBMIT: 'application_submit',
  COLLABORATION_REQUEST: 'collaboration_request',
  PAYMENT_COMPLETE: 'payment_complete',
  ERROR_OCCURRED: 'error_occurred',
};

// Export all constants as a single object for easy access
export const CONSTANTS = {
  API_CONFIG,
  ROUTES,
  AUTH,
  USER_ROLES,
  CAMPAIGN_STATUS,
  APPLICATION_STATUS,
  COLLABORATION_STATUS,
  PLATFORM_TYPES,
  CONTENT_CATEGORIES,
  AUDIENCE_DEMOGRAPHICS,
  ENGAGEMENT_METRICS,
  PAYMENT_METHODS,
  NOTIFICATION_TYPES,
  FILE_UPLOAD,
  PAGINATION,
  SEARCH_FILTERS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  UI,
  STORAGE_KEYS,
  FEATURE_FLAGS,
  ANALYTICS_EVENTS,
};

export default CONSTANTS; 