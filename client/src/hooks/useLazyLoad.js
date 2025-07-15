import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for lazy loading components with loading states and error handling
 * @param {Function} importFn - The dynamic import function
 * @param {Object} options - Configuration options
 * @returns {Object} - Loading state and component
 */
export const useLazyLoad = (importFn, options = {}) => {
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const { 
    maxRetries = 3, 
    retryDelay = 1000,
    onLoad,
    onError,
    componentName = 'Unknown Component'
  } = options;

  const loadComponent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const module = await importFn();
      const Component = module.default || module;
      
      setComponent(() => Component);
      setLoading(false);
      
      if (onLoad) onLoad(Component);
    } catch (err) {
      console.error('Lazy load error:', err);
      setError(err);
      setLoading(false);
      
      if (onError) onError(err);
    }
  }, [importFn, onLoad, onError, componentName]);

  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setTimeout(loadComponent, retryDelay);
    }
  }, [retryCount, maxRetries, retryDelay, loadComponent]);

  useEffect(() => {
    loadComponent();
  }, [loadComponent]);

  return {
    component,
    loading,
    error,
    retry,
    retryCount,
    hasMoreRetries: retryCount < maxRetries
  };
};

/**
 * Hook for lazy loading images with intersection observer
 * @param {string} src - Image source URL
 * @param {string} placeholder - Placeholder image URL
 * @param {Object} options - Intersection observer options
 * @returns {Object} - Image loading state and ref
 */
export const useLazyImage = (src, placeholder = '', options = {}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    let observer;
    
    if (imageRef) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(imageRef);
          }
        },
        {
          rootMargin: options.rootMargin || '50px',
          threshold: options.threshold || 0.1
        }
      );
      
      observer.observe(imageRef);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [imageRef, options.rootMargin, options.threshold]);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      
      img.onerror = () => {
        console.error('Failed to load image:', src);
        setIsLoaded(false);
      };
      
      img.src = src;
    }
  }, [isInView, src]);

  return {
    imageSrc,
    imageRef: setImageRef,
    isLoaded,
    isInView
  };
};

/**
 * Hook for lazy loading with preloading capability
 * @param {Function} importFn - The dynamic import function
 * @param {boolean} preload - Whether to preload the component
 * @returns {Object} - Component and loading state
 */
export const usePreloadableLazyLoad = (importFn, preload = false) => {
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preloaded, setPreloaded] = useState(false);

  const loadComponent = useCallback(async () => {
    if (component) return component;
    
    setLoading(true);
    try {
      const module = await importFn();
      const Component = module.default || module;
      
      setComponent(() => Component);
      setPreloaded(true);
      
      return Component;
    } catch (error) {
      console.error('Preload error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [component, importFn]);

  useEffect(() => {
    if (preload && !preloaded) {
      loadComponent();
    }
  }, [preload, preloaded, loadComponent]);

  return {
    component,
    loading,
    preloaded,
    loadComponent
  };
}; 