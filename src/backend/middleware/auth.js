const jwt = require('jsonwebtoken');
const config = require('../config/environment');

const adminAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                error: 'No token provided',
                message: 'Authorization token is required'
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ 
            error: 'Invalid token',
            message: error.message
        });
    }
};

const appAuth = (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        
        if (!apiKey) {
            return res.status(401).json({ 
                error: 'No API key provided'
            });
        }

        // API key validation should be done against database
        req.apiKey = apiKey;
        next();
    } catch (error) {
        res.status(401).json({ 
            error: 'Authentication failed'
        });
    }
};

module.exports = {
    adminAuth,
    appAuth
};
