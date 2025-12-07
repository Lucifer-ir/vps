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

## نصب و فعال‌سازی سرور (Server Installation & Activation)

در این بخش دستورالعمل‌های گام‌به‌گام برای نصب، فعال‌سازی و راه‌اندازی سرویس سرور روی ماشین محلی یا سرور مجازی آورده شده است.

1) نصب خودکار (Linux / macOS)

```bash
# اجرای اسکریپت نصب خودکار (نیاز به sudo)
sudo bash scripts/install-server.sh
```

اسکریپت `install-server.sh` به‌طور خودکار:
- وابستگی‌های سیستم را نصب می‌کند (Node.js، npm و ...)
- کد را در مسیر `/opt/vpn-server` قرار می‌دهد (یا مسیر اسکریپت)
- فایل `.env` را با یک `JWT_SECRET` و رمز ادمین تولید می‌کند
- سرویس systemd به نام `vpn-server` می‌سازد و آن را راه‌اندازی می‌کند

پس از پایان نصب، لینک ورود ادمین معمولاً به‌صورت زیر خواهد بود:

```
http://<SERVER_IP>:5000/admin
```

دستوراتی برای بررسی وضعیت سرویس (Linux/systemd):

```bash
# وضعیت سرویس
sudo systemctl status vpn-server

# مشاهده لاگ‌ها
sudo journalctl -u vpn-server -f

# ری‌استارت سرویس
sudo systemctl restart vpn-server
```

2) نصب خودکار (Windows)

```powershell
# اجرای اسکریپت نصب bat در پاورشل
scripts\install-server.bat
```

3) شروع دستی (همه پلتفرم‌ها)

```bash
# در صورت نیاز به نصب دستی:
cd src/backend
npm install
npm start
```

برای اجرای در محیط توسعه با بازبارگذاری خودکار (نیاز به nodemon):

```bash
cd src/backend
npm run dev
```

4) مقداردهی اولیه‌ی ادمین (در صورت نیاز)

اگر اسکریپت نصب ادمین را مقداردهی نکرد، می‌توانید با استفاده از `sqlite3` یک ادمین دستی اضافه کنید:

```bash
# وارد پوشه پروژه شوید و سپس:
sqlite3 database/vpn.db

# داخل محیط sqlite اجرا کنید (یک هش bcrypt معتبر لازم است یا رمز را هَش کنید):
INSERT INTO admins (username, password, email) VALUES ('admin', '<bcrypt_hashed_password>', 'admin@vpn.local');
.quit
```

نکته: برای تولید هش bcrypt می‌توانید از Node.js REPL یا یک اسکریپت کوچک استفاده کنید:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('yourPassword',10,(e,h)=>console.log(h));"
```

5) پیدا کردن لینک ورود ادمین و آدرس سرور

برای یافتن IP سرور روی لینوکس/ویندوز:

Linux/macOS:
```bash
hostname -I | awk '{print $1}'
```

Windows (PowerShell):
```powershell
(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Ethernet*').IPAddress
```

6) تغییر گذرواژه و امنیت

بعد از ورود اولیه حتماً:
- رمز پیش‌فرض را عوض کنید
- متغیر `JWT_SECRET` را در `.env` تغییر دهید
- فعال‌سازی HTTPS (مثلاً با nginx و Let's Encrypt)

7) کامیت و ارسال تغییرات به گیت‌هاب

پس از اصلاح `README.md` محلی، این دستورات را در PowerShell اجرا کنید تا تغییرات به مخزن گیت‌هاب ارسال شوند:

```powershell
git add README.md
git commit -m "Add server installation and activation instructions"
git push origin main
```

اگر احراز هویت لازم است، مطمئن شوید که کلید SSH یا Personal Access Token برای گیت‌هاب تنظیم شده است.

---
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
