const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const router = express.Router();

// Create app user
router.post('/create', (req, res) => {
    const { username, password, email, app_id, expiry_date } = req.body;

    if (!username || !password || !app_id) {
        return res.status(400).json({
            error: 'Username, password, and app_id are required'
        });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error processing password' });
        }

        const userId = uuidv4();

        db.run(
            `INSERT INTO app_users (id, username, password, email, app_id, expiry_date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, username, hashedPassword, email, app_id, expiry_date],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({
                            error: 'Username already exists'
                        });
                    }
                    return res.status(500).json({ error: 'Error creating user' });
                }

                res.status(201).json({
                    success: true,
                    user: { id: userId, username, email, app_id }
                });
            }
        );
    });
});

// Get all users for an app
router.get('/app/:app_id', (req, res) => {
    db.all(
        'SELECT id, username, email, subscription_status, expiry_date, last_login, created_at FROM app_users WHERE app_id = ?',
        [req.params.app_id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({
                success: true,
                users: rows,
                count: rows ? rows.length : 0
            });
        }
    );
});

// Get user details
router.get('/:id', (req, res) => {
    db.get(
        'SELECT id, username, email, app_id, subscription_status, expiry_date, last_login, created_at FROM app_users WHERE id = ?',
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!row) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({
                success: true,
                user: row
            });
        }
    );
});

// Update user
router.put('/:id', (req, res) => {
    const { email, subscription_status, expiry_date } = req.body;

    db.run(
        'UPDATE app_users SET email = ?, subscription_status = ?, expiry_date = ? WHERE id = ?',
        [email, subscription_status, expiry_date, req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error updating user' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({
                success: true,
                message: 'User updated successfully'
            });
        }
    );
});

// Deactivate user
router.delete('/:id', (req, res) => {
    db.run(
        'UPDATE app_users SET is_active = 0 WHERE id = ?',
        [req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error deactivating user' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({
                success: true,
                message: 'User deactivated successfully'
            });
        }
    );
});

module.exports = router;
