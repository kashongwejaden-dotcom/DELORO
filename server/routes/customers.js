import express from 'express';
import db from '../database.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken, isAdmin);

// GET / - List all customers with stats
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                u.id,
                u.name,
                u.email,
                u.created_at,
                COUNT(o.id) as order_count,
                SUM(o.total_amount) as total_spent
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            WHERE u.role != 'admin'
            GROUP BY u.id
            ORDER BY total_spent DESC NULLS LAST
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Customers error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
