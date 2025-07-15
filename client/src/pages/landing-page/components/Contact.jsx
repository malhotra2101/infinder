import React from 'react'
import styles from '../styles/Contact.module.css'

const Contact = () => {
  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Get In
            <span className={styles.highlight}> Touch</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Ready to start your next project? Let's discuss how we can help bring your vision to life.
          </p>
        </div>

        <div className={styles.contactContent}>
          {/* Left side - Contact Form */}
          <div className={styles.contactLeft}>
            <div className={styles.contactForm}>
              <h3 className={styles.formTitle}>Send us a message</h3>
              <form className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={styles.formInput}
                    placeholder="Your full name"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={styles.formInput}
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.formLabel}>Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className={styles.formInput}
                    placeholder="What's this about?"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.formLabel}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    className={styles.formTextarea}
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>
                
                <button type="submit" className={styles.submitButton}>
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Right side - Contact Information */}
          <div className={styles.contactRight}>
            <div className={styles.contactInfo}>
              <h3 className={styles.infoTitle}>Contact Information</h3>
              
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>📍</div>
                <div className={styles.infoContent}>
                  <h4 className={styles.infoLabel}>Address</h4>
                  <p className={styles.infoText}>123 Creative Street<br />Design District, NY 10001</p>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>📧</div>
                <div className={styles.infoContent}>
                  <h4 className={styles.infoLabel}>Email</h4>
                  <p className={styles.infoText}>hello@amanation.com</p>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>📱</div>
                <div className={styles.infoContent}>
                  <h4 className={styles.infoLabel}>Phone</h4>
                  <p className={styles.infoText}>+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>⏰</div>
                <div className={styles.infoContent}>
                  <h4 className={styles.infoLabel}>Working Hours</h4>
                  <p className={styles.infoText}>Mon - Fri: 9AM - 6PM<br />Weekend: By appointment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact 