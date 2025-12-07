#!/bin/bash

# VPN Server Auto-Installation Script
# This script sets up the VPN Configuration Server on Linux

set -e

echo "=========================================="
echo "VPN Configuration Server Auto-Installation"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "This script must be run as root"
    exit 1
fi

# Update system
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install Node.js and npm
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install required packages
echo "Installing required packages..."
apt-get install -y curl wget git

# Create app directory
APP_DIR="/opt/vpn-server"
mkdir -p $APP_DIR
cd $APP_DIR

# Copy application files
echo "Setting up application..."
cp -r /tmp/vpn-backend/* .

# Install dependencies
echo "Installing Node dependencies..."
npm install

# Create database directory
mkdir -p ./database

# Create .env file
echo "Creating configuration..."
cat > .env << EOF
PORT=5000
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)
API_BASE_URL=http://localhost:5000
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=$(openssl rand -base64 12)
EOF

# Set permissions
chown -R nobody:nogroup $APP_DIR
chmod -R 755 $APP_DIR

# Create systemd service
echo "Creating systemd service..."
cat > /etc/systemd/system/vpn-server.service << EOF
[Unit]
Description=VPN Configuration Server
After=network.target

[Service]
Type=simple
User=nobody
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node $APP_DIR/server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl daemon-reload
systemctl enable vpn-server
systemctl start vpn-server

# Wait for service to start
sleep 3

# Initialize admin user
echo "Initializing admin user..."
sqlite3 $APP_DIR/database/vpn.db << EOF
INSERT OR IGNORE INTO admins (username, password, email) 
VALUES ('admin', '\$2b\$10\$example_hash', 'admin@vpn.local');
EOF

# Display login information
ADMIN_PASSWORD=$(grep DEFAULT_ADMIN_PASSWORD .env | cut -d= -f2)
ADMIN_IP=$(hostname -I | awk '{print $1}')
LOGIN_URL="http://$ADMIN_IP:5000/admin"

echo ""
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo "Admin Panel URL: $LOGIN_URL"
echo "Default Username: admin"
echo "Default Password: Check .env file"
echo "Database: $APP_DIR/database/vpn.db"
echo ""
echo "Service Status:"
systemctl status vpn-server --no-pager
echo ""
echo "To view logs: journalctl -u vpn-server -f"
echo "=========================================="
