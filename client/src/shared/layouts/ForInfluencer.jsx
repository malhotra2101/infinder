import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Import components
import Sidebar from '../components/shared/sidebar/Sidebar.jsx';
import SidebarToggle from '../components/shared/sidebar/SidebarToggle.jsx';
import Navbar from '../components/shared/navbar/Navbar.jsx';
import InfluencerPage from '../../influencer/pages/InfluencerPage';
import InfluencerDashboardPage from '../../influencer/pages/InfluencerDashboardPage';
import InfluencerSearchPage from '../../influencer/pages/InfluencerSearchPage';
import InfluencerSelectedCampaignsPage from '../../influencer/pages/InfluencerSelectedCampaignsPage';
import InfluencerProfilePage from '../../influencer/pages/InfluencerProfilePage';

// Import styles
import '../components/shared/sidebar/Sidebar.css';
import '../components/shared/sidebar/SidebarToggle.css';
import '../components/shared/navbar/Navbar.css';
import './ForBrand.css'; // Reuse the same styles

/**
 * Influencer Page Layout Component
 * 
 * Complete influencer page with sidebar navigation, responsive design,
 * and influencer-specific functionality.
 */
const InfluencerPageLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Influencer Dashboard - Infinder</title>
        <meta name="description" content="Manage your influencer profile, campaigns, and collaborations with powerful tools and analytics." />
        <meta property="og:title" content="Influencer Dashboard - Infinder" />
        <meta property="og:description" content="Manage your influencer profile, campaigns, and collaborations with powerful tools and analytics." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Influencer Dashboard - Infinder" />
        <meta name="twitter:description" content="Manage your influencer profile, campaigns, and collaborations with powerful tools and analytics." />
        <link rel="canonical" href="https://infinder.com/influencer" />
      </Helmet>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        isMobile={isMobile} 
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <div className="main-content">
        {/* Mobile Navbar */}
        {isMobile && (
          <Navbar />
        )}

        {/* Sidebar Toggle for Desktop */}
        {!isMobile && (
          <SidebarToggle 
            isExpanded={sidebarOpen} 
            onToggle={toggleSidebar} 
          />
        )}

        {/* Page Content */}
        <div className="page-content">
          <Routes>
            {/* Influencer main page */}
            <Route path="/" element={<InfluencerPage />} />
            <Route path="/influencer" element={<InfluencerPage />} />
            
            {/* Influencer dashboard page */}
            <Route path="/dashboard" element={<InfluencerDashboardPage />} />
            <Route path="/influencer/dashboard" element={<InfluencerDashboardPage />} />
            
            {/* Influencer search page */}
            <Route path="/search" element={<InfluencerSearchPage sidebarOpen={sidebarOpen} />} />
            <Route path="/influencer/search" element={<InfluencerSearchPage sidebarOpen={sidebarOpen} />} />
            
            {/* Influencer my campaigns page */}
            <Route path="/selected-campaigns" element={<InfluencerSelectedCampaignsPage />} />
            <Route path="/influencer/selected-campaigns" element={<InfluencerSelectedCampaignsPage />} />
            
            {/* Influencer profile page */}
            <Route path="/profile" element={<InfluencerProfilePage />} />
            <Route path="/influencer/profile" element={<InfluencerProfilePage />} />
            
            {/* Catch-all route for any other paths */}
            <Route path="*" element={<InfluencerPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

/**
 * Influencer Page Component
 */
const ForInfluencer = () => {
  return <InfluencerPageLayout />;
};

export default ForInfluencer; 