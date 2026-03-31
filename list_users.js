import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'server/deloro.sqlite');

const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        process.exit(1);
    }
});

db.all("SELECT id, name, email, role FROM users", [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log(JSON.stringify(rows, null, 2));
    db.close();
});
