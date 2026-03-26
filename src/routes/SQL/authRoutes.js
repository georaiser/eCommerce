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

// ROUTES
router.get('/login', login);
router.post('/register', register);
router.post('/logout', logout);

export default router;
