import jwt from 'jsonwebtoken';

// 1. Enforces user is logged in
export const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).send('Access denied. Please login to continue.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Bind { id, role } to the request dynamically!
        next();
    } catch (err) {
        res.status(400).send('Invalid or expired authentication cookie.');
    }
};

// 2. Enforces user is an admin (MUST run AFTER requireAuth)
export const requireAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).send('Authentication missing.');
    if (req.user.role !== 'admin') {
        return res.status(403).send('Forbidden! Administrator privileges required.');
    }
    next();
};
