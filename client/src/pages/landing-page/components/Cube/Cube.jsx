import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback, memo } from 'react';
import './Cube.css';

/**
 * 3D Cube component with interactive rotation and face detection
 * @param {Object} props - Component props
 * @param {Function} props.onFaceChange - Callback when face changes
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element} Cube component
 */
const Cube = memo(forwardRef(({ onFaceChange }, ref) => {
  const cubeRef = useRef(null);
  const [currentFace, setCurrentFace] = useState('front');
  const [isReloading, setIsReloading] = useState(false);

  // Use refs to maintain state across renders and avoid closure issues
  const rotationStateRef = useRef({
    currentX: 0,
    currentY: 0,
    spinning: false, // Start with spinning false so startSpin can initialize
    spinFrame: null,
    spinSpeed: 0.5,
    resumeSpinTimeout: null,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragLastX: 0,
    dragLastY: 0,
    dragAnimationFrame: null,
    isInteracting: false,
    eventListenersActive: false,
    isIntentionallyBehind: false
  });

  // Color mapping for faces
  const faceColors = {
    front: { name: 'Red', hex: '#e74c3c' },
    back: { name: 'Purple', hex: '#8e44ad' },
    right: { name: 'Blue', hex: '#3498db' },
    left: { name: 'Green', hex: '#27ae60' },
    top: { name: 'Yellow', hex: '#f1c40f' },
    bottom: { name: 'Orange', hex: '#e67e22' }
  };

  // Store function references in refs to avoid dependency issues
  const handleMouseDownRef = useRef();
  const handleTouchStartRef = useRef();

  // Expose reload method to parent component
  useImperativeHandle(ref, () => ({
    reload: (callback) => {
      if (isReloading) {
        return;
      }

      setIsReloading(true);
      const cube = cubeRef.current;

      if (!cube) {
        setIsReloading(false);
        return;
      }

      // Simple reload without animation
      setTimeout(() => {
        setIsReloading(false);
        if (callback) callback();
      }, 100);
    },
    // Expose mouse control methods using refs
    handleMouseDown: (e) => handleMouseDownRef.current?.(e),
    handleTouchStart: (e) => handleTouchStartRef.current?.(e),
    isInteracting: () => rotationStateRef.current.isInteracting,
    // Expose z-index update method
    updateZIndex: () => {
      // Implementation for z-index updates
    },
    // Expose visibility state update method
    updateVisibilityState: (isBehind) => {
      rotationStateRef.current.isIntentionallyBehind = isBehind;
    },
    // Diagnostic methods
    getDiagnostics: () => {
      const state = rotationStateRef.current;
      return {
        spinning: state.spinning,
        spinFrame: state.spinFrame,
        isInteracting: state.isInteracting,
        isIntentionallyBehind: state.isIntentionallyBehind,
        currentX: state.currentX,
        currentY: state.currentY
      };
    }
  }));

  // Face rotation map: face class -> [rotateX, rotateY]
  const faceRotations = {
    front: [0, 0],
    back: [0, 180],
    right: [0, -90],
    left: [0, 90],
    top: [-90, 0],
    bottom: [90, 0]
  };

  /**
   * Function to determine which face is most visible based on current rotation
   * @param {number} currentX - Current X rotation
   * @param {number} currentY - Current Y rotation
   * @returns {string} Most visible face
   */
  const getMostVisibleFace = (currentX, currentY) => {
    // Normalize angles to 0-360 range
    const normalizedX = ((currentX % 360) + 360) % 360;
    const normalizedY = ((currentY % 360) + 360) % 360;

    // Calculate which face is most visible based on rotation
    // For X rotation (pitch)
    let xFace = 'front';
    if (normalizedX >= 45 && normalizedX < 135) {
      xFace = 'bottom';
    } else if (normalizedX >= 135 && normalizedX < 225) {
      xFace = 'back';
    } else if (normalizedX >= 225 && normalizedX < 315) {
      xFace = 'top';
    }

    // For Y rotation (yaw)
    let yFace = 'front';
    if (normalizedY >= 45 && normalizedY < 135) {
      yFace = 'left';
    } else if (normalizedY >= 135 && normalizedY < 225) {
      yFace = 'back';
    } else if (normalizedY >= 225 && normalizedY < 315) {
      yFace = 'right';
    }

    // Determine which rotation is more dominant
    const xDominance = Math.abs(Math.sin(normalizedX * Math.PI / 180));
    const yDominance = Math.abs(Math.sin(normalizedY * Math.PI / 180));

    // Return the face from the more dominant rotation
    return xDominance > yDominance ? xFace : yFace;
  };

  /**
   * Alternative approach - Click zones with improved detection
   * @param {number} clientX - Mouse X position
   * @param {number} clientY - Mouse Y position
   * @returns {string|null} Detected face or null
   */
  const getFaceByClickZone = (clientX, clientY) => {
    const cube = cubeRef.current;
    if (!cube) return null;

    const cubeRect = cube.getBoundingClientRect();
    const state = rotationStateRef.current;

    // Calculate relative position within cube (0 to 1)
    const relX = (clientX - cubeRect.left) / cubeRect.width;
    const relY = (clientY - cubeRect.top) / cubeRect.height;

    // Determine click zone based on relative position
    let clickZone = '';
    if (relY < 0.33) clickZone = 'top';
    else if (relY > 0.67) clickZone = 'bottom';
    else if (relX < 0.33) clickZone = 'left';
    else if (relX > 0.67) clickZone = 'right';
    else clickZone = 'center';

    // Map click zone to actual face based on current rotation
    const normalizedX = ((state.currentX % 360) + 360) % 360;
    const normalizedY = ((state.currentY % 360) + 360) % 360;

    // Simple mapping based on dominant rotation
    if (Math.abs(normalizedX - 0) < 45 || Math.abs(normalizedX - 360) < 45) {
      // Front/back dominant
      if (Math.abs(normalizedY - 0) < 45 || Math.abs(normalizedY - 360) < 45) {
        return clickZone === 'center' ? 'front' :
               clickZone === 'left' ? 'left' :
               clickZone === 'right' ? 'right' :
               clickZone === 'top' ? 'top' : 'bottom';
      } else if (Math.abs(normalizedY - 180) < 45) {
        return clickZone === 'center' ? 'back' :
               clickZone === 'left' ? 'right' :
               clickZone === 'right' ? 'left' :
               clickZone === 'top' ? 'top' : 'bottom';
      }
    } else if (Math.abs(normalizedX - 90) < 45) {
      // Bottom dominant
      return clickZone === 'center' ? 'bottom' :
             clickZone === 'left' ? 'left' :
             clickZone === 'right' ? 'right' :
             clickZone === 'top' ? 'front' : 'back';
    } else if (Math.abs(normalizedX - 270) < 45) {
      // Top dominant
      return clickZone === 'center' ? 'top' :
             clickZone === 'left' ? 'left' :
             clickZone === 'right' ? 'right' :
             clickZone === 'top' ? 'back' : 'front';
    }

    return 'front'; // Default fallback
  };

  /**
   * Set cube rotation with optional transition
   * @param {number} x - X rotation
   * @param {number} y - Y rotation
   * @param {boolean} useTransition - Whether to use CSS transition
   */
  const setCubeRotation = useCallback((x, y, useTransition = true) => {
    const cube = cubeRef.current;
    if (!cube) return;

    const state = rotationStateRef.current;
    state.currentX = x;
    state.currentY = y;

    if (useTransition) {
      cube.style.transition = 'transform 0.3s ease-out';
    } else {
      cube.style.transition = 'none';
    }

    cube.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  }, []);

  /**
   * Start spinning animation
   */
  const startSpin = useCallback(() => {
    const state = rotationStateRef.current;
    state.startSpinCallCount++;

    if (state.spinning) return;

    state.spinning = true;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Starting cube spin animation');
    }
    
    const spin = () => {
      if (!state.spinning) return;

      state.currentX += state.spinSpeed;
      state.currentY += state.spinSpeed * 0.7;

      setCubeRotation(state.currentX, state.currentY, false);
      state.spinFrame = requestAnimationFrame(spin);
      state.spinFrameCount++;
    };

    state.spinFrame = requestAnimationFrame(spin);
  }, [setCubeRotation]);

  /**
   * Stop spinning animation
   */
  const stopSpin = useCallback(() => {
    const state = rotationStateRef.current;
    state.stopSpinCallCount++;

    state.spinning = false;
    if (state.spinFrame) {
      cancelAnimationFrame(state.spinFrame);
      state.spinFrame = null;
    }
  }, []);

  /**
   * Snap cube to specific face
   * @param {string} faceClass - Face to snap to
   */
  const snapToFace = useCallback((faceClass) => {
    const cube = cubeRef.current;
    if (!cube) return;

    const state = rotationStateRef.current;
    const [x, y] = faceRotations[faceClass];

    // Stop any ongoing spin animation
    if (state.spinFrame) {
      cancelAnimationFrame(state.spinFrame);
      state.spinFrame = null;
    }

    // Ensure the cube rotates to the exact face position
    cube.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    cube.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;

    // Update the state to match the exact face rotation
    state.currentX = x;
    state.currentY = y;

    // Update current face and notify parent
    setCurrentFace(faceClass);
    if (onFaceChange && typeof onFaceChange === 'function') {
      try {
        onFaceChange(faceColors[faceClass]);
      } catch (error) {
        // Handle error silently in production
        if (process.env.NODE_ENV === 'development') {
          console.error('Error calling onFaceChange:', error);
        }
      }
    }
  }, [onFaceChange, faceColors]);

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = useCallback((e) => {
    const state = rotationStateRef.current;
    if (state.isInteracting) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        snapToFace('top');
        break;
      case 'ArrowDown':
        e.preventDefault();
        snapToFace('bottom');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        snapToFace('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        snapToFace('right');
        break;
      case ' ':
        e.preventDefault();
        if (state.spinning) {
          stopSpin();
        } else {
          startSpin();
        }
        break;
      default:
        break;
    }
  }, [snapToFace, startSpin, stopSpin]);

  /**
   * Setup face event listeners
   */
  const setupFaceEventListeners = useCallback(() => {
    const cube = cubeRef.current;
    if (!cube) return;

    const faces = cube.querySelectorAll('.face');
    faces.forEach(face => {
      face.addEventListener('click', (e) => {
        e.stopPropagation();
        const faceClass = Array.from(face.classList).find(cls => faceRotations[cls]);
        if (faceClass) {
          stopSpin();
          snapToFace(faceClass);
        }
      });
    });
  }, [stopSpin, snapToFace]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    const state = rotationStateRef.current;
    if (state.isInteracting) return;

    state.isDragging = true;
    state.dragStartX = e.clientX;
    state.dragStartY = e.clientY;
    state.dragLastX = e.clientX;
    state.dragLastY = e.clientY;

    stopSpin();

    const onMove = (ev) => {
      if (!state.isDragging) return;

      const deltaX = ev.clientX - state.dragLastX;
      const deltaY = ev.clientY - state.dragLastY;

      state.currentX += deltaY * 0.5;
      state.currentY += deltaX * 0.5;

      setCubeRotation(state.currentX, state.currentY, false);
      state.dragLastX = ev.clientX;
      state.dragLastY = ev.clientY;
    };

    const onUp = (ev) => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);

      if (state.dragAnimationFrame) {
        cancelAnimationFrame(state.dragAnimationFrame);
        state.dragAnimationFrame = null;
      }

      if (!state.isDragging) {
        // Click without drag - check for face click
        const target = document.elementFromPoint(ev.clientX, ev.clientY);

        // First try to find face directly at click position
        if (target && target.classList.contains('face')) {
          const faceClass = Array.from(target.classList).find(cls => faceRotations[cls]);
          if (faceClass) {
            stopSpin();
            snapToFace(faceClass);
            return;
          }
        }

        // If no face found directly, try click zone detection
        const detectedFace = getFaceByClickZone(ev.clientX, ev.clientY);
        if (detectedFace) {
          stopSpin();
          snapToFace(detectedFace);
          return;
        }
      }

      state.isDragging = false;
      startSpin();
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [stopSpin, startSpin, snapToFace, setCubeRotation]);

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    const state = rotationStateRef.current;
    if (state.isInteracting) return;

    const touch = e.touches[0];
    state.isDragging = true;
    state.dragStartX = touch.clientX;
    state.dragStartY = touch.clientY;
    state.dragLastX = touch.clientX;
    state.dragLastY = touch.clientY;

    stopSpin();

    const onMove = (ev) => {
      if (!state.isDragging) return;

      const touch = ev.touches[0];
      const deltaX = touch.clientX - state.dragLastX;
      const deltaY = touch.clientY - state.dragLastY;

      state.currentX += deltaY * 0.5;
      state.currentY += deltaX * 0.5;

      setCubeRotation(state.currentX, state.currentY, false);
      state.dragLastX = touch.clientX;
      state.dragLastY = touch.clientY;
    };

    const onUp = (ev) => {
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);

      if (state.dragAnimationFrame) {
        cancelAnimationFrame(state.dragAnimationFrame);
        state.dragAnimationFrame = null;
      }

      if (!state.isDragging) {
        const touch = ev.changedTouches[0];
        const detectedFace = getFaceByClickZone(touch.clientX, touch.clientY);
        if (detectedFace) {
          stopSpin();
          snapToFace(detectedFace);
          return;
        }
      }

      state.isDragging = false;
      startSpin();
    };

    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onUp);
  }, [stopSpin, startSpin, snapToFace, setCubeRotation]);

  // Store function references in refs
  handleMouseDownRef.current = handleMouseDown;
  handleTouchStartRef.current = handleTouchStart;

  // Setup face event listeners
  useEffect(() => {
    const cube = cubeRef.current;
    if (cube) {
      setupFaceEventListeners();
    }
  }, [setupFaceEventListeners]);

  // Initialize cube
  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube) return;

    // Initialize with a small delay to ensure DOM is ready
    const initializeCube = () => {
      setCubeRotation(0, 0, false);
      
      // Start spinning after a brief delay to ensure everything is set up
      setTimeout(() => {
        startSpin();
      }, 100);
    };

    initializeCube();

    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      const state = rotationStateRef.current;
      if (state.spinFrame) cancelAnimationFrame(state.spinFrame);
      if (state.resumeSpinTimeout) clearTimeout(state.resumeSpinTimeout);
      if (state.dragAnimationFrame) cancelAnimationFrame(state.dragAnimationFrame);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setCubeRotation, startSpin, handleKeyDown]);

  return (
    <div
      className={`scene cube-container ${isReloading ? 'reloading' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div ref={cubeRef} className="cube">
        <div className="face front" />
        <div className="face back" />
        <div className="face right" />
        <div className="face left" />
        <div className="face top" />
        <div className="face bottom" />
      </div>
    </div>
  );
}));

Cube.displayName = 'Cube';

export default Cube; 