# VPN Configuration System - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Prepare the Server
```bash
# For Linux/macOS
sudo bash scripts/install-server.sh

# For Windows
scripts\install-server.bat
```

### Step 2: Access Admin Panel
```
URL: http://localhost:5000/admin
Username: admin
Password: admin123 (CHANGE THIS!)
```

### Step 3: Create Your First Configuration
1. Click "تنظیمات" (Configurations)
2. Fill in the form:
   - **نام تنظیم**: "My VPN"
   - **نوع**: "VPN"
   - **آدرس سرور**: "vpn.example.com"
   - **درگاه**: 1194
   - **پروتکل**: UDP
3. Click "ایجاد تنظیم" (Create Configuration)

### Step 4: Create Android App Instance
1. Click "برنامه‌های اندروید" (Android Apps)
2. Select the configuration you created
3. Enter app name: "MyVpnApp"
4. Enter version: "1.0.0"
5. Click "ایجاد برنامه" (Create App)
6. Click the download button to get the APK

### Step 5: Create Users
1. Click "کاربران" (Users)
2. Select your app
3. Add username and password
4. Set expiry date if needed
5. Click "ایجاد کاربر" (Create User)

### Step 6: Monitor Activity
1. Click "نظارت" (Monitoring)
2. Select an app
3. View real-time user activities

## 📁 Project Structure

```
vpn/
├── src/
│   ├── backend/          # Node.js API Server
│   ├── frontend/         # Admin Web Panel
│   └── android/          # Android App
├── database/             # SQLite Database
├── scripts/              # Installation scripts
├── docs/                 # Documentation
└── README.md             # Main guide
```

## 🔧 Configuration Files

### .env File
Located in project root. Contains:
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secret-key
DATABASE_PATH=./database/vpn.db
API_BASE_URL=http://localhost:5000
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
```

### Android Config
Located in `src/android/config/app-config.json`

## 🏗️ Architecture Overview

```
┌─────────────────────┐
│   Android Users     │
│   (APK App)         │
└──────────┬──────────┘
           │
           ├─────── Login with Username/Password
           │
           ├─────── Connect to VPN via API
           │
           └─────── Send Activity Logs
           
┌─────────────────────┐
│   REST API Server   │  ← Node.js/Express
│   :5000             │
└──────────┬──────────┘
           │
           ├─────── Authenticate Users
           │
           ├─────── Manage Configs
           │
           ├─────── Track Activities
           │
           └─────── Generate APKs
           
┌─────────────────────┐
│   SQLite Database   │
│   (Data Storage)    │
└─────────────────────┘

┌─────────────────────┐
│   Admin Web Panel   │  ← Browser
│   (Dashboard)       │
└─────────────────────┘
```

## 📊 Database Tables

### admins
- Admin user accounts
- Stores usernames and hashed passwords

### configs
- VPN/Proxy configurations
- Server addresses, ports, protocols
- Credentials for each config

### android_apps
- App instances created from configurations
- Each app has unique API key
- Tracks version and download URL

### app_users
- User accounts within each app
- Subscription status and expiry dates
- Password hashing for security

### user_activity
- Tracks all user activities
- Domains visited, applications used
- Bandwidth usage (sent/received)
- Connection timestamps

## 🔐 Security Features

✅ JWT Token-based authentication
✅ Bcrypt password hashing
✅ CORS protection
✅ SQL injection prevention
✅ API key validation for apps
✅ Session management

## 📱 Android App Features

After creating an APK and installing on your phone:

1. **Login Screen**
   - Enter username and password
   - Connects to specific app instance

2. **VPN Connection**
   - One-tap connect/disconnect
   - Shows connection status
   - Auto-reconnect on failure

3. **Activity Log**
   - Shows visited domains
   - Applications used
   - Connection history

4. **Settings**
   - Server configuration
   - Protocol selection
   - Auto-connect toggle

## 🌐 API Endpoints

### Public Endpoints
- `POST /api/auth/app/login` - App user login
- `POST /api/android/verify-key` - Verify API key

### Protected Endpoints (Admin)
- `POST /api/admin/config/create` - Create configuration
- `GET /api/admin/config/list` - List configurations
- `POST /api/android/create` - Create app instance
- `POST /api/admin/users/create` - Create user
- `GET /api/admin/monitoring/app/{id}` - Get activities

See [API.md](docs/API.md) for complete API documentation.

## 🛠️ Troubleshooting

### Issue: Server won't start
```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# If in use, change PORT in .env
```

### Issue: Database errors
```bash
# Database file might be locked
# Remove the database and restart (will recreate)
rm database/vpn.db
npm start
```

### Issue: Admin login fails
```bash
# Reset database with default admin
# Edit config/database.js to reset initial values
# Or delete database and recreate
```

## 📦 Dependencies

### Backend
- **express**: Web framework
- **sqlite3**: Database
- **jsonwebtoken**: Authentication
- **bcryptjs**: Password hashing
- **cors**: Cross-origin support
- **morgan**: Request logging

### Frontend
- **Tailwind CSS**: Styling
- **Chart.js**: Statistics charts
- **QRCode.js**: QR code generation

### Android
- **Retrofit**: HTTP client
- **OkHttp**: Network library
- **Gson**: JSON parsing

## 📞 Support

For issues:
1. Check documentation in `docs/` folder
2. Review API examples in `docs/API.md`
3. Check server logs for error messages
4. Ensure all services are running

## 🔄 Workflow Examples

### Creating a Multi-App Ecosystem
```
1. Create Config: "Premium VPN"
   ↓
2. Create App: "PremiumVPN_v1"
   ↓
3. Create App: "PremiumVPN_v2" (for new version)
   ↓
4. Add Users to each app
   ↓
5. Monitor both versions separately
```

### User Lifecycle
```
1. Admin creates user in app
   ↓
2. User receives credentials
   ↓
3. User installs APK on phone
   ↓
4. User logs in with credentials
   ↓
5. User connects to VPN
   ↓
6. Admin monitors user activity
   ↓
7. Admin can deactivate user if needed
```

## 🎯 Best Practices

✅ Change default admin password immediately
✅ Use strong JWT_SECRET (at least 32 characters)
✅ Regularly backup database
✅ Monitor system resources
✅ Keep users informed of server maintenance
✅ Use HTTPS in production
✅ Implement rate limiting
✅ Regular security audits

## 📈 Next Steps

1. ✅ Install and start server
2. ✅ Create configurations
3. ✅ Generate Android APKs
4. ✅ Test with test users
5. ✅ Monitor in production
6. ✅ Plan for scaling

## 📚 Additional Resources

- [Full Documentation](README.md)
- [API Reference](docs/API.md)
- [Project Structure](docs/STRUCTURE.md)

---

**Ready to go?** Start with the 5-minute setup above! 🚀
