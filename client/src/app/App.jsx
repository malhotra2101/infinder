import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoadingAnimation from '../features/landing/components/loading-animation/LoadingAnimation.jsx';
import Loader from '../shared/components/shared/Loader.jsx';
import { API_CONFIG } from '../shared/config/config.js';
import ToastContainer from '../shared/components/shared/ToastContainer.jsx';
import ErrorBoundary from '../shared/components/error/ErrorBoundary.jsx';
import realtimeService from '../shared/services/realtimeService.js';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import analytics from '../shared/utils/analytics.js';
import './App.css';
// Lazy load all main components for better code splitting
const LandingPage = lazy(() => import('../features/landing/LandingPage'));
const ContactPage = lazy(() => import('../features/landing/pages/ContactPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/pages/SignupPage'));
const BrandPage = lazy(() => import('../shared/layouts/ForBrand'));
const InfluencerPage = lazy(() => import('../shared/layouts/ForInfluencer'));

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
const PageLoader = () => (<Loader fullscreen />);

/**
 * Main App component with routing and loading states
 * @returns {JSX.Element} App component
 */
function App() {
  const location = useLocation();
  const [isLandingPageLoading, setIsLandingPageLoading] = useState(true);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(true);

  // Track location changes for analytics
  useEffect(() => {
    // Track page views for analytics
    analytics.trackPageView(location.pathname);
    
    // Track specific user flows
    if (location.pathname === '/login') {
      analytics.trackEvent('visit_login_page', 'Auth');
    } else if (location.pathname === '/signup') {
      analytics.trackEvent('visit_signup_page', 'Auth');
    } else if (location.pathname.startsWith('/dashboard')) {
      analytics.trackEvent('visit_dashboard', 'Navigation');
    } else if (location.pathname.startsWith('/campaigns')) {
      analytics.trackEvent('visit_campaigns', 'Navigation');
    } else if (location.pathname.startsWith('/search')) {
      analytics.trackEvent('visit_search', 'Navigation');
    }
  }, [location.pathname]);

  // Initialize real-time connections
  useEffect(() => {
    const initializeRealtime = async () => {
      try {
         // Check if server is available first
         try {
           const response = await fetch(`${API_CONFIG.BASE_URL}/api/ping`, { 
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
      <ErrorBoundary level="page">
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
          {/* Contact page - public route */}
          <Route path="/contact" element={
            <Suspense fallback={<PageLoader />}><ContactPage /></Suspense>
          } />
          {/* Auth routes - redirect to dashboard if already authenticated */}
          <Route path="/login" element={
            <ProtectedRoute redirectIfAuthenticated={true}>
              <Suspense fallback={<PageLoader />}><LoginPage /></Suspense>
            </ProtectedRoute>
          } />
          <Route path="/signup" element={
            <ProtectedRoute redirectIfAuthenticated={true}>
              <Suspense fallback={<PageLoader />}><SignupPage /></Suspense>
            </ProtectedRoute>
          } />
          {/* Protected routes - require authentication */}
          <Route path="/influencer/*" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}><InfluencerPage /></Suspense>
            </ProtectedRoute>
          } />
          <Route path="/*" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}><BrandPage /></Suspense>
            </ProtectedRoute>
          } />
        </Routes>

        {/* Toast notifications */}
        <ToastContainer />
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App; 