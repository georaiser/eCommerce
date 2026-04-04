/**
 * authController.js — Server-side handlers for authentication.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file handles user authentication (login, registration, logout).
 * It sits between `authRoutes.js` and the data layer.
 * 
 * Unlike other controllers that render inside the main layout, the login
 * page often uses a dedicated, simpler layout (auth.hbs).
 */

import { pool } from '../../config/SQL/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// GET /login page
const loginPage = (req, res) => {
    res.render('login', { pageName: 'Login', layout: 'auth' });
};

// POST /login
// change the HTML form action to action="/sql/auth/login" to use this controller (src/views/login.hbs)
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        //console.log(rows);
        if (rows.length === 0) {return res.status(401).send('Invalid email or password.')};
        const user = rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {return res.status(401).send('Invalid email or password.')};

        // Token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie('jwt', token, { httpOnly: true, secure: false }); // secure: false for localhost dev
        
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Login error: ' + err.message);
    }
};

// POST /register
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 8);
        await pool.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [name, email, hashed, 'user']);
        res.send('Registration successful!');
    } catch (err) {
        res.status(500).send('Error registering: ' + err.message);
    }
}

// GET /logout
const logout = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
}

export { loginPage, login, register, logout };