import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { useToast } from '../context/ToastContext';

const Contact = () => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            addToast('Message envoyé avec succès. Notre équipe vous contactera sous 24h.', 'success');
            e.target.reset();
        }, 1500);
    };

    return (
        <div className="page-contact">
            <div className="container">
                <header className="contact-header">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Contactez la Maison DEL'ORO
                    </motion.h1>
                    <p>Un conseiller est à votre disposition pour vous accompagner dans votre sélection.</p>
                </header>

                <div className="contact-layout">
                    <aside className="contact-info">
                        <GlassCard className="info-card">
                            <h3>Service Client</h3>
                            <div className="info-list">
                                <div className="info-item">
                                    <Phone size={20} />
                                    <div>
                                        <p className="label">Téléphone</p>
                                        <p className="value">+33 (0) 1 23 45 67 89</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <Mail size={20} />
                                    <div>
                                        <p className="label">E-mail</p>
                                        <p className="value">conciergerie@deloro.com</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <MapPin size={20} />
                                    <div>
                                        <p className="label">Siège Social</p>
                                        <p className="value">12 Place Vendôme, 75001 Paris</p>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="info-card schedule">
                            <h3>Horaires d'Ouverture</h3>
                            <div className="schedule-list">
                                <div className="schedule-item"><span>Lundi - Samedi</span> <span>10:00 - 19:00</span></div>
                                <div className="schedule-item"><span>Dimanche</span> <span>Fermé</span></div>
                            </div>
                            <div className="live-chat-link">
                                <MessageCircle size={18} />
                                <span>Démarrer un chat en direct</span>
                            </div>
                        </GlassCard>
                    </aside>

                    <main className="contact-form-container">
                        <GlassCard className="form-card">
                            <h2>Envoyez-nous un message</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="input-field">
                                        <label>Prénom & Nom</label>
                                        <input type="text" placeholder="Jean Dupont" required />
                                    </div>
                                    <div className="input-field">
                                        <label>E-mail</label>
                                        <input type="email" placeholder="jean@mail.com" required />
                                    </div>
                                </div>
                                <div className="input-field">
                                    <label>Sujet</label>
                                    <select required>
                                        <option value="">Sélectionnez un sujet</option>
                                        <option value="info">Informations Produit</option>
                                        <option value="order">Suivi de Commande</option>
                                        <option value="after-sales">Service Après-Vente</option>
                                        <option value="other">Autre demande</option>
                                    </select>
                                </div>
                                <div className="input-field">
                                    <label>Votre Message</label>
                                    <textarea rows="6" placeholder="Comment pouvons-nous vous aider ?" required></textarea>
                                </div>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Envoi...' : 'Envoyer le Message'} <Send size={18} />
                                </button>
                            </form>
                        </GlassCard>
                    </main>
                </div>
            </div>

            <style>{`
        .page-contact { padding: 120px 0 80px; background: #050505; min-height: 100vh; }
        .contact-header { text-align: center; margin-bottom: 60px; }
        .contact-header h1 { font-family: var(--font-serif); font-size: 3rem; color: white; margin-bottom: 1rem; }
        .contact-header p { color: var(--text-muted); font-size: 1.1rem; }

        .contact-layout { display: grid; grid-template-columns: 350px 1fr; gap: 40px; }
        @media (max-width: 900px) { .contact-layout { grid-template-columns: 1fr; } }

        .info-card { margin-bottom: 2rem; }
        .info-card h3 { font-family: var(--font-serif); color: var(--accent-gold); margin-bottom: 2rem; font-size: 1.2rem; }
        .info-list { display: flex; flex-direction: column; gap: 2rem; }
        .info-item { display: flex; gap: 1.2rem; align-items: flex-start; }
        .info-item svg { color: var(--accent-gold); margin-top: 4px; }
        .info-item .label { font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 2px; }
        .info-item .value { color: white; font-weight: 500; }

        .schedule-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
        .schedule-item { display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.9rem; }

        .live-chat-link { display: flex; align-items: center; gap: 10px; color: var(--accent-gold); font-weight: 600; cursor: pointer; border-top: 1px solid rgba(255,255,255,0.05); pt: 1.5rem; }

        .form-card { padding: 3rem !important; }
        .form-card h2 { font-family: var(--font-serif); font-size: 2rem; margin-bottom: 2.5rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }

        .input-field { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }
        .input-field label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; }
        
        input, select, textarea { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 1rem; color: white; border-radius: 4px; }
        input:focus, select:focus, textarea:focus { border-color: var(--accent-gold); outline: none; }
        
        .btn-primary { width: 100%; padding: 1.2rem; display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 1rem; border: none; cursor: pointer; transition: all 0.3s; }
        .btn-primary:active { transform: scale(0.98); }
      `}</style>
        </div>
    );
};

export default Contact;
