import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './BrandCarousel.css';

const BrandCarousel = () => {
  const carouselRef = useRef(null);
  const trackRef = useRef(null);

  // Brand logos data
  const brandLogos = [
    { name: 'Acko', logo: '/assets/brand-logos/simplified/acko.svg' },
    { name: 'Adidas', logo: '/assets/brand-logos/simplified/adidas.png' },
    { name: 'BBVA', logo: '/assets/brand-logos/simplified/bbva.png' },
    { name: 'Bybit', logo: '/assets/brand-logos/simplified/bybit.svg' },
    { name: 'KuCoin', logo: '/assets/brand-logos/simplified/kucoin.svg' },
    { name: 'Paybis', logo: '/assets/brand-logos/simplified/paybis.png' },
    { name: 'Prime Video', logo: '/assets/brand-logos/simplified/prime-video.svg' },
    { name: 'Sephora', logo: '/assets/brand-logos/simplified/sephora.svg' }
  ];

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...brandLogos, ...brandLogos];

  useEffect(() => {
    if (!trackRef.current) return;

    // Create infinite scroll animation
    const animation = gsap.to(trackRef.current, {
      x: '-50%',
      duration: 20,
      ease: 'none',
      repeat: -1
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <section className="brand-carousel" ref={carouselRef}>
      <div className="carousel-container">
        <div className="carousel-track" ref={trackRef}>
          {duplicatedLogos.map((brand, index) => (
            <div key={`${brand.name}-${index}`} className="carousel-item">
              <img 
                src={brand.logo} 
                alt={`${brand.name} logo`}
                className="brand-logo"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
