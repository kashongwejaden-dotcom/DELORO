import express from 'express';
import db from '../database.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken, isAdmin);

// Get all products
router.get('/products', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM products ORDER BY created_at DESC`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Add Product
router.post('/products', async (req, res) => {
    const { name, price, category, description, image, stock, is_featured } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO products (name, price, category, description, image, stock, is_featured)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [name, price, category, description, image, stock || 0, is_featured ? true : false]
        );
        res.json({ id: result.rows[0].id, message: 'Product created' });
    } catch (err) {
        console.error('Add product error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update Product
router.put('/products/:id', async (req, res) => {
    const { name, price, category, description, image, stock, is_featured } = req.body;
    const { id } = req.params;
    try {
        await db.query(
            `UPDATE products SET name=$1, price=$2, category=$3, description=$4, image=$5, stock=$6, is_featured=$7 WHERE id=$8`,
            [name, price, category, description, image, stock, is_featured ? true : false, id]
        );
        res.json({ message: 'Product updated' });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete Product
router.delete('/products/:id', async (req, res) => {
    try {
        await db.query(`DELETE FROM products WHERE id = $1`, [req.params.id]);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Get all orders
router.get('/orders', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT o.*, u.name as user_name
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Update Order Status
router.put('/orders/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query(
            `UPDATE orders SET status = $1 WHERE id = $2`,
            [status, req.params.id]
        );
        res.json({ message: 'Order status updated' });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
