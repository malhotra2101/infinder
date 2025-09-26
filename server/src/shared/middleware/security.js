const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('../../config/environment');

/**
 * CORS middleware configuration
 */
const corsMiddleware = cors({
  origin: config.cors.origins,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});

/**
 * Rate limiting middleware
 */
const rateLimitMiddleware = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Helmet security middleware
 */
const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
});

/**
 * Request size limiting middleware
 */
const requestSizeLimit = (req, res, next) => {
  // Limit request body size to 10MB
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 10 * 1024 * 1024) {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large',
      timestamp: new Date().toISOString()
    });
  }
  next();
};

/**
 * Apply all security middleware
 * @param {Object} app - Express application
 */
const applySecurityMiddleware = (app) => {
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  
  // Only apply rate limiting in production
  if (process.env.NODE_ENV === 'production') {
    app.use(rateLimitMiddleware);
  }
  
  app.use(requestSizeLimit);
};

module.exports = {
  corsMiddleware,
  rateLimitMiddleware,
  helmetMiddleware,
  requestSizeLimit,
  applySecurityMiddleware
}; 