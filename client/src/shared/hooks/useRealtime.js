/**
 * Real-time React Hooks
 * 
 * Custom hooks for integrating real-time updates into React components.
 * Provides easy-to-use interfaces for WebSocket, Supabase, and SSE connections.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import realtimeService from '../services/realtimeService.js';

/**
 * Hook for WebSocket channel subscriptions
 * @param {string} channel - Channel name to subscribe to
 * @param {Function} callback - Callback function for messages
 * @param {Object} options - Additional options
 * @returns {Object} Connection status and utilities
 */
export const useWebSocket = (channel, callback, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);

  const handleMessage = useCallback((message) => {
    setLastMessage(message);
    if (callback) {
      callback(message);
    }
  }, [callback]);

  useEffect(() => {
    const connect = async () => {
      try {
        setError(null);
        await realtimeService.connectWebSocket();
        setIsConnected(true);
        
        // Subscribe to channel
        unsubscribeRef.current = realtimeService.subscribeToChannel(channel, handleMessage);
        
      } catch (err) {
        setError(err.message);
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [channel, handleMessage]);

  const sendMessage = useCallback((type, payload) => {
    realtimeService.sendMessage(type, payload, channel);
  }, [channel]);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    connectionStatus: realtimeService.getConnectionStatus()
  };
};

/**
 * Hook for Supabase real-time table subscriptions
 * @param {string} table - Table name to subscribe to
 * @param {string} event - Event type (INSERT, UPDATE, DELETE, *)
 * @param {Function} callback - Callback function for changes
 * @returns {Object} Subscription status and utilities
 */
export const useSupabaseRealtime = (table, event = '*', callback) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [lastChange, setLastChange] = useState(null);
  const [error, setError] = useState(null);
  const subscriptionRef = useRef(null);

  const handleChange = useCallback((payload) => {
    setLastChange(payload);
    if (callback) {
      callback(payload);
    }
  }, [callback]);

  useEffect(() => {
    if (!table) return;

    try {
      setError(null);
      subscriptionRef.current = realtimeService.subscribeToTable(table, event, handleChange);
      setIsSubscribed(true);
    } catch (err) {
      setError(err.message);
      setIsSubscribed(false);
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [table, event, handleChange]);

  return {
    isSubscribed,
    lastChange,
    error
  };
};

/**
 * Hook for collaboration request real-time updates
 * @param {Function} callback - Callback function for updates
 * @returns {Object} Update status and utilities
 */
export const useCollaborationUpdates = (callback) => {
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleUpdate = (event) => {
      const { action, request } = event.detail;
      setLastUpdate({ action, request, timestamp: Date.now() });
      
      if (callback) {
        callback({ action, request });
      }
    };

    // Subscribe to collaboration updates
    const unsubscribe = realtimeService.subscribeToChannel('collaboration', (message) => {
      if (message.type === 'collaboration_request') {
        handleUpdate({ detail: message.payload });
      }
    });

    // Listen for custom events
    window.addEventListener('collaboration-update', handleUpdate);
    setIsConnected(true);

    return () => {
      unsubscribe();
      window.removeEventListener('collaboration-update', handleUpdate);
      setIsConnected(false);
    };
  }, [callback]);

  return {
    lastUpdate,
    isConnected
  };
};

/**
 * Hook for campaign real-time updates
 * @param {Function} callback - Callback function for updates
 * @returns {Object} Update status and utilities
 */
export const useCampaignUpdates = (callback) => {
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleUpdate = (event) => {
      const { action, campaign } = event.detail;
      setLastUpdate({ action, campaign, timestamp: Date.now() });
      
      if (callback) {
        callback({ action, campaign });
      }
    };

    // Subscribe to campaign updates
    const unsubscribe = realtimeService.subscribeToChannel('campaigns', (message) => {
      if (message.type === 'campaign_update') {
        handleUpdate({ detail: message.payload });
      }
    });

    // Listen for custom events
    window.addEventListener('campaign-update', handleUpdate);
    setIsConnected(true);

    return () => {
      unsubscribe();
      window.removeEventListener('campaign-update', handleUpdate);
      setIsConnected(false);
    };
  }, [callback]);

  return {
    lastUpdate,
    isConnected
  };
};

