import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero, ScrollRevealText, MenuToggle } from "./components";
import ThreeDCarousel from "./components/ThreeDCarousel/ThreeDCarousel";

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
  const scrollAnimationRef = useRef(null);
  const [isScrollAnimationVisible, setIsScrollAnimationVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollAnimationRef.current) return;
      const scrollSection = scrollAnimationRef.current;
      const rect = scrollSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isVisible = rect.top < windowHeight && rect.bottom > 0;
      setIsScrollAnimationVisible(isVisible);
    };
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
    handleScroll();
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  return (
    <div className="App">
      <MenuToggle />
      <Hero />
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
      <section className="three-d-carousel-module">
        <ThreeDCarousel 
          images={[ '/assets/img1.webp', '/assets/img2.webp', '/assets/img3.webp', '/assets/img4.webp' ]}
          previewImages={[ '/assets/img1.webp', '/assets/img2.webp', '/assets/img3.webp', '/assets/img4.webp', '/assets/img5.webp', '/assets/img6.webp', '/assets/img7.webp', '/assets/img8.webp', '/assets/img9.webp', '/assets/img10.webp', '/assets/img11.webp', '/assets/img12.webp' ]}
          title="Haute Couture Nights — Paris"
          radius={500}
          onImageClick={(image, index) => console.log('3D Carousel image clicked:', image, index)}
        />
        <ThreeDCarousel 
          images={[ '/assets/img13.webp', '/assets/img14.webp', '/assets/img15.webp', '/assets/img16.webp' ]}
          previewImages={[ '/assets/img13.webp', '/assets/img14.webp', '/assets/img15.webp', '/assets/img16.webp', '/assets/img17.webp', '/assets/img18.webp', '/assets/img19.webp', '/assets/img20.webp', '/assets/img21.webp', '/assets/img22.webp', '/assets/img23.webp', '/assets/img24.webp' ]}
          title="Vogue Evolution — New York City"
          radius={500}
          onImageClick={(image, index) => console.log('3D Carousel image clicked:', image, index)}
        />
        <ThreeDCarousel 
          images={[ '/assets/img25.webp', '/assets/img26.webp', '/assets/img27.webp', '/assets/img28.webp' ]}
          previewImages={[ '/assets/img25.webp', '/assets/img26.webp', '/assets/img27.webp', '/assets/img28.webp', '/assets/img29.webp', '/assets/img30.webp', '/assets/img31.webp', '/assets/img32.webp', '/assets/img33.webp', '/assets/img34.webp', '/assets/img35.webp', '/assets/img36.webp' ]}
          title="Glamour in the Desert — Dubai"
          radius={500}
          onImageClick={(image, index) => console.log('3D Carousel image clicked:', image, index)}
        />
        <ThreeDCarousel 
          images={[ '/assets/img37.webp', '/assets/img38.webp', '/assets/img39.webp', '/assets/img40.webp' ]}
          previewImages={[ '/assets/img37.webp', '/assets/img38.webp', '/assets/img39.webp', '/assets/img40.webp', '/assets/img41.webp', '/assets/img42.webp', '/assets/img43.webp', '/assets/img44.webp', '/assets/img45.webp', '/assets/img46.webp', '/assets/img47.webp', '/assets/img48.webp' ]}
          title="Chic Couture Runway — Milan"
          radius={500}
          onImageClick={(image, index) => console.log('3D Carousel image clicked:', image, index)}
        />
        <ThreeDCarousel 
          images={[ '/assets/img49.webp', '/assets/img50.webp', '/assets/img51.webp', '/assets/img52.webp', '/assets/img53.webp', '/assets/img54.webp' ]}
          previewImages={[ '/assets/img49.webp', '/assets/img50.webp', '/assets/img51.webp', '/assets/img52.webp', '/assets/img53.webp', '/assets/img54.webp', '/assets/img55.webp', '/assets/img56.webp', '/assets/img57.webp', '/assets/img58.webp', '/assets/img59.webp', '/assets/img60.webp' ]}
          title="Style Showcase — London"
          radius={650}
          onImageClick={(image, index) => console.log('3D Carousel image clicked:', image, index)}
        />
        <ThreeDCarousel 
          images={[ '/assets/img61.webp', '/assets/img62.webp', '/assets/img63.webp', '/assets/img64.webp' ]}
          previewImages={[ '/assets/img61.webp', '/assets/img62.webp', '/assets/img63.webp', '/assets/img64.webp', '/assets/img65.webp', '/assets/img66.webp', '/assets/img67.webp', '/assets/img68.webp', '/assets/img69.webp', '/assets/img70.webp', '/assets/img71.webp', '/assets/img72.webp' ]}
          title="Future Fashion Forward — Tokyo"
          radius={500}
          onImageClick={(image, index) => console.log('3D Carousel image clicked:', image, index)}
        />
      </section>
      <div ref={scrollAnimationRef}>
        <ScrollRevealText />
      </div>
      <section className="new-section">
        <div className="inner-section">
          <div className="inner-content">
            <h3>Inner Section Content</h3>
            <p>This is the inner section that leaves space on top and right, but no space below.</p>
          </div>
        </div>
      </section>
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
                <li><a href="/influencer">Influencer</a></li>
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