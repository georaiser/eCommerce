import express from 'express';

// import cart controller functions
import { shoppingCart, addProductToCart, updateCartItemQuantity, removeCartItem, clearCartItems, getCartItemsTotal, getCartItemCount, checkoutCart } from '../controllers/cartController.js';

const router = express.Router();

// Routes
router.get('/cart', shoppingCart);
router.post('/cart', addProductToCart);
router.post('/cart/checkout', checkoutCart);
router.put('/cart/:id', updateCartItemQuantity);
router.delete('/cart/:id', removeCartItem);
router.delete('/cart', clearCartItems);
router.get('/cart/total', getCartItemsTotal);
router.get('/cart/count', getCartItemCount);


export default router
