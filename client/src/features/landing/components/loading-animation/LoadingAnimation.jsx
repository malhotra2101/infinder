import React, { useEffect, useRef, useState } from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = ({ isLoading = true, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [isFullyComplete, setIsFullyComplete] = useState(false);
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const requestRef = useRef();
  const morphRequestRef = useRef();
  const logoPathRef = useRef(null);
  const logoTextRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const hasCalledOnComplete = useRef(false);

  // Handle progress and completion
  useEffect(() => {
    let progressInterval;
    
    const completeAnimation = () => {
      // First ensure we're at 100%
      setProgress(100);
      
      // Wait a moment at 100%
      setTimeout(() => {
        setIsFullyComplete(true);
        
        // Wait for the pulse effect
        setTimeout(() => {
          // Only now start the slide out
          setIsSlidingOut(true);
          
          // Wait for slide out to complete before calling onComplete
          setTimeout(() => {
            setIsAnimationDone(true);
            if (onComplete && !hasCalledOnComplete.current) {
              hasCalledOnComplete.current = true;
              onComplete();
            }
          }, 600); // Reduced from 800ms for faster transition
        }, 600); // Reduced from 800ms for faster transition
      }, 300); // Reduced from 500ms for faster transition
    };

    if (!isLoading) {
      // If loading is externally set to false, fast-forward to 100%
      if (progressInterval) clearInterval(progressInterval);
      completeAnimation();
      return;
    }

    progressInterval = setInterval(() => {
      setProgress(prev => {
        const nextProgress = prev + 2; // Increased from 1 to 2 for faster progress
        if (nextProgress >= 100) {
          clearInterval(progressInterval);
          completeAnimation();
          return 100;
        }
        return nextProgress;
      });
    }, 30); // Reduced from 40ms for faster progress

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isLoading, onComplete]);

  // Initialize particles
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    
    // Set canvas dimensions
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Create particles
    const createParticles = () => {
      const particles = [];
      const particleCount = Math.min(150, Math.floor(window.innerWidth / 10));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
          acceleration: Math.random() * 0.02 + 0.01,
          maxSpeed: Math.random() * 3 + 1,
          connections: [],
          life: Math.random() * 100 + 50,
          opacity: Math.random() * 0.5 + 0.5
        });
      }
      
      return particles;
    };
    
    particlesRef.current = createParticles();
    
    // Mouse move event for interactive particles
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
        
        // Mouse interaction
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const angle = Math.atan2(dy, dx);
          const force = (150 - distance) / 150;
          
          particle.speedX -= Math.cos(angle) * force * particle.acceleration;
          particle.speedY -= Math.sin(angle) * force * particle.acceleration;
        }
        
        // Limit speed
        const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
        if (speed > particle.maxSpeed) {
          particle.speedX = (particle.speedX / speed) * particle.maxSpeed;
          particle.speedY = (particle.speedY / speed) * particle.maxSpeed;
        }
        
        // Progress-based color intensity
        const progressIntensity = progress / 100;
        particle.color = `rgba(255, 255, 255, ${particle.opacity * (0.5 + progressIntensity * 0.5)})`;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * (1 + progressIntensity * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Draw connections
        particlesRef.current.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / 100) * 0.2})`;
              ctx.lineWidth = (1 - distance / 100) * 2;
              ctx.stroke();
            }
          }
        });
        
        // Life cycle
        particle.life -= 0.1;
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = Math.random() * 100 + 50;
        }
      });
      
      // Draw 3D grid effect
      const gridSize = 20;
      const gridSpacing = 100;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let i = -gridSize; i <= gridSize; i++) {
        const perspectiveX = (i * gridSpacing) / (1 + Math.abs(i) * 0.1);
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(centerX + perspectiveX, 0);
        ctx.lineTo(centerX + perspectiveX, canvas.height);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 - Math.abs(i) * 0.002})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Vertical lines
        const perspectiveY = (i * gridSpacing) / (1 + Math.abs(i) * 0.1);
        ctx.beginPath();
        ctx.moveTo(0, centerY + perspectiveY);
        ctx.lineTo(canvas.width, centerY + perspectiveY);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 - Math.abs(i) * 0.002})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // SVG Logo morphing effect
  useEffect(() => {
    let isMounted = true;
    
    const morphLogo = () => {
      // Check if component is still mounted and refs are available
      if (!isMounted || !logoPathRef.current || !logoTextRef.current) {
        return;
      }
      
      const path = logoPathRef.current;
      const text = logoTextRef.current;
      
      // Pulse effect for the SVG path
      const pulseIntensity = 1 + Math.sin(Date.now() * 0.002) * 0.05;
      path.setAttribute('transform', `scale(${pulseIntensity})`);
      
      // Text glow effect
      const glowIntensity = 5 + Math.sin(Date.now() * 0.003) * 3;
      text.style.filter = `drop-shadow(0 0 ${glowIntensity}px rgba(255, 255, 255, 0.8))`;
      
      // Continue animation if component is still mounted
      if (isMounted) {
        morphRequestRef.current = requestAnimationFrame(morphLogo);
      }
    };
    
    // Start animation only if refs are available
    if (logoPathRef.current && logoTextRef.current) {
      morphRequestRef.current = requestAnimationFrame(morphLogo);
    }
    
    return () => {
      isMounted = false;
      if (morphRequestRef.current) {
        cancelAnimationFrame(morphRequestRef.current);
      }
    };
  }, []);

  // Make sure we don't unmount prematurely
  useEffect(() => {
    return () => {
      if (!hasCalledOnComplete.current && onComplete) {
        hasCalledOnComplete.current = true;
        onComplete();
      }
    };
  }, [onComplete]);

  // Don't render anything if we're completely done
  if (isAnimationDone) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`loading-overlay ${isSlidingOut ? 'sliding-out' : ''} ${isFullyComplete ? 'fully-complete' : ''}`}
      style={{ perspective: '1000px' }}
    >
      {/* Particle Canvas Background */}
      <canvas ref={canvasRef} className="particle-canvas"></canvas>
      
      {/* 3D Rotating Elements */}
      <div className="rotating-cube-container">
        <div className="rotating-cube">
          <div className="cube-face front"></div>
          <div className="cube-face back"></div>
          <div className="cube-face right"></div>
          <div className="cube-face left"></div>
          <div className="cube-face top"></div>
          <div className="cube-face bottom"></div>
        </div>
      </div>
      
      {/* Main Loading Content */}
      <div className="loading-content">
        {/* SVG Logo */}
        <div className="loading-brand">
          <div className="svg-logo-container">
            <svg width="120" height="120" viewBox="0 0 100 100">
              {/* Outer ring with gradient and glow */}
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#f0f0f0" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              {/* Animated circular paths */}
              <g ref={logoPathRef} filter="url(#glow)" transform="scale(1)">
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#logoGradient)" strokeWidth="2" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="url(#logoGradient)" strokeWidth="1.5" strokeDasharray="10 5" className="rotating-circle" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="url(#logoGradient)" strokeWidth="1" strokeDasharray="5 10" className="rotating-circle-reverse" />
                
                {/* Inner circle with pulsing effect */}
                <circle cx="50" cy="50" r="25" fill="url(#logoGradient)" className="pulsing-circle" />
                
                {/* "I" letter */}
                <text x="50" y="58" textAnchor="middle" fill="#222" fontSize="30" fontWeight="bold" ref={logoTextRef}>I</text>
              </g>
            </svg>
          </div>
          <h1 className="loading-title">Infinder</h1>
        </div>
        
        {/* Holographic Progress Bar */}
        <div className="holographic-bar-container">
          <div className="holographic-bar">
            <div 
              className="holographic-bar-fill"
              style={{ width: `${progress}%` }}
            />
            <div className="holographic-bar-glow" />
            <div className="holographic-bar-scan" />
          </div>
          <div className="loading-percentage">{Math.round(progress)}%</div>
        </div>
        
        {/* Dynamic Status Text */}
        <div className="loading-status">
          <div className="loading-status-text">
            {progress < 25 && "Initializing quantum interface..."}
            {progress >= 25 && progress < 50 && "Calibrating neural networks..."}
            {progress >= 50 && progress < 75 && "Synchronizing parallel dimensions..."}
            {progress >= 75 && progress < 100 && "Finalizing holographic projection..."}
            {progress >= 100 && "Welcome to the future!"}
          </div>
        </div>
        
        {/* Glitch Effect Text */}
        <div className="glitch-container">
          <div className="glitch" data-text="INFINDER">INFINDER</div>
        </div>
        
        {/* Energy Rings */}
        <div className="energy-rings">
          <div className="energy-ring ring1"></div>
          <div className="energy-ring ring2"></div>
          <div className="energy-ring ring3"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation; 