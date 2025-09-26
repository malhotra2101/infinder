// Load environment variables from .env file
require('dotenv').config();

/**
 * Server Entry Point
 *
 * Main server startup file that initializes the Express application
 * and starts the HTTP server.
 */

const { createApp } = require('./src/app');
const config = require('./src/config/environment');
const emailQueueManager = require('./src/features/email-marketing/services/emailQueueManager');

/**
 * Start the server
 * @param {number} port - Port number to listen on
 * @returns {Promise<void>}
 */
const startServer = async (port = config.port) => {
  try {
    // Database connection will be configured for new database design

    // Create Express application with WebSocket support
    const { app, server, wss } = createApp();

    // Start HTTP server with WebSocket support
    server.listen(port, () => {
      if (config.nodeEnv === 'development') {
        console.log(`🚀 Infinder Server running on port ${port}`);
        console.log(`🔌 WebSocket server ready on ws://localhost:${port}/ws`);
        console.log(`📡 SSE endpoint available at http://localhost:${port}/api/events`);
        console.log(`📊 API Health Check: http://localhost:${port}/api/ping`);
        console.log(`🌐 Environment: ${config.nodeEnv}`);
        console.log(`📝 API Documentation: http://localhost:${port}/api/info`);
      }
      
      // Start email queue manager
      emailQueueManager.start(60000); // Process every minute
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

/**
 * Handle graceful shutdown
 */
const handleGracefulShutdown = (signal) => {
  if (config.nodeEnv === 'development') {
    console.log(`🛑 ${signal} received, shutting down gracefully`);
  }
  
  // Stop email queue manager
  emailQueueManager.stop();
  
  process.exit(0);
};

// Handle graceful shutdown
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { startServer }; 