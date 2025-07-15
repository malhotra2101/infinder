/**
 * Performance Monitoring Utilities
 *
 * Tools for monitoring and optimizing application performance.
 * Provides metrics collection, performance measurement, and optimization helpers.
 */

/**
 * Performance metrics storage
 */
const metrics = {
  pageLoads: [],
  componentRenders: [],
  apiCalls: [],
  userInteractions: []
};

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

  if (process.env.NODE_ENV === 'development') {
    console.log(`${label} took ${(end - start).toFixed(2)}ms`);
  }

  return result;
};

/**
 * Measure async function performance
 * @param {Function} fn - Async function to measure
 * @param {string} label - Label for the measurement
 * @returns {Promise<*>} Promise that resolves with function result
 */
export const measureAsyncPerformance = async (fn, label = 'Async Function') => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  if (process.env.NODE_ENV === 'development') {
    console.log(`${label} took ${(end - start).toFixed(2)}ms`);
  }

  return result;
};

/**
 * Performance observer for monitoring long tasks
 */
export const setupPerformanceObserver = () => {
  if (!window.PerformanceObserver) return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 50) { // Tasks longer than 50ms
        if (process.env.NODE_ENV === 'development') {
          console.warn('Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
          });
        }
      }
    }
  });

  observer.observe({ entryTypes: ['longtask'] });
};

/**
 * Measure component render time
 * @param {string} componentName - Name of the component
 * @param {Function} renderFn - Render function to measure
 * @returns {*} Render result
 */
export const measureComponentRender = (componentName, renderFn) => {
  return measurePerformance(renderFn, `${componentName} render`);
};

/**
 * Track API call performance
 * @param {string} endpoint - API endpoint
 * @param {Function} apiCall - API call function
 * @returns {Promise<*>} API response
 */
export const trackApiCall = async (endpoint, apiCall) => {
  const start = performance.now();
  
  try {
    const result = await apiCall();
    const duration = performance.now() - start;
    
    metrics.apiCalls.push({
      endpoint,
      duration,
      success: true,
      timestamp: new Date().toISOString()
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`API call to ${endpoint} took ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const duration = performance.now() - start;
    
    metrics.apiCalls.push({
      endpoint,
      duration,
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });

    throw error;
  }
};

/**
 * Track user interaction performance
 * @param {string} interactionName - Name of the interaction
 * @param {Function} interactionFn - Interaction function
 * @returns {*} Interaction result
 */
export const trackUserInteraction = (interactionName, interactionFn) => {
  return measurePerformance(interactionFn, `User interaction: ${interactionName}`);
};

/**
 * Get performance metrics
 * @returns {Object} Performance metrics
 */
export const getPerformanceMetrics = () => {
  const apiCalls = metrics.apiCalls;
  const successfulCalls = apiCalls.filter(call => call.success);
  const failedCalls = apiCalls.filter(call => !call.success);

  return {
    totalApiCalls: apiCalls.length,
    successfulApiCalls: successfulCalls.length,
    failedApiCalls: failedCalls.length,
    averageApiCallDuration: successfulCalls.length > 0 
      ? successfulCalls.reduce((sum, call) => sum + call.duration, 0) / successfulCalls.length 
      : 0,
    totalPageLoads: metrics.pageLoads.length,
    totalComponentRenders: metrics.componentRenders.length,
    totalUserInteractions: metrics.userInteractions.length
  };
};

/**
 * Clear performance metrics
 */
export const clearPerformanceMetrics = () => {
  Object.keys(metrics).forEach(key => {
    metrics[key] = [];
  });
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
 * Memoize function for performance optimization
 * @param {Function} func - Function to memoize
 * @returns {Function} Memoized function
 */
export const memoize = (func) => {
  const cache = new Map();
  
  return function memoizedFunction(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Measure memory usage (if available)
 * @returns {Object|null} Memory usage information
 */
export const getMemoryUsage = () => {
  if (performance.memory) {
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    };
  }
  return null;
};

/**
 * Check if device is low-end
 * @returns {boolean} True if device is considered low-end
 */
export const isLowEndDevice = () => {
  const memory = getMemoryUsage();
  const cores = navigator.hardwareConcurrency || 1;
  
  if (memory) {
    const memoryGB = memory.jsHeapSizeLimit / (1024 * 1024 * 1024);
    return memoryGB < 2 || cores < 4;
  }
  
  // Fallback to user agent detection
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('android') && userAgent.includes('mobile');
};

/**
 * Initialize performance monitoring
 */
export const initializePerformanceMonitoring = () => {
  setupPerformanceObserver();
  
  // Track page load time
  window.addEventListener('load', () => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    metrics.pageLoads.push({
      loadTime,
      timestamp: new Date().toISOString()
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Page load time: ${loadTime}ms`);
    }
  });
}; 