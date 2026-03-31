import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, Share2, ArrowRight } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';

const Magazine = () => {
    const articles = [
        {
            id: 1,
            category: "HORLOGERIE",
            title: "La Renaissance du Tourbillon",
            excerpt: "Découvrez comment cette complication séculaire redevient le summum de l'exigence moderne.",
            date: "23 Février 2026"
        },
        {
            id: 2,
            category: "DESIGN",
            title: "L'Or Éthique : Un Nouveau Standard",
            excerpt: "Plongée au cœur de notre chaîne d'approvisionnement responsable et de nos engagements durables.",
            date: "15 Février 2026"
        },
        {
            id: 3,
            category: "ÉVÉNEMENTS",
            title: "Soirée de Gala à Monte-Carlo",
            excerpt: "Retour sur le lancement exclusif de notre collection Heritage dans la principauté.",
            date: "02 Février 2026"
        }
    ];

    return (
        <div className="page-magazine">
            <div className="container">
                <header className="magazine-header">
                    <BookOpen size={48} className="header-icon" />
                    <h1>DEL'ORO Magazine</h1>
                    <p>Le journal de l'excellence, du style et de la précision.</p>
                </header>

                <div className="featured-article">
                    <div className="featured-overlay">
                        <span className="badge">À LA UNE</span>
                        <h2>L'Élégance de l'Invisible</h2>
                        <p>Un regard approfondi sur la conception de nos cadrans à squelette apparent.</p>
                        <button className="read-more">Lire l'article <ArrowRight size={16} /></button>
                    </div>
                </div>

                <div className="articles-grid">
                    {articles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className="article-card">
                                <div className="article-img-placeholder">
                                    <Star size={32} />
                                </div>
                                <div className="article-meta">
                                    <span className="cat">{article.category}</span>
                                    <span className="date">{article.date}</span>
                                </div>
                                <h3>{article.title}</h3>
                                <p>{article.excerpt}</p>
                                <div className="article-footer">
                                    <button className="btn-text">Continuer la lecture</button>
                                    <Share2 size={16} className="share-icon" />
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style>{`
        .page-magazine { padding: 120px 0 80px; background: #080808; min-height: 100vh; }
        .magazine-header { text-align: center; margin-bottom: 80px; }
        .header-icon { color: var(--accent-gold); margin-bottom: 2rem; opacity: 0.6; }
        .magazine-header h1 { font-family: var(--font-serif); font-size: 3rem; color: white; margin-bottom: 1rem; letter-spacing: 0.05em; }
        .magazine-header p { color: var(--text-muted); font-size: 1.2rem; }

        .featured-article { height: 500px; background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1547996160-81dfa63595ec?q=80&w=1974'); background-size: cover; background-position: center; border-radius: 12px; margin-bottom: 80px; display: flex; align-items: flex-end; padding: 4rem; position: relative; border: 1px solid rgba(255,255,255,0.05); }
        .featured-overlay { max-width: 600px; }
        .badge { display: inline-block; background: var(--accent-gold); color: black; font-size: 0.7rem; font-weight: 700; padding: 4px 12px; border-radius: 4px; margin-bottom: 1.5rem; letter-spacing: 0.1em; }
        .featured-overlay h2 { font-family: var(--font-serif); font-size: 3rem; color: white; margin-bottom: 1.5rem; }
        .featured-overlay p { color: #ccc; font-size: 1.1rem; margin-bottom: 2.5rem; line-height: 1.6; }
        .read-more { background: transparent; border: 1px solid var(--accent-gold); color: var(--accent-gold); padding: 12px 24px; border-radius: 4px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.3s; }
        .read-more:hover { background: var(--accent-gold); color: black; }

        .articles-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }
        .article-card { height: 100%; display: flex; flex-direction: column; padding: 0 !important; overflow: hidden; }
        .article-img-placeholder { height: 200px; background: rgba(255,255,255,0.02); display: flex; align-items: center; justify-content: center; color: rgba(212, 175, 55, 0.2); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .article-meta { padding: 1.5rem 1.5rem 0.5rem; display: flex; justify-content: space-between; align-items: center; }
        . cat { font-size: 0.7rem; color: var(--accent-gold); font-weight: 700; letter-spacing: 0.1em; }
        .date { font-size: 0.75rem; color: var(--text-muted); }
        .article-card h3 { padding: 0 1.5rem; font-family: var(--font-serif); font-size: 1.5rem; color: white; margin: 1rem 0; }
        .article-card p { padding: 0 1.5rem; color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; flex: 1; }
        .article-footer { padding: 2rem 1.5rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }
        .btn-text { background: transparent; border: none; color: var(--accent-gold); font-weight: 600; cursor: pointer; padding: 0; }
        .share-icon { color: var(--text-muted); cursor: pointer; transition: color 0.3s; }
        .share-icon:hover { color: white; }
      `}</style>
        </div>
    );
};

export default Magazine;
