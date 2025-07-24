import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import ReloadButton from './ReloadButton';
import GetStartedButton from './GetStartedButton';
import Cube from '../Cube/Cube';
import styles from './Hero.module.css';

/**
 * Hero component with interactive 3D cube and scroll-based animations
 * @param {Object} props - Component props
 * @param {boolean} props.isScrollAnimationVisible - Whether scroll animation section is visible
 * @returns {JSX.Element} Hero component
 */
const Hero = memo(({ isScrollAnimationVisible = false }) => {
  const [isReloading, setIsReloading] = useState(false);
  const [titleTransformProgress, setTitleTransformProgress] = useState(0);
  const heroRef = useRef(null);
  const cubeRef = useRef(null);
  
  // Use refs to track previous values and avoid unnecessary state updates
  const prevValuesRef = useRef({
    isBehind: false,
    progress: 0
  });

  /**
   * Handle reload button click
   */
  const handleReloadClick = useCallback(() => {
    if (isReloading) {
      return;
    }

    setIsReloading(true);

    // Reload the cube
    if (cubeRef.current) {
      cubeRef.current.reload();
    }

    // Simple reload animation
    setTimeout(() => {
      setIsReloading(false);
    }, 1000);
  }, [isReloading]);

  /**
   * Handle cube face change
   */
  const handleCubeFaceChange = useCallback((face) => {
    console.log('Cube face changed to:', face.name);
    // You can add any logic here when the cube face changes
  }, []);


  /**
   * Handle get started button click
   */
  const handleGetStartedClick = useCallback(() => {
    // TODO: Implement get started functionality - could navigate to signup or show a modal
    window.location.href = '/signup';
  }, []);

  /**
   * Handle try demo button click
   */
  const handleTryDemoClick = useCallback(() => {
    // TODO: Implement try demo functionality - could open a demo modal or navigate to demo page
    // For now, just show an alert
    window.showToast('Demo functionality coming soon! This would typically open a demo interface or guided tour.', 'info');
  }, []);



  // Scroll detection for title transformation
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;

      const heroRect = heroRef.current.getBoundingClientRect();
      const heroBottom = heroRect.bottom;
      const windowHeight = window.innerHeight;

      // Calculate title transformation progress based on scroll position
      // Start transformation when hero bottom reaches window height, complete when it reaches 0
      const transformStart = windowHeight;
      const transformEnd = 0;
      const currentPosition = heroBottom;

      let progress = 0;
      if (currentPosition <= transformStart && currentPosition >= transformEnd) {
        progress = (transformStart - currentPosition) / (transformStart - transformEnd);
        progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1
      } else if (currentPosition < transformEnd) {
        progress = 1; // Fully transformed
      }

      // Only update state if values have actually changed
      const prevValues = prevValuesRef.current;
      if (Math.abs(prevValues.progress - progress) > 0.01) { // Small threshold to prevent micro-updates
        setTitleTransformProgress(progress);
        prevValues.progress = progress;
      }
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
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className={styles.hero}
      >
        {/* Huge, left-aligned, overflowing title */}
        <h1
          className={styles.title}
          style={{
            fontSize: `${9 - (6.5 * titleTransformProgress)}vw`,
            top: `${2 - (0.5 * titleTransformProgress)}rem`,
            left: `${2 - (0.5 * titleTransformProgress)}rem`,
            zIndex: 10000, // Always keep high z-index to stay above 3D carousel
            transform: 'translateZ(0)', // Force hardware acceleration
            color: titleTransformProgress >= 0.8 ? '#ffffff' : '#111',
            transition: 'color 0.6s cubic-bezier(0.77,0,0.18,1)'
          }}
        >
          INFINDER
        </h1>

        {/* Cube - positioned in the center */}
        <div className={styles.cubeContainer}>
          <Cube 
            ref={cubeRef}
            onFaceChange={handleCubeFaceChange}
          />
        </div>

        {/* Reload Button - positioned in original location */}
        <div className={styles.reloadButtonContainer}>
          <ReloadButton
            isReloading={isReloading}
            onClick={handleReloadClick}
          />
        </div>

        {/* Get Started Button - positioned lower */}
        <div className={styles.getStartedButtonContainer}>
          <GetStartedButton
            onClick={handleGetStartedClick}
          />
        </div>

        {/* Try Demo Button - positioned at same distance from top as get started button */}
        <div className={styles.tryDemoButtonContainer}>
          <button className={styles.tryDemoButton} onClick={handleTryDemoClick}>
            try demo
          </button>
        </div>


      </section>
    </>
  );
});

Hero.displayName = 'Hero';

export default Hero; 