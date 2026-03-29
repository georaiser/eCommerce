import express from 'express';
import { shoppingCart, addProductToCart, updateCartItemQuantity, removeCartItem, clearCartItems, getCartItemsTotal, getCartItemCount, checkoutCart, orderHistoryPage } from '../../controllers/ORM/cartController.js';

const router = express.Router();

router.get('/cart', shoppingCart);
router.post('/cart', addProductToCart);
router.put('/cart/:id', updateCartItemQuantity);
router.delete('/cart/:id', removeCartItem);
router.delete('/cart', clearCartItems);
router.post('/cart/checkout', checkoutCart);
router.get('/cart/total', getCartItemsTotal);
router.get('/cart/count', getCartItemCount);
router.get('/cart/history', orderHistoryPage);

export default router;
