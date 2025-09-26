/**
 * Health Check Controller
 * 
 * Handles health check and system status endpoints.
 * Provides information about server status, database connectivity, and system health.
 */

const { asyncHandler, createSuccessResponse, APIError } = require('../utils/errorHandler');

/**
 * Health check endpoint
 * GET /api/ping
 * 
 * Checks server status and database connectivity
 */
const healthCheck = asyncHandler(async (req, res) => {
  try {
    // TODO: Add more comprehensive health checks
    // - Database connection status
    // - External service dependencies
    // - System resources (memory, CPU)
    // - Cache status
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    };
    
    res.json(createSuccessResponse(healthData, 'Server is healthy'));
  } catch (error) {
    throw new APIError('Health check failed', 500);
  }
});

/**
 * Detailed health check endpoint
 * GET /api/health
 * 
 * Provides comprehensive system health information
 */
const detailedHealthCheck = asyncHandler(async (req, res) => {
  try {
    // TODO: Implement comprehensive health checks
    const healthInfo = {
      server: {
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      },
      database: {
        status: 'unknown', // TODO: Implement actual DB check
        connection: 'pending'
      },
      services: {
        // TODO: Add external service health checks
      },
      environment: {
        node: process.version,
        platform: process.platform,
        env: process.env.NODE_ENV || 'development'
      }
    };
    
    res.json(createSuccessResponse(healthInfo, 'Detailed health check completed'));
  } catch (error) {
    throw new APIError('Detailed health check failed', 500);
  }
});

/**
 * System information endpoint
 * GET /api/info
 * 
 * Provides basic system information
 */
const systemInfo = asyncHandler(async (req, res) => {
  const systemInfo = {
    name: 'Infinder API Server',
    version: '1.0.0',
    description: 'Backend API for Influencer Marketing Platform',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/ping',
      detailedHealth: '/api/health',
      info: '/api/info'
    }
  };
  
  res.json(createSuccessResponse(systemInfo, 'System information retrieved'));
});

module.exports = {
  healthCheck,
  detailedHealthCheck,
  systemInfo
}; 