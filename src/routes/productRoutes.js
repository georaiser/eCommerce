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
import { getProducts, addProduct, deleteProduct, updateProduct } from '../controllers/productController.js';
// db postgresql products
import { getProductsDB, addProductDB, updateProductDB, deleteProductDB, getProductByIdDB } from '../controllers/productController_db.js';

const router = express.Router();

// ROUTES

//CRUD operations with json file
router.get('/products', getProducts);
router.post('/products', addProduct);
router.delete('/product/:id', deleteProduct);
router.put('/product/:id', updateProduct);


//CRUD operations with db postgresql
router.get('/db/products', getProductsDB);
router.post('/db/products', addProductDB);
router.put('/db/products/:id', updateProductDB);
router.delete('/db/products/:id', deleteProductDB);
router.get('/db/products/:id', getProductByIdDB);


export default router;
