import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    if (loading) return <div className="loading-screen">Verifying access...</div>;

    return (
        <div className="admin-container">
            <AdminSidebar />

            <main className="admin-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        style={{ height: '100%' }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            <style>{`
                .admin-container {
                    display: flex;
                    min-height: 100vh;
                    background: var(--bg-dark);
                    color: var(--text-light);
                    font-family: var(--font-sans);
                    overflow-x: hidden;
                }

                .admin-content {
                    flex: 1;
                    margin-left: 280px; /* Sidebar width */
                    padding: 2.5rem 3rem;
                    background: radial-gradient(circle at top right, rgba(212, 175, 55, 0.03), transparent 40%);
                    min-height: 100vh;
                }

                .loading-screen {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-dark);
                    color: var(--accent-gold);
                    font-family: var(--font-serif);
                    letter-spacing: 0.1em;
                }

                @media (max-width: 768px) {
                    .admin-container {
                        flex-direction: column;
                    }
                    .admin-content {
                        margin-left: 0;
                        padding: 5rem 1rem 6rem 1rem; /* Space for top header and bottom nav */
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
