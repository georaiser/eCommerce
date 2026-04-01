import express from 'express';

// import cart controller functions
import { shoppingCart, addProductToCart, updateCartItemQuantity, removeCartItem, clearCartItems, getCartItemsTotal, getCartItemCount, checkoutCart, orderHistoryPage } from '../../controllers/SQL/cartController.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

// Enforce identity verification across all cart operations natively:
router.use(requireAuth);

// Routes
router.get('/cart', shoppingCart);
router.get('/cart/history', orderHistoryPage);
router.post('/cart', addProductToCart);
router.post('/cart/checkout', checkoutCart);
router.put('/cart/:id', updateCartItemQuantity);
router.delete('/cart/:id', removeCartItem);
router.delete('/cart', clearCartItems);
router.get('/cart/total', getCartItemsTotal);
router.get('/cart/count', getCartItemCount);


export default router
