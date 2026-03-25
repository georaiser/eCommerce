import express from 'express';

//db shopping cart by each user
//import {getShoppingCart, addProductCart, updateProductCart, deleteProductCart } from '../controllers/cartController.js'
import { shoppingCart, addProductToCart, updateCartItemQuantity, removeCartItem, clearCartItems, getCartItemsTotal, getCartItemCount } from '../controllers/cartController.js';

const router = express.Router();

// Routes
router.get('/cart', shoppingCart);
router.post('/cart', addProductToCart);
router.put('/cart/:id', updateCartItemQuantity);
router.delete('/cart/:id', removeCartItem);
router.delete('/cart', clearCartItems);
router.get('/cart/total', getCartItemsTotal);
router.get('/cart/count', getCartItemCount);


export default router
