import { useState, useEffect, useRef } from 'react';
import { getListCounts } from '../services/backendApi.js';

/**
 * Custom hook for managing list counts with caching and debouncing
 * @param {Function} refreshTrigger - Function that triggers refresh when called
 * @returns {Object} List counts and loading state
 */
export const useListCounts = (refreshTrigger) => {
  const [listCounts, setListCounts] = useState({
    selected: 0,
    rejected: 0,
    suggested: 0,
    total: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const lastFetchTime = useRef(0);
  const isFetching = useRef(false);
  const cacheTimeout = useRef(null);

  const fetchCounts = async (force = false) => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime.current;
    
    // Don't fetch if we've fetched in the last 3 seconds or if already fetching
    if ((!force && timeSinceLastFetch < 3000) || isFetching.current) {
      return;
    }
    
    isFetching.current = true;
    setLoading(true);
    setError(null);
    lastFetchTime.current = now;
    
    try {
      const counts = await getListCounts();
      setListCounts({
        selected: counts.selected || 0,
        rejected: counts.rejected || 0,
        suggested: counts.suggested || 0,
        total: counts.total || 0
      });
    } catch (error) {
      console.error('Error fetching list counts:', error);
      setError(error.message);
      // Keep previous counts on error to prevent UI flicker
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchCounts(true);
  }, []);

  // Debounced refresh when refreshTrigger changes
  useEffect(() => {
    if (cacheTimeout.current) {
      clearTimeout(cacheTimeout.current);
    }
    
    cacheTimeout.current = setTimeout(() => {
      fetchCounts();
    }, 500); // 500ms debounce
    
    return () => {
      if (cacheTimeout.current) {
        clearTimeout(cacheTimeout.current);
      }
    };
  }, [refreshTrigger]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cacheTimeout.current) {
        clearTimeout(cacheTimeout.current);
      }
    };
  }, []);

  return {
    listCounts,
    loading,
    error,
    refetch: () => fetchCounts(true)
  };
}; 