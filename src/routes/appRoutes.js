/**
 * appRoutes.js — Maps top-level global HTTP endpoints.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file acts as the "Menu" for general, non-resource-specific routes
 * (like the home page, terms of service, etc). 
 * 
 * It delegates the actual rendering logic to `appController.js`.
 */

import express from 'express';
import { home } from '../controllers/appController.js';

const router = express.Router();

/**
 * ROUTES
 * ──────
 * GET / -> Renders the main dashboard/home page
 */
router.get('/', home);

export default router;