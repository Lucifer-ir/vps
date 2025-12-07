@echo off
REM VPN Server Installation Script for Windows
REM This script sets up the VPN Configuration Server

echo ==========================================
echo VPN Configuration Server Installation
echo ==========================================
echo.

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    exit /b 1
)

REM Create directories
set APP_DIR=%cd%\vpn-server
mkdir "%APP_DIR%"
mkdir "%APP_DIR%\database"
mkdir "%APP_DIR%\logs"

REM Copy backend files
echo Copying application files...
xcopy src\backend "%APP_DIR%" /E /I /Y

REM Install dependencies
echo Installing dependencies...
cd "%APP_DIR%"
call npm install

REM Create .env file
echo Creating configuration file...
(
    echo PORT=5000
    echo NODE_ENV=production
    echo JWT_SECRET=%RANDOM%%RANDOM%%RANDOM%%RANDOM%
    echo API_BASE_URL=http://localhost:5000
    echo DEFAULT_ADMIN_USERNAME=admin
    echo DEFAULT_ADMIN_PASSWORD=admin123
) > .env

echo.
echo ==========================================
echo Installation Complete!
echo ==========================================
echo To start the server, run:
echo   cd "%APP_DIR%"
echo   npm start
echo.
echo Admin Panel will be available at:
echo   http://localhost:5000/admin
echo.
echo Default Credentials:
echo   Username: admin
echo   Password: admin123
echo ==========================================
pause
