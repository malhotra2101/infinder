import React from 'react';

const loaderContainerStyle = (fullscreen) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: fullscreen ? '100vh' : 'auto',
  padding: fullscreen ? 0 : 16
});

const spinnerStyle = {
  width: '48px',
  height: '48px',
  border: '3px solid rgba(0,0,0,0.1)',
  borderTop: '3px solid #000',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const keyframesStyle = (
  <style>
    {`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}
  </style>
);

const Loader = ({ fullscreen = false }) => (
  <div style={loaderContainerStyle(fullscreen)}>
    <div style={spinnerStyle} />
    {keyframesStyle}
  </div>
);

export default Loader;


