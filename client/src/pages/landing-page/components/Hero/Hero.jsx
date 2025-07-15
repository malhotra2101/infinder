import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import Cube from '../Cube/Cube';
import ReloadButton from './ReloadButton';
import GetStartedButton from './GetStartedButton';
import styles from './Hero.module.css';

/**
 * Hero component with interactive 3D cube and scroll-based animations
 * @param {Object} props - Component props
 * @param {boolean} props.isScrollAnimationVisible - Whether scroll animation section is visible
 * @returns {JSX.Element} Hero component
 */
const Hero = memo(({ isScrollAnimationVisible = false }) => {
  const [currentColor, setCurrentColor] = useState({ name: 'Red', hex: '#e74c3c' });
  const [isReloading, setIsReloading] = useState(false);
  const [isCubeBehindSections, setIsCubeBehindSections] = useState(false);
  const [titleTransformProgress, setTitleTransformProgress] = useState(0);
  const cubeRef = useRef(null);
  const heroRef = useRef(null);
  
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

    // Trigger reload animation on the cube
    if (cubeRef.current?.reload) {
      cubeRef.current.reload(() => {
        setIsReloading(false);
      });
    } else {
      setIsReloading(false);
    }
  }, [isReloading]);

  /**
   * Handle view more button click
   */
  const handleViewMoreClick = useCallback(() => {
    // TODO: Implement view more functionality
    // Could navigate to a detailed page or show a modal
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
    alert('Demo functionality coming soon! This would typically open a demo interface or guided tour.');
  }, []);

  /**
   * Handle cube face change
   * @param {Object} colorInfo - Color information for the new face
   */
  const handleFaceChange = useCallback((colorInfo) => {
    setCurrentColor(colorInfo);
  }, []);

  // Scroll detection for cube z-index management and title transformation
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;

      const heroRect = heroRef.current.getBoundingClientRect();
      const heroBottom = heroRect.bottom;
      const windowHeight = window.innerHeight;

      // Cube should be behind sections when hero section is scrolled out, but still visible
      const isBehind = heroBottom < -100; // Allow some overlap before going behind

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
      if (prevValues.isBehind !== isBehind) {
        setIsCubeBehindSections(isBehind);
        prevValues.isBehind = isBehind;
      }

      if (Math.abs(prevValues.progress - progress) > 0.01) { // Small threshold to prevent micro-updates
        setTitleTransformProgress(progress);
        prevValues.progress = progress;
      }

      // Update cube z-index based on scroll position
      if (cubeRef.current?.updateZIndex) {
        cubeRef.current.updateZIndex(isBehind ? 'behind' : 'above');
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

  // Effect to handle scroll animation section visibility changes
  useEffect(() => {
    if (cubeRef.current?.updateZIndex) {
      // Make cube go behind when scroll animation section is visible
      cubeRef.current.updateZIndex(isScrollAnimationVisible ? 'behind' : 'above');
    }
  }, [isScrollAnimationVisible]);

  /**
   * Handle hero section mouse events for cube control
   * @param {MouseEvent} e - Mouse event
   */
  const handleHeroMouseDown = useCallback((e) => {
    // Don't handle cube control if cube is behind sections
    if (isCubeBehindSections) {
      return;
    }

    // Check if the click is on an interactive element
    const target = e.target;
    const isInteractiveElement = target.closest('button') ||
                                target.closest('a') ||
                                target.closest('input') ||
                                target.closest('select') ||
                                target.closest('textarea');

    // Don't handle cube control if clicking on interactive elements
    if (isInteractiveElement) {
      return;
    }

    // Check if cube is currently interacting (to prevent conflicts)
    if (cubeRef.current?.isInteracting?.()) {
      return;
    }

    // Pass the event to the cube's mouse handler
    if (cubeRef.current?.handleMouseDown) {
      cubeRef.current.handleMouseDown(e);
    }
  }, [isCubeBehindSections]);

  /**
   * Handle hero section touch events for cube control
   * @param {TouchEvent} e - Touch event
   */
  const handleHeroTouchStart = useCallback((e) => {
    // Don't handle cube control if cube is behind sections
    if (isCubeBehindSections) {
      return;
    }

    // Check if the touch is on an interactive element
    const target = e.target;
    const isInteractiveElement = target.closest('button') ||
                                target.closest('a') ||
                                target.closest('input') ||
                                target.closest('select') ||
                                target.closest('textarea');

    // Don't handle cube control if touching interactive elements
    if (isInteractiveElement) {
      return;
    }

    // Check if cube is currently interacting (to prevent conflicts)
    if (cubeRef.current?.isInteracting?.()) {
      return;
    }

    // Pass the event to the cube's touch handler
    if (cubeRef.current?.handleTouchStart) {
      cubeRef.current.handleTouchStart(e);
    }
  }, [isCubeBehindSections]);

  return (
    <>
      {/* Fixed Cube in Background */}
      <div className={`${styles.cubeWrapper} ${isCubeBehindSections ? styles.cubeBehind : styles.cubeAbove}`}>
        <Cube ref={cubeRef} onFaceChange={handleFaceChange} />
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className={styles.hero}
        onMouseDown={handleHeroMouseDown}
        onTouchStart={handleHeroTouchStart}
      >
        {/* Huge, left-aligned, overflowing title */}
        <h1
          className={styles.title}
          style={{
            fontSize: `${9 - (6.5 * titleTransformProgress)}vw`,
            top: `${2 - (0.5 * titleTransformProgress)}rem`,
            left: `${2 - (0.5 * titleTransformProgress)}rem`,
            zIndex: titleTransformProgress > 0 ? 1001 : 0,
            transform: 'translateZ(0)', // Force hardware acceleration
            color: titleTransformProgress >= 0.8 ? '#ffffff' : '#111',
            transition: 'color 0.6s cubic-bezier(0.77,0,0.18,1)'
          }}
        >
          INFINDER
        </h1>

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

        {/* Color Display - positioned to the right of the cube */}
        <div className={styles.colorDisplay}>
          <p className={styles.colorText}>{currentColor.name}</p>
          <div className={styles.rightButtonsContainer}>
            <button className={styles.viewMoreButton} onClick={handleViewMoreClick}>
              view more
              <svg
                className={styles.arrowIcon}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </div>
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