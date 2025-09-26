// Environment configuration
require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 5051,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration will be added for new database design
  
  // CORS configuration
  cors: {
    origins: process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
      : [
          'http://localhost:3001',
          'http://localhost:3002',
          'http://localhost:3003', 
          'http://localhost:3004',
          'http://localhost:3011',
          'http://localhost:5174',
          'http://localhost:3000',
          'http://localhost:5173'
        ],
    credentials: true
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};

// Environment validation will be updated for new database design

module.exports = config; 