module.exports = {
    // Server Configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    JWT_EXPIRE: '24h',
    
    // Database
    DATABASE_PATH: process.env.DATABASE_PATH || './database/vpn.db',
    
    // Android Configuration
    ANDROID_BUILD_PATH: './src/android/build',
    ANDROID_VERSION: '1.0.0',
    
    // API Configuration
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
    
    // Admin Configuration
    DEFAULT_ADMIN_USERNAME: 'admin',
    DEFAULT_ADMIN_PASSWORD: 'admin123', // Change this in production
    DEFAULT_ADMIN_EMAIL: 'admin@vpn.local'
};
