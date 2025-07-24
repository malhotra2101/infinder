import React from 'react';
import styles from './GetStartedButton.module.css';

const GetStartedButton = ({ onClick }) => {
  return (
    <button 
      className={styles.getStartedButton} 
      onClick={onClick}
    >
      <span className={styles.buttonText}>Get Started</span>
      <svg 
        className={styles.arrowIcon} 
        width="20" 
        height="20" 
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
      <div className={styles.buttonGlow}></div>
    </button>
  );
};

export default GetStartedButton; 