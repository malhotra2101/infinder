import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * 
 * Useful for search inputs and other scenarios where you want to
 * delay the execution of a function until the user stops typing.
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds (default: 500ms)
 * @returns {any} The debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Perform search with debounced value
 *     searchInfluencers(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up the timeout to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if the value changes before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce; 