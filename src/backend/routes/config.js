const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const router = express.Router();

// Create VPN Configuration
router.post('/create', (req, res) => {
    const { name, type, server_address, port, protocol, credentials } = req.body;

    if (!name || !type || !server_address || !port) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    const configId = uuidv4();

    db.run(
        `INSERT INTO configs (id, name, type, server_address, port, protocol, credentials)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [configId, name, type, server_address, port, protocol, JSON.stringify(credentials)],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error creating configuration' });
            }

            res.status(201).json({
                success: true,
                config: { id: configId, name, type, server_address, port }
            });
        }
    );
});

// Get all configurations
router.get('/list', (req, res) => {
    db.all('SELECT * FROM configs WHERE is_active = 1', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        res.json({
            success: true,
            configs: rows
        });
    });
});

// Get specific configuration
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM configs WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Configuration not found' });
        }

        res.json({
            success: true,
            config: row
        });
    });
});

// Update configuration
router.put('/:id', (req, res) => {
    const { name, server_address, port, protocol, credentials } = req.body;

    db.run(
        `UPDATE configs SET name = ?, server_address = ?, port = ?, protocol = ?, 
         credentials = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [name, server_address, port, protocol, JSON.stringify(credentials), req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error updating configuration' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Configuration not found' });
            }

            res.json({
                success: true,
                message: 'Configuration updated successfully'
            });
        }
    );
});

// Delete configuration
router.delete('/:id', (req, res) => {
    db.run(
        'UPDATE configs SET is_active = 0 WHERE id = ?',
        [req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error deleting configuration' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Configuration not found' });
            }

            res.json({
                success: true,
                message: 'Configuration deleted successfully'
            });
        }
    );
});

module.exports = router;
