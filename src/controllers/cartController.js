import { getShoppingCart, addToCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, getCartItemCount } from '../models/cartModel.js';

import { getAllProducts } from "../models/productModel.js";

// shopping cart controller
const shoppingCart = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        
        // 1. Fetch the user's cart
        const cart = await getShoppingCart(userId);
        
        // 2. Fetch all products available to add to the cart
        const products = await getAllProducts();
        
        // 3. Render the page passing BOTH arrays to Handlebars!
        res.render("cart_page", { pageName: "Cart", cart, products });
    } catch (error) {
        res.status(500).send(`Error loading cart page: ${error}`);
    }
};

export { shoppingCart };