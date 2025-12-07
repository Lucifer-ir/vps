#!/usr/bin/env node

/**
 * Database initialization and admin seeding script
 * Run this after npm install to initialize the database with tables and default admin
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcryptjs = require('bcryptjs');

const dbPath = path.join(__dirname, '../database/vpn.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Admin users table
            db.run(`
                CREATE TABLE IF NOT EXISTS admins (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_login DATETIME
                )
            `, (err) => {
                if (err && !err.message.includes('already exists')) console.error('Error creating admins table:', err);
            });

            // Configs table
            db.run(`
                CREATE TABLE IF NOT EXISTS configs (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL,
                    server_address TEXT NOT NULL,
                    port INTEGER NOT NULL,
                    protocol TEXT,
                    credentials TEXT,
                    is_active BOOLEAN DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err && !err.message.includes('already exists')) console.error('Error creating configs table:', err);
            });

            // Android apps table
            db.run(`
                CREATE TABLE IF NOT EXISTS android_apps (
                    id TEXT PRIMARY KEY,
                    config_id TEXT NOT NULL,
                    app_name TEXT NOT NULL,
                    version TEXT NOT NULL,
                    build_number INTEGER,
                    download_url TEXT,
                    api_key TEXT UNIQUE NOT NULL,
                    is_active BOOLEAN DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (config_id) REFERENCES configs(id)
                )
            `, (err) => {
                if (err && !err.message.includes('already exists')) console.error('Error creating android_apps table:', err);
            });

            // App users table
            db.run(`
                CREATE TABLE IF NOT EXISTS app_users (
                    id TEXT PRIMARY KEY,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL,
                    email TEXT,
                    app_id TEXT NOT NULL,
                    subscription_status TEXT DEFAULT 'active',
                    expiry_date DATETIME,
                    is_active BOOLEAN DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_login DATETIME,
                    FOREIGN KEY (app_id) REFERENCES android_apps(id)
                )
            `, (err) => {
                if (err && !err.message.includes('already exists')) console.error('Error creating app_users table:', err);
            });

            // User activity table
            db.run(`
                CREATE TABLE IF NOT EXISTS user_activity (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    app_id TEXT NOT NULL,
                    action TEXT NOT NULL,
                    site_name TEXT,
                    app_name TEXT,
                    ip_address TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES app_users(id),
                    FOREIGN KEY (app_id) REFERENCES android_apps(id)
                )
            `, (err) => {
                if (err && !err.message.includes('already exists')) console.error('Error creating user_activity table:', err);
            });

            // API logs table
            db.run(`
                CREATE TABLE IF NOT EXISTS api_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    endpoint TEXT NOT NULL,
                    method TEXT NOT NULL,
                    user_id TEXT,
                    status_code INTEGER,
                    response_time_ms INTEGER,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err && !err.message.includes('already exists')) console.error('Error creating api_logs table:', err);
                // All tables created, now seed admin user
                seedAdminUser();
            });
        });
    });
}

function seedAdminUser() {
    // Get admin password from environment or generate one
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@12345';
    
    // Hash the password with bcrypt
    bcryptjs.hash(adminPassword, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            db.close();
            process.exit(1);
        }

        // Insert or ignore admin user
        db.run(
            `INSERT OR IGNORE INTO admins (username, password, email) VALUES (?, ?, ?)`,
            ['admin', hashedPassword, 'admin@vpn.local'],
            function(err) {
                if (err) {
                    console.error('Error seeding admin user:', err);
                } else {
                    console.log('✓ Database initialized successfully');
                    console.log(`✓ Admin user created (username: admin)`);
                    if (this.changes === 0) {
                        console.log('  Note: Admin user already exists');
                    } else {
                        console.log(`  Default password: ${adminPassword}`);
                    }
                }
                db.close();
                process.exit(0);
            }
        );
    });
}

// Start initialization
initializeDatabase().catch(err => {
    console.error('Fatal error:', err);
    db.close();
    process.exit(1);
});
