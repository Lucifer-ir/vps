const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get user activity
router.get('/user/:user_id', (req, res) => {
    db.all(
        `SELECT domain, application, connection_time, bytes_sent, bytes_received, status
         FROM user_activity WHERE app_user_id = ? ORDER BY created_at DESC LIMIT 100`,
        [req.params.user_id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({
                success: true,
                activities: rows,
                count: rows ? rows.length : 0
            });
        }
    );
});

// Get all activities for app
router.get('/app/:app_id', (req, res) => {
    db.all(
        `SELECT ua.id, ua.app_user_id, ua.domain, ua.application, ua.connection_time, 
                ua.bytes_sent, ua.bytes_received, ua.status, u.username
         FROM user_activity ua
         JOIN app_users u ON ua.app_user_id = u.id
         WHERE u.app_id = ? ORDER BY ua.created_at DESC LIMIT 500`,
        [req.params.app_id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({
                success: true,
                activities: rows,
                count: rows ? rows.length : 0
            });
        }
    );
});

// Get statistics for dashboard
router.get('/stats/app/:app_id', (req, res) => {
    db.get(
        `SELECT 
            COUNT(DISTINCT app_user_id) as total_active_users,
            COUNT(*) as total_connections,
            SUM(bytes_sent) as total_bytes_sent,
            SUM(bytes_received) as total_bytes_received
         FROM user_activity
         WHERE app_user_id IN (SELECT id FROM app_users WHERE app_id = ?)`,
        [req.params.app_id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({
                success: true,
                stats: row || { total_active_users: 0, total_connections: 0 }
            });
        }
    );
});

// Log user activity (called from Android app)
router.post('/log', (req, res) => {
    const { app_user_id, domain, application, bytes_sent, bytes_received, status } = req.body;

    if (!app_user_id || !domain) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    db.run(
        `INSERT INTO user_activity (app_user_id, domain, application, bytes_sent, bytes_received, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [app_user_id, domain, application, bytes_sent, bytes_received, status],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error logging activity' });
            }

            res.json({
                success: true,
                message: 'Activity logged successfully'
            });
        }
    );
});

module.exports = router;
