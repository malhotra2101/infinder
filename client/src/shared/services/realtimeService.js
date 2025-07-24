/**
 * Real-time Service
 * 
 * Comprehensive real-time update system using WebSockets, Supabase real-time,
 * and Server-Sent Events for fallback. Provides unified API for real-time updates.
 */

import { supabase } from './supabase';

// WebSocket configuration
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5052/ws';
const WS_ENABLED = import.meta.env.VITE_WS_ENABLED !== 'false'; // Default to enabled

class RealtimeService {
  constructor() {
    this.supabase = supabase;
    this.ws = null;
    this.eventSource = null;
    this.subscriptions = new Map();
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isConnected = false;
    this.connectionPromise = null;
    this.reconnectTimeout = null;
  }

  /**
   * Connect to WebSocket server
   */
  async connectWebSocket() {
    // Skip if WebSockets are disabled
    if (!WS_ENABLED) {
      return Promise.resolve();
    }
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    // If we're already trying to connect, return the existing promise
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // If we've reached max reconnect attempts, don't try again
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return Promise.resolve();
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(WS_URL);
        
        // Set a connection timeout
        const connectionTimeout = setTimeout(() => {
          if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
            // Close the socket if it's still connecting
            if (this.ws.readyState === WebSocket.CONNECTING) {
              this.ws.close();
            }
            resolve(); // Resolve anyway to not block the application
          }
        }, 5000);
        
