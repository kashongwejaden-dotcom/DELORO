import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import { motion } from 'framer-motion';

const Analytics = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalCustomers: 0 });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const statsRes = await api.get('/analytics/stats');
                setStats(statsRes.data);
                const chartRes = await api.get('/analytics/charts');
                setChartData(chartRes.data);
            } catch (err) {
                console.error('Error fetching analytics', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div>Chargement des statistiques...</div>;

    const statCards = [
        {
            title: 'Revenu Total',
            value: `${stats.totalRevenue.toLocaleString()} $`,
            icon: DollarSign,
            color: 'gold',
            trend: '+12.5%'
        },
        {
            title: 'Commandes Totales',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: 'blue',
            trend: '+5.2%'
        },
        {
            title: 'Total Clients',
            value: stats.totalCustomers,
            icon: Users,
            color: 'purple',
            trend: '+8.1%'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="admin-page">
            <header className="page-header">
                <div>
                    <h1>Vue d'ensemble</h1>
                    <p className="text-muted">Bienvenue, Administrateur</p>
                </div>
                <div className="date-display">
                    {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            <motion.div
                className="stats-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {statCards.map((stat, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <GlassCard className="stat-card" hoverEffect={true}>
                            <div className="stat-header">
                                <div className={`icon-wrapper ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className="trend-badge positive">
                                    <TrendingUp size={14} />
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="stat-content">
                                <h3>{stat.title}</h3>
                                <p className="stat-value">{stat.value}</p>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <GlassCard className="chart-panel">
                    <div className="chart-header">
                        <h3>Aperçu des Revenus</h3>
                        <select className="period-select">
                            <option>7 Derniers Jours</option>
                            <option>30 Derniers Jours</option>
                            <option>Cette Année</option>
                        </select>
                    </div>
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#555"
                                    tick={{ fill: '#888', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#555"
                                    tick={{ fill: '#888', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                    tickFormatter={(value) => `${value} $`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(20, 20, 20, 0.9)',
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                    }}
                                    itemStyle={{ color: '#D4AF37' }}
                                    formatter={(value) => [`${value} $`, 'Revenu']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#D4AF37"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </motion.div>

            <style>{`
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 2.5rem;
                }

                .date-display {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.5rem 1rem;
                    border-radius: 50px;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .stat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .icon-wrapper {
                    width: 50px;
                    height: 50px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .icon-wrapper.gold { background: rgba(212, 175, 55, 0.15); color: #D4AF37; }
                .icon-wrapper.blue { background: rgba(96, 165, 250, 0.15); color: #60a5fa; }
                .icon-wrapper.purple { background: rgba(167, 139, 250, 0.15); color: #a78bfa; }
                
                .trend-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-size: 0.8rem;
                    padding: 0.2rem 0.6rem;
                    border-radius: 50px;
                    background: rgba(74, 222, 128, 0.1);
                    color: #4ade80;
                }

                .stat-content h3 {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-light);
                    font-family: var(--font-serif);
                }

                .chart-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .chart-header h3 {
                    font-size: 1.2rem;
                    font-weight: 500;
                }

                .period-select {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 0.4rem 1rem;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    cursor: pointer;
                }
                .period-select:focus { outline: none; border-color: var(--accent-gold); }

                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 0.5rem;
                    }
                    
                    .stat-card {
                        padding: 0.8rem;
                        gap: 0.5rem;
                    }

                    .stat-header {
                        flex-direction: column;
                        align-items: center;
                        gap: 0.5rem;
                    }

                    .icon-wrapper {
                        width: 32px;
                        height: 32px;
                        border-radius: 8px;
                    }
                    
                    .icon-wrapper svg {
                        width: 16px;
                        height: 16px;
                    }

                    .trend-badge {
                        font-size: 0.6rem;
                        padding: 0.2rem 0.4rem;
                    }

                    .stat-content {
                        text-align: center;
                    }

                    .stat-content h3 {
                        font-size: 0.6rem;
                        margin-bottom: 0.2rem;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .stat-value {
                        font-size: 1.1rem;
                    }

                    .chart-panel {
                        padding: 1rem;
                    }

                    .page-header h1 {
                        font-size: 1.4rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Analytics;
