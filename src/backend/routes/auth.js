const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const config = require('../config/environment');

const router = express.Router();

// Admin Login
router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: 'Username and password are required'
        });
    }

    db.get('SELECT * FROM admins WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!row) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        bcrypt.compare(password, row.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: row.id, username: row.username, email: row.email },
                config.JWT_SECRET,
                { expiresIn: config.JWT_EXPIRE }
            );

            // Update last login
            db.run('UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [row.id]);

            res.json({
                success: true,
                token,
                admin: {
                    id: row.id,
                    username: row.username,
                    email: row.email
                }
            });
        });
    });
});

// Register new admin
router.post('/admin/register', (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({
            error: 'Username, password, and email are required'
        });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
        }

        db.run(
            'INSERT INTO admins (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({
                            error: 'Username or email already exists'
                        });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }

                res.status(201).json({
                    success: true,
                    message: 'Admin registered successfully',
                    admin: { id: this.lastID, username, email }
                });
            }
        );
    });
});

// App User Login
router.post('/app/login', (req, res) => {
    const { username, password, app_id } = req.body;

    if (!username || !password || !app_id) {
        return res.status(400).json({
            error: 'Username, password, and app_id are required'
        });
    }

    db.get(
        'SELECT * FROM app_users WHERE username = ? AND app_id = ? AND is_active = 1',
        [username, app_id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!row) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            bcrypt.compare(password, row.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).json({
                        error: 'Invalid credentials'
                    });
                }

                // Update last login
                db.run('UPDATE app_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [row.id]);

                // Generate token for app
                const token = jwt.sign(
                    { id: row.id, username: row.username, app_id: row.app_id },
                    config.JWT_SECRET,
                    { expiresIn: '7d' }
                );

                res.json({
                    success: true,
                    token,
                    user: {
                        id: row.id,
                        username: row.username,
                        subscription_status: row.subscription_status,
                        expiry_date: row.expiry_date
                    }
                });
            });
        }
    );
});

module.exports = router;
