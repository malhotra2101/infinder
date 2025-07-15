import React, { useEffect, useState } from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = ({ isLoading = true, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isSlidingOut, setIsSlidingOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowContent(true);
      // Start sliding out animation
      setIsSlidingOut(true);
      setTimeout(() => {
        onComplete?.();
      }, 800); // Wait for slide animation to complete
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowContent(true);
            // Start sliding out animation
            setIsSlidingOut(true);
            setTimeout(() => {
              onComplete?.();
            }, 800); // Wait for slide animation to complete
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isLoading, onComplete]);

  if (!isLoading && showContent && !isSlidingOut) {
    return null;
  }

  return (
    <div className={`loading-overlay ${isSlidingOut ? 'sliding-out' : ''}`}>
      <div className="loading-container">
        {/* Animated Grid Background */}
        <div className="loading-grid">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="grid-cell" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>

        {/* Main Loading Content */}
        <div className="loading-content">
          {/* Brand Logo */}
          <div className="loading-brand">
            <div className="loading-logo-container">
              <div className="loading-logo-ring">
                <div className="loading-logo-inner">
                  <span className="loading-logo-text">I</span>
                </div>
              </div>
            </div>
            <h1 className="loading-title">Infinder</h1>
          </div>

          {/* Animated Loading Bar */}
          <div className="loading-bar-container">
            <div className="loading-bar">
              <div 
                className="loading-bar-fill"
                style={{ width: `${progress}%` }}
              />
              <div className="loading-bar-glow" />
            </div>
            <div className="loading-percentage">{Math.round(progress)}%</div>
          </div>

          {/* Animated Status Text */}
          <div className="loading-status">
            <div className="loading-status-text">
              {progress < 25 && "Preparing..."}
              {progress >= 25 && progress < 50 && "Loading..."}
              {progress >= 50 && progress < 75 && "Almost ready..."}
              {progress >= 75 && progress < 100 && "Finalizing..."}
              {progress >= 100 && "Welcome!"}
            </div>
          </div>

          {/* Animated Particles */}
          <div className="loading-particles">
            {Array.from({ length: 6 }, (_, i) => (
              <div 
                key={i} 
                className="particle" 
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  left: `${20 + i * 10}%`
                }} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation; 