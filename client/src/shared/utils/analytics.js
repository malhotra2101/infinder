/**
 * Analytics and Performance Monitoring Utilities
 * 
 * Provides comprehensive tracking for user interactions, performance metrics,
 * and error monitoring. Supports Google Analytics and custom analytics.
 */

// Configuration
const ANALYTICS_CONFIG = {
  enabled: import.meta.env.MODE === 'production',
  debug: import.meta.env.MODE === 'development',
  gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID || '',
  apiEndpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT || '/api/analytics'
};

class AnalyticsManager {
  constructor() {
    this.isInitialized = false;
    this.sessionId = this.generateSessionId();
    this.pageLoadTime = performance.now();
    this.events = [];
    this.performanceObserver = null;
    
    if (ANALYTICS_CONFIG.enabled) {
      this.initializeAnalytics();
    }
  }

  /**
   * Initialize analytics services
   */
  initializeAnalytics() {
    try {
      // Initialize Google Analytics if tracking ID is provided
      if (ANALYTICS_CONFIG.gaTrackingId) {
        this.initializeGoogleAnalytics();
      }

      // Initialize performance monitoring
      this.initializePerformanceMonitoring();

      // Track initial page load
      this.trackPageLoad();

      this.isInitialized = true;
      
      if (ANALYTICS_CONFIG.debug) {
        console.log('Analytics initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  /**
   * Initialize Google Analytics
   */
  initializeGoogleAnalytics() {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.gaTrackingId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ANALYTICS_CONFIG.gaTrackingId, {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        custom_parameter_1: 'session_id'
      }
    });

    // Set custom session ID
    window.gtag('config', ANALYTICS_CONFIG.gaTrackingId, {
      custom_parameter_1: this.sessionId
    });
  }

  /**
   * Initialize performance monitoring
   */
  initializePerformanceMonitoring() {
    // Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      this.observePerformance('largest-contentful-paint', (entries) => {
        const lcp = entries[entries.length - 1];
        this.trackPerformanceMetric('LCP', lcp.startTime, {
          element: lcp.element?.tagName || 'unknown'
        });
      });

      // First Input Delay (FID)
      this.observePerformance('first-input', (entries) => {
        const fid = entries[0];
        this.trackPerformanceMetric('FID', fid.processingStart - fid.startTime, {
          eventType: fid.name
        });
      });

      // Cumulative Layout Shift (CLS)
      this.observePerformance('layout-shift', (entries) => {
        let clsValue = 0;
        for (const entry of entries) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        if (clsValue > 0) {
          this.trackPerformanceMetric('CLS', clsValue);
        }
      });
    }

    // Track navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          this.trackPerformanceMetric('PageLoad', navigation.loadEventEnd - navigation.fetchStart, {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            firstByte: navigation.responseStart - navigation.fetchStart
          });
        }
      }, 0);
    });
  }

  /**
   * Observe specific performance metrics
   */
  observePerformance(type, callback) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ type, buffered: true });
    } catch (error) {
      if (ANALYTICS_CONFIG.debug) {
        console.warn(`Could not observe ${type}:`, error);
      }
    }
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Track page views
   */
  trackPageView(page, title = document.title) {
    if (!ANALYTICS_CONFIG.enabled) return;

    const event = {
      type: 'page_view',
      page,
      title,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', ANALYTICS_CONFIG.gaTrackingId, {
        page_title: title,
        page_location: window.location.href
      });
    }

    // Custom analytics
    this.sendEvent(event);

    if (ANALYTICS_CONFIG.debug) {
      console.log('Page view tracked:', event);
    }
  }

  /**
   * Track user events
   */
  trackEvent(action, category = 'User', label = '', value = 0, customData = {}) {
    if (!ANALYTICS_CONFIG.enabled) return;

    const event = {
      type: 'event',
      action,
      category,
      label,
      value,
      customData,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      page: window.location.pathname
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        custom_parameter_1: this.sessionId
      });
    }

    // Custom analytics
    this.sendEvent(event);

    if (ANALYTICS_CONFIG.debug) {
      console.log('Event tracked:', event);
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformanceMetric(name, value, metadata = {}) {
    if (!ANALYTICS_CONFIG.enabled) return;

    const event = {
      type: 'performance',
      name,
      value: Math.round(value),
      metadata,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      page: window.location.pathname
    };

    // Google Analytics (as custom event)
    if (window.gtag) {
      window.gtag('event', 'performance_metric', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        custom_parameter_1: this.sessionId
      });
    }

    // Custom analytics
    this.sendEvent(event);

    if (ANALYTICS_CONFIG.debug) {
      console.log('Performance metric tracked:', event);
    }
  }

  /**
   * Track user timing
   */
  trackTiming(category, variable, time, label = '') {
    if (!ANALYTICS_CONFIG.enabled) return;

    const event = {
      type: 'timing',
      category,
      variable,
      time,
      label,
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        event_category: category,
        event_label: `${variable}${label ? ` - ${label}` : ''}`,
        value: time
      });
    }

    // Custom analytics
    this.sendEvent(event);

    if (ANALYTICS_CONFIG.debug) {
      console.log('Timing tracked:', event);
    }
  }

  /**
   * Track errors
   */
  trackError(error, context = '') {
    if (!ANALYTICS_CONFIG.enabled) return;

    const event = {
      type: 'error',
      message: error.message || error.toString(),
      stack: error.stack,
      context,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      page: window.location.pathname,
      userAgent: navigator.userAgent
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message || error.toString(),
        fatal: false
      });
    }

    // Custom analytics
    this.sendEvent(event);

    if (ANALYTICS_CONFIG.debug) {
      console.log('Error tracked:', event);
    }
  }

  /**
   * Track page load performance
   */
  trackPageLoad() {
    const loadTime = performance.now() - this.pageLoadTime;
    this.trackTiming('Page Load', 'Initial Load', Math.round(loadTime));
  }

  /**
   * Send event to custom analytics endpoint
   */
  async sendEvent(event) {
    try {
      this.events.push(event);

      // Batch send events to reduce requests
      if (this.events.length >= 10) {
        await this.flushEvents();
      }
    } catch (error) {
      if (ANALYTICS_CONFIG.debug) {
        console.error('Failed to queue event:', error);
      }
    }
  }

  /**
   * Flush queued events to server
   */
  async flushEvents() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch(ANALYTICS_CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          events: eventsToSend,
          sessionId: this.sessionId
        })
      });

      if (ANALYTICS_CONFIG.debug) {
        console.log(`Sent ${eventsToSend.length} analytics events`);
      }
    } catch (error) {
      // Re-queue events if sending failed
      this.events.unshift(...eventsToSend);
      
      if (ANALYTICS_CONFIG.debug) {
        console.error('Failed to send analytics events:', error);
      }
    }
  }

  /**
   * Clean up and flush remaining events
   */
  cleanup() {
    if (this.events.length > 0) {
      this.flushEvents();
    }
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }
}

// Create singleton instance
const analytics = new AnalyticsManager();

// Flush events on page unload
window.addEventListener('beforeunload', () => {
  analytics.cleanup();
});

// Auto-flush events periodically
setInterval(() => {
  analytics.flushEvents();
}, 30000); // Every 30 seconds

export default analytics;
