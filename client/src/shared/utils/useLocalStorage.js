/**
 * useLocalStorage Hook
 * 
 * Custom hook for managing localStorage with React state synchronization.
 * Provides a simple interface for storing and retrieving data from localStorage.
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage operations
 * @param {string} key - localStorage key
 * @param {any} initialValue - Default value if key doesn't exist
 * @returns {Array} [storedValue, setValue] - Current value and setter function
 */
export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Silently handle errors
    }
  };

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          // Silently handle errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};

/**
 * Hook for storing sidebar state
 * @returns {Array} [isExpanded, setIsExpanded] - Sidebar expansion state
 */
export const useSidebarState = () => {
  return useLocalStorage('sidebar-expanded', false);
};

/**
 * Hook for storing user preferences
 * @returns {Array} [preferences, setPreferences] - User preferences
 */
export const useUserPreferences = () => {
  return useLocalStorage('user-preferences', {
    theme: 'light',
    animations: true,
    notifications: true
  });
}; 