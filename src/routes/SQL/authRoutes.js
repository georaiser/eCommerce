/**
 * authRoutes.js — Maps authentication HTTP endpoints.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file acts as the "Menu" for authentication operations (login, register). 
 * It delegates the actual processing to `authController.js`.
 */

import express from 'express';
import { loginPage, login, register, logout } from '../../controllers/SQL/authController.js';

const router = express.Router();

// ROUTES
router.get('/login', loginPage);
router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);

export default router;
