import React, { Suspense } from 'react';
import { useLazyLoad } from '../hooks/useLazyLoad';

const LazyComponent = ({ 
  importFn, 
  fallback = null,
  errorFallback = null,
  onLoad,
  onError,
  maxRetries = 3,
  retryDelay = 1000,
  ...props 
}) => {
  const { component: Component, loading, error, retry, hasMoreRetries } = useLazyLoad(
    importFn,
    {
      maxRetries,
      retryDelay,
      onLoad,
      onError
    }
  );

  if (error) {
    return errorFallback ? (
      errorFallback({ error, retry, hasMoreRetries })
    ) : (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        background: '#f8f9fa',
        borderRadius: '8px',
        margin: '1rem'
      }}>
        <div style={{ color: '#dc3545', marginBottom: '1rem' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Failed to Load Component</h3>
        <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
          {error.message || 'An error occurred while loading this component.'}
        </p>
        {hasMoreRetries && (
          <button
            onClick={retry}
            style={{
              padding: '0.5rem 1rem',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (loading || !Component) {
    return fallback || (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        background: '#f8f9fa',
        borderRadius: '8px',
        margin: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e9ecef',
          borderTop: '3px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <Component {...props} />;
};

export default LazyComponent; 