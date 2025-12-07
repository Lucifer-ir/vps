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

# Optional: first argument may be the public domain the server will be reachable at
PUBLIC_DOMAIN="$1"

# Update system
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install required packages (ensure curl/git exist before using them)
echo "Installing required packages..."
apt-get install -y curl wget git ca-certificates openssl sqlite3

# Install Node.js and npm
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Create app directory
APP_DIR="/opt/vpn-server"
mkdir -p $APP_DIR
cd $APP_DIR

# Ensure application files are present in /tmp/vpn-backend
if [ ! -d /tmp/vpn-backend ]; then
    echo "Downloading application files to /tmp/vpn-backend..."
    if command -v git >/dev/null 2>&1; then
        git clone https://github.com/Lucifer-ir/vps.git /tmp/vpn-backend || { echo "git clone failed"; exit 1; }
    else
        echo "git not available to fetch repository. Please place backend files in /tmp/vpn-backend and re-run.";
        exit 1
    fi
fi

# Locate backend source inside the downloaded repo
if [ -d /tmp/vpn-backend/src/backend ]; then
    SRC_PATH="/tmp/vpn-backend/src/backend"
elif [ -f /tmp/vpn-backend/server.js ]; then
    SRC_PATH="/tmp/vpn-backend"
else
    echo "Cannot find backend files in /tmp/vpn-backend. Listing contents for debugging:";
    ls -la /tmp/vpn-backend || true
    exit 1
fi

echo "Setting up application from $SRC_PATH..."
cp -r "$SRC_PATH/"* .

# Install dependencies
echo "Installing Node dependencies..."
npm install

# Create database directory
mkdir -p ./database

# Create .env file
echo "Creating configuration..."
if [ -n "$PUBLIC_DOMAIN" ]; then
    API_BASE_URL_VAL="https://$PUBLIC_DOMAIN"
else
    API_BASE_URL_VAL="http://localhost:5000"
fi

cat > .env << EOF
PORT=5000
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)
API_BASE_URL=$API_BASE_URL_VAL
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=$(openssl rand -base64 12)
PUBLIC_DOMAIN=$PUBLIC_DOMAIN
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

# Read default password from .env so we can show it to the installer
DEFAULT_PASS=$(grep '^DEFAULT_ADMIN_PASSWORD=' .env | cut -d= -f2-)

# Display login information
ADMIN_PASSWORD=$(grep DEFAULT_ADMIN_PASSWORD .env | cut -d= -f2)
ADMIN_IP=$(hostname -I | awk '{print $1}')
if [ -n "$PUBLIC_DOMAIN" ]; then
    LOGIN_URL="https://$PUBLIC_DOMAIN/admin"
else
    LOGIN_URL="http://$ADMIN_IP:5000/admin"
fi

echo ""
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo "Admin Panel URL: $LOGIN_URL"
echo "Default Username: admin"
echo "Default Password: $DEFAULT_PASS"
echo "Database: $APP_DIR/database/vpn.db"
echo ""
echo "Service Status:"
systemctl status vpn-server --no-pager
echo ""
echo "To view logs: journalctl -u vpn-server -f"
echo "=========================================="
