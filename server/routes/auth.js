import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import db from '../database.js';
import { JWT_SECRET, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id`,
            [name, normalizedEmail, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password, mfaToken } = req.body;

    try {
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
        
        const normalizedEmail = email.toLowerCase().trim();
        const result = await db.query(`SELECT * FROM users WHERE LOWER(email) = $1`, [normalizedEmail]);
        const user = result.rows[0];

        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // MFA Check
        if (user.is_mfa_enabled) {
            if (!mfaToken) return res.status(400).json({ error: 'MFA token required', mfaRequired: true });

            const verified = speakeasy.totp.verify({
                secret: user.mfa_secret,
                encoding: 'base32',
                token: mfaToken
            });

            if (!verified) return res.status(400).json({ error: 'Invalid MFA token' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// Setup MFA
router.post('/mfa/setup', verifyToken, (req, res) => {
    const secret = speakeasy.generateSecret({ name: `DELORO (${req.user.email})` });

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
        if (err) return res.status(500).json({ error: 'Error generating QR code' });
        res.json({ secret: secret.base32, qrCode: data_url });
    });
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, name, email, role, is_mfa_enabled FROM users WHERE id = $1`,
            [req.user.id]
        );
        const user = result.rows[0];
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
