import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'server/deloro.sqlite');

const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(dbPath);

// The user asked to delete ALL users. 
// Note: This will include admin accounts.
db.run("DELETE FROM users", [], function (err) {
    if (err) {
        return console.error('Error deleting users:', err.message);
    }
    console.log(`Success! Deleted ${this.changes} users from the database.`);

    // Also clearing associated orders/items if needed? 
    // Usually, users and orders have foreign key constraints.
    // Let's check if we should delete orders too to keep DB consistent.
    db.run("DELETE FROM orders", [], (err) => {
        if (!err) console.log("Associated orders cleared.");
    });
    db.run("DELETE FROM order_items", [], (err) => {
        if (!err) console.log("Associated order items cleared.");
    });

    db.close();
});
