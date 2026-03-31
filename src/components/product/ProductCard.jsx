import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    addToast(`${product.name} ajouté au panier`, 'success');
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <motion.div
        className="product-card"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="card-image-wrapper">
          {product.is_featured && (
            <div className="badge-featured">Édition Limitée</div>
          )}
          <img src={product.image} alt={product.name} loading="lazy" />
          <div className="card-overlay">
            <motion.button
              className="quick-add-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} />
            </motion.button>
            <span className="view-details">Voir l'article</span>
          </div>
        </div>

        <div className="card-body">
          <div className="card-category">{product.category || 'Collection'}</div>
          <h3 className="card-title">{product.name}</h3>
          <div className="card-footer">
            <p className="card-price">{product.price.toLocaleString()} $</p>
            <div className="card-stock-indicator">
              <span className={`dot ${product.stock > 0 ? 'in' : 'out'}`}></span>
              {product.stock > 0 ? 'En stock' : 'Épuisé'}
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .product-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .product-card {
          background: rgba(25, 25, 25, 0.4);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 4px; /* Luxury sharp look */
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .product-card:hover {
          border-color: rgba(212, 175, 55, 0.4);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .card-image-wrapper {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: #fff; /* Display products on clean white background */
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .card-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 1.5rem;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-card:hover .card-image-wrapper img {
          transform: scale(1.1);
        }

        .badge-featured {
          position: absolute;
          top: 12px;
          left: 12px;
          background: var(--accent-gold);
          color: var(--bg-dark);
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 4px 8px;
          z-index: 2;
          border-radius: 2px;
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
          gap: 1rem;
        }

        .product-card:hover .card-overlay {
          opacity: 1;
        }

        .quick-add-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: white;
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .view-details {
          color: white;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          border-bottom: 1px solid white;
          padding-bottom: 2px;
        }

        .card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex-grow: 1;
        }

        .card-category {
          font-size: 0.7rem;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-family: var(--font-sans);
        }

        .card-title {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          color: var(--text-light);
          margin: 0;
          font-weight: 400;
          line-height: 1.3;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.5rem;
        }

        .card-price {
          color: var(--text-light);
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 1.1rem;
          margin: 0;
        }

        .card-stock-indicator {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .dot.in { background: #68d391; box-shadow: 0 0 8px #68d391; }
        .dot.out { background: #fc8181; }

        @media (max-width: 600px) {
          .card-title { font-size: 0.8rem; margin-bottom: 2px; }
          .card-body { padding: 0.6rem; gap: 0.2rem; }
          .card-price { font-size: 0.85rem; font-weight: 600; }
          .card-category { font-size: 0.55rem; letter-spacing: 0.1em; }
          .card-stock-indicator { font-size: 0.65rem; }
          .card-image-wrapper img { padding: 0.75rem; }
          .badge-featured { font-size: 0.55rem; padding: 3px 6px; top: 8px; left: 8px; }
          
          /* Adjust overlay elements */
          .quick-add-btn { width: 36px; height: 36px; }
          .quick-add-btn svg { width: 16px; height: 16px; }
          .view-details { font-size: 0.55rem; }
          .card-overlay { gap: 0.5rem; }
        }
      `}</style>
    </Link>
  );
};

export default ProductCard;
