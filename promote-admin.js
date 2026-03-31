import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'server/deloro.sqlite');

const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(dbPath);

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address.');
    console.log('Usage: node promote-admin.js <email>');
    process.exit(1);
}

db.run(`UPDATE users SET role = 'admin' WHERE email = ?`, [email], function (err) {
    if (err) {
        return console.error(err.message);
    }
    if (this.changes === 0) {
        console.log(`No user found with email: ${email}`);
    } else {
        console.log(`Success! User ${email} is now an ADMIN.`);
    }
    db.close();
});
