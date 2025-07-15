// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const influencerRoutes = require('./routes/influencerRoutes');

/**
 * Create and configure Express application
 * @returns {express.Application} Configured Express app
 */
const createApp = () => {
  const app = express();

  // CORS configuration
  app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3011', 'http://localhost:5174'],
    credentials: true
  }));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      message: 'Infinder New Design API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
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
      environment: process.env.NODE_ENV || 'development',
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
      message: 'Infinder New Design API Information',
      data: {
        name: 'Infinder New Design API',
        version: '1.0.0',
        description: 'Backend API for the new design iteration of Infinder',
        environment: process.env.NODE_ENV || 'development',
        endpoints: {
          health: '/api/ping',
          info: '/api/info',
          influencers: '/api/influencers'
        },
        timestamp: new Date().toISOString()
      }
    });
  });

  // Influencer routes
  app.use('/api/influencers', influencerRoutes);

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
      path: req.originalUrl
    });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });

  return app;
};

module.exports = { createApp }; 