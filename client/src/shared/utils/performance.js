/**
 * Performance utilities for monitoring and optimization
 */

/**
 * Measure execution time of a function
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for the measurement
 * @returns {*} Result of the function
 */
export const measurePerformance = (fn, label = 'Function') => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  // Performance data is captured but not logged
  const duration = (end - start).toFixed(2);
  
  return result;
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if element is in viewport for lazy loading
 * @param {Element} element - DOM element to check
 * @returns {boolean} Whether element is in viewport
 */
export const isInViewport = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Get device performance tier for adaptive optimization
 * @returns {string} Performance tier ('low', 'medium', 'high')
 */
export const getPerformanceTier = () => {
  // Check for hardware concurrency
  const cores = navigator.hardwareConcurrency || 2;
  
  // Check for device memory
  const memory = navigator.deviceMemory || 4;
  
  // Check for connection speed
  const connection = navigator.connection;
  const effectiveType = connection?.effectiveType || '4g';
  
  if (cores >= 8 && memory >= 8 && effectiveType === '4g') {
    return 'high';
  } else if (cores >= 4 && memory >= 4 && effectiveType !== 'slow-2g') {
    return 'medium';
  } else {
    return 'low';
  }
};

/**
 * Optimize animations based on device performance
 * @param {string} animationType - Type of animation
 * @returns {Object} Animation configuration
 */
export const getOptimizedAnimation = (animationType) => {
  const tier = getPerformanceTier();
  
  const configs = {
    high: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      enableGPU: true
    },
    medium: {
      duration: 250,
      easing: 'ease-out',
      enableGPU: true
    },
    low: {
      duration: 200,
      easing: 'linear',
      enableGPU: false
    }
  };
  
  return configs[tier] || configs.medium;
}; 