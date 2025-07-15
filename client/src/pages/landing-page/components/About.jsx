import React from 'react'
import styles from '../styles/About.module.css'

const About = () => {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.aboutContent}>
          {/* Left side - Text Content */}
          <div className={styles.aboutLeft}>
            <div className={styles.aboutText}>
              <h2 className={styles.sectionTitle}>
                About
                <span className={styles.highlight}> Us</span>
              </h2>
              <p className={styles.aboutDescription}>
                We are a creative digital agency specializing in immersive experiences, 
                cutting-edge web development, and innovative design solutions. Our team 
                of passionate creators works tirelessly to bring your vision to life 
                through technology and artistry.
              </p>
              <p className={styles.aboutDescription}>
                With years of experience in the digital landscape, we understand what 
                it takes to create meaningful connections between brands and their audiences. 
                Every project we undertake is an opportunity to push boundaries and 
                create something extraordinary.
              </p>
              <div className={styles.aboutStats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>50+</span>
                  <span className={styles.statLabel}>Projects Completed</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>5+</span>
                  <span className={styles.statLabel}>Years Experience</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>100%</span>
                  <span className={styles.statLabel}>Client Satisfaction</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Image Placeholder */}
          <div className={styles.aboutRight}>
            <div className={styles.imagePlaceholder}>
              <div className={styles.imageContainer}>
                <div className={styles.imageContent}>
                  <span className={styles.imageText}>About Image Placeholder</span>
                  <p className={styles.imageSubtext}>Team photo or workspace image will go here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About 