import express from 'express';
import { home } from '../controllers/appController.js';

const router = express.Router();

//home
router.get('/', home);

//health check
router.get('/health', (req, res) => res.send('OK'));

export default router;



/**
 * GET /about-us
 * GET /contact
 * GET /privacy-policy
 * GET /faq
 */