import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ScrollRevealText.module.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ScrollRevealText = () => {
  const sectionRef = useRef(null);

  const texts = [
    'Playlistes sur mesure.',
    'Explore, écoute, aime.',
    'Audio immersive.',
    'Nouveaux hits.',
    'Partage musical facile.',
    'Écoute hors ligne.',
    'Musique à emporte.',
    'Lyrics en direct.'
  ];

  useEffect(() => {
    // EXACT COPY FROM VUE FILE
    gsap.set('.section__item', {
      opacity: 0,
      scale: 0.5,
      y: 100
    });
    gsap.set('.section__item:first-child', {
      opacity: 1,
      scale: 1,
      y: 0
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.section__inner',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });

    const items = document.querySelectorAll('.section__item');

    items.forEach((item, index) => {
      if (index > 0) {
        timeline.to(items[index - 1], {
          opacity: 0,
          scale: 0.5,
          y: -100,
          ease: 'none'
        });
      }

      timeline.to(
        item,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: 'none'
        },
        '-=.9'
      );

      if (index < items.length - 1) {
        timeline.to(
          item,
          {
            opacity: 0,
            scale: 0.5,
            y: -100,
            ease: 'none'
          },
          '-=.4'
        );
      }
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className={styles.backgroundContainer}>
      <main className={styles.main}>
        <section>
          <div>
            <div className={`${styles.sectionInner} section__inner`}>
              <div className={styles.stickyContainer}>
                {texts.map((text, index) => (
                  <div key={index} className={`${styles.sectionItem} section__item`}>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ScrollRevealText; 