import express from 'express';

//db shopping cart by each user
//import {getShoppingCart, addProductCart, updateProductCart, deleteProductCart } from '../controllers/cartController.js'
import { shoppingCart } from '../controllers/cartController.js';

const router = express.Router();

// Routes

router.get('/cart', shoppingCart);
// router.post('/productcart', addProductCart);
// router.put('/productcart/:id', updateProductCart); //Amount
// router.delete('/productcart/:id', deleteProductCart);

export default router
