const express = require('express');
const { applySecurityMiddleware } = require('./middleware/security');
const { createLogger } = require('./middleware/logger');
const config = require('./config/environment');

// Import routes
const influencerRoutes = require('./routes/influencerRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const collaborationRoutes = require('./routes/collaborationRoutes');
const brandRoutes = require('./routes/brandRoutes');
const campaignInfluencerRoutes = require('./routes/campaignInfluencerRoutes');
const rejectedInfluencerRoutes = require('./routes/rejectedInfluencerRoutes');
const healthRoutes = require('./routes/healthRoutes');

// WebSocket setup
const WebSocket = require('ws');
const http = require('http');

const createApp = () => {
  const app = express();
  const server = http.createServer(app);

  // Create WebSocket server
  const wss = new WebSocket.Server({ server, path: '/ws' });

  // WebSocket connection handling
  const clients = new Map();
  const channels = new Map();

  wss.on('connection', (ws, req) => {
    const clientId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    clients.set(clientId, ws);
    
    console.log(`🔌 WebSocket client connected: ${clientId}`);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        handleWebSocketMessage(clientId, data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log(`🔌 WebSocket client disconnected: ${clientId}`);
      clients.delete(clientId);
      
      // Remove client from all channels
      channels.forEach((channelClients, channel) => {
        channelClients.delete(clientId);
        if (channelClients.size === 0) {
          channels.delete(channel);
        }
      });
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
      clients.delete(clientId);
    });
  });

  // Handle WebSocket messages
  const handleWebSocketMessage = (clientId, data) => {
    const { type, channel, payload } = data;

    switch (type) {
      case 'subscribe':
        if (channel) {
          if (!channels.has(channel)) {
            channels.set(channel, new Set());
          }
          channels.get(channel).add(clientId);
          console.log(`📡 Client ${clientId} subscribed to channel: ${channel}`);
        }
        break;

      case 'unsubscribe':
        if (channel && channels.has(channel)) {
          channels.get(channel).delete(clientId);
          if (channels.get(channel).size === 0) {
            channels.delete(channel);
          }
          console.log(`📡 Client ${clientId} unsubscribed from channel: ${channel}`);
        }
        break;

      case 'ping':
        const client = clients.get(clientId);
        if (client && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        }
        break;

      default:
        console.log(`Received message from client ${clientId}:`, data);
    }
  };

  // Broadcast message to channel
  const broadcastToChannel = (channel, message) => {
    if (channels.has(channel)) {
      const channelClients = channels.get(channel);
      const disconnectedClients = [];

      channelClients.forEach(clientId => {
        const client = clients.get(clientId);
        if (client && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        } else {
          disconnectedClients.push(clientId);
        }
      });

      // Clean up disconnected clients
      disconnectedClients.forEach(clientId => {
        channelClients.delete(clientId);
        clients.delete(clientId);
      });

      if (channelClients.size === 0) {
        channels.delete(channel);
      }
    }
  };

  // Make broadcast function available globally
  global.broadcastToChannel = broadcastToChannel;

  // Apply security middleware
  applySecurityMiddleware(app);

  // Logging middleware
  app.use(createLogger());

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      message: 'Infinder API',
      version: '1.0.0',
      environment: config.nodeEnv,
      timestamp: new Date().toISOString()
    });
  });

  // Health check endpoint
  app.get('/api/ping', (req, res) => {
    const uptime = process.uptime();
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      environment: config.nodeEnv,
      version: '1.0.0'
    };

    res.json({
      success: true,
      message: 'Server is healthy',
      data: healthData,
      statusCode: 200,
      timestamp: new Date().toISOString()
    });
  });

  // API information endpoint
  app.get('/api/info', (req, res) => {
    res.json({
      success: true,
      message: 'Infinder API Information',
      data: {
        name: 'Infinder API',
        version: '1.0.0',
        description: 'Backend API for Infinder platform',
        environment: config.nodeEnv,
        endpoints: {
          health: '/api/ping',
          info: '/api/info',
          influencers: '/api/influencers',
          campaigns: '/api/campaigns',
          brands: '/api/brands'
        },
        timestamp: new Date().toISOString()
      }
    });
  });

  // Server-Sent Events endpoint
  app.get('/api/events', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    const clientId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connected', clientId, timestamp: Date.now() })}\n\n`);

    // Keep connection alive with periodic pings
    const pingInterval = setInterval(() => {
      res.write(`data: ${JSON.stringify({ type: 'ping', timestamp: Date.now() })}\n\n`);
    }, 30000);

    // Handle client disconnect
    req.on('close', () => {
      clearInterval(pingInterval);
      console.log(`📡 SSE client disconnected: ${clientId}`);
    });
  });

  // API routes
  app.use('/api/influencers', influencerRoutes);
  app.use('/api/campaigns', campaignRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/collaboration-requests', collaborationRoutes);
  app.use('/api/brands', brandRoutes);
  app.use('/api/campaign-influencers', campaignInfluencerRoutes);
  app.use('/api/rejected-influencers', rejectedInfluencerRoutes);
  app.use('/api/health', healthRoutes);

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: config.nodeEnv === 'development' ? err.message : 'Something went wrong'
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found',
      path: req.originalUrl
    });
  });

  return { app, server, wss };
};

module.exports = { createApp }; 