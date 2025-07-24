import React, { useState, useEffect, useRef } from 'react';
import './MenuToggle.css';

const MenuToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Add a small delay to ensure button is clickable after menu closes
    setTimeout(() => {
      const toggleButton = containerRef.current?.querySelector('.menu-toggle-button');
      if (toggleButton) {
        toggleButton.style.pointerEvents = 'auto';
      }
    }, 50);
  };

  // Handle escape key and click outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    const handleClickOutside = (e) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mouseup', handleClickOutside);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mouseup', handleClickOutside);
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    };
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const firstLink = containerRef.current?.querySelector('.menu-drawer-link');
      if (firstLink) {
        setTimeout(() => {
          firstLink.focus();
        }, 500); // After expansion animation completes
      }
    } else {
      const toggleButton = containerRef.current?.querySelector('.menu-toggle-button');
      toggleButton?.focus();
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`menu-toggle ${isOpen ? 'open' : ''}`}
    >
      {/* Toggle button */}
      <button
        className="menu-toggle-button"
        onClick={handleToggle}
        aria-label={isOpen ? 'Menu is open' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {/* Button content */}
        <div className="menu-toggle-icon">
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </div>
        <span className="menu-toggle-text">Menu</span>
      </button>

      {/* Menu content that appears when button transforms */}
      <div className="menu-content">
        <button
          className="menu-drawer-close"
          onClick={handleClose}
          aria-label="Close menu"
        >
          <span className="close-icon">×</span>
        </button>
        
        <nav className="menu-drawer-nav">
          <ul className="menu-drawer-list">
            <li className="menu-drawer-item">
              <a href="/" className="menu-drawer-link" onClick={() => {
                handleClose();
                window.location.href = '/';
              }}>
                Top
              </a>
            </li>
            <li className="menu-drawer-item">
              <a href="/login" className="menu-drawer-link" onClick={handleClose}>
                Login
              </a>
            </li>
            <li className="menu-drawer-item">
              <a href="#about" className="menu-drawer-link" onClick={handleClose}>
                about
              </a>
            </li>
            <li className="menu-drawer-item">
              <a href="#services" className="menu-drawer-link" onClick={handleClose}>
                Search
              </a>
            </li>
            
            <li className="menu-drawer-item">
              <a href="#contact" className="menu-drawer-link" onClick={handleClose}>
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MenuToggle; 