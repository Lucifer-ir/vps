# VPN Configuration Server - Documentation

## Project Overview

This is a comprehensive VPN Configuration Management System with:
- **Admin Panel**: Web-based management interface
- **Backend API**: RESTful API for all operations
- **Android App**: Native Android application for users
- **Monitoring**: Real-time user activity tracking
- **Automatic Server Setup**: One-command installation

## Project Structure

```
vpn/
├── src/
│   ├── backend/              # Node.js/Express backend
│   │   ├── routes/           # API endpoints
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Data models
│   │   ├── middleware/       # Authentication, etc.
│   │   ├── config/           # Configuration files
│   │   └── server.js         # Main server file
│   ├── frontend/             # Admin panel
│   │   ├── components/       # Reusable JavaScript modules
│   │   ├── pages/            # Page components
│   │   ├── assets/           # Images, styles
│   │   ├── admin.html        # Admin dashboard
│   │   └── login.html        # Login page
│   └── android/              # Android app
│       ├── app/              # Java source files
│       ├── config/           # App configuration
│       └── build/            # Built APK files
├── database/                 # SQLite database
├── scripts/                  # Installation scripts
├── docs/                     # Documentation
└── .env.example              # Environment configuration template
```

## Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: SQLite3
- **Frontend**: HTML5 + Tailwind CSS + Vanilla JavaScript
- **Authentication**: JWT (JSON Web Tokens)
- **Android**: Java with Retrofit API client
- **Server Setup**: Bash/Batch scripts with systemd

## Installation

### Linux/macOS Server Installation

```bash
sudo chmod +x scripts/install-server.sh
sudo bash scripts/install-server.sh
```

### Windows Installation

```batch
scripts\install-server.bat
```

### Manual Installation

1. **Install Dependencies**
   ```bash
   cd src/backend
   npm install
   ```

2. **Create Environment File**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the Server**
   ```bash
   npm start
   # Development with auto-reload:
   npm run dev
   ```

4. **Access Admin Panel**
   - URL: `http://localhost:5000/admin`
   - Default Username: `admin`
   - Default Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/app/login` - App user login

### Configuration Management
- `POST /api/admin/config/create` - Create VPN config
- `GET /api/admin/config/list` - List all configs
- `GET /api/admin/config/:id` - Get specific config
- `PUT /api/admin/config/:id` - Update config
- `DELETE /api/admin/config/:id` - Delete config

### Android Apps
- `POST /api/android/create` - Create new app instance
- `GET /api/android/list` - List all apps
- `GET /api/android/:app_id` - Get app details
- `GET /api/android/download/:app_id` - Download APK

### User Management
- `POST /api/admin/users/create` - Create app user
- `GET /api/admin/users/app/:app_id` - List app users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Deactivate user

### Monitoring
- `GET /api/admin/monitoring/user/:user_id` - User activity
- `GET /api/admin/monitoring/app/:app_id` - App activity
- `GET /api/admin/monitoring/stats/app/:app_id` - Statistics
- `POST /api/admin/monitoring/log` - Log activity

## Features

### Admin Panel Features
1. **Dashboard**
   - Overview of configs and apps
   - Quick statistics

2. **Configuration Management**
   - Create/edit/delete VPN configurations
   - Support for VPN, Proxy, SOCKS protocols
   - Credential storage

3. **Android App Management**
   - Create app instances with unique API keys
   - Generate and distribute APK files
   - View app details and version info

4. **User Management**
   - Create users per app instance
   - Set subscription status and expiry
   - Password management

5. **Activity Monitoring**
   - Real-time user activity tracking
   - Domain and application monitoring
   - Bandwidth usage tracking
   - Connection status monitoring

### Android App Features
1. **User Authentication**
   - Secure login with username/password
   - JWT token-based sessions

2. **VPN Connection**
   - Direct connection to configured VPN
   - Multiple protocol support
   - Auto-reconnect capability

3. **Activity Monitoring**
   - Track visited domains
   - Monitor used applications
   - Report bandwidth usage

4. **Settings**
   - App configuration
   - Auto-connect options
   - Profile management

## Security Features

1. **Authentication**
   - JWT token-based authentication
   - Bcrypt password hashing
   - Session management

2. **API Security**
   - Token validation on protected routes
   - CORS protection
   - Request validation

3. **Database**
   - Parameterized queries (SQL injection prevention)
   - Secure credential storage
   - Audit logging

## Database Schema

### admins
- id, username, password, email, created_at, last_login

### configs
- id, name, type, server_address, port, protocol, credentials, is_active, created_at, updated_at

### android_apps
- id, config_id, app_name, version, build_number, download_url, api_key, is_active, created_at

### app_users
- id, username, password, email, app_id, subscription_status, expiry_date, is_active, created_at, last_login

### user_activity
- id, app_user_id, domain, application, connection_time, bytes_sent, bytes_received, status, created_at

## Configuration

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=production

# Security
JWT_SECRET=your-secret-key-here

# Database
DATABASE_PATH=./database/vpn.db

# API
API_BASE_URL=http://localhost:5000

# Admin Credentials
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
DEFAULT_ADMIN_EMAIL=admin@vpn.local
```

## Development

### Running in Development Mode

```bash
cd src/backend
npm run dev
```

### Testing the API

```bash
# Login
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# List configs
curl -X GET http://localhost:5000/api/admin/config/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Deployment

### Using Docker

```bash
# Build image
docker build -t vpn-server .

# Run container
docker run -p 5000:5000 -v vpn-db:/app/database vpn-server
```

### Using Systemd (Linux)

The installation script automatically creates a systemd service.

```bash
# Check status
sudo systemctl status vpn-server

# View logs
sudo journalctl -u vpn-server -f

# Restart
sudo systemctl restart vpn-server
```

## Troubleshooting

### Server Won't Start
- Check if port 5000 is already in use
- Verify Node.js is installed: `node --version`
- Check logs for errors

### Database Issues
- Ensure `/database` directory exists and is writable
- Check SQLite installation: `sqlite3 --version`

### API Connection Issues
- Verify backend is running on correct port
- Check firewall settings
- Ensure CORS is properly configured

## Support and Maintenance

### Regular Maintenance
- Monitor database size
- Check system logs regularly
- Update dependencies: `npm update`
- Backup database regularly

### Backup Strategy

```bash
# Backup database
cp database/vpn.db database/vpn.db.backup

# Backup configuration
cp .env .env.backup
```

## License

This project is proprietary and confidential.

## Contact

For support, contact: admin@vpn.local
