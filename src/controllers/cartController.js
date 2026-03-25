import { getShoppingCart, addToCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } from '../models/cartModel.js';

import { getAllProducts } from "../models/productModel.js";

// GET products list and shopping cart
const shoppingCart = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        
        // 1. Fetch the user's cart
        const cart = await getShoppingCart(userId);
        
        // 2. Fetch all products available to add to the cart
        const products = await getAllProducts();
        
        // 3. Fetch the Grand Total of the entire cart!
        const totalResult = await getCartTotal(userId);
        const cartTotal = totalResult[0]?.total || 0;

        // 4. Render the page passing all data to Handlebars!
        res.render("cart_page", { pageName: "Cart", cart, products, cartTotal });
    } catch (error) {
        res.status(500).send(`Error loading cart page: ${error}`);
    }
};

// POST /cart - add product to cart
const addProductToCart = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        const { productId, quantity } = req.body;
        
        // Add product to cart
        const cartItem = await addToCart(userId, productId, quantity); // from cartModel.js
        res.send(`Product ${productId} Quantity ${quantity} added successfully!`);
    } catch (error) {
        // '23505' is the official PostgreSQL error code for unique_violation
        if (error.code === '23505') {
            res.status(409).send("Product is already in your cart!");
        } else {
            console.error("Cart Add Error:", error);
            res.status(500).send(`Error adding product to cart`);
        }
    }
};

// PUT /cart/:id - update product quantity in cart
const updateCartItemQuantity = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        const { id } = req.params;
        const { quantity } = req.body;
        
        // Update product quantity in cart
        const cartItem = await updateCartQuantity(userId, id, quantity); // from cartModel.js
        res.send(`Product ${id} Quantity ${quantity} updated successfully!`);
    } catch (error) {
        res.status(500).send(`Error updating product quantity in cart: ${error}`);
    }
};

// DELETE /cart/:id - remove product from cart
const removeCartItem = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        const { id } = req.params;
        
        // Remove product from cart
        const cartItem = await removeFromCart(userId, id); // from cartModel.js
        res.send(`Product ${id} removed successfully!`);
    } catch (error) {
        res.status(500).send(`Error removing product from cart: ${error}`);
    }
};

// DELETE /cart - clear cart
const clearCartItems = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        
        // Clear cart
        const cartItem = await clearCart(userId); // from cartModel.js
        res.send(`Cart cleared successfully!`);
    } catch (error) {
        res.status(500).send(`Error clearing cart: ${error}`);
    }
};

// GET /cart/total - get cart total
const getCartItemsTotal = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        
        // Get cart total
        const cartItem = await getCartTotal(userId); // from cartModel.js
        res.send(`Cart total: ${cartItem}`);
    } catch (error) {
        res.status(500).send(`Error getting cart total: ${error}`);
    }
};

// GET /cart/count - get cart item count
const getCartItemCount = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        
        // Get cart item count
        const cartItem = await getCartCount(userId); // from cartModel.js
        res.send(`Cart item count: ${cartItem}`);
    } catch (error) {
        res.status(500).send(`Error getting cart item count: ${error}`);
    }
};

export { shoppingCart, addProductToCart, updateCartItemQuantity, removeCartItem, clearCartItems, getCartItemsTotal, getCartItemCount };