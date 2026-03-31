import express from 'express';
import db from '../database.js';

const router = express.Router();

// Public: Get all products (for user-facing pages)
router.get('/', async (req, res) => {
    const { category, featured } = req.query;
    let query = `SELECT * FROM products`;
    const params = [];

    if (category && category !== 'Tous') {
        query += ` WHERE category = $1`;
        params.push(category);
    } else if (featured === 'true') {
        query += ` WHERE is_featured = TRUE`;
    }

    query += ` ORDER BY created_at DESC`;

    try {
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Products fetch error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Public: Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM products WHERE id = $1`, [req.params.id]);
        const row = result.rows[0];
        if (!row) return res.status(404).json({ error: 'Product not found' });
        res.json(row);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
