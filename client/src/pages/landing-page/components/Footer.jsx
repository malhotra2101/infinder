import React from 'react'
import styles from '../styles/Footer.module.css'

const Footer = () => {
  const socialLinks = [
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' },
    { name: 'Behance', icon: '🎨', url: '#' },
    { name: 'Dribbble', icon: '🏀', url: '#' }
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          {/* Company Info */}
          <div className={styles.footerSection}>
            <div className={styles.logo}>
              <span className={styles.logoText}>AMANATION</span>
            </div>
            <p className={styles.companyDescription}>
              Creating immersive digital experiences that connect brands with their audience 
              through innovative design and cutting-edge technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li><a href="#about" className={styles.footerLink}>About Us</a></li>
              <li><a href="#services" className={styles.footerLink}>Services</a></li>
              <li><a href="#showcase" className={styles.footerLink}>Our Work</a></li>
              <li><a href="#contact" className={styles.footerLink}>Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Services</h3>
            <ul className={styles.footerLinks}>
              <li><a href="#" className={styles.footerLink}>Web Development</a></li>
              <li><a href="#" className={styles.footerLink}>UI/UX Design</a></li>
              <li><a href="#" className={styles.footerLink}>3D & Animation</a></li>
              <li><a href="#" className={styles.footerLink}>Brand Identity</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Contact</h3>
            <div className={styles.contactInfo}>
              <p className={styles.contactText}>hello@amanation.com</p>
              <p className={styles.contactText}>+1 (555) 123-4567</p>
              <p className={styles.contactText}>123 Creative Street<br />Design District, NY 10001</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className={styles.socialSection}>
          <h3 className={styles.socialTitle}>Follow Us</h3>
          <div className={styles.socialLinks}>
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className={styles.socialLink}
                title={social.name}
              >
                <span className={styles.socialIcon}>{social.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © 2024 AMANATION. All rights reserved.
            </p>
            <div className={styles.bottomLinks}>
              <a href="#" className={styles.bottomLink}>Privacy Policy</a>
              <a href="#" className={styles.bottomLink}>Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 