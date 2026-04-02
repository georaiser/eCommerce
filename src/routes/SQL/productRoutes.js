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

// json file products
//import { getProducts, addProduct, deleteProduct, updateProduct } from '../controllers/productController_json.js';

// db postgresql products
import { getProductsDB, addProductDB, updateProductDB, deleteProductDB, getProductByIdDB } from '../../controllers/SQL/productController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

// ROUTES

// Secure Product Management (Admin Only) - Cart natively contains the storefront!
router.get('/products', requireAuth, requireAdmin, getProductsDB);
router.get('/product/:id', requireAuth, requireAdmin, getProductByIdDB); 
router.post('/product', requireAuth, requireAdmin, addProductDB);
router.put('/product/:id', requireAuth, requireAdmin, updateProductDB);
router.delete('/product/:id', requireAuth, requireAdmin, deleteProductDB);

export default router;
