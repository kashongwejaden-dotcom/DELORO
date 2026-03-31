import express from 'express';
import db from '../database.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken, isAdmin);

// GET /stats - Key Metrics
router.get('/stats', async (req, res) => {
    try {
        const [revenueResult, ordersResult, customersResult] = await Promise.all([
            db.query(`SELECT SUM(total_amount) as totalRevenue FROM orders`),
            db.query(`SELECT COUNT(*) as totalOrders FROM orders`),
            db.query(`SELECT COUNT(*) as totalCustomers FROM users WHERE role = 'user'`)
        ]);

        res.json({
            totalRevenue: parseFloat(revenueResult.rows[0].totalrevenue) || 0,
            totalOrders: parseInt(ordersResult.rows[0].totalorders, 10),
            totalCustomers: parseInt(customersResult.rows[0].totalcustomers, 10),
        });
    } catch (err) {
        console.error('Analytics stats error:', err);
        res.status(500).json({ error: 'DB error' });
    }
});

// GET /charts - Sales data for last 7 days
router.get('/charts', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                TO_CHAR(created_at, 'YYYY-MM-DD') as date,
                SUM(total_amount) as sales
            FROM orders
            WHERE created_at >= NOW() - INTERVAL '7 days'
            GROUP BY date
            ORDER BY date ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Analytics charts error:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
