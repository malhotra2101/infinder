import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Import components
import Sidebar from '../components/shared/sidebar/Sidebar.jsx';
import SidebarToggle from '../components/shared/sidebar/SidebarToggle.jsx';
import Navbar from '../components/shared/navbar/Navbar.jsx';
import Dashboard from '../../brand/pages/Dashboard';
import CampaignsPage from '../../brand/pages/CampaignsPage';
import SearchPage from '../../brand/pages/SearchPage';
import ContactPage from '../../brand/pages/ContactPage';
import ProfilePage from '../../brand/pages/ProfilePage';
import CollaborationRequests from '../components/shared/collaboration/CollaborationRequests.jsx';

// Import styles
import '../components/shared/sidebar/Sidebar.css';
import '../components/shared/sidebar/SidebarToggle.css';
import '../components/shared/navbar/Navbar.css';
import './ForBrand.css';

/**
 * Brand Page Layout Component
 * 
 * Complete brand page with sidebar navigation, responsive design,
 * and all pages except authentication pages.
 */
const BrandPageLayout = () => {
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
        <title>Infinder - Influencer Marketing Platform</title>
        <meta name="description" content="Empower your influencer marketing strategies with cutting-edge tools and analytics. Find, manage, and track influencer campaigns with precision." />
        <meta property="og:title" content="Infinder - Influencer Marketing Platform" />
        <meta property="og:description" content="Empower your influencer marketing strategies with cutting-edge tools and analytics." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Infinder - Influencer Marketing Platform" />
        <meta name="twitter:description" content="Empower your influencer marketing strategies with cutting-edge tools and analytics." />
        <link rel="canonical" href="https://infinder.com" />
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
            {/* Dashboard page */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Campaigns page */}
            <Route path="/campaigns" element={<CampaignsPage />} />
            
            {/* Search page */}
            <Route path="/search" element={<SearchPage sidebarOpen={sidebarOpen} />} />
            
            {/* Collaboration page */}
            <Route path="/collaboration" element={<CollaborationRequests />} />
            
            {/* Contact page */}
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Profile page */}
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Catch-all route for any other paths */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

/**
 * Brand Page Component
 */
const BrandPage = () => {
  return <BrandPageLayout />;
};

export default BrandPage; 