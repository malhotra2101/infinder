import React from 'react'
import styles from '../styles/Services.module.css'

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies and best practices.',
      icon: '💻'
    },
    {
      id: 2,
      title: 'UI/UX Design',
      description: 'Intuitive and beautiful user interfaces that enhance user experience.',
      icon: '🎨'
    },
    {
      id: 3,
      title: '3D & Animation',
      description: 'Immersive 3D experiences and captivating animations for your brand.',
      icon: '🎬'
    },
    {
      id: 4,
      title: 'Digital Marketing',
      description: 'Strategic digital marketing solutions to grow your online presence.',
      icon: '📈'
    },
    {
      id: 5,
      title: 'Brand Identity',
      description: 'Complete brand identity design including logos, colors, and guidelines.',
      icon: '🏷️'
    },
    {
      id: 6,
      title: 'Consulting',
      description: 'Expert consultation to help you make informed digital decisions.',
      icon: '💡'
    }
  ]

  return (
    <section id="services" className={styles.services}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            What We
            <span className={styles.highlight}> Do</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            We offer comprehensive digital solutions to help your business thrive in the modern world.
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <span className={styles.iconText}>{service.icon}</span>
              </div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
              <div className={styles.servicePlaceholder}>
                <span className={styles.placeholderText}>Service Details Placeholder</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services 