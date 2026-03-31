import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import ProductCard from '../components/product/ProductCard';
import api from '../api/axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        const all = res.data;
        // Featured: is_featured=1, fallback to first 3
        const featured = all.filter(p => p.is_featured);
        const latest = all.slice(0, 4);
        setFeaturedProducts(featured.length > 0 ? featured : latest.slice(0, 3));
        setLatestProducts(latest);
      } catch (err) {
        console.error('Failed to load home products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="page-home">
      <HeroSection />

      {/* Brand Story */}
      <section className="section-intro">
        <div className="container">
          <motion.div
            className="intro-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="eyebrow">Notre Maison</span>
            <h2 className="section-title">L'Art de la Joaillerie</h2>
            <p className="section-text">
              Chaque pièce raconte une histoire. Une fusion entre tradition artisanale
              et design contemporain pour sublimer votre éclat naturel.
            </p>
            <Link to="/collections" className="link-arrow">
              Explorer les collections <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      {(!loading && featuredProducts.length > 0) && (
        <section className="section-products">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">Collections Exclusives</h2>
              <Link to="/collections" className="view-all">
                Voir tout <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div
              className="home-products-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.12 } },
                hidden: {}
              }}
            >
              {featuredProducts.map(product => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      {(!loading && latestProducts.length > 0 && latestProducts !== featuredProducts) && (
        <section className="section-products section-latest">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">Nouveautés</h2>
              <Link to="/collections" className="view-all">
                Voir tout <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div
              className="home-products-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {}
              }}
            >
              {latestProducts.map(product => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Empty state when no products yet */}
      {(!loading && featuredProducts.length === 0) && (
        <section className="section-featured">
          <div className="container">
            <h2 className="section-title">Collections Exclusives</h2>
            <div className="featured-grid">
              <Link to="/collections" className="featured-item card-gold">
                <h3>Or</h3>
              </Link>
              <Link to="/collections" className="featured-item card-silver">
                <h3>Argent</h3>
              </Link>
              <Link to="/collections" className="featured-item card-rings">
                <h3>Bagues</h3>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trust Badges */}
      <section className="section-trust">
        <div className="container">
          <motion.div
            className="trust-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } }, hidden: {} }}
          >
            {[
              { icon: <Truck size={28} />, title: 'Livraison Offerte', desc: 'Sur toutes les commandes' },
              { icon: <Shield size={28} />, title: 'Garantie 2 ans', desc: 'Qualité certifiée DEL\'ORO' },
              { icon: <Star size={28} />, title: 'Pièces Uniques', desc: 'Artisanat d\'exception' },
            ].map(({ icon, title, desc }) => (
              <motion.div
                key={title}
                className="trust-card"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
              >
                <div className="trust-icon">{icon}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <style>{`
        .section-intro {
          padding: var(--spacing-xl) 0;
          text-align: center;
        }

        .intro-content {
          max-width: 680px;
          margin: 0 auto;
        }

        .eyebrow {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--accent-gold);
          font-family: var(--font-sans);
          display: block;
          margin-bottom: 1rem;
        }

        .section-title {
          color: var(--text-light);
          margin-bottom: var(--spacing-md);
          font-family: var(--font-serif);
        }

        .section-text {
          max-width: 600px;
          margin: 0 auto 1.5rem;
          color: var(--text-muted);
          font-size: 1.1rem;
          line-height: 1.8;
        }

        .link-arrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent-gold);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-family: var(--font-sans);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s;
        }

        .link-arrow:hover {
          border-color: var(--accent-gold);
        }

        .section-products {
          padding: var(--spacing-xl) 0;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .section-latest {
          background: linear-gradient(to bottom, transparent, rgba(212,175,55,0.03));
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .section-header .section-title {
          margin-bottom: 0;
        }

        .view-all {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-muted);
          font-size: 0.85rem;
          text-decoration: none;
          font-family: var(--font-sans);
          transition: color 0.3s;
        }

        .view-all:hover { color: var(--accent-gold); }

        .home-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 2rem;
        }

        @media (max-width: 600px) {
          .home-products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
        }

        /* Fallback grid */
        .section-featured {
          padding-bottom: var(--spacing-xl);
        }

        .featured-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-md);
        }

        @media (min-width: 768px) {
          .featured-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .featured-item {
          height: 400px;
          background-color: var(--bg-dark-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.05);
          transition: border-color var(--transition-fast);
          cursor: pointer;
          text-decoration: none;
        }

        .featured-item:hover { border-color: var(--accent-gold); }

        .featured-item h3 {
          font-family: var(--font-serif);
          font-size: 2rem;
          color: var(--text-light);
        }

        /* Trust Section */
        .section-trust {
          padding: var(--spacing-xl) 0;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2rem;
        }

        .trust-card {
          text-align: center;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: border-color 0.3s;
        }

        .trust-card:hover {
          border-color: rgba(212, 175, 55, 0.3);
        }

        .trust-icon {
          color: var(--accent-gold);
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
        }

        .trust-card h4 {
          color: var(--text-light);
          font-family: var(--font-serif);
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .trust-card p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default Home;
