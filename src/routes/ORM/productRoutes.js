import express from 'express';
import { getProducts, addProduct, updateProduct, deleteProduct, getProductById } from '../../controllers/ORM/productController.js';

const router = express.Router();

router.get('/products', getProducts);
router.post('/product', addProduct);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);
router.get('/product/:id', getProductById);

export default router;
