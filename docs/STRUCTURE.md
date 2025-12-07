# VPN Configuration System - Project Structure

## Directory Organization

```
vpn/
├── src/                          # Source code
│   ├── backend/                  # Node.js/Express backend
│   │   ├── server.js             # Main server entry point
│   │   ├── package.json          # Backend dependencies
│   │   ├── routes/               # API endpoints
│   │   │   ├── auth.js           # Authentication routes
│   │   │   ├── config.js         # Configuration management
│   │   │   ├── users.js          # User management
│   │   │   ├── monitoring.js     # Activity monitoring
│   │   │   └── android.js        # Android app routes
│   │   ├── middleware/           # Express middleware
│   │   │   └── auth.js           # JWT authentication
│   │   ├── config/               # Configuration files
│   │   │   ├── database.js       # SQLite setup
│   │   │   └── environment.js    # Environment config
│   │   ├── controllers/          # Business logic (to be added)
│   │   └── models/               # Data models (to be added)
│   ├── frontend/                 # Web admin panel
│   │   ├── admin.html            # Main admin dashboard
│   │   ├── login.html            # Login page
│   │   ├── components/           # Reusable JavaScript modules
│   │   │   ├── api-service.js    # API client library
│   │   │   ├── auth-module.js    # Authentication handler
│   │   │   ├── page-manager.js   # Page navigation & loading
│   │   │   └── form-manager.js   # Form handling
│   │   ├── pages/                # Individual page components (to be added)
│   │   └── assets/               # Images, fonts, etc.
│   └── android/                  # Android app source
│       ├── app/                  # Java source files
│       │   ├── ApiClient.java    # Retrofit HTTP client setup
│       │   ├── ApiService.java   # API interface definitions
│       │   ├── VpnService.java   # VPN connection service
│       │   ├── models.java       # Data models
│       │   └── SharedPrefManager.java # Data storage
│       ├── config/               # Configuration files
│       │   └── app-config.json   # App configuration
│       └── build/                # Compiled APK files
├── database/                     # Data storage
│   └── vpn.db                    # SQLite database
├── scripts/                      # Installation & utility scripts
│   ├── install-server.sh         # Linux/macOS installation
│   └── install-server.bat        # Windows installation
├── docs/                         # Documentation
│   ├── README.md                 # Main documentation
│   ├── API.md                    # API reference
│   └── ARCHITECTURE.md           # System architecture (to be added)
├── README.md                     # Quick start guide
├── package.json                  # Root package.json
├── docker-compose.yml            # Docker container setup
├── Dockerfile                    # Docker image definition
├── .env.example                  # Environment variables template
└── .gitignore                    # Git ignore file
```

## Module Descriptions

### Backend Files

#### server.js
- Main Express server application
- Sets up routes and middleware
- Handles CORS and static file serving
- Initializes database connection

#### routes/auth.js
- Admin login endpoint
- App user login endpoint
- Token generation and validation

#### routes/config.js
- Create, read, update, delete configurations
- List all configurations
- Configuration retrieval for apps

#### routes/users.js
- Create app users
- List users per app
- Update user subscriptions
- Deactivate users

#### routes/monitoring.js
- Track user activities
- Get app statistics
- View domain and application access
- Bandwidth monitoring

#### routes/android.js
- Create Android app instances
- Generate unique API keys
- Manage app versions
- Handle APK downloads

#### middleware/auth.js
- JWT token verification
- Admin authentication
- App authentication via API key

#### config/database.js
- SQLite database initialization
- Table schema creation
- Database connection pooling

### Frontend Files

#### admin.html
- Main admin panel interface
- Dashboard with overview
- Configuration management section
- Android apps section
- User management section
- Activity monitoring section

#### login.html
- Admin login page
- Form validation
- Error handling

#### components/api-service.js
- Centralized API communication
- Token management
- Request/response handling
- Error handling

#### components/auth-module.js
- Login form handling
- Session management
- Logout functionality
- Authorization checks

#### components/page-manager.js
- Page navigation logic
- Data loading and display
- Tab management
- Notification system

#### components/form-manager.js
- Form submission handlers
- Validation
- API integration
- Error messages

### Android Files

#### ApiClient.java
- Retrofit setup
- HTTP interceptors
- Token injection
- Error handling

#### ApiService.java
- Retrofit service interface
- API endpoint definitions
- Request/response models

#### VpnService.java
- VPN connection logic
- Socket management
- Data tunneling
- Connection monitoring

#### SharedPrefManager.java
- Local data persistence
- Token storage
- User session data
- Settings management

## Data Flow

### User Registration & Login Flow
```
Android App → API Service → Backend Auth → JWT Token → Stored Locally
```

### Configuration Management Flow
```
Admin Panel → API Service → Backend Routes → Database → Response
```

### Activity Monitoring Flow
```
Android App → Activity Logger → Monitoring Endpoint → Database → Dashboard View
```

## Component Interaction

### Frontend Components
1. **auth-module.js** - Handles login and authentication
2. **api-service.js** - Communicates with backend
3. **page-manager.js** - Controls page display and transitions
4. **form-manager.js** - Processes form submissions

### Backend Routes
1. **auth.js** - User authentication
2. **config.js** - VPN configuration management
3. **users.js** - User account management
4. **monitoring.js** - Activity tracking
5. **android.js** - Android app management

### Database Tables
- admins: Administrator accounts
- configs: VPN/Proxy configurations
- android_apps: Android app instances
- app_users: User accounts per app
- user_activity: Activity logs

## Configuration Files

### .env
Environment variables for:
- Server port
- Database path
- JWT secrets
- API URLs
- Default credentials

### app-config.json (Android)
- App name and package
- API base URL
- Feature flags
- Permission settings
- SDK versions

## Workflow Example

1. **Setup**: Run installation script
2. **Access**: Go to admin panel
3. **Create Config**: Add VPN configuration
4. **Create App**: Generate Android app instance with API key
5. **Download**: Get APK file
6. **Create Users**: Add user accounts
7. **Monitor**: Track user activities in real-time

## Adding New Features

### To add a new configuration type:
1. Update backend database schema
2. Add API endpoint in routes/config.js
3. Update Android ApiService interface
4. Add VPN service handler in VpnService.java
5. Update admin panel forms

### To add monitoring features:
1. Add new logging endpoint in routes/monitoring.js
2. Update activity model in database.js
3. Create monitoring UI component
4. Add chart visualization to admin.html

### To add new API endpoints:
1. Create route handler in appropriate routes/ file
2. Add authentication middleware if needed
3. Implement database operations
4. Update API documentation
5. Add client method in api-service.js
