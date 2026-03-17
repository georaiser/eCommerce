/**
 * authController.js — Server-side handlers for authentication.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file handles user authentication (login, registration, logout).
 * It sits between `authRoutes.js` and the data layer (users.json for now).
 * 
 * Unlike other controllers that render inside the main layout, the login
 * page often uses a dedicated, simpler layout (e.g., no sidebar/nav).
 */

/**
 * GET /login
 * Renders the login page using the special 'auth' layout.
 */
const login = (req, res) => {
    res.render('login', { pageName: 'Login', layout: 'auth' });
};

/**
 * POST /register (Planned)
 * Will handle creating a new user account and hashing the password.
 */
const register = (req, res) => {
    res.send('Register');
};

/**
 * POST /logout (Planned)
 * Will clear the user's session or JWT cookie.
 */
const logout = (req, res) => {
    res.send('Logout');
};

export { login, register, logout };