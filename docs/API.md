# VPN Configuration - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Login and Get Token

#### Admin Login
```http
POST /auth/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "admin",
    "email": "admin@vpn.local"
  }
}
```

#### App User Login
```http
POST /auth/app/login
Content-Type: application/json

{
  "username": "user",
  "password": "password",
  "app_id": "app-uuid"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "username": "user",
    "subscription_status": "active",
    "expiry_date": "2025-12-31"
  }
}
```

## Configuration Management

### Create Configuration
```http
POST /admin/config/create
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Free VPN",
  "type": "vpn",
  "server_address": "vpn.example.com",
  "port": 1194,
  "protocol": "UDP",
  "credentials": {
    "username": "optional_user",
    "password": "optional_pass"
  }
}

Response:
{
  "success": true,
  "config": {
    "id": "config-uuid",
    "name": "Free VPN",
    "type": "vpn",
    "server_address": "vpn.example.com",
    "port": 1194
  }
}
```

### List Configurations
```http
GET /admin/config/list
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "configs": [
    {
      "id": "config-uuid",
      "name": "Free VPN",
      "type": "vpn",
      "server_address": "vpn.example.com",
      "port": 1194,
      "protocol": "UDP",
      "is_active": true,
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### Get Configuration
```http
GET /admin/config/{config_id}
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "config": {
    "id": "config-uuid",
    "name": "Free VPN",
    "type": "vpn",
    "server_address": "vpn.example.com",
    "port": 1194,
    "protocol": "UDP",
    "credentials": "{...}",
    "is_active": true,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

### Update Configuration
```http
PUT /admin/config/{config_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Free VPN Updated",
  "server_address": "vpn-new.example.com",
  "port": 1195,
  "protocol": "TCP",
  "credentials": {...}
}

Response:
{
  "success": true,
  "message": "Configuration updated successfully"
}
```

### Delete Configuration
```http
DELETE /admin/config/{config_id}
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Configuration deleted successfully"
}
```

## Android App Management

### Create Android App
```http
POST /android/create
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "config_id": "config-uuid",
  "app_name": "My VPN App",
  "version": "1.0.0"
}

Response:
{
  "success": true,
  "app": {
    "id": "app-uuid",
    "app_name": "My VPN App",
    "version": "1.0.0",
    "api_key": "key_xxxxxxxxxxxxxxxx",
    "download_url": "/downloads/app-uuid.apk"
  }
}
```

### List Android Apps
```http
GET /android/admin/list
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "apps": [
    {
      "id": "app-uuid",
      "app_name": "My VPN App",
      "version": "1.0.0",
      "api_key": "key_xxxx",
      "config_name": "Free VPN",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### Get App Details
```http
GET /android/{app_id}

Response:
{
  "success": true,
  "app": {
    "id": "app-uuid",
    "app_name": "My VPN App",
    "version": "1.0.0",
    "api_key": "key_xxxx"
  }
}
```

### Download APK
```http
GET /android/download/{app_id}

Response: APK binary file
```

### Verify API Key
```http
POST /android/verify-key
Content-Type: application/json

{
  "api_key": "key_xxxxxxxxxxxxxxxx"
}

Response:
{
  "success": true,
  "app": {
    "id": "app-uuid",
    "app_name": "My VPN App",
    "version": "1.0.0"
  }
}
```

## User Management

### Create App User
```http
POST /admin/users/create
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "username": "john",
  "password": "secure_password",
  "email": "john@example.com",
  "app_id": "app-uuid",
  "expiry_date": "2025-12-31"
}

Response:
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "username": "john",
    "email": "john@example.com",
    "app_id": "app-uuid"
  }
}
```

### List App Users
```http
GET /admin/users/app/{app_id}
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "users": [
    {
      "id": "user-uuid",
      "username": "john",
      "email": "john@example.com",
      "subscription_status": "active",
      "expiry_date": "2025-12-31",
      "last_login": "2024-01-15T10:30:00Z",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ],
  "count": 1
}
```

### Get User Details
```http
GET /admin/users/{user_id}
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "username": "john",
    "email": "john@example.com",
    "app_id": "app-uuid",
    "subscription_status": "active",
    "expiry_date": "2025-12-31",
    "last_login": "2024-01-15T10:30:00Z"
  }
}
```

### Update User
```http
PUT /admin/users/{user_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "subscription_status": "inactive",
  "expiry_date": "2026-12-31"
}

Response:
{
  "success": true,
  "message": "User updated successfully"
}
```

### Deactivate User
```http
DELETE /admin/users/{user_id}
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "User deactivated successfully"
}
```

## Activity Monitoring

### Get User Activity
```http
GET /admin/monitoring/user/{user_id}
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "activities": [
    {
      "domain": "example.com",
      "application": "Chrome",
      "connection_time": "2024-01-15T10:30:00Z",
      "bytes_sent": 1024,
      "bytes_received": 2048,
      "status": "active"
    }
  ],
  "count": 1
}
```

### Get App Activity
```http
GET /admin/monitoring/app/{app_id}
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "activities": [
    {
      "app_user_id": "user-uuid",
      "username": "john",
      "domain": "example.com",
      "application": "Chrome",
      "connection_time": "2024-01-15T10:30:00Z",
      "bytes_sent": 1024,
      "bytes_received": 2048,
      "status": "active"
    }
  ],
  "count": 10
}
```

### Get App Statistics
```http
GET /admin/monitoring/stats/app/{app_id}
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "stats": {
    "total_active_users": 5,
    "total_connections": 150,
    "total_bytes_sent": 1024000,
    "total_bytes_received": 2048000
  }
}
```

### Log User Activity
```http
POST /admin/monitoring/log
Content-Type: application/json

{
  "app_user_id": "user-uuid",
  "domain": "example.com",
  "application": "Chrome",
  "bytes_sent": 512,
  "bytes_received": 1024,
  "status": "active"
}

Response:
{
  "success": true,
  "message": "Activity logged successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token",
  "message": "Token expired"
}
```

### 404 Not Found
```json
{
  "error": "Configuration not found"
}
```

### 500 Server Error
```json
{
  "error": "Database error"
}
```

## Rate Limiting

- No rate limiting currently implemented
- Recommended: Implement rate limiting for production

## Pagination

Not yet implemented. Consider adding pagination for endpoints returning large datasets.

## Versioning

Current API version: v1
