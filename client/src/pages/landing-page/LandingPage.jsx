import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero, ScrollRevealText, MenuToggle } from "./components";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
  const scrollAnimationRef = useRef(null);
  const [isScrollAnimationVisible, setIsScrollAnimationVisible] = useState(false);

  // Add scroll detection for scroll animation section visibility
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollAnimationRef.current) return;
      
      const scrollSection = scrollAnimationRef.current;
      const rect = scrollSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if the scroll animation section is visible
      const isVisible = rect.top < windowHeight && rect.bottom > 0;
      
      setIsScrollAnimationVisible(isVisible);
    };

    // Use requestAnimationFrame to throttle scroll events
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // Check initial position
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  return (
    <div className="App">
      {/* Menu Component */}
      <MenuToggle />

      <Hero />
      
      {/* Brand Logo Carousel */}
      <section className="brand-carousel">
        <div className="carousel-container">
          <div className="carousel-track">
            <div className="carousel-item">NIKE</div>
            <div className="carousel-item">ADIDAS</div>
            <div className="carousel-item">APPLE</div>
            <div className="carousel-item">GOOGLE</div>
            <div className="carousel-item">MICROSOFT</div>
            <div className="carousel-item">AMAZON</div>
            <div className="carousel-item">NETFLIX</div>
            <div className="carousel-item">SPOTIFY</div>
            <div className="carousel-item">UBER</div>
            <div className="carousel-item">AIRBNB</div>
            <div className="carousel-item">NIKE</div>
            <div className="carousel-item">ADIDAS</div>
            <div className="carousel-item">APPLE</div>
            <div className="carousel-item">GOOGLE</div>
            <div className="carousel-item">MICROSOFT</div>
            <div className="carousel-item">AMAZON</div>
            <div className="carousel-item">NETFLIX</div>
            <div className="carousel-item">SPOTIFY</div>
            <div className="carousel-item">UBER</div>
            <div className="carousel-item">AIRBNB</div>
          </div>
        </div>
      </section>
      
      {/* Scroll Reveal Text Section */}
      <div ref={scrollAnimationRef}>
        <ScrollRevealText />
      </div>
      
      {/* New Section */}
      <section className="new-section">
        <div className="inner-section">
          <div className="inner-content">
            <h3>Inner Section Content</h3>
            <p>This is the inner section that leaves space on top and right, but no space below.</p>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Discover Amazing Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Advanced Search</h3>
              <p>Find exactly what you're looking for with our powerful search algorithms.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Experience blazing fast performance with our optimized platform.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure & Private</h3>
              <p>Your data is protected with enterprise-grade security measures.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Our Platform</h2>
              <p>We're dedicated to creating innovative solutions that empower users and drive digital transformation. Our platform combines cutting-edge technology with intuitive design to deliver exceptional experiences.</p>
            </div>
            <div className="about-visual">
              <div className="visual-element"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="contact">
        <div className="container">
          <h2>Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Ready to get started?</h3>
              <p>Contact us today to learn more about our services and how we can help you achieve your goals.</p>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <span className="contact-value">hello@example.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <span className="contact-value">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form>
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <textarea placeholder="Your Message"></textarea>
                <button type="submit">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Our Company</h3>
              <p>We're passionate about creating innovative solutions that make a difference in people's lives.</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="/dashboard">Dashboard</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Connect</h3>
              <div className="social-links">
                <a href="#" aria-label="Twitter">Twitter</a>
                <a href="#" aria-label="LinkedIn">LinkedIn</a>
                <a href="#" aria-label="GitHub">GitHub</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage; 