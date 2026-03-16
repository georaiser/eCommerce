import express from 'express';
import { login, home } from '../controllers/appController.js';

const router = express.Router();

// Routes with controllers
router.get('/login', login);

router.get('/', home);

export default router;