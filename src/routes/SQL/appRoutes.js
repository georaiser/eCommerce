import express from 'express';
import { home } from '../../controllers/SQL/appController.js';

const router = express.Router();

//home
router.get('/', home);

// Global Login UI
router.get('/login', (req, res) => {
    res.render('login', { pageName: 'Login', layout: 'auth' });
});

//health check
router.get('/health', (req, res) => res.send('I AM ALIVE'));

export default router;
