import express from 'express';
import { getProducts, addProduct, updateProduct, deleteProduct, getProductById } from '../../controllers/ORM/productController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Public facing routes
router.get('/products', getProducts);
router.get('/product/:id', getProductById);

// Admin-only operations
router.post('/product', requireAuth, requireAdmin, addProduct);
router.put('/product/:id', requireAuth, requireAdmin, updateProduct);
router.delete('/product/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
