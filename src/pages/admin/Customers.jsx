import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import GlassCard from '../../components/ui/GlassCard';
import { Mail, Calendar, Search, Users, ExternalLink } from 'lucide-react';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const res = await api.get('/customers');
                setCustomers(res.data);
            } catch (err) {
                console.error('Error fetching customers', err);
                setError('Impossible de charger la liste des clients.');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="admin-loading">
            <div className="spinner" />
            <p>Chargement des clients...</p>
        </div>
    );

    return (
        <div className="admin-page">
            <header className="page-header">
                <div>
                    <h1>Clients</h1>
                    <p className="text-muted">Gérez votre base de clients et leurs activités</p>
                </div>
                <div className="actions">
                    <div className="search-bar">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {error && <div className="error-banner">{error}</div>}

            <GlassCard className="customers-container">
                <div className="table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th>Contact</th>
                                <th>Inscription</th>
                                <th>Commandes</th>
                                <th>Valeur totale</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-row">Aucun client trouvé.</td>
                                </tr>
                            ) : (
                                filteredCustomers.map(c => (
                                    <tr key={c.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-avatar">
                                                    {(c.name || 'C')[0].toUpperCase()}
                                                </div>
                                                <span className="user-name">{c.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contact-cell">
                                                <Mail size={14} />
                                                <span>{c.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="date-cell">
                                                <Calendar size={14} />
                                                <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="order-badge">
                                                {c.order_count || 0} {(c.order_count || 0) > 1 ? 'commandes' : 'commande'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="ltv-amount">
                                                {(c.total_spent || 0).toLocaleString()} $
                                            </span>
                                        </td>
                                        <td>
                                            <Link to={`/admin/customers/${c.id}`} className="view-link">
                                                <ExternalLink size={14} />
                                                <span>Détails</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            <style>{`
                .admin-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem;
                    color: var(--text-muted);
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 2px solid rgba(212, 175, 55, 0.2);
                    border-top-color: var(--accent-gold);
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin-bottom: 1rem;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2.5rem;
                }

                .search-bar {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50px;
                    padding: 0.6rem 1.2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    width: 350px;
                    transition: border-color 0.3s;
                }

                .search-bar:focus-within {
                    border-color: var(--accent-gold);
                }

                .search-bar input {
                    background: transparent;
                    border: none;
                    color: white;
                    width: 100%;
                    font-size: 0.9rem;
                }
                .search-bar input:focus { outline: none; }

                .customers-container {
                    padding: 0 !important;
                    overflow: hidden;
                }

                .table-wrapper {
                    overflow-x: auto;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }

                .admin-table th {
                    padding: 1.2rem 1.5rem;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--text-muted);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    font-weight: 600;
                }

                .admin-table td {
                    padding: 1.2rem 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
                    vertical-align: middle;
                }

                .admin-table tr:hover td {
                    background: rgba(255, 255, 255, 0.02);
                }

                .user-cell {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .user-avatar {
                    width: 40px;
                    height: 40px;
                    background: var(--gold-gradient);
                    background-size: 200% auto;
                    color: black;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 1.1rem;
                    box-shadow: var(--gold-shadow);
                }

                .user-name {
                    font-weight: 500;
                    color: white;
                    font-size: 0.95rem;
                }

                .contact-cell, .date-cell {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }

                .order-badge {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.3rem 0.8rem;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    color: #d1d5db;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .ltv-amount {
                    font-weight: 600;
                    color: var(--accent-gold);
                    font-family: var(--font-sans);
                }

                .view-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    transition: color 0.2s;
                    text-decoration: none;
                }

                .view-link:hover {
                    color: var(--accent-gold);
                }

                .empty-row {
                    text-align: center;
                    padding: 4rem !important;
                    color: var(--text-muted);
                    font-style: italic;
                }

                .error-banner {
                    background: rgba(239, 68, 68, 0.1);
                    color: #f87171;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 2rem;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }

                @media (max-width: 768px) {
                    .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
                    .actions, .search-bar { width: 100%; }

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
                        background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2));
                        border: 1px solid rgba(255,255,255,0.05);
                        border-radius: 12px;
                        padding: 0.75rem;
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

                    .admin-table td:nth-child(1)::before { content: "CLIENT"; font-size: 0.55rem; color: var(--text-muted); margin-bottom: 2px; }
                    .admin-table td:nth-child(2)::before { content: "EMAIL"; font-size: 0.55rem; color: var(--text-muted); margin-bottom: 2px; }
                    .admin-table td:nth-child(3)::before { content: "INSCRIT"; font-size: 0.55rem; color: var(--text-muted); margin-bottom: 2px; }
                    .admin-table td:nth-child(4)::before { content: "COMMANDES"; font-size: 0.55rem; color: var(--text-muted); margin-bottom: 2px; }
                    .admin-table td:nth-child(5)::before { content: "VALEUR"; font-size: 0.55rem; color: var(--text-muted); margin-bottom: 2px; }
                    .admin-table td:nth-child(6)::before { display: none; }

                    .admin-table td.empty-row::before { display: none; }
                    .admin-table td.empty-row { display: flex; align-items: center; justify-content: center; grid-column: 1 / -1; padding: 2rem; }

                    .user-cell { justify-content: flex-start; }
                    .user-name { font-size: 0.8rem; }
                    .user-avatar { width: 32px; height: 32px; font-size: 0.9rem; border-radius: 6px; }

                    .contact-cell, .date-cell { justify-content: flex-start; text-align: left; font-size: 0.75rem; }
                    
                    .order-badge { padding: 0.2rem 0.5rem; font-size: 0.7rem; }
                    .ltv-amount { font-size: 0.95rem; }

                    .view-link { 
                        width: 100%; 
                        justify-content: center; 
                        padding: 0.4rem; 
                        background: var(--accent-gold); 
                        color: #000; 
                        border-radius: 6px; 
                        margin-top: 0.25rem;
                        font-weight: bold;
                    }
                    .view-link:hover { color: #000; }
                }
            `}</style>
        </div>
    );
};

export default Customers;
