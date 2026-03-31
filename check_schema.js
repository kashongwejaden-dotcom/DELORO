import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'server', 'deloro.sqlite');

console.log('Checking database at:', dbPath);
const db = new sqlite3.Database(dbPath);

db.all("PRAGMA table_info(orders)", (err, rows) => {
    if (err) {
        console.error('Error checking table_info:', err);
    } else {
        console.log('Columns in orders table:');
        rows.forEach(row => console.log(`- ${row.name} (${row.type})`));
    }
    db.close();
});
