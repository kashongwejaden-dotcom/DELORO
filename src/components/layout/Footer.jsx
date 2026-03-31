import React from 'react';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-col brand-col">
                        <h3 className="footer-logo">DEL'ORO</h3>
                        <p className="footer-desc">
                            Jewelry evoking exclusivity, purity, and confidence.
                            Timeless pieces crafted for the modern soul.
                        </p>
                        <div className="social-icons">
                            <Instagram size={20} />
                            <Facebook size={20} />
                            <Twitter size={20} />
                        </div>
                    </div>

                    {/* Links Column */}
                    <div className="footer-col">
                        <h4>Collections</h4>
                        <ul>
                            <li><a href="#">Or</a></li>
                            <li><a href="#">Argent</a></li>
                            <li><a href="#">Bagues</a></li>
                            <li><a href="#">Colliers</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Maison</h4>
                        <ul>
                            <li><a href="#">Notre Histoire</a></li>
                            <li><a href="#">Artisanat</a></li>
                            <li><a href="#">Boutiques</a></li>
                            <li><a href="#">Carrières</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="footer-col newsletter-col">
                        <h4>Newsletter</h4>
                        <p>Inscrivez-vous pour recevoir nos exclusivités.</p>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Votre email" />
                            <button aria-label="S'inscrire"><Mail size={18} /></button>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 DEL'ORO. Tous droits réservés.</p>
                    <div className="legal-links">
                        <a href="#">Mentions Légales</a>
                        <a href="#">Politique de Confidentialité</a>
                        <a href="#">CGV</a>
                    </div>
                </div>
            </div>

            <style>{`
        .footer {
          background-color: var(--bg-dark-secondary);
          color: var(--text-light);
          padding: 5rem 0 2rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          margin-bottom: 4rem;
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1.5fr;
          }
        }

        .footer-logo {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--accent-gold);
          margin-bottom: 1rem;
        }

        .footer-desc {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          max-width: 300px;
        }

        .social-icons {
          display: flex;
          gap: 1rem;
          color: var(--text-light);
        }
        
        .social-icons svg {
          cursor: pointer;
          transition: color 0.3s;
        }

        .social-icons svg:hover {
          color: var(--accent-gold);
        }

        .footer-col h4 {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1.5rem;
          color: var(--text-light);
        }

        .footer-col ul {
          list-style: none;
        }

        .footer-col li {
          margin-bottom: 0.8rem;
        }

        .footer-col a {
          color: var(--text-muted);
          font-size: 0.9rem;
          transition: color 0.3s;
        }

        .footer-col a:hover {
          color: var(--accent-gold);
        }

        .newsletter-form {
          display: flex;
          border-bottom: 1px solid var(--text-muted);
          padding-bottom: 0.5rem;
          margin-top: 1rem;
        }

        .newsletter-form input {
          background: none;
          border: none;
          color: var(--text-light);
          flex: 1;
          outline: none;
          font-family: var(--font-sans);
        }

        .newsletter-form button {
          color: var(--accent-gold);
        }

        .footer-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 2rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
          }
        }

        .legal-links {
          display: flex;
          gap: 1.5rem;
        }
      `}</style>
        </footer>
    );
};

export default Footer;
