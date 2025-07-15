import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LoadingAnimation from './pages/landing-page/components/loading-animation/LoadingAnimation';
import './App.css';

// Lazy load components
const LandingPage = lazy(() => import('./pages/landing-page'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const BrandPage = lazy(() => import('./pages/for-brand/ForBrand'));

/**
 * Simple loading component for other pages
 * @returns {JSX.Element} Loading spinner
 */
const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}
  >
    <div
      style={{
        width: '50px',
        height: '50px',
        border: '3px solid rgba(255,255,255,0.3)',
        borderTop: '3px solid #fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

/**
 * Main App component with routing and loading states
 * @returns {JSX.Element} App component
 */
function App() {
  const location = useLocation();
  const [isLandingPageLoading, setIsLandingPageLoading] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);

  // Show loading animation only for landing page
  useEffect(() => {
    if (location.pathname === '/') {
      setIsLandingPageLoading(true);
      setShowLandingPage(false);

      // Simulate loading time for landing page
      const timer = setTimeout(() => {
        setIsLandingPageLoading(false);
        // Show landing page after animation completes
        setTimeout(() => {
          setShowLandingPage(true);
        }, 800); // Wait for slide animation to complete
      }, 2000); // 2 seconds loading time

      return () => clearTimeout(timer);
    } else {
      setShowLandingPage(true);
    }
  }, [location.pathname]);

  const handleLoadingComplete = () => {
    // This will be called when the loading animation completes
    // Future: Add analytics or other completion logic here
  };

  return (
    <div className="App">
      {/* Show LoadingAnimation only for landing page */}
      {isLandingPageLoading && location.pathname === '/' && (
        <LoadingAnimation
          isLoading={isLandingPageLoading}
          onComplete={handleLoadingComplete}
        />
      )}

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={showLandingPage ? <LandingPage /> : null} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* All original pages with sidebar - use wildcard route */}
          <Route path="/*" element={<BrandPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App; 