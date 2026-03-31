import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Minus, Plus, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        }
        console.error('Failed to fetch product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pdp-loading">
        <div className="spinner" />
        <p>Chargement…</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="pdp-not-found">
        <h2>Produit introuvable</h2>
        <Link to="/collections" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
          Retour aux collections
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="page-product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Accueil</Link> <ChevronRight size={14} />
          <Link to="/collections">Collections</Link> <ChevronRight size={14} />
          <span>{product.name}</span>
        </div>

        <div className="product-layout">
          {/* Gallery Section */}
          <div className="product-gallery">
            <motion.div
              className="main-image-container"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="no-image">
                  <span>Image non disponible</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Info Section */}
          <div className="product-info">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {product.category && (
                <span className="pdp-category">{product.category}</span>
              )}
              <h1 className="pdp-name">{product.name}</h1>
              <p className="pdp-price">{product.price} $</p>

              {product.stock > 0 ? (
                <p className="pdp-stock in-stock">✓ En stock ({product.stock} disponibles)</p>
              ) : (
                <p className="pdp-stock out-stock">✕ Rupture de stock</p>
              )}

              <div className="separator" />

              {product.description && (
                <p className="pdp-description">{product.description}</p>
              )}

              {/* Actions */}
              <div className="pdp-actions">
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
                </div>
                <button
                  className="btn-primary btn-add-cart"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  Ajouter au Panier
                </button>
              </div>

              {/* Trust badges */}
              <div className="pdp-badges">
                <div className="badge">
                  <Truck size={18} />
                  <span>Livraison offerte</span>
                </div>
                <div className="badge">
                  <RotateCcw size={18} />
                  <span>Retours 30 jours</span>
                </div>
                <div className="badge">
                  <ShieldCheck size={18} />
                  <span>Garantie 2 ans</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .pdp-loading, .pdp-not-found {
          padding-top: 140px;
          min-height: 100vh;
          text-align: center;
          color: var(--text-muted);
        }

        .pdp-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
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

        .page-product-detail {
          padding-top: 100px;
          min-height: 100vh;
          padding-bottom: var(--spacing-xl);
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }

        .breadcrumb a:hover { color: var(--accent-gold); }

        .product-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }

        @media (min-width: 900px) {
          .product-layout {
            grid-template-columns: 1.5fr 1fr;
            gap: 5rem;
          }
        }

        .main-image-container {
          background: #fff;
          padding: 2rem;
          border-radius: 4px;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-image-container img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          max-height: 500px;
        }

        .no-image {
          color: #999;
          font-size: 0.9rem;
        }

        .pdp-category {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--accent-gold);
          font-family: var(--font-sans);
          display: block;
          margin-bottom: 0.5rem;
        }

        .pdp-name {
          font-size: 2.5rem;
          color: var(--text-light);
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .pdp-name { font-size: 2rem; }
          .page-product-detail { padding-top: 80px; }
        }

        .pdp-price {
          font-family: var(--font-sans);
          font-size: 1.5rem;
          color: var(--accent-gold);
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .pdp-stock {
          font-size: 0.85rem;
          font-family: var(--font-sans);
          margin-bottom: 0.5rem;
        }

        .pdp-stock.in-stock { color: #68d391; }
        .pdp-stock.out-stock { color: #fc8181; }

        .separator {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 1.5rem 0;
        }

        .pdp-description {
          color: var(--text-muted);
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .pdp-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          flex-wrap: wrap;
          align-items: stretch;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          border: 1px solid var(--text-muted);
          color: var(--text-light);
        }

        .quantity-selector button {
          padding: 0 1rem;
          height: 100%;
          color: var(--text-light);
          min-height: 48px;
        }

        .quantity-selector span {
          width: 40px;
          text-align: center;
        }

        .btn-add-cart {
          flex: 1;
          min-width: 200px;
        }

        .btn-add-cart:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pdp-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-family: var(--font-sans);
        }

        @media (max-width: 600px) {
          .page-product-detail { padding-top: 80px; }
          .pdp-name { font-size: 1.75rem; line-height: 1.2; }
          .pdp-price { font-size: 1.25rem; }
          .pdp-description { font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem; }
          .main-image-container { min-height: 300px; padding: 1rem; }
          .breadcrumb { font-size: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
          .pdp-actions { flex-direction: column; }
          .quantity-selector { width: 100%; justify-content: space-between; }
          .btn-add-cart { width: 100%; min-width: unset; padding: 1rem; }
          .pdp-badges { grid-template-columns: 1fr; gap: 0.75rem; padding-top: 1rem; }
          .badge { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
