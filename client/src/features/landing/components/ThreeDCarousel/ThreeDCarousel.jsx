import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ThreeDCarousel.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ThreeDCarousel = ({ 
  images = [], 
  title = "3D Carousel", 
  radius = 500,
  className = "",
  onImageClick = null,
  previewImages = [], // Additional images for preview grid
  previewTitle = null // Optional different title for preview
}) => {
  const sceneRef = useRef(null);
  const carouselRef = useRef(null);
  const titleRef = useRef(null);
  const previewRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [timeline, setTimeline] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  // Save carousel transform to retain position when returning from preview
  const savedCarouselStateRef = useRef(null);

  // Utility function to get carousel cell transforms
  const getCarouselCellTransforms = (count, radius) => {
    const angleStep = 360 / count;
    return Array.from({ length: count }, (_, i) => {
      const angle = i * angleStep;
      return `rotateY(${angle}deg) translateZ(${radius}px)`;
    });
  };

  // Setup carousel cells with 3D transforms
  const setupCarouselCells = () => {
    if (!carouselRef.current) return;
    
    const cells = carouselRef.current.querySelectorAll('.carousel__cell');
    const transforms = getCarouselCellTransforms(cells.length, radius);
    
    cells.forEach((cell, i) => {
      cell.style.transform = transforms[i];
    });
  };

  // Create scroll animation timeline
  const createScrollAnimation = () => {
    if (!carouselRef.current || !sceneRef.current) return;

    const cards = carouselRef.current.querySelectorAll('.card');

    const newTimeline = gsap.timeline({
      defaults: { ease: 'sine.inOut' },
      scrollTrigger: {
        trigger: sceneRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    newTimeline
      .fromTo(carouselRef.current, { rotationY: 0 }, { rotationY: -180 }, 0)
      .fromTo(
        carouselRef.current,
        { rotationZ: 3, rotationX: 3 },
        { rotationZ: -3, rotationX: -3 },
        0
      )
      .fromTo(
        cards,
        { filter: 'brightness(100%)' },
        { filter: 'brightness(100%)', ease: 'power3' },
        0
      )
      .fromTo(cards, { rotationZ: 10 }, { rotationZ: -10, ease: 'none' }, 0);

    setTimeline(newTimeline);
    return newTimeline;
  };

  // Animate grid items in
  const animateGridItemsIn = () => {
    if (!previewRef.current) return;
    
    const items = previewRef.current.querySelectorAll('.grid__item');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Clear any inline styles and ensure items are visible
    gsap.set(items, { 
      clearProps: 'all',
      autoAlpha: 1,
      visibility: 'visible'
    });

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;
      const dx = centerX - elCenterX;
      const dy = centerY - elCenterY;
      const dist = Math.hypot(dx, dy);
      const maxDist = Math.max(...Array.from(items).map(el => {
        const r = el.getBoundingClientRect();
        return Math.hypot(centerX - (r.left + r.width / 2), centerY - (r.top + r.height / 2));
      }));
      
      const norm = maxDist ? dist / maxDist : 0;
      const exponential = Math.pow(1 - norm, 1);
      const delay = exponential * 0.15; // Reduced by 70% from 0.5
      const rotationY = elCenterX < centerX ? 100 : -100;

      gsap.fromTo(
        item,
        {
          transformOrigin: `50% 50% ${dx > 0 ? -dx * 0.8 : dx * 0.8}px`,
          autoAlpha: 0,
          y: dy * 0.5,
          scale: 0.5,
          rotationY: rotationY,
          z: -3500,
        },
        {
          y: 0,
          scale: 1,
          rotationY: 0,
          autoAlpha: 1,
          z: 0,
          visibility: 'visible',
          duration: 0.4,
          ease: 'sine',
          delay: delay + 0.03, // Reduced by 70% from 0.1
        }
      );
    });
  };

  // Animate grid items out
  const animateGridItemsOut = (onComplete) => {
    if (!previewRef.current) return;
    
    const items = previewRef.current.querySelectorAll('.grid__item');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;
      const dx = centerX - elCenterX;
      const dy = centerY - elCenterY;
      const dist = Math.hypot(dx, dy);
      const maxDist = Math.max(...Array.from(items).map(el => {
        const r = el.getBoundingClientRect();
        return Math.hypot(centerX - (r.left + r.width / 2), centerY - (r.top + r.height / 2));
      }));
      
      const norm = maxDist ? dist / maxDist : 0;
      const exponential = Math.pow(norm, 1);
      const delay = exponential * 0.5;
      const rotationY = elCenterX < centerX ? 100 : -100;
      const isLast = index === items.length - 1;

      gsap.to(item, {
        startAt: {
          transformOrigin: `50% 50% ${dx > 0 ? -dx * 0.8 : dx * 0.8}px`,
        },
        y: dy * 0.4,
        rotationY: rotationY,
        scale: 0.4,
        autoAlpha: 0,
        duration: 0.4,
        ease: 'sine.in',
        delay,
      });

      gsap.to(item, {
        z: -3500,
        duration: 0.4,
        ease: 'expo.in',
        delay: delay + 0.9,
        onComplete: isLast ? onComplete : undefined,
      });
    });
  };

  // Handle title click to show preview
  const handleTitleClick = (e) => {
    e.preventDefault();
    if (isAnimating) return;
    setIsAnimating(true);

    // Save current carousel transform state to restore later
    if (carouselRef.current) {
      savedCarouselStateRef.current = {
        rotationX: Number(gsap.getProperty(carouselRef.current, 'rotationX')) || 0,
        rotationY: Number(gsap.getProperty(carouselRef.current, 'rotationY')) || 0,
        rotationZ: Number(gsap.getProperty(carouselRef.current, 'rotationZ')) || 0,
        z: Number(gsap.getProperty(carouselRef.current, 'z')) || 0,
        yPercent: Number(gsap.getProperty(carouselRef.current, 'yPercent')) || 0,
      };
    }

    // Disable page scroll while preview is open
    document.body.style.overflow = 'hidden';
    // Pause scroll-based triggers to freeze scroll animations
    ScrollTrigger.getAll().forEach(t => t.disable());

    const cards = carouselRef.current?.querySelectorAll('.card') || [];
    const imagesToShow = previewImages.length > 0 ? previewImages : images;

    // Create timeline with text fade-out effect
    const tl = gsap.timeline({
      defaults: { duration: 1.5, ease: 'power2.inOut' },
      onComplete: () => {
        setIsAnimating(false);
      },
    });

    // First, fade out the title text smoothly
    tl.to(titleRef.current, {
      autoAlpha: 0,
      y: -20,
      duration: 0.6,
      ease: 'power2.out'
    }, 0)
    .to(carouselRef.current, { rotationX: 90, rotationY: -360, z: -2000 }, 0.3)
    .to(
      carouselRef.current,
      {
        duration: 2.5,
        ease: 'power3.inOut',
        z: 1500,
        rotationZ: 270,
        onComplete: () => {
          gsap.set(sceneRef.current, { autoAlpha: 0 });
          setShowPreview(true);
          console.log('Setting preview to show');
          // Make sure preview is visible and interactive
          setTimeout(() => {
            if (previewRef.current) {
              console.log('Preview ref found, setting visible');
              gsap.set(previewRef.current, { 
                autoAlpha: 1, 
                pointerEvents: 'auto',
                visibility: 'visible'
              });
              animateGridItemsIn();
            } else {
              console.log('Preview ref not found');
            }
          }, 30);
        },
      },
      1.0
    )
    .to(cards, { rotationZ: 0 }, 0.3);
  };

  // Handle preview close
  const handlePreviewClose = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Prevent any lingering animations on the title from interfering
    if (titleRef.current) {
      gsap.killTweensOf(titleRef.current);
    }

    animateGridItemsOut(() => {
      setShowPreview(false);
      gsap.set(sceneRef.current, { autoAlpha: 1 });
      // Ensure preview is hidden
      if (previewRef.current) {
        gsap.set(previewRef.current, { 
          autoAlpha: 0, 
          pointerEvents: 'none' 
        });
      }
      // Reset title to initial state
      gsap.set(titleRef.current, { 
        autoAlpha: 0, 
        y: -20 
      });
      
      // Animate carousel back to its saved state (retain position)
      const target = savedCarouselStateRef.current || { rotationY: -180, yPercent: 0, z: 0 };
      const retTl = gsap.timeline({
        delay: 0.5,
        defaults: { duration: 0.9, ease: 'power2.out' },
        onComplete: () => {
          setIsAnimating(false);
        },
      });
      retTl.to(carouselRef.current, {
        rotationX: target.rotationX ?? 0,
        rotationY: target.rotationY ?? -180,
        rotationZ: target.rotationZ ?? 0,
        yPercent: target.yPercent ?? 0,
        z: target.z ?? 0,
      }, 0)
      .fromTo(cards, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.2);

      // Separate timeline for title animation to ensure it's not overridden
      gsap.timeline({
        delay: 0.8, // Start after carousel animation begins
        onComplete: () => {
          if (titleRef.current) {
            // Force final visible state just in case other tweens interfered
            gsap.set(titleRef.current, { autoAlpha: 1, y: 0 });
          }
        },
      })
      .fromTo(
        titleRef.current,
        {
          autoAlpha: 0,
          y: -20,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.0,
          ease: 'power2.out'
        },
        0
      );

      // Fallback: ensure title is visible after a longer delay
      setTimeout(() => {
        if (titleRef.current) {
          gsap.set(titleRef.current, { 
            autoAlpha: 1, 
            y: 0 
          });
          console.log('Title fallback applied');
        }
      }, 3000);

      // Re-enable page scroll and scroll triggers after closing preview
      document.body.style.overflow = '';
      ScrollTrigger.getAll().forEach(t => t.enable());
    });
  };



  // Initialize carousel
  useEffect(() => {
    if (!sceneRef.current || !carouselRef.current) return;

    // Setup carousel
    setupCarouselCells();
    const newTimeline = createScrollAnimation();

    // Ensure title is visible initially
    if (titleRef.current) {
      gsap.set(titleRef.current, { 
        autoAlpha: 1, 
        y: 0 
      });
    }

    // Cleanup function
    return () => {
      if (newTimeline) {
        newTimeline.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      // Safety: ensure scroll is re-enabled if component unmounts while preview was open
      document.body.style.overflow = '';
    };
  }, [images, radius]);

  // Lock/unlock page scroll based on preview state (extra safety in addition to open/close handlers)
  useEffect(() => {
    if (showPreview) {
      document.body.style.overflow = 'hidden';
      // Pause scroll triggers while preview is open
      ScrollTrigger.getAll().forEach(t => t.disable());
    } else {
      document.body.style.overflow = '';
      // Resume scroll triggers when preview closes
      ScrollTrigger.getAll().forEach(t => t.enable());
    }
  }, [showPreview]);

  // Re-setup when images change
  useEffect(() => {
    if (carouselRef.current) {
      setupCarouselCells();
    }
  }, [images, radius]);

  return (
    <>
      <div className={`scene ${className}`} ref={sceneRef} data-radius={radius}>
        <h2 className="scene__title" ref={titleRef} data-speed="0.7">
          <a href="#" onClick={handleTitleClick}>
            <span>{title}</span>
          </a>
        </h2>
        <div className="carousel" ref={carouselRef}>
          {images.map((image, index) => (
            <div key={index} className="carousel__cell">
              <div 
                className="card" 
                style={{ '--img': `url(${image})` }}
              >
                <div className="card__face card__face--front"></div>
                <div className="card__face card__face--back"></div>
              </div>
                  </div>
                ))}
              </div>
            </div>

      {/* Preview Modal */}
      {showPreview && (
        <div 
          className="preview" 
          ref={previewRef}
          style={{ visibility: showPreview ? 'visible' : 'hidden' }}
        >
          <header className="preview__header">
            <h2 className="preview__title">
              <span>{previewTitle || title}</span>
            </h2>
            <button className="preview__close" onClick={handlePreviewClose}>
              Close ×
            </button>
          </header>
          <div className="grid">
            {(previewImages.length > 0 ? previewImages : images).map((image, index) => (
              <figure key={index} className="grid__item" role="img">
                <div 
                  className="grid__item-image" 
                  style={{ backgroundImage: `url(${image})` }}
                ></div>
                <figcaption className="grid__item-caption">
                  <h3>Image {index + 1}</h3>
                </figcaption>
              </figure>
            ))}
          </div>
    </div>
      )}
    </>
  );
};

export default ThreeDCarousel; 