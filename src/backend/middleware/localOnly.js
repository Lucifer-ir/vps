module.exports = function(req, res, next) {
    // Determine remote address (works with and without proxy)
    const remote = (req.ip || req.connection.remoteAddress || '').replace('::ffff:', '');
    const xff = req.headers['x-forwarded-for'];

    // Helper to check if an IP is localhost
    const isLocalAddr = (ip) => {
        if (!ip) return false;
        return ip === '127.0.0.1' || ip === '::1' || ip === 'localhost';
    };

    if (isLocalAddr(remote)) return next();

    if (xff) {
        // x-forwarded-for may contain a chain; check first entry
        const first = xff.split(',')[0].trim();
        if (isLocalAddr(first)) return next();
    }

    // Not local — deny access
    res.status(403).json({ error: 'Admin access is restricted to localhost' });
};
