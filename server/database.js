import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com')
        ? { rejectUnauthorized: false }
        : false,
});

const db = {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect(),
};

async function initDb() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT,
                email TEXT UNIQUE,
                password TEXT,
                role TEXT DEFAULT 'user',
                mfa_secret TEXT,
                is_mfa_enabled BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name TEXT,
                price REAL,
                category TEXT,
                description TEXT,
                image TEXT,
                stock INTEGER DEFAULT 0,
                is_featured BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                total_amount REAL,
                status TEXT DEFAULT 'pending',
                shipping_address TEXT,
                customer_name TEXT,
                customer_email TEXT,
                customer_phone TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id),
                product_id INTEGER REFERENCES products(id),
                quantity INTEGER,
                price REAL
            )
        `);

        console.log('Connected to PostgreSQL and tables initialized.');
    } catch (err) {
        console.error('Error initializing database:', err.message);
        process.exit(1);
    }
}

initDb();

export default db;
export { pool };
