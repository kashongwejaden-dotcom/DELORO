import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'server', 'deloro.sqlite');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    console.log('Migrating orders table...');

    db.run("ALTER TABLE orders ADD COLUMN customer_name TEXT", (err) => {
        if (err) console.log('customer_name column already exists or error:', err.message);
        else console.log('Added customer_name column');
    });

    db.run("ALTER TABLE orders ADD COLUMN customer_email TEXT", (err) => {
        if (err) console.log('customer_email column already exists or error:', err.message);
        else console.log('Added customer_email column');
    });

    db.run("ALTER TABLE orders ADD COLUMN customer_phone TEXT", (err) => {
        if (err) console.log('customer_phone column already exists or error:', err.message);
        else console.log('Added customer_phone column');
    });
});

db.close();
