import express from 'express';
import { loginPage, login, register, logout } from '../../controllers/ORM/authController.js';

const router = express.Router();

// ROUTES
router.get('/login', loginPage);
router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);

export default router;
