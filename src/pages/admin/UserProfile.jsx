import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import GlassCard from '../../components/ui/GlassCard';
import { Mail, Calendar, ArrowLeft, Clock, ShoppingBag, Euro } from 'lucide-react';

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                // Fetch all customers and find this one
                const userRes = await api.get('/customers');
                const foundUser = userRes.data.find(u => u.id === parseInt(id));
                setUser(foundUser);

                // Fetch orders and filter by this user
                const ordersRes = await api.get('/admin/orders');
                const userOrders = ordersRes.data.filter(o => o.user_id === parseInt(id));
                setOrders(userOrders);

            } catch (err) {
                console.error('Failed to fetch user data', err);
                setError('Impossible de charger les données du client.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    if (loading) return (
        <div className="admin-loading">
            <div className="spinner" />
            <p>Chargement du profil...</p>
        </div>
    );

    if (error) return <div className="error-banner">{error}</div>;
    if (!user) return <div className="error-banner">Client non trouvé.</div>;

    return (
        <div className="admin-page">
            <header className="page-header">
                <div>
                    <Link to="/admin/customers" className="back-link">
                        <ArrowLeft size={18} />
                        <span>Retour aux clients</span>
                    </Link>
                    <h1>{user.name}</h1>
                    <p className="text-muted">Profil détaillés du client</p>
                </div>
                <div className="user-initials-badge">
                    {user.name[0].toUpperCase()}
                </div>
            </header>

            <div className="profile-grid">
                {/* User Info Card */}
                <GlassCard className="info-card">
                    <h2>Informations personnelles</h2>
                    <div className="info-list">
                        <div className="info-item">
                            <Mail size={18} className="icon" />
                            <div className="info-text">
                                <span className="label">E-mail</span>
                                <span className="value">{user.email}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <Calendar size={18} className="icon" />
                            <div className="info-text">
                                <span className="label">Date d'inscription</span>
                                <span className="value">{new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <Euro size={20} />
                            <div className="stat-val">{user.total_spent || 0} $</div>
                            <div className="stat-label">Dépenses totales</div>
                        </div>
                        <div className="stat-card">
                            <ShoppingBag size={20} />
                            <div className="stat-val">{user.order_count || 0}</div>
                            <div className="stat-label">Commandes</div>
                        </div>
                    </div>
                </GlassCard>

                {/* Orders / Activity */}
                <div className="activity-section">
                    <h2>Historique des commandes</h2>
                    {orders.length === 0 ? (
                        <GlassCard className="empty-orders">
                            <ShoppingBag size={48} />
                            <p>Aucune commande passée par ce client.</p>
                        </GlassCard>
                    ) : (
                        <div className="orders-stack">
                            {orders.map(order => (
                                <GlassCard key={order.id} className="order-summary-card">
                                    <div className="order-main">
                                        <div className="id-group">
                                            <span className="order-id">#{order.id}</span>
                                            <span className={`status-pill ${order.status.toLowerCase()}`}>
                                                {order.status === 'pending' ? 'en attente' : order.status === 'processing' ? 'en cours' : order.status === 'shipped' ? 'expédié' : order.status === 'delivered' ? 'livré' : order.status === 'cancelled' ? 'annulé' : order.status}
                                            </span>
                                        </div>
                                        <div className="date-group">
                                            <Clock size={14} />
                                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="order-total">
                                        {order.total_amount || order.total} $
                                    </div>
                                    <Link to={`/admin/orders`} className="order-link">
                                        Voir la commande
                                    </Link>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .admin-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 8rem 0;
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
                    align-items: flex-end;
                    margin-bottom: 3rem;
                }

                .back-link {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                    transition: color 0.2s;
                }
                .back-link:hover { color: var(--accent-gold); }

                .user-initials-badge {
                    width: 64px;
                    height: 64px;
                    background: var(--gold-gradient);
                    background-size: 200% auto;
                    color: #000;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 1.8rem;
                    box-shadow: var(--gold-shadow);
                }

                .profile-grid {
                    display: grid;
                    grid-template-columns: 380px 1fr;
                    gap: 3rem;
                }

                @media (max-width: 1024px) {
                    .profile-grid { grid-template-columns: 1fr; }
                }

                .info-card h2, .activity-section h2 {
                    margin-bottom: 2rem;
                    color: white;
                    font-size: 1.3rem;
                    font-family: var(--font-serif);
                }

                .info-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .info-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                }

                .info-item .icon { color: var(--accent-gold); margin-top: 3px; }

                .info-text .label {
                    display: block;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 0.2rem;
                }

                .info-text .value {
                    color: white;
                    font-size: 1rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-top: 2.5rem;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255,255,255,0.08);
                }

                .stat-card {
                    background: rgba(255,255,255,0.03);
                    padding: 1.2rem;
                    border-radius: 12px;
                    text-align: center;
                }

                .stat-card svg { color: var(--accent-gold); margin-bottom: 0.8rem; }
                .stat-val { font-size: 1.4rem; font-weight: 600; color: white; margin-bottom: 0.2rem; }
                .stat-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; }

                .orders-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .order-summary-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem !important;
                }

                .order-main {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .id-group {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .order-id { font-weight: 600; color: white; font-size: 1.1rem; }

                .status-pill {
                    font-size: 0.7rem;
                    padding: 0.2rem 0.7rem;
                    border-radius: 50px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 600;
                }
                .status-pill.pending { background: rgba(212, 175, 55, 0.1); color: var(--accent-gold); border: 1px solid rgba(212, 175, 55, 0.2); }
                .status-pill.completed, .status-pill.shipped { background: rgba(40, 167, 69, 0.1); color: #48bb78; border: 1px solid rgba(40, 167, 69, 0.2); }
                .status-pill.cancelled { background: rgba(245, 101, 101, 0.1); color: #f56565; border: 1px solid rgba(245, 101, 101, 0.2); }

                .date-group {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                }

                .order-total {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: var(--accent-gold);
                }

                .order-link {
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    text-decoration: underline;
                }
                .order-link:hover { color: white; }

                .empty-orders {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem !important;
                    color: var(--text-muted);
                    text-align: center;
                    gap: 1rem;
                }

                .error-banner {
                    background: rgba(239, 68, 68, 0.1);
                    color: #f87171;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default UserProfile;
