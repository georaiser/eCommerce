import { getShoppingCart, addToCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, getCartItemCount } from '../models/cartModel.js';

// shopping cart controller
const shoppingCart = async (req, res) => {
    try {
        //const {userId} = req.params;
        const userId = 1; // hardcoded for now
        const cart = await getShoppingCart(userId);
        
        console.log("Cart:", cart); //debug log

        res.render("cart_page", { pageName: "Cart", cart });
    } catch (error) {
        res.status(500).send(`Error getting cart: ${error}`);
    }
};

export { shoppingCart };