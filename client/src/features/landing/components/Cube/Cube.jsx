import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

const Cube = React.forwardRef(({ onFaceChange, className, style }, ref) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cubeGroupRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false, lastX: 0, lastY: 0, hasMoved: false });
  const velocityRef = useRef({ x: 0, y: 0 });
  const autoRotationRef = useRef({ x: 0.005, y: 0.01 });
  const isAnimatingRef = useRef(false);
  const frameCountRef = useRef(0);
  const [isReloading, setIsReloading] = useState(false);

  // Face data mapping for compatibility
  const faces = {
    front: { name: 'Red', color: '#e74c3c' },
    back: { name: 'Purple', color: '#8e44ad' },
    right: { name: 'Blue', color: '#3498db' },
    left: { name: 'Green', color: '#27ae60' },
    top: { name: 'Yellow', color: '#f1c40f' },
    bottom: { name: 'Orange', color: '#e67e22' }
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    console.log('🚀 REBUILDING CUBE - FIXING FACE ANIMATION & MOMENTUM');

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // transparent background
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // fully transparent
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create cube group
    const cubeGroup = new THREE.Group();
    cubeGroupRef.current = cubeGroup;
    scene.add(cubeGroup);

    // Face configurations - KEEP WORKING SETUP
    const faceConfigs = [
      {
        name: 'FRONT',
        color: 0xffeaa7,
        position: [0, 0, 1],
        rotation: [0, 0, 0],
        viewRotation: { x: 0, y: 0 }
      },
      {
        name: 'BACK', 
        color: 0xdda0dd,
        position: [0, 0, -1],
        rotation: [0, Math.PI, 0],
        viewRotation: { x: 0, y: Math.PI }
      },
      {
        name: 'RIGHT',
        color: 0xff6b6b,
        position: [1, 0, 0],
        rotation: [0, Math.PI/2, 0],
        viewRotation: { x: 0, y: -Math.PI/2 }
      },
      {
        name: 'LEFT',
        color: 0x4ecdc4,
        position: [-1, 0, 0],
        rotation: [0, -Math.PI/2, 0],
        viewRotation: { x: 0, y: Math.PI/2 }
      },
      {
        name: 'TOP',
        color: 0x45b7d1,
        position: [0, 1, 0],
        rotation: [-Math.PI/2, 0, 0],
        viewRotation: { x: Math.PI/2, y: 0 }
      },
      {
        name: 'BOTTOM',
        color: 0x96ceb4,
        position: [0, -1, 0],
        rotation: [Math.PI/2, 0, 0],
        viewRotation: { x: -Math.PI/2, y: 0 }
      }
    ];

    // Create faces - KEEP WORKING SETUP
    faceConfigs.forEach((config) => {
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.MeshLambertMaterial({ 
        color: config.color,
        side: THREE.DoubleSide
      });
      const face = new THREE.Mesh(geometry, material);
      
      face.position.set(...config.position);
      face.rotation.set(...config.rotation);
      face.userData = {
        faceName: config.name,
        faceColor: config.color,
        viewRotation: config.viewRotation
      };

      cubeGroup.add(face);
    });

    // Increase cube size
    cubeGroup.scale.set(2.2, 2.2, 2.2);

    // Lighting - KEEP WORKING SETUP
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      frameCountRef.current++;

      if (cubeGroupRef.current) {
        // Auto rotation when idle
        if (!mouseRef.current.isDown && !isAnimatingRef.current) {
          cubeGroupRef.current.rotation.x += autoRotationRef.current.x;
          cubeGroupRef.current.rotation.y += autoRotationRef.current.y;
        }

        // IMPROVED MOMENTUM - Better fidget spinner physics
        if (!isAnimatingRef.current && !mouseRef.current.isDown) {
          if (Math.abs(velocityRef.current.x) > 0.0005 || Math.abs(velocityRef.current.y) > 0.0005) {
            cubeGroupRef.current.rotation.x += velocityRef.current.x;
            cubeGroupRef.current.rotation.y += velocityRef.current.y;

            // Better friction for more realistic fidget spinner effect
            velocityRef.current.x *= 0.994; // Very slow decay
            velocityRef.current.y *= 0.994;
          } else {
            velocityRef.current.x = 0;
            velocityRef.current.y = 0;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Mouse interactions
  useEffect(() => {
    const canvas = rendererRef.current?.domElement;
    if (!canvas) return;

    const handleMouseDown = (event) => {
      event.preventDefault();
      mouseRef.current.isDown = true;
      mouseRef.current.lastX = event.clientX;
      mouseRef.current.lastY = event.clientY;
      mouseRef.current.hasMoved = false;
      
      // Clear momentum when grabbing
      velocityRef.current = { x: 0, y: 0 };
      canvas.style.cursor = 'grabbing';
    };

    const handleMouseMove = (event) => {
      // Hover rotation when not dragging
      if (!mouseRef.current.isDown) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        if (cubeGroupRef.current && !isAnimatingRef.current) {
          cubeGroupRef.current.rotation.x += (mouseY * 0.0003);
          cubeGroupRef.current.rotation.y += (mouseX * 0.0003);
        }
        return;
      }

      if (isAnimatingRef.current) return;

      // IMPROVED MANUAL CONTROL
      const deltaX = event.clientX - mouseRef.current.lastX;
      const deltaY = event.clientY - mouseRef.current.lastY;
      
      mouseRef.current.hasMoved = true;

      if (cubeGroupRef.current) {
        // Responsive rotation with proper direction
        const rotationMultiplier = 0.012;
        
        const rotationX = deltaY * rotationMultiplier;
        const rotationY = -deltaX * rotationMultiplier; // Negative for natural direction
        
        // Smooth movement without jarring speed caps
        cubeGroupRef.current.rotation.x += rotationX;
        cubeGroupRef.current.rotation.y += rotationY;
        
        // ENHANCED MOMENTUM CALCULATION for better fidget spinner effect
        const momentumMultiplier = 0.15; // Much stronger momentum
        velocityRef.current.x = rotationX * momentumMultiplier;
        velocityRef.current.y = rotationY * momentumMultiplier;
      }

      mouseRef.current.lastX = event.clientX;
      mouseRef.current.lastY = event.clientY;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
      canvas.style.cursor = 'grab';
      
      // Momentum is already stored in velocityRef from mousemove
      console.log('🎯 MOMENTUM APPLIED:', velocityRef.current);
    };

    const handleMouseLeave = () => {
      mouseRef.current.isDown = false;
      canvas.style.cursor = 'grab';
    };

    // IMPROVED FACE CLICKING - No fast spinning
    const handleClick = (event) => {
      if (!cubeGroupRef.current || !cameraRef.current || isAnimatingRef.current) return;

      // Only process clicks, not drags
      if (mouseRef.current.hasMoved) return;

      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      
      const intersects = raycaster.intersectObjects(cubeGroupRef.current.children, true);
      
      if (intersects.length > 0) {
        const clickedFace = intersects[0].object;
        const userData = clickedFace.userData;
        
        console.log('🎯 FACE CLICKED:', userData.faceName);
        
        // Map Three.js face names to our face data
        const faceMapping = {
          'FRONT': 'front',
          'BACK': 'back',
          'RIGHT': 'right',
          'LEFT': 'left',
          'TOP': 'top',
          'BOTTOM': 'bottom'
        };
        
        const faceKey = faceMapping[userData.faceName];
        if (faceKey && onFaceChange) {
          onFaceChange(faces[faceKey]);
        }
        
        animateToFace(userData.viewRotation, userData.faceName);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);
    canvas.style.cursor = 'grab';

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, [onFaceChange]);

  // IMPROVED FACE ANIMATION - No fast spinning, smooth direct rotation
  const animateToFace = (targetRotation, faceName) => {
    if (!cubeGroupRef.current || isAnimatingRef.current) return;

    console.log('🎬 SMOOTH FACE ANIMATION TO:', faceName);
    isAnimatingRef.current = true;
    velocityRef.current = { x: 0, y: 0 }; // Clear momentum

    const startRotation = {
      x: cubeGroupRef.current.rotation.x,
      y: cubeGroupRef.current.rotation.y
    };

    // Calculate shortest path rotation without crazy spinning
    const normalizeAngle = (angle) => {
      while (angle > Math.PI) angle -= 2 * Math.PI;
      while (angle < -Math.PI) angle += 2 * Math.PI;
      return angle;
    };

    // Find the shortest rotation path
    let deltaX = normalizeAngle(targetRotation.x - startRotation.x);
    let deltaY = normalizeAngle(targetRotation.y - startRotation.y);

    console.log('📐 SMOOTH PATH:', {
      start: startRotation,
      target: targetRotation,
      delta: { x: deltaX, y: deltaY }
    });

    let progress = 0;
    const duration = 1200; // Slightly faster for better UX
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);

      // Smooth easing - no sudden speed changes
      const eased = progress < 0.5 
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      if (cubeGroupRef.current) {
        cubeGroupRef.current.rotation.x = startRotation.x + deltaX * eased;
        cubeGroupRef.current.rotation.y = startRotation.y + deltaY * eased;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isAnimatingRef.current = false;
        console.log('✅ SMOOTH FACE ANIMATION COMPLETE');
      }
    };

    animate();
  };

  // Reload animation - KEEP WORKING WITH SMOOTH TRANSITIONS
  const handleReload = () => {
    if (!cubeGroupRef.current || isReloading) return;

    console.log('🔄 STARTING RELOAD ANIMATION');
    setIsReloading(true);
    isAnimatingRef.current = true;
    
    const originalScale = cubeGroupRef.current.scale.clone();
    const currentAutoRotationSpeed = autoRotationRef.current.y;
    let progress = 0;
    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);

      if (cubeGroupRef.current) {
        let scale;
        let rotationSpeed;
        
        if (progress < 0.1) {
          // Transition phase 1: Ramp up
          const transitionProgress = progress / 0.1;
          const eased = transitionProgress * transitionProgress;
          scale = originalScale.x;
          rotationSpeed = currentAutoRotationSpeed + (eased * (0.08 - currentAutoRotationSpeed));
        } else if (progress < 0.4) {
          // Shrinking phase
          const shrinkProgress = (progress - 0.1) / 0.3;
          const eased = shrinkProgress < 0.5 
            ? 2 * shrinkProgress * shrinkProgress
            : 1 - Math.pow(-2 * shrinkProgress + 2, 2) / 2;
          scale = originalScale.x * (1 - eased * 0.995);
          rotationSpeed = 0.08 + (eased * 0.22);
        } else if (progress < 0.55) {
          // Pause phase
          scale = originalScale.x * 0.005;
          rotationSpeed = 0.3;
        } else if (progress < 0.85) {
          // Expanding phase
          const expandProgress = (progress - 0.55) / 0.3;
          const eased = 1 - Math.pow(1 - expandProgress, 3);
          scale = originalScale.x * (0.005 + eased * 0.995);
          rotationSpeed = 0.3 - (eased * 0.22);
        } else {
          // Transition phase 2: Ramp down
          const transitionProgress = (progress - 0.85) / 0.15;
          const eased = 1 - Math.pow(1 - transitionProgress, 2);
          scale = originalScale.x;
          rotationSpeed = 0.08 - (eased * (0.08 - currentAutoRotationSpeed));
        }
        
        cubeGroupRef.current.scale.set(scale, scale, scale);
        cubeGroupRef.current.rotation.y += rotationSpeed;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsReloading(false);
        isAnimatingRef.current = false;
        if (cubeGroupRef.current) {
          cubeGroupRef.current.scale.copy(originalScale);
        }
      }
    };

    animate();
  };

  // Expose reload method via ref for compatibility
  React.useImperativeHandle(ref, () => ({
    reload: (callback) => {
      handleReload();
      if (callback) callback();
    }
  }));

  return (
    <div 
      ref={containerRef} 
      className={`${className ? className : ''} cube-canvas`.trim()}
      style={{
        width: '1000px',
        height: '1000px',
        background: 'transparent',
        overflow: 'visible',
        ...(style || {})
      }}
    >
    </div>
  );
});

Cube.displayName = 'Cube';

export default Cube; 