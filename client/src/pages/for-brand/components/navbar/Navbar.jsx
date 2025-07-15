import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.svg" alt="Infinder Logo" />
          <span>Infinder</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          <Link 
            to="/" 
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/contact" 
            className={`navbar-link ${location.pathname === '/contact' ? 'active' : ''}`}
          >
            Contact
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <Link to="/login" className="navbar-btn navbar-btn-outline">
            Login
          </Link>
          <Link to="/signup" className="navbar-btn navbar-btn-primary">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile ${isMenuOpen ? 'active' : ''}`}>
        <Link 
          to="/" 
          className={`navbar-mobile-link ${location.pathname === '/' ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>
        <Link 
          to="/contact" 
          className={`navbar-mobile-link ${location.pathname === '/contact' ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Contact
        </Link>
        
        <div className="navbar-mobile-actions">
          <Link to="/login" className="navbar-btn navbar-btn-outline">
            Login
          </Link>
          <Link to="/signup" className="navbar-btn navbar-btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 