import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';
import api from '../api/axios';

const Collection = () => {
  const [filter, setFilter] = useState('Tous');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['Tous', 'Bagues', 'Bijoux', 'Chaînettes', 'Accessoires'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
        setError('Impossible de charger les produits.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = filter === 'Tous'
    ? products
    : products.filter(p => p.category === filter);

  return (
    <div className="page-collection">
      <div className="collection-header">
        <div className="container">
          <motion.h1
            className="collection-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Nos Collections
          </motion.h1>
          <motion.p
            className="collection-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explorez notre sélection de pièces intemporelles.
          </motion.p>
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div className="filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="collection-loading">
            <div className="spinner" />
            <p>Chargement des collections…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="no-results">
            <p>{error}</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <motion.div layout className="product-grid">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="no-results">
            <p>Aucun produit dans cette catégorie pour le moment.</p>
          </div>
        )}
      </div>

      <style>{`
        .page-collection {
          padding-top: 80px;
          min-height: 100vh;
          padding-bottom: var(--spacing-xl);
        }

        .collection-header {
          text-align: center;
          padding: var(--spacing-lg) 0;
          background: linear-gradient(to bottom, var(--bg-dark) 0%, var(--bg-dark-secondary) 100%);
          margin-bottom: var(--spacing-md);
        }

        .collection-title {
          color: var(--accent-gold);
          margin-bottom: 1rem;
        }

        .collection-subtitle {
          color: var(--text-muted);
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1.2rem;
        }

        .filters {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: var(--spacing-lg);
          flex-wrap: wrap;
        }

        .filter-btn {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          padding-bottom: 5px;
          border-bottom: 1px solid transparent;
          transition: all var(--transition-fast);
        }

        .filter-btn:hover,
        .filter-btn.active {
          color: var(--text-light);
          border-color: var(--accent-gold);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 2rem;
        }

        @media (max-width: 600px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
        }

        .no-results {
          text-align: center;
          color: var(--text-muted);
          padding: 3rem;
        }

        .collection-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 4rem;
          color: var(--text-muted);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-top-color: var(--accent-gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Collection;
