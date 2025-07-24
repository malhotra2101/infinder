import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Cube.css';

const Cube = React.forwardRef(({ onFaceChange }, ref) => {
  const cubeRef = useRef(null);
  const [rotation, setRotation] = useState({ x: -15, y: -15 }); // Start with a tilted view
  const [isSpinning, setIsSpinning] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragLast, setDragLast] = useState({ x: 0, y: 0 });
  
  // Animation refs
  const spinFrameRef = useRef(null);
  const dragAnimationFrameRef = useRef(null);
  
  // Constants
  const DRAG_THRESHOLD = 8;
  const DRAG_SENSITIVITY = 0.3;
  
  // Face data
  const faces = {
    front: { name: 'Red', color: '#e74c3c' },
    back: { name: 'Purple', color: '#8e44ad' },
    right: { name: 'Blue', color: '#3498db' },
    left: { name: 'Green', color: '#27ae60' },
    top: { name: 'Yellow', color: '#f1c40f' },
    bottom: { name: 'Orange', color: '#e67e22' }
  };

  // Apply rotation to cube
  const applyRotation = useCallback((x, y) => {
    if (cubeRef.current) {
      cubeRef.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
    }
  }, []);

  // Simple spin animation with better 3D movement
  useEffect(() => {
    if (!isSpinning || isDragging) return;

    let animationId;
    let angle = 0;

    const spin = () => {
      angle += 1;
      // Create more interesting 3D rotation pattern
      const x = -15 + Math.sin(angle * 0.01) * 20; // Oscillate around -15 degrees
      const y = angle * 0.5 - 15; // Continuous Y rotation starting from -15
      
      setRotation({ x, y });
      applyRotation(x, y);
      
      animationId = requestAnimationFrame(spin);
    };

    animationId = requestAnimationFrame(spin);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isSpinning, isDragging, applyRotation]);

  // Handle mouse down
  const handleMouseDown = useCallback((e) => {
    setIsSpinning(false);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragLast({ x: rotation.x, y: rotation.y });
    setIsDragging(false);
  }, [rotation]);

  // Handle mouse move
  const handleMouseMove = useCallback((e) => {
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    // Start dragging if we've moved enough
    if (!isDragging && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      setIsDragging(true);
    }
    
    // Update rotation if dragging
    if (isDragging) {
      const newX = dragLast.x - dy * DRAG_SENSITIVITY;
      const newY = dragLast.y + dx * DRAG_SENSITIVITY;
      
      setRotation({ x: newX, y: newY });
      applyRotation(newX, newY);
    }
  }, [isDragging, dragStart, dragLast, applyRotation]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Resume spinning after a delay
    setTimeout(() => {
      setIsSpinning(true);
    }, 1000);
  }, []);

  // Handle face click
  const handleFaceClick = (faceName) => {
    setIsSpinning(false);
    
    // Snap to face with proper 3D positioning
    const faceRotations = {
      front: [-15, 0],
      back: [-15, 180],
      right: [-15, 90],
      left: [-15, -90],
      top: [75, 0], // Show top face
      bottom: [-105, 0] // Show bottom face
    };
    
    const [x, y] = faceRotations[faceName];
    setRotation({ x, y });
    applyRotation(x, y);
    
    if (onFaceChange) {
      onFaceChange(faces[faceName]);
    }
  };

  // Initialize cube with proper 3D orientation
  useEffect(() => {
    applyRotation(-15, -15); // Start with tilted view
  }, [applyRotation]);

  // Global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      handleMouseMove(e);
    };

    const handleGlobalMouseUp = (e) => {
      handleMouseUp(e);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spinFrameRef.current) {
        cancelAnimationFrame(spinFrameRef.current);
      }
      if (dragAnimationFrameRef.current) {
        cancelAnimationFrame(dragAnimationFrameRef.current);
      }
    };
  }, []);

  // Expose reload method via ref
  React.useImperativeHandle(ref, () => ({
    reload: (callback) => {
      setRotation({ x: -15, y: -15 });
      setIsSpinning(true);
      setIsDragging(false);
      applyRotation(-15, -15);
      if (callback) callback();
    }
  }));

  return (
    <div className="scene">
      <div 
        ref={cubeRef}
        className="cube"
        onMouseDown={handleMouseDown}
      >
        <div 
          className="face front" 
          onClick={(e) => {
            e.stopPropagation();
            handleFaceClick('front');
          }}
        />
        <div 
          className="face back" 
          onClick={(e) => {
            e.stopPropagation();
            handleFaceClick('back');
          }}
        />
        <div 
          className="face right" 
          onClick={(e) => {
            e.stopPropagation();
            handleFaceClick('right');
          }}
        />
        <div 
          className="face left" 
          onClick={(e) => {
            e.stopPropagation();
            handleFaceClick('left');
          }}
        />
        <div 
          className="face top" 
          onClick={(e) => {
            e.stopPropagation();
            handleFaceClick('top');
          }}
        />
        <div 
          className="face bottom" 
          onClick={(e) => {
            e.stopPropagation();
            handleFaceClick('bottom');
          }}
        />
      </div>
    </div>
  );
});

Cube.displayName = 'Cube';

export default Cube; 