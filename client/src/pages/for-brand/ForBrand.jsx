import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Import components
import Sidebar from './components/sidebar/Sidebar';
import SidebarToggle from './components/sidebar/SidebarToggle';
import Navbar from './components/navbar/Navbar';
import Dashboard from './pages/dashboard/Dashboard';
import CampaignsPage from './pages/campaigns/CampaignsPage';
import SearchPage from './pages/search/SearchPage';
import ContactPage from './pages/contact/ContactPage';
import ProfilePage from './pages/profile/ProfilePage';

// Import styles
import './components/sidebar/Sidebar.css';
import './components/sidebar/SidebarToggle.css';
import './components/navbar/Navbar.css';
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
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
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