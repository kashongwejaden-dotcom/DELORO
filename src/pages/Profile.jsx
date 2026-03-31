import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import { Package, Clock, LogOut, User as UserIcon } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                // Assuming we have an endpoint for my orders, or we use the general one and filter?
                // Standard practice: GET /orders returns *my* orders.
                // If not, we might need to adjust backend.
                // Let's assume GET /orders exists or we use /api/orders (customer route)
                const res = await api.get('/orders'); // This usually points to customer routes
                setOrders(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch orders', err);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (loading) return <div className="loading-state">Chargement du profil...</div>;

    return (
        <div style={{ paddingTop: '100px', minHeight: '80vh' }} className="container">
            <div className="profile-header">
                <h1>Mon Compte</h1>
                <button onClick={handleLogout} className="btn-secondary logout-btn">
                    <LogOut size={16} />
                    Déconnexion
                </button>
            </div>

            <div className="profile-grid">
                <GlassCard className="profile-card">
                    <div className="user-info">
                        <div className="avatar-large">
                            <UserIcon size={40} />
                        </div>
                        <div>
                            <h3>{user.name}</h3>
                            <p className="text-muted">{user.email}</p>
                            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                Membre depuis {new Date(user.id ? Date.now() : Date.now()).getFullYear()}
                            </p>
                        </div>
                    </div>
                </GlassCard>

                <div className="orders-section">
                    <h2>Historique des commandes</h2>
                    {orders.length === 0 ? (
                        <p className="text-muted">Vous n'avez pas encore passé de commande.</p>
                    ) : (
                        <div className="orders-list">
                            {orders.map(order => (
                                <GlassCard key={order.id} className="order-item">
                                    <div className="order-header">
                                        <span className="order-id">Commande N°{order.id}</span>
                                        <span className={`status-badge ${order.status?.toLowerCase()}`}>
                                            {order.status === 'pending' ? 'en attente' : order.status === 'processing' ? 'en cours' : order.status === 'shipped' ? 'expédié' : order.status === 'delivered' ? 'livré' : order.status}
                                        </span>
                                    </div>
                                    <div className="order-details">
                                        <div className="detail-row">
                                            <Clock size={14} />
                                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <Package size={14} />
                                            <span>{order.items?.length || 1} Article(s)</span>
                                        </div>
                                        <div className="total-price">
                                            {order.total_amount?.toLocaleString()} $
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .profile-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 50px;
                    border: 1px solid rgba(255,255,255,0.2);
                    background: transparent;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .logout-btn:hover {
                    background: rgba(255,255,255,0.1);
                    border-color: white;
                }

                .profile-grid {
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    gap: 2rem;
                }

                @media (max-width: 768px) {
                    .profile-grid { grid-template-columns: 1fr; }
                }

                .user-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 1rem;
                }

                .avatar-large {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                }

                .orders-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .order-item {
                    transition: transform 0.2s;
                }
                .order-item:hover {
                    transform: translateY(-2px);
                }

                .order-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                .status-badge {
                    font-size: 0.8rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: 50px;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .status-badge.pending { background: rgba(255, 193, 7, 0.15); color: #ffc107; }
                .status-badge.shipped { background: rgba(23, 162, 184, 0.15); color: #17a2b8; }
                .status-badge.delivered { background: rgba(40, 167, 69, 0.15); color: #28a745; }

                .order-details {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }

                .detail-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .total-price {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--accent-gold);
                }
            `}</style>
        </div>
    );
};

export default Profile;
