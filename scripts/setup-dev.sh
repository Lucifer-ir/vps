#!/bin/bash

# Development Setup Script
# Sets up the development environment

echo "Setting up VPN Configuration System..."

# Backend setup
echo "Installing backend dependencies..."
cd src/backend
npm install
cd ../../

# Create necessary directories
mkdir -p database
mkdir -p logs

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "To start development:"
echo "  cd src/backend"
echo "  npm run dev"
echo ""
echo "Admin Panel: http://localhost:5000/admin"
echo "=========================================="
