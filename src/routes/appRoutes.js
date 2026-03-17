import express from 'express';
import { home } from '../controllers/appController.js';

const router = express.Router();

// Routes with controllers
router.get('/', home);

export default router;