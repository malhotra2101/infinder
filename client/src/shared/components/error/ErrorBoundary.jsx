import React from 'react';
import PropTypes from 'prop-types';
import './ErrorBoundary.css';

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Here you could also log the error to an error reporting service
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI based on error type and context
      const { fallback: FallbackComponent, level = 'component' } = this.props;
      
      if (FallbackComponent) {
        return (
          <FallbackComponent 
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            onReload={this.handleReload}
            onGoHome={this.handleGoHome}
          />
        );
      }

      // Default fallback UI based on error level
      if (level === 'page') {
        return (
          <div className="error-boundary error-boundary--page">
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h1 className="error-title">Oops! Something went wrong</h1>
              <p className="error-message">
                We're sorry, but something unexpected happened. 
                Please try refreshing the page or go back to the homepage.
              </p>
              <div className="error-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={this.handleReload}
                  type="button"
                >
                  Refresh Page
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={this.handleGoHome}
                  type="button"
                >
                  Go to Homepage
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && (
                <details className="error-details">
                  <summary>Error Details (Development Only)</summary>
                  <pre className="error-stack">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
              <p className="error-id">Error ID: {this.state.errorId}</p>
            </div>
          </div>
        );
      }

      // Component-level fallback
      return (
        <div className="error-boundary error-boundary--component">
          <div className="error-container--small">
            <div className="error-icon--small">⚠️</div>
            <h3 className="error-title--small">Component Error</h3>
            <p className="error-message--small">
              This section couldn't load properly.
            </p>
            <button 
              className="btn btn-small" 
              onClick={this.handleRetry}
              type="button"
            >
              Try Again
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details--small">
                <summary>Details</summary>
                <pre className="error-stack--small">
                  {this.state.error && this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.elementType,
  level: PropTypes.oneOf(['page', 'component']),
  onError: PropTypes.func
};

ErrorBoundary.defaultProps = {
  level: 'component',
  onError: null
};

export default ErrorBoundary;
