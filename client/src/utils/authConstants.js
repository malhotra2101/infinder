/**
 * Authentication constants and configuration
 * Centralized constants for auth components
 */

/**
 * Social login providers
 */
export const SOCIAL_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
  LINKEDIN: 'linkedin'
};

/**
 * Demo credentials for testing
 */
export const DEMO_CREDENTIALS = {
  LOGIN: {
    email: 'demo@example.com',
    password: 'password123'
  },
  SIGNUP: {
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com',
    password: 'Password123',
    confirmPassword: 'Password123'
  }
};

/**
 * Auth page features for branding section
 */
export const AUTH_FEATURES = [
  {
    icon: '🔍',
    text: 'Advanced Search & Discovery',
    description: 'Find the perfect influencers for your brand'
  },
  {
    icon: '📊',
    text: 'Analytics & Insights',
    description: 'Comprehensive data and performance metrics'
  },
  {
    icon: '🤝',
    text: 'Seamless Collaboration',
    description: 'Connect and work with creators effortlessly'
  }
];

/**
 * Social login button configurations
 */
export const SOCIAL_BUTTONS = [
  {
    provider: SOCIAL_PROVIDERS.GOOGLE,
    label: 'Continue with Google',
    icon: '🔍',
    color: '#4285f4',
    hoverColor: '#3367d6'
  },
  {
    provider: SOCIAL_PROVIDERS.GITHUB,
    label: 'Continue with GitHub',
    icon: '🔍',
    color: '#24292e',
    hoverColor: '#1b1f23'
  }
];

/**
 * Form field configurations
 */
export const FORM_FIELDS = {
  LOGIN: [
    { name: 'email', type: 'email', label: 'Email Address', placeholder: 'Enter your email' },
    { name: 'password', type: 'password', label: 'Password', placeholder: 'Enter your password' }
  ],
  SIGNUP: [
    { name: 'firstName', type: 'text', label: 'First Name', placeholder: 'Enter your first name' },
    { name: 'lastName', type: 'text', label: 'Last Name', placeholder: 'Enter your last name' },
    { name: 'email', type: 'email', label: 'Email Address', placeholder: 'Enter your email' },
    { name: 'password', type: 'password', label: 'Password', placeholder: 'Create a password' },
    { name: 'confirmPassword', type: 'password', label: 'Confirm Password', placeholder: 'Confirm your password' }
  ]
};

/**
 * Animation delays for staggered animations
 */
export const ANIMATION_DELAYS = {
  CONTAINER: 0,
  BRANDING: 200,
  FORM: 400,
  FEATURES: [1000, 1200, 1400]
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  GENERAL: {
    LOGIN_FAILED: 'Login failed. Please try again.',
    SIGNUP_FAILED: 'Signup failed. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNKNOWN_ERROR: 'An unexpected error occurred.'
  },
  SOCIAL: {
    COMING_SOON: 'Social login is coming soon!',
    NOT_IMPLEMENTED: 'This feature is not yet implemented.'
  }
}; 