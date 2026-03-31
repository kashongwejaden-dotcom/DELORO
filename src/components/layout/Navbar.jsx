import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context/SearchContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, cartCount } = useCart();
  const { openSearch } = useSearch();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'Notre Histoire', path: '/story' },
    { name: 'Magazine', path: '/magazine' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-content">
        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
        </button>

        {/* Logo */}
        <Link to="/" className="logo">
          DEL'ORO
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="nav-link">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="nav-actions">
          <button className="icon-btn" onClick={openSearch}>
            <Search size={20} color="white" />
          </button>
          <button className="icon-btn cart-btn" onClick={toggleCart}>
            <ShoppingBag size={20} color="white" />
            <span className="cart-count">{cartCount}</span>
          </button>

          {user ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {user.role === 'admin' && (
                <Link to="/admin" className="icon-btn" title="Admin Dashboard">
                  <User size={20} color="#D4AF37" />
                  <span style={{ marginLeft: '5px', fontSize: '0.8rem', fontWeight: 'bold', color: '#D4AF37' }}>DASHBOARD</span>
                </Link>
              )}
              <button className="icon-btn" onClick={handleLogout} title="Logout">
                <LogOut size={20} color="white" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="icon-btn" title="Login">
              <User size={20} color="white" />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
           {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          {user && (
            <div className="mobile-auth-section">
              <div className="mobile-separator" />
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="mobile-nav-link admin-link" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={20} /> Dashboard Admin
                </Link>
              )}
              <button className="mobile-logout-btn" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                <LogOut size={20} /> Se déconnecter
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 1.5rem 0;
          transition: all var(--transition-fast);
          background: transparent;
        }

        .navbar.scrolled {
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .navbar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--text-light);
          text-transform: uppercase;
        }

        .desktop-nav {
          display: none;
        }

        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
            gap: 2rem;
          }
        }

        .nav-link {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          color: var(--text-light);
          opacity: 0.8;
          transition: opacity var(--transition-fast);
        }

        .nav-link:hover {
          opacity: 1;
          color: var(--accent-gold);
        }

        .nav-actions {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .icon-btn {
          opacity: 0.9;
          transition: transform var(--transition-fast);
        }

        .icon-btn:hover {
          transform: scale(1.1);
          opacity: 1;
        }

        .cart-btn {
          position: relative;
        }

        .cart-count {
          position: absolute;
          top: -5px;
          right: -8px;
          background: var(--accent-gold);
          color: var(--bg-dark);
          font-size: 0.7rem;
          font-weight: bold;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu-btn {
          display: block;
        }

        @media (min-width: 768px) {
          .mobile-menu-btn {
            display: none;
          }
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: var(--bg-dark);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        @media (max-width: 768px) {
          .nav-actions {
            gap: 1rem;
          }

          .logo {
            font-size: 1.3rem; /* Make logo font smaller to save space */
          }

          .icon-btn svg, .mobile-menu-btn svg {
            width: 22px;
            height: 22px;
          }

          .navbar-content {
            padding: 0 0.5rem;
          }
        }
        
        .mobile-nav-link {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--text-light);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-link {
          color: var(--accent-gold);
        }

        .mobile-auth-section {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .mobile-separator {
          height: 1px;
          background: rgba(255,255,255,0.1);
          width: 100%;
        }

        .mobile-logout-btn {
          background: transparent;
          border: none;
          color: #ff6b6b;
          font-family: var(--font-serif);
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0;
          text-align: left;
        }

        @media (max-width: 768px) {
          .nav-actions .icon-btn span {
            display: none; /* Hide 'DASHBOARD' text in top icons on small screens */
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
