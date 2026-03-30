import express from 'express';
import { getProducts, addProduct, updateProduct } from '../../controllers/ORM/productController.js';

const router = express.Router();

router.get('/products', getProducts);
router.post('/product', addProduct);
router.post('/product/:id', updateProduct)


export default router;
