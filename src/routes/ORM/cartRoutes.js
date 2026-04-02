import express from 'express';
import { shoppingCart, addProductToCart, updateCartItemQuantity, removeCartItem, clearCartItems, getCartItemsTotal, getCartItemCount, checkoutCart, orderHistoryPage } from '../../controllers/ORM/cartController.js';
import { requireAuth, preventAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/cart', preventAdmin, shoppingCart);
router.post('/cart', preventAdmin, addProductToCart);
router.put('/cart/:id', preventAdmin, updateCartItemQuantity);
router.delete('/cart/:id', preventAdmin, removeCartItem);
router.delete('/cart', preventAdmin, clearCartItems);
router.post('/cart/checkout', preventAdmin, checkoutCart);
router.get('/cart/total', preventAdmin, getCartItemsTotal);
router.get('/cart/count', preventAdmin, getCartItemCount);
router.get('/cart/history', orderHistoryPage);

export default router;
