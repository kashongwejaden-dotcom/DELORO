import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import api from '../../api/axios';

const SearchOverlay = () => {
  const { isSearchOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
      fetchProducts();
    }
    if (!isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products for search', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeSearch]);

  const filteredProducts = query
    ? products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    )
    : [];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          className="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="search-container">
            <div className="search-header">
              <button onClick={closeSearch} className="close-btn">
                <X size={32} />
              </button>
            </div>

            <div className="search-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                placeholder="Rechercher une pièce..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              {loading && query ? (
                <Loader2 className="search-icon-indicator spinner" size={24} />
              ) : (
                <SearchIcon className="search-icon-indicator" size={24} />
              )}
            </div>

            <div className="search-results">
              {query && filteredProducts.length === 0 && !loading && (
                <div className="no-results">
                  <p>Aucun résultat pour "{query}"</p>
                </div>
              )}

              {query && filteredProducts.length > 0 && (
                <div className="results-grid">
                  {filteredProducts.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={closeSearch}
                      className="search-result-item"
                    >
                      <div className="result-img-box">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="result-info">
                        <h4>{product.name}</h4>
                        <p>{product.price.toLocaleString()} $</p>
                      </div>
                      <ChevronRight className="arrow" size={20} />
                    </Link>
                  ))}
                </div>
              )}

              {!query && !loading && (
                <div className="search-suggestions">
                  <h3>Collections Populaires</h3>
                  <div className="tag-cloud">
                    <button onClick={() => setQuery('Bagues')}>Bagues</button>
                    <button onClick={() => setQuery('Bijoux')}>Bijoux</button>
                    <button onClick={() => setQuery('Chaînettes')}>Chaînettes</button>
                    <button onClick={() => setQuery('Accessoires')}>Accessoires</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <style>{`
            .search-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(5, 5, 5, 0.98);
              z-index: 3000;
              display: flex;
              flex-direction: column;
              backdrop-filter: blur(15px);
            }

            .search-container {
              width: 100%;
              max-width: 900px;
              margin: 0 auto;
              padding: 4rem 2rem;
              display: flex;
              flex-direction: column;
              height: 100%;
            }

            .search-header {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 2rem;
            }

            .close-btn {
              background: transparent;
              border: none;
              color: var(--text-muted);
              cursor: pointer;
              transition: color 0.3s;
            }
            .close-btn:hover { color: white; }

            .search-input-wrapper {
              position: relative;
              margin-bottom: 4rem;
              border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .search-input {
              width: 100%;
              background: transparent;
              border: none;
              font-family: var(--font-serif);
              font-size: 3rem;
              color: white;
              padding: 1.5rem 0;
              padding-right: 3rem;
              outline: none;
            }

            .search-input::placeholder {
              color: rgba(255,255,255,0.1);
            }

            .search-icon-indicator {
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              color: var(--accent-gold);
            }

            .spinner { animation: rotate 1s linear infinite; }
            @keyframes rotate { from { transform: translateY(-50%) rotate(0deg); } to { transform: translateY(-50%) rotate(360deg); } }

            .search-results {
              flex: 1;
              overflow-y: auto;
              padding-bottom: 4rem;
            }

            .search-result-item {
              display: flex;
              align-items: center;
              gap: 2rem;
              padding: 1.5rem;
              border-radius: 12px;
              border: 1px solid transparent;
              transition: all 0.3s;
              text-decoration: none;
            }

            .search-result-item:hover {
              background: rgba(255,255,255,0.03);
              border-color: rgba(255,255,255,0.05);
            }

            .result-img-box {
              width: 80px;
              height: 80px;
              background: white;
              border-radius: 8px;
              padding: 5px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .search-result-item img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }

            .result-info {
              flex: 1;
            }
            
            .result-info h4 {
              color: white;
              font-size: 1.25rem;
              margin-bottom: 0.4rem;
              font-family: var(--font-serif);
            }

            .result-info p {
              color: var(--accent-gold);
              font-weight: 600;
              font-size: 1.1rem;
            }

            .arrow {
              color: var(--text-muted);
              opacity: 0.5;
            }

            .search-suggestions h3 {
              color: var(--text-muted);
              text-transform: uppercase;
              font-size: 0.8rem;
              letter-spacing: 0.2em;
              margin-bottom: 2rem;
            }

            .tag-cloud {
              display: flex;
              gap: 1.2rem;
              flex-wrap: wrap;
            }

            .tag-cloud button {
              padding: 0.6rem 1.8rem;
              background: transparent;
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: 50px;
              color: var(--text-muted);
              cursor: pointer;
              transition: all 0.3s;
              font-size: 0.9rem;
            }

            .tag-cloud button:hover {
              border-color: var(--accent-gold);
              color: white;
              background: rgba(212, 175, 55, 0.05);
            }
            
            .no-results {
               color: var(--text-muted);
               text-align: center;
               padding: 4rem 0;
               font-size: 1.1rem;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
