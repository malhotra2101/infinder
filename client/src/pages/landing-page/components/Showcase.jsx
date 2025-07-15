import React from 'react'
import styles from '../styles/Showcase.module.css'
import LazyImage from '../../../components/LazyImage'

const Showcase = () => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      category: 'Web Development',
      description: 'A modern e-commerce platform with advanced features and seamless user experience.',
      imagePlaceholder: 'Project 1 Image Placeholder',
      imageSrc: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Brand Identity Design',
      category: 'Branding',
      description: 'Complete brand identity redesign for a tech startup including logo, colors, and guidelines.',
      imagePlaceholder: 'Project 2 Image Placeholder',
      imageSrc: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: '3D Product Visualization',
      category: '3D & Animation',
      description: 'Interactive 3D product visualization for automotive industry with real-time rendering.',
      imagePlaceholder: 'Project 3 Image Placeholder',
      imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Mobile App Design',
      category: 'UI/UX Design',
      description: 'User-centered mobile app design with intuitive navigation and modern interface.',
      imagePlaceholder: 'Project 4 Image Placeholder',
      imageSrc: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop'
    }
  ]

  return (
    <section id="showcase" className={styles.showcase}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Featured
            <span className={styles.highlight}> Work</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Explore our latest projects and see how we bring creative visions to life.
          </p>
        </div>

        <div className={styles.showcaseGrid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectImage}>
                <LazyImage
                  src={project.imageSrc}
                  alt={project.title}
                  className={styles.projectImage}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  onLoad={() => console.log(`Loaded image for ${project.title}`)}
                  onError={() => console.error(`Failed to load image for ${project.title}`)}
                />
              </div>
              <div className={styles.projectContent}>
                <div className={styles.projectCategory}>{project.category}</div>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
                <div className={styles.projectPlaceholder}>
                  <span className={styles.placeholderText}>Project Details Placeholder</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.showcaseFooter}>
          <button className={styles.viewAllButton}>
            View All Projects
          </button>
        </div>
      </div>
    </section>
  )
}

export default Showcase 