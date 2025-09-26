const morgan = require('morgan');
const config = require('../../config/environment');

/**
 * Custom logging format for development
 */
const developmentFormat = ':method :url :status :response-time ms - :res[content-length] bytes';

/**
 * Custom logging format for production
 */
const productionFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

/**
 * Create logger middleware
 * @returns {Function} Morgan middleware function
 */
const createLogger = () => {
  const format = config.nodeEnv === 'development' ? developmentFormat : productionFormat;
  
  return morgan(format, {
    skip: (req, res) => {
      // Skip logging for health checks and static files
      return req.url === '/api/ping' || req.url.startsWith('/static');
    }
  });
};

/**
 * Request logging middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date().toISOString()
    };

    if (config.nodeEnv === 'development') {
      console.log('📝 Request:', logData);
    }
  });

  next();
};

module.exports = {
  createLogger,
  requestLogger
}; 