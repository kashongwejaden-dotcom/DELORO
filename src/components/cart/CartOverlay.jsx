import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link, useLocation } from 'react-router-dom';

const CartOverlay = () => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal
  } = useCart();
  const location = useLocation();

  // Automatically close cart when navigating to a new page
  React.useEffect(() => {
    closeCart();
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="cart-header">
              <h2>Mon Panier</h2>
              <button onClick={closeCart} className="close-btn"><X size={24} /></button>
            </div>

            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingBag size={48} />
                  <p>Votre panier est vide.</p>
                  <Link to="/collections" className="btn-outline" style={{ display: 'inline-block' }}>
                    Explorer la Collection
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-price">{item.price} $</p>
                      <div className="item-controls">
                        <div className="quantity-control">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Sous-total</span>
                  <span className="amount">{cartTotal.toLocaleString()} $</span>
                </div>
                <p className="shipping-note">Frais de port calculés au paiement.</p>
                <Link to="/checkout" className="btn-primary btn-block">
                  Procéder au Paiement
                </Link>
              </div>
            )}
          </motion.div>

          <style>{`
            .cart-backdrop {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
              z-index: 2000;
              backdrop-filter: blur(2px);
            }

            .cart-drawer {
              position: fixed;
              top: 0;
              right: 0;
              width: 100%;
              max-width: 450px;
              height: 100%;
              background: var(--bg-dark);
              border-left: 1px solid rgba(255,255,255,0.1);
              z-index: 2001;
              display: flex;
              flex-direction: column;
              box-shadow: -5px 0 30px rgba(0,0,0,0.5);
            }

            .cart-header {
              padding: 1.5rem 2rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .cart-header h2 {
              font-size: 1.5rem;
              margin: 0;
              color: var(--text-light);
            }

            .close-btn {
              color: var(--text-muted);
              transition: color 0.2s;
            }

            .close-btn:hover {
              color: var(--text-light);
            }

            .cart-items {
              flex: 1;
              overflow-y: auto;
              padding: 2rem;
            }

            .empty-cart {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100%;
              color: var(--text-muted);
              gap: 1.5rem;
              text-align: center;
            }

            .cart-item {
              display: flex;
              gap: 1.5rem;
              margin-bottom: 2rem;
              padding-bottom: 2rem;
              border-bottom: 1px solid rgba(255,255,255,0.05);
            }

            .item-image {
              width: 80px;
              height: 80px;
              background: #fff;
              border-radius: 4px;
              overflow: hidden;
            }

            .item-image img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }

            .item-details {
              flex: 1;
            }

            .item-details h3 {
              font-family: var(--font-serif);
              font-size: 1.1rem;
              color: var(--text-light);
              margin-bottom: 0.5rem;
            }

            .item-price {
              color: var(--accent-gold);
              font-family: var(--font-sans);
              margin-bottom: 1rem;
            }

            .item-controls {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .quantity-control {
              display: flex;
              align-items: center;
              border: 1px solid var(--text-muted);
              border-radius: 4px;
            }

            .quantity-control button {
              padding: 0.2rem 0.5rem;
              color: var(--text-light);
            }

            .quantity-control span {
              width: 30px;
              text-align: center;
              font-size: 0.9rem;
              color: var(--text-light);
            }

            .remove-btn {
              color: var(--text-muted);
              transition: color 0.2s;
            }

            .remove-btn:hover {
              color: #ff6b6b;
            }

            .cart-footer {
              padding: 2rem;
              background: var(--bg-dark-secondary);
              border-top: 1px solid rgba(255,255,255,0.1);
            }

            .cart-total {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 0.5rem;
              font-size: 1.2rem;
              color: var(--text-light);
            }

            .cart-total .amount {
              color: var(--accent-gold);
              font-weight: 600;
            }

            .shipping-note {
              color: var(--text-muted);
              font-size: 0.8rem;
              margin-bottom: 1.5rem;
            }

            .btn-block {
              display: block;
              width: 100%;
              text-align: center;
            }
            @media (max-width: 500px) {
              .cart-drawer { max-width: 100%; }
              .cart-header { padding: 1rem 1.5rem; }
              .cart-header h2 { font-size: 1.25rem; }
              .cart-items { padding: 1.25rem; }
              .cart-item { gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; }
              .item-image { width: 70px; height: 70px; }
              .item-details h3 { font-size: 1rem; }
              .item-price { font-size: 0.9rem; margin-bottom: 0.5rem; }
              .cart-footer { padding: 1.5rem; }
              .cart-total { font-size: 1.1rem; }
              .shipping-note { font-size: 0.75rem; }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartOverlay;
