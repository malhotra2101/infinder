// Load environment variables from .env file
require('dotenv').config();

/**
 * New Design Server Entry Point
 *
 * Main server startup file that initializes the Express application
 * and starts the HTTP server for the new design iteration.
 */

const { createApp } = require('./src/app');
const { initializeSupabase } = require('./src/config/database');

/**
 * Start the server
 * @param {number} port - Port number to listen on
 * @returns {Promise<void>}
 */
const startServer = async (port = 5052) => {
  try {
    // Initialize database connection
    // TODO: Add database connection validation
    const supabase = initializeSupabase();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ New Design Database connection initialized');
    }

    // Create Express application
    const app = createApp();

    // Start HTTP server
    app.listen(port, () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 New Design Infinder Server running on port ${port}`);
        console.log(`📊 API Health Check: http://localhost:${port}/api/ping`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📝 API Documentation: http://localhost:${port}/api/info`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start new design server:', error);
    process.exit(1);
  }
};

/**
 * Handle graceful shutdown
 */
const handleGracefulShutdown = (signal) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🛑 ${signal} received, shutting down gracefully`);
  }
  process.exit(0);
};

// Handle graceful shutdown
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

// Start server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5052;
  startServer(PORT);
}

module.exports = { startServer }; 