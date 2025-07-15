import React from 'react';
import styles from './ReloadButton.module.css';

const ReloadButton = ({ isReloading, onClick }) => {
  return (
    <button 
      className={`${styles.reloadButton} ${isReloading ? styles.reloading : ''}`} 
      onClick={onClick}
      disabled={isReloading}
    >
      <svg 
        className={styles.reloadIcon} 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M3 21v-5h5"/>
      </svg>
      RELOAD BOX
    </button>
  );
};

export default ReloadButton; 