        this.ws.onopen = () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          clearTimeout(connectionTimeout);
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(data);
          } catch (error) {
            // Silently handle parsing errors
          }
        };

        this.ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          this.isConnected = false;
          this.ws = null;
          this.connectionPromise = null;
          this.handleReconnect();
          resolve(); // Resolve anyway to not block the application
        };

        this.ws.onerror = (error) => {
          // Don't reject as onclose will be called after onerror
          resolve(); // Resolve anyway to not block the application
        };
      } catch (error) {
        this.connectionPromise = null;
        resolve(); // Resolve anyway to not block the application
      }
    }).catch(error => {
      this.connectionPromise = null;
      // Return resolved promise to not block the application
      return Promise.resolve();
    });

    return this.connectionPromise;
  }

  /**
   * Handle WebSocket reconnection
   */
  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    this.reconnectAttempts++;
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);

    // Clear any existing reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      // Check if server is available before trying to reconnect
      fetch('http://localhost:5052/api/ping', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      })
      .then(response => {
        if (response.ok) {
          return this.connectWebSocket();
        } else {
          return Promise.resolve();
        }
      })
      .catch(error => {
        // Silently handle connection errors
      });
    }, this.reconnectDelay);
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleWebSocketMessage(data) {
    const { type, payload, channel } = data;
    
    // Notify all listeners for this channel
    if (this.listeners.has(channel)) {
      this.listeners.get(channel).forEach(callback => {
        try {
          callback({ type, payload, channel });
        } catch (error) {
          // Silently handle callback errors
        }
      });
    }

    // Handle specific message types
    switch (type) {
      case 'collaboration_request':
        this.handleCollaborationRequest(payload);
        break;
      case 'campaign_update':
        this.handleCampaignUpdate(payload);
        break;
      case 'influencer_update':
        this.handleInfluencerUpdate(payload);
        break;
      case 'notification':
        this.handleNotification(payload);
        break;
      default:
        // Ignore unknown message types
    }
  }

  /**
   * Subscribe to Supabase real-time changes
   */
  subscribeToTable(table, event = '*', callback) {
    if (!this.supabase) {
      return null;
    }

    try {
      // Check if the channel method exists (should be available in Supabase client)
      if (!this.supabase.channel) {
        return null;
      }
      
      const subscription = this.supabase
        .channel(`table:${table}`)
        .on('postgres_changes', {
          event,
          schema: 'public',
          table
        }, (payload) => {
          try {
            callback(payload);
          } catch (error) {
            // Silently handle callback errors
          }
        })
        .subscribe();

      this.subscriptions.set(`${table}:${event}`, subscription);
      return subscription;
    } catch (error) {
      return null;
    }
  }

  /**
   * Subscribe to WebSocket channel
   */
  subscribeToChannel(channel, callback) {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    this.listeners.get(channel).add(callback);

    // Send subscription message to server
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({
          type: 'subscribe',
          channel
        }));
      } catch (error) {
        // Silently handle send errors
      }
    }

    return () => {
      this.unsubscribeFromChannel(channel, callback);
    };
  }

  /**
   * Unsubscribe from WebSocket channel
   */
  unsubscribeFromChannel(channel, callback) {
    if (this.listeners.has(channel)) {
      this.listeners.get(channel).delete(callback);
      
      if (this.listeners.get(channel).size === 0) {
        this.listeners.delete(channel);
        
        // Send unsubscribe message to server
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          try {
            this.ws.send(JSON.stringify({
              type: 'unsubscribe',
              channel
            }));
          } catch (error) {
            // Silently handle send errors
          }
        }
      }
    }
  }

  /**
   * Send message through WebSocket
   */
  sendMessage(type, payload, channel = null) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type,
        payload,
        timestamp: Date.now()
      };
      
      if (channel) {
        message.channel = channel;
      }
      
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        // Silently handle send errors
      }
    }
  }

  /**
   * Handle collaboration request updates
   */
  handleCollaborationRequest(payload) {
    const { action, request } = payload;
    
    // Emit custom event for collaboration updates
    try {
      window.dispatchEvent(new CustomEvent('collaboration-update', {
        detail: { action, request }
      }));
    } catch (error) {
      // Silently handle event dispatch errors
    }
  }

  /**
   * Handle campaign updates
   */
  handleCampaignUpdate(payload) {
    const { action, campaign } = payload;
    
    // Emit custom event for campaign updates
    try {
      window.dispatchEvent(new CustomEvent('campaign-update', {
        detail: { action, campaign }
      }));
    } catch (error) {
      // Silently handle event dispatch errors
    }
  }

  /**
   * Handle influencer updates
   */
  handleInfluencerUpdate(payload) {
    const { action, influencer } = payload;
    
    // Emit custom event for influencer updates
    try {
      window.dispatchEvent(new CustomEvent('influencer-update', {
        detail: { action, influencer }
      }));
    } catch (error) {
      // Silently handle event dispatch errors
    }
  }

  /**
   * Handle notifications
   */
  handleNotification(payload) {
    const { type, message, data } = payload;
    
    // Emit custom event for notifications
    try {
      window.dispatchEvent(new CustomEvent('notification', {
        detail: { type, message, data }
      }));
    } catch (error) {
      // Silently handle event dispatch errors
    }
  }

  /**
   * Initialize Server-Sent Events as fallback
   */
  initializeSSE() {
    // Skip if we already have a connection or if the server is likely unavailable
    if (this.eventSource || this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    // Fix: Ensure only one '/api' in the SSE URL
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5052';
    if (baseUrl.endsWith('/api')) {
      baseUrl = baseUrl.replace(/\/api$/, '');
    }
    const sseUrl = `${baseUrl}/api/events`;
    
    try {
      this.eventSource = new EventSource(sseUrl);
      
      this.eventSource.onopen = () => {
        // Connection established
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleSSEMessage(data);
        } catch (error) {
          // Silently handle parsing errors
        }
      };

      this.eventSource.onerror = (error) => {
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
      };

    } catch (error) {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    }
  }

  /**
   * Handle SSE messages
   */
  handleSSEMessage(data) {
    // Handle SSE messages similar to WebSocket messages
    this.handleWebSocketMessage(data);
  }

  /**
   * Disconnect all connections
   */
  disconnect() {
    // Clear any reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    // Close WebSocket
    if (this.ws) {
      try {
        this.ws.close();
      } catch (error) {
        // Silently handle close errors
      }
      this.ws = null;
    }

    // Close SSE
    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch (error) {
        // Silently handle close errors
      }
      this.eventSource = null;
    }

    // Unsubscribe from Supabase
    this.subscriptions.forEach(subscription => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        // Silently handle unsubscribe errors
      }
    });
    this.subscriptions.clear();

    // Clear listeners
    this.listeners.clear();

    this.isConnected = false;
    this.connectionPromise = null;
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      websocket: this.ws?.readyState === WebSocket.OPEN,
      supabase: !!this.supabase,
      sse: this.eventSource?.readyState === EventSource.OPEN,
      isConnected: this.isConnected
    };
  }
}

// Create singleton instance
const realtimeService = new RealtimeService();

export default realtimeService; 