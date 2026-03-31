import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Search, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard';
import { useToast } from '../../context/ToastContext';

const emptyProduct = { name: '', price: '', category: '', description: '', image: '', stock: '', is_featured: false };

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formProduct, setFormProduct] = useState(emptyProduct);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { addToast } = useToast();

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/admin/products');
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch products', err);
            addToast('Impossible de charger les produits', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setFormProduct(emptyProduct);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setFormProduct({
            name: product.name || '',
            price: product.price || '',
            category: product.category || '',
            description: product.description || '',
            image: product.image || '',
            stock: product.stock || '',
            is_featured: !!product.is_featured,
        });
        setEditingId(product.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormProduct(emptyProduct);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/admin/products/${editingId}`, formProduct);
                addToast('Produit mis à jour', 'success');
            } else {
                await api.post('/admin/products', formProduct);
                addToast('Produit créé avec succès', 'success');
            }
            fetchProducts();
            closeModal();
        } catch (err) {
            console.error('Error saving product', err);
            addToast('Erreur lors de l\'enregistrement', 'error');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Supprimer ce produit définitivement ?')) {
            try {
                await api.delete(`/admin/products/${id}`);
                setProducts(products.filter(p => p.id !== id));
                addToast('Produit supprimé', 'success');
            } catch (err) {
                console.error('Error deleting product', err);
                addToast('Erreur lors de la suppression', 'error');
            }
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormProduct(prev => ({ ...prev, image: res.data.imageUrl }));
            addToast('Image uploadée', 'success');
        } catch (err) {
            console.error('Upload failed', err);
            addToast('Échec de l\'upload image', 'error');
        } finally {
            setUploading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) return (
        <div className="loading-state">
            <div className="loading-spinner" />
            <span>Chargement des produits…</span>
        </div>
    );

    return (
        <div className="admin-page">
            <header className="page-header">
                <div>
                    <h1>Produits</h1>
                    <p className="text-muted">{products.length} article{products.length !== 1 ? 's' : ''} en catalogue</p>
                </div>
                <div className="actions">
                    <div className="search-bar">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary" onClick={openAddModal}>
                        <Plus size={18} />
                        <span>Ajouter</span>
                    </button>
                    <Link
                        to="/collections"
                        className="btn-view-shop"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span>Voir la boutique</span>
                    </Link>
                </div>
            </header>

            {filteredProducts.length === 0 ? (
                <div className="empty-state">
                    <p>Aucun produit trouvé.</p>
                    <button className="btn-primary" onClick={openAddModal} style={{ marginTop: '1rem' }}>
                        <Plus size={18} /> Ajouter un produit
                    </button>
                </div>
            ) : (
                <motion.div
                    className="products-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredProducts.map(product => (
                        <motion.div key={product.id} variants={itemVariants}>
                            <GlassCard className="product-card" hoverEffect={true}>
                                <div className="product-image">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} />
                                    ) : (
                                        <div className="no-img-placeholder">Pas d'image</div>
                                    )}
                                    <div className="overlay-actions">
                                        <button onClick={() => handleDeleteProduct(product.id)} className="action-btn delete" title="Supprimer">
                                            <Trash2 size={16} />
                                        </button>
                                        <button onClick={() => openEditModal(product)} className="action-btn edit" title="Modifier">
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                    {product.is_featured ? (
                                        <span className="featured-badge">Vedette</span>
                                    ) : null}
                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <div className="meta-row">
                                        <span className="price">{product.price} $</span>
                                        <span className={`stock-badge ${product.stock > 0 ? 'in' : 'out'}`}>
                                            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                                        </span>
                                    </div>
                                    {product.category && (
                                        <span className="category-tag">{product.category}</span>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Add / Edit Product Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => e.target === e.currentTarget && closeModal()}
                    >
                        <motion.div
                            className="modal-content glass-panel"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        >
                            <div className="modal-header">
                                <h2>{editingId ? 'Modifier le produit' : 'Nouveau produit'}</h2>
                                <button onClick={closeModal} className="close-btn">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleProductSubmit} className="product-form">
                                <div className="form-group">
                                    <label>Nom du produit *</label>
                                    <input
                                        placeholder="ex: Bague Solitaire Or 18k"
                                        value={formProduct.name}
                                        onChange={e => setFormProduct({ ...formProduct, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Prix ($) *</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formProduct.price}
                                            onChange={e => setFormProduct({ ...formProduct, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Stock</label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={formProduct.stock}
                                            onChange={e => setFormProduct({ ...formProduct, stock: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Catégorie</label>
                                    <select
                                        value={formProduct.category}
                                        onChange={e => setFormProduct({ ...formProduct, category: e.target.value })}
                                    >
                                        <option value="">Sélectionner une catégorie</option>
                                        <option value="Bagues">Bagues</option>
                                        <option value="Bijoux">Bijoux</option>
                                        <option value="Chaînettes">Chaînettes</option>
                                        <option value="Accessoires">Accessoires</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Image du produit</label>
                                    <div className="image-upload-area">
                                        <div className="upload-input-row">
                                            <label className="upload-btn" style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
                                                {uploading ? 'Envoi en cours…' : '📁 Choisir une image'}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    style={{ display: 'none' }}
                                                    disabled={uploading}
                                                />
                                            </label>
                                            {formProduct.image && (
                                                <button
                                                    type="button"
                                                    className="remove-img-btn"
                                                    onClick={() => setFormProduct({ ...formProduct, image: '' })}
                                                >
                                                    <X size={14} /> Retirer
                                                </button>
                                            )}
                                        </div>
                                        {formProduct.image && (
                                            <div className="image-preview">
                                                <img src={formProduct.image} alt="Prévisualisation" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        placeholder="Décrivez ce produit…"
                                        value={formProduct.description}
                                        onChange={e => setFormProduct({ ...formProduct, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                                <div className="form-group featured-toggle">
                                    <label>Produit en vedette</label>
                                    <button
                                        type="button"
                                        className={`toggle-btn ${formProduct.is_featured ? 'active' : ''}`}
                                        onClick={() => setFormProduct({ ...formProduct, is_featured: !formProduct.is_featured })}
                                    >
                                        {formProduct.is_featured
                                            ? <><ToggleRight size={22} /> Oui — affiché en page d'accueil</>
                                            : <><ToggleLeft size={22} /> Non</>
                                        }
                                    </button>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-cancel" onClick={closeModal}>Annuler</button>
                                    <button type="submit" className="btn-primary">
                                        {editingId ? 'Mettre à jour' : 'Créer le produit'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .loading-state {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    color: var(--text-muted);
                    padding: 4rem;
                }

                .loading-spinner {
                    width: 30px;
                    height: 30px;
                    border: 2px solid rgba(212,175,55,0.2);
                    border-top-color: var(--accent-gold);
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .page-header h1 { font-size: 1.8rem; }
                .text-muted { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem; }

                .actions {
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .search-bar {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50px;
                    padding: 0.5rem 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    min-width: 220px;
                }

                .search-bar input {
                    background: transparent;
                    border: none;
                    color: white;
                    width: 100%;
                    font-size: 0.9rem;
                }
                .search-bar input:focus { outline: none; }

                .btn-view-shop {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.55rem 1.1rem;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 50px;
                    color: white;
                    text-decoration: none;
                    font-size: 0.85rem;
                    transition: background 0.2s;
                }
                .btn-view-shop:hover { background: rgba(255,255,255,0.14); }

                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 1.5rem;
                }

                .empty-state {
                    text-align: center;
                    color: var(--text-muted);
                    padding: 4rem 2rem;
                    border: 1px dashed rgba(255,255,255,0.1);
                    border-radius: 12px;
                }

                .product-image {
                    height: 200px;
                    border-radius: 10px;
                    overflow: hidden;
                    position: relative;
                    margin-bottom: 1rem;
                    background: rgba(255,255,255,0.03);
                }

                .product-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.4s ease;
                }

                .product-card:hover .product-image img {
                    transform: scale(1.05);
                }

                .no-img-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                }

                .overlay-actions {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.75rem;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .product-card:hover .overlay-actions { opacity: 1; }

                .action-btn {
                    background: rgba(255,255,255,0.95);
                    color: #111;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                }
                .action-btn:hover { transform: scale(1.12); }
                .action-btn.delete { color: #e53e3e; }
                .action-btn.edit { color: #2b6cb0; }

                .featured-badge {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: var(--accent-gold);
                    color: #111;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    padding: 2px 8px;
                    border-radius: 4px;
                }

                .product-info h3 {
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .meta-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }

                .price {
                    color: var(--accent-gold);
                    font-weight: 600;
                    font-size: 1.05rem;
                }

                .stock-badge {
                    font-size: 0.75rem;
                    padding: 0.2rem 0.6rem;
                    border-radius: 4px;
                    background: rgba(255,255,255,0.08);
                }
                .stock-badge.out { color: #fc8181; background: rgba(252,129,129,0.1); }
                .stock-badge.in { color: #68d391; background: rgba(104,211,145,0.1); }

                .category-tag {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.07em;
                }

                /* Modal */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.75);
                    backdrop-filter: blur(4px);
                    z-index: 1000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 1rem;
                }

                .modal-content {
                    width: 520px;
                    max-width: 100%;
                    max-height: 92vh;
                    overflow-y: auto;
                    background: #1a1a1a;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 16px;
                    padding: 2rem;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(212,175,55,0.3) transparent;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    padding-bottom: 1rem;
                }

                .modal-header h2 { font-size: 1.3rem; }

                .close-btn {
                    background: transparent;
                    color: var(--text-muted);
                    cursor: pointer;
                    border-radius: 50%;
                    width: 36px; height: 36px;
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.2s, color 0.2s;
                }
                .close-btn:hover { background: rgba(255,255,255,0.08); color: white; }

                .form-group { margin-bottom: 1.25rem; }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                label {
                    display: block;
                    margin-bottom: 0.4rem;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }

                input, select, textarea {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    color: white;
                    font-family: var(--font-sans);
                    font-size: 0.95rem;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                }

                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: var(--accent-gold);
                    box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
                }

                select option { background: #222; }

                /* Image Upload */
                .image-upload-area { display: flex; flex-direction: column; gap: 0.75rem; }

                .upload-input-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .upload-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 1.2rem;
                    background: rgba(212,175,55,0.1);
                    border: 1px solid rgba(212,175,55,0.3);
                    border-radius: 8px;
                    color: var(--accent-gold);
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: background 0.2s;
                    text-transform: none;
                    letter-spacing: 0;
                }
                .upload-btn:hover { background: rgba(212,175,55,0.2); }

                .remove-img-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    color: #fc8181;
                    font-size: 0.8rem;
                    background: rgba(252,129,129,0.1);
                    border: 1px solid rgba(252,129,129,0.2);
                    padding: 0.4rem 0.8rem;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .remove-img-btn:hover { background: rgba(252,129,129,0.2); }

                .image-preview {
                    width: 100px;
                    height: 100px;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.15);
                }
                .image-preview img { width: 100%; height: 100%; object-fit: cover; }

                /* Featured toggle */
                .featured-toggle label { margin-bottom: 0.5rem; }

                .toggle-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 1rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    color: var(--text-muted);
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                    width: 100%;
                    text-align: left;
                    font-family: var(--font-sans);
                }
                .toggle-btn.active {
                    background: rgba(212,175,55,0.12);
                    border-color: rgba(212,175,55,0.4);
                    color: var(--accent-gold);
                }

                .form-actions {
                    display: flex;
                    gap: 0.75rem;
                    justify-content: flex-end;
                    margin-top: 1.5rem;
                    padding-top: 1.25rem;
                    border-top: 1px solid rgba(255,255,255,0.08);
                }

                .btn-cancel {
                    padding: 0.65rem 1.5rem;
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.15);
                    color: var(--text-muted);
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: border-color 0.2s, color 0.2s;
                    font-family: var(--font-sans);
                }
                .btn-cancel:hover { border-color: rgba(255,255,255,0.3); color: white; }

                @media (max-width: 768px) {
                    .products-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 0.5rem;
                    }

                    .product-card {
                        padding: 0.75rem;
                    }

                    .product-image {
                        height: 120px;
                        margin-bottom: 0.75rem;
                    }

                    .product-info h3 {
                        font-size: 0.85rem;
                        margin-bottom: 0.3rem;
                    }

                    .meta-row {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.25rem;
                    }

                    .price {
                        font-size: 0.9rem;
                    }

                    .stock-badge, .category-tag, .featured-badge {
                        font-size: 0.65rem;
                        padding: 0.15rem 0.4rem;
                    }

                    .action-btn {
                        width: 32px;
                        height: 32px;
                    }

                    .action-btn svg {
                        width: 14px;
                        height: 14px;
                    }

                    .page-header h1 {
                        font-size: 1.4rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Products;
