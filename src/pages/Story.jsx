import React from 'react';
import { motion } from 'framer-motion';
import { Clock, History, Award, MapPin } from 'lucide-react';

const Story = () => {
    return (
        <div className="page-story">
            <div className="hero-section">
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Notre Histoire
                    </motion.h1>
                    <div className="accent-line"></div>
                </div>
            </div>

            <div className="container story-content">
                <section className="story-section">
                    <div className="story-image">
                        <div className="image-placeholder">
                            <Clock size={60} strokeWidth={1} />
                        </div>
                    </div>
                    <div className="story-text">
                        <h2>L'Art de la Mesure du Temps</h2>
                        <p>Depuis plus d'un siècle, DEL'ORO s'engage à repousser les limites de l'horlogerie de précision. Notre voyage a commencé dans un petit atelier niché au cœur des Alpes, où chaque rouage était façonné à la main avec une minutie obsessionnelle.</p>
                        <p>Aujourd'hui, nous perpétuons cet héritage d'excellence en mariant les techniques ancestrales aux technologies les plus avancées, créant des garde-temps qui sont plus que de simples instruments : ils sont les témoins de votre histoire.</p>
                    </div>
                </section>

                <div className="wisdom-break">
                    <blockquote>"Le temps est le luxe suprême. Nous nous contentons de l'encadrer."</blockquote>
                </div>

                <section className="story-grid">
                    <div className="grid-item">
                        <History size={32} />
                        <h3>Héritage</h3>
                        <p>Un savoir-faire transmis de génération en génération depuis 1924.</p>
                    </div>
                    <div className="grid-item">
                        <Award size={32} />
                        <h3>Qualité</h3>
                        <p>Une sélection rigoureuse des matériaux les plus nobles et des métaux précieux.</p>
                    </div>
                    <div className="grid-item">
                        <MapPin size={32} />
                        <h3>Localisation</h3>
                        <p>La quintessence du design italien alliée à la précision de l'ingénierie moderne.</p>
                    </div>
                </section>
            </div>

            <style>{`
        .page-story { padding-top: 0; background: #050505; color: white; }
        .hero-section { height: 60vh; background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080'); background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; text-align: center; }
        .hero-section h1 { font-family: var(--font-serif); font-size: 4rem; letter-spacing: 0.1em; text-transform: uppercase; }
        .accent-line { width: 60px; height: 2px; background: var(--accent-gold); margin: 1.5rem auto; }

        .story-content { padding: 100px 0; }
        .story-section { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; margin-bottom: 120px; }
        @media (max-width: 900px) { .story-section { grid-template-columns: 1fr; gap: 40px; } }

        .image-placeholder { height: 500px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; color: var(--accent-gold); position: relative; overflow: hidden; }
        .image-placeholder::after { content: ''; position: absolute; inset: 0; background: linear-gradient(45deg, transparent, rgba(212, 175, 55, 0.05)); }

        .story-text h2 { font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 2rem; color: var(--accent-gold); }
        .story-text p { color: var(--text-muted); line-height: 1.8; font-size: 1.1rem; margin-bottom: 1.5rem; }

        .wisdom-break { text-align: center; padding: 60px 0; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 100px; }
        .wisdom-break blockquote { font-family: var(--font-serif); font-size: 1.8rem; font-style: italic; color: var(--text-light); max-width: 800px; margin: 0 auto; }

        .story-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; text-align: center; }
        @media (max-width: 768px) { .story-grid { grid-template-columns: 1fr; } }
        .grid-item svg { color: var(--accent-gold); margin-bottom: 1.5rem; }
        .grid-item h3 { font-family: var(--font-serif); font-size: 1.4rem; margin-bottom: 1rem; }
        .grid-item p { color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; }
      `}</style>
        </div>
    );
};

export default Story;
