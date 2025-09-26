import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero, BrandCarousel } from "./components";
import StaggeredMenu from "@shared/components/nav/StaggeredMenu.jsx";
import ThreeDCarousel from "./components/ThreeDCarousel/ThreeDCarousel";
import Footer from "@shared/components/shared/footer/Footer.jsx";

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
  useEffect(() => {
    const items = document.querySelectorAll('[data-observe]');
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // Toggle visibility class for fade in/out
          if (entry.isIntersecting) {
            requestAnimationFrame(() => entry.target.classList.add('is-visible'));
          } else {
            requestAnimationFrame(() => entry.target.classList.remove('is-visible'));
          }
        });
      },
      { root: null, rootMargin: '0px 0px -5% 0px', threshold: 0.01 }
    );
    items.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className="App">
      <StaggeredMenu
        position="right"
        items={[
          { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
          { label: 'Sign In', ariaLabel: 'Sign in to your account', link: '/login' },
          { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
          { label: 'Services', ariaLabel: 'View our services', link: '/services' },
          { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
        ]}
        socialItems={[
          { label: 'Twitter', link: 'https://twitter.com' },
          { label: 'LinkedIn', link: 'https://www.linkedin.com/company/appraise-media' }
        ]}
        displaySocials={true}
        menuButtonColor="#fff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={['#B19EEF', '#5227FF']}
        logoUrl=""
        accentColor="#ff6b6b"
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />
      <Hero />
      <BrandCarousel />
      <section className="three-d-carousel-module">
        <ThreeDCarousel 
          images={[ '/assets/img1.webp', '/assets/img2.webp', '/assets/img3.webp', '/assets/img4.webp' ]}
          previewImages={[ '/assets/img1.webp', '/assets/img2.webp', '/assets/img3.webp', '/assets/img4.webp', '/assets/img5.webp', '/assets/img6.webp', '/assets/img7.webp', '/assets/img8.webp', '/assets/img9.webp', '/assets/img10.webp', '/assets/img11.webp', '/assets/img12.webp' ]}
          title="Haute Couture Nights — Paris"
          radius={500}
        />
        <ThreeDCarousel 
          images={[ '/assets/img13.webp', '/assets/img14.webp', '/assets/img15.webp', '/assets/img16.webp' ]}
          previewImages={[ '/assets/img13.webp', '/assets/img14.webp', '/assets/img15.webp', '/assets/img16.webp', '/assets/img17.webp', '/assets/img18.webp', '/assets/img19.webp', '/assets/img20.webp', '/assets/img21.webp', '/assets/img22.webp', '/assets/img23.webp', '/assets/img24.webp' ]}
          title="Vogue Evolution — New York City"
          radius={500}
        />
        <ThreeDCarousel 
          images={[ '/assets/img25.webp', '/assets/img26.webp', '/assets/img27.webp', '/assets/img28.webp' ]}
          previewImages={[ '/assets/img25.webp', '/assets/img26.webp', '/assets/img27.webp', '/assets/img28.webp', '/assets/img29.webp', '/assets/img30.webp', '/assets/img31.webp', '/assets/img32.webp', '/assets/img33.webp', '/assets/img34.webp', '/assets/img35.webp', '/assets/img36.webp' ]}
          title="Glamour in the Desert — Dubai"
          radius={500}
        />
        <ThreeDCarousel 
          images={[ '/assets/img37.webp', '/assets/img38.webp', '/assets/img39.webp', '/assets/img40.webp' ]}
          previewImages={[ '/assets/img37.webp', '/assets/img38.webp', '/assets/img39.webp', '/assets/img40.webp', '/assets/img41.webp', '/assets/img42.webp', '/assets/img43.webp', '/assets/img44.webp', '/assets/img45.webp', '/assets/img46.webp', '/assets/img47.webp', '/assets/img48.webp' ]}
          title="Chic Couture Runway — Milan"
          radius={500}
        />
        <ThreeDCarousel 
          images={[ '/assets/img49.webp', '/assets/img50.webp', '/assets/img51.webp', '/assets/img52.webp', '/assets/img53.webp', '/assets/img54.webp' ]}
          previewImages={[ '/assets/img49.webp', '/assets/img50.webp', '/assets/img51.webp', '/assets/img52.webp', '/assets/img53.webp', '/assets/img54.webp', '/assets/img55.webp', '/assets/img56.webp', '/assets/img57.webp', '/assets/img58.webp', '/assets/img59.webp', '/assets/img60.webp' ]}
          title="Style Showcase — London"
          radius={650}
        />
        <ThreeDCarousel 
          images={[ '/assets/img61.webp', '/assets/img62.webp', '/assets/img63.webp', '/assets/img64.webp' ]}
          previewImages={[ '/assets/img61.webp', '/assets/img62.webp', '/assets/img63.webp', '/assets/img64.webp', '/assets/img65.webp', '/assets/img66.webp', '/assets/img67.webp', '/assets/img68.webp', '/assets/img69.webp', '/assets/img70.webp', '/assets/img71.webp', '/assets/img72.webp' ]}
          title="Future Fashion Forward — Tokyo"
          radius={500}
        />
      </section>
      <section className="features features--split">
        <div className="container features-split">
          <div className="features-left">
            <h2>Built for performance and scale</h2>
            <p>Infinder pairs deep data with delightful UX to help brands find, vet, and collaborate with the right creators faster.</p>
            <ul className="features-bullets">
              <li><strong>Smart discovery</strong> with semantic search and audience filters</li>
              <li><strong>Real-time insights</strong> on engagement and authenticity</li>
              <li><strong>Collaboration workflows</strong> that reduce busywork</li>
            </ul>
          </div>
          <div className="features-right">
            {[
              '/assets/img1.webp',
              '/assets/img14.webp',
              '/assets/img27.webp',
              '/assets/img40.webp',
              '/assets/img53.webp',
              '/assets/img66.webp'
            ].map((src, i) => (
              <figure key={i} className="feature-photo" data-observe>
                <img src={src} alt={`Feature visual ${i+1}`} loading="lazy" />
                <figcaption>Feature visual {i+1}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      
      <Footer onNewsletterSignup={async (email) => {
        console.log('Newsletter signup:', email);
        return Promise.resolve();
      }} />
    </div>
  );
}

export default LandingPage; 