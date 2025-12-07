# VPN Server Project

A comprehensive VPN Configuration Management System with Admin Panel, RESTful API, and Android App.

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- SQLite3
- For installation script: Linux/macOS or WSL on Windows

### Installation

#### Automatic Installation (Linux/macOS)
```bash
sudo bash scripts/install-server.sh
```

#### Manual Installation
```bash
# Install dependencies
cd src/backend
npm install

# Start server
npm start
```

### First Login
- **URL**: http://localhost:5000/admin
- **Username**: admin
- **Password**: admin123 (Change in production!)

## Quick Examples

### Create a VPN Configuration
1. Go to Admin Panel → Configurations
2. Fill in the form:
   - Name: "MyVPN"
   - Type: VPN
   - Server: vpn.example.com
   - Port: 1194
3. Click "Create"

### Create Android App Instance
1. Go to Admin Panel → Android Apps
2. Select the configuration you created
3. Enter app name and version
4. Click "Create App"
5. Download the APK

### Monitor Users
1. Go to Admin Panel → Monitoring
2. Select an app
3. View real-time activity, domains accessed, and bandwidth usage

## Key Features

- ✅ Multiple VPN configurations (VPN, Proxy, SOCKS)
- ✅ Create unique Android app instances per configuration
- ✅ User management with subscription tracking
- ✅ Real-time activity monitoring
- ✅ Bandwidth and domain tracking
- ✅ JWT authentication
- ✅ Responsive web interface
- ✅ Automatic server installation
- ✅ SQLite database (no external DB needed)

## Architecture

```
Client (Android App)
       ↓
  API Service Layer
       ↓
    Backend Server (Node.js/Express)
       ↓
    SQLite Database
       ↓
Admin Panel (Web Browser)
```

## Documentation

- [Full Documentation](docs/README.md)
- [API Reference](docs/API.md)

## Security Notes

⚠️ **Important for Production:**
1. Change default admin password in `.env`
2. Use strong JWT_SECRET
3. Enable HTTPS
4. Implement rate limiting
5. Add request validation
6. Use environment-specific configurations
7. Regularly backup database
8. Implement audit logging

## Support

For issues or questions, check the documentation or review the API examples.

## License

Proprietary - All Rights Reserved
