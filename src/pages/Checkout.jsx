import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft, Truck, User, ShoppingBag, Loader2, Phone, MapPin, Mail, CreditCard, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import GlassCard from '../components/ui/GlassCard';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');


  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    phone: '',
    address: '',
    zipCode: '',
    city: '',
  });

  // Sync user data when it becomes available
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: prev.email || user.email || '',
        name: prev.name || user.name || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      return addToast('Veuillez remplir tous les champs obligatoires.', 'error');
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems,
        total_amount: cartTotal,
        shipping_address: `${formData.address}, ${formData.zipCode} ${formData.city}`,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        userId: user?.id || null
      };

      await api.post('/orders', orderData);

      // Success
      clearCart();
      setStep(2);
      addToast('Votre commande a été enregistrée !', 'success');
    } catch (err) {
      console.error('Checkout error:', err);
      addToast(err.response?.data?.error || 'Erreur lors de la commande', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && step !== 2) {
    return (
      <div className="checkout-empty">
        <div className="container">
          <ShoppingBag size={64} className="empty-icon" />
          <h2>Votre panier est vide</h2>
          <p>Découvrez nos collections exclusives de joaillerie.</p>
          <Link to="/collections" className="btn-primary">Explorer la Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-checkout">
      <div className="container">
        <div className="checkout-header-mini">
          <Link to="/collections" className="back-link">
            <ArrowLeft size={16} />
            Retour aux achats
          </Link>
          <h1 className="header-logo">DEL'ORO</h1>
        </div>

        {step === 2 ? (
          <motion.div
            className="success-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="success-circle">
              <Check size={40} />
            </div>
            <h1>Paiement Approuvé</h1>
            <p>Merci pour votre commande. Votre paiement sécurisé a été validé avec succès. Vous recevrez un email de confirmation contenant votre facture sous peu.</p>
            <div className="success-actions">
              <Link to="/" className="btn-primary">Retour à l'accueil</Link>
            </div>
          </motion.div>
        ) : (
          <div className="checkout-layout">
            <div className="checkout-main">
              <motion.div className="checkout-box" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="checkout-title-row">
                  <h2>Validation</h2>
                  <span className="secure-badge">Paiement 100% Sécurisé</span>
                </div>
                <p className="subtitle">Vos données de livraison et de paiement sont chiffrées de bout en bout.</p>

                <form onSubmit={handleSubmitOrder} className="checkout-form">
                  {/* Delivery Info Section */}
                  <div className="form-section">
                    <h3 className="section-heading">1. Vos Coordonnées</h3>
                    <div className="input-field">
                      <label>Nom complet</label>
                      <div className="input-wrapper">
                        <User size={18} />
                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Jean Dupont" required />
                      </div>
                    </div>

                    <div className="input-grid">
                      <div className="input-field">
                        <label>E-mail</label>
                        <div className="input-wrapper">
                          <Mail size={18} />
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="jean@mail.com" required />
                        </div>
                      </div>
                      <div className="input-field">
                        <label>Téléphone</label>
                        <div className="input-wrapper">
                          <Phone size={18} />
                          <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+33 6 00 00 00 00" required />
                        </div>
                      </div>
                    </div>

                    <div className="input-field">
                      <label>Adresse de livraison</label>
                      <div className="input-wrapper">
                        <MapPin size={18} />
                        <input name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Rue de la Paix" required />
                      </div>
                    </div>

                    <div className="input-grid">
                      <div className="input-field">
                        <label>Code Postal</label>
                        <input name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="75000" required />
                      </div>
                      <div className="input-field">
                        <label>Ville</label>
                        <input name="city" value={formData.city} onChange={handleInputChange} placeholder="Paris" required />
                      </div>
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div className="form-section payment-section">
                    <h3 className="section-heading">2. Moyen de paiement</h3>
                    <div className="payment-methods">
                      <button
                        type="button"
                        className={`payment-btn ${paymentMethod === 'card' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <CreditCard size={20} />
                        <span>Carte Bancaire</span>
                      </button>
                      <button
                        type="button"
                        className={`payment-btn ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('paypal')}
                      >
                        <ExternalLink size={20} />
                        <span>PayPal</span>
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {paymentMethod === 'card' && (
                        <motion.div
                          key="card"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="payment-details card-details"
                        >
                          <div className="input-field">
                            <label>Numéro de carte</label>
                            <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" required={paymentMethod === 'card'} />
                          </div>
                          <div className="card-grid">
                            <div className="input-field">
                              <label>Date d'expiration</label>
                              <input type="text" placeholder="MM/YY" maxLength="5" required={paymentMethod === 'card'} />
                            </div>
                            <div className="input-field">
                              <label>CVV</label>
                              <input type="password" placeholder="•••" maxLength="4" required={paymentMethod === 'card'} />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === 'paypal' && (
                        <motion.div
                          key="paypal"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="payment-details paypal-details"
                        >
                          <p>Vous serez redirigé vers l'interface sécurisée PayPal pour finaliser votre paiement après avoir cliqué sur "Payer".</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary submit-btn"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="spinner" size={20} /> : `Payer ${cartTotal.toLocaleString()} $ en toute sécurité`}
                  </button>
                </form>
              </motion.div>
            </div>

            <aside className="checkout-sidebar">
              <GlassCard className="summary-card">
                <h3>Résumé du Panier</h3>
                <div className="summary-list">
                  {cartItems.map(item => (
                    <div key={item.id} className="summary-item">
                      <div className="item-img"><img src={item.image} alt={item.name} /></div>
                      <div className="item-info">
                        <p className="item-name">{item.name}</p>
                        <p className="item-qty">Qté: {item.quantity}</p>
                        <p className="item-price">{(item.price * item.quantity).toLocaleString()} $</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="summary-footer">
                  <div className="summary-row"><span>Sous-total</span><span>{cartTotal.toLocaleString()} $</span></div>
                  <div className="summary-row"><span>Livraison standard</span><span className="free">Gratuite</span></div>
                  <div className="summary-row total"><span>Total à payer</span><span>{cartTotal.toLocaleString()} $</span></div>
                </div>
              </GlassCard>
            </aside>
          </div>
        )}
      </div>

      <style>{`
                .page-checkout { padding-top: 40px; padding-bottom: 80px; min-height: 100vh; background: #050505; }
                .checkout-header-mini { display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px; }
                .header-logo { font-family: var(--font-serif); font-size: 1.8rem; letter-spacing: 0.2em; color: var(--accent-gold); }
                .back-link { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; }

                .checkout-layout { display: grid; grid-template-columns: 1fr 380px; gap: 60px; }
                @media (max-width: 1000px) { .checkout-layout { grid-template-columns: 1fr; } }

                .checkout-box { background: rgba(15,15,15,0.6); padding: 3rem; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; }
                .checkout-title-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
                .checkout-box h2 { font-family: var(--font-serif); color: white; font-size: 1.8rem; }
                .secure-badge { background: rgba(46, 204, 113, 0.1); color: #2ecc71; font-size: 0.7rem; text-transform: uppercase; padding: 4px 12px; border: 1px solid rgba(46, 204, 113, 0.3); border-radius: 50px; display: flex; align-items: center; gap: 0.3rem;}
                .subtitle { color: var(--text-muted); margin-bottom: 3rem; font-size: 0.95rem; }

                .checkout-form { display: flex; flex-direction: column; gap: 2rem; }
                .form-section { display: flex; flex-direction: column; gap: 1.5rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .section-heading { font-family: var(--font-serif); font-size: 1.3rem; color: var(--accent-gold); border-bottom: none; padding-bottom: 0; }
                .input-field { display: flex; flex-direction: column; gap: 0.5rem; }
                .input-field label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                
                .input-wrapper { position: relative; display: flex; align-items: center; }
                .input-wrapper svg { position: absolute; left: 1rem; color: var(--accent-gold); }
                .input-wrapper input { padding-left: 3rem !important; }

                .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                
                input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; color: white; border-radius: 4px; transition: border-color 0.3s; }
                input:focus { border-color: var(--accent-gold); outline: none; }

                .payment-section { border-bottom: none; padding-bottom: 0; }
                .payment-methods { display: flex; gap: 1rem; margin-bottom: 1rem; }
                .payment-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1.25rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; color: var(--text-muted); transition: all 0.3s ease; cursor: pointer; }
                .payment-btn:hover { background: rgba(255,255,255,0.05); }
                .payment-btn.selected { 
                    border-color: var(--accent-gold); 
                    background: rgba(212, 175, 55, 0.08); 
                    color: white; 
                    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.15);
                    transform: translateY(-2px);
                }
                .payment-btn svg { color: inherit; }
                .payment-btn.selected svg { color: var(--accent-gold); }

                .card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                
                .payment-details { overflow: hidden; padding-top: 0.5rem; }
                .card-details { display: flex; flex-direction: column; gap: 1.5rem; }
                .paypal-details p { color: var(--text-muted); font-size: 0.9rem; padding: 1rem; background: rgba(0, 112, 186, 0.05); border: 1px solid rgba(0, 112, 186, 0.2); border-left: 4px solid #0070ba; border-radius: 4px; }

                .submit-btn { padding: 1.25rem; font-size: 1.1rem; width: 100%; margin-top: 1rem; }

                .summary-card { padding: 2rem !important; position: sticky; top: 40px; }
                .summary-card h3 { font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 2rem; }
                .summary-list { display: flex; flex-direction: column; gap: 1.5rem; max-height: 400px; overflow-y: auto; margin-bottom: 2rem; }
                .summary-item { display: flex; gap: 1.2rem; align-items: center; }
                .item-img { width: 60px; height: 60px; background: white; border-radius: 4px; padding: 4px; }
                .item-img img { width: 100%; height: 100%; object-fit: contain; }
                .item-name { color: white; font-size: 0.9rem; margin-bottom: 4px; }
                .item-qty { color: var(--text-muted); font-size: 0.8rem; }
                .item-price { color: var(--accent-gold); font-size: 0.9rem; font-weight: 600; }

                .summary-footer { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
                .summary-row { display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.9rem; }
                .summary-row.total { font-size: 1.25rem; color: white; font-weight: 600; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 0.5rem; }
                .free { color: var(--accent-gold); }

                .success-view { text-align: center; padding: 100px 0; max-width: 550px; margin: 0 auto; }
                .success-circle { width: 80px; height: 80px; border-radius: 50%; background: var(--accent-gold); color: black; display: flex; align-items: center; justify-content: center; margin: 0 auto 2.5rem; }
                .success-view h1 { font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 1.5rem; }
                .success-view p { color: var(--text-muted); font-size: 1.1rem; line-height: 1.8; margin-bottom: 3rem; }

                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                .checkout-empty { padding: 15% 0; text-align: center; }
                .empty-icon { color: var(--accent-gold); margin-bottom: 2rem; opacity: 0.4; }
                .checkout-empty h2 { color: white; font-family: var(--font-serif); margin-bottom: 1rem; }
                .checkout-empty p { color: var(--text-muted); margin-bottom: 2.5rem; }
                @media (max-width: 768px) {
                    .page-checkout { padding-top: 20px; }
                    .checkout-header-mini { margin-bottom: 30px; padding-bottom: 15px; }
                    .header-logo { font-size: 1.4rem; }
                    .back-link { font-size: 0.7rem; }
                    
                    .checkout-box { padding: 1.5rem; }
                    .checkout-box h2 { font-size: 1.4rem; }
                    .checkout-title-row { flex-direction: column; gap: 0.5rem; }
                    .subtitle { margin-bottom: 2rem; font-size: 0.85rem; }
                    
                    .form-section { gap: 1rem; }
                    .input-wrapper input { padding-left: 2.5rem !important; }
                    input { padding: 0.75rem; font-size: 0.85rem; }
                    .input-field label { font-size: 0.75rem; }
                    .input-grid { gap: 0.75rem; }
                    
                    /* Enhanced Mobile Payment Styles */
                    .payment-methods { flex-direction: row; gap: 0.5rem; }
                    .payment-btn { flex-direction: column; justify-content: center; padding: 0.8rem 0.5rem; gap: 0.4rem; font-size: 0.8rem; text-align: center; }
                    .payment-btn svg { width: 22px; height: 22px; margin: 0; }
                    
                    .card-grid { gap: 0.75rem; }
                    .submit-btn { 
                        align-self: center;
                        width: 90%;
                        max-width: 320px;
                        padding: 0.85rem 1.5rem; 
                        font-size: 0.85rem; 
                        border-radius: 50px;
                        background: var(--gold-gradient);
                        background-size: 200% auto;
                        color: black;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        box-shadow: var(--gold-shadow);
                        border: none;
                        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                    }
                    .submit-btn:hover {
                        background-position: right center;
                        transform: translateY(-2px);
                        box-shadow: var(--gold-shadow-hover);
                    }
                    
                    .checkout-layout { gap: 30px; display: flex; flex-direction: column-reverse; }
                    .checkout-sidebar { position: static; }
                    .summary-card { padding: 1.5rem !important; }
                    
                    .success-view { padding: 60px 15px; }
                    .success-view h1 { font-size: 1.8rem; }
                    .success-view p { font-size: 0.95rem; }
                }
            `}</style>
    </div>
  );
};

export default Checkout;
