import jwt from 'jsonwebtoken';

// 1. Enforces user is logged in (Forces Redirect to Login Screen if unauthorized)
export const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.redirect('/login');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Bind { id, role } to the request dynamically!
        next();
    } catch (err) {
        res.clearCookie('jwt'); // Nuke the corrupted cookie logic automatically!
        res.redirect('/login');
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
