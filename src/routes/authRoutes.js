/**
 * authRoutes.js — Maps authentication HTTP endpoints.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file acts as the "Menu" for authentication operations (login, register). 
 * It delegates the actual processing to `authController.js`.
 */

import express from 'express';
import { login, register, logout } from '../controllers/authController.js';

const router = express.Router();

/**
 * ROUTES
 * ──────
 * GET  /login    -> Renders the login page
 * POST /register -> (Planned) Handles user registration
 * POST /logout   -> (Planned) Logs the user out
 */
router.get('/login', login);

// TODO: Map register and logout routes once UI is ready
// router.post('/register', register);
// router.post('/logout', logout);

export default router;
