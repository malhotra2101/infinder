import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoadingAnimation from './features/landing/components/loading-animation/LoadingAnimation.jsx';
import ToastContainer from './shared/components/shared/ToastContainer.jsx';
import realtimeService from './shared/services/realtimeService.js';
import './App.css';
import LandingPage from './features/landing/LandingPage';

// Lazy load components
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('./features/auth/pages/SignupPage'));
const BrandPage = lazy(() => import('./shared/layouts/ForBrand'));
const InfluencerPage = lazy(() => import('./shared/layouts/ForInfluencer'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

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
  const [isLandingPageLoading, setIsLandingPageLoading] = useState(true);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(true);

  // Initialize real-time connections
  useEffect(() => {
    const initializeRealtime = async () => {
      try {
         // Check if server is available first
         try {
           const response = await fetch('http://localhost:5052/api/ping', { 
             method: 'GET',
             headers: { 'Content-Type': 'application/json' },
             mode: 'cors'
           });
           
           if (!response.ok) {
             return;
           }
         } catch (error) {
           return;
         }
        
        // Connect to WebSocket
        await realtimeService.connectWebSocket();
        
        // Initialize SSE as fallback
        realtimeService.initializeSSE();
      } catch (error) {
        // Handle error silently
      }
    };

    initializeRealtime();

    // Cleanup on unmount
    return () => {
      realtimeService.disconnect();
    };
  }, []);

  // Show loading animation only for landing page
  useEffect(() => {
    if (location.pathname === '/') {
      setIsLandingPageLoading(true);
      setShowLandingPage(false);
      setShowLoadingAnimation(true);

      // Simulate loading time for landing page
      const timer = setTimeout(() => {
        setIsLandingPageLoading(false);
        // The loading animation component will handle its own transition
        // and call onComplete when done
      }, 3000); // 3 seconds loading time (increased from 2s)

      return () => clearTimeout(timer);
    } else {
      setShowLoadingAnimation(false);
      setShowLandingPage(true);
    }
  }, [location.pathname]);

  const handleLoadingComplete = () => {
    console.log('handleLoadingComplete called');
    // This will be called when the loading animation completes
    setShowLandingPage(true);
    setShowLoadingAnimation(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {/* Show LoadingAnimation only for landing page */}
        {showLoadingAnimation && location.pathname === '/' && (
          <LoadingAnimation
            isLoading={isLandingPageLoading}
            onComplete={handleLoadingComplete}
          />
        )}

        {/* Directly render LandingPage for the landing route, no Suspense */}
        <Routes>
          <Route path="/" element={
            <div style={{ background: 'yellow', minHeight: '100vh' }}>
              <LandingPage />
            </div>
          } />
          {/* Keep other routes lazy and inside Suspense */}
          <Route path="/login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />
          <Route path="/signup" element={<Suspense fallback={<PageLoader />}><SignupPage /></Suspense>} />
          <Route path="/influencer/*" element={<Suspense fallback={<PageLoader />}><InfluencerPage /></Suspense>} />
          <Route path="/*" element={<Suspense fallback={<PageLoader />}><BrandPage /></Suspense>} />
        </Routes>

        {/* Toast notifications */}
        <ToastContainer />
      </div>
    </QueryClientProvider>
  );
}

export default App; 