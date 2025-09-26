const express = require('express');
const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/ping', (req, res) => {
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

/**
 * API information endpoint
 */
router.get('/info', (req, res) => {
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
        info: '/api/info'
      },
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router; 