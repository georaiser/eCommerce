import { getShoppingCart, addToCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, getCartItemCount } from '../models/cartModel.js';

// shopping cart controller
const shoppingCart = async (req, res) => {
    try {
        const {userId} = req.params;
        const cart = await getShoppingCart(userId);
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};  

export { shoppingCart };