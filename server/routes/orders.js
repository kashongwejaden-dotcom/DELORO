import express from 'express';
import db from '../database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/orders - Get orders for the logged in user
router.get('/', verifyToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await db.query(`
            SELECT o.*,
                COALESCE(
                    json_agg(
                        json_build_object('id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price)
                    ) FILTER (WHERE oi.id IS NOT NULL),
                    '[]'
                ) as items
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [userId]);

        res.json(result.rows);
    } catch (err) {
        console.error('Fetch user orders error:', err);
        res.status(500).json({ error: 'Database error fetching orders' });
    }
});

// POST /api/orders - Create a new order (Pay on Delivery)
router.post('/', async (req, res) => {
    const {
        items,
        total_amount,
        shipping_address,
        customer_name,
        customer_email,
        customer_phone,
        userId
    } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Le panier est vide' });
    }

    const client = await db.getClient();

    try {
        await client.query('BEGIN');

        // Check stock availability
        const stockErrors = [];
        for (const item of items) {
            const stockResult = await client.query(
                'SELECT stock, name FROM products WHERE id = $1',
                [item.id]
            );
            const row = stockResult.rows[0];
            if (!row) {
                stockErrors.push(`Product ${item.id} not found`);
            } else if (row.stock < item.quantity) {
                stockErrors.push(`Stock insuffisant pour: ${row.name} (Disponible: ${row.stock})`);
            }
        }

        if (stockErrors.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: stockErrors.join(', ') });
        }

        // Insert order
        const finalUserId = userId || null;
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, total_amount, shipping_address, customer_name, customer_email, customer_phone, status)
             VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING id`,
            [finalUserId, total_amount, shipping_address, customer_name, customer_email, customer_phone]
        );
        const orderId = orderResult.rows[0].id;

        // Insert order items and decrement stock
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
                [orderId, item.id, item.quantity, item.price]
            );
            await client.query(
                `UPDATE products SET stock = stock - $1 WHERE id = $2`,
                [item.quantity, item.id]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Commande enregistrée avec succès (Paiement à la livraison)',
            orderId
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Order creation error:', err);
        res.status(500).json({ error: 'Database error creating order' });
    } finally {
        client.release();
    }
});

export default router;
