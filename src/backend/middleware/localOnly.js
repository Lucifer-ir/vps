module.exports = function(req, res, next) {
    // Get the public domain from environment (set by installer)
    const publicDomain = process.env.PUBLIC_DOMAIN;
    
    // Determine remote address (works with and without proxy)
    const remote = (req.ip || req.connection.remoteAddress || '').replace('::ffff:', '');
    const xff = req.headers['x-forwarded-for'];
    const host = req.hostname;

    // Helper to check if an IP is localhost
    const isLocalAddr = (ip) => {
        if (!ip) return false;
        return ip === '127.0.0.1' || ip === '::1' || ip === 'localhost';
    };

    // Allow localhost
    if (isLocalAddr(remote)) return next();

    // Check x-forwarded-for for localhost (behind proxy)
    if (xff) {
        const first = xff.split(',')[0].trim();
        if (isLocalAddr(first)) return next();
    }

    // Allow access if the request is from the public domain
    if (publicDomain && host === publicDomain) {
        return next();
    }

    // If no public domain set, restrict to localhost only
    if (!publicDomain) {
        return res.status(403).json({ error: 'Admin access is restricted to localhost' });
    }

    // Deny access from other sources
    res.status(403).json({ 
        error: 'Admin access is restricted. Use your configured domain or localhost.' 
    });
};
