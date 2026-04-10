import express from 'express';
import { getProducts, addProduct, updateProduct, deleteProduct, renderEditProduct, getProductById } from '../../controllers/ORM/productController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Secure Product Management (Admin Only) - Cart natively contains the storefront!
router.get('/products', requireAuth, requireAdmin, getProducts);
router.get('/product/:id', requireAuth, requireAdmin, getProductById);
router.post('/products', requireAuth, requireAdmin, addProduct);
router.get('/product-edit/:id', requireAuth, requireAdmin, renderEditProduct); // render edit page
router.post('/product-update/:id', requireAuth, requireAdmin, updateProduct); // update product
router.post('/product-delete/:id', requireAuth, requireAdmin, deleteProduct); // delete product

export default router;
