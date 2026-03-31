import React from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    LogOut,
    Settings
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    // Determine active tab based on current path
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/admin/products')) return 'products';
        if (path.includes('/admin/orders')) return 'orders';
        if (path.includes('/admin/customers')) return 'customers';
        return 'analytics';
    };

    const activeTab = getActiveTab();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const menuItems = [
        { id: 'analytics', label: 'Tableau de bord', icon: LayoutDashboard, path: '/admin' },
        { id: 'products', label: 'Produits', icon: Package, path: '/admin/products' },
        { id: 'orders', label: 'Commandes', icon: ShoppingBag, path: '/admin/orders' },
        { id: 'customers', label: 'Clients', icon: Users, path: '/admin/customers' },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2>DEL'ORO</h2>
                    <span className="subtitle">ADMINISTRATION</span>
                </motion.div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => handleNavigation(item.path)}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                        {activeTab === item.id && (
                            <motion.div
                                layoutId="active-indicator"
                                className="active-indicator"
                            />
                        )}
                    </button>
                ))}
                
                {/* Mobile-only logout button (replaces top header button on phones) */}
                <button className="nav-item logout-mobile" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Quitter</span>
                </button>
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item logout-desktop" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                </button>
            </div>

            <style>{`
                .admin-sidebar {
                    width: 280px;
                    height: 100vh;
                    position: fixed;
                    left: 0;
                    top: 0;
                    background: rgba(10, 10, 10, 0.95);
                    border-right: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    flex-direction: column;
                    z-index: 100;
                    backdrop-filter: blur(10px);
                }

                .sidebar-header {
                    padding: 2.5rem 2rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .sidebar-header h2 {
                    font-family: var(--font-serif);
                    font-size: 1.8rem;
                    letter-spacing: 0.1em;
                    margin: 0;
                    background: linear-gradient(45deg, var(--text-light), var(--accent-gold));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .subtitle {
                    font-size: 0.7rem;
                    letter-spacing: 0.3em;
                    color: var(--accent-gold);
                    display: block;
                    margin-top: 0.5rem;
                }

                .sidebar-nav {
                    padding: 2rem 1.5rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }

                .nav-item {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.2rem;
                    color: var(--text-muted);
                    background: transparent;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    font-size: 0.95rem;
                    width: 100%;
                    text-align: left;
                }

                .nav-item:hover {
                    color: var(--text-light);
                    background: rgba(255, 255, 255, 0.03);
                }

                .nav-item.active {
                    color: var(--accent-gold);
                    background: rgba(212, 175, 55, 0.08);
                }

                .active-indicator {
                    position: absolute;
                    left: 0;
                    height: 60%;
                    width: 3px;
                    background: var(--accent-gold);
                    border-radius: 0 4px 4px 0;
                }

                .logout-mobile {
                    display: none; /* Hidden on desktop */
                }

                .sidebar-footer {
                    padding: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .logout-desktop {
                    color: #cf6679;
                }

                .logout-desktop:hover {
                    background: rgba(207, 102, 121, 0.1);
                }

                @media (max-width: 768px) {
                    .admin-sidebar {
                        width: 100%;
                        height: 65px;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        position: fixed;
                        top: 0;
                        left: 0;
                        border-right: none;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                        z-index: 1000;
                    }

                    .sidebar-header {
                        padding: 0 1.5rem;
                        border-bottom: none;
                    }

                    .sidebar-header h2 {
                        font-size: 1.3rem;
                    }

                    .subtitle {
                        display: none;
                    }

                    .sidebar-nav {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 70px;
                        flex-direction: row;
                        justify-content: space-around;
                        padding: 0.5rem 0;
                        background: rgba(10, 10, 10, 0.98);
                        border-top: 1px solid rgba(255, 255, 255, 0.05);
                        backdrop-filter: blur(10px);
                        z-index: 1000;
                        margin: 0;
                    }

                    .nav-item {
                        flex-direction: column;
                        gap: 0.3rem;
                        padding: 0.4rem;
                        width: auto;
                        justify-content: center;
                    }

                    .nav-item span {
                        font-size: 0.65rem;
                    }
                    
                    /* Show mobile logout, hide desktop logout/footer */
                    .logout-mobile {
                        display: flex;
                        color: #cf6679;
                    }
                    
                    .logout-mobile span {
                        font-family: var(--font-sans);
                    }

                    .sidebar-footer {
                        display: none;
                    }

                    .active-indicator {
                        height: 3px;
                        width: 24px;
                        left: 50%;
                        bottom: 0;
                        top: auto;
                        transform: translateX(-50%);
                        border-radius: 3px 3px 0 0;
                        position: absolute;
                    }
                }
            `}</style>
        </aside>
    );
};

export default AdminSidebar;
