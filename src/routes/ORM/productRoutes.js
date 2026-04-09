import express from 'express';
import { getProducts, addProduct, updateProduct, deleteProduct, getProductById } from '../../controllers/ORM/productController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Secure Product Management (Admin Only) - Cart natively contains the storefront!
router.get('/products', requireAuth, requireAdmin, getProducts);
router.get('/product/:id', requireAuth, requireAdmin, getProductById);
router.post('/products', requireAuth, requireAdmin, addProduct);
router.put('/product/:id', requireAuth, requireAdmin, updateProduct);
router.post('/product/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
