import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'server/deloro.sqlite');

const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(dbPath);

const email = 'admin@gmail.com';
const password = 'admin123';
const name = 'Admin';

(async () => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.serialize(() => {
            db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
                if (err) {
                    console.error('Error fetching user:', err.message);
                    return;
                }

                if (row) {
                    // Update existing user
                    db.run(`UPDATE users SET password = ?, role = 'admin' WHERE email = ?`, [hashedPassword, email], function (err) {
                        if (err) {
                            return console.error(err.message);
                        }
                        console.log(`Updated existing user ${email} to admin with new password.`);
                    });
                } else {
                    // Insert new user
                    db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')`, [name, email, hashedPassword], function (err) {
                        if (err) {
                            return console.error(err.message);
                        }
                        console.log(`Created new admin user ${email} with password.`);
                    });
                }
            });
        });

        // Close after a short delay to allow async DB operations to complete (simplified for script)
        // Better approach: wrap DB calls in promises, but this is a one-off script.
        setTimeout(() => {
            db.close((err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Database connection closed.');
            });
        }, 1000);

    } catch (error) {
        console.error('Error hashing password:', error);
    }
})();
