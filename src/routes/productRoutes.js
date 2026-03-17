/**
 * productRoutes.js — Maps HTTP endpoints to controller functions.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file is the "Menu" of the application. It runs on the SERVER (Express).
 * When an HTTP request comes in (from a browser or API client), the router
 * checks the URL and HTTP Method, and delegates the request to the correct
 * function in the Controller (`productController.js`).
 *
 * The router itself contains NO business logic or file system operations.
 */

import express from 'express';
import { getProducts, addProduct } from '../controllers/productController.js';

const router = express.Router();

/**
 * ROUTES
 * ──────
 * GET  /products -> Renders the HTML page with the list of products
 * POST /products -> Receives JSON data from the browser's form to add a new product
 */
router.get('/products', getProducts);
router.post('/products', addProduct);

export default router;