/**
 * Hook for influencer real-time updates
 * @param {Function} callback - Callback function for updates
 * @returns {Object} Update status and utilities
 */
export const useInfluencerUpdates = (callback) => {
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleUpdate = (event) => {
      const { action, influencer } = event.detail;
      setLastUpdate({ action, influencer, timestamp: Date.now() });
      
      if (callback) {
        callback({ action, influencer });
      }
    };

    // Subscribe to influencer updates
    const unsubscribe = realtimeService.subscribeToChannel('influencers', (message) => {
      if (message.type === 'influencer_update') {
        handleUpdate({ detail: message.payload });
      }
    });

    // Listen for custom events
    window.addEventListener('influencer-update', handleUpdate);
    setIsConnected(true);

    return () => {
      unsubscribe();
      window.removeEventListener('influencer-update', handleUpdate);
      setIsConnected(false);
    };
  }, [callback]);

  return {
    lastUpdate,
    isConnected
  };
};

/**
 * Hook for notifications
 * @param {Function} callback - Callback function for notifications
 * @returns {Object} Notification status and utilities
 */
export const useNotifications = (callback) => {
  const [lastNotification, setLastNotification] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleNotification = (event) => {
      const { type, message, data } = event.detail;
      setLastNotification({ type, message, data, timestamp: Date.now() });
      
      if (callback) {
        callback({ type, message, data });
      }
    };

    // Subscribe to notifications
    const unsubscribe = realtimeService.subscribeToChannel('notifications', (message) => {
      if (message.type === 'notification') {
        handleNotification({ detail: message.payload });
      }
    });

    // Listen for custom events
    window.addEventListener('notification', handleNotification);
    setIsConnected(true);

    return () => {
      unsubscribe();
      window.removeEventListener('notification', handleNotification);
      setIsConnected(false);
    };
  }, [callback]);

  return {
    lastNotification,
    isConnected
  };
};

/**
 * Hook for optimistic updates with real-time confirmation
 * @param {Function} optimisticUpdate - Function to apply optimistic update
 * @param {Function} realtimeCallback - Callback for real-time confirmation
 * @returns {Object} Optimistic update utilities
 */
export const useOptimisticUpdate = (optimisticUpdate, realtimeCallback) => {
  const [pendingUpdates, setPendingUpdates] = useState(new Set());
  const [lastConfirmedUpdate, setLastConfirmedUpdate] = useState(null);

  const applyOptimisticUpdate = useCallback((updateId, updateData) => {
    // Apply optimistic update immediately
    optimisticUpdate(updateData);
    
    // Track pending update
    setPendingUpdates(prev => new Set(prev).add(updateId));
  }, [optimisticUpdate]);

  const handleRealtimeConfirmation = useCallback((updateData) => {
    const { updateId } = updateData;
    
    // Remove from pending updates
    setPendingUpdates(prev => {
      const newSet = new Set(prev);
      newSet.delete(updateId);
      return newSet;
    });
    
    setLastConfirmedUpdate(updateData);
    
    if (realtimeCallback) {
      realtimeCallback(updateData);
    }
  }, [realtimeCallback]);

  return {
    pendingUpdates,
    lastConfirmedUpdate,
    applyOptimisticUpdate,
    handleRealtimeConfirmation,
    hasPendingUpdates: pendingUpdates.size > 0
  };
};

/**
 * Hook for connection status monitoring
 * @returns {Object} Connection status information
 */
export const useConnectionStatus = () => {
  const [status, setStatus] = useState(realtimeService.getConnectionStatus());

  useEffect(() => {
    const updateStatus = () => {
      setStatus(realtimeService.getConnectionStatus());
    };

    // Update status every 5 seconds
    const interval = setInterval(updateStatus, 5000);

    // Also update on window focus
    const handleFocus = () => {
      updateStatus();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return status;
}; 