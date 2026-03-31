import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, CheckCircle, Clock, Truck, Package, XCircle, Filter, Search, ChevronRight, Phone, Mail, MapPin, User } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import { useToast } from '../../context/ToastContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/orders');
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to fetch orders', err);
            addToast('Erreur lors du chargement des commandes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/admin/orders/${id}/status`, { status: newStatus });
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
            addToast(`Commande #${id} mise à jour : ${newStatus}`, 'success');
        } catch (err) {
            console.error('Update failed', err);
            addToast('Échec de la mise à jour du statut', 'error');
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return <CheckCircle size={14} />;
            case 'shipped': return <Truck size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    const filteredOrders = orders.filter(o => {
        const name = o.customer_name || o.user_name || 'Invité';
        const matchesFilter = filter === 'all' || o.status.toLowerCase() === filter;
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.id.toString().includes(searchTerm) ||
            (o.customer_email || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return (
        <div className="admin-loading">
            <div className="spinner" />
            <p>Chargement des commandes...</p>
        </div>
    );

    return (
        <div className="admin-page">
            <header className="page-header">
                <div>
                    <h1>Commandes</h1>
                    <p className="text-muted">Gérez les livraisons et les paiements à la réception</p>
                </div>

                <div className="header-actions">
                    <div className="search-bar">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher par ID, client ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="filter-shelf">
                <div className="filter-group">
                    <Filter size={16} />
                    {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`filter-tab ${filter === tab ? 'active' : ''}`}
                        >
                            {tab === 'all' ? 'Toutes' : tab === 'pending' ? 'En attente' : tab === 'shipped' ? 'Expédié' : tab === 'delivered' ? 'Livré' : tab === 'cancelled' ? 'Annulé' : tab}
                        </button>
                    ))}
                </div>
            </div>

            <GlassCard className="table-container">
                <div className="table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Référence</th>
                                <th>Client & Contact</th>
                                <th>Date</th>
                                <th>Statut</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-row">Aucune commande trouvée.</td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onClick={() => setSelectedOrder(order)}
                                        className="clickable-row"
                                    >
                                        <td className="id-cell">#{order.id.toString().padStart(6, '0')}</td>
                                        <td>
                                            <div className="user-cell">
                                                <div className="avatar-mini">
                                                    {(order.customer_name || order.user_name || 'I')[0].toUpperCase()}
                                                </div>
                                                <div className="user-info">
                                                    <span className="user-name">{order.customer_name || order.user_name || 'Invité'}</span>
                                                    <div className="contact-mini">
                                                        <span><Phone size={10} /> {order.customer_phone || 'N/A'}</span>
                                                        <span><Mail size={10} /> {order.customer_email || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="date-cell">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-pill ${order.status.toLowerCase()}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status === 'pending' ? 'En attente' : order.status === 'processing' ? 'En cours' : order.status === 'shipped' ? 'Expédié' : order.status === 'delivered' ? 'Livré' : order.status === 'cancelled' ? 'Annulé' : order.status}
                                            </span>
                                        </td>
                                        <td className="amount-cell">{order.total_amount.toLocaleString()} $</td>
                                        <td>
                                            <div className="order-actions" onClick={e => e.stopPropagation()}>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    className="status-selector"
                                                >
                                                    <option value="pending">En attente</option>
                                                    <option value="shipped">Expédié</option>
                                                    <option value="delivered">Livré</option>
                                                    <option value="cancelled">Annulé</option>
                                                </select>
                                                <button 
                                                    className="view-details-btn" 
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Quick View Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                        <motion.div
                            className="order-detail-modal"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2>Détails Commande #{selectedOrder.id.toString().padStart(6, '0')}</h2>
                                <button className="close-modal" onClick={() => setSelectedOrder(null)}>&times;</button>
                            </div>

                            <div className="modal-content">
                                <div className="detail-section">
                                    <h3><User size={16} /> Coordonnées du Client</h3>
                                    <div className="info-grid">
                                        <div className="info-item"><label>Nom</label><p>{selectedOrder.customer_name || selectedOrder.user_name || 'Invité'}</p></div>
                                        <div className="info-item"><label>Téléphone</label><p className="highlight-text">{selectedOrder.customer_phone || 'N/A'}</p></div>
                                        <div className="info-item"><label>Email</label><p>{selectedOrder.customer_email || 'N/A'}</p></div>
                                        <div className="info-item full-width"><label>Adresse de livraison</label><p className="address-text"><MapPin size={14} /> {selectedOrder.shipping_address}</p></div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h3><Package size={16} /> Résumé financier</h3>
                                    <div className="financial-row">
                                        <span>Total à percevoir à la livraison:</span>
                                        <span className="total-amount">{selectedOrder.total_amount.toLocaleString()} $</span>
                                    </div>
                                    <div className="payment-method-tag">Paiement à la livraison (COD)</div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                {selectedOrder.status === 'pending' && (
                                    <button className="btn-primary" onClick={() => {
                                        handleStatusUpdate(selectedOrder.id, 'shipped');
                                        setSelectedOrder(null);
                                    }}>Marquer comme expédié</button>
                                )}
                                
                                {selectedOrder.status === 'shipped' && (
                                    <button className="btn-primary" onClick={() => {
                                        handleStatusUpdate(selectedOrder.id, 'delivered');
                                        setSelectedOrder(null);
                                    }}>Marquer comme livré</button>
                                )}

                                <button className="btn-outline" onClick={() => setSelectedOrder(null)}>Fermer</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .admin-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8rem 0; color: var(--text-muted); }
                .spinner { width: 40px; height: 40px; border: 2px solid rgba(212, 175, 55, 0.2); border-top-color: var(--accent-gold); border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1rem; }
                @keyframes spin { to { transform: rotate(360deg); } }

                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .search-bar { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 50px; padding: 0.6rem 1.2rem; display: flex; align-items: center; gap: 0.8rem; width: 320px; }
                .search-bar input { background: transparent; border: none; color: white; width: 100%; font-size: 0.9rem; }
                .search-bar input:focus { outline: none; }

                .filter-shelf { margin-bottom: 2rem; display: flex; justify-content: flex-start; }
                .filter-group { display: flex; align-items: center; gap: 1.5rem; background: rgba(255, 255, 255, 0.03); padding: 0.5rem 1.5rem; border-radius: 50px; border: 1px solid rgba(255, 255, 255, 0.05); color: var(--text-muted); }
                .filter-tab { font-size: 0.85rem; color: var(--text-muted); transition: all 0.3s; position: relative; padding: 0.2rem 0; cursor: pointer; }
                .filter-tab:hover { color: white; }
                .filter-tab.active { color: var(--accent-gold); font-weight: 600; }

                .table-container { padding: 0 !important; overflow: hidden; }
                .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
                .admin-table th { padding: 1.2rem 1.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
                .admin-table td { padding: 1.2rem 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.03); vertical-align: middle; }
                .clickable-row { cursor: pointer; transition: background 0.2s; }
                .clickable-row:hover td { background: rgba(255, 255, 255, 0.03); }

                .user-cell { display: flex; align-items: center; gap: 1rem; }
                .avatar-mini { width: 32px; height: 32px; background: var(--accent-gold); color: black; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; }
                .user-info { display: flex; flex-direction: column; gap: 2px; }
                .user-name { font-weight: 500; color: white; }
                .contact-mini { display: flex; gap: 10px; font-size: 0.7rem; color: var(--text-muted); }
                .contact-mini span { display: flex; align-items: center; gap: 4px; }

                .status-pill { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.3rem 0.8rem; border-radius: 50px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
                .status-pill.pending { background: rgba(212, 175, 55, 0.1); color: var(--accent-gold); }
                .status-pill.shipped { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
                .status-pill.delivered { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .status-pill.cancelled { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

                .amount-cell { font-weight: 600; color: var(--accent-gold); }
                .order-actions { display: flex; align-items: center; gap: 0.5rem; }
                .status-selector { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; cursor: pointer; }

                /* Modal */
                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 20px; }
                .order-detail-modal { 
                    background: #0f0f0f; 
                    border: 1px solid var(--accent-gold); 
                    width: 100%; 
                    max-width: 600px; 
                    max-height: 90vh; /* Allow it to fit in the screen */
                    display: flex;
                    flex-direction: column;
                    border-radius: 12px; 
                    overflow: hidden; 
                    box-shadow: 0 25px 50px rgba(0,0,0,0.5); 
                }
                .modal-header { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
                .modal-header h2 { font-family: var(--font-serif); font-size: 1.25rem; color: var(--accent-gold); }
                .close-modal { font-size: 1.5rem; color: var(--text-muted); cursor: pointer; background: transparent; border: none; }

                .modal-content { 
                    padding: 2rem; 
                    display: flex; 
                    flex-direction: column; 
                    gap: 2rem; 
                    overflow-y: auto; /* Allow middle content to scroll */
                    overscroll-behavior: contain;
                }
                .detail-section h3 { font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .info-item label { font-size: 0.7rem; color: var(--text-muted); display: block; margin-bottom: 4px; }
                .info-item p { color: white; font-weight: 500; }
                .highlight-text { color: var(--accent-gold) !important; font-size: 1.1rem; }
                .address-text { color: #ccc !important; font-size: 0.9rem; line-height: 1.4; display: flex; align-items: flex-start; gap: 8px; padding-top: 4px; }
                .full-width { grid-column: 1 / -1; }

                .financial-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px; }
                .total-amount { font-size: 1.5rem; font-weight: 700; color: var(--accent-gold); }
                .payment-method-tag { margin-top: 10px; font-size: 0.7rem; color: var(--text-muted); text-align: right; }

                .modal-footer { 
                    padding: 1.5rem 2rem; 
                    background: rgba(0,0,0,0.3); 
                    border-top: 1px solid rgba(255,255,255,0.05); 
                    display: flex; 
                    justify-content: flex-start; /* works with row-reverse */
                    flex-direction: row-reverse;
                    gap: 1rem; 
                }
                
                .modal-footer .btn-primary {
                    background: var(--gold-gradient);
                    background-size: 200% auto;
                    color: #000;
                    border: none;
                    border-radius: 8px;
                    padding: 0.8rem 1.8rem;
                    font-weight: 700;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                    box-shadow: var(--gold-shadow);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .modal-footer .btn-primary:hover {
                    background-position: right center;
                    transform: translateY(-2px);
                    box-shadow: var(--gold-shadow-hover);
                }

                .modal-footer .btn-outline {
                    background: transparent;
                    color: var(--text-muted);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 8px;
                    padding: 0.8rem 1.8rem;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .modal-footer .btn-outline:hover {
                    border-color: rgba(255, 255, 255, 0.4);
                    color: white;
                    background: rgba(255,255,255,0.05);
                }

                @media (max-width: 768px) {
                    .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
                    .header-actions, .search-bar { width: 100%; }
                    
                    .filter-shelf { overflow-x: auto; padding-bottom: 0.5rem; padding-top: 0.5rem; }
                    .filter-group { width: max-content; }

                    .admin-table thead { display: none; }
                    
                    .admin-table { display: block; width: 100%; }
                    .admin-table tbody {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 0.5rem;
                        width: 100%;
                    }

                    .admin-table tr {
                        display: flex;
                        flex-direction: column;
                        gap: 0.5rem;
                        padding: 0.75rem;
                        background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2));
                        border: 1px solid rgba(255,255,255,0.05);
                        border-radius: 12px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    }
                    
                    .admin-table td {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: flex-start;
                        padding: 0;
                        border: none;
                    }

                    .admin-table td:nth-child(2) { 
                        margin: 0.25rem 0; 
                        padding: 0.25rem 0; 
                        border-top: 1px dashed rgba(255,255,255,0.1); 
                        border-bottom: 1px dashed rgba(255,255,255,0.1); 
                    }
                    .admin-table td:nth-child(6) { margin-top: 0.25rem; width: 100%; }

                    /* Formatting specific to the card layout */
                    .admin-table td:nth-child(1)::before { content: "COMMANDE"; font-size: 0.55rem; color: var(--text-muted); margin-bottom: 2px; }
                    .admin-table td:nth-child(3)::before { content: "DATE"; font-size: 0.55rem; color: var(--text-muted); margin-bottom: 2px; }
                    .admin-table td:nth-child(4)::before { content: "STATUT"; font-size: 0.55rem; color: var(--text-muted); margin-bottom: 2px; }
                    .admin-table td:nth-child(5)::before { content: "MONTANT"; font-size: 0.55rem; color: var(--text-muted); margin-bottom: 2px; }
                    
                    .admin-table td:nth-child(2)::before,
                    .admin-table td:nth-child(6)::before { display: none; }

                    .admin-table td.empty-row::before { display: none; }
                    .admin-table td.empty-row { display: flex; align-items: center; justify-content: center; padding: 2rem; grid-column: 1 / -1; }

                    .id-cell { font-size: 0.95rem; font-weight: 700; color: white !important; }
                    .date-cell { font-size: 0.75rem; color: #ccc; }
                    .amount-cell { font-size: 1rem; font-weight: 700; color: var(--accent-gold); }
                    
                    .status-pill { padding: 0.2rem 0.4rem; font-size: 0.6rem; border-radius: 6px; }

                    .user-cell { width: 100%; justify-content: flex-start; text-align: left; }
                    .user-name { font-size: 0.8rem; }
                    .avatar-mini { width: 28px; height: 28px; font-size: 0.85rem; border-radius: 6px; }
                    .contact-mini { display: none; /* Hide contacts icon to save space on 2-col */ }

                    .order-actions { width: 100%; display: flex; flex-direction: column; gap: 0.5rem; }
                    .status-selector { 
                        width: 100%; 
                        padding: 0.5rem; 
                        background: rgba(10,10,10,0.5); 
                        border: 1px solid rgba(255,255,255,0.1); 
                        border-radius: 6px; 
                        font-size: 0.75rem;
                    }
                    .view-details-btn { 
                        background: var(--accent-gold); 
                        color: #000; 
                        border-radius: 6px; 
                        width: 100%; 
                        padding: 0.4rem;
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        border: none;
                    }

                    .info-grid { grid-template-columns: 1fr; gap: 1rem; }
                    .financial-row { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
                    .total-amount { font-size: 1.25rem; }
                    .modal-content { padding: 1.5rem; }
                }
            `}</style>
        </div>
    );
};

export default Orders;
