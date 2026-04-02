import express from 'express';

// import cart controller functions
import { shoppingCart, addProductToCart, updateCartItemQuantity, removeCartItem, clearCartItems, getCartItemsTotal, getCartItemCount, checkoutCart, orderHistoryPage } from '../../controllers/SQL/cartController.js';
import { requireAuth, preventAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Enforce identity verification across all cart operations natively:
router.use(requireAuth);

// Routes
router.get('/cart', preventAdmin, shoppingCart);
router.get('/cart/history', orderHistoryPage);
router.post('/cart', preventAdmin, addProductToCart);
router.post('/cart/checkout', preventAdmin, checkoutCart);
router.put('/cart/:id', preventAdmin, updateCartItemQuantity);
router.delete('/cart/:id', preventAdmin, removeCartItem);
router.delete('/cart', preventAdmin, clearCartItems);
router.get('/cart/total', preventAdmin, getCartItemsTotal);
router.get('/cart/count', preventAdmin, getCartItemCount);


export default router
