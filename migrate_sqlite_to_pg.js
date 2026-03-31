/**
 * ONE-TIME DATA MIGRATION SCRIPT
 * Migrates data from the old SQLite database to the new PostgreSQL database.
 *
 * Prerequisites:
 *   1. PostgreSQL must be running and the DATABASE_URL in .env must be correct.
 *   2. The backend server must be stopped (so the database is not locked).
 *   3. The old SQLite file must exist at: server/deloro.sqlite
 *
 * Run with:
 *   node migrate_sqlite_to_pg.js
 */

import sqlite3 from 'sqlite3';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqliteDbPath = path.resolve(__dirname, 'server/deloro.sqlite');

const { Pool } = pg;
const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com')
        ? { rejectUnauthorized: false }
        : false,
});

const verboseSqlite = sqlite3.verbose();

function sqliteAll(db, query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function migrate() {
    const sqliteDb = new verboseSqlite.Database(sqliteDbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error('❌ Could not open SQLite DB:', err.message);
            process.exit(1);
        }
    });

    const pgClient = await pgPool.connect();
    console.log('✅ Connected to PostgreSQL');

    try {
        await pgClient.query('BEGIN');

        // --- USERS ---
        console.log('\n📦 Migrating users...');
        const users = await sqliteAll(sqliteDb, 'SELECT * FROM users');
        for (const u of users) {
            await pgClient.query(
                `INSERT INTO users (id, name, email, password, role, mfa_secret, is_mfa_enabled, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 ON CONFLICT (id) DO NOTHING`,
                [u.id, u.name, u.email, u.password, u.role, u.mfa_secret, !!u.is_mfa_enabled, u.created_at]
            );
        }
        console.log(`  ✓ Migrated ${users.length} users`);

        // --- PRODUCTS ---
        console.log('📦 Migrating products...');
        const products = await sqliteAll(sqliteDb, 'SELECT * FROM products');
        for (const p of products) {
            await pgClient.query(
                `INSERT INTO products (id, name, price, category, description, image, stock, is_featured, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 ON CONFLICT (id) DO NOTHING`,
                [p.id, p.name, p.price, p.category, p.description, p.image, p.stock, !!p.is_featured, p.created_at]
            );
        }
        console.log(`  ✓ Migrated ${products.length} products`);

        // --- ORDERS ---
        console.log('📦 Migrating orders...');
        const orders = await sqliteAll(sqliteDb, 'SELECT * FROM orders');
        for (const o of orders) {
            await pgClient.query(
                `INSERT INTO orders (id, user_id, total_amount, status, shipping_address, customer_name, customer_email, customer_phone, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 ON CONFLICT (id) DO NOTHING`,
                [o.id, o.user_id, o.total_amount, o.status, o.shipping_address, o.customer_name, o.customer_email, o.customer_phone, o.created_at]
            );
        }
        console.log(`  ✓ Migrated ${orders.length} orders`);

        // --- ORDER ITEMS ---
        console.log('📦 Migrating order_items...');
        const validOrderIds = new Set(orders.map(o => o.id));
        const validProductIds = new Set(products.map(p => p.id));
        const orderItems = await sqliteAll(sqliteDb, 'SELECT * FROM order_items');
        let orderItemsMigrated = 0;
        for (const oi of orderItems) {
            if (!validOrderIds.has(oi.order_id) || !validProductIds.has(oi.product_id)) {
                console.warn(`  ↳ Skipping order_item ${oi.id} (invalid foreign key structure)`);
                continue;
            }
            await pgClient.query(
                `INSERT INTO order_items (id, order_id, product_id, quantity, price)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (id) DO NOTHING`,
                [oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price]
            );
            orderItemsMigrated++;
        }
        console.log(`  ✓ Migrated ${orderItemsMigrated} order items`);

        // --- RESET SEQUENCES ---
        console.log('\n🔢 Resetting PostgreSQL sequences...');
        const tables = ['users', 'products', 'orders', 'order_items'];
        for (const table of tables) {
            await pgClient.query(
                `SELECT setval('${table}_id_seq', COALESCE((SELECT MAX(id) FROM ${table}), 1))`
            );
        }
        console.log('  ✓ Sequences reset');

        await pgClient.query('COMMIT');
        console.log('\n🎉 Migration completed successfully!\n');

    } catch (err) {
        await pgClient.query('ROLLBACK');
        console.error('❌ Migration failed, rolled back:', err.message);
    } finally {
        pgClient.release();
        await pgPool.end();
        sqliteDb.close();
    }
}

migrate();
