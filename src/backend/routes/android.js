const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create Android app instance
router.post('/create', authMiddleware.adminAuth, (req, res) => {
    const { config_id, app_name, version } = req.body;

    if (!config_id || !app_name || !version) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    const appId = uuidv4();
    const apiKey = 'key_' + uuidv4().replace(/-/g, '');

    db.run(
        `INSERT INTO android_apps (id, config_id, app_name, version, api_key)
         VALUES (?, ?, ?, ?, ?)`,
        [appId, config_id, app_name, version, apiKey],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error creating Android app' });
            }

            res.status(201).json({
                success: true,
                app: {
                    id: appId,
                    app_name,
                    version,
                    api_key: apiKey,
                    download_url: `/downloads/${appId}.apk`
                }
            });
        }
    );
});

// Get app details
router.get('/:app_id', (req, res) => {
    db.get(
        'SELECT id, app_name, version, api_key, download_url FROM android_apps WHERE id = ? AND is_active = 1',
        [req.params.app_id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!row) {
                return res.status(404).json({ error: 'App not found' });
            }

            res.json({
                success: true,
                app: row
            });
        }
    );
});

// Get all apps for admin
router.get('/admin/list', authMiddleware.adminAuth, (req, res) => {
    db.all(
        `SELECT a.id, a.app_name, a.version, a.api_key, a.download_url, a.created_at, c.name as config_name
         FROM android_apps a
         JOIN configs c ON a.config_id = c.id
         WHERE a.is_active = 1`,
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({
                success: true,
                apps: rows
            });
        }
    );
});

// Download APK
router.get('/download/:app_id', (req, res) => {
    const apkPath = path.join(__dirname, '../../android/build', `${req.params.app_id}.apk`);

    if (!fs.existsSync(apkPath)) {
        return res.status(404).json({
            error: 'APK file not found'
        });
    }

    res.download(apkPath);
});

// Verify API key
router.post('/verify-key', (req, res) => {
    const { api_key } = req.body;

    if (!api_key) {
        return res.status(400).json({ error: 'API key required' });
    }

    db.get(
        'SELECT id, app_name, version FROM android_apps WHERE api_key = ? AND is_active = 1',
        [api_key],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!row) {
                return res.status(401).json({
                    error: 'Invalid API key'
                });
            }

            res.json({
                success: true,
                app: row
            });
        }
    );
});

module.exports = router;
