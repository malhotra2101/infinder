/**
 * useIntersectionObserver Hook
 * 
 * Custom hook for intersection observer functionality.
 * Useful for triggering animations when elements come into view.
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for intersection observer
 * @param {Object} options - Intersection observer options
 * @param {number} options.threshold - Threshold for triggering (0-1)
 * @param {string} options.rootMargin - Root margin for the observer
 * @param {boolean} options.triggerOnce - Whether to trigger only once
 * @returns {Array} [ref, isIntersecting] - Ref and intersection state
 */
export const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        
        if (isVisible && (!triggerOnce || !hasTriggered)) {
          setIsIntersecting(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce && !isVisible) {
          setIsIntersecting(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return [elementRef, isIntersecting];
};

/**
 * Hook for triggering animations when element comes into view
 * @param {Object} options - Animation options
 * @returns {Array} [ref, isVisible] - Ref and visibility state
 */
export const useAnimationTrigger = (options = {}) => {
  return useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
    ...options
  });
};

/**
 * Hook for infinite scroll functionality
 * @param {Object} options - Scroll options
 * @returns {Array} [ref, isNearBottom] - Ref and bottom proximity state
 */
export const useInfiniteScroll = (options = {}) => {
  return useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: false,
    ...options
  });
}; 