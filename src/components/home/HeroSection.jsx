import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const heroImages = [
  '/hero.png',
  '/hero2.png'
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentImageIndex}
          className="hero-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src={heroImages[currentImageIndex]}
            alt="Luxury Jewelry Background"
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </motion.div>
      </AnimatePresence>

      <div className="container hero-content">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          DEL'ORO
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          L'Élégance Pure. L'Or Éternel.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <Link to="/collections">
            <button className="btn-primary">
              Découvrir la Collection
            </button>
          </Link>
        </motion.div>
      </div>

      <style>{`
        .hero {
          position: relative;
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-dark);
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.9;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom, 
            rgba(10,10,10,0.3) 0%, 
            rgba(10,10,10,0.4) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .hero-title {
          font-family: var(--font-serif);
          font-size: 4rem;
          color: var(--accent-gold);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 6rem;
          }
        }

        .hero-subtitle {
          font-family: var(--font-sans);
          font-size: 1.1rem;
          color: var(--text-light);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          max-width: 600px;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
